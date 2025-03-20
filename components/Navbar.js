"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import Image from "next/image";
import { Brain } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  if (isLoggingOut) {
    return (
      <nav className="bg-dark-lighter">
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
    <nav className="bg-dark-lighter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="sr-only">Skill Assessment Platform</span>
              <Brain className="h-10 w-10 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] rounded-lg p-1" />
            </Link>
          </div>

          {session && (
            <>
              {/* Desktop Menu */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    href="/dashboard"
                    className="text-gray-300 hover:bg-dark hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/resume-analyze"
                    className="text-gray-300 hover:bg-dark hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    Resume Analysis
                  </Link>
                  <Link
                    href="/counseling"
                    className="text-gray-300 hover:bg-dark hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    Career Counseling
                  </Link>
                  <Link
                    href="/cover-letter"
                    className="text-gray-300 hover:bg-dark hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    Cover Letter
                  </Link>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="text-gray-300 hover:text-white p-2"
                >
                  <Menu size={24} />
                </button>
              </div>
            </>
          )}

          <div className="flex items-center">
            {session ? (
              <>
                <a
                  href={
                    session.user.profileCompleted
                      ? "/profile"
                      : "/complete-profile"
                  }
                >
                  <button className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-dark transition-colors duration-200">
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="h-11 w-11 m-3 rounded-full object-cover"
                    />
                  </button>
                </a>
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
                onClick={() => signIn("google")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90 transition-opacity duration-200"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {session && isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-dark-lighter">
              <Link
                href="/dashboard"
                className="text-gray-300 hover:bg-dark hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/resume-analyze"
                className="text-gray-300 hover:bg-dark hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Resume Analysis
              </Link>
              <Link
                href="/counseling"
                className="text-gray-300 hover:bg-dark hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Career Counseling
              </Link>
              <Link
                href="/cover-letter"
                className="text-gray-300 hover:bg-dark hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cover Letter
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
