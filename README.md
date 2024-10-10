# AI Meal Planner

AI Meal Planner is a Next.js application that generates personalized meal plans using AI. It takes into account user preferences, dietary restrictions, and health goals to create customized meal plans.

## Features

- Personalized meal plan generation
- User-friendly interface for inputting preferences
- Support for liked and disliked foods
- Consideration of user's height, weight, and health goals
- Dark mode support
- Responsive design

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Radix UI
- Lucide React (for icons)
- OpenAI API (for AI-powered meal plan generation)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/ai-meal-planner.git
   cd ai-meal-planner
   ```

2. Install dependencies:

   ```
   npm install
   ```

   or

   ```
   yarn install
   ```

3. Create a `.env` file in the root directory and add your OpenAI API key:

   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Run the development server:

   ```
   npm run dev
   ```

   or

   ```
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. On the home page, click the "Build Plan" button.
2. Fill out the form with your preferences:
   - Number of days for the meal plan
   - Foods you like and dislike
   - Your height and weight
   - Your health goal
3. Click "Generate Meal Plan" to create your personalized plan.
4. View your generated meal plan, which includes breakfast, lunch, and dinner for each day.

## Project Structure

- `src/app`: Contains the main application pages and API routes
- `src/components`: Reusable React components
- `src/lib`: Utility functions and custom hooks
- `src/hooks`: Custom React hooks

### Key Components

- `MealPlanForm`: Handles user input for meal plan preferences
- `LoadingScreen`: Displays while the meal plan is being generated
- `ThemeToggle`: Allows users to switch between light and dark modes

### API Routes

- `/api/generate-meal-plan`: Generates a meal plan based on user input
- `/api/meal-plan/[id]`: Retrieves a specific meal plan by ID

## Styling

The project uses Tailwind CSS for styling, with custom theme configuration in `tailwind.config.ts` and `globals.css`.

## Deployment

This project is ready to be deployed on Vercel. For other platforms, please refer to the Next.js deployment documentation.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
