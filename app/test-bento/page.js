import React from "react";

const BentoGrid = () => {
  const features = [
    {
      id: 1,
      title: "Resume Analysis",
      description: "Get instant feedback on your resume with our AI-powered analysis tools.",
      tags: ["ATS Friendly", "Job Match", "Instant Feedback"],
      deviceType: "Mobile",
      images: [{ src: "/images/resume-mobile.png", alt: "Resume Analysis Mobile Screen" }],
      gridClass: "md:col-span-2 col-span-1",
      imageContainerClass: "flex-col", // Always stack vertically
    },
    {
      id: 2,
      title: "AI Interviewer",
      description: "Practice with our AI interviewer to prepare for tough questions and receive instant feedback.",
      tags: ["Video Interview", "Real-time Feedback", "Industry Specific"],
      deviceType: "Web",
      images: [
        { src: "/images/interview1-web.png", alt: "AI Interviewer Web Screen 1" },
        { src: "/images/interview-2-web.png", alt: "AI Interviewer Web Screen 2" },
      ],
      gridClass: "md:col-span-2 col-span-1 md:row-span-2 row-span-1",
      imageContainerClass: "flex-col", // Always stack vertically for interviewer
    },
    {
      id: 3,
      title: "Dynamic Cover Letter Generator",
      description: "Create personalized cover letters tailored to each job application in seconds.",
      tags: ["Customizable", "Job Specific", "Multiple Templates"],
      deviceType: "Mobile",
      images: [
        { src: "/images/cover1-mobile.png", alt: "Cover Letter Generator Mobile Screen 1" },
        { src: "/images/cover2-mobile.png", alt: "Cover Letter Generator Mobile Screen 2" },
      ],
      gridClass: "md:col-span-2 col-span-1 md:row-span-2 row-span-1",
      imageContainerClass: "flex-col sm:flex-row", // Horizontal on bigger screens, vertical on mobile
    },
    {
      id: 4,
      title: "Career Counseling",
      description: "Get personalized career advice from our experts to help you navigate your professional journey.",
      tags: ["1-on-1 Sessions", "Expert Advice"],
      deviceType: "Web",
      images: [{ src: "/images/career-counseling-web.png", alt: "Career Counseling Web Screen" }],
      gridClass: "md:col-span-2 col-span-1",
      imageContainerClass: "flex-col",
    },
    {
      id: 5,
      title: "Beginner Guide",
      description: "Everything you need to know to start your job search journey with confidence.",
      tags: ["Step-by-Step", "Resources"],
      deviceType: "Web",
      images: [{ src: "/images/beginners-mobile.png", alt: "Beginner Web Screen" }],
      gridClass: "md:col-span-2 col-span-1",
      imageContainerClass: "flex-col",
    },
    {
      id: 6,
      title: "AI Skill Tests Proctored",
      description: "Showcase your skills with our AI-proctored assessments trusted by employers worldwide.",
      tags: ["Certified", "Proctored", "Industry Standard"],
      deviceType: "Web",
      images: [{ src: "/images/proctoring-gif.gif", alt: "AI Skill Tests Web Screen" }],
      gridClass: "md:col-span-2 col-span-1",
      imageContainerClass: "flex-col",
    },
  ];

  return (
    <div className="bg-[#0D1117] text-white min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold mb-8 pb-4 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] bg-clip-text text-transparent">
          Power Your Career Journey
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`bg-[#161B22] rounded-2xl p-4 md:p-6 flex flex-col relative transform transition-transform duration-300 hover:-translate-y-1 ${feature.gridClass}`}
            >
              <span className="absolute top-4 right-4 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-xs font-semibold py-1 px-3 rounded-full z-10">
                {feature.deviceType}
              </span>
              <div className="z-10">
                <h2 className="text-xl md:text-2xl font-bold mb-2">{feature.title}</h2>
                <p className="text-sm text-gray-400 mb-3">{feature.description}</p>
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

              <div className={`flex-1 flex ${feature.imageContainerClass} justify-center items-center mt-3 gap-24 z-0`}>
                {feature.images.map((image, index) => (
                  <div
                    key={index}
                    className={`${feature.images.length > 1 ? "w-full" : "w-full"} h-auto flex justify-center items-center`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className={`${
                        feature.deviceType === "Mobile"
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
    </div>
  );
};

export default BentoGrid;