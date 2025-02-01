"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import ProfileCard from "@/components/ProfileCard";
import { ProtectedRoute } from '@/services/routeProtectionService';

export default function Profile() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

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
          const response = await fetch(`/api/get-user?email=${encodeURIComponent(session.user.email)}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Error fetching profile');
          }

          // Transform the data to match your profile structure
          const transformedProfile = {
            id: data._id,
            username: data.username,
            photoUrl: session.user.image || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
            state: data.state,
            country: data.country,
            gender: data.gender,
            race: data.race,
            domain: data.domain === 'other' ? data.otherDomain : data.domain,
            skills: data.skills.map((skill, index) => ({
              id: index.toString(),
              name: skill,
              assessmentTaken: false,
              assessmentScore: null
            })),
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
          console.error('Error fetching profile:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchUserProfile();
  }, [session]);

  // Handle test results update
  useEffect(() => {
    if (profile) {
      try {
        const testResults = JSON.parse(localStorage.getItem('testResults') || '{}');
        
        if (Object.keys(testResults).length > 0) {
          const updatedSkills = profile.skills.map(skill => {
            if (testResults[skill.name] !== undefined) {
              return {
                ...skill,
                assessmentTaken: true,
                assessmentScore: Math.round(testResults[skill.name])
              };
            }
            return skill;
          });

          setProfile(prev => ({
            ...prev,
            skills: updatedSkills
          }));

          localStorage.removeItem('testResults');
        }
      } catch (error) {
        console.error('Error loading test results:', error);
      }
    }
  }, [profile]);

  const handleTakeAssessment = (skillId) => {
    const skill = profile?.skills.find(s => s.id === skillId);
    if (skill) {
      try {
        router.push(`/assessments?skill=${encodeURIComponent(skill.name)}`);
      } catch (error) {
        console.error('Router navigation failed:', error);
        window.location.href = `/assessments?skill=${encodeURIComponent(skill.name)}`;
      }
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        {/* <div className="text-white">Loading profile...</div> */}
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
      <main className="min-h-screen bg-[#0D1117] py-8">
        <ProfileCard 
          profile={profile} 
          onTakeAssessment={handleTakeAssessment} 
        />
      </main>
    </ProtectedRoute>
  );
}