import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/providers";
import { Navbar } from "@/components/Navbar";
import AnimatedWrapper from "@/components/AnimatedWrapper";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Career Hub",
  description: "Assess your skills and get AI-powered career guidance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Botpress Webchat Scripts */}
        <Script src="https://cdn.botpress.cloud/webchat/v2.2/inject.js" strategy="afterInteractive" />
        <Script src="https://files.bpcontent.cloud/2025/01/27/19/20250127193107-0FV93D6I.js" strategy="afterInteractive" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          <AnimatedWrapper>{children}</AnimatedWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
