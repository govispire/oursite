import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CourseNavigation } from '@/components/student/courses/CourseNavigation';
import { MinimalistCourseCard, type SmartTag } from '@/components/student/courses/MinimalistCourseCard';
import { CategorySelector } from '@/components/global/CategorySelector';
import { CourseFiltersBar, DEFAULT_FILTERS, type CourseFilters } from '@/components/student/courses/CourseFiltersBar';
import { FreeTestCTA } from '@/components/student/courses/FreeTestCTA';
import { TrustValueStrip } from '@/components/student/courses/TrustValueStrip';
import { EnrolledCoursesRail } from '@/components/student/courses/EnrolledCoursesRail';
import { useCategoryFilteredCourses } from '@/hooks/useCategoryFilteredContent';
import {
  Search, BookOpen, Sparkles, GraduationCap, LayoutGrid, List, Target,
  Calendar, Brain, Newspaper, PenTool, Zap, Timer, ArrowRight,
  CheckCircle2, MapPin, Bell, Flame, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ---------- Static data ----------
const examCategories = {
  'banking-insurance': {
    name: 'Banking & Insurance',
    exams: [
      { id: 'sbi-po', name: 'SBI PO', courseCount: 15, mockTests: 45, students: '32K', isPopular: true },
      { id: 'ibps-po', name: 'IBPS PO', courseCount: 12, mockTests: 38, students: '25K', isPopular: true },
      { id: 'ibps-clerk', name: 'IBPS Clerk', courseCount: 8, mockTests: 30, students: '18K' },
      { id: 'sbi-clerk', name: 'SBI Clerk', courseCount: 10, mockTests: 35, students: '22K' },
      { id: 'rbi-grade-b', name: 'RBI Grade B', courseCount: 6, mockTests: 20, students: '8K' },
    ],
  },
  'ssc': {
    name: 'SSC',
    exams: [
      { id: 'ssc-cgl', name: 'SSC CGL', courseCount: 18, mockTests: 55, students: '45K', isPopular: true },
      { id: 'ssc-chsl', name: 'SSC CHSL', courseCount: 12, mockTests: 40, students: '28K' },
      { id: 'ssc-mts', name: 'SSC MTS', courseCount: 8, mockTests: 35, students: '35K' },
    ],
  },
  'railway': {
    name: 'Railway',
    exams: [
      { id: 'rrb-ntpc', name: 'RRB NTPC', courseCount: 14, mockTests: 50, students: '52K', isPopular: true },
      { id: 'rrb-group-d', name: 'RRB Group D', courseCount: 10, mockTests: 40, students: '65K' },
    ],
  },
  'upsc': {
    name: 'UPSC',
    exams: [
      { id: 'upsc-cse', name: 'UPSC CSE', courseCount: 25, mockTests: 60, students: '18K', isPopular: true },
    ],
  },
};

const roadmapSteps = [
  { step: 1, title: 'Learn Basics', desc: 'Build foundation', icon: BookOpen, done: true },
  { step: 2, title: 'Practice', desc: 'Topic-wise', icon: PenTool, done: true },
  { step: 3, title: 'Sectional Tests', desc: 'Subject mastery', icon: Target, done: false, active: true },
  { step: 4, title: 'Mock Tests', desc: 'Exam simulation', icon: Timer, done: false },
  { step: 5, title: 'Analyze', desc: 'Improve weak areas', icon: Brain, done: false },
];

const dailyPractice = [
  { id: 'quiz', title: "Today's Quiz", desc: '15 questions', icon: Zap, route: '/student/daily-quizzes' },
  { id: 'ca', title: 'Current Affairs', desc: 'Updated today', icon: Newspaper, route: '/student/current-affairs' },
  { id: 'vocab', title: 'Vocabulary', desc: '10 new words', icon: BookOpen, route: '/student/daily-quizzes' },
  { id: 'puzzle', title: 'Puzzle', desc: 'Reasoning challenge', icon: Brain, route: '/student/speed-drills' },
  { id: 'mini', title: 'Mini Mock', desc: '30 questions', icon: Timer, route: '/student/tests' },
];

// Stable hash for deterministic smart tags / urgency
const hashCode = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i) | 0;
  return Math.abs(h);
};

const SMART_TAGS: SmartTag[] = ['Bestseller', 'Beginner Friendly', 'High Scoring', 'Most Selected', 'Trending'];

