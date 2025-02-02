import { Brain } from "lucide-react";

export default function Footer() {
  return (
    <section className="bg-[#0D1116] py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-center items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Brain className="h-8 w-8 text-cyan-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
              AI Career Hub
            </span>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500">
          © 2025 AI Career Hub. All rights reserved.
        </div>
      </div>
    </section>
  );
}
