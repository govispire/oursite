import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Target, 
  Lock, 
  Unlock, 
  Trophy, 
  TrendingUp, 
  Brain,
  CheckCircle2,
  ArrowRight,
  Zap,
  Star
} from 'lucide-react';
import { useZeroToHero } from '@/hooks/useZeroToHero';
import { motion } from 'framer-motion';

const WelcomeScreen = () => {
  const { startJourney } = useZeroToHero();

  const steps = [
    {
      icon: Target,
      title: 'Pick Weak Areas',
      description: 'Select chapters you struggle with',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Lock,
      title: 'Lock Your Period',
      description: 'Commit to 5, 10, or 15 days',
      color: 'bg-amber-100 text-amber-600'
    },
    {
      icon: Brain,
      title: 'Progressive Learning',
      description: 'Video → Quiz → PDF (unlock step by step)',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Unlock,
      title: 'Unlock Mastery',
      description: 'Complete all tasks to master the topic',
      color: 'bg-primary/20 text-primary'
    }
  ];

  const benefits = [
    { icon: CheckCircle2, text: 'Structured learning path' },
    { icon: TrendingUp, text: 'Track your progress daily' },
    { icon: Trophy, text: 'Earn XP & climb leaderboard' },
    { icon: Zap, text: 'Focus only on what matters' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
          <Star className="h-4 w-4" />
          Transform Your Weaknesses Into Strengths
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Master Any Topic in <br />
          <span className="text-primary">Just 5-15 Days</span>
        </h1>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Stop wasting time on topics you've already mastered. Lock your weak areas, 
          follow our structured path, and unlock mastery with guaranteed results.
        </p>

        <Button 
          size="lg" 
          onClick={startJourney}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all group"
        >
          Start Your Mastery Journey
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          How It Works
        </h2>
        
        <div className="grid md:grid-cols-4 gap-4">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <Card key={index} className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-5 text-center">
                  {/* Step Number */}
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                    {index + 1}
                  </div>
                  
                  <div className={`w-14 h-14 rounded-xl ${step.color} flex items-center justify-center mx-auto mb-3`}>
                    <StepIcon className="h-7 w-7" />
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.description}</p>
                  
                  {/* Connector Arrow (except last) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-4 w-4 text-gray-300" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6"
      >
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Why This Works</h3>
            <div className="space-y-3">
              {benefits.map((benefit, index) => {
                const BenefitIcon = benefit.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <BenefitIcon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-gray-700 font-medium">{benefit.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">2,847+</p>
                <p className="text-sm text-gray-500">Students Mastered Topics</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-lg font-bold text-primary">94%</p>
                <p className="text-xs text-gray-500">Success Rate</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-lg font-bold text-primary">12 Days</p>
                <p className="text-xs text-gray-500">Avg. Mastery</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-lg font-bold text-primary">45%</p>
                <p className="text-xs text-gray-500">Score Improvement</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center py-4"
      >
        <p className="text-gray-500 mb-4">Ready to conquer your weak areas?</p>
        <Button 
          size="lg" 
          onClick={startJourney}
          className="bg-primary hover:bg-primary/90 text-white px-10 py-6 text-lg rounded-xl shadow-lg"
        >
          Begin Now — It's Free
        </Button>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
