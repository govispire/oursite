import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CourseNavigation } from '@/components/student/courses/CourseNavigation';
import { MinimalistCourseCard } from '@/components/student/courses/MinimalistCourseCard';
import { CategorySelector } from '@/components/global/CategorySelector';
import { useCategoryFilteredCourses } from '@/hooks/useCategoryFilteredContent';
import { useExamCategoryContext } from '@/contexts/ExamCategoryContext';
import { 
  Search, BookOpen, TrendingUp, Clock, Star, Users, Play, ChevronRight,
  Sparkles, GraduationCap, LayoutGrid, List, Target, Trophy, Zap, 
  Calendar, Brain, FileText, ArrowRight, Timer, Newspaper, PenTool,
  CheckCircle2, Circle, MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Exam categories data
const examCategories = {
  'banking-insurance': {
    name: 'Banking & Insurance',
    icon: '🏦',
    exams: [
      { id: 'sbi-po', name: 'SBI PO', courseCount: 15, mockTests: 45, students: '32K', isPopular: true },
      { id: 'ibps-po', name: 'IBPS PO', courseCount: 12, mockTests: 38, students: '25K', isPopular: true },
      { id: 'ibps-clerk', name: 'IBPS Clerk', courseCount: 8, mockTests: 30, students: '18K' },
      { id: 'sbi-clerk', name: 'SBI Clerk', courseCount: 10, mockTests: 35, students: '22K' },
      { id: 'rbi-grade-b', name: 'RBI Grade B', courseCount: 6, mockTests: 20, students: '8K' },
      { id: 'lic-aao', name: 'LIC AAO', courseCount: 5, mockTests: 15, students: '6K' },
      { id: 'ibps-rrb', name: 'IBPS RRB', courseCount: 8, mockTests: 25, students: '20K' },
      { id: 'all-banking', name: 'All Banking', courseCount: 40, mockTests: 100, students: '80K' },
    ]
  },
  'ssc': {
    name: 'SSC',
    icon: '📝',
    exams: [
      { id: 'ssc-cgl', name: 'SSC CGL', courseCount: 18, mockTests: 55, students: '45K', isPopular: true },
      { id: 'ssc-chsl', name: 'SSC CHSL', courseCount: 12, mockTests: 40, students: '28K' },
      { id: 'ssc-mts', name: 'SSC MTS', courseCount: 8, mockTests: 35, students: '35K', isPopular: true },
      { id: 'ssc-gd', name: 'SSC GD', courseCount: 6, mockTests: 30, students: '42K' },
    ]
  },
  'railway': {
    name: 'Railway',
    icon: '🚂',
    exams: [
      { id: 'rrb-ntpc', name: 'RRB NTPC', courseCount: 14, mockTests: 50, students: '52K', isPopular: true },
      { id: 'rrb-group-d', name: 'RRB Group D', courseCount: 10, mockTests: 40, students: '65K', isPopular: true },
      { id: 'rrb-alp', name: 'RRB ALP', courseCount: 8, mockTests: 25, students: '18K' },
    ]
  },
  'upsc': {
    name: 'UPSC',
    icon: '🏛️',
    exams: [
      { id: 'upsc-cse', name: 'UPSC CSE', courseCount: 25, mockTests: 60, students: '18K', isPopular: true },
      { id: 'upsc-cds', name: 'UPSC CDS', courseCount: 6, mockTests: 20, students: '12K' },
      { id: 'upsc-nda', name: 'UPSC NDA', courseCount: 5, mockTests: 18, students: '15K' },
    ]
  },
  'defence': {
    name: 'Defence',
    icon: '🎖️',
    exams: [
      { id: 'nda', name: 'NDA', courseCount: 10, mockTests: 30, students: '22K', isPopular: true },
      { id: 'cds', name: 'CDS', courseCount: 8, mockTests: 25, students: '15K' },
      { id: 'afcat', name: 'AFCAT', courseCount: 5, mockTests: 18, students: '8K' },
    ]
  }
};

// Preparation roadmap steps
const roadmapSteps = [
  { step: 1, title: 'Learn Basics', desc: 'Build strong foundation', icon: BookOpen, done: true },
  { step: 2, title: 'Practice Questions', desc: 'Topic-wise practice', icon: PenTool, done: true },
  { step: 3, title: 'Sectional Tests', desc: 'Subject mastery', icon: Target, done: false, active: true },
  { step: 4, title: 'Full Mock Tests', desc: 'Exam simulation', icon: FileText, done: false },
  { step: 5, title: 'Analyze & Improve', desc: 'Performance review', icon: TrendingUp, done: false },
];

// Daily practice items
const dailyPractice = [
  { id: 'quiz', title: "Today's Quiz", desc: '15 questions · 10 min', icon: Zap, color: 'text-primary', bg: 'bg-primary/10', route: '/student/daily-quizzes' },
  { id: 'ca', title: 'Daily Current Affairs', desc: 'Updated today', icon: Newspaper, color: 'text-primary', bg: 'bg-primary/10', route: '/student/current-affairs' },
  { id: 'vocab', title: 'Vocabulary Builder', desc: '10 new words', icon: BookOpen, color: 'text-primary', bg: 'bg-primary/10', route: '/student/daily-quizzes' },
  { id: 'puzzle', title: 'Puzzle of the Day', desc: 'Reasoning challenge', icon: Brain, color: 'text-primary', bg: 'bg-primary/10', route: '/student/speed-drills' },
  { id: 'mini', title: 'Mini Mock Test', desc: '30 questions · 20 min', icon: Timer, color: 'text-primary', bg: 'bg-primary/10', route: '/student/tests' },
];

// Category mapping
const categoryMapping: Record<string, string> = {
  'banking-insurance': 'banking-insurance',
  'banking': 'banking-insurance',
  'ssc': 'ssc',
  'railways-rrb': 'railway',
  'railway': 'railway',
  'civil-services': 'upsc',
  'upsc': 'upsc',
  'defence': 'defence',
};

const StudentCourses = () => {
  const { courses: globalFilteredCourses, hasFilters, selectedCategories } = useCategoryFilteredCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState<string | null>('sbi-po');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeStage, setActiveStage] = useState('prelims');

  // Map categories
  const mappedCategories = useMemo(() => {
    const mapped = new Set<string>();
    selectedCategories.forEach(cat => {
      const m = categoryMapping[cat];
      if (m) mapped.add(m);
    });
    return Array.from(mapped);
  }, [selectedCategories]);

  // Available exams
  const availableExams = useMemo(() => {
    if (mappedCategories.length === 0) {
      return Object.values(examCategories).flatMap(c => c.exams);
    }
    return mappedCategories.flatMap(catId => {
      const cat = examCategories[catId as keyof typeof examCategories];
      return cat ? cat.exams : [];
    });
  }, [mappedCategories]);

  // Selected exam info
  const selectedExamInfo = useMemo(() => {
    return availableExams.find(e => e.id === selectedExam);
  }, [availableExams, selectedExam]);

  // Filter courses
  const filteredCourses = useMemo(() => {
    let courses = globalFilteredCourses;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      courses = courses.filter(c => c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q));
    }
    return courses;
  }, [globalFilteredCourses, searchQuery]);

  // Stage-filtered courses (simulated)
  const stageCourses = useMemo(() => {
    const all = filteredCourses;
    if (activeStage === 'prelims') return all.slice(0, 4);
    if (activeStage === 'mains') return all.slice(2, 6);
    if (activeStage === 'interview') return all.slice(4, 7);
    return all;
  }, [filteredCourses, activeStage]);

  const trendingCourses = useMemo(() => filteredCourses.filter(c => c.isTrending).slice(0, 4), [filteredCourses]);
  const continueLearning = useMemo(() => filteredCourses.filter(c => c.progress && c.progress > 0).slice(0, 3), [filteredCourses]);

  return (
    <div className="space-y-6 p-3 sm:p-4 pb-8">
      {/* Breadcrumb */}
      <CourseNavigation items={[{ label: 'Dashboard', href: '/student/dashboard' }, { label: 'Courses', isActive: true }]} />

      {/* Section 1: Smart Preparation Banner */}
      <Card className="bg-gradient-to-br from-[hsl(215,50%,15%)] via-[hsl(210,45%,22%)] to-[hsl(200,60%,30%)] text-white border-0 overflow-hidden relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>
        <CardContent className="p-5 sm:p-6 relative">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-white/15 text-white border-0 text-xs">
                  <Target className="h-3 w-3 mr-1" />
                  Your Preparation Journey
                </Badge>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">
                Prepare for {selectedExamInfo?.name || 'SBI PO'} 2025
              </h1>
              <p className="text-white/70 text-sm mt-1">Prelims Exam Expected: November 2025</p>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-white/80">Prelims Preparation</span>
                  <span className="font-bold">40%</span>
                </div>
                <div className="w-full bg-white/15 rounded-full h-2.5">
                  <div className="bg-[hsl(var(--primary))] h-2.5 rounded-full transition-all" style={{ width: '40%' }} />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-white/60 mb-2">Next Recommended:</p>
                <div className="flex flex-wrap gap-2">
                  {['Quant Mock Test', 'Reasoning Practice', 'Current Affairs'].map(item => (
                    <Badge key={item} className="bg-white/10 text-white border-white/20 text-xs cursor-pointer hover:bg-white/20 transition-colors">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-row lg:flex-col items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[90px]">
                <div className="text-3xl font-black">120</div>
                <div className="text-[10px] text-white/70 font-medium">Days Left</div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold">{selectedExamInfo?.courseCount || 15}</div>
                  <div className="text-[10px] text-white/60">Courses</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{selectedExamInfo?.mockTests || 45}</div>
                  <div className="text-[10px] text-white/60">Mocks</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{selectedExamInfo?.students || '32K'}</div>
                  <div className="text-[10px] text-white/60">Students</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses, mock tests, topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11 border-border bg-card text-sm"
        />
      </div>

      {/* Section 2: Choose Your Target Exam */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <GraduationCap className="h-5 w-5 text-primary" />
            Choose Your Target Exam
          </h2>
          <CategorySelector />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
          {availableExams.slice(0, 8).map(exam => (
            <Card
              key={exam.id}
              onClick={() => setSelectedExam(exam.id)}
              className={cn(
                "relative p-3 cursor-pointer transition-all duration-200 hover:shadow-md border-2 text-center",
                selectedExam === exam.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-transparent hover:border-primary/30"
              )}
            >
              {exam.isPopular && (
                <Badge className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[8px] px-1 py-0">
                  Popular
                </Badge>
              )}
              <h3 className="font-semibold text-sm text-foreground">{exam.name}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">{exam.courseCount} Courses</p>
              <p className="text-[10px] text-muted-foreground">{exam.mockTests} Mock Tests</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Section 3: Exam Stage Tabs */}
      {selectedExam && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">
              {selectedExamInfo?.name || 'SBI PO'} Preparation
            </h2>
            <Badge variant="outline" className="text-xs">
              {stageCourses.length} courses
            </Badge>
          </div>
          
          <Tabs value={activeStage} onValueChange={setActiveStage} className="w-full">
            <TabsList className="bg-muted/50 p-1 h-auto mb-4 w-full sm:w-auto">
              <TabsTrigger value="prelims" className="text-xs px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Prelims
              </TabsTrigger>
              <TabsTrigger value="mains" className="text-xs px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Mains
              </TabsTrigger>
              <TabsTrigger value="interview" className="text-xs px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Interview
              </TabsTrigger>
              <TabsTrigger value="full" className="text-xs px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Full Course
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeStage} className="mt-0">
              {stageCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {stageCourses.map(course => (
                    <MinimalistCourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <Card className="p-10 text-center border border-border">
                  <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">No courses found for this stage</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </section>
      )}

      {/* Section 4: Recommended For You */}
      {trendingCourses.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <Sparkles className="h-5 w-5 text-primary" />
              Recommended For You
            </h2>
            <Button variant="ghost" size="sm" className="text-xs text-primary">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Because you selected {selectedExamInfo?.name || 'SBI PO'}
          </p>
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-4">
              {trendingCourses.map(course => (
                <div key={course.id} className="w-[280px] flex-shrink-0">
                  <MinimalistCourseCard course={course} />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>
      )}

      {/* Section 5: Daily Practice Zone */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <Zap className="h-5 w-5 text-primary" />
            Daily Practice Zone
          </h2>
          <Badge className="bg-primary/10 text-primary border-0 text-xs">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mr-1.5 animate-pulse" />
            Updated Today
          </Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {dailyPractice.map(item => (
            <Card
              key={item.id}
              className="p-4 cursor-pointer hover:shadow-md transition-all hover:border-primary/30 border border-border group"
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-2.5", item.bg)}>
                <item.icon className={cn("h-5 w-5", item.color)} />
              </div>
              <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Continue Learning */}
      {continueLearning.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <Play className="h-5 w-5 text-primary" />
              Continue Learning
            </h2>
            <Button variant="ghost" size="sm" className="text-xs text-primary">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {continueLearning.map(course => (
              <MinimalistCourseCard key={course.id} course={course} variant="compact" />
            ))}
          </div>
        </section>
      )}

      {/* Section 6: Preparation Roadmap */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <MapPin className="h-5 w-5 text-primary" />
            Preparation Roadmap
          </h2>
          <span className="text-xs text-muted-foreground">for {selectedExamInfo?.name || 'SBI PO'}</span>
        </div>
        <Card className="p-5 border border-border">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
            {roadmapSteps.map((s, i) => (
              <div key={s.step} className="flex-1 flex items-center gap-3 sm:flex-col sm:text-center relative">
                {/* Connector line (desktop) */}
                {i < roadmapSteps.length - 1 && (
                  <div className="hidden sm:block absolute top-5 left-[55%] w-full h-0.5 bg-border z-0">
                    <div className={cn("h-full bg-primary transition-all", s.done ? 'w-full' : 'w-0')} />
                  </div>
                )}
                
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all",
                  s.done ? 'bg-primary text-primary-foreground' :
                  s.active ? 'bg-primary/20 text-primary ring-2 ring-primary ring-offset-2' :
                  'bg-muted text-muted-foreground'
                )}>
                  {s.done ? <CheckCircle2 className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
                </div>
                <div className="sm:mt-2">
                  <p className={cn(
                    "text-sm font-semibold",
                    s.done ? 'text-primary' : s.active ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {s.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Section 7: Exam Countdown */}
      <Card className="p-5 border border-border bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Calendar className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">{selectedExamInfo?.name || 'SBI PO'} Prelims 2025</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Expected Notification: July 2025 · Exam: November 2025</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-black text-primary">120</div>
              <div className="text-[10px] text-muted-foreground font-medium">Days Remaining</div>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start Preparing <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>

      {/* All Courses with Search & Filter */}
      <section>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <BookOpen className="h-5 w-5 text-primary" />
            All Courses
          </h2>
          <div className="flex gap-2">
            <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" className="h-8 w-8" onClick={() => setViewMode('grid')}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" className="h-8 w-8" onClick={() => setViewMode('list')}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-3">Showing {filteredCourses.length} courses</p>

        {filteredCourses.length === 0 ? (
          <Card className="p-12 text-center border border-border">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2 text-foreground">No courses found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCourses.map(course => (
              <MinimalistCourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCourses.map(course => (
              <MinimalistCourseCard key={course.id} course={course} variant="compact" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentCourses;
