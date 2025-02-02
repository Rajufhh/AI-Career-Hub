"use client"
import React, { useState, useEffect } from 'react';
// import { Briefcase } from 'lucide-react';
import MarkdownIt from 'markdown-it';
import { ProtectedRoute } from "@/services/routeProtectionService";
import ChatbotController from '@/components/ChatbotController';

function CareerGuidance() {
  const [counsellingText, setCounsellingText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  });

  useEffect(() => {
    const fetchGuidance = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/career-guidance');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch career guidance');
        }

        setCounsellingText(data.guidance);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGuidance();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0D1117] text-gray-200 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            {/* <Briefcase className="w-8 h-8 text-rose-600" /> */}
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text">
              Career Counselling
            </h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          <div className="bg-[#161B22] rounded-lg p-6 shadow-xl border border-orange-600">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">
              Professional Guidance
            </h2>
            <div className="prose prose-invert max-w-none">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-rose-600" />
                </div>
              ) : (
                <div 
                  className="text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: md.render(counsellingText) 
                  }}
                />
              )}
            </div>
          </div>
        </div>
        
        {/* Add ChatbotController component */}
        <ChatbotController />
      </div>
    </ProtectedRoute>
  );
}

export default CareerGuidance;