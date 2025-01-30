"use client"

import { signIn } from "next-auth/react"
import { ArrowRight } from "lucide-react"

export default function SignIn() {
  return (
    <div className="min-h-screen bg-dark flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold gradient-text">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{" "}
            <a href="#" className="font-medium gradient-text hover:text-primary-end">
              start your 14-day free trial
            </a>
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={() => signIn("google", { callbackUrl: "/complete-profile" })}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white gradient-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-start transition-all duration-200"
          >
            Sign in with Google
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

