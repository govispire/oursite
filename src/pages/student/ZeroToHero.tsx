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
import { TrendingUpDown } from 'lucide-react';

const ZeroToHero = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { journeyState, hasActiveJourney } = useZeroToHero();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-primary/5 to-primary/10">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-brand-darkteal rounded-xl flex items-center justify-center">
              <TrendingUpDown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Zero to Hero Pathway</h1>
              <p className="text-sm text-gray-600">Transform your weakness into strength</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!hasActiveJourney && journeyState.currentStep === 'welcome' && (
          <WelcomeScreen />
        )}

        {!hasActiveJourney && journeyState.currentStep === 'goal-selection' && (
          <GoalSelection />
        )}

        {!hasActiveJourney && journeyState.currentStep === 'subject-selection' && (
          <SubjectSelection />
        )}

        {journeyState.currentStep === 'journey-complete' && (
          <CompletionCertificate />
        )}

        {hasActiveJourney && journeyState.currentStep !== 'journey-complete' && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white shadow-sm">
              <TabsTrigger value="overview">Daily Plan</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
              <TabsTrigger value="peer">Peer Study</TabsTrigger>
              <TabsTrigger value="feedback">Feedback & AI</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <DailyPlan />
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <ProgressDashboard />
            </TabsContent>

            <TabsContent value="rewards" className="space-y-6">
              <RewardsSection />
            </TabsContent>

            <TabsContent value="peer" className="space-y-6">
              <PeerStudy />
            </TabsContent>

            <TabsContent value="feedback" className="space-y-6">
              <FeedbackAI />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ZeroToHero;
