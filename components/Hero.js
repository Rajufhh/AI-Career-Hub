"use client";
import dynamic from "next/dynamic";
import Graphic from "@/assets/Graphic.json";

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Hero() {
  return (
    <section className="min-h-[calc(100vh-64px)] flex items-center justify-center relative">
      <div className="container mx-auto px-8 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
              Unlock Your Potential with AI-Powered Career Counseling
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8">
              Discover your strengths, improve your skills, and get personalized
              career guidance with our cutting-edge platform.
            </p>
          </div>
          <div className="lg:w-1/2">
            <div className="w-full mb-6 h-80 flex items-center justify-center">
              <Lottie animationData={Graphic} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
