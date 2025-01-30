"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { BarChart, BookOpen, TrendingUp } from "lucide-react"

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin")
    },
  })

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-start"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#E31D65] to-[#FF6B2B]">
          Welcome to your Dashboard, {session.user?.name}!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DashboardCard
            title="Skill Assessments"
            description="Take AI-proctored assessments to evaluate your skills."
            icon={<BookOpen className="h-8 w-8 text-primary-start" />}
          />
          <DashboardCard
            title="Progress Tracking"
            description="Monitor your skill development over time."
            icon={<TrendingUp className="h-8 w-8 text-primary-end" />}
          />
          <DashboardCard
            title="Career Insights"
            description="Get personalized career recommendations based on your skills."
            icon={<BarChart className="h-8 w-8 text-primary-start" />}
          />
        </div>
      </main>
    </div>
  )
}

function DashboardCard({ title, description, icon }) {
  return (
    <div className="bg-[#161B22] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-xl font-semibold ml-4 text-white">{title}</h2>
      </div>
      <p className="text-gray-400">{description}</p>
      <button className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white rounded-lg hover:opacity-90 transition-opacity duration-200">
        Learn More
      </button>
    </div>
  )
}
