import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, ChevronRight, Home, Bell, TrendingUp, Filter, Search, BookOpen, 
  Globe, Landmark, Briefcase, AlertCircle, Grid3X3, List, Image, Layers, 
  Tag, ArrowRight, Play, CheckCircle, Trophy, Zap, FileText, Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import LandingHeader from '@/components/LandingHeader';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

type ViewMode = 'grid' | 'list' | 'thumbnail' | 'all-in-one';

interface Article {
  id: string;
  title: string;
  category: string;
  importance: 'high' | 'medium' | 'low';
  excerpt: string;
  readTime: string;
  date: string;
  image?: string;
  tags: string[];
  topic: string;
  relatedIds: string[];
  hasQuiz: boolean;
  quizQuestions?: number;
}

const CurrentAffairs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const categories = [
    { id: 'All', name: 'All Topics', icon: BookOpen },
    { id: 'Banking', name: 'Banking & Finance', icon: Landmark },
    { id: 'Economy', name: 'Economy', icon: TrendingUp },
    { id: 'National', name: 'National', icon: Globe },
    { id: 'International', name: 'International', icon: Globe },
    { id: 'Government', name: 'Government Schemes', icon: Briefcase },
    { id: 'Science', name: 'Science & Tech', icon: BookOpen },
    { id: 'Sports', name: 'Sports', icon: Trophy },
  ];

  const topics = [
    'RBI Policy', 'Budget 2025', 'Defence', 'Space & ISRO', 'International Relations', 
    'Environment', 'Education', 'Health', 'Infrastructure', 'Digital India'
  ];

  const popularTags = [
    '#RBI', '#Budget2025', '#UPSC', '#Banking', '#SSC', '#Railways', '#Defence', 
    '#Economy', '#CurrentAffairs', '#GK', '#India', '#International'
  ];

  const allArticles: Article[] = [
    {
      id: '1',
      title: 'RBI Monetary Policy: Key Highlights for Banking Exams',
      category: 'Banking',
      importance: 'high',
      excerpt: 'Reserve Bank of India announces new policy rates. Key points every banking aspirant must know for IBPS, SBI exams.',
      readTime: '5 min',
      date: 'January 5, 2025',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop',
      tags: ['#RBI', '#Banking', '#MonetaryPolicy'],
      topic: 'RBI Policy',
      relatedIds: ['5', '8'],
      hasQuiz: true,
      quizQuestions: 10,
    },
    {
      id: '2',
      title: 'Union Budget 2025-26: Complete Analysis for Competitive Exams',
      category: 'Economy',
      importance: 'high',
      excerpt: 'Comprehensive breakdown of the budget with focus on questions likely to appear in SSC, UPSC, and banking exams.',
      readTime: '12 min',
      date: 'January 5, 2025',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
      tags: ['#Budget2025', '#Economy', '#UPSC'],
      topic: 'Budget 2025',
      relatedIds: ['3', '6'],
      hasQuiz: true,
      quizQuestions: 15,
    },
    {
      id: '3',
      title: 'New Education Policy Updates for State Exams',
      category: 'Government',
      importance: 'medium',
      excerpt: 'Latest developments in National Education Policy and their implications for state-level competitive exams.',
      readTime: '6 min',
      date: 'January 4, 2025',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop',
      tags: ['#Education', '#NEP', '#Government'],
      topic: 'Education',
      relatedIds: ['2'],
      hasQuiz: true,
      quizQuestions: 8,
    },
    {
      id: '4',
      title: 'Defence Acquisition Council Approves New Projects',
      category: 'National',
      importance: 'medium',
      excerpt: 'Important for NDA, CDS, and UPSC aspirants. New defence projects worth ₹10,000 crores approved.',
      readTime: '4 min',
      date: 'January 4, 2025',
      image: 'https://images.unsplash.com/photo-1580752300992-559f8e898998?w=400&h=250&fit=crop',
      tags: ['#Defence', '#DAC', '#Military'],
      topic: 'Defence',
      relatedIds: ['7'],
      hasQuiz: false,
    },
    {
      id: '5',
      title: 'SEBI Introduces New Regulations for Market Intermediaries',
      category: 'Banking',
      importance: 'high',
      excerpt: 'Must-know for RBI Grade B and SEBI Grade A exam aspirants. Complete analysis of new market regulations.',
      readTime: '7 min',
      date: 'January 3, 2025',
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=250&fit=crop',
      tags: ['#SEBI', '#Banking', '#Markets'],
      topic: 'RBI Policy',
      relatedIds: ['1', '8'],
      hasQuiz: true,
      quizQuestions: 12,
    },
    {
      id: '6',
      title: 'India Signs Historic Trade Agreement with EU Nations',
      category: 'International',
      importance: 'high',
      excerpt: 'Historic trade deal expected to boost exports. Key facts for UPSC and commerce-related exams.',
      readTime: '8 min',
      date: 'January 3, 2025',
      image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=250&fit=crop',
      tags: ['#Trade', '#EU', '#International'],
      topic: 'International Relations',
      relatedIds: ['2'],
      hasQuiz: true,
      quizQuestions: 10,
    },
    {
      id: '7',
      title: 'ISRO Successfully Launches Communication Satellite',
      category: 'Science',
      importance: 'medium',
      excerpt: "GSAT-24 launch marks milestone in India's space program. Details for competitive exam preparation.",
      readTime: '4 min',
      date: 'January 2, 2025',
      image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=250&fit=crop',
      tags: ['#ISRO', '#Space', '#Science'],
      topic: 'Space & ISRO',
      relatedIds: ['4'],
      hasQuiz: true,
      quizQuestions: 8,
    },
    {
      id: '8',
      title: 'New Railway Projects Announced for Northeast',
      category: 'National',
      importance: 'medium',
      excerpt: 'Railway Ministry announces connectivity projects worth ₹25,000 crores. Important for RRB exams.',
      readTime: '5 min',
      date: 'January 2, 2025',
      image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=250&fit=crop',
      tags: ['#Railways', '#Infrastructure', '#Northeast'],
      topic: 'Infrastructure',
      relatedIds: ['1'],
      hasQuiz: false,
    },
    {
      id: '9',
      title: 'Digital India 2.0: New Initiatives Launched',
      category: 'Government',
      importance: 'medium',
      excerpt: 'Government launches new digital initiatives to boost e-governance and digital literacy across India.',
      readTime: '6 min',
      date: 'January 1, 2025',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
      tags: ['#DigitalIndia', '#Government', '#Technology'],
      topic: 'Digital India',
      relatedIds: ['3'],
      hasQuiz: true,
      quizQuestions: 10,
    },
    {
      id: '10',
      title: 'Paris Olympics 2024: India Medal Winners Analysis',
      category: 'Sports',
      importance: 'low',
      excerpt: "Complete analysis of India's performance at Paris Olympics 2024. Important GK for all competitive exams.",
      readTime: '7 min',
      date: 'January 1, 2025',
      image: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=400&h=250&fit=crop',
      tags: ['#Olympics', '#Sports', '#India'],
      topic: 'Sports',
      relatedIds: [],
      hasQuiz: true,
      quizQuestions: 15,
    },
  ];

  const quickQuizzes = [
    { id: 1, title: 'Daily Current Affairs Quiz', questions: 10, time: '5 min', difficulty: 'Easy', attempted: false },
    { id: 2, title: 'Banking & Finance Special', questions: 15, time: '10 min', difficulty: 'Medium', attempted: true, score: 12 },
    { id: 3, title: 'Weekly Mega Quiz', questions: 50, time: '30 min', difficulty: 'Hard', attempted: false },
    { id: 4, title: 'Budget 2025 Special', questions: 20, time: '15 min', difficulty: 'Medium', attempted: false },
  ];

  const getFilteredArticles = () => {
    let filtered = allArticles;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }
    
    if (selectedTag) {
      filtered = filtered.filter(a => a.tags.includes(selectedTag));
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(query) || 
        a.excerpt.toLowerCase().includes(query) ||
        a.tags.some(t => t.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };

  const filteredArticles = getFilteredArticles();

  const getArticlesByTopic = () => {
    const grouped: Record<string, Article[]> = {};
    filteredArticles.forEach(article => {
      if (!grouped[article.topic]) {
        grouped[article.topic] = [];
      }
      grouped[article.topic].push(article);
    });
    return grouped;
  };

  const getRelatedArticles = (article: Article) => {
    return allArticles.filter(a => article.relatedIds.includes(a.id));
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'high':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Medium</Badge>;
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredArticles.map((article, idx) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden">
            <CardContent className="p-5 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">{article.category}</Badge>
                {getImportanceBadge(article.importance)}
                {article.hasQuiz && (
                  <Badge className="bg-primary/10 text-primary border-primary/20 ml-auto">
                    <Zap className="h-3 w-3 mr-1" />
                    Quiz
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">{article.excerpt}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {article.tags.slice(0, 3).map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={(e) => { e.stopPropagation(); setSelectedTag(tag); }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {article.date.split(',')[0]}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  const renderThumbnailView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredArticles.map((article, idx) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
        >
          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-white/90 text-foreground">{article.category}</Badge>
                  {article.hasQuiz && (
                    <Badge className="bg-primary text-primary-foreground">
                      <Play className="h-3 w-3 mr-1" />
                      {article.quizQuestions}Q
                    </Badge>
                  )}
                </div>
              </div>
              {article.importance === 'high' && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-red-500 text-white">Hot</Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{article.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {article.readTime}
                </span>
                <Button variant="link" size="sm" className="p-0 h-auto text-primary">
                  Read More <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {filteredArticles.map((article, idx) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.03 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
            <CardContent className="p-4 flex gap-4">
              <div className="hidden sm:block w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge variant="outline">{article.category}</Badge>
                  {getImportanceBadge(article.importance)}
                  {article.hasQuiz && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      <Zap className="h-3 w-3 mr-1" />
                      {article.quizQuestions} Questions
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-2 line-clamp-1">{article.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </span>
                  <div className="flex gap-1 ml-auto">
                    {article.tags.slice(0, 2).map(tag => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="text-xs cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); setSelectedTag(tag); }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  const renderAllInOneView = () => {
    const groupedArticles = getArticlesByTopic();
    
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">All News - Topic Wise View</h2>
                <p className="text-muted-foreground text-sm">Complete daily digest organized by topics</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {topics.map(topic => (
                <Button
                  key={topic}
                  variant={expandedTopic === topic ? "default" : "outline"}
                  size="sm"
                  onClick={() => setExpandedTopic(expandedTopic === topic ? null : topic)}
                >
                  {topic}
                  {groupedArticles[topic] && (
                    <Badge variant="secondary" className="ml-2">
                      {groupedArticles[topic].length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {Object.entries(groupedArticles).map(([topic, articles]) => (
          <motion.div
            key={topic}
            initial={false}
            animate={{ 
              height: expandedTopic === null || expandedTopic === topic ? 'auto' : 0,
              opacity: expandedTopic === null || expandedTopic === topic ? 1 : 0
            }}
            className="overflow-hidden"
          >
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-primary" />
                    {topic}
                    <Badge variant="secondary">{articles.length} articles</Badge>
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {articles.map((article, idx) => (
                  <div 
                    key={article.id}
                    className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-2xl font-bold text-primary/30">{idx + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getImportanceBadge(article.importance)}
                          {article.hasQuiz && (
                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Quiz Available
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-muted-foreground text-sm mt-1">{article.excerpt}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.readTime}
                          </span>
                          <div className="flex gap-1">
                            {article.tags.map(tag => (
                              <span key={tag} className="text-primary">{tag}</span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Related News Section */}
                        {article.relatedIds.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs text-muted-foreground mb-2">Related News:</p>
                            <div className="flex flex-wrap gap-2">
                              {getRelatedArticles(article).map(related => (
                                <Badge 
                                  key={related.id} 
                                  variant="outline" 
                                  className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                                >
                                  {related.title.substring(0, 40)}...
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <LandingHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="flex items-center gap-1 hover:text-primary transition-colors">
            <Home className="h-4 w-4" />
            PrepSmart Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Current Affairs</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Current Affairs
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Daily updates curated for Banking, SSC, Railway, UPSC, TNPSC, Defence & MBA exams
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-muted/50"
                />
              </div>
              <Link to="/pricing">
                <Button>Subscribe for Daily Updates</Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Daily Updates', value: '10+', icon: Calendar },
              { label: 'Topics Covered', value: '500+', icon: BookOpen },
              { label: 'Exam Categories', value: '8', icon: TrendingUp },
              { label: 'Quizzes Available', value: '50+', icon: Zap },
            ].map((stat, i) => (
              <Card key={i} className="border-0 bg-gradient-to-br from-muted/50 to-muted/30">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </header>

        {/* View Mode Selector & Category Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="gap-2"
              >
                <Grid3X3 className="h-4 w-4" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'thumbnail' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('thumbnail')}
                className="gap-2"
              >
                <Image className="h-4 w-4" />
                Thumbnails
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="gap-2"
              >
                <List className="h-4 w-4" />
                List
              </Button>
              <Button
                variant={viewMode === 'all-in-one' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('all-in-one')}
                className="gap-2"
              >
                <Layers className="h-4 w-4" />
                All-in-One
              </Button>
            </div>

            {selectedTag && (
              <Badge variant="secondary" className="gap-2">
                Filtered by: {selectedTag}
                <button 
                  onClick={() => setSelectedTag(null)}
                  className="ml-1 hover:text-destructive"
                >
                  ✕
                </button>
              </Badge>
            )}
          </div>

          {/* Category Filters */}
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="gap-2 whitespace-nowrap"
                >
                  <cat.icon className="h-4 w-4" />
                  {cat.name}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Popular Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground mr-2">Popular:</span>
            {popularTags.slice(0, 8).map(tag => (
              <Badge 
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="news" className="space-y-8">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="news" className="gap-2">
              <BookOpen className="h-4 w-4" />
              News & Updates
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="gap-2">
              <Zap className="h-4 w-4" />
              Quick Quizzes
            </TabsTrigger>
            <TabsTrigger value="digests" className="gap-2">
              <FileText className="h-4 w-4" />
              Weekly Digests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="space-y-6">
            <AnimatePresence mode="wait">
              {viewMode === 'grid' && renderGridView()}
              {viewMode === 'thumbnail' && renderThumbnailView()}
              {viewMode === 'list' && renderListView()}
              {viewMode === 'all-in-one' && renderAllInOneView()}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Test Your Knowledge</h2>
                    <p className="text-muted-foreground text-sm">Take quick quizzes on today's current affairs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickQuizzes.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-lg transition-all cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Badge 
                        className={
                          quiz.difficulty === 'Easy' 
                            ? 'bg-green-500/10 text-green-600' 
                            : quiz.difficulty === 'Medium'
                            ? 'bg-yellow-500/10 text-yellow-600'
                            : 'bg-red-500/10 text-red-600'
                        }
                      >
                        {quiz.difficulty}
                      </Badge>
                      {quiz.attempted && (
                        <Badge className="bg-primary/10 text-primary">
                          Score: {quiz.score}/{quiz.questions}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {quiz.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {quiz.questions} Qs
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {quiz.time}
                      </span>
                    </div>
                    <Button 
                      className="w-full" 
                      variant={quiz.attempted ? "outline" : "default"}
                    >
                      {quiz.attempted ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Review
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start Quiz
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Article Quizzes */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Topic-Specific Quizzes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allArticles.filter(a => a.hasQuiz).map(article => (
                  <Card key={article.id} className="hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">{article.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Badge variant="secondary">{article.quizQuestions} Questions</Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Play className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="digests" className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Weekly Banking & Finance Digest',
                period: 'Dec 30, 2024 - Jan 5, 2025',
                topics: 18,
                exams: ['IBPS PO', 'SBI PO', 'RBI Grade B'],
              },
              {
                title: 'Weekly Economy & Current Affairs',
                period: 'Dec 30, 2024 - Jan 5, 2025',
                topics: 25,
                exams: ['UPSC', 'SSC CGL', 'State PCS'],
              },
              {
                title: 'Weekly Science & Technology Updates',
                period: 'Dec 30, 2024 - Jan 5, 2025',
                topics: 12,
                exams: ['UPSC', 'SSC', 'Railway'],
              },
            ].map((digest, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{digest.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{digest.period}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{digest.topics} Topics</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {digest.exams.map((exam) => (
                      <Badge key={exam} variant="outline" className="text-xs">
                        {exam}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <section className="mt-16 p-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">Never Miss an Important Update</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Subscribe to get daily current affairs digests, weekly summaries, and monthly quizzes 
            delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Input placeholder="Enter your email" className="max-w-xs bg-background" />
            <Button>Subscribe Now</Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CurrentAffairs;