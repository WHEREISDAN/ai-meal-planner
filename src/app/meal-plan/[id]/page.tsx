"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import { Skeleton } from "../../../components/ui/skeleton";
import { AlertCircle, UtensilsCrossed, ArrowLeft } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../components/ui/alert";
import { Button } from "../../../components/ui/button";

interface Meal {
  name?: string;
  ingredients?: string[];
  instructions?: string[] | string;
}

interface DayPlan {
  [key: string]: Meal;
}

interface MealPlan {
  [key: string]: DayPlan;
}

export default function MealPlanPage() {
  const { id } = useParams();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const response = await fetch(`/api/meal-plan/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMealPlan(data.mealPlan);
      } catch (e) {
        console.error("Failed to fetch meal plan:", e);
        setError("Failed to fetch meal plan. Please try again later.");
      }
    };

    fetchMealPlan();
  }, [id]);

  const renderInstructions = (instructions?: string[] | string) => {
    if (Array.isArray(instructions)) {
      return (
        <ol className="list-decimal list-inside space-y-1">
          {instructions.map((instruction, i) => (
            <li key={i}>{instruction}</li>
          ))}
        </ol>
      );
    } else if (typeof instructions === "string") {
      return <p>{instructions}</p>;
    } else {
      return (
        <p className="text-muted-foreground">No instructions available.</p>
      );
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!mealPlan) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4" />
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Button
        variant="ghost"
        size="icon"
        className="mb-4"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="h-6 w-6" />
        <span className="sr-only">Back to Home</span>
      </Button>

      <h1 className="text-4xl font-bold mb-8 text-center">
        Your Customized Meal Plan
      </h1>

      <Accordion type="single" collapsible className="space-y-4">
        {Object.entries(mealPlan).map(([day, dayPlan], index) => (
          <AccordionItem key={index} value={`day-${index}`}>
            <AccordionTrigger className="text-2xl font-semibold">
              {day}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(dayPlan).map(([mealType, meal], mealIndex) => (
                  <Card key={mealIndex}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="capitalize">{mealType}</span>
                        <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-xl font-medium mb-2">
                        {meal.name || "Unnamed Meal"}
                      </h3>
                      <h4 className="text-lg font-medium mb-2">Ingredients:</h4>
                      {meal.ingredients && meal.ingredients.length > 0 ? (
                        <ul className="list-disc list-inside mb-4 space-y-1">
                          {meal.ingredients.map((ingredient, i) => (
                            <li key={i}>{ingredient}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">
                          No ingredients listed.
                        </p>
                      )}
                      <h4 className="text-lg font-medium mb-2">
                        Instructions:
                      </h4>
                      {renderInstructions(meal.instructions)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
