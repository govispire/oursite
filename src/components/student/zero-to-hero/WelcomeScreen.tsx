import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUpDown, Target, Trophy, Zap } from 'lucide-react';
import { useZeroToHero } from '@/hooks/useZeroToHero';

const WelcomeScreen = () => {
  const { startJourney } = useZeroToHero();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Card className="bg-white shadow-xl border-0">
        <CardContent className="p-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-4">
              <TrendingUpDown className="h-12 w-12 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900">
              Transform Your Weakness into Strength!
            </h1>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Welcome to the <span className="font-semibold text-blue-600">Zero to Hero Pathway</span> - 
              a personalized learning journey designed to help you master any topic, from basics to advanced level.
            </p>

            <div className="grid md:grid-cols-3 gap-6 py-8">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto flex items-center justify-center">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Goal-Oriented</h3>
                <p className="text-sm text-gray-600">Choose your duration and stay focused</p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl mx-auto flex items-center justify-center">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Adaptive Learning</h3>
                <p className="text-sm text-gray-600">Content adjusts to your progress</p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-green-100 rounded-2xl mx-auto flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Track & Reward</h3>
                <p className="text-sm text-gray-600">Earn badges and certificates</p>
              </div>
            </div>

            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-lg"
              onClick={startJourney}
            >
              Start My Journey
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">What You'll Get</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                <span>Structured daily learning plan with videos, quizzes & tests</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                <span>Real-time progress tracking and analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                <span>Personalized weak area improvement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                <span>Gamified rewards and achievement badges</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">How It Works</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">1.</span>
                <span>Select your goal duration (5, 10, or 30 days)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">2.</span>
                <span>Choose subjects and mark your weak areas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">3.</span>
                <span>Complete daily structured tasks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">4.</span>
                <span>Track progress and earn rewards</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeScreen;
