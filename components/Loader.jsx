"use client";

import React from "react";

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center">
      <div className="w-16 h-16 mb-8">
        <svg
          className="animate-spin h-16 w-16 text-[#E31D65]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2 text-center">
        <span className="bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
          {message}
        </span>
      </h2>
    </div>
  );
}