"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart,
  BookOpen,
  TrendingUp,
  FileText,
  FileSpreadsheet,
  Search,
  MessageSquare,
  Users,
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

  if (status === "loading") {
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0D1117] flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#E31D65] to-[#FF6B2B]">
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

          {/* Starting Out Section */}
          {activeTab === "starting-out" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <DashboardCard
                  title="Skill Assessments"
                  description="Take AI-proctored assessments to evaluate your skills."
                  icon={<BookOpen className="h-8 w-8 text-primary-start" />}
                  onClick={() => handleCardClick("/profile")}
                />
                <DashboardCard
                  title="Career Counseling"
                  description="Personalized career recommendations based on your skills."
                  icon={<BarChart className="h-8 w-8 text-primary-start" />}
                  onClick={() => handleCardClick("/counseling")}
                />
                <DashboardCard
                  title="Skills Prerequisites"
                  description="Discover what skills you need for your desired career path."
                  icon={<TrendingUp className="h-8 w-8 text-primary-start" />}
                  onClick={() => handleCardClick("/skills-prerequisites")}
                />
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
    <div className="bg-[#161B22] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
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
