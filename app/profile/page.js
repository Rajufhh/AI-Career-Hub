"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import ProfileCard from "@/components/ProfileCard";
import { ProtectedRoute } from '@/services/routeProtectionService';

const mockProfile = {
  id: "1",
  username: "Aaryan Singh",
  photoUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&fit=crop",
  state: "Maharshtra",
  country: "India",
  gender: "Male",
  race: "Asian",
  domain: "Software Engineering",
  skills: [
    { id: "1", name: "React", assessmentTaken: true, assessmentScore: 92 },
    { id: "2", name: "Node.js", assessmentTaken: true, assessmentScore: 88 },
    { id: "3", name: "TypeScript", assessmentTaken: false },
    { id: "4", name: "Python", assessmentTaken: false },
  ],
  careerPath: {
    current: "Frontend Developer",
    next: ["Senior Frontend Developer", "Lead Developer"],
    recommended: [
      "Full Stack Developer",
      "DevOps Engineer",
      "Technical Architect",
      "Engineering Manager",
    ],
  },
};

export default function Home() {
  const [profile, setProfile] = useState(mockProfile);
  const router = useRouter();

  useEffect(() => {
    // Check for completed assessments
    try {
      const testResults = JSON.parse(localStorage.getItem('testResults') || '{}');
      
      if (Object.keys(testResults).length > 0) {
        // Update profile with new scores
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

        // Clear the results after updating
        localStorage.removeItem('testResults');
      }
    } catch (error) {
      console.error('Error loading test results:', error);
    }
  }, []);

  const handleTakeAssessment = (skillId) => {
    const skill = profile.skills.find(s => s.id === skillId);
    if (skill) {
      console.log('Navigating to assessment for:', skill.name);
      try {
        router.push(`/assessments?skill=${encodeURIComponent(skill.name)}`);
      } catch (error) {
        console.error('Router navigation failed:', error);
        window.location.href = `/assessments?skill=${encodeURIComponent(skill.name)}`;
      }
    }
  };

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