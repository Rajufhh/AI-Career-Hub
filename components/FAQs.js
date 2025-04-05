"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  const faqItems = [
    // Page 1
    {
      question: "What is this platform, and what is its purpose?",
      answer:
        "This platform is an AI-driven career guidance hub designed to help users with skill assessment, resume and cover letter generation, mock interviews, and personalized counseling. It aims to provide tailored career recommendations based on individual skills and market trends.",
    },
    {
      question:
        "How does the proctored skill assessment ensure fairness and accuracy?",
      answer:
        "The proctored assessment uses AI-powered monitoring to prevent dishonest practices and ensure a fair evaluation of your skills. The test adapts to your level of expertise and provides an unbiased score based on your actual performance. This helps in accurately mapping your abilities to suitable career opportunities.",
    },
    {
      question:
        "Can I generate a resume and cover letter tailored to specific job applications?",
      answer:
        "Yes! Our Resume Analyzer evaluates your resume based on the job description, providing a score along with good and bad points for improvement. Additionally, our Cover Letter Generator allows you to create a cover letter in two ways—one based on the job description and another based on the company name.",
    },
    {
      question:
        "What support options are available if I have doubts or need guidance?",
      answer:
        "We offer a 24/7 AI-powered chatbot to answer your career-related queries instantly. Additionally, you can book a one-on-one session with an industry expert for personalized guidance.",
    },
    {
      question:
        "How do live mock interviews help in preparing for real job interviews?",
      answer:
        "Our AI-driven mock interview simulates real interview scenarios based on your chosen job role and experience level. It provides real-time feedback on your responses.",
    },

    // Page 2
    {
      question: "Is there a chatbot available on the website?",
      answer:
        "Yes, there's a chatbot available in the bottom right corner to help answer your questions instantly.",
    },
    {
      question: "Do I need to login to access the Beginner section?",
      answer:
        "No, the Beginner section is accessible without login, but you'll need to sign in for personalized results.",
    },
    {
      question: "Can I access the platform on mobile devices?",
      answer:
        "Yes, the platform is fully responsive with dedicated mobile interfaces, as shown by the Mobile Preview for the cover letter generator.",
    },
    {
      question: "Is there a cost to use the platform?",
      answer: "No, there is no cost of using this platform.",
    },
    {
      question: "Is my data secure on the website?",
      answer:
        "Yes, we take your privacy seriously. All your data is protected and used only for improving your experience.",
    },

    // Page 3
    {
      question: "What can the chatbot help me with?",
      answer:
        "Our chatbot can answer your queries, guide you through plans, and help you understand services like career counselling and assessments.",
    },
    {
      question: "Can I ask about different plans through the chatbot?",
      answer:
        "Just type your query and the chatbot will assist you with available plans and features.",
    },
    {
      question: "Are there any prerequisites for career counseling?",
      answer:
        "Yes, you need to complete the skill assessment test before accessing the career counseling features.",
    },
    {
      question: "How do I sign up on the website?",
      answer:
        "Click on the Login/Sign Up button at the top right corner of the website and fill in the required details to get started.",
    },
    {
      question: "Do you have any job listing feature on the website?",
      answer:
        "Yes, we have a Job Scraper that shows job links posted in the last 24 hours, based on availability and your preferences.",
    },
  ];

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = faqItems.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );
  const totalPages = Math.ceil(faqItems.length / questionsPerPage);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const changePage = (pageNumber) => {
    setOpenIndex(null);
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-[#161B22] p-8 shadow-lg mt-12">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
              Frequently Asked Questions
            </span>
          </h1>
        </div>

        <div className="space-y-4">
          {currentQuestions.map((item, index) => (
            <div
              key={index}
              className={`rounded-lg overflow-hidden ${
                openIndex === index ? "gradient-border" : "bg-[#0D1117]"
              }`}
            >
              {openIndex === index ? (
                <div className="p-[2px] bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] rounded-lg">
                  <div className="bg-[#161B22] rounded-lg">
                    <button
                      className="w-full p-6 text-left flex justify-between items-center focus:outline-none"
                      onClick={() => toggleFAQ(index)}
                    >
                      <span className="text-lg md:text-xl font-medium text-white">
                        {item.question}
                      </span>
                      <motion.div
                        animate={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="h-6 w-6 text-white" />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 text-sm sm:text-base text-gray-300">
                          {item.answer}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <button
                  className="w-full p-6 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-lg md:text-xl font-medium text-white">
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-6 w-6 text-white" />
                  </motion.div>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="inline-flex p-1 bg-[#0D1117] rounded-lg">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => changePage(page)}
                className={`px-4 py-2 mx-1 rounded-md text-sm font-medium transition-all duration-300 relative ${
                  currentPage === page
                    ? "text-white bg-gradient-to-r from-[#E31D65] to-[#FF6B2B]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
