"use client";
const features = [
  {
    title: "Proctored Assessments",
    description:
      "Take industry-standard skill assessments in a secure environment. Our AI-powered proctoring ensures credibility while you showcase your expertise to potential employers.",
  },
  {
    title: "Personalized Career Guidance",
    description:
      "Receive tailored career recommendations based on your skills, interests, and market demands. Our AI analyzes thousands of career paths to find your perfect match.",
  },
  {
    title: "Resume Analyzer",
    description:
      "Get instant feedback on your resume with our AI-powered analysis tool. Improve your resume's impact with suggestions for keywords, formatting, and content optimization.",
  },
];

export default function Features() {
  return (
    <section className="bg-[#161B22] py-32">
      <div className="container mx-auto px-8">
        <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r pb-6 from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#0D1117] p-6 rounded-lg w-full h-full shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <h3 className="text-xl font-bold mb-4 pb-3 text-yellow-400">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
