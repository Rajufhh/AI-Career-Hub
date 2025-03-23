//app/cover-letter/page.js

"use client";

import { useState } from "react";
import { FileUp, Download } from "lucide-react";
import { ProtectedRoute } from "@/services/routeProtectionService";

export default function CoverLetterGenerator() {
  const [generationType, setGenerationType] = useState("cold");
  const [resume, setResume] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCoverLetter(null);

    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("generationType", generationType);
      formData.append("companyName", companyName);

      if (generationType === "specific") {
        formData.append("jobPosition", jobPosition);
        formData.append("jobDescription", jobDescription);
      }

      const response = await fetch("/api/cover-letter", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Cover letter generation failed");
      }

      const data = await response.json();
      setCoverLetter(data.coverLetter);
    } catch (err) {
      setError("Failed to generate cover letter. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch("/api/download-cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coverLetter,
          companyName,
          jobPosition: generationType === "specific" ? jobPosition : "Position",
        }),
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // a.download = Cover_Letter_${companyName.replace(/\s+/g, "_")}.pdf;
      //   a.download = Cover_Letter_${companyName.replace(/\s+/g, "_")}.pdf;
      a.download = `Cover_Letter_${companyName.replace(/\s+/g, "_")}.pdf`;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError("Failed to download cover letter. Please try again.");
      console.error(err);
    }
  };

  return (
    // <ProtectedRoute>
    <div className="min-h-screen bg-[#0D1117] text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r pb-3 from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
          Cover Letter Generator
        </h1>
        <p className="text-gray-400 mb-8">
          Generate a customized cover letter using AI based on your resume and
          job details.
        </p>

        <div className="mb-8">
          <div className="flex border border-[#E45A2E] rounded-lg overflow-hidden">
            <button
              onClick={() => setGenerationType("cold")}
              className={`flex-1 py-4 text-center ${
                generationType === "cold"
                  ? "bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white"
                  : "bg-[#161B22] text-gray-300"
              }`}
            >
              Cold Application
            </button>
            <button
              onClick={() => setGenerationType("specific")}
              className={`flex-1 py-4 text-center ${
                generationType === "specific"
                  ? "bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white"
                  : "bg-[#161B22] text-gray-300"
              }`}
            >
              Specific Job
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg mb-2">Upload Resume</label>
            <div className="relative">
              <input
                type="file"
                onChange={(e) => setResume(e.target.files[0])}
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
                {resume ? resume.name : "Choose PDF file"}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-lg mb-2">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-4 rounded-lg bg-[#161B22] border border-[#E45A2E] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter company name..."
              required
            />
          </div>

          {generationType === "specific" && (
            <>
              <div>
                <label className="block text-lg mb-2">Job Position</label>
                <input
                  type="text"
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                  className="w-full p-4 rounded-lg bg-[#161B22] border border-[#E45A2E] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter job position..."
                  required
                />
              </div>

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
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90 duration-200 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading
              ? "Generating..."
              : "Generate Cover Letter (click until you are satisfied 😄)"}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {coverLetter && (
          <div className="mt-6 p-6 bg-[#161B22] rounded-lg border border-[#E45A2E]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Generated Cover Letter</h2>
              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90 duration-200 rounded-lg"
              >
                <Download className="mr-2" size={16} />
                Download PDF
              </button>
            </div>
            <pre className="text-white whitespace-pre-wrap font-mono text-sm">
              {coverLetter.toString()}
            </pre>
          </div>
        )}
      </div>
    </div>
    // </ProtectedRoute>
  );
}
