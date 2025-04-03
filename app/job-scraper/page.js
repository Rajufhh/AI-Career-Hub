// File: app/job-scraper/page.js

"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

export default function JobScraper() {
  const [query, setQuery] = useState("Blockchain developers");
  const [locations, setLocations] = useState(
    "United States, United Kingdom, India"
  );
  const [timeFilter, setTimeFilter] = useState("From Last 24 Hours");
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setJobData([]);
    setMessage(null);

    // Start countdown (approximate time for scraping)
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      // Call our own API route instead of the Gradio client directly
      const response = await fetch("/api/scrape-jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          locations,
          timeFilter,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch data");
      }

      const result = await response.json();

      // Process results
      if (
        result.data &&
        Array.isArray(result.data) &&
        result.data.length >= 1
      ) {
        let jobs = [];

        // Check if we got dataframe data
        if (
          result.data[0] &&
          Array.isArray(result.data[0].data) &&
          result.data[0].data.length > 0
        ) {
          const headers = result.data[0].headers || [
            "Date Posted",
            "Title",
            "Company",
            "Location",
            "Job Link",
          ];

          // Convert dataframe to array of objects
          jobs = result.data[0].data.map((row) => {
            const job = {};
            headers.forEach((header, i) => {
              if (header !== "Description Length" && header !== "Description") {
                job[header] = row[i];
              }
            });
            return job;
          });

          setJobData(jobs);
          setMessage(`Found ${jobs.length} jobs matching your criteria.`);
        } else {
          setMessage("No jobs found matching your criteria.");
        }

        // If there's a message in the second element of the array, use it
        if (result.data[1] && typeof result.data[1] === "string") {
          setMessage(result.data[1]);
        }
      } else {
        setMessage("No jobs found matching your criteria.");
      }
    } catch (err) {
      setError("Failed to scrape jobs. Please try again. " + err.message);
      console.error(err);
    } finally {
      clearInterval(timer);
      setCountdown(0);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r pb-3 from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
          Job Scraper
        </h1>
        <p className="text-gray-400 mb-8">
          Scrape job postings from LinkedIn based on your query and location
          preferences.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg mb-2">Job Query</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-4 rounded-lg bg-[#161B22] border border-[#E45A2E] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., Data Scientist"
              required
            />
          </div>

          <div>
            <label className="block text-lg mb-2">
              Locations (comma-separated)
            </label>
            <input
              type="text"
              value={locations}
              onChange={(e) => setLocations(e.target.value)}
              className="w-full p-4 rounded-lg bg-[#161B22] border border-[#E45A2E] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., United States, India"
              required
            />
          </div>

          <div>
            <label className="block text-lg mb-2">Time Filter</label>
            <div className="relative">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="w-full p-4 rounded-lg bg-[#161B22] border border-[#E45A2E] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none"
              >
                <option value="From Last 24 Hours">From Last 24 Hours</option>
                <option value="From Past Month">From Past Month</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90 duration-200 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Scraping... {countdown > 0 ? `(${countdown}s)` : ""}
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Scrape Jobs
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {message && !error && (
          <div className="mt-6 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-200">
            {message}
          </div>
        )}

        {jobData.length > 0 && (
          <div className="mt-6 overflow-hidden rounded-lg border border-[#E45A2E]">
            <div className="overflow-x-auto">
              <table className="w-full bg-[#161B22] border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white">
                    <th className="p-4 text-left">Date Posted</th>
                    <th className="p-4 text-left">Title</th>
                    <th className="p-4 text-left">Company</th>
                    <th className="p-4 text-left">Location</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobData.map((job, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0 ? "bg-[#161B22]" : "bg-[#1A2029]"
                      }
                    >
                      <td className="p-4 border-t border-[#30363D]">
                        {job["Date Posted"]}
                      </td>
                      <td className="p-4 border-t border-[#30363D] font-medium">
                        {job.Title}
                      </td>
                      <td className="p-4 border-t border-[#30363D]">
                        {job.Company}
                      </td>
                      <td className="p-4 border-t border-[#30363D]">
                        {job.Location}
                      </td>
                      <td className="p-4 border-t border-[#30363D]">
                        <a
                          href={job["Job Link"]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-3 py-1 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90 duration-200 rounded text-white text-sm"
                        >
                          Apply
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Added buttons for resume analysis and cover letter */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => (window.location.href = "/resume-analyze")}
                className="py-3 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90 duration-200 rounded-lg font-semibold"
              >
                Analyze Your Resume for These Jobs
              </button>
              <button
                onClick={() => (window.location.href = "/cover-letter")}
                className="py-3 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90 duration-200 rounded-lg font-semibold"
              >
                Generate a Cover Letter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
