import { PROJECT_TITLE } from "~/lib/constants";
import React from "react";

export const dynamic = "force-dynamic";

export function POST() {
  // Hardcoded first question
  const question = {
    text: "What is the capital of France?",
    options: ["London", "Paris", "Berlin", "Madrid"],
    correctIndex: 1 // Paris is correct
  };

  // Use React.createElement instead of JSX
  const frame = React.createElement(
    "div",
    { className: "w-full p-4" },
    React.createElement(
      "h1",
      { className: "text-2xl font-bold mb-4" },
      PROJECT_TITLE
    ),
    React.createElement(
      "div",
      { className: "bg-white rounded-lg shadow-lg p-6" },
      React.createElement("p", { className: "text-lg mb-4" }, question.text),
      React.createElement(
        "div",
        { className: "grid grid-cols-2 gap-4" },
        question.options.map((option, index) =>
          React.createElement(
            "button",
            {
              key: index,
              className: "bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded"
            },
            `${String.fromCharCode(65 + index)}. ${option}`
          )
        )
      )
    )
  );

  return new Response(JSON.stringify({
    frame: `
      <div class="w-full p-4">
        <h1 class="text-2xl font-bold mb-4">${PROJECT_TITLE}</h1>
        <div class="bg-white rounded-lg shadow-lg p-6">
          <p class="text-lg mb-4">${question.text}</p>
          <div class="grid grid-cols-2 gap-3">
            ${question.options.map((option, index) => `
              <button class="bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded text-sm">
                ${String.fromCharCode(65 + index)}. ${option}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `,
    buttons: [
      { label: "A", action: "post" },
      { label: "B", action: "post" },
      { label: "C", action: "post" },
      { label: "D", action: "post" }
    ],
    question: {
      text: "What is the capital of France?",
      options: ["London", "Paris", "Berlin", "Madrid"],
      correctIndex: 1
    },
    buttons: [
      { label: "A", action: "post", target: "/api/answer?index=0" },
      { label: "B", action: "post", target: "/api/answer?index=1" },
      { label: "C", action: "post", target: "/api/answer?index=2" },
      { label: "D", action: "post", target: "/api/answer?index=3" }
    ]
  }), {
    headers: {
      "Content-Type": "application/json"
    }
  });
}
