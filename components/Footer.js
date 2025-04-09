"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  Briefcase,
  GraduationCap,
  Users,
  MessageSquare,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  ChevronUp,
} from "lucide-react";

function FooterLink({ href, children, icon }) {
  return (
    <li>
      <Link href={href} passHref legacyBehavior>
        <motion.a
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
          {children}
        </motion.a>
      </Link>
    </li>
  );
}

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative bg-[#0D1117] text-gray-300">
      <div className="h-1 w-full bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
          animate={{ x: ["0%", "100%"] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
              <Brain className="h-10 w-10 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] rounded-lg p-1 mr-2" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] bg-clip-text text-transparent">
                  AI Career Hub
                </h2>
              </div>
              <p className="mb-4 text-gray-400 max-w-md">
                Unlock your potential with AI-powered career guidance. We help our users discover their strengths, improve their skills,
                and find their perfect career path.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, color: "#1DA1F2" }}
                  transition={{ duration: 0.2 }}
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </motion.a>
                <motion.a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, color: "#0A66C2" }}
                  transition={{ duration: 0.2 }}
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </motion.a>
                <motion.a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, color: "#ffffff" }}
                  transition={{ duration: 0.2 }}
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </motion.a>
                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, color: "#E1306C" }}
                  transition={{ duration: 0.2 }}
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </motion.a>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
            <ul className="space-y-2">
              <FooterLink
                href="/resume-analyze"
                icon={<Briefcase className="h-4 w-4 mr-2" />}
              >
                Resume Analysis
              </FooterLink>
              <FooterLink
                href="/interview-landing"
                icon={<MessageSquare className="h-4 w-4 mr-2" />}
              >
                AI Interviewer
              </FooterLink>
              <FooterLink
                href="/cover-letter"
                icon={<GraduationCap className="h-4 w-4 mr-2" />}
              >
                Cover Letter Generator
              </FooterLink>
              <FooterLink
                href="/mentoring"
                icon={<Users className="h-4 w-4 mr-2" />}
              >
                1:1 Mentoring
              </FooterLink>
              <FooterLink
                href="/job-scraper"
                icon={<Briefcase className="h-4 w-4 mr-2" />}
              >
                Job Scraper
              </FooterLink>
              <FooterLink
                href="/counseling"
                icon={<Users className="h-4 w-4 mr-2" />}
              >
                Career Counseling
              </FooterLink>
              <FooterLink
                href="/dashboard"
                icon={<Brain className="h-4 w-4 mr-2" />}
              >
                Skill Tests
              </FooterLink>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white">About Us</h3>
            <ul className="space-y-2">
              {/* <FooterLink href="/about">About Us</FooterLink> */}
              <FooterLink href="/team">Our Team</FooterLink>
              {/* <FooterLink href="/careers">Careers</FooterLink> */}
              <FooterLink href="/contact">Contact</FooterLink>
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} AI Career Hub. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
            {/* <Link
              href="/cookies"
              className="hover:text-white transition-colors"
            >
              Cookies
            </Link> */}
          </div>
        </motion.div>
      </div>

      <motion.button
        onClick={scrollToTop}
        className={`fixed left-6 bottom-6 p-2 rounded-full bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white shadow-lg z-50 ${
          isVisible ? "flex" : "hidden"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 0.5 : 0.5,
        }}
        transition={{ duration: 0.2 }}
      >
        <ChevronUp className="h-10 w-10" />
      </motion.button>
    </footer>
  );
}