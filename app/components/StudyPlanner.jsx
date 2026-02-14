"use client";
import { useState } from "react";

export default function StudyPlanner() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generatePlan = () => {
    if (!topic) return;
    setIsLoading(true);

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5-nano",
        messages: [
          {
            role: "system",
            content:
              "You are an expert AI Study Planner that creates structured, easy-to-follow study schedules.",
          },
          {
            role: "user",
            content: `Create a study plan for this subject or goal: ${topic}`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "study_planner_output",
            schema: {
              type: "object",
              properties: {
                study_goal: {
                  type: "string",
                  description: "Main study goal summary",
                },
                daily_plan: {
                  type: "string",
                  description: "Daily study schedule in short steps",
                },
                weekly_targets: {
                  type: "string",
                  description: "Weekly learning targets",
                },
                resources: {
                  type: "string",
                  description:
                    "Recommended study resources separated by commas",
                },
                motivation_tip: {
                  type: "string",
                  description: "Motivation or productivity tip",
                },
              },
              required: [
                "study_goal",
                "daily_plan",
                "weekly_targets",
                "resources",
                "motivation_tip",
              ],
            },
          },
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const parsed = JSON.parse(data.choices[0].message.content);
        setResult(parsed);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-indigo-500 p-8 rounded-2xl w-full max-w-3xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-4 text-black">
          AI Study Planner
        </h1>

        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter your topics..."
          className="w-full p-4 border rounded-xl mb-4 text-gray-800 font-bold"
        />

        <button
          onClick={generatePlan}
          className="w-full py-3 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold"
        >
          Generate Study Plan
        </button>

        {isLoading && (
          <p className="text-center mt-4 text-black animate-pulse">
            Creating study plan...
          </p>
        )}

        {result && (
          <div className="mt-6 space-y-4 bg-white p-6 rounded-xl text-gray-700">
            <div>
              <h3 className="font-semibold text-indigo-600">Study Goal</h3>
              <p className="font-bold text-lg">{result.study_goal}</p>
            </div>

            <div>
              <h3 className="font-semibold text-red-600">Daily Plan</h3>
              <p>{result.daily_plan}</p>
            </div>

            <div>
              <h3 className="font-semibold text-green-600">Weekly Targets</h3>
              <p>{result.weekly_targets}</p>
            </div>

            <div>
              <h3 className="font-semibold text-purple-600">Resources</h3>
              <p>{result.resources}</p>
            </div>

            <div>
              <h3 className="font-semibold text-yellow-600">Motivation Tip</h3>
              <p className="font-bold">{result.motivation_tip}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
