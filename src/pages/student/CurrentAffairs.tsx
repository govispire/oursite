import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategorySelector } from '@/components/global/CategorySelector';
import { ActiveCategoryFilters } from '@/components/global/ActiveCategoryFilters';
import { useCategoryFilteredCurrentAffairs } from '@/hooks/useCategoryFilteredContent';
import { BookOpen, Layers, CalendarDays, FileText, Zap, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AllInOneView from '@/components/current-affairs/AllInOneView';
import DailyNewsView from '@/components/current-affairs/DailyNewsView';
import { ContinueReadingSection } from '@/components/current-affairs/ContinueReadingSection';

const CurrentAffairs = () => {
  const { currentAffairs, stats, hasFilters, selectedCategories } = useCategoryFilteredCurrentAffairs();
  const [activeTab, setActiveTab] = useState('daily-news');
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Current Affairs</h1>
          <p className="text-muted-foreground mt-1">
            {hasFilters 
              ? `Stay updated with affairs relevant to your selected categories`
              : 'Select your exam categories to see relevant current affairs'
            }
          </p>
        </div>
        <CategorySelector />
      </div>

      {/* Active Filters */}
      {hasFilters && (
        <ActiveCategoryFilters 
          showStats={true}
          totalItems={stats.total}
          filteredItems={currentAffairs.length}
        />
      )}

      {/* Continue Reading Section */}
      <ContinueReadingSection />

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="daily-news" className="gap-1">
            <CalendarDays className="h-4 w-4" />
            Daily News
          </TabsTrigger>
          <TabsTrigger value="quick-quizzes" className="gap-1">
            <Zap className="h-4 w-4" />
            Quick Quizzes
          </TabsTrigger>
          <TabsTrigger value="weekly-quizzes" className="gap-1">
            <HelpCircle className="h-4 w-4" />
            Weekly Quizzes
          </TabsTrigger>
          <TabsTrigger value="free-pdfs" className="gap-1">
            <FileText className="h-4 w-4" />
            Free PDFs
          </TabsTrigger>
          <TabsTrigger value="topic-wise" className="gap-1">
            <Layers className="h-4 w-4" />
            Topic Wise View
          </TabsTrigger>
        </TabsList>

        {/* Daily News Tab */}
        <TabsContent value="daily-news" className="mt-6">
          <DailyNewsView />
        </TabsContent>

        {/* Quick Quizzes Tab */}
        <TabsContent value="quick-quizzes" className="mt-6">
          <QuickQuizzesView />
        </TabsContent>

        {/* Weekly Quizzes Tab */}
        <TabsContent value="weekly-quizzes" className="mt-6">
          <WeeklyQuizzesView />
        </TabsContent>

        {/* Free PDFs Tab */}
        <TabsContent value="free-pdfs" className="mt-6">
          <FreePDFsView />
        </TabsContent>

        {/* Topic Wise View Tab */}
        <TabsContent value="topic-wise" className="mt-6">
          <AllInOneView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Quick Quizzes Component
const QuickQuizzesView = () => {
  const navigate = useNavigate();
  
  const quizzes = [
    { id: 1, title: 'Daily Current Affairs Quiz - January 23', questions: 15, time: '10 min', difficulty: 'Medium', attempted: false },
    { id: 2, title: 'RBI Monetary Policy Quiz', questions: 12, time: '8 min', difficulty: 'Hard', attempted: true },
    { id: 3, title: 'Budget 2026 Quick Test', questions: 20, time: '15 min', difficulty: 'Medium', attempted: false },
    { id: 4, title: 'International Relations Quiz', questions: 10, time: '7 min', difficulty: 'Easy', attempted: true },
    { id: 5, title: 'Science & Technology Updates', questions: 15, time: '10 min', difficulty: 'Medium', attempted: false },
    { id: 6, title: 'Government Schemes Quiz', questions: 12, time: '8 min', difficulty: 'Easy', attempted: false },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quizzes.map(quiz => (
        <Card key={quiz.id} className="hover:shadow-lg transition-all cursor-pointer group">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <Badge variant={quiz.difficulty === 'Easy' ? 'secondary' : quiz.difficulty === 'Medium' ? 'default' : 'destructive'}>
                {quiz.difficulty}
              </Badge>
              {quiz.attempted && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Completed
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{quiz.title}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span>{quiz.questions} Questions</span>
              <span>{quiz.time}</span>
            </div>
            <Button 
              className="w-full" 
              variant={quiz.attempted ? "outline" : "default"}
              onClick={() => navigate('/student/daily-quizzes')}
            >
              {quiz.attempted ? 'Reattempt' : 'Start Quiz'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Weekly Quizzes Component
const WeeklyQuizzesView = () => {
  const navigate = useNavigate();
  
  const weeklyQuizzes = [
    { id: 1, title: 'Week 4 - January 2026 Comprehensive Quiz', questions: 50, time: '45 min', topics: ['Economy', 'Polity', 'Science'], score: null },
    { id: 2, title: 'Week 3 - January 2026 Comprehensive Quiz', questions: 50, time: '45 min', topics: ['Banking', 'International', 'Defence'], score: 78 },
    { id: 3, title: 'Week 2 - January 2026 Comprehensive Quiz', questions: 50, time: '45 min', topics: ['Environment', 'Sports', 'Culture'], score: 82 },
    { id: 4, title: 'Week 1 - January 2026 Comprehensive Quiz', questions: 50, time: '45 min', topics: ['Budget', 'RBI', 'ISRO'], score: 74 },
  ];

  return (
    <div className="space-y-4">
      {weeklyQuizzes.map(quiz => (
        <Card key={quiz.id} className="hover:shadow-lg transition-all cursor-pointer">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">{quiz.title}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {quiz.topics.map(topic => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{quiz.questions} Questions</span>
                  <span>{quiz.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {quiz.score !== null && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{quiz.score}%</div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                )}
                <Button 
                  variant={quiz.score !== null ? "outline" : "default"}
                  onClick={() => navigate('/student/daily-quizzes')}
                >
                  {quiz.score !== null ? 'View Results' : 'Start Quiz'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Free PDFs Component
const FreePDFsView = () => {
  const pdfs = [
    { id: 1, title: 'January 2026 Current Affairs Compilation', pages: 45, downloads: 1250, date: 'January 23, 2026' },
    { id: 2, title: 'Union Budget 2026-27 Complete Analysis', pages: 32, downloads: 2340, date: 'January 22, 2026' },
    { id: 3, title: 'RBI Monetary Policy Notes - January 2026', pages: 18, downloads: 890, date: 'January 21, 2026' },
    { id: 4, title: 'International Relations Monthly Digest', pages: 28, downloads: 1120, date: 'January 20, 2026' },
    { id: 5, title: 'Science & Technology Updates - January 2026', pages: 22, downloads: 760, date: 'January 19, 2026' },
    { id: 6, title: 'Government Schemes Complete Guide 2026', pages: 55, downloads: 3200, date: 'January 18, 2026' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pdfs.map(pdf => (
        <Card key={pdf.id} className="hover:shadow-lg transition-all cursor-pointer group">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <Badge variant="outline" className="text-xs">PDF</Badge>
              </div>
            </div>
            <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{pdf.title}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span>{pdf.pages} pages</span>
              <span>{pdf.downloads.toLocaleString()} downloads</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">{pdf.date}</p>
            <Button className="w-full gap-2">
              <FileText className="h-4 w-4" />
              Download PDF
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CurrentAffairs;
