
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
    <div className="flex gap-4 p-4 bg-gray-50 min-h-screen">
      {/* Main Content */}
      <div className="flex-1 space-y-4">
        {/* Welcome Banner with Target Exam */}
        <Card className="bg-gradient-to-r from-cyan-400 to-blue-400 p-6 text-white border-0 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name || 'Dinesh Kumar'}</h1>
              <p className="text-white/90">Track your preparation progress and upcoming exams.</p>
            </div>
            <Card className="bg-white p-4 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <span className="text-blue-600">🎯</span>
                </div>
                <span className="text-sm text-gray-600 font-medium">Target Exam</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">IBPS PO</span>
                <span className="bg-cyan-400 text-white text-xs px-3 py-1 rounded-full font-medium">Active</span>
              </div>
            </Card>
          </div>
        </Card>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 bg-white">
            <h3 className="text-sm font-semibold mb-1">Total Journey Days</h3>
            <p className="text-4xl font-bold mb-1">347</p>
            <p className="text-xs text-gray-500">Preparation ongoing</p>
          </Card>
          <Card className="p-4 bg-white">
            <h3 className="text-sm font-semibold mb-1">Total Study Hours</h3>
            <p className="text-4xl font-bold mb-1">91</p>
            <p className="text-xs text-gray-500">6+ hours today</p>
          </Card>
          <Card className="p-4 bg-white">
            <h3 className="text-sm font-semibold mb-1">Total Active Days</h3>
            <p className="text-4xl font-bold mb-1">67</p>
            <p className="text-xs text-gray-500">Continuously studying</p>
          </Card>
          <Card className="p-4 bg-white">
            <h3 className="text-sm font-semibold mb-1">Total Mock Test</h3>
            <p className="text-4xl font-bold mb-1">40</p>
            <p className="text-xs text-gray-500">Last test 2 days ago</p>
          </Card>
        </div>

        {/* Current Affairs - Top Picks */}
        <div>
          <h2 className="text-xl font-bold mb-3 text-red-700">Top Picks</h2>
          <CurrentAffairsSlider />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 space-y-4">
        {/* Class Attendance */}
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Class attendance</h3>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              month ▾
            </Button>
          </div>
          
          {/* Weekly Grid */}
          <div className="mb-4">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[true, true, true, true, false, false, false,
                false, true, true, true, true, false, false,
                true, true, true, true, true, false, false].map((present, idx) => (
                <div
                  key={idx}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    idx === 7 ? 'bg-orange-500' : present ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  {idx === 7 ? '○' : present ? '✓' : '✕'}
                </div>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <Button variant="ghost" size="sm">◀</Button>
              <h4 className="font-semibold">September 2030</h4>
              <Button variant="ghost" size="sm">▶</Button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-gray-500 py-1">{day}</div>
              ))}
              {[19, 20, 21, 22, 23, 24, 25].map((date) => (
                <div key={date} className="py-2 hover:bg-gray-100 rounded cursor-pointer">
                  {date}
                </div>
              ))}
            </div>
          </div>

          {/* Agenda */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Agenda</h4>
              <Button variant="ghost" size="sm">⋯</Button>
            </div>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-xs text-gray-500 w-16">08:00 am</span>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">All Grade</p>
                  <p className="text-sm font-medium">Homeroom & Announcement</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xs text-gray-500 w-16">10:00 am</span>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Grade 3-5</p>
                  <p className="text-sm font-medium">Math Review & Practice</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xs text-gray-500 w-16">10:30 am</span>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Grade 6-8</p>
                  <p className="text-sm font-medium">Science Experiment & Discussion</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
