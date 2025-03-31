"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqItems = [
    {
      question: "What is this platform, and what is its purpose?",
      answer:
        "This platform is an AI-driven career guidance hub designed to help users with skill assessment, resume and cover letter generation, mock interviews, and personalized counseling. It aims to provide tailored career recommendations based on individual skills and market trends.",
    },
    {
      question: "How does the proctored skill assessment ensure fairness and accuracy?",
      answer:
        "The proctored assessment uses AI-powered monitoring to prevent dishonest practices and ensure a fair evaluation of your skills. The test adapts to your level of expertise and provides an unbiased score based on your actual performance. This helps in accurately mapping your abilities to suitable career opportunities.",
    },
    {
      question: "Can I generate a resume and cover letter tailored to specific job applications?",
      answer:
        "Yes! Our Resume Analyzer evaluates your resume based on the job description, providing a score along with good and bad points for improvement. Additionally, our Cover Letter Generator allows you to create a cover letter in two ways—one based on the job description and another based on the company name.",
    },
    {
      question: "What support options are available if I have doubts or need guidance?",
      answer:
        "We offer a 24/7 AI-powered chatbot to answer your career-related queries instantly. Additionally, you can book a one-on-one session with an industry expert for personalized guidance.",
    },
    {
      question: "How do live mock interviews help in preparing for real job interviews?",
      answer:
        "Our AI-driven mock interview simulates real interview scenarios based on your chosen job role and experience level. It provides real-time feedback on your responses.",
    },
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="bg-[#161B22] p-8 shadow-lg mt-12">

    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
            Frequently Asked Questions
          </span>
        </h1>
      </div>

      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <motion.div
            key={index}
            className={`rounded-lg overflow-hidden ${openIndex === index ? "gradient-border" : "bg-[#0D1117]"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut",
            }}
          >
            {openIndex === index ? (
              <div className="p-[2px] bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] rounded-lg">
                <div className="bg-[#161B22] rounded-lg">
                  <button
                    className="w-full p-6 text-left flex justify-between items-center focus:outline-none"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="text-lg md:text-xl font-medium text-white">{item.question}</span>
                    <motion.div animate={{ rotate: 180 }} transition={{ duration: 0.4 }}>
                      <ChevronDown className="h-6 w-6 text-white" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: {
                          height: {
                            duration: 0.4,
                            ease: [0.04, 0.62, 0.23, 0.98],
                          },
                          opacity: {
                            duration: 0.25,
                            delay: 0.15,
                          },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: {
                            duration: 0.3,
                          },
                          opacity: {
                            duration: 0.25,
                          },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-gray-300">{item.answer}</div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <button
                className="w-full p-6 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg md:text-xl font-medium text-white">{item.question}</span>
                <motion.div animate={{ rotate: 0 }} transition={{ duration: 0.4 }}>
                  <ChevronDown className="h-6 w-6 text-white" />
                </motion.div>
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
    </div>
  )
}
