
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
import { Calendar as CalendarIcon, Flame, FileCheck, Award, Clock, ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';
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
    <div className="h-screen overflow-y-auto bg-gray-50">
      <div className="flex gap-3 p-3 max-w-full">
        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Welcome Banner with Target Exam - Compact */}
          <Card className="bg-gradient-to-r from-cyan-400 to-blue-400 p-3 text-white border-0 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold mb-0.5 truncate">Welcome, {user?.name || 'Student User'}</h1>
                <p className="text-xs text-white/90">Track your preparation progress and upcoming exams.</p>
              </div>
              <Card className="bg-white p-2 min-w-[150px] flex-shrink-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
                    <span className="text-xs">🎯</span>
                  </div>
                  <span className="text-[10px] text-gray-600 font-medium">Target Exam</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">IBPS PO</span>
                  <span className="bg-cyan-400 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">Active</span>
                </div>
              </Card>
            </div>
          </Card>

          {/* 4 Stats Cards - Very Compact */}
          <div className="grid grid-cols-4 gap-2">
            <Card className="p-2 bg-white">
              <h3 className="text-[10px] font-semibold mb-0.5 text-gray-900">Total Journey Days</h3>
              <p className="text-2xl font-bold mb-0">347</p>
              <p className="text-[9px] text-gray-500">Preparation ongoing</p>
            </Card>
            <Card className="p-2 bg-white">
              <h3 className="text-[10px] font-semibold mb-0.5 text-gray-900">Total Study Hours</h3>
              <p className="text-2xl font-bold mb-0">91</p>
              <p className="text-[9px] text-gray-500">6+ hours today</p>
            </Card>
            <Card className="p-2 bg-white">
              <h3 className="text-[10px] font-semibold mb-0.5 text-gray-900">Total Active Days</h3>
              <p className="text-2xl font-bold mb-0">67</p>
              <p className="text-[9px] text-gray-500">Continuously studying</p>
            </Card>
            <Card className="p-2 bg-white">
              <h3 className="text-[10px] font-semibold mb-0.5 text-gray-900">Total Mock Test</h3>
              <p className="text-2xl font-bold mb-0">40</p>
              <p className="text-[9px] text-gray-500">Last test 2 days ago</p>
            </Card>
          </div>

          {/* Current Affairs - Top Picks with Images Carousel */}
          <div>
            <h2 className="text-base font-bold mb-2 text-red-700">Top Picks</h2>
            <Card className="p-3 bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Newspaper className="h-4 w-4 text-blue-600" />
                  <h3 className="font-semibold text-sm">Current Affairs</h3>
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { title: 'M Adhikari-Jeminah Dagar named in ICC Women\'s World Cup Team of Tournament', category: 'CRICKET', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400' },
                  { title: 'Delhi air quality remains \'very poor\'', category: 'DELHI', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400' },
                  { title: 'Sexually harassed in spinfire incident in Bengaluru', category: 'KARNATAKA', image: 'https://images.unsplash.com/photo-1560128484-1234567890ab?w=400' },
                  { title: 'Mirabai Chanu\'s weight class axed from 2028 Olympics', category: 'OTHER SPORTS', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400' }
                ].map((item, idx) => (
                  <div key={idx} className="relative group cursor-pointer overflow-hidden rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 flex flex-col justify-end">
                      <span className="text-white text-[9px] font-bold mb-1 uppercase">{item.category}</span>
                      <p className="text-white text-[10px] font-medium line-clamp-2">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Study Activity Heatmap - Below the fold */}
          <div>
            <h2 className="text-base font-bold mb-2">Study Activity</h2>
            <StudyHeatmap />
          </div>
        </div>

        {/* Right Sidebar - Fixed Width */}
        <div className="w-64 flex-shrink-0 space-y-3">
          {/* Class Attendance */}
          <Card className="p-2.5 bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-xs">Class attendance</h3>
              <Button variant="outline" size="sm" className="h-6 text-[10px] px-2">
                month ▾
              </Button>
            </div>
            
            {/* Weekly Grid */}
            <div className="mb-2">
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center text-[9px] font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {[true, true, true, true, false, false, false,
                  false, true, true, true, true, false, false,
                  true, true, true, true, true, false, false].map((present, idx) => (
                  <div
                    key={idx}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                      idx === 7 ? 'bg-orange-500' : present ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    {idx === 7 ? '○' : present ? '✓' : '✕'}
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1.5">
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-xs">◀</Button>
                <h4 className="font-semibold text-xs">September 2030</h4>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-xs">▶</Button>
              </div>
              <div className="grid grid-cols-7 gap-0.5 text-center">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-gray-500 py-0.5 text-[9px]">{day}</div>
                ))}
                {[19, 20, 21, 22, 23, 24, 25].map((date) => (
                  <div key={date} className="py-1 hover:bg-gray-100 rounded cursor-pointer text-[10px]">
                    {date}
                  </div>
                ))}
              </div>
            </div>

            {/* Agenda */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="font-semibold text-xs">Agenda</h4>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0">⋯</Button>
              </div>
              <div className="space-y-1.5">
                <div className="flex gap-1.5">
                  <span className="text-[9px] text-gray-500 w-12 flex-shrink-0">08:00 am</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-gray-500">All Grade</p>
                    <p className="text-[10px] font-medium truncate">Homeroom & Announcement</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <span className="text-[9px] text-gray-500 w-12 flex-shrink-0">10:00 am</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-gray-500">Grade 3-5</p>
                    <p className="text-[10px] font-medium truncate">Math Review & Practice</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <span className="text-[9px] text-gray-500 w-12 flex-shrink-0">10:30 am</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-gray-500">Grade 6-8</p>
                    <p className="text-[10px] font-medium truncate">Science Experiment & Discussion</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
