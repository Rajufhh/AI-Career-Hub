"use client";
import React, { useState, useEffect } from "react";
import MarkdownIt from "markdown-it";
import { ProtectedRoute } from "@/services/routeProtectionService";
import ChatbotController from "@/components/ChatbotController";
import { useRouter } from "next/navigation";

function CareerGuidance() {
  const router = useRouter();
  const [counsellingText, setCounsellingText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [domains, setDomains] = useState(["web", "app", "blockchain", "other"]);
  const [races, setRaces] = useState([
    "American Indian or Alaska Native",
    "Asian",
    "Black or African American",
    "Hispanic or Latino",
    "Native Hawaiian or Other Pacific Islander",
    "White",
    "Two or More Races",
  ]);

  const [formData, setFormData] = useState({
    domain: "",
    otherDomain: "",
    race: "",
    skills: [],
  });

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });

  // Fetch user data first
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/get-userr");

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/");
            return;
          }
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);

        // Initialize form with existing data if any
        if (data) {
          setFormData({
            domain: data.domain || "",
            otherDomain: data.otherDomain || "",
            race: data.race || "",
            skills: data.skills || [],
          });
        }

        // Determine if we need to show the skill form
        const needsSkillForm =
          !data.skills ||
          data.skills.length === 0 ||
          !data.domain ||
          !data.race;
        setShowSkillForm(needsSkillForm);

        // If user has all skills and they have scores, try to fetch guidance
        if (!needsSkillForm) {
          fetchGuidance();
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const fetchGuidance = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/career-guidance");
      const data = await response.json();

      if (!response.ok) {
        // Special handling for missing skill scores
        if (
          response.status === 400 &&
          data.error.includes("skill assessments")
        ) {
          setError(data.error);
          return;
        }
        throw new Error(data.error || "Failed to fetch career guidance");
      }

      setCounsellingText(data.guidance);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prevState) => ({
        ...prevState,
        skills: [...prevState.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      skills: prevState.skills.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error updating user profile");
      }

      // Update the local userData
      setUserData((prev) => ({
        ...prev,
        ...formData,
      }));

      // Hide the form
      setShowSkillForm(false);

      // Check if all skills have scores
      const allSkillsHaveScores = formData.skills.every((skill) =>
        userData?.skillScores?.some((score) => score.skill === skill)
      );

      if (!allSkillsHaveScores) {
        setError(
          "Please complete skill assessments for all skills before requesting career guidance. Go to your profile to take assessments."
        );
      } else {
        // Try to fetch guidance if all conditions are met
        fetchGuidance();
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0D1117] text-gray-200 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text">
              Career Counselling
            </h1>
          </div>

          {showSkillForm ? (
            <div className="bg-[#161B22] rounded-lg p-6 shadow-xl border border-orange-600 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">
                Complete Your Profile for Career Guidance
              </h2>
              <p className="mb-6 text-gray-300">
                We need a bit more information to provide personalized career
                guidance.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-400 mb-2">Domain</label>
                  <select
                    name="domain"
                    value={formData.domain}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-[#161B22] text-white"
                    required
                  >
                    <option value="" disabled hidden>
                      Select your domain
                    </option>
                    {domains.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain.charAt(0).toUpperCase() + domain.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.domain === "other" && (
                  <div>
                    <label className="block text-gray-400 mb-2">
                      Specify Domain
                    </label>
                    <input
                      type="text"
                      name="otherDomain"
                      value={formData.otherDomain}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-[#161B22] text-white"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-gray-400 mb-2">Race</label>
                  <select
                    name="race"
                    value={formData.race}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-[#161B22] text-white"
                    required
                  >
                    <option value="" disabled hidden>
                      Select your race
                    </option>
                    {races.map((race) => (
                      <option key={race} value={race}>
                        {race}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Skills</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      className="flex-grow px-4 py-2 border border-gray-700 rounded-lg bg-[#161B22] text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white rounded-lg hover:opacity-90"
                    >
                      Add
                    </button>
                  </div>
                  {formData.skills.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {formData.skills.map((skill, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center px-4 py-2 bg-[#161B22] text-white rounded-lg"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(index)}
                            className="text-red-400 hover:underline"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {formData.skills.length === 0 && (
                    <p className="mt-2 text-amber-400">
                      Please add at least one skill
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || formData.skills.length === 0}
                  className="w-full px-4 py-2 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white rounded-lg hover:opacity-90 transition-opacity duration-200 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Information"}
                </button>
              </form>
            </div>
          ) : null}

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
              <p className="text-red-200">{error}</p>
              {error.includes("skill assessments") && (
                <button
                  onClick={() => router.push("/profile")}
                  className="mt-3 px-4 py-2 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white rounded-lg hover:opacity-90"
                >
                  Go to Profile
                </button>
              )}
            </div>
          )}

          {!showSkillForm && (
            <div className="bg-[#161B22] rounded-lg p-6 shadow-xl border border-orange-600">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">
                Professional Guidance
              </h2>
              <div className="prose prose-invert max-w-none">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-rose-600" />
                  </div>
                ) : counsellingText ? (
                  <div
                    className="text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: md.render(counsellingText),
                    }}
                  />
                ) : (
                  <p className="text-gray-300">
                    Your career guidance will appear here once all requirements
                    are met.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <ChatbotController />
      </div>
    </ProtectedRoute>
  );
}

export default CareerGuidance;
