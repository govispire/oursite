
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import JourneyStatCard from '@/components/dashboard/JourneyStatCard';
import CurrentAffairsSlider from '@/components/dashboard/CurrentAffairsSlider';
import TodaySchedule from '@/components/dashboard/TodaySchedule';
import { SelectedExamsSection } from '@/components/dashboard/SelectedExamsSection';
import { Calendar as CalendarIcon, Flame, FileCheck, Award, Clock } from 'lucide-react';
import { useCalendarTasks } from '@/hooks/useCalendarTasks';
import ExamCountdownCard from '@/components/student/calendar/ExamCountdownCard';
import StudyHeatmap from '@/components/student/StudyHeatmap';
import PerformanceAnalytics from '@/components/student/PerformanceAnalytics';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const { getWeeklyStats, getNearestExam } = useCalendarTasks();
  
  const weeklyStats = getWeeklyStats();
  const nearestExam = getNearestExam();

  // Sample upcoming exams for the ExamCountdownCard
  const upcomingExamsForCard = [
    {
      id: 1,
      name: "IBPS PO Prelims",
      date: new Date("2025-06-25"),
      important: true,
      icon: "bell" as const
    },
    {
      id: 2,
      name: "IBPS PO Mock Test",
      date: new Date("2025-05-30"),
      important: false,
      icon: "book" as const
    },
    {
      id: 3,
      name: "Practice Paper",
      date: new Date("2025-05-20"),
      important: false,
      icon: "file" as const
    }
  ];

  const upcomingExamsData = [
    {
      id: 1,
      name: "IBPS PO Mock Test",
      date: "Tomorrow, 10:00 AM",
      category: "banking-insurance",
      examId: "ibps-po"
    },
    {
      id: 2,
      name: "SSC CGL Practice Set",
      date: "Apr 30, 2:00 PM",
      category: "ssc",
      examId: "ssc-cgl"
    },
    {
      id: 3,
      name: "General Awareness Quiz",
      date: "Available anytime",
      category: "general",
      examId: "gk-quiz"
    }
  ];

  const recentUpdates = [
    {
      id: 1,
      title: "New Banking Awareness PDF Added",
      date: "2 hours ago",
      type: "PDF"
    },
    {
      id: 2,
      title: "10 New Current Affairs Questions",
      date: "Yesterday",
      type: "Quiz"
    },
    {
      id: 3,
      title: "IBPS PO Syllabus Updated",
      date: "Apr 25, 2025",
      type: "Update"
    }
  ];

  const recommendations = [
    {
      title: "Quantitative Aptitude",
      description: "Focus on improving calculation speed",
      path: "/student/courses/quantitative"
    },
    {
      title: "English Language",
      description: "Practice more reading comprehension",
      path: "/student/courses/english"
    },
    {
      title: "Reasoning",
      description: "Try logical reasoning exercises",
      path: "/student/courses/reasoning"
    }
  ];

  return (
    <div className="w-full px-4 lg:px-6 py-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-4 sm:space-y-6">
        {/* Welcome Banner with Level System */}
        <WelcomeBanner 
          name={user?.name || 'Student'} 
          targetExam="IBPS PO"
          performanceLevel={62}
        />
        
        {/* Journey Progress Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          <JourneyStatCard
            icon={CalendarIcon}
            label="Journey Day"
            value="156"
            subtitle="Days in pursuit"
            color="from-blue-500 to-cyan-500"
          />
          <JourneyStatCard
            icon={Flame}
            label="Active Streak"
            value="23"
            subtitle="Days running"
            color="from-orange-500 to-red-500"
          />
          <JourneyStatCard
            icon={FileCheck}
            label="Mock Tests"
            value="47"
            subtitle="Tests taken"
            color="from-green-500 to-emerald-500"
          />
          <JourneyStatCard
            icon={Award}
            label="Real Exams"
            value="12"
            subtitle="Completed"
            color="from-purple-500 to-pink-500"
          />
          <JourneyStatCard
            icon={Clock}
            label="Study Hours"
            value="347"
            subtitle="Total logged"
            color="from-indigo-500 to-blue-500"
          />
        </div>
        
        {/* Current Affairs Slider & Today's Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <CurrentAffairsSlider />
          <TodaySchedule />
        </div>
        
        {/* Selected Exams with Offers */}
        <SelectedExamsSection />
        
        {/* Study Activity Heatmap - Full Width */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Study Activity Heatmap</h2>
          <StudyHeatmap className="w-full" />
        </div>
        
        {/* Upcoming Exams Section */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Upcoming Exams</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {upcomingExamsData.map((exam) => (
              <Card key={exam.id} className="p-4 hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-base mb-1">{exam.name}</h4>
                      <p className="text-sm text-gray-500">{exam.date}</p>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileCheck className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <Link to={`/student/tests/${exam.category}/${exam.examId}`} className="w-full">
                    <Button className="w-full" size="sm">Start Test</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Performance Analytics Charts Section */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Performance Analytics</h2>
          <PerformanceAnalytics />
        </div>
        
      </div>
    </div>
  );
};

export default StudentDashboard;
