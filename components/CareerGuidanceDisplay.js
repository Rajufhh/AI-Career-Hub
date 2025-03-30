// component/CareerGuidanceDisplay.js
import React from "react";
import {
  Briefcase,
  LineChart,
  Map,
  Award,
  GitBranch,
  BarChart,
  Rocket,
  Globe,
} from "lucide-react";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

const CareerGuidanceDisplay = ({ guidance }) => {
  // Function to parse the guidance text into sections
  const parseGuidance = (text) => {
    if (!text) return [];

    const sections = [
      {
        id: "profile",
        title: "Career Profile Analysis",
        icon: <LineChart size={24} />,
      },
      {
        id: "paths",
        title: "Recommended Career Paths",
        icon: <GitBranch size={24} />,
      },
      {
        id: "skills",
        title: "Skill Development Roadmap",
        icon: <BarChart size={24} />,
      },
      {
        id: "timeline",
        title: "Career Progression Timeline",
        icon: <Rocket size={24} />,
      },
      {
        id: "additional",
        title: "Additional Recommendations",
        icon: <Globe size={24} />,
      },
    ];

    // Extract content for each section
    const parsedSections = sections.map((section, index) => {
      const startIndex = text.indexOf(section.title);
      const endIndex = index < sections.length - 1 ? text.indexOf(sections[index + 1].title) : text.length;

      const content = text.substring(startIndex, endIndex).trim();

      return {
        ...section,
        content: content.replace(section.title, '').trim(), // Remove the title from the content
      };
    });

    return parsedSections;
  };

  const introEndIndex = guidance.indexOf("1. Career Profile Analysis");
  const introduction = guidance.substring(0, introEndIndex).trim();

  const sections = parseGuidance(guidance);

  // Render content using markdown-it
  const renderContent = (content) => {
    return md.render(content); // Convert Markdown to HTML
  };

  return (
    <div className="bg-[#161B22] rounded-lg shadow-xl border border-orange-600 overflow-hidden">
      {/* Introduction Card */}
      {introduction && (
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Map className="text-rose-500" size={28} />
            <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text">
              Your Career Journey
            </h2>
          </div>
          <p className="text-gray-300 leading-relaxed">{introduction}</p>
        </div>
      )}

      {/* Section Cards */}
      {sections.map((section) => (
        <div
          key={section.id}
          className="p-6 border-b border-gray-800 last:border-b-0"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="text-rose-500">{section.icon}</div>
            <h2 className="text-xl font-bold text-transparent bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text">
              {section.title}
            </h2>
          </div>

          {/* Render Markdown content here */}
          <div
            className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: renderContent(section.content), // Rendered HTML from Markdown
            }}
          />
        </div>
      ))}

      {/* Footer */}
      <div className="p-6 bg-gradient-to-r from-[#1A1E27] to-[#161B22] border-t border-gray-800">
        <div className="flex items-center gap-3">
          <Award className="text-orange-500" size={20} />
          <p className="text-gray-400 text-sm">
            Generated with AI for your specific profile and skills
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareerGuidanceDisplay;