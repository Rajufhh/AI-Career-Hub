"use client";

import { useState } from "react";
import { FileUp } from "lucide-react";
import { ProtectedRoute } from "@/services/routeProtectionService";
import ChatbotController from "@/components/ChatbotController";
import { useRouter } from "next/navigation";

export default function LinkedInAnalyzePage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append("linkedin", file);

      const response = await fetch("/api/linkedin-analysis", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError("Failed to analyze LinkedIn profile. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
     <ProtectedRoute>
    <div className="min-h-screen bg-[#0D1117] text-white p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r pb-3 from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
          LinkedIn Profile Analyzer
        </h1>
        <p className="text-gray-400 mb-6 sm:mb-8">
          Upload your LinkedIn profile as a PDF to get AI-generated feedback and
          improvement suggestions.
        </p>

        <div className="mb-6 p-4 bg-[#161B22] rounded-lg border border-[#30363D]">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 text-white">
            How to download your LinkedIn profile as PDF:
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Go to your LinkedIn profile</li>
            <li>Click on the "More" button below your profile header</li>
            <li>Select "Save to PDF" from the dropdown menu</li>
            <li>Wait for the PDF to generate and download</li>
            <li>Upload the downloaded PDF here for analysis</li>
          </ol>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg mb-2">
              Upload LinkedIn Profile
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".pdf"
                className="hidden"
                id="linkedin-upload"
                required
              />
              <label
                htmlFor="linkedin-upload"
                className="flex items-center justify-center w-full p-4 rounded-lg bg-[#161B22] border border-[#E45A2E] hover:bg-[#1c2129] cursor-pointer"
              >
                <FileUp className="mr-2" />
                {file ? file.name : "Choose PDF file"}
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90 duration-200 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing...
              </div>
            ) : (
              "Analyze LinkedIn Profile"
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {analysis && (
          <div className="mt-6 p-6 bg-[#161B22] rounded-lg border border-[#E45A2E]">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
              LinkedIn Profile Analysis
            </h2>

            <div className="analysis-content prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: analysis }} />
            </div>

            <div className="mt-8 pt-6 border-t border-[#30363D]">
              <h3 className="text-xl font-semibold mb-3 text-white">
                What's next?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => router.push("/resume-analyze")}
                  className="p-3 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90 rounded-lg text-white transition-colors flex items-center justify-center font-medium"
                >
                  Analyze Your Resume
                </button>
                <button
                  onClick={() => router.push("/mentoring")}
                  className="p-3 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90 rounded-lg text-white transition-colors flex items-center justify-center font-medium"
                >
                  Book a Career Mentor
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ChatbotController />
    </div>
    </ProtectedRoute>
  );
}
