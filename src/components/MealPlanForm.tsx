import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MealPlanFormProps {
  onSubmit: (formData: FormData) => void;
}

export default function MealPlanForm({ onSubmit }: MealPlanFormProps) {
  const [likedFoods, setLikedFoods] = useState<string[]>([]);
  const [dislikedFoods, setDislikedFoods] = useState<string[]>([]);

  const { toast } = useToast();

  const handleFoodInput = (
    event: React.KeyboardEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (event.key === "," || event.key === "Enter") {
      event.preventDefault();
      const value = event.currentTarget.value.trim();
      if (value) {
        if (value.length > 50) {
          toast({
            title: "Input too long",
            description: "Food items should be less than 50 characters.",
            variant: "destructive",
          });
          return;
        }
        setter((prev) => [...prev, value]);
        event.currentTarget.value = "";
      }
    }
  };

  const removeFood = (
    index: number,
    foods: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(foods.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Validate number of days
    const numDays = parseInt(formData.get("numDays") as string);
    if (isNaN(numDays) || numDays < 1 || numDays > 7) {
      toast({
        title: "Invalid input",
        description: "Number of days must be between 1 and 7.",
        variant: "destructive",
      });
      return;
    }

    // Validate height and weight
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
      toast({
        title: "Invalid input",
        description:
          "Please enter valid height (36-96 inches) and weight (50-500 lbs).",
        variant: "destructive",
      });
      return;
    }

    // Validate goal
    const goal = formData.get("goal") as string;
    if (goal.length < 5 || goal.length > 200) {
      toast({
        title: "Invalid input",
        description: "Goal should be between 5 and 200 characters.",
        variant: "destructive",
      });
      return;
    }

    // Add liked and disliked foods to the form data
    formData.set("likedFoods", JSON.stringify(likedFoods));
    formData.set("dislikedFoods", JSON.stringify(dislikedFoods));

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="numDays" className="block text-sm font-medium">
          Number of Days (1-7)
        </label>
        <input
          type="number"
          id="numDays"
          name="numDays"
          min="1"
          max="7"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="likedFoods" className="block text-sm font-medium">
          Foods You Like
        </label>
        <div className="mt-1 flex flex-wrap gap-2">
          {likedFoods.map((food, index) => (
            <span
              key={index}
              className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center"
            >
              {food}
              <button
                type="button"
                onClick={() => removeFood(index, likedFoods, setLikedFoods)}
                className="ml-1 text-xs"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          id="likedFoods"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          onKeyDown={(e) => handleFoodInput(e, setLikedFoods)}
          placeholder="Type and press comma or enter to add"
        />
      </div>
      <div>
        <label htmlFor="dislikedFoods" className="block text-sm font-medium">
          Foods You Dislike
        </label>
        <div className="mt-1 flex flex-wrap gap-2">
          {dislikedFoods.map((food, index) => (
            <span
              key={index}
              className="bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-sm flex items-center"
            >
              {food}
              <button
                type="button"
                onClick={() =>
                  removeFood(index, dislikedFoods, setDislikedFoods)
                }
                className="ml-1 text-xs"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          id="dislikedFoods"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          onKeyDown={(e) => handleFoodInput(e, setDislikedFoods)}
          placeholder="Type and press comma or enter to add"
        />
      </div>
      <div>
        <label htmlFor="height" className="block text-sm font-medium">
          Height (inches)
        </label>
        <input
          type="number"
          id="height"
          name="height"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="weight" className="block text-sm font-medium">
          Weight (lbs)
        </label>
        <input
          type="number"
          id="weight"
          name="weight"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="goal" className="block text-sm font-medium">
          Goal
        </label>
        <textarea
          id="goal"
          name="goal"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          required
        ></textarea>
      </div>
      <Button type="submit" className="w-full">
        Generate Meal Plan
      </Button>
    </form>
  );
}
