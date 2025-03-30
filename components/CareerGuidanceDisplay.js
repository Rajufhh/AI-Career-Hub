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

  // Pre-process content to ensure consistent markdown formatting
  const preprocessContent = (content) => {
    // Convert section headers to markdown headers
    let processedContent = content.replace(
      /([A-Za-z\s]+):/g,
      '**$1:**'
    );
    
    // Convert career option headers with triple asterisks to h4
    processedContent = processedContent.replace(
      /\*\*\*([^*]+)\*\*/g,
      '#### $1'
    );
    
    return processedContent;
  };

  // Apply custom styling to the rendered HTML
  const customizeRenderedHtml = (html) => {
    // Style headers
    let styledHtml = html.replace(
      /<h4>([^<]+)<\/h4>/g,
      '<h4 class="text-xl font-semibold text-rose-500 mt-4 mb-2">$1</h4>'
    );
    
    // Style strong elements (bold text)
    styledHtml = styledHtml.replace(
      /<strong>([^:]+):<\/strong>/g,
      '<span class="text-orange-400 font-semibold">$1:</span>'
    );
    
    // Style list items
    styledHtml = styledHtml.replace(
      /<li>([^<]+)<\/li>/g,
      '<li class="ml-4 my-2">$1</li>'
    );
    
    // Style bullet points
    styledHtml = styledHtml.replace(
      /<ul>/g,
      '<ul class="my-2 space-y-2">'
    );
    
    return styledHtml;
  };

  // Render content using markdown-it
  const renderContent = (content) => {
    const preprocessed = preprocessContent(content);
    const renderedHtml = md.render(preprocessed);
    return customizeRenderedHtml(renderedHtml);
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
            className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: renderContent(section.content),
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