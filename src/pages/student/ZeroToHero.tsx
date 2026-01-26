import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WelcomeScreen from '@/components/student/zero-to-hero/WelcomeScreen';
import GoalSelection from '@/components/student/zero-to-hero/GoalSelection';
import SubjectSelection from '@/components/student/zero-to-hero/SubjectSelection';
import DailyPlan from '@/components/student/zero-to-hero/DailyPlan';
import ProgressDashboard from '@/components/student/zero-to-hero/ProgressDashboard';
import RewardsSection from '@/components/student/zero-to-hero/RewardsSection';
import PeerStudy from '@/components/student/zero-to-hero/PeerStudy';
import FeedbackAI from '@/components/student/zero-to-hero/FeedbackAI';
import CompletionCertificate from '@/components/student/zero-to-hero/CompletionCertificate';
import { useZeroToHero } from '@/hooks/useZeroToHero';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  BarChart3, 
  Trophy, 
  Users, 
  MessageCircle,
  ArrowLeft
} from 'lucide-react';

const ZeroToHero = () => {
  const [activeTab, setActiveTab] = useState('plan');
  const { journeyState, hasActiveJourney, resetJourney } = useZeroToHero();

  const tabs = [
    { id: 'plan', label: 'Daily Plan', icon: Target },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'rewards', label: 'Rewards', icon: Trophy },
    { id: 'peer', label: 'Peer Study', icon: Users },
    { id: 'feedback', label: 'AI Help', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary/5">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Zero to Hero</h1>
                <p className="text-sm text-gray-600">Master your weak areas</p>
              </div>
            </div>
            
            {hasActiveJourney && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetJourney}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Reset Journey
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Onboarding Screens */}
        {!hasActiveJourney && journeyState.currentStep === 'welcome' && (
          <WelcomeScreen />
        )}

        {!hasActiveJourney && journeyState.currentStep === 'goal-selection' && (
          <GoalSelection />
        )}

        {!hasActiveJourney && journeyState.currentStep === 'subject-selection' && (
          <SubjectSelection />
        )}

        {/* Completion Screen */}
        {journeyState.currentStep === 'journey-complete' && (
          <CompletionCertificate />
        )}

        {/* Active Journey Dashboard */}
        {hasActiveJourney && journeyState.currentStep !== 'journey-complete' && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white shadow-sm border p-1 grid grid-cols-5 w-full max-w-2xl mx-auto">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <TabIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="plan" className="mt-6">
              <DailyPlan />
            </TabsContent>

            <TabsContent value="progress" className="mt-6">
              <ProgressDashboard />
            </TabsContent>

            <TabsContent value="rewards" className="mt-6">
              <RewardsSection />
            </TabsContent>

            <TabsContent value="peer" className="mt-6">
              <PeerStudy />
            </TabsContent>

            <TabsContent value="feedback" className="mt-6">
              <FeedbackAI />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ZeroToHero;
