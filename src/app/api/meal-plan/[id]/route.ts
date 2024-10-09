import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { headers } from "next/headers";

// In a real application, you would fetch this data from a database
const mealPlans: { [key: string]: any } = {};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const ip = headers().get("x-forwarded-for") ?? "unknown";
  const rateLimitResult = await rateLimit(ip);
  if (rateLimitResult) return rateLimitResult;

  try {
    const id = params.id;

    // In a real application, you would fetch the meal plan from a database
    const mealPlan = mealPlans[id];

    if (!mealPlan) {
      return NextResponse.json(
        { error: "Meal plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ mealPlan });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const ip = headers().get("x-forwarded-for") ?? "unknown";
  const rateLimitResult = await rateLimit(ip);
  if (rateLimitResult) return rateLimitResult;

  try {
    const id = params.id;
    const body = await request.json();

    // In a real application, you would save this to a database
    mealPlans[id] = body.mealPlan;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
