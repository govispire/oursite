
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
import ConfettiCelebration from '@/components/student/quiz/ConfettiCelebration';
import { useSelfCareExams } from '@/hooks/useSelfCareExams';
import { examNotifications } from '@/data/examNotificationData';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar
} from 'recharts';

// Streak milestone config
const STREAK_MILESTONES = [7, 15, 30, 50, 75, 100];

// Stat cards — consistent teal/primary palette
const statCards = [
  { key: 'journey', label: 'Journey Days', value: '14', sub: 'Since start of prep', icon: Calendar, iconBg: 'bg-primary' },
  { key: 'hours', label: 'Study Hours', value: '0', sub: 'Complete quizzes to track', icon: Clock, iconBg: 'bg-primary' },
  { key: 'active', label: 'Active Streak', value: '0', sub: 'Complete 2 quizzes today', icon: Flame, iconBg: 'bg-primary' },
  { key: 'tests', label: 'Tests Done', value: '0', sub: 'Start your first quiz!', icon: Award, iconBg: 'bg-primary' },
  { key: 'tasks', label: "Today's Tasks", value: '0/0', sub: '', icon: CheckCircle2, iconBg: 'bg-primary' },
] as const;

// Study status donut data
const studyStatusData = [
  { name: 'Passed', value: 28, color: 'hsl(var(--primary))' },
  { name: 'Pending', value: 8, color: 'hsl(var(--muted))' },
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
  { name: 'SSC CGL', tier: 'Tier I', date: '1 Sept 2026', daysLeft: 142, icon: '📋' },
  { name: 'IBPS PO', tier: 'Prelims', date: '15 Oct 2026', daysLeft: 186, icon: '🏦' },
  { name: 'IBPS Clerk', tier: 'Prelims', date: '20 Nov 2026', daysLeft: 222, icon: '🏦' },
  { name: 'SBI PO', tier: 'Prelims', date: '5 Dec 2026', daysLeft: 237, icon: '🏦' },
];

// Recent mock test performance data
const recentMockTests = [
  { name: 'SBI Clerk Prelims Mock 4', score: 82, total: 100, accuracy: 78.5, date: '12 Mar 2026', rank: 124 },
  { name: 'IBPS PO Prelims Mock 7', score: 76, total: 100, accuracy: 72.1, date: '10 Mar 2026', rank: 287 },
  { name: 'SBI Clerk Mains Mock 2', score: 118, total: 190, accuracy: 68.4, date: '8 Mar 2026', rank: 456 },
  { name: 'IBPS RRB PO Mock 3', score: 88, total: 100, accuracy: 81.2, date: '5 Mar 2026', rank: 98 },
];

