"use client";

import { useRouter } from 'next/navigation';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MapPin, Briefcase, Award, ChevronRight } from "lucide-react";
// import { useSession } from "next-auth/react";
// import { getSessionData } from "@/utils/sessionUtils";

// const { name, email, image, isAuthenticated } = getSessionData(session);

export default function ProfileCard({ profile }) {
  const router = useRouter();

  const handleTakeAssessment = (skillId) => {
    // Find the skill name from the ID
    const skill = profile.skills.find(s => s.id === skillId);
    if (skill) {
      console.log('Navigating to assessment for:', skill.name); // Debug log
      router.push(`/assessments?skill=${encodeURIComponent(skill.name)}`);
    }

  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="p-6 bg-[#161B22] rounded-2xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-32 h-32">
            <img
              src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              alt="Profile"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
              {profile.username}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{`${profile.state}, ${profile.country}`}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className="bg-[#21262D] text-gray-300">
                {profile.gender}
              </Badge>
              <Badge className="bg-[#21262D] text-gray-300">
                {profile.race}
              </Badge>
              <Badge className="bg-[#21262D] text-gray-300">
                <Briefcase className="w-4 h-4 mr-1" />
                {profile.domain}
              </Badge>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text mb-4">
            Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-3 bg-[#0D1117] rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">{skill.name}</span>
                </div>
                {!skill.assessmentTaken ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTakeAssessment(skill.id)}
                    className="bg-[#21262D] hover:bg-[#30363D] text-gray-300 transition-colors duration-200"
                  >
                    Take Assessment
                  </Button>
                ) : (
                  <Badge className="bg-[#21262D] text-gray-300">
                    Score: {skill.assessmentScore}%
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Career Path Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text mb-4">
            Career Path
          </h2>
          <div className="bg-[#0D1117] rounded-lg p-4">
            <div className="mb-4">
              <div className="text-sm text-gray-400">Current Position</div>
              <div className="text-gray-300 font-medium mt-1">
                {profile.careerPath.current}
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-400">Next Steps</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.careerPath.next.map((step, index) => (
                  <div key={index} className="flex items-center text-gray-300">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Recommended Paths</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                {profile.careerPath.recommended.map((path, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-[#161B22] p-2 rounded text-gray-300"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-400 mr-1" />
                    {path}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}