import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ChevronRight, Home, Bell, TrendingUp, Filter, Search, BookOpen, Globe, Landmark, Briefcase, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LandingHeader from '@/components/LandingHeader';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const CurrentAffairs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { id: 'All', name: 'All Topics', icon: BookOpen },
    { id: 'Banking', name: 'Banking & Finance', icon: Landmark },
    { id: 'Economy', name: 'Economy', icon: TrendingUp },
    { id: 'National', name: 'National', icon: Globe },
    { id: 'International', name: 'International', icon: Globe },
    { id: 'Government', name: 'Government Schemes', icon: Briefcase },
    { id: 'Science', name: 'Science & Tech', icon: BookOpen },
  ];

  const dailyUpdates = [
    {
      id: 1,
      date: 'January 3, 2025',
      articles: [
        {
          title: 'RBI Monetary Policy: Key Highlights for Banking Exams',
          category: 'Banking',
          importance: 'high',
          excerpt: 'Reserve Bank of India announces new policy rates. Key points every banking aspirant must know for IBPS, SBI exams.',
          readTime: '5 min',
        },
        {
          title: 'Union Budget 2025-26: Important Points for Competitive Exams',
          category: 'Economy',
          importance: 'high',
          excerpt: 'Complete analysis of the budget with focus on questions likely to appear in SSC, UPSC, and banking exams.',
          readTime: '12 min',
        },
        {
          title: 'New Education Policy Updates for TNPSC Exams',
          category: 'Government',
          importance: 'medium',
          excerpt: 'Latest developments in National Education Policy and their implications for state-level competitive exams.',
          readTime: '6 min',
        },
      ],
    },
    {
      id: 2,
      date: 'January 2, 2025',
      articles: [
        {
          title: 'Defence Acquisition Council Approves New Projects',
          category: 'National',
          importance: 'medium',
          excerpt: 'Important for NDA, CDS, and UPSC aspirants. New defence projects worth ₹10,000 crores approved.',
          readTime: '4 min',
        },
        {
          title: 'SEBI Introduces New Regulations for Market Intermediaries',
          category: 'Banking',
          importance: 'high',
          excerpt: 'Must-know for RBI Grade B and SEBI Grade A exam aspirants. Complete analysis of new market regulations.',
          readTime: '7 min',
        },
      ],
    },
    {
      id: 3,
      date: 'January 1, 2025',
      articles: [
        {
          title: 'India Signs Trade Agreement with EU Nations',
          category: 'International',
          importance: 'high',
          excerpt: 'Historic trade deal expected to boost exports. Key facts for UPSC and commerce-related exams.',
          readTime: '8 min',
        },
        {
          title: 'New Railway Projects Announced for Northeast',
          category: 'National',
          importance: 'medium',
          excerpt: 'Railway Ministry announces connectivity projects worth ₹25,000 crores. Important for RRB exams.',
          readTime: '5 min',
        },
        {
          title: 'ISRO Successfully Launches Communication Satellite',
          category: 'Science',
          importance: 'medium',
          excerpt: 'GSAT-24 launch marks milestone in India\'s space program. Details for competitive exam preparation.',
          readTime: '4 min',
        },
      ],
    },
  ];

  const weeklyDigest = [
    {
      title: 'Weekly Banking & Finance Digest',
      period: 'Dec 28, 2024 - Jan 3, 2025',
      topics: 15,
      exams: ['IBPS PO', 'SBI PO', 'RBI Grade B'],
    },
    {
      title: 'Weekly Economy & Current Affairs',
      period: 'Dec 28, 2024 - Jan 3, 2025',
      topics: 22,
      exams: ['UPSC', 'SSC CGL', 'State PCS'],
    },
    {
      title: 'Weekly Science & Technology Updates',
      period: 'Dec 28, 2024 - Jan 3, 2025',
      topics: 10,
      exams: ['UPSC', 'SSC', 'Railway'],
    },
  ];

  const monthlyQuiz = [
    { month: 'December 2024', questions: 100, attempted: false },
    { month: 'November 2024', questions: 100, attempted: true },
    { month: 'October 2024', questions: 100, attempted: true },
  ];

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'high':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Medium</Badge>;
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : BookOpen;
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
        <header className="mb-12">
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
              { label: 'Monthly Quizzes', value: '100Q', icon: AlertCircle },
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

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="gap-2"
            >
              <cat.icon className="h-4 w-4" />
              {cat.name}
            </Button>
          ))}
        </div>

        <Tabs defaultValue="daily" className="space-y-8">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="daily">Daily Updates</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Digest</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Quiz</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-8">
            {dailyUpdates.map((day) => (
              <motion.div
                key={day.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">{day.date}</h2>
                  <Badge variant="secondary">{day.articles.length} articles</Badge>
                </div>

                <div className="grid gap-4">
                  {day.articles
                    .filter(a => selectedCategory === 'All' || a.category === selectedCategory)
                    .map((article, idx) => {
                      const IconComponent = getCategoryIcon(article.category);
                      return (
                        <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer group">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                                <IconComponent className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline">{article.category}</Badge>
                                  {getImportanceBadge(article.importance)}
                                </div>
                                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                                  {article.title}
                                </h3>
                                <p className="text-muted-foreground mb-3">{article.excerpt}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {article.readTime}
                                  </span>
                                  <Button variant="link" className="p-0 h-auto text-primary">
                                    Read More →
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="weekly" className="grid md:grid-cols-3 gap-6">
            {weeklyDigest.map((digest, idx) => (
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
                  <Button className="w-full">Download PDF</Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="monthly" className="grid md:grid-cols-3 gap-6">
            {monthlyQuiz.map((quiz, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{quiz.month}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{quiz.questions} Questions</Badge>
                    {quiz.attempted && (
                      <Badge className="bg-green-500/10 text-green-500">Completed</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive monthly current affairs quiz covering all exam categories.
                  </p>
                  <Button className="w-full" variant={quiz.attempted ? "outline" : "default"}>
                    {quiz.attempted ? 'Review Answers' : 'Take Quiz'}
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
