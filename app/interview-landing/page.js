"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/services/routeProtectionService";

const InterviewLanding = () => {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [techStack, setTechStack] = useState("");
  const [experience, setExperience] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Navigate to the interview page with query parameters
    router.push(
      `/interview?role=${encodeURIComponent(
        role
      )}&techStack=${encodeURIComponent(
        techStack
      )}&experience=${encodeURIComponent(experience)}`
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full bg-[#161B22] rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-6">
            Tell us more about your job interviewing
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="role" className="block text-gray-300 mb-2">
                Job Role/job Position
              </label>
              <input
                id="role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Ex. Full stack Developer"
                className="w-full p-3 bg-[#0D1117] text-gray-300 rounded-lg border border-gray-700 focus:outline-none focus:border-[#E31D65]"
                required
              />
            </div>

            <div>
              <label htmlFor="techStack" className="block text-gray-300 mb-2">
                Job Description/ Tech stack (In Short)
              </label>
              <textarea
                id="techStack"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="Ex. React, Angular, Nodejs, Mysql, Nosql, Python"
                className="w-full p-3 bg-[#0D1117] text-gray-300 rounded-lg border border-gray-700 focus:outline-none focus:border-[#E31D65] h-32 resize-none"
                required
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-gray-300 mb-2">
                Years of Experience
              </label>
              <input
                id="experience"
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Ex. 5"
                className="w-full p-3 bg-[#0D1117] text-gray-300 rounded-lg border border-gray-700 focus:outline-none focus:border-[#E31D65]"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="px-4 py-2 bg-transparent text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? "Starting..." : "Start Interview"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default InterviewLanding;
