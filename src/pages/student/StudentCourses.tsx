import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CourseNavigation } from '@/components/student/courses/CourseNavigation';
import { MinimalistCourseCard } from '@/components/student/courses/MinimalistCourseCard';
import { WelcomeCourseBanner } from '@/components/student/courses/WelcomeCourseBanner';
import { CategoryExamGrid, CategoryHeader } from '@/components/student/courses/CategoryExamGrid';
import { InstructorCard } from '@/components/student/courses/InstructorCard';
import { CategorySelector } from '@/components/global/CategorySelector';
import { useCategoryFilteredCourses } from '@/hooks/useCategoryFilteredContent';
import { useExamCategoryContext } from '@/contexts/ExamCategoryContext';
import { instructors } from '@/data/courseData';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  BookOpen, 
  TrendingUp,
  Clock,
  Star,
  Users,
  Play,
  ChevronRight,
  Sparkles,
  GraduationCap,
  LayoutGrid,
  List
} from 'lucide-react';

// Category configuration with exam details
const examCategories = {
  'banking-insurance': {
    name: 'Banking & Insurance',
    icon: '🏦',
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    exams: [
      { id: 'ibps-po', name: 'IBPS PO', shortName: 'IBPS PO', courseCount: 12, studentCount: 25000, isPopular: true },
      { id: 'ibps-clerk', name: 'IBPS Clerk', shortName: 'IBPS Clerk', courseCount: 8, studentCount: 18000 },
      { id: 'sbi-po', name: 'SBI PO', shortName: 'SBI PO', courseCount: 15, studentCount: 32000, isPopular: true },
      { id: 'sbi-clerk', name: 'SBI Clerk', shortName: 'SBI Clerk', courseCount: 10, studentCount: 22000 },
      { id: 'rbi-grade-b', name: 'RBI Grade B', shortName: 'RBI Grade B', courseCount: 6, studentCount: 8000 },
      { id: 'lic-aao', name: 'LIC AAO', shortName: 'LIC AAO', courseCount: 5, studentCount: 6000 },
    ]
  },
  'ssc': {
    name: 'SSC',
    icon: '📝',
    color: 'bg-gradient-to-br from-green-500 to-green-600',
    exams: [
      { id: 'ssc-cgl', name: 'SSC CGL', shortName: 'SSC CGL', courseCount: 18, studentCount: 45000, isPopular: true },
      { id: 'ssc-chsl', name: 'SSC CHSL', shortName: 'SSC CHSL', courseCount: 12, studentCount: 28000 },
      { id: 'ssc-mts', name: 'SSC MTS', shortName: 'SSC MTS', courseCount: 8, studentCount: 35000, isPopular: true },
      { id: 'ssc-gd', name: 'SSC GD', shortName: 'SSC GD', courseCount: 6, studentCount: 42000 },
      { id: 'ssc-cpo', name: 'SSC CPO', shortName: 'SSC CPO', courseCount: 5, studentCount: 12000 },
    ]
  },
  'railway': {
    name: 'Railway',
    icon: '🚂',
    color: 'bg-gradient-to-br from-orange-500 to-orange-600',
    exams: [
      { id: 'rrb-ntpc', name: 'RRB NTPC', shortName: 'RRB NTPC', courseCount: 14, studentCount: 52000, isPopular: true },
      { id: 'rrb-group-d', name: 'RRB Group D', shortName: 'Group D', courseCount: 10, studentCount: 65000, isPopular: true },
      { id: 'rrb-alp', name: 'RRB ALP', shortName: 'RRB ALP', courseCount: 8, studentCount: 18000 },
      { id: 'rrb-je', name: 'RRB JE', shortName: 'RRB JE', courseCount: 6, studentCount: 15000 },
    ]
  },
  'upsc': {
    name: 'UPSC',
    icon: '🏛️',
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    exams: [
      { id: 'upsc-cse', name: 'UPSC CSE', shortName: 'IAS/IPS', courseCount: 25, studentCount: 18000, isPopular: true },
      { id: 'upsc-ese', name: 'UPSC ESE', shortName: 'ESE', courseCount: 8, studentCount: 5000 },
      { id: 'upsc-cds', name: 'UPSC CDS', shortName: 'CDS', courseCount: 6, studentCount: 12000 },
      { id: 'upsc-nda', name: 'UPSC NDA', shortName: 'NDA', courseCount: 5, studentCount: 15000 },
    ]
  },
  'cat': {
    name: 'CAT/MBA',
    icon: '🎓',
    color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    exams: [
      { id: 'cat', name: 'CAT', shortName: 'CAT', courseCount: 20, studentCount: 28000, isPopular: true },
      { id: 'xat', name: 'XAT', shortName: 'XAT', courseCount: 8, studentCount: 8000 },
      { id: 'snap', name: 'SNAP', shortName: 'SNAP', courseCount: 6, studentCount: 6000 },
      { id: 'mat', name: 'MAT', shortName: 'MAT', courseCount: 5, studentCount: 10000 },
    ]
  },
  'defence': {
    name: 'Defence',
    icon: '🎖️',
    color: 'bg-gradient-to-br from-red-500 to-red-600',
    exams: [
      { id: 'nda', name: 'NDA', shortName: 'NDA', courseCount: 10, studentCount: 22000, isPopular: true },
      { id: 'cds', name: 'CDS', shortName: 'CDS', courseCount: 8, studentCount: 15000 },
      { id: 'afcat', name: 'AFCAT', shortName: 'AFCAT', courseCount: 5, studentCount: 8000 },
    ]
  }
};

