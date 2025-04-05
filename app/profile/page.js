"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ProtectedRoute } from "@/services/routeProtectionService";
import {
  MapPin,
  Book,
  Briefcase,
  ChevronRight,
  Trophy,
  PlusCircle,
  PlayCircle,
  Check,
} from "lucide-react";
import ChatbotController from "@/components/ChatbotController";

export default function Profile() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Add new state variables for skill management
  const [newSkill, setNewSkill] = useState("");
  const [savedSkills, setSavedSkills] = useState([]); // Skills saved in the database
  const [newSkills, setNewSkills] = useState([]); // Newly added skills not yet saved
  const [isSaving, setIsSaving] = useState(false);
  const [skillsSaved, setSkillsSaved] = useState(false);
  const [editingSkills, setEditingSkills] = useState(false);

  // Authentication check effect
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchUserProfile() {
      if (session?.user?.email) {
        try {
          const response = await fetch(
            `/api/get-user?email=${encodeURIComponent(session.user.email)}`
          );
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Error fetching profile");
          }

          // Set saved skills from user data
          if (data.skills && Array.isArray(data.skills)) {
            setSavedSkills(data.skills);
          }

          // Transform the data to match your profile structure
          const transformedProfile = {
            id: data._id,
            username: data.username,
            photoUrl:
              session.user.image ||
              "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
            state: data.state,
            country: data.country,
            gender: data.gender,
            domain: data.domain === "other" ? data.otherDomain : data.domain,
            skillScores: data.skillScores || [],
            careerPath: {
              current: "Entry Level",
              next: ["Junior", "Mid-Level"],
              recommended: [
                "Full Stack Developer",
                "DevOps Engineer",
                "Technical Architect",
                "Engineering Manager",
              ],
            },
          };

          setProfile(transformedProfile);
        } catch (err) {
          console.error("Error fetching profile:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchUserProfile();
  }, [session]);

  const handleTakeAssessment = (skill) => {
    router.push(`/assessments?skill=${encodeURIComponent(skill)}`);
  };

  // Add function to handle adding a new skill
  const addSkill = () => {
    if (
      newSkill.trim() !== "" &&
      !savedSkills.includes(newSkill.trim()) &&
      !newSkills.includes(newSkill.trim())
    ) {
      setNewSkills([...newSkills, newSkill.trim()]);
      setNewSkill("");
      setSkillsSaved(false);
    }
  };

  // Add function to remove a saved skill
  const removeSavedSkill = (skillToRemove) => {
    setSavedSkills(savedSkills.filter((skill) => skill !== skillToRemove));
    setSkillsSaved(false);
  };

  // Add function to remove a new skill
  const removeNewSkill = (skillToRemove) => {
    setNewSkills(newSkills.filter((skill) => skill !== skillToRemove));
  };

  // Add function to save skills to the database
  const saveSkills = async () => {
    try {
      setIsSaving(true);
      // Combine saved skills and new skills for saving
      const allSkills = [...savedSkills, ...newSkills];

      const response = await fetch("/api/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skills: allSkills,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save skills");
      }

      // Update the UI to show skills are saved
      setSkillsSaved(true);

      // Move skills from newSkills to savedSkills
      setSavedSkills(allSkills);
      setNewSkills([]);
      setEditingSkills(false);

      // Show success message temporarily
      setTimeout(() => {
        setSkillsSaved(false);
      }, 2000);
    } catch (err) {
      console.error("Error saving skills:", err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Function to start editing skills
  const startEditingSkills = () => {
    setEditingSkills(true);
    setSkillsSaved(false);
  };

  // Helper function to check if a skill has been assessed
  const hasSkillScore = (skill) => {
    return profile?.skillScores?.some((score) => score.skill === skill);
  };

  // Helper function to get the score for a skill
  const getSkillScore = (skill) => {
    const scoreObj = profile?.skillScores?.find(
      (score) => score.skill === skill
    );
    return scoreObj ? Math.round(scoreObj.score) : null;
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-white">No profile found</div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#0D1117] py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header Card */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6">
            <div className="flex items-center gap-6">
              <img
                src={profile.photoUrl}
                alt={profile.username}
                className="w-24 h-24 rounded-full"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {profile.username}
                </h1>
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {profile.state}, {profile.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Book className="w-4 h-4" />
                    <span>{profile.domain}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Assessment Card */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Skills Assessment
              </h2>
              <div className="flex items-center">
                <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
                {savedSkills.length > 0 && !editingSkills && (
                  <button
                    onClick={startEditingSkills}
                    className="text-sm px-3 py-1 bg-[#21262D] text-gray-300 rounded-md hover:bg-[#30363D]"
                  >
                    Edit Skills
                  </button>
                )}
              </div>
            </div>

            {savedSkills.length > 0 || newSkills.length > 0 ? (
              <div className="space-y-4">
                {/* Display saved skills list */}
                {savedSkills.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-gray-300 text-sm font-medium mb-2">
                      {editingSkills ? "Current Skills" : "Skills"}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {savedSkills.map((skill, index) => (
                        <div
                          key={`saved-${index}`}
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
                                onClick={() => handleTakeAssessment(skill)}
                                className="mr-2 px-3 py-1 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white rounded-md hover:opacity-90 flex items-center"
                              >
                                <PlayCircle className="h-4 w-4 mr-1" />
                                Take Test
                              </button>
                            )}
                            {/* Only show remove button if in editing mode */}
                            {editingSkills && (
                              <button
                                onClick={() => removeSavedSkill(skill)}
                                className="text-gray-400 hover:text-white"
                                aria-label="Remove skill"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Display new (unsaved) skills */}
                {newSkills.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-gray-300 text-sm font-medium mb-2">
                      New Skills (Unsaved)
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {newSkills.map((skill, index) => (
                        <div
                          key={`new-${index}`}
                          className="bg-[#1F2937] border border-[#E31D65] px-3 py-2 rounded-lg flex items-center justify-between w-full"
                        >
                          <span className="text-white">{skill}</span>
                          <div className="flex items-center">
                            <button
                              onClick={() => removeNewSkill(skill)}
                              className="text-gray-400 hover:text-white"
                              aria-label="Remove skill"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Show input field and save button only when editing */}
                {editingSkills && (
                  <>
                    <div className="flex gap-2 mb-6">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addSkill()}
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
                      disabled={
                        (savedSkills.length === 0 && newSkills.length === 0) ||
                        isSaving
                      }
                      className={`w-full px-4 py-3 rounded-lg flex items-center justify-center ${
                        (savedSkills.length === 0 && newSkills.length === 0) ||
                        isSaving
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
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-[#21262D] rounded-lg">
                  <p className="text-gray-400 mb-4">
                    You haven't added any skills yet. Add skills to take
                    assessments and track your progress.
                  </p>

                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
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
                    disabled={newSkills.length === 0 || isSaving}
                    className={`w-full px-4 py-3 rounded-lg flex items-center justify-center ${
                      newSkills.length === 0 || isSaving
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90"
                    } text-white transition-all duration-200`}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                        Saving...
                      </>
                    ) : (
                      <>Save Skills</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Career Path Card */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Career Path</h2>
              <Briefcase className="w-6 h-6 text-blue-500" />
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-[#21262D] rounded-lg">
                <h3 className="text-white font-medium mb-2">Current Level</h3>
                <p className="text-gray-400">{profile.careerPath.current}</p>
              </div>
              <div className="p-4 bg-[#21262D] rounded-lg">
                <h3 className="text-white font-medium mb-2">Next Steps</h3>
                <div className="space-y-2">
                  {profile.careerPath.next.map((level, index) => (
                    <div
                      key={index}
                      className="flex items-center text-gray-400"
                    >
                      <ChevronRight className="w-4 h-4 mr-2" />
                      {level}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-[#21262D] rounded-lg">
                <h3 className="text-white font-medium mb-2">
                  Recommended Roles
                </h3>
                <div className="space-y-2">
                  {profile.careerPath.recommended.map((role, index) => (
                    <div
                      key={index}
                      className="flex items-center text-gray-400"
                    >
                      <ChevronRight className="w-4 h-4 mr-2" />
                      {role}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ChatbotController />
      </main>
    </ProtectedRoute>
  );
}
