// File: app/page.js
"use client"; // Required for client-side hooks

import { useState, useEffect, useRef } from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import FAQSection from "@/components/FAQs";
import Footer from "@/components/Footer";

export default function Home() {
  const [jobs, setJobs] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("Frontend Developer");
  const [locations, setLocations] = useState("Remote, New York");
  const [timeFilter, setTimeFilter] = useState("past_week");
  const videoRef = useRef(null);

  // Setup camera and initial job fetch
  useEffect(() => {
    async function setup() {
      // Camera setup
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (camError) {
        console.error("Camera setup failed:", camError.message);
        setError("Camera access denied. Please allow camera permissions.");
      }

      // Optional: Fetch initial jobs on page load (uncomment if desired)
      // handleSearch({ preventDefault: () => {} });
    }
    setup();
  }, []);

  // Handle job search
  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setJobs(null);

    try {
      const locationArray = locations.split(",").map((loc) => loc.trim());
      const res = await fetch("/api/scrape-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          locations: locationArray,
          timeFilter,
        }),
      });

      // Log raw response for debugging
      const text = await res.text();
      console.log("Raw response from /api/scrape-jobs:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        throw new Error(`Invalid JSON response: ${text.substring(0, 50)}...`);
      }

      if (!res.ok) {
        throw new Error(data.error + (data.details ? ` (Details: ${JSON.stringify(data.details)})` : ""));
      }

      if (!data.jobs) {
        throw new Error("No jobs field in response");
      }

      setJobs(data.jobs);
    } catch (fetchError) {
      console.error("Job search error:", fetchError.message);
      setError(fetchError.message);
    }
  };

  return (
    <div className="bg-[#0D1117] flex flex-col relative">
      {/* Camera Feed */}
      <div className="camera-container">
        <video ref={videoRef} id="camera-feed" autoPlay playsInline />
      </div>

      {/* Main Content */}
      <Hero />
      <CTA />
      <Features />

      {/* Job Search Section */}
      <section className="job-search-section text-white py-12 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Search Jobs</h2>
        <form onSubmit={handleSearch} className="search-form mb-8">
          <div className="form-group">
            <label htmlFor="query" className="block mb-2">Job Title</label>
            <input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Frontend Developer"
              className="w-full p-2 rounded bg-[#1E2A3C] text-white border border-[#30363D]"
            />
          </div>
          <div className="form-group">
            <label htmlFor="locations" className="block mb-2">Locations (comma-separated)</label>
            <input
              id="locations"
              type="text"
              value={locations}
              onChange={(e) => setLocations(e.target.value)}
              placeholder="e.g., Remote, New York"
              className="w-full p-2 rounded bg-[#1E2A3C] text-white border border-[#30363D]"
            />
          </div>
          <div className="form-group">
            <label htmlFor="timeFilter" className="block mb-2">Time Filter</label>
            <select
              id="timeFilter"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full p-2 rounded bg-[#1E2A3C] text-white border border-[#30363D]"
            >
              <option value="past_week">Past Week</option>
              <option value="past_month">Past Month</option>
              <option value="any_time">Any Time</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-[#238636] text-white rounded hover:bg-[#2ea043]"
          >
            Search Jobs
          </button>
        </form>

        {error && <p className="text-red-500 mb-4">Error: {error}</p>}
        {jobs ? (
          jobs.length > 0 ? (
            <div className="job-list">
              {jobs.map((job, index) => job && (
                <div key={index} className="job-box p-4 bg-[#1E2A3C] rounded border border-[#30363D] mb-4">
                  <p><strong>Job {index + 1}:</strong> {job.title || "Untitled"}</p>
                  <p><strong>Company:</strong> {job.company || "N/A"}</p>
                  <p><strong>Location:</strong> {job.location || "N/A"}</p>
                  {job.url && (
                    <p>
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#58A6FF] hover:underline"
                      >
                        Apply
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No jobs found for this search.</p>
          )
        ) : (
          !error && <p className="text-gray-400">Enter criteria and search for jobs.</p>
        )}
      </section>

      <FAQSection />
      <Footer />

      {/* Styles */}
      <style jsx>{`
        .camera-container {
          width: 150px;
          height: 100px;
          overflow: hidden;
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10;
          border: 2px solid #30363D;
          border-radius: 5px;
        }
        #camera-feed {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .job-search-section {
          background-color: #161B22;
        }
        .search-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
}