// Map category IDs to our config
const categoryMapping: Record<string, string> = {
  'banking-insurance': 'banking-insurance',
  'banking': 'banking-insurance',
  'ssc': 'ssc',
  'railways-rrb': 'railway',
  'railway': 'railway',
  'civil-services': 'upsc',
  'upsc': 'upsc',
  'cat': 'cat',
  'defence': 'defence',
};

const StudentCourses = () => {
  const { courses: globalFilteredCourses, hasFilters, selectedCategories } = useCategoryFilteredCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  
  // Get unique categories from selected ones
  const mappedCategories = useMemo(() => {
    const mapped = new Set<string>();
    selectedCategories.forEach(cat => {
      const mappedCat = categoryMapping[cat];
      if (mappedCat) mapped.add(mappedCat);
    });
    return Array.from(mapped);
  }, [selectedCategories]);

  // Get exams for selected categories
  const availableExams = useMemo(() => {
    if (mappedCategories.length === 0) return [];
    
    const exams: Array<{ id: string; name: string; shortName: string; icon: string; color: string; courseCount: number; studentCount: number; isPopular?: boolean }> = [];
    
    mappedCategories.forEach(catId => {
      const category = examCategories[catId as keyof typeof examCategories];
      if (category) {
        category.exams.forEach(exam => {
          exams.push({
            ...exam,
            icon: category.icon,
            color: category.color
          });
        });
      }
    });
    
    return exams;
  }, [mappedCategories]);

  // Filter courses
  const filteredCourses = useMemo(() => {
    let courses = globalFilteredCourses;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      courses = courses.filter(course => 
        course.title.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query)
      );
    }
    
    // Tab filter
    if (activeTab === 'trending') {
      courses = courses.filter(course => course.isTrending);
    } else if (activeTab === 'live') {
      courses = courses.filter(course => course.type === 'Live');
    } else if (activeTab === 'recorded') {
      courses = courses.filter(course => course.type === 'Recorded');
    }
    
    return courses;
  }, [globalFilteredCourses, searchQuery, activeTab]);

  // Get trending courses
  const trendingCourses = useMemo(() => {
    return globalFilteredCourses.filter(course => course.isTrending).slice(0, 4);
  }, [globalFilteredCourses]);

  // Get continue learning courses (with progress)
  const continueLearning = useMemo(() => {
    return globalFilteredCourses.filter(course => course.progress && course.progress > 0).slice(0, 3);
  }, [globalFilteredCourses]);

  return (
    <div className="space-y-6 pb-8">
      {/* Navigation */}
      <CourseNavigation 
        items={[
          { label: 'Dashboard', href: '/student/dashboard' },
          { label: 'Courses', isActive: true }
        ]}
      />

      {/* Welcome Banner */}
      <WelcomeCourseBanner 
        hasCategories={hasFilters}
        selectedCount={selectedCategories.length}
        courseCount={filteredCourses.length}
      />

      {/* Main Content */}
      {hasFilters ? (
        <>
          {/* Continue Learning Section */}
          {continueLearning.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" />
                  Continue Learning
                </h2>
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {continueLearning.map((course) => (
                  <MinimalistCourseCard key={course.id} course={course} variant="compact" />
                ))}
              </div>
            </section>
          )}

          {/* Exam Selection */}
          {availableExams.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Select Your Exam
                </h2>
                <Badge variant="outline" className="text-xs">
                  {availableExams.length} exams available
                </Badge>
              </div>
              <CategoryExamGrid 
                exams={availableExams}
                selectedExam={selectedExam}
                onExamSelect={(id) => setSelectedExam(selectedExam === id ? null : id)}
              />
            </section>
          )}

          {/* Trending Courses */}
          {trendingCourses.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  Trending Now
                </h2>
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <ScrollArea className="w-full">
                <div className="flex gap-4 pb-4">
                  {trendingCourses.map((course) => (
                    <div key={course.id} className="w-[280px] flex-shrink-0">
                      <MinimalistCourseCard course={course} />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </section>
          )}

          {/* Search and Filters */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search courses by name, instructor..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* View toggle */}
              <div className="flex gap-2">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'outline'} 
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'outline'} 
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
                <TabsTrigger value="all" className="text-xs px-3 py-1.5">
                  All Courses
                </TabsTrigger>
                <TabsTrigger value="trending" className="text-xs px-3 py-1.5">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </TabsTrigger>
                <TabsTrigger value="live" className="text-xs px-3 py-1.5">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1 animate-pulse" />
                  Live
                </TabsTrigger>
                <TabsTrigger value="recorded" className="text-xs px-3 py-1.5">
                  <Play className="h-3 w-3 mr-1" />
                  Recorded
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </section>

          {/* Course Grid */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredCourses.length} courses
              </p>
            </div>

            {filteredCourses.length === 0 ? (
              <Card className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No courses found</h3>
                <p className="text-muted-foreground text-sm">
                  Try adjusting your search or filters
                </p>
              </Card>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCourses.map((course) => (
                  <MinimalistCourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCourses.map((course) => (
                  <MinimalistCourseCard key={course.id} course={course} variant="compact" />
                ))}
              </div>
            )}
          </section>

          {/* Expert Instructors */}
          <section className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Expert Instructors
              </h2>
              <Button variant="ghost" size="sm" className="text-xs">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {instructors.slice(0, 3).map((instructor) => (
                <InstructorCard key={instructor.id} instructor={instructor} />
              ))}
            </div>
          </section>
        </>
      ) : (
        /* No categories selected - Show category exploration */
        <section className="space-y-6">
          <div className="text-center py-4">
            <h2 className="text-xl font-semibold text-foreground">Explore by Category</h2>
            <p className="text-muted-foreground mt-1">
              Browse courses across different exam categories
            </p>
          </div>

          {Object.entries(examCategories).map(([catId, category]) => (
            <Card key={catId} className="overflow-hidden">
              <div className={`${category.color} p-4 text-white`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{category.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold">{category.name}</h3>
                    <p className="text-white/80 text-sm">{category.exams.length} exams available</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {category.exams.map((exam) => (
                    <Button
                      key={exam.id}
                      variant="outline"
                      className="h-auto py-2 px-3 flex flex-col items-center gap-1 hover:border-primary hover:bg-primary/5"
                    >
                      <span className="text-sm font-medium">{exam.shortName}</span>
                      <span className="text-[10px] text-muted-foreground">{exam.courseCount} courses</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* CTA to select categories */}
          <Card className="p-6 text-center bg-primary/5 border-primary/20">
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Get Personalized Recommendations</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Select your target exams to see courses tailored for your preparation
            </p>
            <CategorySelector />
          </Card>
        </section>
      )}
    </div>
  );
};

export default StudentCourses;
