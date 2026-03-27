
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Target, ChevronLeft, ChevronRight, Newspaper, Bookmark, LayoutGrid,
  Play, Clock, FileText, TrendingUp, Users, Award, Calendar, BarChart3,
  Trophy, Bell, ExternalLink, ArrowRight, Flame, Sparkles, CheckCircle2,
  MapPin, Lock, Pause, X, BookOpen, Search, ChevronDown
} from 'lucide-react';
import NewsArticleDialog from '@/components/student/NewsArticleDialog';
import StatCardDialog from '@/components/student/StatCardDialog';
import { useSelfCareExams } from '@/hooks/useSelfCareExams';
import { examNotifications } from '@/data/examNotificationData';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar
} from 'recharts';

// Pastel stat card config
const statCards = [
  { key: 'journey', label: 'Total Journey Days', value: '347', sub: 'Preparation ongoing', icon: Calendar, bg: 'bg-sky-50 dark:bg-sky-950/30', iconBg: 'bg-gradient-to-br from-sky-400 to-blue-500', accent: 'text-sky-600' },
  { key: 'hours', label: 'Total Study Hours', value: '195', sub: '6+ hours today', icon: Clock, bg: 'bg-violet-50 dark:bg-violet-950/30', iconBg: 'bg-gradient-to-br from-violet-400 to-purple-500', accent: 'text-violet-600' },
  { key: 'active', label: 'Total Active Days', value: '67', sub: 'Continuously studying', icon: TrendingUp, bg: 'bg-emerald-50 dark:bg-emerald-950/30', iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500', accent: 'text-emerald-600' },
  { key: 'tests', label: 'Total Mock Tests', value: '40', sub: 'Last test 2 days ago', icon: Award, bg: 'bg-orange-50 dark:bg-orange-950/30', iconBg: 'bg-gradient-to-br from-orange-400 to-red-400', accent: 'text-orange-600' },
] as const;

// Study status donut data
const studyStatusData = [
  { name: 'Passed', value: 28, color: 'hsl(var(--primary))' },
  { name: 'Pending', value: 8, color: 'hsl(var(--muted-foreground))' },
  { name: 'Failed', value: 4, color: 'hsl(0 84% 60%)' },
];

// Weekly activity data
const weeklyActivity = [
  { day: 'Mon', hours: 4.5 },
  { day: 'Tue', hours: 6.2 },
  { day: 'Wed', hours: 3.8 },
  { day: 'Thu', hours: 7.1 },
  { day: 'Fri', hours: 5.5 },
  { day: 'Sat', hours: 8.0 },
  { day: 'Sun', hours: 2.3 },
];

// Top performers
const topPerformers = [
  { name: 'Priya Sharma', score: 94.2, tests: 38, avatar: '👩‍🎓' },
  { name: 'Rahul Kumar', score: 91.8, tests: 42, avatar: '👨‍🎓' },
  { name: 'Ananya Patel', score: 89.5, tests: 35, avatar: '👩‍💻' },
  { name: 'Vikram Singh', score: 87.3, tests: 40, avatar: '🧑‍🎓' },
  { name: 'You', score: 85.1, tests: 40, avatar: '⭐' },
];

// Upcoming exams with icons/badges
const upcomingExamsList = [
  { name: 'IBPS RRB PO', date: 'Mon, 24 Feb', badge: 'Hot', badgeColor: 'bg-orange-100 text-orange-600', icon: '🏦' },
  { name: 'IBPS RRB Clerk', date: 'Wed, 26 Feb', badge: 'Hot', badgeColor: 'bg-orange-100 text-orange-600', icon: '🏦' },
  { name: 'NIACL AO Mains', date: 'Sat, 1 Mar', badge: '7d left', badgeColor: 'bg-amber-100 text-amber-700', icon: '🌐' },
  { name: 'LIC AAO Mains', date: 'Sun, 2 Mar', badge: '8d left', badgeColor: 'bg-amber-100 text-amber-700', icon: '🌐' },
  { name: 'SSC CGL Tier 1', date: 'Mon, 10 Mar', badge: 'New', badgeColor: 'bg-blue-100 text-blue-600', icon: '📋' },
  { name: 'RRB NTPC', date: 'Sat, 15 Mar', badge: '21d left', badgeColor: 'bg-amber-100 text-amber-700', icon: '🚂' },
  { name: 'SBI PO Prelims', date: 'Sun, 23 Mar', badge: 'Closing', badgeColor: 'bg-red-100 text-red-600', icon: '🏦' },
];

// Recent mock test performance data
const recentMockTests = [
  { name: 'SBI Clerk Prelims Mock 4', score: 82, total: 100, accuracy: 78.5, date: '12 Mar 2026', rank: 124 },
  { name: 'IBPS PO Prelims Mock 7', score: 76, total: 100, accuracy: 72.1, date: '10 Mar 2026', rank: 287 },
  { name: 'SBI Clerk Mains Mock 2', score: 118, total: 190, accuracy: 68.4, date: '8 Mar 2026', rank: 456 },
  { name: 'IBPS RRB PO Mock 3', score: 88, total: 100, accuracy: 81.2, date: '5 Mar 2026', rank: 98 },
];

// Section-wise readiness
const sectionReadiness = [
  { name: 'Quantitative Aptitude', percent: 72, color: 'bg-sky-500' },
  { name: 'Reasoning Ability', percent: 85, color: 'bg-violet-500' },
  { name: 'English Language', percent: 64, color: 'bg-amber-500' },
  { name: 'General Awareness', percent: 58, color: 'bg-emerald-500' },
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [attendanceView, setAttendanceView] = useState<'week' | 'month'>('month');
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [newsDialogOpen, setNewsDialogOpen] = useState(false);
  const [statDialogType, setStatDialogType] = useState<'journey' | 'hours' | 'active' | 'tests' | null>(null);

  // Strict Study Mode state
  const [isStrictModeActive, setIsStrictModeActive] = useState(false);
  const [strictTimeLeft, setStrictTimeLeft] = useState(25 * 60); // 25 min
  const [isStrictPaused, setIsStrictPaused] = useState(false);

  const { exams: selfCareExams } = useSelfCareExams();
  const selectedExams = ['IBPS PO', 'SBI Clerk', 'RRB NTPC'];

  // Recent notifications from exam notification data
  const recentNotifications = examNotifications.slice(0, 5);

  const currentAffairsData = [
    { title: 'RBI Policy Updates', description: 'Latest monetary policy decisions and their impact on banking...', category: 'Today', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400', content: 'The Reserve Bank of India kept the repo rate unchanged at 6.5% in its latest monetary policy review.' },
    { title: 'Budget Highlights 2024', description: 'Key announcements from the union budget affecting...', category: 'Yesterday', image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400', content: 'The Union Budget 2024 introduced several key reforms affecting multiple sectors.' },
    { title: 'New Government Schemes', description: 'Important welfare programs launched this month for...', category: '2 days ago', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400', content: 'The government has launched new digital banking initiatives for rural areas.' },
  ];

  const performanceData = [
    { week: 'W1', tests: 45, quizzes: 52 },
    { week: 'W2', tests: 52, quizzes: 58 },
    { week: 'W3', tests: 48, quizzes: 62 },
    { week: 'W4', tests: 62, quizzes: 72 },
    { week: 'W5', tests: 68, quizzes: 78 },
    { week: 'W6', tests: 72, quizzes: 82 },
    { week: 'W7', tests: 78, quizzes: 85 },
    { week: 'W8', tests: 82, quizzes: 88 },
  ];

  const freeTests = [
    { title: 'Quantitative Aptitude', questions: 25, duration: 30 },
    { title: 'Reasoning Ability', questions: 20, duration: 25 },
    { title: 'English Language', questions: 30, duration: 20 },
    { title: 'General Awareness', questions: 25, duration: 15 },
    { title: 'Computer Knowledge', questions: 20, duration: 15 },
  ];

  const monthPresence = [
    [true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true],
    [true, true, true, false, true, true, true],
    [false, true, true, true, true, true, true],
  ];

  const handleNewsClick = (news: any) => { setSelectedNews(news); setNewsDialogOpen(true); };
  const handlePrevNews = () => setCurrentNewsIndex((p) => (p - 1 + currentAffairsData.length) % currentAffairsData.length);
  const handleNextNews = () => setCurrentNewsIndex((p) => (p + 1) % currentAffairsData.length);

  const vocabularyBank = [
    { word: 'Ephemeral', meaning: 'Lasting for a very short time', example: 'The ephemeral beauty of cherry blossoms.', type: 'Adjective', synonyms: ['Transient', 'Fleeting', 'Brief'] },
    { word: 'Ubiquitous', meaning: 'Present, appearing, or found everywhere', example: 'Mobile phones have become ubiquitous.', type: 'Adjective', synonyms: ['Omnipresent', 'Pervasive', 'Universal'] },
    { word: 'Pragmatic', meaning: 'Dealing with things sensibly and realistically', example: 'A pragmatic approach to solving problems.', type: 'Adjective', synonyms: ['Practical', 'Realistic', 'Sensible'] },
    { word: 'Ameliorate', meaning: 'To make something better or improve', example: 'Steps to ameliorate the situation.', type: 'Verb', synonyms: ['Improve', 'Enhance', 'Better'] },
    { word: 'Cogent', meaning: 'Clear, logical, and convincing', example: 'She presented a cogent argument.', type: 'Adjective', synonyms: ['Compelling', 'Persuasive', 'Convincing'] },
  ];
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const todayVocab = vocabularyBank[dayOfYear % vocabularyBank.length];

  const totalTests = studyStatusData.reduce((a, b) => a + b.value, 0);

  // Days left calculation
  const examDate = new Date('2026-04-15');
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((examDate.getTime() - today.getTime()) / 86400000));
  const overallPrep = 72;

  // Strict mode timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isStrictModeActive && !isStrictPaused) {
      interval = setInterval(() => {
        setStrictTimeLeft((prev) => {
          if (prev <= 1) {
            setIsStrictModeActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isStrictModeActive, isStrictPaused]);

  const formatStrictTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  const startStrictMode = () => {
    setStrictTimeLeft(25 * 60);
    setIsStrictModeActive(true);
    setIsStrictPaused(false);
  };

  const strictProgress = ((25 * 60 - strictTimeLeft) / (25 * 60)) * 100;

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'cleared': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-muted-foreground" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-screen overflow-y-auto bg-muted/30">
      <div className="p-3 sm:p-4 max-w-full space-y-4">
        {/* Full-width Target Examination Card */}
          <Card className="relative overflow-hidden border-0 shadow-lg rounded-2xl bg-gradient-to-br from-[hsl(215,50%,15%)] via-[hsl(210,45%,22%)] to-[hsl(200,60%,30%)] text-white">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, hsl(var(--primary)) 0%, transparent 50%)' }} />
            <div className="relative p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-sky-300" />
                    <span className="text-xs font-medium text-sky-300 uppercase tracking-wider">Target Examination</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold mb-0.5">SBI CLERK</h1>
                  <p className="text-sm text-white/70 mb-3">Preliminary Examination · 13,735 Vacancies</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="flex items-center gap-1.5 text-xs bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/10">
                      <Bell className="h-3 w-3 text-sky-300" /> Notified: 15 Jan 2026
                    </span>
                    <span className="flex items-center gap-1.5 text-xs bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/10">
                      <MapPin className="h-3 w-3 text-sky-300" /> Pan India
                    </span>
                    <span className="flex items-center gap-1.5 text-xs bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/10">
                      <Clock className="h-3 w-3 text-sky-300" /> 60 min · 100 marks
                    </span>
                    <span className="flex items-center gap-1.5 text-xs bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/10">
                      <Calendar className="h-3 w-3 text-sky-300" /> Day 47 of Prep
                    </span>
                  </div>

                  {/* Overall Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-white/70">Overall Preparation</span>
                      <span className="font-bold text-sky-300">{overallPrep}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-400 to-primary rounded-full transition-all" style={{ width: `${overallPrep}%` }} />
                    </div>
                  </div>

                  {/* Section Readiness */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {sectionReadiness.map((sec) => (
                      <div key={sec.name}>
                        <div className="flex items-center justify-between text-[11px] mb-0.5">
                          <span className="text-white/60 truncate">{sec.name}</span>
                          <span className="font-semibold text-white/90 ml-2">{sec.percent}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full ${sec.color} rounded-full`} style={{ width: `${sec.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs h-8 backdrop-blur-sm" asChild>
                      <Link to="/student/tests"><Play className="h-3 w-3 mr-1" />Start Full Mock</Link>
                    </Button>
                    <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs h-8 backdrop-blur-sm" asChild>
                      <Link to="/student/syllabus"><BookOpen className="h-3 w-3 mr-1" />View Syllabus</Link>
                    </Button>
                    <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs h-8 backdrop-blur-sm">
                      <TrendingUp className="h-3 w-3 mr-1" />Score Prediction
                    </Button>
                  </div>
                </div>

                {/* Days Left */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[110px] border border-white/15 flex-shrink-0">
                  <div className="text-4xl font-black text-white leading-none">{daysLeft}</div>
                  <div className="text-xs font-medium text-sky-300 mt-1">Days Left</div>
                  <div className="w-full h-px bg-white/20 my-2" />
                  <div className="text-[10px] text-white/50">Exam Date</div>
                  <div className="text-xs font-semibold text-white/80">15 Apr 2026</div>
                </div>
              </div>
            </div>
          </Card>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="Search tests, courses, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-4 w-full lg:w-auto">

          {/* Pastel Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card 
                  key={stat.key}
                  className={`p-4 ${stat.bg} border border-border/60 shadow-sm hover:shadow-md transition-all cursor-pointer rounded-2xl`}
                  onClick={() => setStatDialogType(stat.key as any)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground mb-1 truncate">{stat.label}</p>
                      <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Your Current Exams Status */}
          <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">Your Current Exams Status</h3>
                  <p className="text-xs text-muted-foreground">Tracking <span className="text-primary font-semibold">{selfCareExams.length}</span> active applications</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-1" asChild>
                <Link to="/student/self-care">View All <ArrowRight className="h-3.5 w-3.5" /></Link>
              </Button>
            </div>
            
            {selfCareExams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selfCareExams.slice(0, 4).map((exam) => {
                  const currentStageIdx = exam.stages.findIndex(s => s.status === 'pending');
                  return (
                    <Card key={exam.id} className="p-4 border border-border/60 rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-sm">{exam.name}</h4>
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">{exam.category}</span>
                        </div>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs">
                          <Flame className="h-3 w-3 mr-1" />Active
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1 mb-3">
                        {exam.stages.map((stage, idx) => (
                          <React.Fragment key={idx}>
                            <div className={`flex flex-col items-center ${idx <= currentStageIdx || currentStageIdx === -1 ? '' : 'opacity-40'}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                                stage.status === 'cleared' ? 'bg-emerald-500 text-white border-emerald-500' :
                                stage.status === 'pending' && idx === currentStageIdx ? 'bg-primary text-primary-foreground border-primary border-dashed' :
                                'bg-muted text-muted-foreground border-muted'
                              }`}>
                                {idx + 1}
                              </div>
                              <span className="text-[9px] font-medium text-muted-foreground mt-1 text-center leading-tight max-w-[60px] truncate">
                                {stage.name.toUpperCase()}
                              </span>
                            </div>
                            {idx < exam.stages.length - 1 && (
                              <div className={`flex-1 h-0.5 mt-[-12px] ${stage.status === 'cleared' ? 'bg-emerald-400' : 'bg-muted'}`} />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      
                      {exam.firstExamDate && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 text-primary" />
                          <span>{new Date(exam.firstExamDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No active exam applications yet.</p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link to="/student/self-care">Add Your First Exam</Link>
                </Button>
              </div>
            )}
          </Card>

          {/* Upcoming Exams */}
          <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-base">Upcoming Exams</h3>
              </div>
              <Button variant="link" size="sm" className="gap-1 text-primary" asChild>
                <Link to="/student/exam-notifications">View More <ArrowRight className="h-3.5 w-3.5" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {upcomingExamsList.map((exam, idx) => (
                <Link key={idx} to="/student/exam-notifications">
                  <Card className="p-3 text-center border border-border/50 rounded-xl hover:shadow-md transition-all cursor-pointer hover:border-primary/30">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-muted/60 flex items-center justify-center text-2xl mb-2">
                      {exam.icon}
                    </div>
                    <p className="text-xs font-semibold text-foreground leading-tight mb-1 line-clamp-2">{exam.name}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1 mb-1.5">
                      <Calendar className="h-2.5 w-2.5" />{exam.date}
                    </p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${exam.badgeColor}`}>
                      {exam.badge === 'Hot' && <span className="mr-0.5">🔥</span>}
                      {exam.badge === 'New' && <span className="mr-0.5">✨</span>}
                      {exam.badge === 'Closing' && <span className="mr-0.5">⏰</span>}
                      {exam.badge}
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </Card>

          {/* Performance Graph + Study Status Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="p-4 sm:p-5 bg-card lg:col-span-2 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-primary rounded-full" />
                <div>
                  <h3 className="font-semibold text-base leading-tight">Goal</h3>
                  <h3 className="font-semibold text-base leading-tight">Completion</h3>
                </div>
                <div className="ml-auto flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary" />Tests</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-sky-300" />Quizzes</span>
                </div>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="testGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="quizGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7dd3fc" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#7dd3fc" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="quizzes" stroke="#7dd3fc" strokeWidth={2.5} fill="url(#quizGrad)" dot={{ fill: '#7dd3fc', strokeWidth: 2, r: 4 }} />
                    <Area type="monotone" dataKey="tests" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#testGrad)" dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h3 className="font-semibold text-base">Study Status</h3>
              </div>
              <div className="h-52 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={studyStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                      {studyStatusData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold">{totalTests}</span>
                  <span className="text-xs text-muted-foreground">Total</span>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {studyStatusData.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Mock Test Performance */}
          <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <BarChart3 className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-base">Recent Mock Test Performance</h3>
              </div>
              <Button variant="link" size="sm" className="gap-1 text-primary" asChild>
                <Link to="/student/tests">View All <ArrowRight className="h-3.5 w-3.5" /></Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Test</th>
                    <th className="text-center py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score</th>
                    <th className="text-center py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Accuracy</th>
                    <th className="text-center py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Date</th>
                    <th className="text-center py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMockTests.map((test, idx) => (
                    <tr key={idx} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-3">
                        <p className="font-medium text-sm text-foreground">{test.name}</p>
                      </td>
                      <td className="text-center py-3 px-3">
                        <span className="font-bold text-emerald-600">{test.score}</span>
                        <span className="text-muted-foreground">/{test.total}</span>
                      </td>
                      <td className="text-center py-3 px-3">
                        <span className="font-medium">{test.accuracy}%</span>
                      </td>
                      <td className="text-center py-3 px-3 text-muted-foreground hidden sm:table-cell">{test.date}</td>
                      <td className="text-center py-3 px-3">
                        <Badge className="bg-primary/10 text-primary border-0 font-bold">#{test.rank}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 pt-3 border-t border-border/40">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-600">↑ +7 marks improvement over last 3 tests</span>
              </div>
            </div>
           </Card>

          {/* My Courses Progress */}
          <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <BookOpen className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-base">My Courses</h3>
              </div>
              <Button variant="link" size="sm" className="gap-1 text-primary" asChild>
                <Link to="/student/courses">View All <ArrowRight className="h-3.5 w-3.5" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { title: 'SBI PO Prelims Crash Course', progress: 65, lessons: 24, total: 36, icon: '🏦' },
                { title: 'Quant Speed Booster', progress: 42, lessons: 10, total: 25, icon: '📊' },
                { title: 'Reasoning Master Class', progress: 80, lessons: 20, total: 25, icon: '🧩' },
              ].map((course, idx) => (
                <Link key={idx} to="/student/courses" className="block">
                  <Card className="p-4 border border-border/50 rounded-xl hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg flex-shrink-0">
                        {course.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{course.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{course.lessons}/{course.total} lessons completed</p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-bold text-primary">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <Bell className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-base">Recent Exam Notifications</h3>
              </div>
              <Button variant="link" size="sm" className="gap-1 text-primary" asChild>
                <Link to="/student/exam-notifications">View All <ArrowRight className="h-3.5 w-3.5" /></Link>
              </Button>
            </div>
            <div className="space-y-2">
              {recentNotifications.map((notif) => (
                <div key={notif.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm truncate">{notif.examName}</p>
                        {notif.notificationStatus === 'new' && (
                          <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0">NEW</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Apply: {notif.applicationPeriod.startDate} - {notif.applicationPeriod.endDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {notif.applyStatus === 'applied' ? (
                      <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-600 border-emerald-200">Applied</Badge>
                    ) : notif.resultStatus === 'declared' ? (
                      <Badge variant="outline" className="text-xs bg-sky-50 text-sky-600 border-sky-200">Result Out</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                        Applications Open
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                      {notif.applyStatus === 'applied' ? 'Details' : 'Apply'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Bottom Row: Top Performers + Weekly Activity + Vocabulary - visible on mobile/tablet only */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
            <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h3 className="font-semibold text-base">Top Performers</h3>
              </div>
              <div className="space-y-3">
                {topPerformers.map((p, i) => (
                  <div key={i} className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${p.name === 'You' ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50'}`}>
                    <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
                    <span className="text-xl">{p.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${p.name === 'You' ? 'text-primary' : ''}`}>{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.tests} tests</p>
                    </div>
                    <span className="text-sm font-bold">{p.score}%</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h3 className="font-semibold text-base">Weekly Activity</h3>
                <span className="ml-auto text-xs font-medium text-primary">This Week</span>
              </div>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivity} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} domain={[0, 10]} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
                    <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Avg: <strong className="text-foreground">5.3h</strong>/day</span>
                <span>Total: <strong className="text-foreground">37.4h</strong></span>
              </div>
            </Card>

            <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h3 className="font-semibold text-base">Word of the Day</h3>
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="text-center p-3 bg-primary/5 rounded-xl border border-primary/10 mb-3">
                <h4 className="text-xl font-bold text-primary mb-0.5">{todayVocab.word}</h4>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{todayVocab.type}</span>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-0.5">Meaning</p>
                  <p className="text-sm">{todayVocab.meaning}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-0.5">Example</p>
                  <p className="text-sm italic text-muted-foreground">"{todayVocab.example}"</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Synonyms</p>
                  <div className="flex flex-wrap gap-1.5">
                    {todayVocab.synonyms.map((syn, idx) => (
                      <span key={idx} className="text-xs bg-muted px-2 py-1 rounded-full">{syn}</span>
                    ))}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                <Bookmark className="h-3 w-3 mr-2" />Save to Vocabulary List
              </Button>
            </Card>

            {/* Strict Study Mode - Mobile */}
            <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
                <h3 className="font-semibold text-base">Strict Study Mode</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-muted/40 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Last Session</p>
                  <p className="text-lg font-bold text-foreground">45 min</p>
                </div>
                <div className="bg-muted/40 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Focus Score</p>
                  <p className="text-lg font-bold text-emerald-600">87%</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 p-2 bg-muted/30 rounded-lg">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>Next Planned Session: <strong className="text-foreground">4:00 PM Today</strong></span>
              </div>
              <Button className="w-full gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={startStrictMode}>
                <Lock className="h-4 w-4" />Start Strict Mode (25 min)
              </Button>
            </Card>
          </div>

          {/* Current Affairs Section */}
          <Card className="p-4 bg-card border border-border/60 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <Newspaper className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-base">Current Affairs</h3>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrevNews}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNextNews}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {currentAffairsData.map((item, idx) => (
                <div key={idx} className="group cursor-pointer" onClick={() => handleNewsClick(item)}>
                  <div className="relative rounded-xl overflow-hidden mb-2">
                    <img src={item.image} alt={item.title} className="w-full h-36 object-cover transition-transform group-hover:scale-105" />
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 bg-card/80 hover:bg-card rounded-full">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{item.category}</p>
                  <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Mobile Right Sidebar Content */}
          <div className="lg:hidden space-y-4">
            <Card className="p-4 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-primary rounded-full" />
                  <h3 className="font-semibold text-sm">Your Presence</h3>
                </div>
                <div className="flex gap-1">
                  <Button variant={attendanceView === 'week' ? 'default' : 'outline'} size="sm" className="h-7 text-xs px-3" onClick={() => setAttendanceView('week')}>Week</Button>
                  <Button variant={attendanceView === 'month' ? 'default' : 'outline'} size="sm" className="h-7 text-xs px-3" onClick={() => setAttendanceView('month')}>Month</Button>
                </div>
              </div>
              <div className="space-y-1 mb-4">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-muted-foreground">{day}</div>
                  ))}
                </div>
                {monthPresence.map((week, wIdx) => (
                  <div key={wIdx} className="grid grid-cols-7 gap-1">
                    {week.map((present, dIdx) => (
                      <div key={dIdx} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${wIdx === 3 && dIdx === 0 ? 'bg-amber-500 text-white' : present ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {wIdx === 3 && dIdx === 0 ? '○' : present ? '✓' : ''}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h3 className="font-semibold text-sm">Free Test/Quiz</h3>
              </div>
              <div className="space-y-2">
                {freeTests.map((test, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{test.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{test.questions} Qs</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{test.duration} mins</span>
                        </p>
                      </div>
                    </div>
                    <Button size="sm" className="h-8 gap-1"><Play className="h-3 w-3" />Start</Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-3" asChild>
                <Link to="/student/tests">View All Tests</Link>
              </Button>
            </Card>
          </div>
        </div>

        {/* Right Sidebar - Desktop Only */}
        <div className="hidden lg:block w-72 flex-shrink-0 space-y-4">
          <Card className="p-4 bg-card border border-border/60 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h3 className="font-semibold text-sm">Your Presence</h3>
              </div>
              <div className="flex gap-1">
                <Button variant={attendanceView === 'week' ? 'default' : 'outline'} size="sm" className="h-7 text-xs px-3" onClick={() => setAttendanceView('week')}>Week</Button>
                <Button variant={attendanceView === 'month' ? 'default' : 'outline'} size="sm" className="h-7 text-xs px-3" onClick={() => setAttendanceView('month')}>Month</Button>
              </div>
            </div>
            <div className="space-y-1 mb-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground">{day}</div>
                ))}
              </div>
              {monthPresence.map((week, wIdx) => (
                <div key={wIdx} className="grid grid-cols-7 gap-1">
                  {week.map((present, dIdx) => (
                    <div key={dIdx} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${wIdx === 3 && dIdx === 0 ? 'bg-amber-500 text-white' : present ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {wIdx === 3 && dIdx === 0 ? '○' : present ? '✓' : ''}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><ChevronLeft className="h-4 w-4" /></Button>
                <h4 className="font-semibold text-sm">March 2026</h4>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><ChevronRight className="h-4 w-4" /></Button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {[9, 10, 11, 12, 13, 14, 15].map((date, idx) => (
                  <div key={date} className={`py-2 rounded-lg text-sm cursor-pointer hover:bg-muted ${idx === 6 ? 'bg-primary text-primary-foreground' : ''}`}>{date}</div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border border-border/60 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-primary rounded-full" />
              <h3 className="font-semibold text-sm">Free Test/Quiz</h3>
            </div>
            <div className="space-y-2">
              {freeTests.map((test, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{test.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>{test.questions} Qs</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{test.duration} mins</span>
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="h-8 gap-1"><Play className="h-3 w-3" />Start</Button>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-3" asChild>
              <Link to="/student/tests">View All Tests</Link>
            </Button>
          </Card>

          {/* Strict Study Mode - Sidebar */}
          <Card className="p-4 bg-card border border-border/60 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
              <h3 className="font-semibold text-sm">Strict Study Mode</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-muted/40 rounded-xl p-2.5 text-center">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Last Session</p>
                <p className="text-base font-bold text-foreground">45 min</p>
              </div>
              <div className="bg-muted/40 rounded-xl p-2.5 text-center">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Focus Score</p>
                <p className="text-base font-bold text-emerald-600">87%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 p-2 bg-muted/30 rounded-lg">
              <Clock className="h-3 w-3 text-primary" />
              <span>Next: <strong className="text-foreground">4:00 PM</strong></span>
            </div>
            <Button className="w-full gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs" size="sm" onClick={startStrictMode}>
              <Lock className="h-3.5 w-3.5" />Start Strict Mode (25 min)
            </Button>
          </Card>

          {/* Top Performers - Sidebar */}
          <Card className="p-4 bg-card border border-border/60 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-primary rounded-full" />
              <h3 className="font-semibold text-sm">Top Performers</h3>
            </div>
            <div className="space-y-2">
              {topPerformers.map((p, i) => (
                <div key={i} className={`flex items-center gap-2.5 p-2 rounded-xl transition-colors ${p.name === 'You' ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50'}`}>
                  <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                  <span className="text-lg">{p.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${p.name === 'You' ? 'text-primary' : ''}`}>{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.tests} tests</p>
                  </div>
                  <span className="text-xs font-bold">{p.score}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Weekly Activity - Sidebar */}
          <Card className="p-4 bg-card border border-border/60 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-primary rounded-full" />
              <h3 className="font-semibold text-sm">Weekly Activity</h3>
              <span className="ml-auto text-[10px] font-medium text-primary">This Week</span>
            </div>
            <div className="h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} domain={[0, 10]} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '11px' }} />
                  <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground">
              <span>Avg: <strong className="text-foreground">5.3h</strong>/day</span>
              <span>Total: <strong className="text-foreground">37.4h</strong></span>
            </div>
          </Card>

          {/* Word of the Day - Sidebar */}
          <Card className="p-4 bg-card border border-border/60 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-primary rounded-full" />
              <h3 className="font-semibold text-sm">Word of the Day</h3>
              <span className="ml-auto text-[10px] text-muted-foreground">
                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            </div>
            <div className="text-center p-3 bg-primary/5 rounded-xl border border-primary/10 mb-3">
              <h4 className="text-lg font-bold text-primary mb-0.5">{todayVocab.word}</h4>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{todayVocab.type}</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div>
                <p className="font-medium text-muted-foreground mb-0.5">Meaning</p>
                <p>{todayVocab.meaning}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground mb-0.5">Example</p>
                <p className="italic text-muted-foreground">"{todayVocab.example}"</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground mb-1">Synonyms</p>
                <div className="flex flex-wrap gap-1">
                  {todayVocab.synonyms.map((syn, idx) => (
                    <span key={idx} className="text-[10px] bg-muted px-2 py-0.5 rounded-full">{syn}</span>
                  ))}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
              <Bookmark className="h-3 w-3 mr-1.5" />Save to Vocabulary List
            </Button>
          </Card>
        </div>
        </div>{/* end flex-row */}
      </div>

      {/* Strict Study Mode Full-Screen Overlay */}
      {isStrictModeActive && (
        <div className="fixed inset-0 z-50 bg-[hsl(220,20%,8%)] flex items-center justify-center">
          <div className="text-center text-white max-w-md w-full px-6">
            <div className="mb-2">
              <Lock className="h-8 w-8 mx-auto text-destructive mb-3" />
              <h2 className="text-lg font-semibold text-white/80 uppercase tracking-wider">Strict Study Mode</h2>
            </div>
            
            <div className="text-7xl font-black tracking-tight my-8 text-white">
              {formatStrictTime(strictTimeLeft)}
            </div>

            <div className="mb-4">
              <p className="text-sm text-white/50 mb-2">Current Task</p>
              <p className="text-base font-medium text-white/80">Quantitative Aptitude - Practice Set 5</p>
            </div>

            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-8">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-destructive to-emerald-500 transition-all duration-1000" 
                style={{ width: `${strictProgress}%` }} 
              />
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 gap-2"
                onClick={() => setIsStrictPaused(!isStrictPaused)}
              >
                {isStrictPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {isStrictPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button 
                variant="outline" 
                className="border-destructive/50 text-destructive hover:bg-destructive/10 gap-2"
                onClick={() => { setIsStrictModeActive(false); setStrictTimeLeft(25 * 60); }}
              >
                <X className="h-4 w-4" />End Session
              </Button>
            </div>
          </div>
        </div>
      )}

      <NewsArticleDialog article={selectedNews} open={newsDialogOpen} onOpenChange={setNewsDialogOpen} />
      {statDialogType && (
        <StatCardDialog type={statDialogType} open={!!statDialogType} onOpenChange={(open) => !open && setStatDialogType(null)} />
      )}
    </div>
  );
};

export default StudentDashboard;