const getSmartTag = (id: string, isTrending?: boolean): SmartTag | undefined => {
  if (isTrending) return 'Trending';
  const h = hashCode(id);
  if (h % 5 === 0) return SMART_TAGS[h % SMART_TAGS.length];
  return undefined;
};

const getUrgencyText = (id: string, hasDiscount: boolean): string | undefined => {
  const h = hashCode(id);
  if (hasDiscount && h % 3 === 0) {
    const hours = (h % 23) + 1;
    return `Offer ends in ${hours}h`;
  }
  if (h % 2 === 0) {
    const enrolled = 50 + (h % 200);
    return `${enrolled} enrolled this week`;
  }
  return undefined;
};

const REASONS = [
  "Because you're weak in Quant",
  'Based on your last test',
  'Most picked by SBI PO aspirants',
  'Matches your study goals',
  'Recommended by your mentor',
];

const StudentCourses = () => {
  const navigate = useNavigate();
  const { courses: globalFilteredCourses } = useCategoryFilteredCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<CourseFilters>(DEFAULT_FILTERS);

  const allExams = useMemo(
    () => Object.values(examCategories).flatMap(c => c.exams),
    []
  );
  const selectedExamInfo = useMemo(
    () => allExams.find(e => e.id === selectedExam),
    [allExams, selectedExam]
  );

  // ---------- Filter pipeline ----------
  const filteredCourses = useMemo(() => {
    let courses = [...globalFilteredCourses];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      courses = courses.filter(
        c => c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q)
      );
    }

    if (filters.price !== 'all') {
      courses = courses.filter(c => {
        if (filters.price === 'free') return c.price === 0;
        if (filters.price === 'under999') return c.price > 0 && c.price < 999;
        if (filters.price === '1k-3k') return c.price >= 999 && c.price <= 3000;
        if (filters.price === '3kplus') return c.price > 3000;
        return true;
      });
    }

    if (filters.duration !== 'all') {
      courses = courses.filter(c => {
        const months = parseInt(c.duration) || 1;
        if (filters.duration === 'short') return months < 1;
        if (filters.duration === 'medium') return months >= 1 && months <= 3;
        if (filters.duration === 'long') return months > 3 && months <= 6;
        if (filters.duration === 'xlong') return months > 6;
        return true;
      });
    }

    // Sort
    if (filters.sort === 'price-asc') courses.sort((a, b) => a.price - b.price);
    else if (filters.sort === 'price-desc') courses.sort((a, b) => b.price - a.price);
    else if (filters.sort === 'rating') courses.sort((a, b) => b.rating - a.rating);
    else if (filters.sort === 'newest') courses.reverse();
    // 'popular' = default order

    return courses;
  }, [globalFilteredCourses, searchQuery, filters]);

  const enrolledCourses = useMemo(
    () => globalFilteredCourses.filter(c => c.progress && c.progress > 0).slice(0, 6),
    [globalFilteredCourses]
  );

  const recommendedCourses = useMemo(
    () => globalFilteredCourses.filter(c => c.isTrending).slice(0, 6),
    [globalFilteredCourses]
  );

  return (
    <div className="space-y-6 p-3 sm:p-4 pb-8 max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <CourseNavigation
        items={[{ label: 'Dashboard', href: '/student/dashboard' }, { label: 'Courses', isActive: true }]}
      />

      {/* 1. DISCOVERY HEADER */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Explore Courses</h1>
              <p className="text-xs text-muted-foreground">Find your perfect prep path</p>
            </div>
            <Badge className="bg-orange-100 text-orange-700 border-0 hover:bg-orange-100 gap-1">
              <Flame className="h-3 w-3" />
              12-day streak
            </Badge>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses, mock tests, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-card border-border text-sm"
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CategorySelector />
      </div>

      {/* Compact prep strip */}
      <Card className="border border-border bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground">
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs opacity-80">Your Target</p>
              <p className="font-semibold truncate">
                {selectedExamInfo?.name || 'Choose an exam below'} 2025 · 40% prepared
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center px-3 py-1.5 bg-primary/15 rounded-lg">
              <div className="text-lg font-black text-primary leading-tight">120</div>
              <div className="text-[9px] opacity-80">days left</div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate('/student/syllabus')}
            >
              Resume <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. EXAM FILTER PILL BAR */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <GraduationCap className="h-4 w-4 text-primary" />
            Pick your exam
          </h2>
        </div>
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            <button
              onClick={() => setSelectedExam('all')}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap border transition-all',
                selectedExam === 'all'
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-card text-foreground border-border hover:border-primary/40'
              )}
            >
              All Exams
            </button>
            {allExams.map(exam => (
              <button
                key={exam.id}
                onClick={() => setSelectedExam(exam.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap border transition-all relative',
                  selectedExam === exam.id
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card text-foreground border-border hover:border-primary/40'
                )}
              >
                {exam.name}
                {exam.isPopular && selectedExam !== exam.id && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* 3. ADVANCED FILTERS */}
      <Card className="p-3 border border-border">
        <CourseFiltersBar
          filters={filters}
          onChange={setFilters}
          resultCount={filteredCourses.length}
        />
      </Card>

      {/* 4. MY ENROLLED COURSES (retention) */}
      <EnrolledCoursesRail courses={enrolledCourses} />

      {/* 5. FREE TEST CTA */}
      <FreeTestCTA />

      {/* 6. RECOMMENDED FOR YOU */}
      {recommendedCourses.length > 0 && (
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
            Personalized picks based on your goals & performance
          </p>
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-4">
              {recommendedCourses.map((course, i) => (
                <div key={course.id} className="w-[280px] flex-shrink-0">
                  <MinimalistCourseCard
                    course={course}
                    smartTag={getSmartTag(course.id, course.isTrending)}
                    urgencyText={getUrgencyText(course.id, !!course.originalPrice)}
                    reason={REASONS[i % REASONS.length]}
                  />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>
      )}

      {/* 7. ALL COURSES GRID */}
      <section>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <BookOpen className="h-5 w-5 text-primary" />
            All Courses
          </h2>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <Card className="p-12 text-center border border-border">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2 text-foreground">No courses found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCourses.map(course => (
              <MinimalistCourseCard
                key={course.id}
                course={course}
                smartTag={getSmartTag(course.id, course.isTrending)}
                urgencyText={getUrgencyText(course.id, !!course.originalPrice)}
              />
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

      {/* Daily Practice Zone */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <Zap className="h-5 w-5 text-primary" />
            Daily Practice Zone
          </h2>
          <Badge className="bg-primary/10 text-primary border-0 text-xs hover:bg-primary/10">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mr-1.5 animate-pulse" />
            Updated Today
          </Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {dailyPractice.map(item => (
            <Card
              key={item.id}
              className="p-4 cursor-pointer hover:shadow-md transition-all hover:border-primary/30 border border-border group"
              onClick={() => navigate(item.route)}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2.5">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 8. PREP ROADMAP (compact) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <MapPin className="h-5 w-5 text-primary" />
            Preparation Roadmap
          </h2>
          <span className="text-xs text-muted-foreground">
            for {selectedExamInfo?.name || 'your exam'}
          </span>
        </div>
        <Card className="p-5 border border-border">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
            {roadmapSteps.map((s, i) => (
              <div key={s.step} className="flex-1 flex items-center gap-3 sm:flex-col sm:text-center relative">
                {i < roadmapSteps.length - 1 && (
                  <div className="hidden sm:block absolute top-5 left-[55%] w-full h-0.5 bg-border z-0">
                    <div className={cn('h-full bg-primary transition-all', s.done ? 'w-full' : 'w-0')} />
                  </div>
                )}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all',
                    s.done
                      ? 'bg-primary text-primary-foreground'
                      : s.active
                      ? 'bg-primary/20 text-primary ring-2 ring-primary ring-offset-2'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {s.done ? <CheckCircle2 className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
                </div>
                <div className="sm:mt-2">
                  <p
                    className={cn(
                      'text-sm font-semibold',
                      s.done ? 'text-primary' : s.active ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {s.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Exam countdown */}
      <Card className="p-5 border border-border bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Calendar className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">
                {selectedExamInfo?.name || 'SBI PO'} Prelims 2025
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Notification: July 2025 · Exam: November 2025
              </p>
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

      {/* 9. TRUST + VALUE STRIP */}
      <TrustValueStrip />
    </div>
  );
};

export default StudentCourses;
