"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from 'react';

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    if (pathname.includes('/assessments')) {
      const confirmLogout = window.confirm(
        'You are currently in an assessment. If you logout, your progress will be lost. Are you sure you want to logout?'
      );
      
      if (!confirmLogout) {
        return;
      }
    }

    try {
      setIsLoggingOut(true);
      localStorage.removeItem('testResults');
      
      // First navigate to home
      router.push("/");
      
      // Then sign out
      await signOut({ 
        redirect: false,
        callbackUrl: "/"
      });

    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Disable the navbar interactions during logout
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
            <Link href="/" className="flex-shrink-0 bg-white">
              <span className="sr-only">Skill Assessment Platform</span>
              <div className="h-8 w-8 rounded-full gradient-bg"></div>
            </Link>
          </div>
          {session ? (
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:bg-dark hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  href="/assessments"
                  className="text-gray-300 hover:bg-dark hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  Assessments
                </Link>
                <Link
                  href="/counseling"
                  className="text-gray-300 hover:bg-dark hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  Career Counseling
                </Link>
              </div>
            </div>
          ) : null}
          <div className="flex items-center">
            {session ? (
              <>
                <a href="/complete-profile">
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
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90 transition-opacity duration-200"
              >
                Login
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 -mr-1 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg> */}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}