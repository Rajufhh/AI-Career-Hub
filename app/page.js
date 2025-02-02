import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import ResumeAnalysis from "@/components/ResumeAnalysis";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-[#0D1117] flex flex-col">
      <Hero />
      <Features />
      <CTA />
      <ResumeAnalysis />
      <Footer />
    </div>
  );
}