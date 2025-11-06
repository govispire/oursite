
import React, { useState, useEffect } from 'react';
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
import NewsArticleDialog from '@/components/student/NewsArticleDialog';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [attendanceView, setAttendanceView] = useState<'week' | 'month'>('month');
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [newsDialogOpen, setNewsDialogOpen] = useState(false);
  const { getWeeklyStats, getNearestExam } = useCalendarTasks();
  
  const weeklyStats = getWeeklyStats();
  const nearestExam = getNearestExam();

  // Current affairs data with topics
  const currentAffairsData = [
    { 
      title: 'RBI Monetary Policy: Repo Rate Unchanged at 6.5%', 
      category: 'RBI', 
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
      date: 'Nov 6, 2025',
      content: 'The Reserve Bank of India kept the repo rate unchanged at 6.5% in its latest monetary policy review. The decision comes amid concerns about inflation and economic growth. The RBI Governor emphasized maintaining a balance between controlling inflation and supporting economic recovery. Key highlights include maintaining adequate liquidity in the system and continued focus on financial stability.'
    },
    { 
      title: 'India Signs Historic Trade Agreement with European Union', 
      category: 'INTERNATIONAL', 
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
      date: 'Nov 5, 2025',
      content: 'India and the European Union have signed a comprehensive trade agreement that is expected to boost bilateral trade by 40% over the next five years. The agreement covers trade in goods, services, investments, and intellectual property rights. This landmark deal will create new opportunities for Indian exporters, particularly in sectors like pharmaceuticals, textiles, and IT services.'
    },
    { 
      title: 'Government Launches Digital Banking Initiative for Rural Areas', 
      category: 'BANKING', 
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
      date: 'Nov 4, 2025',
      content: 'The government has launched a new digital banking initiative aimed at bringing banking services to remote rural areas. The program will set up 10,000 digital banking units across the country over the next two years. These units will offer services including account opening, loans, insurance, and digital payment facilities, helping to increase financial inclusion in underserved regions.'
    },
    { 
      title: 'Supreme Court Delivers Landmark Judgment on Environmental Protection', 
      category: 'NATION', 
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
      date: 'Nov 3, 2025',
      content: 'The Supreme Court has delivered a landmark judgment strengthening environmental protection laws. The court has mandated stricter compliance measures for industries and ordered the establishment of special environmental courts in all states. This ruling is expected to have far-reaching implications for industrial development and environmental conservation efforts across the country.'
    }
  ];

  // Auto-slide current affairs
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % currentAffairsData.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNewsClick = (news: any) => {
    setSelectedNews(news);
    setNewsDialogOpen(true);
  };

  const handlePrevNews = () => {
    setCurrentNewsIndex((prev) => (prev - 1 + currentAffairsData.length) % currentAffairsData.length);
  };

  const handleNextNews = () => {
    setCurrentNewsIndex((prev) => (prev + 1) % currentAffairsData.length);
  };

  // Today's schedule with colors
  const todaySchedule = [
    { time: '08:00 am', title: 'Mock Test - Quantitative', category: 'Mock Test', color: 'bg-yellow-100 border-yellow-300' },
    { time: '10:00 am', title: 'Current Affairs Daily Quiz', category: 'Current Affairs', color: 'bg-gray-100 border-gray-300' },
    { time: '11:30 am', title: 'English Comprehension Class', category: 'English Class', color: 'bg-rose-100 border-rose-300' },
    { time: '02:00 pm', title: 'Reasoning - Puzzles & Seating', category: 'Reasoning', color: 'bg-blue-100 border-blue-300' },
    { time: '04:00 pm', title: 'Banking Awareness Session', category: 'Banking', color: 'bg-purple-100 border-purple-300' },
  ];

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
                  <div className="flex gap-2 ml-2">
                    {currentAffairsData.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          idx === currentNewsIndex ? 'bg-blue-600 w-4' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={handlePrevNews}>
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={handleNextNews}>
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {currentAffairsData.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="relative group cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => handleNewsClick(item)}
                  >
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 flex flex-col justify-end">
                      <span className="text-white text-[9px] font-bold mb-1 uppercase">{item.category}</span>
                      <p className="text-white text-xs font-medium line-clamp-3">{item.title}</p>
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
          {/* Your Presence */}
          <Card className="p-2.5 bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-xs">Your presence</h3>
              <div className="flex gap-1">
                <Button 
                  variant={attendanceView === 'week' ? 'default' : 'outline'} 
                  size="sm" 
                  className="h-6 text-[10px] px-2"
                  onClick={() => setAttendanceView('week')}
                >
                  Week
                </Button>
                <Button 
                  variant={attendanceView === 'month' ? 'default' : 'outline'} 
                  size="sm" 
                  className="h-6 text-[10px] px-2"
                  onClick={() => setAttendanceView('month')}
                >
                  Month
                </Button>
              </div>
            </div>
            
            {/* Weekly or Monthly Grid */}
            <div className="mb-2">
              {attendanceView === 'week' ? (
                <>
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="text-center text-[9px] font-medium text-gray-600">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {[true, true, true, true, false, false, false].map((present, idx) => (
                      <div
                        key={idx}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                          idx === 3 ? 'bg-orange-500' : present ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        {idx === 3 ? '○' : present ? '✓' : '✕'}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
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

            {/* Today's Schedule */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="font-semibold text-xs">Today's schedule</h4>
              </div>
              <div className="space-y-1.5">
                {todaySchedule.map((item, idx) => (
                  <div key={idx} className={`flex gap-1.5 p-1.5 rounded border ${item.color}`}>
                    <span className="text-[9px] text-gray-700 w-12 flex-shrink-0 font-medium">{item.time}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] text-gray-600 font-medium">{item.category}</p>
                      <p className="text-[10px] font-semibold text-gray-900 truncate">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* News Article Dialog */}
      <NewsArticleDialog 
        article={selectedNews}
        open={newsDialogOpen}
        onOpenChange={setNewsDialogOpen}
      />
    </div>
  );
};

export default StudentDashboard;
