"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import QuestionService from '@/services/questionService';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

const SkillTest = () => {
  const searchParams = useSearchParams();
  const skill = searchParams.get('skill');

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const fetchedQuestions = await QuestionService.fetchQuestions(skill);
        setQuestions(fetchedQuestions);
      } catch (error) {
        setError(error.message);
        console.error('Failed to load questions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (skill) {
      loadQuestions();
    }
  }, [skill]);

  const handleAnswer = (answer) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: answer }));
  };

  const calculateScore = () => {
    let correct = Object.keys(answers).filter(
      (i) => answers[i] === questions[i].correctAnswer
    ).length;
    return (correct / questions.length) * 100;
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const finalScore = calculateScore();
      setScore(finalScore);
      setIsComplete(true);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setScore(null);
    setIsComplete(false);
  };

  const handleBackToProfile = () => {
    try {
      // Save to localStorage before navigating
      const testResults = JSON.parse(localStorage.getItem('testResults') || '{}');
      testResults[skill] = score;
      localStorage.setItem('testResults', JSON.stringify(testResults));
      
      // Navigate to profile
      window.location.href = '/profile';
    } catch (error) {
      console.error('Error saving test results:', error);
      window.location.href = '/profile';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        <div className="text-white text-xl">
          Generating {skill} assessment...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-[#161B22] rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-500 text-xl mb-4">
            Error: {error}
          </div>
          <button
            onClick={handleBackToProfile}
            className="px-4 py-2 bg-[#30363D] text-white rounded-lg hover:opacity-90"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-[#161B22] rounded-lg shadow-lg p-6 text-center">
          <div className="text-white text-xl mb-4">
            No questions available for {skill}
          </div>
          <button
            onClick={handleBackToProfile}
            className="px-4 py-2 bg-[#30363D] text-white rounded-lg hover:opacity-90"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-[#161B22] rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Assessment Complete!</h2>
          <div className="mb-6 p-4 rounded-lg bg-opacity-10 bg-white">
            <p className="text-lg text-gray-300">Skill: {skill}</p>
            <p className="text-2xl font-bold text-white">Score: {score.toFixed(2)}%</p>
          </div>

          <div className="space-y-6">
            {questions.map((q, index) => {
              const isCorrect = answers[index] === q.correctAnswer;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    isCorrect ? "border-green-500" : "border-red-500"
                  }`}
                >
                  <p className="text-white font-medium mb-2">{q.question}</p>
                  <p className={isCorrect ? "text-green-400" : "text-red-400"}>
                    Your answer: {answers[index] || "No answer provided"}
                  </p>
                  {!isCorrect && (
                    <p className="text-green-400">
                      Correct answer: {q.correctAnswer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleRetake}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white rounded-lg hover:opacity-90"
            >
              Retake Assessment
            </button>
            <button
              onClick={handleBackToProfile}
              className="flex-1 px-4 py-2 bg-[#30363D] text-white rounded-lg hover:opacity-90"
            >
              Back to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-[#161B22] rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <p className="text-gray-400">Assessment: {skill}</p>
        </div>
        
        <div className="mb-6 w-full bg-gray-700 h-2 rounded-full">
          <div 
            className="bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <h2
          className="text-xl text-white font-semibold mb-4"
          dangerouslySetInnerHTML={{ __html: md.render(questions[currentQuestion].question) }}
        />

        <div className="space-y-4">
          {questions[currentQuestion].options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 p-3 rounded-lg transition-colors duration-200
                ${answers[currentQuestion] === option 
                  ? 'bg-[#21262D] border border-[#E31D65]' 
                  : 'hover:bg-[#21262D] border border-transparent'
                } cursor-pointer`}
              onClick={() => handleAnswer(option)}
            >
              <input
                type="radio"
                id={`option-${index}`}
                name="question-option"
                value={option}
                checked={answers[currentQuestion] === option}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-4 h-4 text-[#E31D65] bg-gray-100 border-gray-300 focus:ring-[#E31D65]"
              />
              <label
                htmlFor={`option-${index}`}
                className="text-sm font-medium text-gray-300 cursor-pointer flex-1"
                dangerouslySetInnerHTML={{ __html: md.render(option) }}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!answers[currentQuestion]}
          className={`mt-6 w-full px-4 py-2 rounded-lg text-white font-medium transition-all duration-200
            ${
              answers[currentQuestion]
                ? "bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90"
                : "bg-gray-500 cursor-not-allowed"
            }`}
        >
          {currentQuestion === questions.length - 1 ? "Finish Assessment" : "Next Question"}
        </button>
      </div>
    </div>
  );
};

export default SkillTest;