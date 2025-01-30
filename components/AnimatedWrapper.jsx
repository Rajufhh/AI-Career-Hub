"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation"; // Detect route changes

export default function AnimatedWrapper({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname(); // Get the current route

  useEffect(() => {
    setIsVisible(false); // Hide before animation starts
    const timeout = setTimeout(() => setIsVisible(true), 50); // Delay to allow re-animation
    return () => clearTimeout(timeout);
  }, [pathname]); // Re-run animation when route changes

  return (
    <motion.div
      key={pathname} // Force re-animation when route changes
      initial={{ opacity: 0, scale: 1.0 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.3, ease: "easeIn" }}
    >
      {children}
    </motion.div>
  );
}
