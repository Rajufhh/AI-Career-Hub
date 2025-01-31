"use client";

import { useState } from "react";
import ProfileCard from "@/components/ProfileCard";

// Simulated data - replace with actual API call
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
  const [profile] = useState(mockProfile);

  const handleTakeAssessment = (skillId) => {
    // Implement assessment logic here
    console.log(`Taking assessment for skill ${skillId}`);
  };

  return (
    <main className="min-h-screen bg-[#0D1117] py-8">
      <ProfileCard profile={profile} onTakeAssessment={handleTakeAssessment} />
    </main>
  );
}
