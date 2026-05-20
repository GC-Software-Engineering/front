"use client";
import { useState } from "react";

export default function StepCalories() {
  const [steps, setSteps] = useState<number>(0);

  // 1 step ≈ 0.04 kcal
  const calories = steps * 0.04;

  let message = "";
  if (steps < 3000) message = "😴 Low activity";
  else if (steps < 8000) message = "🙂 Normal activity";
  else message = "🔥 Active day";

  return (
    <div className="bg-white p-5 rounded-2xl shadow border">
      <h2 className="text-lg font-semibold mb-3">
        Daily Step Tracker
      </h2>

      <input
        type="number"
        placeholder="Enter your steps..."
        className="w-full border p-2 rounded-lg mb-3"
        onChange={(e) => setSteps(Number(e.target.value))}
      />

      <p className="text-blue-600 font-semibold">
        🔥 Calories burned: {calories.toFixed(2)} kcal
      </p>

      <p className="text-sm text-gray-500 mt-1">
        {message}
      </p>
    </div>
  );
}