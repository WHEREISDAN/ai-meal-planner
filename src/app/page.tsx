"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import MealPlanForm from "@/components/MealPlanForm";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setIsOpen(false);
    try {
      const response = await fetch("/api/generate-meal-plan", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/meal-plan/${data.id}`);
      } else {
        toast({
          title: "Error",
          description:
            data.error || "Failed to generate meal plan. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating meal plan:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary">
      <h1 className="text-4xl font-bold mb-8">AI Meal Planner</h1>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="text-lg">
            <Utensils className="mr-2 h-5 w-5" />
            Build Plan
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Your Meal Plan</DialogTitle>
          </DialogHeader>
          <MealPlanForm onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
      {isLoading && <LoadingScreen />}
    </div>
  );
}
