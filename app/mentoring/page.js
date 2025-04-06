"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/services/routeProtectionService";

export default function MentoringPage() {
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookingStatus, setBookingStatus] = useState({
    isBooked: false,
    meetLink: "",
    mentorEmail: "",
    scheduledTime: "",
  });

  const mentors = [
    {
      id: 1,
      name: "Dr Aaryan",
      role: "Senior Data Scientist at Google",
      expertise: ["Machine Learning", "AI Ethics", "Career Transitions"],
      image: "/mentors/aaryannn.jpg",
      available: true,
      bio: "With over 10 years of experience in AI and machine learning, Dr. Singh helps professionals navigate the complex landscape of data science careers.",
      rating: 4.9,
    },
    {
      id: 2,
      name: "Tarsh Swarnkar",
      role: "Career Coach & Former HR Director",
      expertise: [
        "Resume Building",
        "Interview Preparation",
        "Salary Negotiation",
      ],
      image: "/mentors/tarsh.jpeg",
      available: false,
      bio: "With experience as an HR director at Fortune 500 companies, Tarsh provides insider knowledge on what employers really look for.",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Kanishq Tahalyani",
      role: "Product Manager at Microsoft",
      expertise: ["Product Strategy", "UX Design", "Agile Methodologies"],
      image: "/mentors/kanishq.jpeg",
      available: false,
      bio: "Kanishq specializes in helping technical professionals transition into product management roles.",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Himanshu Rautela",
      role: "Full Stack Developer & Tech Lead",
      expertise: ["Web Development", "System Design", "Technical Interviews"],
      image: "/mentors/himanshu.jpeg",
      available: true,
      bio: "Himanshu has helped over 200 developers land jobs at top tech companies through his structured mentoring approach.",
      rating: 4.9,
    },
  ];

  const handleBookSession = (mentorId) => {
    // In a real implementation, this would connect to a backend API
    // For now, we'll simulate the booking process

    // Generate a fake Google Meet link
    const meetCode = Math.random().toString(36).substring(2, 10);
    const meetLink = `https://meet.google.com/${meetCode}`;

    // Get current time and round to nearest 30-minute interval
    // Get current time, add 30 minutes first, then round to nearest 30-minute interval
    const now = new Date();

    // First add 30 minutes to current time
    const thirtyMinsLater = new Date(now.getTime() + 30 * 60000);

    // Then round to nearest 30-minute interval
    const minutes = thirtyMinsLater.getMinutes();
    const roundedMinutes = minutes < 30 ? 0 : 30;
    const hoursAdjustment = minutes < 30 ? 0 : 0;

    const sessionTime = new Date(thirtyMinsLater);
    sessionTime.setMinutes(roundedMinutes);
    sessionTime.setHours(thirtyMinsLater.getHours() + hoursAdjustment);

    // Format time to show only date, hours and minutes (no seconds)
    const formattedTime = sessionTime.toLocaleString(undefined, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Find the mentor's email
    const mentor = mentors.find((m) => m.id === mentorId);
    const mentorEmail = `${mentor.name
      .toLowerCase()
      .replace(" ", ".")}@example.com`;

    // Update booking status
    setBookingStatus({
      isBooked: true,
      meetLink,
      mentorEmail,
      scheduledTime: formattedTime,
    });
  };

  return (
    <ProtectedRoute>
      <div className="bg-[#161B22] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
                1:1 Mentoring Sessions
              </span>
            </h1>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg">
              Connect with industry experts for personalized guidance on your
              career journey. Book a 30-minute session with one of our
              experienced mentors.
            </p>
          </div>

          {bookingStatus.isBooked ? (
            <div className="max-w-2xl mx-auto bg-[#0D1117] p-8 rounded-lg shadow-lg border-2 border-gradient-to-r from-[#E31D65] to-[#FF6B2B]">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] rounded-full flex items-center justify-center mx-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-4">
                  Session Booked Successfully!
                </h2>
                <p className="text-gray-300 mb-6">
                  Your mentoring session has been scheduled. Here are the
                  details:
                </p>

                <div className="bg-[#161B22] p-6 rounded-lg mb-6">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 text-[#E31D65] mr-3" />
                    <span className="text-gray-300">
                      <span className="font-medium text-white">
                        Scheduled for:
                      </span>{" "}
                      {bookingStatus.scheduledTime}
                    </span>
                  </div>

                  <div className="flex items-center mb-4">
                    <Clock className="h-5 w-5 text-[#E31D65] mr-3" />
                    <span className="text-gray-300">
                      <span className="font-medium text-white">Duration:</span>{" "}
                      30 minutes
                    </span>
                  </div>

                  <div className="flex items-center mb-4">
                    <Mail className="h-5 w-5 text-[#E31D65] mr-3" />
                    <span className="text-gray-300">
                      <span className="font-medium text-white">
                        Mentor email:
                      </span>{" "}
                      {bookingStatus.mentorEmail}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <ExternalLink className="h-5 w-5 text-[#E31D65] mr-3" />
                    <span className="text-gray-300">
                      <span className="font-medium text-white">
                        Meeting link:
                      </span>{" "}
                      <a
                        href={bookingStatus.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF6B2B] hover:underline"
                      >
                        {bookingStatus.meetLink}
                      </a>
                    </span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm">
                  The meeting link has been sent to both you and your mentor.
                  Please join the meeting at the scheduled time.
                </p>

                <div className="mt-8">
                  <Link href="/dashboard">
                    <button className="px-6 py-3 bg-[#0D1117] text-white rounded-md hover:bg-gradient-to-r hover:from-[#E31D65] hover:to-[#FF6B2B] transition-colors duration-300">
                      Back to Dashboard
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {mentors.map((mentor) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-[#0D1117] rounded-lg overflow-hidden shadow-lg"
                >
                  <div className="h-48 bg-gray-700 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {mentor.image ? (
                        <img
                          src={mentor.image}
                          alt={mentor.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/300x200?text=Mentor";
                          }}
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-3xl font-bold text-gray-300">
                            {mentor.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    {mentor.available && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Available Now
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {mentor.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">{mentor.role}</p>

                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 ${
                              i < Math.floor(mentor.rating)
                                ? "text-yellow-400"
                                : "text-gray-600"
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-gray-300 text-sm">
                          {mentor.rating}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">
                        Expertise:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-[#1c2331] text-gray-300 text-xs px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-6">{mentor.bio}</p>

                    <button
                      onClick={() => handleBookSession(mentor.id)}
                      disabled={!mentor.available}
                      className={`w-full py-3 rounded-md font-medium transition-all duration-300 ${
                        mentor.available
                          ? "bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white hover:opacity-90"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {mentor.available ? "Book Now" : "Currently Unavailable"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
