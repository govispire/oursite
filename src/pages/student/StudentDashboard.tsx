import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Target, 
  ChevronLeft, 
  ChevronRight, 
  Newspaper, 
  Bookmark, 
  LayoutGrid,
  Play,
  Clock,
  FileText
} from 'lucide-react';
import NewsArticleDialog from '@/components/student/NewsArticleDialog';
import StatCardDialog from '@/components/student/StatCardDialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [attendanceView, setAttendanceView] = useState<'week' | 'month'>('month');
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [newsDialogOpen, setNewsDialogOpen] = useState(false);
  const [statDialogType, setStatDialogType] = useState<'journey' | 'hours' | 'active' | 'tests' | null>(null);

  // Selected exams
  const selectedExams = ['IBPS PO', 'SBI Clerk', 'RRB NTPC'];

  // Current affairs data
  const currentAffairsData = [
    { 
      title: 'RBI Policy Updates', 
      description: 'Latest monetary policy decisions and their impact on banking...',
      category: 'Today', 
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
      content: 'The Reserve Bank of India kept the repo rate unchanged at 6.5% in its latest monetary policy review.'
    },
    { 
      title: 'Budget Highlights 2024', 
      description: 'Key announcements from the union budget affecting...',
      category: 'Yesterday', 
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400',
      content: 'The Union Budget 2024 introduced several key reforms affecting multiple sectors.'
    },
    { 
      title: 'New Government Schemes', 
      description: 'Important welfare programs launched this month for...',
      category: '2 days ago', 
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
      content: 'The government has launched new digital banking initiatives for rural areas.'
    }
  ];

  // Performance data for chart
  const performanceData = [
    { week: 'Week 1', tests: 45, quizzes: 52 },
    { week: 'Week 2', tests: 52, quizzes: 58 },
    { week: 'Week 3', tests: 48, quizzes: 62 },
    { week: 'Week 4', tests: 62, quizzes: 72 },
    { week: 'Week 5', tests: 68, quizzes: 78 },
    { week: 'Week 6', tests: 72, quizzes: 82 },
    { week: 'Week 7', tests: 78, quizzes: 85 },
    { week: 'Week 8', tests: 82, quizzes: 88 },
  ];

  // Free tests/quizzes data
  const freeTests = [
    { title: 'Quantitative Aptitude', questions: 25, duration: 30 },
    { title: 'Reasoning Ability', questions: 20, duration: 25 },
    { title: 'English Language', questions: 30, duration: 20 },
    { title: 'General Awareness', questions: 25, duration: 15 },
    { title: 'Computer Knowledge', questions: 20, duration: 15 },
  ];

  // Presence data for month view (4 weeks)
  const monthPresence = [
    [true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true],
    [true, true, true, false, true, true, true],
    [false, true, true, true, true, true, true],
  ];

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

  return (
    <div className="h-screen overflow-y-auto bg-muted/30">
      <div className="flex flex-col lg:flex-row gap-4 p-3 sm:p-4 max-w-full">
        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-4 w-full lg:w-auto">
          {/* Welcome Banner */}
          <Card className="bg-gradient-to-r from-primary to-primary/80 p-4 sm:p-5 text-primary-foreground border-0 shadow-lg rounded-xl overflow-hidden">
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
                    <span 
                      key={idx}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        idx === 0 
                          ? 'bg-primary-foreground text-primary' 
                          : 'bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30'
                      }`}
                    >
                      {idx === 0 && <span className="mr-1">☆</span>}
                      {exam}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Target Exam Circle */}
              <div className="bg-card rounded-xl p-4 text-center min-w-[120px]">
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                  <Target className="h-3 w-3 text-primary" />
                  Target
                </div>
                <div className="text-lg font-bold text-foreground">IBPS PO</div>
                <div className="text-2xl font-bold text-primary mt-1">78%</div>
                <span className="text-xs text-primary font-medium">Active</span>
              </div>
            </div>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card 
              className="p-4 bg-card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setStatDialogType('journey')}
            >
              <h3 className="text-xs font-medium text-muted-foreground mb-1">Total Journey Days</h3>
              <p className="text-2xl sm:text-3xl font-bold text-primary">347</p>
              <p className="text-xs text-muted-foreground mt-1">Preparation ongoing</p>
            </Card>
            <Card 
              className="p-4 bg-card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setStatDialogType('hours')}
            >
              <h3 className="text-xs font-medium text-muted-foreground mb-1">Total Study Hours</h3>
              <p className="text-2xl sm:text-3xl font-bold text-primary">195</p>
              <p className="text-xs text-muted-foreground mt-1">6+ hours today</p>
            </Card>
            <Card 
              className="p-4 bg-card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setStatDialogType('active')}
            >
              <h3 className="text-xs font-medium text-muted-foreground mb-1">Total Active Days</h3>
              <p className="text-2xl sm:text-3xl font-bold text-primary">67</p>
              <p className="text-xs text-muted-foreground mt-1">Continuously studying</p>
            </Card>
            <Card 
              className="p-4 bg-card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setStatDialogType('tests')}
            >
              <h3 className="text-xs font-medium text-muted-foreground mb-1">Total Mock Test</h3>
              <p className="text-2xl sm:text-3xl font-bold text-primary">40</p>
              <p className="text-xs text-muted-foreground mt-1">Last test 2 days ago</p>
            </Card>
          </div>

          {/* Performance Graph & Daily Vocabulary Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Performance Graph */}
            <Card className="p-4 bg-card lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 text-primary">📊</div>
                  <h3 className="font-semibold text-base">Performance Graph - Test/Quiz</h3>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span>Tests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-primary/50"></div>
                    <span>Quizzes</span>
                  </div>
                </div>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="week" 
                      tick={{ fontSize: 12 }} 
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }} 
                      stroke="hsl(var(--muted-foreground))"
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="tests" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="quizzes" 
                      stroke="hsl(var(--primary) / 0.5)" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary) / 0.5)', strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Daily Vocabulary Section */}
            <Card className="p-4 bg-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📚</span>
                  <h3 className="font-semibold text-base">Word of the Day</h3>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
              
              {(() => {
                const vocabularyBank = [
                  { word: 'Ephemeral', meaning: 'Lasting for a very short time', example: 'The ephemeral beauty of cherry blossoms.', type: 'Adjective', synonyms: ['Transient', 'Fleeting', 'Brief'] },
                  { word: 'Ubiquitous', meaning: 'Present, appearing, or found everywhere', example: 'Mobile phones have become ubiquitous.', type: 'Adjective', synonyms: ['Omnipresent', 'Pervasive', 'Universal'] },
                  { word: 'Pragmatic', meaning: 'Dealing with things sensibly and realistically', example: 'A pragmatic approach to solving problems.', type: 'Adjective', synonyms: ['Practical', 'Realistic', 'Sensible'] },
                  { word: 'Ameliorate', meaning: 'To make something better or improve', example: 'Steps to ameliorate the situation.', type: 'Verb', synonyms: ['Improve', 'Enhance', 'Better'] },
                  { word: 'Cogent', meaning: 'Clear, logical, and convincing', example: 'She presented a cogent argument.', type: 'Adjective', synonyms: ['Compelling', 'Persuasive', 'Convincing'] },
                  { word: 'Exacerbate', meaning: 'To make a problem or situation worse', example: 'The drought exacerbated food shortages.', type: 'Verb', synonyms: ['Worsen', 'Aggravate', 'Intensify'] },
                  { word: 'Benevolent', meaning: 'Well-meaning and kindly', example: 'A benevolent ruler cares for citizens.', type: 'Adjective', synonyms: ['Kind', 'Charitable', 'Generous'] },
                  { word: 'Inevitable', meaning: 'Certain to happen; unavoidable', example: 'Change is inevitable in life.', type: 'Adjective', synonyms: ['Unavoidable', 'Certain', 'Inescapable'] },
                  { word: 'Clandestine', meaning: 'Kept secret or done secretively', example: 'A clandestine meeting at midnight.', type: 'Adjective', synonyms: ['Secret', 'Covert', 'Hidden'] },
                  { word: 'Meticulous', meaning: 'Showing great attention to detail', example: 'Meticulous planning ensured success.', type: 'Adjective', synonyms: ['Careful', 'Precise', 'Thorough'] },
                  { word: 'Eloquent', meaning: 'Fluent or persuasive in speaking', example: 'An eloquent speech moved the audience.', type: 'Adjective', synonyms: ['Articulate', 'Expressive', 'Fluent'] },
                  { word: 'Resilient', meaning: 'Able to recover quickly from difficulties', example: 'Children are remarkably resilient.', type: 'Adjective', synonyms: ['Tough', 'Strong', 'Adaptable'] },
                  { word: 'Ambiguous', meaning: 'Open to more than one interpretation', example: 'The statement was deliberately ambiguous.', type: 'Adjective', synonyms: ['Vague', 'Unclear', 'Equivocal'] },
                  { word: 'Proliferate', meaning: 'Increase rapidly in number', example: 'Fake news proliferates on social media.', type: 'Verb', synonyms: ['Multiply', 'Spread', 'Expand'] },
                  { word: 'Tenacious', meaning: 'Holding firmly; persistent', example: 'A tenacious pursuit of excellence.', type: 'Adjective', synonyms: ['Persistent', 'Determined', 'Resolute'] },
                ];
                const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
                const todayVocab = vocabularyBank[dayOfYear % vocabularyBank.length];
                
                return (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <h4 className="text-2xl font-bold text-primary mb-1">{todayVocab.word}</h4>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{todayVocab.type}</span>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Meaning</p>
                      <p className="text-sm">{todayVocab.meaning}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Example</p>
                      <p className="text-sm italic text-muted-foreground">"{todayVocab.example}"</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Synonyms</p>
                      <div className="flex flex-wrap gap-1.5">
                        {todayVocab.synonyms.map((syn, idx) => (
                          <span key={idx} className="text-xs bg-muted px-2 py-1 rounded-full">
                            {syn}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      <Bookmark className="h-3 w-3 mr-2" />
                      Save to Vocabulary List
                    </Button>
                  </div>
                );
              })()}
            </Card>
          </div>

          {/* Current Affairs Section */}
          <Card className="p-4 bg-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Newspaper className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-base">Current Affairs</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <div className="w-10 h-5 bg-primary rounded-full relative mx-1">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-primary-foreground rounded-full"></div>
                </div>
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
                <div 
                  key={idx} 
                  className="group cursor-pointer"
                  onClick={() => handleNewsClick(item)}
                >
                  <div className="relative rounded-lg overflow-hidden mb-2">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-36 object-cover transition-transform group-hover:scale-105"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 bg-card/80 hover:bg-card"
                    >
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
            {/* Your Presence - Mobile */}
            <Card className="p-4 bg-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Your presence</h3>
                <div className="flex gap-1">
                  <Button 
                    variant={attendanceView === 'week' ? 'default' : 'outline'} 
                    size="sm" 
                    className="h-7 text-xs px-3"
                    onClick={() => setAttendanceView('week')}
                  >
                    Week
                  </Button>
                  <Button 
                    variant={attendanceView === 'month' ? 'default' : 'outline'} 
                    size="sm" 
                    className="h-7 text-xs px-3"
                    onClick={() => setAttendanceView('month')}
                  >
                    Month
                  </Button>
                </div>
              </div>
              
              {/* Presence Grid */}
              <div className="space-y-1 mb-4">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>
                {monthPresence.map((week, weekIdx) => (
                  <div key={weekIdx} className="grid grid-cols-7 gap-1">
                    {week.map((present, dayIdx) => (
                      <div
                        key={dayIdx}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          weekIdx === 3 && dayIdx === 0 
                            ? 'bg-amber-500 text-white' 
                            : present 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {weekIdx === 3 && dayIdx === 0 ? '○' : present ? '✓' : ''}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Mini Calendar */}
              <div className="border-t pt-3">
                <div className="flex items-center justify-between mb-2">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h4 className="font-semibold text-sm">September 2030</h4>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {[19, 20, 21, 22, 23, 24, 25].map((date, idx) => (
                    <div 
                      key={date} 
                      className={`py-2 rounded-lg text-sm cursor-pointer hover:bg-muted ${
                        idx === 0 ? 'bg-primary text-primary-foreground' : ''
                      }`}
                    >
                      {date}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Free Test/Quiz - Mobile */}
            <Card className="p-4 bg-card">
              <h3 className="font-semibold text-sm mb-3">Free Test/Quiz</h3>
              <div className="space-y-2">
                {freeTests.map((test, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{test.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{test.questions} Qs</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {test.duration} mins
                          </span>
                        </p>
                      </div>
                    </div>
                    <Button size="sm" className="h-8 gap-1">
                      <Play className="h-3 w-3" />
                      Start
                    </Button>
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
          {/* Your Presence */}
          <Card className="p-4 bg-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Your presence</h3>
              <div className="flex gap-1">
                <Button 
                  variant={attendanceView === 'week' ? 'default' : 'outline'} 
                  size="sm" 
                  className="h-7 text-xs px-3"
                  onClick={() => setAttendanceView('week')}
                >
                  Week
                </Button>
                <Button 
                  variant={attendanceView === 'month' ? 'default' : 'outline'} 
                  size="sm" 
                  className="h-7 text-xs px-3"
                  onClick={() => setAttendanceView('month')}
                >
                  Month
                </Button>
              </div>
            </div>
            
            {/* Presence Grid */}
            <div className="space-y-1 mb-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              {monthPresence.map((week, weekIdx) => (
                <div key={weekIdx} className="grid grid-cols-7 gap-1">
                  {week.map((present, dayIdx) => (
                    <div
                      key={dayIdx}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        weekIdx === 3 && dayIdx === 0 
                          ? 'bg-amber-500 text-white' 
                          : present 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {weekIdx === 3 && dayIdx === 0 ? '○' : present ? '✓' : ''}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Mini Calendar */}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h4 className="font-semibold text-sm">September 2030</h4>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {[19, 20, 21, 22, 23, 24, 25].map((date, idx) => (
                  <div 
                    key={date} 
                    className={`py-2 rounded-lg text-sm cursor-pointer hover:bg-muted ${
                      idx === 0 ? 'bg-primary text-primary-foreground' : ''
                    }`}
                  >
                    {date}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Free Test/Quiz */}
          <Card className="p-4 bg-card">
            <h3 className="font-semibold text-sm mb-3">Free Test/Quiz</h3>
            <div className="space-y-2">
              {freeTests.map((test, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{test.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>{test.questions} Qs</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {test.duration} mins
                        </span>
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="h-8 gap-1">
                    <Play className="h-3 w-3" />
                    Start
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-3" asChild>
              <Link to="/student/tests">View All Tests</Link>
            </Button>
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
