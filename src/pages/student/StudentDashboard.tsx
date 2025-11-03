
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
    <div className="w-full px-4 lg:px-6 py-4 space-y-3">
      {/* Top Section: Welcome Banner with Cards + Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Welcome Banner with embedded stat cards */}
        <div className="lg:col-span-3">
          <WelcomeBanner 
            name={user?.name || 'Student'} 
            targetExam="IBPS PO"
            performanceLevel={62}
          >
            <div className="grid grid-cols-5 gap-2">
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
          </WelcomeBanner>
        </div>
        
        {/* Right Sidebar: Attendance, Current Affairs, Schedule */}
        <div className="space-y-3">
          {/* Weekly Attendance */}
          <Card className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold">Weekly Attendance</h3>
              <span className="text-xs text-muted-foreground">5/7</span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                <div key={day} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">{day}</span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                    [0, 5].includes(idx) ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {[0, 5].includes(idx) ? '✕' : '✓'}
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Current Affairs Preview */}
          <Card className="p-3">
            <h3 className="text-xs font-semibold mb-2">Current Affairs</h3>
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center mb-2">
              <img 
                src="https://images.unsplash.com/photo-1585241645927-c7a8e5840c42?w=400&h=200&fit=crop" 
                alt="Current Affairs"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <p className="text-[10px] text-muted-foreground line-clamp-2">Supreme Court Digital Privacy Verdict</p>
          </Card>
          
          {/* Today's Schedule - Compact */}
          <Card className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold">Today's Schedule</h3>
              <span className="text-[10px] text-muted-foreground">1/4</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] p-1.5 bg-green-50 rounded">
                <span className="text-muted-foreground truncate">Mock Test</span>
                <span className="text-green-600 font-medium">Done</span>
              </div>
              <div className="flex items-center justify-between text-[10px] p-1.5 bg-blue-50 rounded">
                <span className="text-muted-foreground truncate">Video Lecture</span>
                <span className="text-blue-600 font-medium">Now</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Selected Exams */}
      <SelectedExamsSection />
      
      {/* Bottom Section: Study Activity + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div>
          <h2 className="text-base font-semibold mb-2">Study Activity Heatmap</h2>
          <StudyHeatmap className="w-full" />
        </div>
        <div>
          <h2 className="text-base font-semibold mb-2">Upcoming Exams</h2>
          <div className="space-y-2">
            {upcomingExamsData.slice(0, 3).map((exam) => (
              <Card key={exam.id} className="p-3 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{exam.name}</h4>
                    <p className="text-xs text-muted-foreground">{exam.date}</p>
                  </div>
                  <Link to={`/student/tests/${exam.category}/${exam.examId}`}>
                    <Button size="sm" className="h-8 px-3 text-xs">Start</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
