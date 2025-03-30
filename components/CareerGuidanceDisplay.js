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

const CareerGuidanceDisplay = ({ guidance }) => {
  // Function to parse the guidance text into sections
  const parseGuidance = (text) => {
    if (!text) return [];

    // Identify sections based on numbering in the text
    const sections = [
      {
        id: "profile",
        title: "Career Profile Analysis",
        icon: <LineChart size={24} />,
        regex: /1\.\s*Career\s*Profile\s*Analysis/i,
        endRegex: /2\.\s*Recommended\s*Career\s*Paths/i,
      },
      {
        id: "paths",
        title: "Recommended Career Paths",
        icon: <GitBranch size={24} />,
        regex: /2\.\s*Recommended\s*Career\s*Paths/i,
        endRegex: /3\.\s*Skill\s*Development\s*Roadmap/i,
      },
      {
        id: "skills",
        title: "Skill Development Roadmap",
        icon: <BarChart size={24} />,
        regex: /3\.\s*Skill\s*Development\s*Roadmap/i,
        endRegex: /4\.\s*Career\s*Progression\s*Timeline/i,
      },
      {
        id: "timeline",
        title: "Career Progression Timeline",
        icon: <Rocket size={24} />,
        regex: /4\.\s*Career\s*Progression\s*Timeline/i,
        endRegex: /5\.\s*Additional\s*Recommendations/i,
      },
      {
        id: "additional",
        title: "Additional Recommendations",
        icon: <Globe size={24} />,
        regex: /5\.\s*Additional\s*Recommendations/i,
        endRegex: /$/,
      },
    ];

    // Extract content for each section
    const parsedSections = [];

    sections.forEach((section, index) => {
      const startMatch = text.match(section.regex);
      if (!startMatch) return;

      const startIndex = startMatch.index;

      let endIndex;
      const endMatch = text.match(section.endRegex);
      if (endMatch && index < sections.length - 1) {
        endIndex = endMatch.index;
      } else {
        endIndex = text.length;
      }

      let content = text.substring(startIndex, endIndex).trim();

      // Remove the section title from the content
      const titleEndIndex = content.indexOf("\n");
      if (titleEndIndex !== -1) {
        content = content.substring(titleEndIndex).trim();
      }

      parsedSections.push({
        ...section,
        content,
      });
    });

    // If no sections were found, just return the original text
    if (parsedSections.length === 0) {
      return [
        {
          id: "full",
          title: "Career Guidance",
          icon: <Briefcase size={24} />,
          content: text,
        },
      ];
    }

    return parsedSections;
  };

  const introRegex = /^(.*?)(?=1\.\s*Career\s*Profile\s*Analysis)/s;
  const introMatch = guidance?.match(introRegex);
  const introduction = introMatch ? introMatch[0].trim() : "";

  const sections = parseGuidance(guidance);

  // Format content with proper styling
  const formatContent = (content) => {
    // Clean up the content first - remove any "N" artifacts that might be in the text
    let cleanedContent = content.replace(/\*\*N\*\*\s*/g, "");

    // Replace subsection headers with styled versions
    let formattedContent = cleanedContent.replace(
      /([A-Za-z\s]+):/g,
      '<span class="text-orange-400 font-semibold">$1:</span>'
    );

    // Handle career path options with asterisks (***Option Name**) and format them properly
    formattedContent = formattedContent.replace(
      /\*\*\*([^*]+)\*\*/g,
      '<h4 class="text-xl font-semibold text-rose-500 mt-4 mb-2">$1:</h4>'
    );

    // Handle bold text with double asterisks that's not part of a header
    formattedContent = formattedContent.replace(
      /\*\*([^*:]+)\*\*/g,
      '<span class="font-semibold text-white">$1</span>'
    );

    // Handle experience level, salary range, etc. with single dash (-)
    formattedContent = formattedContent.replace(
      /-\*\*([^:]+):\*\*/g,
      '<div class="ml-4 my-2"><span class="text-orange-400 font-semibold">$1:</span>'
    );

    // Handle bullet points with dashes
    formattedContent = formattedContent.replace(
      /• ([^\n]+)/g,
      '<div class="flex items-start my-2 ml-4"><div class="text-orange-400 mr-2">•</div><div>$1</div></div>'
    );

    // Close any divs opened by the previous regex
    formattedContent = formattedContent.replace(/\n/g, "</div>\n");

    // Convert blank lines to paragraph breaks
    formattedContent = formattedContent.replace(
      /\n\n/g,
      '</p><p class="my-3">'
    );

    return formattedContent;
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

          <div
            className="text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: `<p>${formatContent(section.content)}</p>`,
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
