import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-[#161B22] py-20">
      <div className="container mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text mb-10">
          Ready to Start Your Journey?
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-12">
          Join thousands of professionals who've found their perfect career path with AI Career Hub.
        </p>
        <Link
          href="/auth/signin"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base sm:text-lg font-medium rounded-md text-white bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] hover:opacity-90 transition-opacity duration-200"
        >
          Begin Your Career Journey
        </Link>
      </div>
    </section>
  );
}
