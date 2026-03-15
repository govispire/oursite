import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Target, ChevronLeft, ChevronRight, Newspaper, Bookmark, LayoutGrid,
  Play, Clock, FileText, TrendingUp, Users, Award, Calendar, BarChart3
} from 'lucide-react';
import NewsArticleDialog from '@/components/student/NewsArticleDialog';
import StatCardDialog from '@/components/student/StatCardDialog';
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

const StudentDashboard = () => {
  const { user } = useAuth();
  const [attendanceView, setAttendanceView] = useState<'week' | 'month'>('month');
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [newsDialogOpen, setNewsDialogOpen] = useState(false);
  const [statDialogType, setStatDialogType] = useState<'journey' | 'hours' | 'active' | 'tests' | null>(null);

  const selectedExams = ['IBPS PO', 'SBI Clerk', 'RRB NTPC'];

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

  return (
    <div className="h-screen overflow-y-auto bg-muted/30">
      <div className="flex flex-col lg:flex-row gap-4 p-3 sm:p-4 max-w-full">
        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-4 w-full lg:w-auto">
          {/* Welcome Banner */}
          <Card className="bg-gradient-to-r from-primary to-primary/80 p-4 sm:p-5 text-primary-foreground border-0 shadow-lg rounded-2xl overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-lg sm:text-xl font-bold mb-1 flex items-center gap-2">
                  <span className="text-2xl">👋</span> Welcome, {user?.name || 'Student User'}
                </h1>
                <p className="text-sm text-primary-foreground/80 mb-3">
                  Track your preparation progress and upcoming exams.
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedExams.map((exam, idx) => (
                    <span key={idx} className={`px-3 py-1.5 rounded-full text-xs font-medium ${idx === 0 ? 'bg-primary-foreground text-primary' : 'bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30'}`}>
                      {idx === 0 && <span className="mr-1">☆</span>}{exam}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-xl p-4 text-center min-w-[120px]">
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                  <Target className="h-3 w-3 text-primary" />Target
                </div>
                <div className="text-lg font-bold text-foreground">IBPS PO</div>
                <div className="text-2xl font-bold text-primary mt-1">78%</div>
                <span className="text-xs text-primary font-medium">Active</span>
              </div>
            </div>
          </Card>

          {/* Pastel Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card 
                  key={stat.key}
                  className={`p-4 ${stat.bg} border-none shadow-sm hover:shadow-md transition-all cursor-pointer rounded-2xl`}
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

          {/* Performance Graph + Study Status Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Performance Graph */}
            <Card className="p-4 bg-card lg:col-span-2 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h3 className="font-semibold text-base">Goal Completion</h3>
                <div className="ml-auto flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-primary" />Tests</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-primary/40" />Quizzes</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="testGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="quizGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="tests" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#testGrad)" dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }} />
                    <Area type="monotone" dataKey="quizzes" stroke="hsl(var(--primary) / 0.4)" strokeWidth={2} fill="url(#quizGrad)" dot={{ fill: 'hsl(var(--primary) / 0.4)', strokeWidth: 2, r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Study Status Donut */}
            <Card className="p-4 bg-card rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h3 className="font-semibold text-base">Study Status</h3>
              </div>
              <div className="h-48 relative">
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

          {/* Bottom Row: Top Performers + Weekly Activity + Vocabulary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Top Performers */}
            <Card className="p-4 bg-card rounded-2xl">
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

            {/* Weekly Activity */}
            <Card className="p-4 bg-card rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h3 className="font-semibold text-base">Weekly Activity</h3>
                <span className="ml-auto text-xs text-muted-foreground">This Week</span>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                    <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Avg: <strong className="text-foreground">5.3h</strong>/day</span>
                <span>Total: <strong className="text-foreground">37.4h</strong></span>
              </div>
            </Card>

            {/* Daily Vocabulary */}
            <Card className="p-4 bg-card rounded-2xl">
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
          </div>

          {/* Current Affairs Section */}
          <Card className="p-4 bg-card rounded-2xl">
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
            <Card className="p-4 bg-card rounded-2xl">
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

            <Card className="p-4 bg-card rounded-2xl">
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
          <Card className="p-4 bg-card rounded-2xl">
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

          <Card className="p-4 bg-card rounded-2xl">
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

      <NewsArticleDialog article={selectedNews} open={newsDialogOpen} onOpenChange={setNewsDialogOpen} />
      {statDialogType && (
        <StatCardDialog type={statDialogType} open={!!statDialogType} onOpenChange={(open) => !open && setStatDialogType(null)} />
      )}
    </div>
  );
};

export default StudentDashboard;
