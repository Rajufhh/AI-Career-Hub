import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
              Unlock Your Potential with AI-Powered Assessments
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Discover your strengths, improve your skills, and get personalized career guidance with our cutting-edge
              platform.
            </p>
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90 transition-opacity duration-200"
            >
              Get Started
              <svg
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
              </svg>
            </Link>
          </div>
          <div className="lg:w-1/2">
            <div className="w-full h-96 bg-[#161B22] rounded-lg shadow-lg flex items-center justify-center">
              <span className="text-4xl bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
                3D Graphic Placeholder
              </span>
            </div>
          </div>
        </div>
      </main>
      <section className="bg-[#161B22] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {["AI-Proctored Assessments", "Personalized Career Guidance", "Real-Time Progress Tracking"].map(
              (feature, index) => (
                <div
                  key={index}
                  className="bg-[#0D1117] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-semibold mb-4 text-white">{feature}</h3>
                  <p className="text-gray-400">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

