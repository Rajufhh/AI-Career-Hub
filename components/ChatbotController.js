"use client"
import { useEffect, useState } from 'react';
import Script from 'next/script';

const BotpressChatbot = () => {
  const [isScriptsLoaded, setIsScriptsLoaded] = useState(false);

  useEffect(() => {
    // Check if scripts are already loaded to prevent duplicate injection
    if (!window.botpressWebChat && !isScriptsLoaded) {
      const injectScript = document.createElement('script');
      injectScript.src = 'https://cdn.botpress.cloud/webchat/v2.2/inject.js';
      injectScript.async = true;
      injectScript.onload = () => {
        const configScript = document.createElement('script');
        configScript.src = 'https://files.bpcontent.cloud/2025/01/27/19/20250127193107-0FV93D6I.js';
        configScript.async = true;
        configScript.onload = () => setIsScriptsLoaded(true);
        document.body.appendChild(configScript);
      };
      document.body.appendChild(injectScript);
    }

    // Cleanup function
    return () => {
      // Optional: Add cleanup logic if needed when component unmounts
      // For example, you might want to hide the chatbot
      if (window.botpressWebChat) {
        window.botpressWebChat.sendEvent({ type: 'hide' });
      }
    };
  }, []);

  return null; // This component doesn't render any visible elements
};

export default BotpressChatbot;