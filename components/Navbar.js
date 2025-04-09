"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isJobDropdownOpen, setIsJobDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsJobDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    if (pathname.includes("/assessments")) {
      const confirmLogout = window.confirm(
        "You are currently in an assessment. If you logout, your progress will be lost. Are you sure you want to logout?"
      );

      if (!confirmLogout) {
        return;
      }
    }

    try {
      setIsLoggingOut(true);
      localStorage.removeItem("testResults");
      router.push("/");
      await signOut({
        redirect: false,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Error during sign out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path) => {
    if (session) {
      router.push(path);
    } else {
      router.push("/auth/signin");
    }
    setIsMobileMenuOpen(false);
  };

  if (isLoggingOut) {
    return (
      <nav className="bg-black fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white">
                <span className="sr-only">Skill Assessment Platform</span>
                <div className="h-8 w-8 rounded-full gradient-bg"></div>
              </div>
            </div>
            <div className="text-gray-300">Logging out...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-black shadow-md top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="sr-only">Skill Assessment Platform</span>
              <Brain className="h-10 w-10 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] rounded-lg p-1" />
            </Link>
          </div>

          {/* Desktop Menu - Always visible */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {session && (
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:bg-gray-900 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/beginners"
                className="text-gray-300 hover:bg-gray-900 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                Beginners
              </Link>
              <button
                onClick={() => handleNavigation("/mentoring")}
                className="text-gray-300 hover:bg-gray-900 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                Mentoring
              </button>
              <button
                onClick={() => handleNavigation("/counseling")}
                className="text-gray-300 hover:bg-gray-900 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                Career Counseling
              </button>
              <button
                onClick={() => handleNavigation("/interview-landing")}
                className="text-gray-300 hover:bg-gray-900 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                Interviewer
              </button>
              <div
                className="relative"
                ref={dropdownRef}
                onMouseEnter={() => setIsJobDropdownOpen(true)}
                onMouseLeave={() => setIsJobDropdownOpen(false)}
              >
                <button className="text-gray-300 hover:bg-gray-900 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center">
                  Job Specific
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <AnimatePresence>
                  {isJobDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-black py-1 z-10"
                    >
                      <button
                        onClick={() => handleNavigation("/resume-analyze")}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-900 hover:text-white w-full text-center"
                      >
                        Resume Analysis
                      </button>
                      <button
                        onClick={() => handleNavigation("/cover-letter")}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-900 hover:text-white w-full text-center"
                      >
                        Cover Letter
                      </button>
                      <button
                        onClick={() => handleNavigation("/linkedin-analyze")}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-900 hover:text-white w-full text-center"
                      >
                        LinkedIn Analysis
                      </button>
                      <button
                        onClick={() => handleNavigation("/job-scraper")}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-900 hover:text-white w-full text-center"
                      >
                        Job Scraper
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex-1 flex justify-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center">
            {session ? (
              <>
                <Link
                  href="#"
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      const response = await fetch(
                        `/api/get-user?email=${session.user.email}`
                      );
                      const userData = await response.json();
                      if (userData && userData.username) {
                        router.push("/profile");
                      } else {
                        router.push("/complete-profile");
                      }
                    } catch (error) {
                      console.error("Error checking profile:", error);
                      router.push("/complete-profile");
                    }
                  }}
                >
                  <button className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-gray-900 transition-colors duration-200">
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="h-11 w-11 m-3 rounded-full object-cover"
                    />
                  </button>
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90 transition-opacity duration-200"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push("/auth/signin")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90 transition-opacity duration-200"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-black">
                {session && (
                  <Link
                    href="/dashboard"
                    className="text-gray-300 hover:bg-gray-900 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/beginners"
                  className="text-gray-300 hover:bg-gray-900 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Beginners
                </Link>

                {session && (
                  <Link
                    href="/mentoring"
                    className="text-gray-300 hover:bg-gray-900 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Mentoring
                  </Link>
                )}

                {session && (
                  <Link
                    href="/counseling"
                    className="text-gray-300 hover:bg-gray-900 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Career Counseling
                  </Link>
                )}

                {session && (
                  <Link
                    href="/interview-landing"
                    className="text-gray-300 hover:bg-gray-900 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Interviewer
                  </Link>
                )}

                {/* <button
                  onClick={() => handleNavigation("/counseling")}
                  className="text-gray-300 hover:bg-gray-900 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 w-full text-left"
                >
                  Career Counseling
                </button> */}
                {/* <button
                  onClick={() => handleNavigation("/interview-landing")}
                  className="text-gray-300 hover:bg-gray-900 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 w-full text-left"
                >
                  Interviewer
                </button> */}
                <div className="text-gray-300 px-3 py-2 rounded-md text-base font-medium">
                  Job Specific:
                </div>
                <div className="pl-4">
                  <button
                    onClick={() => handleNavigation("/resume-analyze")}
                    className="text-gray-300 hover:bg-gray-900 hover:text-white block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 w-full text-center"
                  >
                    Resume Analysis
                  </button>
                  <button
                    onClick={() => handleNavigation("/cover-letter")}
                    className="text-gray-300 hover:bg-gray-900 hover:text-white block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 w-full text-center"
                  >
                    Cover Letter
                  </button>
                  <button
                    onClick={() => handleNavigation("/linkedin-analyze")}
                    className="text-gray-300 hover:bg-gray-900 hover:text-white block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 w-full text-center"
                  >
                    LinkedIn Analysis
                  </button>
                  <button
                    onClick={() => handleNavigation("/job-scraper")}
                    className="text-gray-300 hover:bg-gray-900 hover:text-white block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 w-full text-center"
                  >
                    Job Scraper
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
