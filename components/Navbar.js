import Link from "next/link"
import { Search } from "lucide-react"

export function Navbar() {
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
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-300 hover:bg-dark hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                href="/assessments"
                className="text-gray-300 hover:bg-dark hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Assessments
              </Link>
              <Link
                href="/counseling"
                className="text-gray-300 hover:bg-dark hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Career Counseling
              </Link>
            </div>
          </div>
          <div className="flex items-center">
          <a href="/complete-profile">
            <button className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-dark transition-colors duration-200">
              <img
                src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" // Replace this with the profile picture URL
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
            </button>
          </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

