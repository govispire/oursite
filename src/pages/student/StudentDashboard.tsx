
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
import { Calendar as CalendarIcon, Flame, FileCheck, Award, Clock, ChevronLeft, ChevronRight, Newspaper, Target, Gift, Brain, BarChart3, AlertTriangle, Play } from 'lucide-react';
import { useCalendarTasks } from '@/hooks/useCalendarTasks';
import ExamCountdownCard from '@/components/student/calendar/ExamCountdownCard';
import StudyHeatmap from '@/components/student/StudyHeatmap';
import PerformanceAnalytics from '@/components/student/PerformanceAnalytics';
import NewsArticleDialog from '@/components/student/NewsArticleDialog';
import StatCardDialog from '@/components/student/StatCardDialog';
import { Progress } from '@/components/ui/progress';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [attendanceView, setAttendanceView] = useState<'week' | 'month'>('month');
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [newsDialogOpen, setNewsDialogOpen] = useState(false);
  const [statDialogType, setStatDialogType] = useState<'journey' | 'hours' | 'active' | 'tests' | null>(null);
  const { getWeeklyStats, getNearestExam } = useCalendarTasks();
  
  const weeklyStats = getWeeklyStats();
  const nearestExam = getNearestExam();

  // Today's goal data
  const todaysGoal = {
    completed: 70,
    tasks: [
      { title: 'Study: 2 hrs', completed: true },
      { title: 'Quiz: 1 Daily Quiz', completed: true },
      { title: 'Revision: 20 Qs', completed: false },
    ],
    streak: 6,
    badges: 3,
  };

  // Daily free quizzes
  const dailyQuizzes = [
    { title: 'Quantitative Aptitude', icon: BarChart3, duration: '10 mins' },
    { title: 'Reasoning', icon: Brain, duration: '10 mins' },
    { title: 'Current Affairs', icon: Newspaper, duration: '5 mins' },
  ];

  // Weak topics based on last tests
  const weakTopics = [
    { topic: 'Data Interpretation', accuracy: 42 },
    { topic: 'Syllogism', accuracy: 48 },
  ];

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
      <div className="flex flex-col lg:flex-row gap-3 p-2 sm:p-3 max-w-full">
        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-3 w-full lg:w-auto">
          {/* Welcome Banner with Target Exam & Today's Goal */}
          <Card className="bg-gradient-to-r from-primary/90 to-primary p-3 sm:p-4 text-primary-foreground border-0 shadow-lg">
            <div className="flex flex-col gap-3">
              {/* Top Row: Welcome + Target Exam */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-3">
                <div className="flex-1 min-w-0 w-full sm:w-auto">
                  <h1 className="text-base sm:text-xl font-bold mb-0.5 truncate">👋 Welcome, {user?.name || 'Student User'}</h1>
                  <p className="text-[10px] sm:text-xs text-primary-foreground/80">Track your preparation progress and upcoming exams.</p>
                </div>
                <Card className="bg-white p-1.5 sm:p-2 w-full sm:w-auto sm:min-w-[150px] flex-shrink-0">
                  <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Target className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium">Target Exam</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-foreground">IBPS PO</span>
                    <span className="bg-primary text-primary-foreground text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium">Active</span>
                  </div>
                </Card>
              </div>

              {/* Today's Goal Section */}
              <div className="bg-white/10 rounded-lg p-2 sm:p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm font-semibold">Today's Goal</span>
                </div>
                <Progress value={todaysGoal.completed} className="h-2 mb-2 bg-white/20" />
                <div className="flex flex-wrap gap-2 mb-2">
                  {todaysGoal.tasks.map((task, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-[10px] sm:text-xs">
                      <span className={task.completed ? 'text-green-300' : 'text-yellow-300'}>
                        {task.completed ? '✔' : '⏳'}
                      </span>
                      <span>{task.title}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 text-[10px] sm:text-xs">
                  <div className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-orange-300" />
                    <span>Streak: {todaysGoal.streak} Days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3 text-yellow-300" />
                    <span>Badges: {todaysGoal.badges}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Daily Free Quizzes Action Card */}
          <Card className="p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-foreground">Daily Free Quizzes (Today)</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Complete today's quizzes to maintain your streak</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
              {dailyQuizzes.map((quiz, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-primary/10">
                  <quiz.icon className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground truncate">{quiz.title}</p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" /> {quiz.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
                <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Start Today's Quiz
              </Button>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                View All
              </Button>
            </div>
          </Card>

          {/* 4 Stats Cards - Very Compact - Now Clickable */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
            <Card 
              className="p-1.5 sm:p-2 bg-white cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setStatDialogType('journey')}
            >
              <h3 className="text-[9px] sm:text-[10px] font-semibold mb-0.5 text-foreground truncate">Total Journey Days</h3>
              <p className="text-xl sm:text-2xl font-bold mb-0">347</p>
              <p className="text-[8px] sm:text-[9px] text-muted-foreground truncate">Preparation ongoing</p>
            </Card>
            <Card 
              className="p-1.5 sm:p-2 bg-white cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setStatDialogType('hours')}
            >
              <h3 className="text-[9px] sm:text-[10px] font-semibold mb-0.5 text-foreground truncate">Total Study Hours</h3>
              <p className="text-xl sm:text-2xl font-bold mb-0">195</p>
              <p className="text-[8px] sm:text-[9px] text-muted-foreground truncate">6+ hours today</p>
            </Card>
            <Card 
              className="p-1.5 sm:p-2 bg-white cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setStatDialogType('active')}
            >
              <h3 className="text-[9px] sm:text-[10px] font-semibold mb-0.5 text-foreground truncate">Total Active Days</h3>
              <p className="text-xl sm:text-2xl font-bold mb-0">67</p>
              <p className="text-[8px] sm:text-[9px] text-muted-foreground truncate">Continuously studying</p>
            </Card>
            <Card 
              className="p-1.5 sm:p-2 bg-white cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setStatDialogType('tests')}
            >
              <h3 className="text-[9px] sm:text-[10px] font-semibold mb-0.5 text-foreground truncate">Total Mock Test</h3>
              <p className="text-xl sm:text-2xl font-bold mb-0">40</p>
              <p className="text-[8px] sm:text-[9px] text-muted-foreground truncate">Last test 2 days ago</p>
            </Card>
          </div>

          {/* Weak Topic Suggestion Card */}
          <Card className="p-3 sm:p-4 bg-orange-50 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Focus Areas (Based on Last Tests)</h3>
            </div>
            <div className="space-y-2 mb-3">
              {weakTopics.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg border border-orange-100">
                  <span className="text-xs sm:text-sm font-medium text-foreground">{item.topic}</span>
                  <span className="text-[10px] sm:text-xs text-orange-600 font-medium">Accuracy: {item.accuracy}%</span>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto border-orange-300 text-orange-700 hover:bg-orange-100">
              Practice Now
            </Button>
          </Card>

          {/* Your Presence & Today's Schedule - Mobile Only */}
          <div className="lg:hidden">
            <Card className="p-2 bg-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-xs">Your presence</h3>
                <div className="flex gap-1">
                  <Button 
                    variant={attendanceView === 'week' ? 'default' : 'outline'} 
                    size="sm" 
                    className="h-5 text-[9px] px-1.5"
                    onClick={() => setAttendanceView('week')}
                  >
                    Week
                  </Button>
                  <Button 
                    variant={attendanceView === 'month' ? 'default' : 'outline'} 
                    size="sm" 
                    className="h-5 text-[9px] px-1.5"
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

          {/* Current Affairs - Top Picks with Images Carousel */}
          <div>
            <h2 className="text-sm sm:text-base font-bold mb-2 text-red-700">Top Picks</h2>
            <Card className="p-2 sm:p-3 bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Newspaper className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  <h3 className="font-semibold text-xs sm:text-sm">Current Affairs</h3>
                  <div className="hidden sm:flex gap-2 ml-2">
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
                <div className="flex gap-0.5 sm:gap-1">
                  <Button variant="outline" size="sm" className="h-6 w-6 sm:h-7 sm:w-7 p-0" onClick={handlePrevNews}>
                    <ChevronLeft className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-6 w-6 sm:h-7 sm:w-7 p-0" onClick={handleNextNews}>
                    <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                {currentAffairsData.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="relative group cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => handleNewsClick(item)}
                  >
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-32 sm:h-48 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-1.5 sm:p-2 flex flex-col justify-end">
                      <span className="text-white text-[8px] sm:text-[9px] font-bold mb-0.5 sm:mb-1 uppercase">{item.category}</span>
                      <p className="text-white text-[10px] sm:text-xs font-medium line-clamp-2 sm:line-clamp-3">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Study Activity Heatmap - Below the fold */}
          <div>
            <h2 className="text-sm sm:text-base font-bold mb-2">Study Activity</h2>
            <StudyHeatmap />
          </div>
        </div>

        {/* Right Sidebar - Fixed Width - Hidden on Mobile */}
        <div className="hidden lg:block w-64 flex-shrink-0 space-y-3">
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

      {/* Stat Card Detail Dialogs */}
      {statDialogType && (
        <StatCardDialog
          type={statDialogType}
          open={!!statDialogType}
          onOpenChange={(open) => !open && setStatDialogType(null)}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
