
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Award } from 'lucide-react';

interface WelcomeBannerProps {
  name: string;
  targetExam?: string;
  performanceLevel?: number; // 0-100 score to determine level
  children?: React.ReactNode;
}

// Level system based on performance
const getLevelInfo = (score: number = 0) => {
  if (score >= 90) return { tier: 'Expert', name: 'Legend', color: 'from-purple-500 to-pink-500' };
  if (score >= 85) return { tier: 'Expert', name: 'Phoenix', color: 'from-purple-500 to-pink-500' };
  if (score >= 80) return { tier: 'Expert', name: 'Ace', color: 'from-purple-500 to-pink-500' };
  if (score >= 75) return { tier: 'Advanced', name: 'Champion', color: 'from-blue-500 to-cyan-500' };
  if (score >= 70) return { tier: 'Advanced', name: 'Conqueror', color: 'from-blue-500 to-cyan-500' };
  if (score >= 65) return { tier: 'Advanced', name: 'Titan', color: 'from-blue-500 to-cyan-500' };
  if (score >= 60) return { tier: 'Advanced', name: 'Maverick', color: 'from-blue-500 to-cyan-500' };
  if (score >= 55) return { tier: 'Intermediate', name: 'Rising Star', color: 'from-green-500 to-emerald-500' };
  if (score >= 50) return { tier: 'Intermediate', name: 'Gladiator', color: 'from-green-500 to-emerald-500' };
  if (score >= 45) return { tier: 'Intermediate', name: 'Challenger', color: 'from-green-500 to-emerald-500' };
  if (score >= 40) return { tier: 'Intermediate', name: 'Warrior', color: 'from-green-500 to-emerald-500' };
  if (score >= 30) return { tier: 'Beginner', name: 'Pathfinder', color: 'from-orange-500 to-amber-500' };
  if (score >= 20) return { tier: 'Beginner', name: 'Starter', color: 'from-orange-500 to-amber-500' };
  if (score >= 10) return { tier: 'Beginner', name: 'Seeker', color: 'from-orange-500 to-amber-500' };
  return { tier: 'Beginner', name: 'Novice', color: 'from-orange-500 to-amber-500' };
};

const WelcomeBanner = ({ name, targetExam = 'IBPS PO', performanceLevel = 45, children }: WelcomeBannerProps) => {
  const levelInfo = getLevelInfo(performanceLevel);
  
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl font-bold text-gray-900">
              Welcome, {name}!
            </h1>
            <div className={`bg-gradient-to-r ${levelInfo.color} text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md`}>
              <Award className="h-3 w-3" />
              {levelInfo.name}
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Track your preparation progress and upcoming exams.
          </p>
          
          <div className="flex flex-wrap gap-2 items-center">
            <div className="bg-blue-50 text-blue-700 text-xs py-1 px-3 rounded-full font-medium border border-blue-200">
              🎯 Target: {targetExam}
            </div>
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {levelInfo.tier} Level
            </div>
          </div>
        </div>
        
        <div className="w-20 h-20 rounded-full border-4 border-gray-200 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 shrink-0">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed={name}" 
            alt="Student" 
            className="w-16 h-16 rounded-full"
          />
        </div>
      </div>
      
      {/* Stat Cards */}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default WelcomeBanner;
