import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-lg text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">
          Generating Your Meal Plan
        </h2>
        <p className="text-muted-foreground">This may take a few moments...</p>
      </div>
    </div>
  );
}
