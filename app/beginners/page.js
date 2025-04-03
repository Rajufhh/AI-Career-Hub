"use client";

import React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MarkdownIt from "markdown-it";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Loader2,
  ArrowRight,
  Star,
  BarChart,
  FileText,
  Heart,
  User,
  Coffee,
  Gift,
  Briefcase,
} from "lucide-react";

const md = new MarkdownIt();

// Assessment categories with their icons and descriptions
const ASSESSMENT_CATEGORIES = [
  {
    id: "aptitude",
    name: "Aptitude & Interests",
    icon: <Gift className="w-6 h-6" />,
    description:
      "Discover your natural talents and what activities energize you",
  },
  {
    id: "competency",
    name: "Core Competencies",
    icon: <BarChart className="w-6 h-6" />,
    description:
      "Evaluate your reasoning, communication, and problem-solving skills",
  },
  {
    id: "values",
    name: "Values & Priorities",
    icon: <Heart className="w-6 h-6" />,
    description: "Identify what matters most to you in your future career",
  },
  {
    id: "self",
    name: "Self-Perception",
    icon: <User className="w-6 h-6" />,
    description: "Reflect on your strengths and career interests",
  },
  {
    id: "personality",
    name: "Personality Traits",
    icon: <Coffee className="w-6 h-6" />,
    description:
      "Understand how your personality aligns with different career paths",
  },
];

// Career domains with descriptions
const CAREER_DOMAINS = [
  {
    id: "tech",
    name: "Technology",
    description: "Software development, IT, data science, cybersecurity, AI",
  },
  {
    id: "business",
    name: "Business",
    description:
      "Management, entrepreneurship, finance, consulting, operations",
  },
  {
    id: "design",
    name: "Design",
    description: "UX/UI, graphic design, product design, architecture",
  },
  {
    id: "marketing",
    name: "Marketing",
    description:
      "Digital marketing, content creation, brand management, social media",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Medicine, nursing, public health, healthcare administration",
  },
  {
    id: "education",
    name: "Education",
    description:
      "Teaching, educational technology, instructional design, research",
  },
  {
    id: "creative",
    name: "Creative Arts",
    description: "Writing, visual arts, music, film, photography",
  },
];

// This is the main page component that will be the default export
export default function BeginnerAssessmentPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading assessment..." />}>
      <BeginnerAssessment />
    </Suspense>
  );
}

// Loading component
const LoadingState = ({ message = "Loading..." }) => (
  <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    <div className="text-white text-xl">{message}</div>
  </div>
);

