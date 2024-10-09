import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { headers } from "next/headers";

interface Meal {
  name: string;
  ingredients: string[];
  instructions: string | string[];
}

interface DayPlan {
  Breakfast: Meal;
  Lunch: Meal;
  Dinner: Meal;
}

interface MealPlan {
  [key: string]: DayPlan;
}

function validateMealPlan(data: any): data is MealPlan {
  if (typeof data !== "object" || data === null) return false;

  for (const [day, dayPlan] of Object.entries(data)) {
    if (!day.startsWith("Day ")) return false;
    if (typeof dayPlan !== "object" || dayPlan === null) return false;

    const meals = ["Breakfast", "Lunch", "Dinner"] as const;
    for (const meal of meals) {
      if (!dayPlan.hasOwnProperty(meal)) return false;
      const mealData = (dayPlan as Record<typeof meal, Meal>)[meal];
      if (typeof mealData !== "object" || mealData === null) return false;
      if (typeof mealData.name !== "string") return false;
      if (!Array.isArray(mealData.ingredients)) return false;
      if (
        typeof mealData.instructions !== "string" &&
        !Array.isArray(mealData.instructions)
      )
        return false;
    }
  }

  return true;
}

export async function POST(request: Request) {
  const ip = headers().get("x-forwarded-for") ?? "unknown";
  const rateLimitResult = await rateLimit(ip);
  if (rateLimitResult) return rateLimitResult;

  try {
    // Dynamically import OpenAI
    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const formData = await request.formData();

    // Server-side validation
    const numDays = parseInt(formData.get("numDays") as string);
    if (isNaN(numDays) || numDays < 1 || numDays > 7) {
      return NextResponse.json(
        { error: "Invalid number of days" },
        { status: 400 }
      );
    }

    const likedFoods = JSON.parse(
      (formData.get("likedFoods") as string) || "[]"
    );
    const dislikedFoods = JSON.parse(
      (formData.get("dislikedFoods") as string) || "[]"
    );

    if (
      !Array.isArray(likedFoods) ||
      !Array.isArray(dislikedFoods) ||
      likedFoods.some((food) => typeof food !== "string" || food.length > 50) ||
      dislikedFoods.some((food) => typeof food !== "string" || food.length > 50)
    ) {
      return NextResponse.json(
        { error: "Invalid food preferences" },
        { status: 400 }
      );
    }

    const height = parseInt(formData.get("height") as string);
    const weight = parseInt(formData.get("weight") as string);
    if (
      isNaN(height) ||
      height < 36 ||
      height > 96 ||
      isNaN(weight) ||
      weight < 50 ||
      weight > 500
    ) {
      return NextResponse.json(
        { error: "Invalid height or weight" },
        { status: 400 }
      );
    }

    const goal = formData.get("goal") as string;
    if (typeof goal !== "string" || goal.length < 5 || goal.length > 200) {
      return NextResponse.json({ error: "Invalid goal" }, { status: 400 });
    }

    // Debug show all the data
    console.log("numDays", numDays);
    console.log("likedFoods", likedFoods);
    console.log("dislikedFoods", dislikedFoods);
    console.log("height", height);
    console.log("weight", weight);
    console.log("goal", goal);

    const prompt = `You are an expert meal planner. Create a personalized meal plan based on the following parameters:
    {
      "numDays": ${numDays},
      "likedFoods": [${likedFoods
        .map((food: string) => `"${food}"`)
        .join(", ")}],
      "dislikedFoods": [${dislikedFoods
        .map((food: string) => `"${food}"`)
        .join(", ")}],
      "height": ${height},
      "weight": ${weight},
      "goal": "${goal}"
    }
    IMPORTANT:
    - Use the liked foods as inspiration for meal ideas, but meals don't need to only include those foods. Feel free to suggest neutral foods that are not listed in either the liked or disliked categories.
    - STRICTLY AVOID any ingredients from the disliked foods list.
    - If the liked foods list is empty, feel free to choose commonly enjoyed or neutral foods, but ensure disliked foods are not included.

    The goal is to generate a balanced meal plan that aligns with the user's dietary preferences and goals. The response must be structured as a JSON object with the following format:

    {
      "Day 1": {
        "Breakfast": {
          "name": "Meal Name",
          "ingredients": ["Ingredient 1", "Ingredient 2", ...],
          "instructions": "Cooking instructions as a single string or an array of steps"
        },
        "Lunch": { ... },
        "Dinner": { ... }
      },
      "Day 2": { ... },
      ...
    }

    Each day should include three meals: "Breakfast", "Lunch", and "Dinner". Each meal should have a name, a list of ingredients, and preparation instructions (either as a single string or an array of steps). Ensure the response is in valid JSON format, without additional commentary. DO NOT format the JSON in markdown.`;

    console.log("Sending request to OpenAI...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    console.log("Received response from OpenAI");
    const mealPlanContent = completion.choices[0].message.content;
    if (!mealPlanContent) {
      throw new Error("No content received from OpenAI");
    }

    let mealPlanData: any;
    try {
      mealPlanData = JSON.parse(mealPlanContent);
    } catch (error) {
      console.error("Failed to parse OpenAI response:", error);
      console.log("Raw OpenAI response:", mealPlanContent);
      return NextResponse.json(
        { error: "Failed to generate meal plan. Please try again." },
        { status: 500 }
      );
    }

    if (!validateMealPlan(mealPlanData)) {
      console.error("Invalid meal plan structure:", mealPlanData);
      return NextResponse.json(
        { error: "Generated meal plan is invalid. Please try again." },
        { status: 500 }
      );
    }

    const id = Date.now().toString(); // Generate a unique ID for the meal plan

    // Save the meal plan
    await fetch(`${request.url}/../meal-plan/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mealPlan: mealPlanData }),
    });

    return NextResponse.json({ id, mealPlan: mealPlanData });
  } catch (error) {
    console.error("Error generating meal plan:", error);
    return NextResponse.json(
      {
        error: "Failed to generate meal plan. Please try again.",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
