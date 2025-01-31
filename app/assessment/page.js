"use client";
import React, { useState } from "react";

// Sample questions data
const sampleQuestions = [
  {
    question: "What is the primary purpose of React's useEffect hook?",
    options: [
      "To handle side effects in functional components",
      "To create new components",
      "To style components",
      "To handle routing",
    ],
    correctAnswer: "To handle side effects in functional components",
  },
  {
    question:
      "Which of the following is NOT a valid way to create a React component?",
    options: [
      "Using a function that returns JSX",
      "Using an arrow function",
      "Using the React.component class",
      "Using a regular JavaScript object",
    ],
    correctAnswer: "Using a regular JavaScript object",
  },
  {
    question: "What is the purpose of the 'key' prop in React lists?",
    options: [
      "To style list items differently",
      "To help React track items for efficient updates",
      "To make items clickable",
      "To set the order of items",
    ],
    correctAnswer: "To help React track items for efficient updates",
  },
  {
    question: "What is the Virtual DOM in React?",
    options: [
      "A direct copy of the browser's DOM",
      "A lightweight copy of the DOM for performance optimization",
      "A debugging tool",
      "A routing system",
    ],
    correctAnswer: "A lightweight copy of the DOM for performance optimization",
  },
  {
    question:
      "Which hook is used to manage local state in React functional components?",
    options: ["useLocal", "useEffect", "useState", "useContext"],
    correctAnswer: "useState",
  },
];

const SkillTest = ({ onTestComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleAnswer = (answer) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    Object.keys(answers).forEach((questionIndex) => {
      if (
        answers[questionIndex] === sampleQuestions[questionIndex].correctAnswer
      ) {
        correct++;
      }
    });
    return (correct / sampleQuestions.length) * 100;
  };

  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const finalScore = calculateScore();
      setScore(finalScore);
      setIsComplete(true);
      onTestComplete?.(finalScore);
    }
  };

  if (isComplete) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Test Complete!</h2>
          <div className="mb-6">
            <p className="text-lg font-semibold">
              Your score: {score.toFixed(2)}%
            </p>
            <p className="text-sm text-gray-600">
              (
              {
                Object.values(answers).filter(
                  (answer, index) =>
                    answer === sampleQuestions[index].correctAnswer
                ).length
              }{" "}
              out of {sampleQuestions.length} correct)
            </p>
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-semibold">Detailed Review:</h3>
            {sampleQuestions.map((q, index) => {
              const isCorrect = answers[index] === q.correctAnswer;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    isCorrect
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <p className="font-medium mb-2">
                    Question {index + 1}: {q.question}
                  </p>
                  <div className="ml-4 space-y-1">
                    <p className="text-gray-700">
                      Your answer:
                      <span
                        className={
                          isCorrect
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        {" "}
                        {answers[index] || "No answer provided"}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-green-600 font-medium">
                        Correct answer: {q.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Take Test Again
          </button>
        </div>
      </div>
    );
  }

  const currentQ = sampleQuestions[currentQuestion];

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-lg">
      <div className="p-6">
        <div className="mb-6">
          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {sampleQuestions.length}
          </span>
        </div>

        <h2 className="text-xl font-semibold mb-4">{currentQ.question}</h2>

        <div className="space-y-4">
          {currentQ.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`option-${index}`}
                name="question-option"
                value={option}
                checked={answers[currentQuestion] === option}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor={`option-${index}`}
                className="text-sm font-medium text-gray-900 ml-2 cursor-pointer"
              >
                {option}
              </label>
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!answers[currentQuestion]}
          className={`mt-6 px-4 py-2 rounded-md text-white font-medium
            ${
              answers[currentQuestion]
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }
          `}
        >
          {currentQuestion === sampleQuestions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default SkillTest;
