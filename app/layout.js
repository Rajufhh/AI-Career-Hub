import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
// import { AuthProvider } from "@/providers";
import { Navbar } from "@/components/Navbar";

// Define Geist fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for the application
export const metadata = {
  title: "AI-Powered Skill Assessment Platform",
  description: "Assess your skills and get AI-powered career guidance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <AuthProvider> */}
          <Navbar />
          {children}
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
