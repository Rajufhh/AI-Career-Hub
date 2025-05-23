"use client";

import { useState } from "react";
import { FileUp } from "lucide-react";
import { ProtectedRoute } from "@/services/routeProtectionService";
import ChatbotController from "@/components/ChatbotController";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState("");
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
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("/api/resume-analysis", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError("Failed to analyze resume. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0D1117] text-white p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r pb-3 from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
            Job Application Analyzer
          </h1>
          <p className="text-gray-400 mb-8">
            Enter a job description and upload your resume as a PDF to get an
            AI-generated score and feedback.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg mb-2">Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full h-40 p-4 rounded-lg bg-[#161B22] border border-[#E45A2E] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Paste the job description here..."
                required
              />
            </div>

            <div>
              <label className="block text-lg mb-2">Upload Resume</label>
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  accept=".pdf"
                  className="hidden"
                  id="resume-upload"
                  required
                />
                <label
                  htmlFor="resume-upload"
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
              className="w-full py-4 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90  duration-200  rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Analyzing..." : "Analyze"}
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
                Analysis Results
              </h2>
              <div
                className="analysis-content prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: analysis }}
              />

              <div className="mt-8 pt-6 border-t border-[#30363D]">
                <h3 className="text-xl font-semibold mb-3 text-white">
                  What's next?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => router.push("/cover-letter")}
                    className="p-3 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90 rounded-lg text-white transition-colors flex items-center justify-center font-medium"
                  >
                    Generate Cover Letter
                  </button>
                  <button
                    onClick={() => router.push("/linkedin-analyze")}
                    className="p-3 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90 rounded-lg text-white transition-colors flex items-center justify-center font-medium"
                  >
                    Analyze LinkedIn Profile
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
