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
  const [isSaving, setIsSaving] = useState(false);

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
            skills: data.skills.map((skill) => {
              const skillScore = data.skillScores?.find(
                (s) => s.skill === skill
              );
              return {
                id: skill, // Using skill name as ID for simplicity
                name: skill,
                assessmentTaken: !!skillScore,
                assessmentScore: skillScore
                  ? Math.round(skillScore.score)
                  : null,
              };
            }),
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

  const handleTakeAssessment = (skillId) => {
    const skill = profile?.skills.find((s) => s.id === skillId);
    if (skill) {
      router.push(`/assessments?skill=${encodeURIComponent(skill.name)}`);
    }
  };

  // Add function to handle adding a new skill
  const handleAddSkill = () => {
    if (
      newSkill.trim() !== "" &&
      !profile.skills.some((s) => s.name === newSkill.trim())
    ) {
      const updatedSkills = [
        ...profile.skills,
        {
          id: newSkill.trim(),
          name: newSkill.trim(),
          assessmentTaken: false,
          assessmentScore: null,
        },
      ];

      setProfile({
        ...profile,
        skills: updatedSkills,
      });

      setNewSkill("");
    }
  };

  // Add function to save skills to the database
  const saveSkills = async () => {
    if (!profile || !profile.skills.length) return;

    try {
      setIsSaving(true);
      const skillNames = profile.skills.map((skill) => skill.name);

      const response = await fetch("/api/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skills: skillNames,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save skills");
      }
    } catch (err) {
      console.error("Error saving skills:", err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
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

  // Update the Skills Assessment Card in the return statement
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
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>

            {profile.skills.length > 0 ? (
              <div className="space-y-4">
                {profile.skills.map((skill) => (
                  <div key={skill.id} className="p-4 bg-[#21262D] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">{skill.name}</h3>
                      {skill.assessmentTaken && (
                        <span className="text-sm font-medium text-green-400">
                          Score: {skill.assessmentScore}%
                        </span>
                      )}
                    </div>
                    {!skill.assessmentTaken && (
                      <button
                        onClick={() => handleTakeAssessment(skill.id)}
                        className="w-full mt-2 py-2 px-4 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Take Assessment
                      </button>
                    )}
                  </div>
                ))}
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
                      onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                      placeholder="Enter a skill (e.g., JavaScript, Python)"
                      className="flex-grow px-4 py-3 bg-[#0D1117] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E31D65]"
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-4 py-3 bg-[#1F2937] text-white rounded-lg hover:bg-[#2D3748] flex items-center"
                    >
                      <PlusCircle className="h-5 w-5 mr-2" />
                      Add
                    </button>
                  </div>

                  <button
                    onClick={saveSkills}
                    disabled={profile.skills.length === 0 || isSaving}
                    className={`w-full px-4 py-3 rounded-lg flex items-center justify-center ${
                      profile.skills.length === 0 || isSaving
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
