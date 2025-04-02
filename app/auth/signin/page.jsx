"use client";

import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Sign in to continue your career journey
          </p>
        </div>

        <div className="mt-12 space-y-6">
          <button
            onClick={() =>
              signIn("google", { callbackUrl: "/complete-profile" })
            }
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-full shadow-lg text-base font-medium text-white bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:shadow-pink-500/30 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Google Logo SVG in white */}
            <svg
              className="w-5 h-5 mr-3 relative z-10 group-hover:opacity-90 transition-opacity"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z"
                fill="white"
              />
              <path
                d="M12.24 24.0008C15.4764 24.0008 18.2058 22.9382 20.1944 21.1039L16.3274 18.1055C15.2516 18.8375 13.8626 19.252 12.24 19.252C9.07106 19.252 6.39544 17.1399 5.44695 14.3003H1.45178V17.3912C3.45172 21.4434 7.55428 24.0008 12.24 24.0008Z"
                fill="white"
              />
              <path
                d="M5.44084 14.3003C5.20365 13.5681 5.07247 12.7862 5.07247 12.0008C5.07247 11.2154 5.20365 10.4335 5.44084 9.70131V6.61041H1.44567C0.557285 8.23131 0.0605469 10.0665 0.0605469 12.0008C0.0605469 13.9351 0.557285 15.7703 1.44567 17.3912L5.44084 14.3003Z"
                fill="white"
              />
              <path
                d="M12.24 4.74966C14.0351 4.74966 15.6563 5.36715 16.9483 6.58641L20.3717 3.12296C18.1996 1.18907 15.4706 0.000793457 12.24 0.000793457C7.55428 0.000793457 3.45172 2.55822 1.45178 6.61038L5.44695 9.70127C6.39544 6.86173 9.07106 4.74966 12.24 4.74966Z"
                fill="white"
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="12.24"
                  y1="9.83807"
                  x2="23.766"
                  y2="21.1039"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#E31D65" />
                  <stop offset="1" stopColor="#FF6B2B" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear"
                  x1="1.45178"
                  y1="14.3003"
                  x2="20.1944"
                  y2="24.0008"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#E31D65" />
                  <stop offset="1" stopColor="#FF6B2B" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear"
                  x1="0.0605469"
                  y1="6.61041"
                  x2="5.44084"
                  y2="17.3912"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#E31D65" />
                  <stop offset="1" stopColor="#FF6B2B" />
                </linearGradient>
                <linearGradient
                  id="paint3_linear"
                  x1="1.45178"
                  y1="0.000793457"
                  x2="20.3717"
                  y2="6.58641"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#E31D65" />
                  <stop offset="1" stopColor="#FF6B2B" />
                </linearGradient>
              </defs>
            </svg>

            <span className="relative z-10">Continue with Google</span>
          </button>

          <p className="text-center text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="text-[#E31D65] hover:text-[#FF6B2B] transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-[#E31D65] hover:text-[#FF6B2B] transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
