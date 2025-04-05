"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  BarChart,
  BookOpen,
  TrendingUp,
  FileText,
  FileSpreadsheet,
  Search,
  MessageSquare,
  Users,
  PlusCircle,
  Check,
  ArrowRight,
  PlayCircle,
} from "lucide-react";
import { ProtectedRoute } from "@/services/routeProtectionService";
import ChatbotController from "@/components/ChatbotController";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  const [activeTab, setActiveTab] = useState("starting-out");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [skillsSaved, setSkillsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allSkillsAssessed, setAllSkillsAssessed] = useState(false);

  // Fetch user data when session is available
  useEffect(() => {
    async function fetchUserData() {
      if (session?.user?.email) {
        try {
          setLoading(true);
          const response = await fetch(
            `/api/get-user?email=${encodeURIComponent(session.user.email)}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json();
          setUserData(data);

          // Set skills from user data if available
          if (data.skills && Array.isArray(data.skills)) {
            setSkills(data.skills);
            // Don't set skillsSaved to true here, so users can always add skills
          }

          // Check if all skills have been assessed
          if (data.skills && data.skills.length > 0 && data.skillScores) {
            const allAssessed = data.skills.every((skill) =>
              data.skillScores.some((score) => score.skill === skill)
            );
            setAllSkillsAssessed(allAssessed);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    }

    if (session) {
      fetchUserData();
    }
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-start"></div>
      </div>
    );
  }

  const handleCardClick = (route) => {
    router.push(route);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const addSkill = () => {
    if (newSkill.trim() !== "" && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      setSkillsSaved(false); // Reset skillsSaved when adding a new skill
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
    setSkillsSaved(false); // Reset skillsSaved when removing a skill
  };

  const saveSkills = async () => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skills: skills,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save skills");
      }

      // Update the UI to show skills are saved
      setSkillsSaved(true);

      // Update userData with new skills immediately to keep UI consistent
      setUserData((prev) => ({
        ...prev,
        skills: skills,
      }));

      // Show success message temporarily
      setTimeout(() => {
        setSkillsSaved(false);
      }, 2000);
    } catch (error) {
      console.error("Error saving skills:", error);
      alert("Failed to save skills: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const takeTest = (skill) => {
    // Navigate to the test page with the skill as a parameter
    router.push(`/assessments?skill=${encodeURIComponent(skill)}`);
  };

  // Helper function to check if a skill has been assessed
  const hasSkillScore = (skill) => {
    return userData?.skillScores?.some((score) => score.skill === skill);
  };

  // Helper function to get the score for a skill
  const getSkillScore = (skill) => {
    const scoreObj = userData?.skillScores?.find(
      (score) => score.skill === skill
    );
    return scoreObj ? Math.round(scoreObj.score) : null;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0D1117] px-4 flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#E31D65] to-[#FF6B2B]">
            Welcome to your Dashboard, {session.user?.name}!
          </h1>

          {/* Tab Navigation */}
          <div className="flex flex-wrap mb-8 gap-2">
            <TabButton
              label="Starting Out"
              icon={<BookOpen className="h-5 w-5 mr-2" />}
              isActive={activeTab === "starting-out"}
              onClick={() => handleTabClick("starting-out")}
            />
            <TabButton
              label="Job Ready"
              icon={<FileText className="h-5 w-5 mr-2" />}
              isActive={activeTab === "job-ready"}
              onClick={() => handleTabClick("job-ready")}
            />
            <TabButton
              label="Interview Prep"
              icon={<MessageSquare className="h-5 w-5 mr-2" />}
              isActive={activeTab === "interview-prep"}
              onClick={() => handleTabClick("interview-prep")}
            />
            <TabButton
              label="Find a Mentor"
              icon={<Users className="h-5 w-5 mr-2" />}
              isActive={activeTab === "find-mentor"}
              onClick={() => handleTabClick("find-mentor")}
            />
          </div>

          {/* Starting Out Section - Redesigned with 2 boxes in horizontal layout */}
          {activeTab === "starting-out" && (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Skill Assessment Box */}
              <div className="bg-[#161B22] p-6 rounded-lg shadow-md flex-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#E31D65] to-[#FF6B2B] opacity-10 rounded-bl-full"></div>

                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <h2 className="text-2xl font-semibold ml-4 text-white">
                    Skill Assessments
                  </h2>
                </div>

                <p className="text-gray-400 mb-6">
                  Add your skills and take AI-proctored assessments to evaluate
                  your abilities. This is the first step toward your
                  personalized career journey.
                </p>

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-[#1F2937] px-3 py-2 rounded-lg flex items-center justify-between w-full"
                      >
                        <span className="text-white">{skill}</span>
                        <div className="flex items-center">
                          {hasSkillScore(skill) ? (
                            <span className="mr-2 px-3 py-1 bg-green-700 text-white rounded-md flex items-center">
                              Score: {getSkillScore(skill)}%
                            </span>
                          ) : (
                            <button
                              onClick={() => takeTest(skill)}
                              className="mr-2 px-3 py-1 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white rounded-md hover:opacity-90 flex items-center"
                            >
                              <PlayCircle className="h-4 w-4 mr-1" />
                              Take Test
                            </button>
                          )}
                          {/* Allow removing a skill regardless of save status */}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="text-gray-400 hover:text-white"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    placeholder="Enter a skill (e.g., JavaScript, Python)"
                    className="flex-grow px-4 py-3 bg-[#0D1117] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E31D65]"
                  />
                  <button
                    onClick={addSkill}
                    className="px-4 py-3 bg-[#1F2937] text-white rounded-lg hover:bg-[#2D3748] flex items-center"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add
                  </button>
                </div>

                <button
                  onClick={saveSkills}
                  disabled={skills.length === 0 || isSaving}
                  className={`w-full px-4 py-3 rounded-lg flex items-center justify-center ${
                    skills.length === 0 || isSaving
                      ? "bg-gray-600 cursor-not-allowed"
                      : skillsSaved
                      ? "bg-green-700"
                      : "bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90"
                  } text-white transition-all duration-200`}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Saving...
                    </>
                  ) : skillsSaved ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Skills Saved!
                    </>
                  ) : (
                    <>Save Skills</>
                  )}
                </button>
              </div>

              {/* Arrow connector - visible only on large screens */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="bg-[#1F2937] p-3 rounded-full">
                  <ArrowRight className="h-8 w-8 text-[#E31D65]" />
                </div>
              </div>

              {/* Arrow connector - visible only on small screens */}
              <div className="flex lg:hidden justify-center">
                <div className="bg-[#1F2937] p-3 rounded-full transform rotate-90">
                  <ArrowRight className="h-8 w-8 text-[#E31D65]" />
                </div>
              </div>

              {/* Career Counseling Box - Now with fixed height and width */}
              <div className="bg-[#161B22] p-6 rounded-lg shadow-md lg:w-[450px] lg:self-start relative overflow-hidden h-fit">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#E31D65] to-[#FF6B2B] opacity-10 rounded-bl-full"></div>

                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <h2 className="text-2xl font-semibold ml-4 text-white">
                    Career Counseling
                  </h2>
                </div>

                <p className="text-gray-400 mb-6">
                  After completing your skill assessments, receive personalized
                  career recommendations based on your results. Our AI will
                  analyze your strengths and suggest optimal career paths.
                </p>

                <div className="flex items-center mb-6 p-4 bg-[#0D1117] rounded-lg border border-[#1F2937]">
                  <BarChart className="h-10 w-10 text-[#E31D65] mr-4" />
                  <div>
                    <h3 className="text-white font-medium">
                      Data-Driven Insights
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Get career recommendations based on your assessment
                      results and market trends
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCardClick("/counseling")}
                  className={`w-full px-4 py-3 ${
                    allSkillsAssessed
                      ? "bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90"
                      : "bg-gray-600 cursor-not-allowed"
                  } text-white rounded-lg flex items-center justify-center`}
                  disabled={!allSkillsAssessed}
                >
                  <span>Get Career Counseling</span>
                  {!allSkillsAssessed && (
                    <span className="ml-2 text-sm">
                      (Complete All Assessments First)
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Job Ready Section */}
          {activeTab === "job-ready" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <DashboardCard
                  title="Resume Analysis"
                  description="Get AI-powered feedback to improve your resume."
                  icon={<FileText className="h-8 w-8 text-primary-start" />}
                  onClick={() => handleCardClick("/resume-analyze")}
                />
                <DashboardCard
                  title="CV Generator"
                  description="Create a professional CV tailored to your target job."
                  icon={
                    <FileSpreadsheet className="h-8 w-8 text-primary-start" />
                  }
                  onClick={() => handleCardClick("/cover-letter")}
                />
                <DashboardCard
                  title="Job Scraper"
                  description="Find job opportunities matching your skills and preferences."
                  icon={<Search className="h-8 w-8 text-primary-start" />}
                  onClick={() => handleCardClick("/job-scraper")}
                />
              </div>
            </div>
          )}

          {/* Interview Prep Section */}
          {activeTab === "interview-prep" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <DashboardCard
                  title="Interview Preparation"
                  description="Practice and prepare for your upcoming interviews."
                  icon={
                    <MessageSquare className="h-8 w-8 text-primary-start" />
                  }
                  onClick={() => handleCardClick("/interview-landing")}
                />
              </div>
            </div>
          )}

          {/* Find a Mentor Section */}
          {activeTab === "find-mentor" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <DashboardCard
                  title="Find a Mentor"
                  description="Connect with experienced professionals in your field."
                  icon={<Users className="h-8 w-8 text-primary-start" />}
                  onClick={() => handleCardClick("/mentoring")}
                />
              </div>
            </div>
          )}
        </main>
        <ChatbotController />
      </div>
    </ProtectedRoute>
  );
}

function TabButton({ label, icon, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-3 py-2 rounded-md transition-colors text-sm sm:text-base sm:px-4 ${
        isActive
          ? "bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white"
          : "bg-[#161B22] text-gray-300 hover:bg-[#1F2937]"
      }`}
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function DashboardCard({ title, description, icon, onClick }) {
  return (
    <div className="bg-[#161B22] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#E31D65] to-[#FF6B2B] opacity-10 rounded-bl-full"></div>
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-xl font-semibold ml-4 text-white">{title}</h2>
      </div>
      <p className="text-gray-400">{description}</p>
      <button
        onClick={onClick}
        className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white rounded-lg hover:opacity-90 transition-opacity duration-200"
      >
        Learn More
      </button>
    </div>
  );
}
