
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Target, ChevronLeft, ChevronRight, Newspaper, Bookmark, LayoutGrid,
  Play, Clock, FileText, TrendingUp, Users, Award, Calendar, BarChart3,
  Trophy, Bell, ExternalLink, ArrowRight, Flame, Sparkles, CheckCircle2,
  MapPin, Lock, Pause, X, BookOpen, Search, ChevronDown, Zap, Star,
  GraduationCap, Timer
} from 'lucide-react';
import NewsArticleDialog from '@/components/student/NewsArticleDialog';
import StatCardDialog from '@/components/student/StatCardDialog';
import { useSelfCareExams } from '@/hooks/useSelfCareExams';
import { examNotifications } from '@/data/examNotificationData';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar
} from 'recharts';

// Stat cards for Overview tab
const statCards = [
  { key: 'journey', label: 'Journey Days', value: '347', sub: 'Preparation ongoing', icon: Calendar, bg: 'bg-sky-50 dark:bg-sky-950/30', iconBg: 'bg-gradient-to-br from-sky-400 to-blue-500', accent: 'text-sky-600' },
  { key: 'hours', label: 'Study Hours', value: '195', sub: '6+ hours today', icon: Clock, bg: 'bg-violet-50 dark:bg-violet-950/30', iconBg: 'bg-gradient-to-br from-violet-400 to-purple-500', accent: 'text-violet-600' },
  { key: 'active', label: 'Active Streak', value: '67', sub: 'Days in a row', icon: Flame, bg: 'bg-emerald-50 dark:bg-emerald-950/30', iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500', accent: 'text-emerald-600' },
  { key: 'tests', label: 'Tests Done', value: '40', sub: 'Last test 2 days ago', icon: Award, bg: 'bg-orange-50 dark:bg-orange-950/30', iconBg: 'bg-gradient-to-br from-orange-400 to-red-400', accent: 'text-orange-600' },
  { key: 'tasks', label: "Today's Tasks", value: '3/5', sub: '2 pending', icon: CheckCircle2, bg: 'bg-pink-50 dark:bg-pink-950/30', iconBg: 'bg-gradient-to-br from-pink-400 to-rose-500', accent: 'text-pink-600' },
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

// Upcoming exams
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

// Section-wise readiness for donut charts
const sectionReadiness = [
  { name: 'Quantitative', percent: 72, color: '#38bdf8' },
  { name: 'Reasoning', percent: 85, color: '#a78bfa' },
  { name: 'English', percent: 64, color: '#fbbf24' },
  { name: 'Gen. Awareness', percent: 58, color: '#34d399' },
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
  { title: 'Quantitative Aptitude', questions: 25, duration: 30, difficulty: 'Medium' },
  { title: 'Reasoning Ability', questions: 20, duration: 25, difficulty: 'Hard' },
  { title: 'English Language', questions: 30, duration: 20, difficulty: 'Easy' },
  { title: 'General Awareness', questions: 25, duration: 15, difficulty: 'Medium' },
  { title: 'Computer Knowledge', questions: 20, duration: 15, difficulty: 'Easy' },
];

const liveTests = [
  { title: 'SBI Clerk Prelims Live Mock', time: '4:00 PM Today', participants: 1240, isLive: true },
  { title: 'IBPS PO Full Mock Test', time: '10:00 AM Tomorrow', participants: 890, isLive: false },
  { title: 'SSC CGL Tier 1 Practice', time: 'Wed, 6:00 PM', participants: 560, isLive: false },
];

// Mini donut chart component for subject readiness
const SubjectDonut = ({ percent, color, name }: { percent: number; color: string; name: string }) => {
  const data = [
    { value: percent },
    { value: 100 - percent },
  ];
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-14 h-14 sm:w-16 sm:h-16">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={18} outerRadius={25} dataKey="value" strokeWidth={0} startAngle={90} endAngle={-270}>
              <Cell fill={color} />
              <Cell fill="hsl(var(--muted))" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-foreground">{percent}%</span>
        </div>
      </div>
      <span className="text-[10px] font-medium text-muted-foreground text-center leading-tight">{name}</span>
    </div>
  );
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [newsDialogOpen, setNewsDialogOpen] = useState(false);
  const [statDialogType, setStatDialogType] = useState<'journey' | 'hours' | 'active' | 'tests' | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Study Timer state
  const [timerMinutes, setTimerMinutes] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(30 * 60);
  const [timerPaused, setTimerPaused] = useState(false);

  // Strict Study Mode state
  const [isStrictModeActive, setIsStrictModeActive] = useState(false);
  const [strictTimeLeft, setStrictTimeLeft] = useState(25 * 60);
  const [isStrictPaused, setIsStrictPaused] = useState(false);

  // Today's Goals
  const [goals, setGoals] = useState([
    { id: 1, text: 'Complete Quant Practice Set 5', done: true },
    { id: 2, text: 'Revise Reasoning Puzzles', done: false },
    { id: 3, text: 'Read Current Affairs (Banking)', done: false },
    { id: 4, text: 'Attempt 1 Full Mock Test', done: false },
  ]);
  const [newGoal, setNewGoal] = useState('');

  const { exams: selfCareExams } = useSelfCareExams();
  const recentNotifications = examNotifications.slice(0, 5);

  const currentAffairsData = [
    { title: 'RBI Policy Updates', description: 'Latest monetary policy decisions and their impact on banking...', category: 'Today', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400', content: 'The Reserve Bank of India kept the repo rate unchanged at 6.5% in its latest monetary policy review.' },
    { title: 'Budget Highlights 2024', description: 'Key announcements from the union budget affecting...', category: 'Yesterday', image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400', content: 'The Union Budget 2024 introduced several key reforms affecting multiple sectors.' },
    { title: 'New Government Schemes', description: 'Important welfare programs launched this month for...', category: '2 days ago', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400', content: 'The government has launched new digital banking initiatives for rural areas.' },
  ];

  const vocabularyBank = [
    { word: 'Ephemeral', meaning: 'Lasting for a very short time', example: 'The ephemeral beauty of cherry blossoms.', type: 'Adjective', synonyms: ['Transient', 'Fleeting', 'Brief'] },
    { word: 'Ubiquitous', meaning: 'Present, appearing, or found everywhere', example: 'Mobile phones have become ubiquitous.', type: 'Adjective', synonyms: ['Omnipresent', 'Pervasive', 'Universal'] },
    { word: 'Pragmatic', meaning: 'Dealing with things sensibly and realistically', example: 'A pragmatic approach to solving problems.', type: 'Adjective', synonyms: ['Practical', 'Realistic', 'Sensible'] },
  ];
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const todayVocab = vocabularyBank[dayOfYear % vocabularyBank.length];

  const totalTests = studyStatusData.reduce((a, b) => a + b.value, 0);

  const examDate = new Date('2026-04-15');
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((examDate.getTime() - today.getTime()) / 86400000));
  const overallPrep = 72;

  // Study timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timerActive && !timerPaused) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) { setTimerActive(false); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [timerActive, timerPaused]);

  // Strict mode timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isStrictModeActive && !isStrictPaused) {
      interval = setInterval(() => {
        setStrictTimeLeft((prev) => {
          if (prev <= 1) { setIsStrictModeActive(false); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isStrictModeActive, isStrictPaused]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startTimer = (mins: number) => {
    setTimerMinutes(mins);
    setTimerSeconds(mins * 60);
    setTimerActive(true);
    setTimerPaused(false);
  };

  const startStrictMode = () => {
    setStrictTimeLeft(25 * 60);
    setIsStrictModeActive(true);
    setIsStrictPaused(false);
  };

  const strictProgress = ((25 * 60 - strictTimeLeft) / (25 * 60)) * 100;

  const toggleGoal = (id: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, done: !g.done } : g));
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, { id: Date.now(), text: newGoal.trim(), done: false }]);
      setNewGoal('');
    }
  };

  const handleNewsClick = (news: any) => { setSelectedNews(news); setNewsDialogOpen(true); };

  // Overall progress donut data
  const overallDonutData = [
    { value: overallPrep },
    { value: 100 - overallPrep },
  ];

  return (
    <div className="h-screen overflow-y-auto bg-muted/30">
      <div className="p-3 sm:p-4 max-w-full space-y-4">

        {/* Enhanced Target Examination Card */}
        <Card className="overflow-hidden border border-border/80 shadow-sm rounded-2xl bg-card">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-6">
              {/* Left: Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">Target Examination</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-0.5">SBI CLERK</h1>
                <p className="text-sm text-muted-foreground mb-3">Preliminary Examination · 13,735 Vacancies</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="flex items-center gap-1.5 text-xs bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border">
                    <Clock className="h-3 w-3 text-primary" /> 60 min · 100 marks
                  </span>
                  <span className="flex items-center gap-1.5 text-xs bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border">
                    <Calendar className="h-3 w-3 text-primary" /> Day 47 of Prep
                  </span>
                  <span className="flex items-center gap-1.5 text-xs bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border">
                    <MapPin className="h-3 w-3 text-primary" /> Pan India
                  </span>
                </div>

                {/* Subject-wise Donut Charts */}
                <div className="flex items-center gap-4 sm:gap-6 mb-4">
                  {sectionReadiness.map((sec) => (
                    <SubjectDonut key={sec.name} percent={sec.percent} color={sec.color} name={sec.name} />
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="default" className="text-xs h-8 gap-1" asChild>
                    <Link to="/student/tests"><Play className="h-3 w-3" />Start Full Mock</Link>
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-8 gap-1" asChild>
                    <Link to="/student/syllabus"><BookOpen className="h-3 w-3" />View Syllabus</Link>
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-8 gap-1">
                    <TrendingUp className="h-3 w-3" />Score Prediction
                  </Button>
                </div>
              </div>

              {/* Right: Overall Progress + Days Left */}
              <div className="flex flex-row lg:flex-col items-center gap-4 flex-shrink-0">
                {/* Overall Circular Progress */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={overallDonutData} cx="50%" cy="50%" innerRadius={32} outerRadius={44} dataKey="value" strokeWidth={0} startAngle={90} endAngle={-270}>
                        <Cell fill="hsl(var(--primary))" />
                        <Cell fill="hsl(var(--muted))" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl sm:text-2xl font-black text-primary">{overallPrep}%</span>
                    <span className="text-[9px] text-muted-foreground">Overall</span>
                  </div>
                </div>

                {/* Days Left Box */}
                <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-4 text-center min-w-[110px] border border-emerald-200 dark:border-emerald-800">
                  <div className="text-3xl sm:text-4xl font-black text-emerald-600 leading-none">{daysLeft}</div>
                  <div className="text-xs font-semibold text-emerald-600 mt-1">Days Left</div>
                  <div className="w-full h-px bg-emerald-200 dark:bg-emerald-800 my-2" />
                  <div className="text-[10px] text-muted-foreground">Exam Date</div>
                  <div className="text-xs font-semibold text-foreground">15 Apr 2026</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 h-11 rounded-xl bg-muted/60 border border-border/60">
            <TabsTrigger value="overview" className="text-xs sm:text-sm font-medium rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1">
              <LayoutGrid className="h-3.5 w-3.5 hidden sm:block" />Overview
            </TabsTrigger>
            <TabsTrigger value="practice" className="text-xs sm:text-sm font-medium rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1">
              <Zap className="h-3.5 w-3.5 hidden sm:block" />Practice
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-xs sm:text-sm font-medium rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1">
              <BarChart3 className="h-3.5 w-3.5 hidden sm:block" />Performance
            </TabsTrigger>
            <TabsTrigger value="resources" className="text-xs sm:text-sm font-medium rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1">
              <BookOpen className="h-3.5 w-3.5 hidden sm:block" />Resources
            </TabsTrigger>
          </TabsList>

          {/* =================== OVERVIEW TAB =================== */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* 5 Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card 
                    key={stat.key}
                    className={`p-3 sm:p-4 ${stat.bg} border border-border/60 shadow-sm hover:shadow-md transition-all cursor-pointer rounded-2xl`}
                    onClick={() => stat.key !== 'tasks' && setStatDialogType(stat.key as any)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1 truncate">{stat.label}</p>
                        <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                      </div>
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${stat.iconBg} flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Today's Goals + Study Timer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Today's Goals */}
              <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-primary rounded-full" />
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-base">Today's Goals</h3>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {goals.filter(g => g.done).length}/{goals.length} done
                  </Badge>
                </div>
                <div className="space-y-2 mb-3">
                  {goals.map((goal) => (
                    <div 
                      key={goal.id} 
                      className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${goal.done ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-muted/30 hover:bg-muted/50'}`}
                      onClick={() => toggleGoal(goal.id)}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${goal.done ? 'bg-emerald-500 border-emerald-500' : 'border-muted-foreground/40'}`}>
                        {goal.done && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </div>
                      <span className={`text-sm flex-1 ${goal.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{goal.text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 text-sm border border-border rounded-lg px-3 py-2 bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Add a new goal..."
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addGoal()}
                  />
                  <Button size="sm" onClick={addGoal} disabled={!newGoal.trim()}>Add</Button>
                </div>
              </Card>

              {/* Study Timer */}
              <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 bg-primary rounded-full" />
                  <Timer className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-base">Study Timer</h3>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-5xl font-black text-foreground tracking-tight mb-2">
                    {formatTime(timerSeconds)}
                  </div>
                  {timerActive && (
                    <p className="text-xs text-muted-foreground">{timerMinutes} minute session</p>
                  )}
                </div>

                {!timerActive ? (
                  <>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {[30, 60, 90, 120].map((mins) => (
                        <Button 
                          key={mins} 
                          variant={timerMinutes === mins ? 'default' : 'outline'} 
                          size="sm" 
                          className="text-xs"
                          onClick={() => { setTimerMinutes(mins); setTimerSeconds(mins * 60); }}
                        >
                          {mins >= 60 ? `${mins / 60}hr` : `${mins}m`}
                        </Button>
                      ))}
                    </div>
                    <Button className="w-full gap-2" onClick={() => startTimer(timerMinutes)}>
                      <Play className="h-4 w-4" />Start Studying
                    </Button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 gap-1" onClick={() => setTimerPaused(!timerPaused)}>
                      {timerPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      {timerPaused ? 'Resume' : 'Pause'}
                    </Button>
                    <Button variant="destructive" className="gap-1" onClick={() => { setTimerActive(false); setTimerSeconds(timerMinutes * 60); }}>
                      <X className="h-4 w-4" />Stop
                    </Button>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-border/40">
                  <Button variant="ghost" size="sm" className="w-full gap-2 text-xs text-destructive hover:text-destructive" onClick={startStrictMode}>
                    <Lock className="h-3.5 w-3.5" />Start Strict Mode (25 min focus)
                  </Button>
                </div>
              </Card>
            </div>

            {/* Current Exams Status */}
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
          </TabsContent>

          {/* =================== PRACTICE TAB =================== */}
          <TabsContent value="practice" className="space-y-4 mt-4">
            {/* Daily Free Tests */}
            <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-primary rounded-full" />
                  <FileText className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-base">Daily Free Tests</h3>
                </div>
                <Button variant="link" size="sm" className="gap-1 text-primary" asChild>
                  <Link to="/student/tests">View All <ArrowRight className="h-3.5 w-3.5" /></Link>
                </Button>
              </div>
              <div className="space-y-2">
                {freeTests.map((test, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{test.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-3">
                          <span>{test.questions} Qs</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{test.duration} mins</span>
                          <Badge variant="outline" className="text-[10px] h-4 px-1.5">{test.difficulty}</Badge>
                        </p>
                      </div>
                    </div>
                    <Button size="sm" className="h-8 gap-1"><Play className="h-3 w-3" />Start</Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Upcoming Live Tests */}
            <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-destructive rounded-full" />
                <Zap className="h-4 w-4 text-destructive" />
                <h3 className="font-semibold text-base">Upcoming Live Tests</h3>
              </div>
              <div className="space-y-3">
                {liveTests.map((test, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-border/60 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      {test.isLive && (
                        <span className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{test.title}</p>
                          {test.isLive && <Badge className="bg-destructive text-destructive-foreground text-[10px] h-4 px-1.5">LIVE</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <Clock className="h-3 w-3" />{test.time}
                          <span>·</span>
                          <Users className="h-3 w-3" />{test.participants.toLocaleString()} registered
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant={test.isLive ? 'default' : 'outline'} className="h-8 gap-1">
                      {test.isLive ? <><Play className="h-3 w-3" />Join Now</> : 'Register'}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Speed Drills */}
            <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-amber-500 rounded-full" />
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <h3 className="font-semibold text-base">Speed Drills</h3>
                </div>
                <Button variant="link" size="sm" className="gap-1 text-primary" asChild>
                  <Link to="/student/speed-drills">View All <ArrowRight className="h-3.5 w-3.5" /></Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Simplification', 'Number Series', 'Syllogism', 'Reading Comp.'].map((drill, idx) => (
                  <Card key={idx} className="p-3 text-center border border-border/50 rounded-xl hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mb-2">
                      <Zap className="h-5 w-5 text-amber-500" />
                    </div>
                    <p className="text-xs font-semibold text-foreground">{drill}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">10 Qs · 5 min</p>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* =================== PERFORMANCE TAB =================== */}
          <TabsContent value="performance" className="space-y-4 mt-4">
            {/* Performance Graph */}
            <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-primary rounded-full" />
                <div>
                  <h3 className="font-semibold text-base">Weekly Performance</h3>
                  <p className="text-xs text-muted-foreground">Average scores over 8 weeks</p>
                </div>
                <div className="ml-auto flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary" />Tests</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-sky-300" />Quizzes</span>
                </div>
              </div>
              <div className="h-[300px] w-full">
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

            {/* Study Status + Percentile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Study Status Donut */}
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

              {/* Exam Percentile + Strong/Weak */}
              <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 bg-primary rounded-full" />
                  <h3 className="font-semibold text-base">Your Standing</h3>
                </div>
                <div className="text-center mb-4">
                  <div className="text-5xl font-black text-primary">85.1</div>
                  <div className="text-sm text-muted-foreground mt-1">Percentile Rank</div>
                  <p className="text-xs text-muted-foreground mt-2">You're ahead of 85% of test takers</p>
                </div>
                <div className="space-y-3 mt-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="flex items-center gap-1.5 text-emerald-600 font-medium"><TrendingUp className="h-3 w-3" />Strongest: Reasoning</span>
                      <span className="font-bold">85%</span>
                    </div>
                    <Progress value={85} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="flex items-center gap-1.5 text-amber-600 font-medium"><TrendingUp className="h-3 w-3 rotate-180" />Weakest: Gen. Awareness</span>
                      <span className="font-bold">58%</span>
                    </div>
                    <Progress value={58} className="h-1.5" />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {topPerformers.slice(0, 4).map((p, i) => (
                    <div key={i} className={`flex items-center gap-2 p-2 rounded-lg text-xs ${p.name === 'You' ? 'bg-primary/5 border border-primary/20' : 'bg-muted/30'}`}>
                      <span className="font-bold text-muted-foreground w-4">{i + 1}</span>
                      <span>{p.avatar}</span>
                      <span className={`truncate ${p.name === 'You' ? 'text-primary font-medium' : ''}`}>{p.name}</span>
                      <span className="ml-auto font-bold">{p.score}%</span>
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
                  <h3 className="font-semibold text-base">Recent Mock Tests</h3>
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
                        <td className="py-3 px-3"><p className="font-medium text-sm text-foreground">{test.name}</p></td>
                        <td className="text-center py-3 px-3"><span className="font-bold text-emerald-600">{test.score}</span><span className="text-muted-foreground">/{test.total}</span></td>
                        <td className="text-center py-3 px-3"><span className="font-medium">{test.accuracy}%</span></td>
                        <td className="text-center py-3 px-3 text-muted-foreground hidden sm:table-cell">{test.date}</td>
                        <td className="text-center py-3 px-3"><Badge className="bg-primary/10 text-primary border-0 font-bold">#{test.rank}</Badge></td>
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

            {/* Weekly Activity */}
            <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h3 className="font-semibold text-base">Weekly Activity</h3>
                <span className="ml-auto text-xs font-medium text-primary">This Week</span>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivity} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} domain={[0, 10]} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '11px' }} />
                    <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Avg: <strong className="text-foreground">5.3h</strong>/day</span>
                <span>Total: <strong className="text-foreground">37.4h</strong></span>
              </div>
            </Card>
          </TabsContent>

          {/* =================== RESOURCES TAB =================== */}
          <TabsContent value="resources" className="space-y-4 mt-4">
            {/* My Courses */}
            <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-primary rounded-full" />
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-base">Featured Courses</h3>
                </div>
                <Button variant="link" size="sm" className="gap-1 text-primary" asChild>
                  <Link to="/student/courses">View All <ArrowRight className="h-3.5 w-3.5" /></Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { title: 'SBI PO Prelims Crash Course', progress: 65, lessons: 24, total: 36, icon: '🏦', instructor: 'Arun Sharma', rating: 4.8 },
                  { title: 'Quant Speed Booster', progress: 42, lessons: 10, total: 25, icon: '📊', instructor: 'Nishit Sinha', rating: 4.6 },
                  { title: 'Reasoning Master Class', progress: 80, lessons: 20, total: 25, icon: '🧩', instructor: 'R.S. Aggarwal', rating: 4.9 },
                ].map((course, idx) => (
                  <Link key={idx} to="/student/courses" className="block">
                    <Card className="p-4 border border-border/50 rounded-xl hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                          {course.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{course.title}</h4>
                          <p className="text-xs text-muted-foreground">{course.instructor}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-medium">{course.rating}</span>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-[10px] mb-1">
                              <span className="text-muted-foreground">{course.lessons}/{course.total} lessons</span>
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
                        {exam.badge}
                      </span>
                    </Card>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-primary rounded-full" />
                  <Bell className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-base">Recent Notifications</h3>
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
                    <Button variant="ghost" size="sm" className="gap-1 text-xs" asChild>
                      <Link to="/student/exam-notifications"><ExternalLink className="h-3 w-3" /></Link>
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Word of the Day */}
            <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h3 className="font-semibold text-base">Word of the Day</h3>
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-xl border border-primary/10 min-w-[140px]">
                  <h4 className="text-xl font-bold text-primary mb-0.5">{todayVocab.word}</h4>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{todayVocab.type}</span>
                </div>
                <div className="space-y-2 flex-1">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-0.5">Meaning</p>
                    <p className="text-sm">{todayVocab.meaning}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-0.5">Example</p>
                    <p className="text-sm italic text-muted-foreground">"{todayVocab.example}"</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {todayVocab.synonyms.map((syn, idx) => (
                      <span key={idx} className="text-xs bg-muted px-2 py-1 rounded-full">{syn}</span>
                    ))}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1 text-xs flex-shrink-0">
                  <Bookmark className="h-3 w-3" />Save
                </Button>
              </div>
            </Card>

            {/* Current Affairs */}
            <Card className="p-4 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-primary rounded-full" />
                  <Newspaper className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-base">Current Affairs</h3>
                </div>
                <Button variant="link" size="sm" className="gap-1 text-primary" asChild>
                  <Link to="/student/current-affairs">View All <ArrowRight className="h-3.5 w-3.5" /></Link>
                </Button>
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
          </TabsContent>
        </Tabs>
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
              {formatTime(strictTimeLeft)}
            </div>
            <div className="mb-4">
              <p className="text-sm text-white/50 mb-2">Current Task</p>
              <p className="text-base font-medium text-white/80">Quantitative Aptitude - Practice Set 5</p>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-8">
              <div className="h-full rounded-full bg-gradient-to-r from-destructive to-emerald-500 transition-all duration-1000" style={{ width: `${strictProgress}%` }} />
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2" onClick={() => setIsStrictPaused(!isStrictPaused)}>
                {isStrictPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {isStrictPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10 gap-2" onClick={() => { setIsStrictModeActive(false); setStrictTimeLeft(25 * 60); }}>
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
