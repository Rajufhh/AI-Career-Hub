import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/providers";
import { Navbar } from "@/components/Navbar";
import AnimatedWrapper from "@/components/AnimatedWrapper"; // Import the client component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI-Powered Skill Assessment Platform",
  description: "Assess your skills and get AI-powered career guidance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Navbar />
          <AnimatedWrapper>{children}</AnimatedWrapper> {/* Wrap the app with animation */}
        </AuthProvider>
      </body>
    </html>
  );
}