// This is the client component that uses useSearchParams
function BeginnerAssessment() {
  const searchParams = useSearchParams();
  const initialDomain = searchParams.get("domain");

  // State variables
  const [step, setStep] = React.useState(initialDomain ? 2 : 1); // Start with domain selection if no domain in URL
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [selectedDomain, setSelectedDomain] = React.useState(
    initialDomain || ""
  );
  const [currentCategory, setCurrentCategory] = React.useState(0);
  const [questions, setQuestions] = React.useState([]);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [results, setResults] = React.useState(null);
  const [isComplete, setIsComplete] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState(
    "Generating assessment questions..."
  );

  // Feedback states
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [feedbackStars, setFeedbackStars] = React.useState(0);
  const [feedbackComment, setFeedbackComment] = React.useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = React.useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = React.useState(false);

  // Load questions when first starting the assessment
  React.useEffect(() => {
    if (step === 3 && selectedDomain && questions.length === 0) {
      loadQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, selectedDomain]);

  // Function to load questions from API
  const loadQuestions = async () => {
    try {
      setLoading(true);
      setLoadingMessage("Generating assessment questions...");
      setError(null);
      const category = ASSESSMENT_CATEGORIES[currentCategory].id;

      const response = await fetch(
        `/api/generate-beginner-questions?skill=${category}&domain=${selectedDomain}`
      );

      if (!response.ok) {
        throw new Error(`Failed to load questions: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid question format received");
      }

      setQuestions(data.questions);
      setCurrentQuestion(0);
    } catch (error) {
      console.error("Error loading questions:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle domain selection
  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    setStep(2); // Move to assessment overview
  };

  // Function to start assessment
  const handleStartAssessment = () => {
    setStep(3); // Move to questions
  };

  // Function to handle answering a question
  const handleAnswer = (questionIndex, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [`${ASSESSMENT_CATEGORIES[currentCategory].id}_${questionIndex}`]: answer,
    }));
  };

  // Function to handle navigation between questions
  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // If we're on the last category, complete the assessment
      if (currentCategory === ASSESSMENT_CATEGORIES.length - 1) {
        generateResults();
      } else {
        // Show loading state before moving to next category
        setLoading(true);
        setLoadingMessage("Loading next section...");

        // Move to next category
        const nextCategory = currentCategory + 1;

        try {
          // Load questions for the next category
          const category = ASSESSMENT_CATEGORIES[nextCategory].id;
          const response = await fetch(
            `/api/generate-beginner-questions?skill=${category}&domain=${selectedDomain}`
          );

          if (!response.ok) {
            throw new Error(`Failed to load questions: ${response.statusText}`);
          }

          const data = await response.json();

          if (!data.questions || !Array.isArray(data.questions)) {
            throw new Error("Invalid question format received");
          }

          // Set new questions and update category
          setQuestions(data.questions);
          setCurrentQuestion(0);
          setCurrentCategory(nextCategory);
        } catch (error) {
          console.error("Error loading questions:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  // Function to generate assessment results
  const generateResults = async () => {
    try {
      setLoading(true);
      setLoadingMessage("Analyzing your responses...");

      // Prepare the answers for analysis
      const answersData = {
        domain: selectedDomain,
        categories: ASSESSMENT_CATEGORIES.map((cat) => cat.id),
        responses: answers,
      };

      const response = await fetch("/api/analyze-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answersData),
      });

      if (!response.ok) {
        throw new Error(`Failed to analyze results: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data.results);
      setIsComplete(true);
      setShowFeedback(true);
      setStep(4); // Move to results page
    } catch (error) {
      console.error("Error generating results:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle restart assessment
  const handleRestart = () => {
    setStep(1);
    setSelectedDomain("");
    setCurrentCategory(0);
    setCurrentQuestion(0);
    setAnswers({});
    setQuestions([]);
    setResults(null);
    setIsComplete(false);
    setShowFeedback(false);
    setFeedbackSubmitted(false);
  };

  // Feedback functions
  const handleStarClick = (rating) => {
    setFeedbackStars(rating);
  };

  const submitFeedback = async () => {
    if (feedbackStars === 0) {
      return;
    }

    try {
      setIsSubmittingFeedback(true);

      const response = await fetch("/api/submit-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: "beginner-assessment",
          stars: feedbackStars,
          comment: feedbackComment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      setFeedbackSubmitted(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Loading state
  if (loading) {
    return <LoadingState message={loadingMessage} />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-[#161B22] rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-500 text-xl mb-4">Error: {error}</div>
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-[#30363D] text-white rounded-lg hover:opacity-90"
          >
            Restart Assessment
          </button>
        </div>
      </div>
    );
  }

  // Step 1: Domain Selection
  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-[#161B22] rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            What field interests you most?
          </h2>
          <p className="text-gray-400 mb-6">
            Select a broad domain you're interested in exploring. Don't worry if
            you're unsure—this helps us personalize your assessment.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CAREER_DOMAINS.map((domain) => (
              <button
                key={domain.id}
                onClick={() => handleDomainSelect(domain.id)}
                className="p-4 bg-[#21262D] hover:bg-[#30363D] rounded-lg text-left transition-colors duration-200"
              >
                <div className="text-white font-medium">{domain.name}</div>
                <div className="text-gray-400 text-sm mt-1">
                  {domain.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Assessment Overview
  if (step === 2) {
    const selectedDomainInfo = CAREER_DOMAINS.find(
      (d) => d.id === selectedDomain
    );

    return (
      <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-[#161B22] rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <div className="text-gray-400">Selected Field</div>
            <h2 className="text-2xl font-bold text-white">
              {selectedDomainInfo?.name || "Unknown"}
            </h2>
          </div>

          <h3 className="text-xl font-semibold text-white mb-4">
            Your Career Assessment
          </h3>
          <p className="text-gray-400 mb-6">
            This assessment consists of 5 sections that will help you better
            understand your potential career path. You'll need to complete all
            sections for a comprehensive analysis.
          </p>

          <div className="space-y-4">
            {ASSESSMENT_CATEGORIES.map((category) => (
              <div
                key={category.id}
                className="w-full p-4 bg-[#21262D] rounded-lg text-left flex items-center"
              >
                <div className="mr-4 text-[#E31D65]">{category.icon}</div>
                <div>
                  <div className="text-white font-medium">{category.name}</div>
                  <div className="text-gray-400 text-sm mt-1">
                    {category.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-[#30363D] text-white rounded-lg hover:opacity-90"
            >
              Change Field
            </button>
            <button
              onClick={handleStartAssessment}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white rounded-lg hover:opacity-90"
            >
              Begin Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Questions
  if (step === 3) {
    const currentCategoryInfo = ASSESSMENT_CATEGORIES[currentCategory];
    const currentQuestionData = questions[currentQuestion];

    // If no questions are loaded yet
    if (!currentQuestionData) {
      return (
        <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-[#161B22] rounded-lg shadow-lg p-6 text-center">
            <div className="text-white text-xl mb-4">
              Loading {currentCategoryInfo?.name} questions...
            </div>
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-[#161B22] rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-400">
              {currentCategoryInfo?.name}: Question {currentQuestion + 1} of{" "}
              {questions.length}
            </p>
            <div className="flex items-center text-gray-400">
              {currentCategoryInfo?.icon}
              <span className="ml-2">Section {currentCategory + 1}/5</span>
            </div>
          </div>

          <div className="mb-6 w-full bg-gray-700 h-2 rounded-full">
            <div
              className="bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>

          <h2
            className="text-xl text-white font-semibold mb-4"
            dangerouslySetInnerHTML={{
              __html: md.render(currentQuestionData.question),
            }}
          />

          <div className="space-y-4">
            {currentQuestionData.options.map((option, index) => {
              const answerKey = `${currentCategoryInfo.id}_${currentQuestion}`;
              return (
                <div
                  key={index}
                  className={`flex items-center space-x-2 p-3 rounded-lg transition-colors duration-200
                    ${
                      answers[answerKey] === option
                        ? "bg-[#21262D] border border-[#E31D65]"
                        : "hover:bg-[#21262D] border border-transparent"
                    } cursor-pointer`}
                  onClick={() => handleAnswer(currentQuestion, option)}
                >
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name="question-option"
                    value={option}
                    checked={answers[answerKey] === option}
                    onChange={() => handleAnswer(currentQuestion, option)}
                    className="w-4 h-4 text-[#E31D65] bg-gray-100 border-gray-300 focus:ring-[#E31D65]"
                  />
                  <label
                    htmlFor={`option-${index}`}
                    className="text-sm font-medium text-gray-300 cursor-pointer flex-1"
                    dangerouslySetInnerHTML={{ __html: md.render(option) }}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handleNext}
              disabled={
                !answers[`${currentCategoryInfo.id}_${currentQuestion}`]
              }
              className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center
                ${
                  answers[`${currentCategoryInfo.id}_${currentQuestion}`]
                    ? "bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90"
                    : "bg-gray-500 cursor-not-allowed"
                }`}
            >
              {currentQuestion === questions.length - 1 &&
              currentCategory === ASSESSMENT_CATEGORIES.length - 1
                ? "Complete Assessment"
                : currentQuestion === questions.length - 1
                ? "Next Section"
                : "Next Question"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Results
  if (step === 4 && results) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center p-8">
        <div className="max-w-3xl w-full bg-[#161B22] rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Your Career Assessment Results
          </h2>

          <div className="p-4 bg-gradient-to-r from-[#21262D] to-[#30363D] rounded-lg mb-6">
            <div className="text-white text-lg font-medium mb-2">
              Selected Field:{" "}
              {CAREER_DOMAINS.find((d) => d.id === selectedDomain)?.name}
            </div>
            <div className="text-gray-300">{results.summary}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Strengths */}
            <div className="bg-[#21262D] p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white flex items-center mb-3">
                <Gift className="w-5 h-5 mr-2 text-green-400" />
                Your Strengths
              </h3>
              <ul className="text-gray-300 space-y-2">
                {results.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Career Paths */}
            <div className="bg-[#21262D] p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white flex items-center mb-3">
                <Briefcase className="w-5 h-5 mr-2 text-blue-400" />
                Potential Career Paths
              </h3>
              <ul className="text-gray-300 space-y-2">
                {results.careerPaths.map((path, index) => (
                  <li key={index} className="flex items-start">
                    <ArrowRight className="w-4 h-4 text-blue-400 mr-2 mt-1 flex-shrink-0" />
                    <span>{path}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="bg-[#21262D] p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center mb-3">
              <FileText className="w-5 h-5 mr-2 text-purple-400" />
              Detailed Analysis
            </h3>
            <div className="text-gray-300 space-y-4">
              {results.detailedAnalysis.map((analysis, index) => (
                <div
                  key={index}
                  className="border-b border-gray-700 pb-3 last:border-b-0 last:pb-0"
                >
                  <h4 className="text-white font-medium mb-1">
                    {ASSESSMENT_CATEGORIES[index]?.name}
                  </h4>
                  <p>{analysis}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-[#21262D] p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center mb-3">
              <ArrowRight className="w-5 h-5 mr-2 text-yellow-400" />
              Recommended Next Steps
            </h3>
            <ol className="text-gray-300 space-y-2 list-decimal list-inside">
              {results.nextSteps.map((step, index) => (
                <li key={index} className="pl-2">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Feedback Form */}
          {showFeedback && (
            <div className="p-4 rounded-lg bg-[#21262D] border border-[#30363D] mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                How was your assessment experience?
              </h3>

              {!feedbackSubmitted ? (
                <>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            feedbackStars >= star
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-500"
                          } transition-colors duration-200 hover:text-yellow-300`}
                        />
                      </button>
                    ))}
                  </div>

                  <div className="mb-4">
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md bg-[#161B22] text-white"
                      placeholder="Write your feedback..."
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={submitFeedback}
                    disabled={feedbackStars === 0 || isSubmittingFeedback}
                    className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 ${
                      feedbackStars > 0 && !isSubmittingFeedback
                        ? "bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90"
                        : "bg-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isSubmittingFeedback ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </div>
                    ) : (
                      "Submit Feedback"
                    )}
                  </button>
                </>
              ) : (
                <div className="text-center p-2 text-green-400">
                  <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                  Thank you for your feedback!
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleRestart}
              className="flex-1 px-4 py-2 bg-[#30363D] text-white rounded-lg hover:opacity-90"
            >
              Start Over
            </button>
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white rounded-lg hover:opacity-90"
            >
              Go to Dashboard
            </button>
          </div>

          {/* Added button for detailed analysis */}
          <div className="mt-4">
            <button
              onClick={() => (window.location.href = "/auth/signin")}
              className="w-full px-4 py-2 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white rounded-lg hover:opacity-90"
            >
              Get Detailed Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback UI
  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-[#161B22] rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Career Beginner Assessment
        </h2>
        <p className="text-gray-400 mb-6">
          Discover your natural talents, interests, and potential career paths
        </p>
        <button
          onClick={handleRestart}
          className="px-6 py-3 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white rounded-lg hover:opacity-90"
        >
          Start Assessment
        </button>
      </div>
    </div>
  );
}
