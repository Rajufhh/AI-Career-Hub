"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Using next-auth for session management

const BentoGrid = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { data: session } = useSession(); // Get session data

  // Set user from session when session changes
  useEffect(() => {
    if (session) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session]);

  const features = [
    {
      id: 1,
      title: "Resume Analysis",
      description:
        "Get instant feedback on your resume with our AI-powered analysis tools.",
      tags: ["ATS Friendly", "Job Match", "Instant Feedback"],
      deviceType: "Web",
      images: [
        {
          src: "/images/resume-mobile.png",
          alt: "Resume Analysis Mobile Screen",
        },
      ],
      gridClass: "md:col-span-2 col-span-1",
      imageContainerClass: "flex-col", // Always stack vertically
      detailedDescription:
        "Our AI-powered resume analysis tool scans your resume for keywords, formatting issues, and content gaps. Get personalized recommendations to make your resume stand out to recruiters and pass through Applicant Tracking Systems with ease. Upload your resume and receive instant feedback to improve your chances of landing interviews.",
    },
    {
      id: 2,
      title: "AI Interviewer",
      description:
        "Practice with our AI interviewer to prepare for tough questions and receive instant feedback.",
      tags: ["Video Interview", "Real-time Feedback", "Industry Specific"],
      deviceType: "Web",
      images: [
        {
          src: "/images/interview1-web.png",
          alt: "AI Interviewer Web Screen 1",
        },
        {
          src: "/images/interview-2-web.png",
          alt: "AI Interviewer Web Screen 2",
        },
      ],
      gridClass: "md:col-span-2 col-span-1 md:row-span-2 row-span-1",
      imageContainerClass: "flex-col", // Always stack vertically for interviewer
      detailedDescription:
        "Practice your interview skills with our AI-powered interviewer that simulates real interview scenarios. Choose from industry-specific question sets, receive real-time feedback on your responses, body language, and speech patterns. Our system adapts to your performance, gradually increasing difficulty to help you master even the toughest interview questions.",
    },
    {
      id: 3,
      title: "Dynamic Cover Letter Generator",
      description:
        "Create personalized cover letters tailored to each job application in seconds.",
      tags: ["Customizable", "Job Specific", "Multiple Templates"],
      deviceType: "Mobile",
      images: [
        {
          src: "/images/cover1-mobile.png",
          alt: "Cover Letter Generator Mobile Screen 1",
        },
        {
          src: "/images/cover2-mobile.png",
          alt: "Cover Letter Generator Mobile Screen 2",
        },
      ],
      gridClass: "md:col-span-2 col-span-1 md:row-span-2 row-span-1",
      imageContainerClass: "flex-col sm:flex-row", // Horizontal on bigger screens, vertical on mobile
      detailedDescription:
        "Generate professional, personalized cover letters in seconds with our AI-powered tool. Simply input the job description and your key qualifications, and our system will create a tailored cover letter that highlights your relevant skills and experience. Choose from multiple templates and customize to match your personal style and the company's culture.",
    },
    {
      id: 4,
      title: "Career Counseling",
      description:
        "Get personalized career advice from our experts to help you navigate your professional journey.",
      tags: ["1-on-1 Sessions", "Expert Advice"],
      deviceType: "Web",
      images: [
        {
          src: "/images/career-counseling-web.png",
          alt: "Career Counseling Web Screen",
        },
      ],
      gridClass: "md:col-span-2 col-span-1",
      imageContainerClass: "flex-col",
      detailedDescription:
        "Connect with our AI career counselor for personalized guidance on your career path. Discuss your goals, challenges, and aspirations to receive tailored advice on skill development, job search strategies, and long-term career planning. Our system analyzes industry trends and your personal profile to provide relevant, actionable insights for your professional growth.",
    },
    {
      id: 5,
      title: "Beginner Guide",
      description:
        "Discover your perfect career path with personalized guidance tailored just for you.",
      tags: ["Step-by-Step", "Resources"],
      deviceType: "Web",
      images: [
        { src: "/images/beginners-mobile.png", alt: "Beginner Web Screen" },
      ],
      gridClass: "md:col-span-2 col-span-1",
      imageContainerClass: "flex-col",
      detailedDescription:
        "Our five-part assessment analyzes your aptitudes, competencies, values, self-perception, and personality to identify your ideal career path. Complete all sections to receive personalized guidance tailored to your unique profile and chosen field.",
    },
    {
      id: 6,
      title: "AI Skill Tests Proctored",
      description:
        "Showcase your skills with our AI-proctored assessments trusted by employers worldwide.",
      tags: ["Certified", "Proctored", "Industry Standard"],
      deviceType: "Web",
      images: [
        { src: "/images/proctoring-gif.gif", alt: "AI Skill Tests Web Screen" },
      ],
      gridClass: "md:col-span-2 col-span-1",
      imageContainerClass: "flex-col",
      detailedDescription:
        "Validate your skills with our AI-proctored assessments that are recognized by top employers. Our system monitors your test-taking process to ensure integrity while you demonstrate your abilities in various technical and soft skills. Upon completion, receive a detailed performance report and a shareable certificate that enhances your credibility with potential employers.",
    },
  ];

  const handleCardClick = (feature) => {
    setSelectedFeature(feature);
  };

  const closeModal = () => {
    setSelectedFeature(null);
  };

  const getFeatureRoute = (featureId) => {
    if (!user) return "/auth/signin";

    switch (featureId) {
      case 1:
        return "/resume-analyze";
      case 2:
        return "/interview-landing";
      case 3:
        return "/cover-letter";
      case 4:
        return "/counseling";
      case 5:
        return "/beginners";
      case 6:
        return "/profile";
      default:
        return "/";
    }
  };

  const navigateToFeature = (featureId) => {
    const route = getFeatureRoute(featureId);
    router.push(route);
    closeModal();
  };

  return (
    <div className="bg-[#0D1117] text-white min-h-screen p-4 md:p-6 mt-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold mb-8 pb-4 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] bg-clip-text text-transparent">
          Power Your Career Journey
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`bg-[#161B22] rounded-2xl p-4 md:p-6 flex flex-col relative transform transition-all duration-300 hover:-translate-y-1 ${feature.gridClass} hover:shadow-lg hover:shadow-pink-500/30 group overflow-hidden cursor-pointer`}
              onClick={() => handleCardClick(feature)}
            >
              {/* Thick gradient border effect on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] p-[4px] -m-[4px] pointer-events-none"></div>
              <div className="absolute inset-0 rounded-2xl bg-[#161B22] m-[3px]"></div>

              <span className="absolute top-4 right-4 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-xs font-semibold py-1 px-3 rounded-full z-10">
                {feature.deviceType}
              </span>
              <div className="z-10">
                <h2 className="text-xl md:text-2xl font-bold mb-2">
                  {feature.title}
                </h2>
                <p className="text-sm text-gray-400 mb-3">
                  {feature.description}
                </p>
                <div className="flex flex-wrap mb-3">
                  {feature.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-900/20 text-blue-300 text-xs px-2 py-1 rounded mr-2 mb-2"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className={`flex-1 flex ${
                  feature.imageContainerClass
                } justify-center items-center ${
                  feature.id === 1 ? "mt-0" : "mt-3"
                } ${feature.id === 1 ? "gap-1" : "gap-24"} z-0`}
              >
                {feature.images.map((image, index) => (
                  <div
                    key={index}
                    className={`${
                      feature.images.length > 1 ? "w-full" : "w-full"
                    } h-auto flex justify-center items-center ${
                      feature.id === 1 ? "py-0" : ""
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className={`${
                        feature.id === 1
                          ? "max-w-[85%] max-h-[85%] rounded-xl shadow-lg object-contain" // Bigger size for Resume Analysis
                          : feature.deviceType === "Mobile"
                          ? "max-w-full max-h-full rounded-xl shadow-lg object-contain"
                          : "max-w-full max-h-full rounded-lg shadow-lg object-cover"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for detailed feature view */}
      <AnimatePresence>
        {selectedFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#161B22] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 relative custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#FF6B2B #161B22",
              }}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors duration-200"
                onClick={closeModal}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="mb-6">
                <span className="inline-block bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-sm font-semibold py-1 px-3 rounded-full mb-4">
                  {selectedFeature.deviceType}
                </span>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] bg-clip-text text-transparent">
                  {selectedFeature.title}
                </h2>
                <div className="flex flex-wrap mb-4">
                  {selectedFeature.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-900/20 text-blue-300 text-sm px-3 py-1 rounded mr-2 mb-2"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-300 text-lg mb-6">
                  {selectedFeature.detailedDescription}
                </p>
              </div>

              <div
                className={`grid ${
                  selectedFeature.images.length > 1
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1"
                } gap-6`}
              >
                {selectedFeature.images.map((image, index) => (
                  <div key={index} className="flex justify-center">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="max-w-full rounded-lg shadow-lg object-contain max-h-[400px]"
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => navigateToFeature(selectedFeature.id)}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white font-semibold text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                >
                  {user ? "Get Started" : "Sign In to Continue"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #161b22;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #e31d65, #ff6b2b);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ff6b2b, #e31d65);
        }
      `}</style>
    </div>
  );
};

export default BentoGrid;
