import { PROJECT_TITLE } from "~/lib/constants";

export const dynamic = "force-dynamic";

export function POST() {
  // Hardcoded first question
  const question = {
    text: "What is the capital of France?",
    options: ["London", "Paris", "Berlin", "Madrid"],
    correctIndex: 1 // Paris is correct
  };

  return new Response(JSON.stringify({
    frame: (
      <div className="w-full p-4">
        <h1 className="text-2xl font-bold mb-4">{PROJECT_TITLE}</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-lg mb-4">{question.text}</p>
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <button 
                key={index}
                className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded"
                onclick={`answer(${index})`}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    ),
    buttons: question.options.map((_, index) => ({
      label: `${String.fromCharCode(65 + index)}`,
      action: "post",
      target: `/api/answer?index=${index}`
    }))
  }), {
    headers: {
      "Content-Type": "application/json"
    }
  });
}
