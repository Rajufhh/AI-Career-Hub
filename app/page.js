"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Brain } from "lucide-react";
import Lottie from "lottie-react";
import Graphic from "@/assets/Graphic.json";
export default function Home() {
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      if (scrollPosition > windowHeight * 0.1) {
        setShowFeatures(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#0D1117] flex flex-col">
      {/* Hero Section - Full Screen */}
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center relative">
        <div className="container mx-auto px-8 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
                Unlock Your Potential with AI-Powered Assessments
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Discover your strengths, improve your skills, and get
                personalized career guidance with our cutting-edge platform.
              </p>
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90 transition-opacity duration-200"
              >
                Get Started
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 -mr-1 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
            <div className="lg:w-1/2">
              <div className="w-full  h-full shadow-lg flex items-center justify-center">
                {/* <span className="text-4xl bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
                  3D Graphic Placeholder
                </span> */}
                <Lottie animationData={Graphic} />
              </div>
            </div>
          </div>

          {/* {/* Scroll Indicator */}
          {/* <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white opacity-60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div> */}
        </div>
      </main>

      {/* Features Section with Scroll Reveal */}
      <section
        // className={`bg-[#161B22] py-32 transition-all duration-1000 transform ${
        //   showFeatures
        //     ? "translate-y-0 opacity-100"
        //     : "translate-y-10 opacity-0"
        // }`}
        className={`bg-[#161B22] py-32`}
      >
        <div className="container mx-auto px-8 ">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r pb-6 from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              "AI-Proctored Assessments",
              "Personalized Career Guidance",
              "Real-Time Progress Tracking",
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-[#0D1117] p-6  rounded-lg w-full h-full shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="text-xl font-bold mb-4 pb-3 text-yellow-400">
                  {feature}
                </h3>
                <p className="text-gray-400">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#0D1116] py-20">
        <div className="container mx-auto px-6 py-12 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text mb-10">
            Ready to Start Your Journey?
          </h2>
          <p className="text-2xl text-gray-300 mb-12">
            Join thousands of professionals who've found their perfect career
            path with AI Career Hub.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-6 py-3 border border-transparent  text-lg  font-medium rounded-md text-white bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90 transition-opacity duration-200"
          >
            Begin Your Career Journey
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 -mr-1 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </section>
      <section className="bg-[#161B22] py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="h-8 w-8 text-cyan-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
                AI Career Hub
              </span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-cyan-400 transition">
                About
              </a>
              <a href="#" className="hover:text-cyan-400 transition">
                Privacy
              </a>
              <a href="#" className="hover:text-cyan-400 transition">
                Terms
              </a>
              <a href="#" className="hover:text-cyan-400 transition">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500">
            © 2024 AI Career Hub. All rights reserved.
          </div>
        </div>
      </section>
    </div>
  );
}
