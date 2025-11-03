
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const MentorshipSelection = () => {
  const navigate = useNavigate();

  const handleProceed = () => {
    navigate('/student/mentorship/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Mentorship
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get expert guidance from our mentors across all available exam categories. Start your journey to success today!
          </p>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <button
            onClick={handleProceed}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg rounded-lg font-medium transition-all duration-200"
          >
            Explore Mentorship Programs
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorshipSelection;
