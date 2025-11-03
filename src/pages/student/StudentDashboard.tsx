
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
    <div className="w-full px-4 lg:px-6 py-3 space-y-3">
      {/* Top Section: Welcome Banner + Target Exam + Weekly Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Welcome Banner */}
        <div className="lg:col-span-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl p-4 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">✨</span>
              <h1 className="text-lg font-bold">Welcome back, {user?.name || 'Student User'}!</h1>
            </div>
            <p className="text-sm text-white/90">Keep up the great work on your IBPS PO preparation</p>
          </div>
          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <p className="text-xs font-semibold">Performance</p>
            <p className="text-lg font-bold">62%</p>
          </div>
        </div>
        
        {/* Target Exam Card */}
        <div className="lg:col-span-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-lg">🎯</span>
            </div>
            <span className="text-xs text-gray-600 font-medium">Target Exam</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">IBPS PO</span>
            <span className="bg-cyan-400 text-white text-xs px-3 py-1 rounded-full font-medium">Active</span>
          </div>
        </div>
        
        {/* Weekly Attendance */}
        <div className="lg:col-span-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-900">Weekly Attendance</span>
            <span className="text-xs text-gray-600">Present</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
              <div key={day} className="flex flex-col items-center gap-1">
                <span className="text-[9px] text-gray-600">{day}</span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  [0, 4].includes(idx) ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {[0, 4].includes(idx) ? '✕' : '✓'}
                </div>
              </div>
            ))}
          </div>
          <div className="text-right mt-1">
            <span className="text-xs font-semibold text-green-600">5/7</span>
          </div>
        </div>
      </div>
      
      {/* Stats Row - 5 Cards */}
      <div className="grid grid-cols-5 gap-3">
        <Card className="p-3 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
              <CalendarIcon className="h-4 w-4 text-white" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-1">Journey Day</p>
          <p className="text-2xl font-bold text-gray-900">156</p>
        </Card>
        
        <Card className="p-3 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
              <Flame className="h-4 w-4 text-white" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-1">Active Streak</p>
          <p className="text-2xl font-bold text-gray-900">23</p>
        </Card>
        
        <Card className="p-3 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center">
              <FileCheck className="h-4 w-4 text-white" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-1">Mock Tests</p>
          <p className="text-2xl font-bold text-gray-900">47</p>
        </Card>
        
        <Card className="p-3 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <Award className="h-4 w-4 text-white" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-1">Real Exams</p>
          <p className="text-2xl font-bold text-gray-900">12</p>
        </Card>
        
        <Card className="p-3 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-blue-400 flex items-center justify-center">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-1">Study Hours</p>
          <p className="text-2xl font-bold text-gray-900">347</p>
        </Card>
      </div>
      
      {/* Current Affairs & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <CurrentAffairsSlider />
        <TodaySchedule />
      </div>
      
      {/* Selected Exams */}
      <SelectedExamsSection />
      
      {/* Bottom Section: Study Activity + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div>
          <h2 className="text-sm font-semibold mb-2">Study Activity Heatmap</h2>
          <StudyHeatmap className="w-full" />
        </div>
        <div>
          <h2 className="text-sm font-semibold mb-2">Upcoming Exams</h2>
          <div className="space-y-2">
            {upcomingExamsData.slice(0, 3).map((exam) => (
              <Card key={exam.id} className="p-2.5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs truncate">{exam.name}</h4>
                    <p className="text-[10px] text-muted-foreground">{exam.date}</p>
                  </div>
                  <Link to={`/student/tests/${exam.category}/${exam.examId}`}>
                    <Button size="sm" className="h-7 px-2 text-[10px]">Start</Button>
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