// Section-wise readiness — consistent teal-green shades
const sectionReadiness = [
  { name: 'Quantitative', percent: 62, color: 'hsl(var(--primary))' },
  { name: 'Reasoning', percent: 70, color: '#6366f1' },
  { name: 'English', percent: 65, color: 'hsl(var(--primary))' },
  { name: 'Gen. Awareness', percent: 58, color: '#f59e0b' },
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
const SubjectDonut = ({ percent, color, name, size = 'md' }: { percent: number; color: string; name: string; size?: 'sm' | 'md' | 'lg' }) => {
  const dimensions = size === 'lg' ? { w: 'w-20 h-20 sm:w-24 sm:h-24', inner: 28, outer: 38, textSize: 'text-base sm:text-lg' } 
    : size === 'md' ? { w: 'w-16 h-16 sm:w-20 sm:h-20', inner: 22, outer: 32, textSize: 'text-sm' }
    : { w: 'w-14 h-14 sm:w-16 sm:h-16', inner: 18, outer: 25, textSize: 'text-xs' };
  const data = [
    { value: percent },
    { value: 100 - percent },
  ];
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`relative ${dimensions.w}`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={dimensions.inner} outerRadius={dimensions.outer} dataKey="value" strokeWidth={0} startAngle={90} endAngle={-270}>
              <Cell fill={color} />
              <Cell fill="hsl(var(--muted))" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${dimensions.textSize} font-bold text-foreground`}>{percent}%</span>
        </div>
      </div>
      <span className="text-[10px] sm:text-xs font-medium text-muted-foreground text-center leading-tight">{name}</span>
    </div>
  );
};

// Streak Milestone Banner
const StreakMilestoneBanner = ({ currentStreak, onClose }: { currentStreak: number; onClose: () => void }) => {
  const milestone = STREAK_MILESTONES.find(m => m === currentStreak);
  if (!milestone) return null;
  
  const messages: Record<number, string> = {
    7: '🔥 1 Week Streak! You\'re building a habit!',
    15: '⚡ 15 Day Streak! Consistency is key!',
    30: '🏆 30 Day Champion! One month strong!',
    50: '🌟 50 Day Legend! Halfway to 100!',
    75: '💎 75 Day Diamond! Almost there!',
    100: '👑 100 Day Master! Incredible dedication!',
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 sm:p-5 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
            {currentStreak >= 100 ? '👑' : currentStreak >= 50 ? '🌟' : '🔥'}
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg">{messages[milestone]}</h3>
            <p className="text-xs opacity-80 mt-0.5">Keep going! Next milestone: {STREAK_MILESTONES.find(m => m > currentStreak) || '∞'} days</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10 flex-shrink-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
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

  // Streak celebration state
  const [currentStreak] = useState(67); // Would come from real data
  const [showStreakBanner, setShowStreakBanner] = useState(false);
  const [triggerConfetti, setTriggerConfetti] = useState(false);

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

  const examDate = new Date('2026-10-05');
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((examDate.getTime() - today.getTime()) / 86400000));
  const overallPrep = 64;

  // Check for streak milestone on mount
  useEffect(() => {
    if (STREAK_MILESTONES.includes(currentStreak)) {
      setShowStreakBanner(true);
      setTriggerConfetti(true);
      const timer = setTimeout(() => setTriggerConfetti(false), 100);
      return () => clearTimeout(timer);
    }
  }, [currentStreak]);

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

  // Dynamic stat card values based on goals
  const dynamicStatCards = statCards.map(s => {
    if (s.key === 'tasks') {
      const done = goals.filter(g => g.done).length;
      return { ...s, value: `${done}/${goals.length}`, sub: `${goals.length - done} pending` };
    }
    return s;
  });

  return (
    <div className="h-screen overflow-y-auto bg-muted/30">
      {/* Confetti for streak milestones */}
      <ConfettiCelebration trigger={triggerConfetti} type="milestone" />

      <div className="p-3 sm:p-4 max-w-full space-y-4">

        {/* Streak Milestone Banner */}
        {showStreakBanner && (
          <StreakMilestoneBanner currentStreak={currentStreak} onClose={() => setShowStreakBanner(false)} />
        )}

        {/* Enhanced Target Examination Card — with top accent bar */}
        <Card className="overflow-hidden border border-border/80 shadow-sm rounded-2xl bg-card">
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/40" />
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row items-start gap-6">
              {/* Left: Info + Donuts */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">Target Examination</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-0.5">IBPS RRB-PO</h1>
                <p className="text-sm text-muted-foreground mb-3">Preliminary Examination • 9,985 Vacancies</p>
                
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-5">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> 5 Oct 2026
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" /> 45 min • 80 Marks
                  </span>
                </div>

                {/* Subject-wise Donut Charts */}
                <div className="flex items-center gap-3 sm:gap-5 mb-5">
                  <SubjectDonut percent={overallPrep} color="hsl(var(--primary))" name="Overall" size="lg" />
                  {sectionReadiness.map((sec) => (
                    <SubjectDonut key={sec.name} percent={sec.percent} color={sec.color} name={sec.name} size="md" />
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="default" className="text-xs h-9 gap-1.5 rounded-lg" asChild>
                    <Link to="/student/tests"><Play className="h-3.5 w-3.5" />Start Full Mock</Link>
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-9 gap-1.5 rounded-lg" asChild>
                    <Link to="/student/syllabus"><BookOpen className="h-3.5 w-3.5" />View Syllabus</Link>
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-9 gap-1.5 rounded-lg">
                    <TrendingUp className="h-3.5 w-3.5" />Score Prediction
                  </Button>
                </div>
              </div>

              {/* Right: Days Left Box */}
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-b from-primary to-primary/80 rounded-2xl p-5 sm:p-6 text-center min-w-[140px] sm:min-w-[160px] text-primary-foreground">
                  <div className="text-5xl sm:text-6xl font-black leading-none">{daysLeft}</div>
                  <div className="text-sm font-bold mt-2 uppercase tracking-wider">Days Left</div>
                  <div className="text-xs opacity-80 mt-1">to exam day</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 h-11 rounded-xl bg-card border border-border/60">
            <TabsTrigger value="overview" className="text-xs sm:text-sm font-medium rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none gap-1.5 border-b-2 border-transparent data-[state=active]:border-primary">
              <LayoutGrid className="h-3.5 w-3.5 hidden sm:block" />Overview
            </TabsTrigger>
            <TabsTrigger value="practice" className="text-xs sm:text-sm font-medium rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none gap-1.5 border-b-2 border-transparent data-[state=active]:border-primary">
              <BookOpen className="h-3.5 w-3.5 hidden sm:block" />Practice
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-xs sm:text-sm font-medium rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none gap-1.5 border-b-2 border-transparent data-[state=active]:border-primary">
              <TrendingUp className="h-3.5 w-3.5 hidden sm:block" />Performance
            </TabsTrigger>
            <TabsTrigger value="resources" className="text-xs sm:text-sm font-medium rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none gap-1.5 border-b-2 border-transparent data-[state=active]:border-primary">
              <BarChart3 className="h-3.5 w-3.5 hidden sm:block" />Resources
            </TabsTrigger>
          </TabsList>

          {/* =================== OVERVIEW TAB =================== */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* 5 Stat Cards — consistent primary-colored icons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {dynamicStatCards.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card 
                    key={stat.key}
                    className="p-3 sm:p-4 bg-card border border-border/60 shadow-sm hover:shadow-md transition-all cursor-pointer rounded-2xl"
                    onClick={() => stat.key !== 'tasks' && setStatDialogType(stat.key as any)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${stat.iconBg} flex items-center justify-center mb-2`}>
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-0.5">{stat.label}</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-0.5">{stat.sub}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0 mt-1" />
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
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-semibold text-base">Today's Goals</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="default" className="h-7 text-xs gap-1 rounded-lg" onClick={() => document.getElementById('goal-input')?.focus()}>
                      + Add Goal
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1 rounded-lg">
                      <Calendar className="h-3 w-3" />History
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 mb-3">
                  {goals.map((goal) => (
                    <div 
                      key={goal.id} 
                      className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${goal.done ? 'bg-primary/5' : 'bg-muted/30 hover:bg-muted/50'}`}
                      onClick={() => toggleGoal(goal.id)}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${goal.done ? 'bg-primary border-primary' : 'border-muted-foreground/40'}`}>
                        {goal.done && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <span className={`text-sm flex-1 ${goal.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{goal.text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    id="goal-input"
                    type="text"
                    className="flex-1 text-sm border border-border rounded-lg px-3 py-2 bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Timer className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">Study Timer</h3>
                      <p className="text-[10px] text-muted-foreground">Beginner · Max 180 min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-xs gap-1 h-6">
                      <Lock className="h-3 w-3" />Normal
                    </Badge>
                  </div>
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
                          className="text-xs rounded-lg"
                          onClick={() => { setTimerMinutes(mins); setTimerSeconds(mins * 60); }}
                        >
                          {mins >= 60 ? `${mins / 60}hr` : `${mins}m`}
                        </Button>
                      ))}
                    </div>
                    <Button className="w-full gap-2 rounded-lg" onClick={() => startTimer(timerMinutes)}>
                      <Play className="h-4 w-4" />Start Studying
                    </Button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 gap-1 rounded-lg" onClick={() => setTimerPaused(!timerPaused)}>
                      {timerPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      {timerPaused ? 'Resume' : 'Pause'}
                    </Button>
                    <Button variant="destructive" className="gap-1 rounded-lg" onClick={() => { setTimerActive(false); setTimerSeconds(timerMinutes * 60); }}>
                      <X className="h-4 w-4" />Stop
                    </Button>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-border/40">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Custom Duration — Max 180 min</span>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full gap-2 text-xs text-destructive hover:text-destructive rounded-lg" onClick={startStrictMode}>
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
                    <h3 className="font-semibold text-base text-primary">Your Current Exams Status</h3>
                    <p className="text-xs text-muted-foreground">Tracking <span className="text-primary font-semibold">{selfCareExams.length || 3}</span> active applications</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1 rounded-lg text-primary border-primary/30 hover:bg-primary/5" asChild>
                  <Link to="/student/self-care">View All <ArrowRight className="h-3.5 w-3.5" /></Link>
                </Button>
              </div>
              {selfCareExams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selfCareExams.slice(0, 3).map((exam) => {
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
                                  stage.status === 'cleared' ? 'bg-primary text-primary-foreground border-primary' :
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
                                <div className={`flex-1 h-0.5 mt-[-12px] ${stage.status === 'cleared' ? 'bg-primary' : 'bg-muted'}`} />
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
                  <Button variant="outline" size="sm" className="mt-2 rounded-lg" asChild>
                    <Link to="/student/self-care">Add Your First Exam</Link>
                  </Button>
                </div>
              )}
            </Card>

            {/* Upcoming Exams (from reference image) */}
            <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-base">Upcoming Exams</h3>
                </div>
                <Button variant="link" size="sm" className="gap-1 text-primary" asChild>
                  <Link to="/student/exam-notifications">View All <ArrowRight className="h-3.5 w-3.5" /></Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {upcomingExamsList.map((exam, idx) => (
                  <Link key={idx} to="/student/exam-notifications">
                    <Card className="p-4 text-center border-t-[3px] border-t-primary border border-border/50 rounded-xl hover:shadow-md transition-all cursor-pointer">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-3">
                        {exam.icon}
                      </div>
                      <p className="text-sm font-bold text-foreground mb-0.5">{exam.name}</p>
                      <p className="text-xs text-muted-foreground mb-2">{exam.tier}</p>
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mb-2">
                        <Calendar className="h-3 w-3" />{exam.date}
                      </p>
                      <Badge className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1">
                        • {exam.daysLeft} DAYS LEFT
                      </Badge>
                    </Card>
                  </Link>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* =================== PRACTICE TAB =================== */}
          <TabsContent value="practice" className="space-y-4 mt-4">
            {/* Daily Free Tests */}
            <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
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
                    <Button size="sm" className="h-8 gap-1 rounded-lg"><Play className="h-3 w-3" />Start</Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Upcoming Live Tests */}
            <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-destructive" />
                </div>
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
                    <Button size="sm" variant={test.isLive ? 'default' : 'outline'} className="h-8 gap-1 rounded-lg">
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
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-base">Speed Drills</h3>
                </div>
                <Button variant="link" size="sm" className="gap-1 text-primary" asChild>
                  <Link to="/student/speed-drills">View All <ArrowRight className="h-3.5 w-3.5" /></Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Simplification', 'Number Series', 'Syllogism', 'Reading Comp.'].map((drill, idx) => (
                  <Card key={idx} className="p-3 text-center border border-border/50 rounded-xl hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                      <Zap className="h-5 w-5 text-primary" />
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
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">Weekly Performance</h3>
                  <p className="text-xs text-muted-foreground">Average scores over 8 weeks</p>
                </div>
                <div className="ml-auto flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary" />Tests</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary/40" />Quizzes</span>
                </div>
              </div>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="testGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="quizGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} domain={[30, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '11px' }} />
                    <Area type="monotone" dataKey="tests" stroke="hsl(var(--primary))" fill="url(#testGradient)" strokeWidth={2} dot={{ r: 3, fill: 'hsl(var(--primary))' }} />
                    <Area type="monotone" dataKey="quizzes" stroke="hsl(var(--primary))" fill="url(#quizGradient)" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, fill: 'hsl(var(--primary))', strokeDasharray: '0' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Percentile + Study Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Study Status Donut */}
              <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-base">Test Status</h3>
                </div>
                <div className="relative w-40 h-40 mx-auto">
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
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-primary" />
                  </div>
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
                      <span className="flex items-center gap-1.5 text-primary font-medium"><TrendingUp className="h-3 w-3" />Strongest: Reasoning</span>
                      <span className="font-bold">85%</span>
                    </div>
                    <Progress value={85} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="flex items-center gap-1.5 text-muted-foreground font-medium"><TrendingUp className="h-3 w-3 rotate-180" />Weakest: Gen. Awareness</span>
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
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
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
                        <td className="text-center py-3 px-3"><span className="font-bold text-primary">{test.score}</span><span className="text-muted-foreground">/{test.total}</span></td>
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
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">↑ +7 marks improvement over last 3 tests</span>
                </div>
              </div>
            </Card>

            {/* Weekly Activity */}
            <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
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
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-primary" />
                  </div>
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

            {/* Notifications */}
            <Card className="p-4 sm:p-5 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
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
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
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
                <Button variant="outline" size="sm" className="gap-1 text-xs flex-shrink-0 rounded-lg">
                  <Bookmark className="h-3 w-3" />Save
                </Button>
              </div>
            </Card>

            {/* Current Affairs */}
            <Card className="p-4 bg-card border border-border/60 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Newspaper className="h-4 w-4 text-primary" />
                  </div>
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
              <div className="h-full rounded-full bg-gradient-to-r from-destructive to-primary transition-all duration-1000" style={{ width: `${strictProgress}%` }} />
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2 rounded-lg" onClick={() => setIsStrictPaused(!isStrictPaused)}>
                {isStrictPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {isStrictPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10 gap-2 rounded-lg" onClick={() => { setIsStrictModeActive(false); setStrictTimeLeft(25 * 60); }}>
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
