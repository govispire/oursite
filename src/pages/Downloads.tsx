import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, Calendar, ChevronRight, Home, Search, Filter, BookOpen, Landmark, Train, Target, Shield, GraduationCap, Scale, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LandingHeader from '@/components/LandingHeader';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const Downloads = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { toast } = useToast();

  const categories = [
    { id: 'All', name: 'All Categories', icon: Folder, count: 150 },
    { id: 'Banking', name: 'Banking Exams', icon: Landmark, count: 45 },
    { id: 'SSC', name: 'SSC Exams', icon: Target, count: 38 },
    { id: 'Railway', name: 'Railway Exams', icon: Train, count: 25 },
    { id: 'UPSC', name: 'UPSC', icon: BookOpen, count: 30 },
    { id: 'TNPSC', name: 'TNPSC', icon: FileText, count: 18 },
    { id: 'Defence', name: 'Defence Exams', icon: Shield, count: 22 },
    { id: 'MBA', name: 'MBA Entrance', icon: GraduationCap, count: 15 },
    { id: 'Regulatory', name: 'Regulatory Exams', icon: Scale, count: 12 },
  ];

  const currentAffairsMagazines = [
    {
      id: 1,
      title: 'Current Affairs Monthly Magazine',
      month: 'December 2024',
      category: 'All',
      pages: 85,
      size: '12.5 MB',
      downloads: 15420,
      topics: ['Economy', 'Polity', 'Science & Tech', 'International'],
      new: true,
    },
    {
      id: 2,
      title: 'Current Affairs Monthly Magazine',
      month: 'November 2024',
      category: 'All',
      pages: 82,
      size: '11.8 MB',
      downloads: 28540,
      topics: ['Economy', 'Polity', 'Environment', 'Sports'],
      new: false,
    },
    {
      id: 3,
      title: 'Current Affairs Monthly Magazine',
      month: 'October 2024',
      category: 'All',
      pages: 78,
      size: '11.2 MB',
      downloads: 35620,
      topics: ['Budget', 'International', 'Awards', 'Appointments'],
      new: false,
    },
    {
      id: 4,
      title: 'Banking & Finance Monthly Digest',
      month: 'December 2024',
      category: 'Banking',
      pages: 45,
      size: '6.8 MB',
      downloads: 8920,
      topics: ['RBI Policies', 'Banking News', 'Economy Updates'],
      new: true,
    },
    {
      id: 5,
      title: 'Banking & Finance Monthly Digest',
      month: 'November 2024',
      category: 'Banking',
      pages: 42,
      size: '6.2 MB',
      downloads: 12450,
      topics: ['Monetary Policy', 'Bank Mergers', 'Financial News'],
      new: false,
    },
  ];

  const previousYearPapers = [
    {
      id: 1,
      examName: 'IBPS PO Prelims',
      year: '2024',
      category: 'Banking',
      papers: 3,
      withSolutions: true,
      downloads: 45620,
    },
    {
      id: 2,
      examName: 'IBPS PO Mains',
      year: '2024',
      category: 'Banking',
      papers: 1,
      withSolutions: true,
      downloads: 38450,
    },
    {
      id: 3,
      examName: 'SBI PO Prelims',
      year: '2024',
      category: 'Banking',
      papers: 4,
      withSolutions: true,
      downloads: 52340,
    },
    {
      id: 4,
      examName: 'SSC CGL Tier-1',
      year: '2024',
      category: 'SSC',
      papers: 8,
      withSolutions: true,
      downloads: 68920,
    },
    {
      id: 5,
      examName: 'SSC CGL Tier-2',
      year: '2024',
      category: 'SSC',
      papers: 2,
      withSolutions: true,
      downloads: 42150,
    },
    {
      id: 6,
      examName: 'SSC CHSL',
      year: '2024',
      category: 'SSC',
      papers: 6,
      withSolutions: true,
      downloads: 35680,
    },
    {
      id: 7,
      examName: 'RRB NTPC CBT-1',
      year: '2024',
      category: 'Railway',
      papers: 5,
      withSolutions: true,
      downloads: 48920,
    },
    {
      id: 8,
      examName: 'RRB Group D',
      year: '2024',
      category: 'Railway',
      papers: 10,
      withSolutions: true,
      downloads: 62450,
    },
    {
      id: 9,
      examName: 'UPSC Prelims',
      year: '2024',
      category: 'UPSC',
      papers: 2,
      withSolutions: true,
      downloads: 85620,
    },
    {
      id: 10,
      examName: 'UPSC Mains',
      year: '2023',
      category: 'UPSC',
      papers: 9,
      withSolutions: false,
      downloads: 45890,
    },
    {
      id: 11,
      examName: 'TNPSC Group 2',
      year: '2024',
      category: 'TNPSC',
      papers: 1,
      withSolutions: true,
      downloads: 28450,
    },
    {
      id: 12,
      examName: 'TNPSC Group 4',
      year: '2024',
      category: 'TNPSC',
      papers: 1,
      withSolutions: true,
      downloads: 32150,
    },
    {
      id: 13,
      examName: 'NDA',
      year: '2024',
      category: 'Defence',
      papers: 2,
      withSolutions: true,
      downloads: 38920,
    },
    {
      id: 14,
      examName: 'CDS',
      year: '2024',
      category: 'Defence',
      papers: 2,
      withSolutions: true,
      downloads: 28450,
    },
    {
      id: 15,
      examName: 'CAT',
      year: '2024',
      category: 'MBA',
      papers: 3,
      withSolutions: true,
      downloads: 52340,
    },
    {
      id: 16,
      examName: 'RBI Grade B',
      year: '2024',
      category: 'Regulatory',
      papers: 2,
      withSolutions: true,
      downloads: 25680,
    },
    {
      id: 17,
      examName: 'SEBI Grade A',
      year: '2024',
      category: 'Regulatory',
      papers: 2,
      withSolutions: true,
      downloads: 18920,
    },
  ];

  const studyMaterials = [
    {
      id: 1,
      title: 'Quantitative Aptitude Formula Book',
      category: 'All',
      pages: 120,
      size: '8.5 MB',
      downloads: 125680,
      description: 'Complete formula book covering all topics for banking, SSC, and railway exams.',
    },
    {
      id: 2,
      title: 'Reasoning Shortcuts & Tricks',
      category: 'All',
      pages: 95,
      size: '7.2 MB',
      downloads: 98450,
      description: 'Time-saving shortcuts for puzzles, seating arrangements, and coding-decoding.',
    },
    {
      id: 3,
      title: 'English Grammar Rules',
      category: 'All',
      pages: 85,
      size: '5.8 MB',
      downloads: 78920,
      description: 'Essential grammar rules with examples for competitive exams.',
    },
    {
      id: 4,
      title: 'Banking Awareness Capsule 2025',
      category: 'Banking',
      pages: 65,
      size: '4.5 MB',
      downloads: 45680,
      description: 'Complete banking awareness for IBPS, SBI, and RBI exams.',
    },
    {
      id: 5,
      title: 'Static GK Compendium',
      category: 'All',
      pages: 150,
      size: '12.8 MB',
      downloads: 156920,
      description: 'Comprehensive static GK covering history, geography, polity, and economy.',
    },
    {
      id: 6,
      title: 'Indian Constitution Notes',
      category: 'UPSC',
      pages: 85,
      size: '6.2 MB',
      downloads: 68450,
      description: 'Detailed notes on Indian Constitution for UPSC and state PSC exams.',
    },
  ];

  const handleDownload = (title: string) => {
    toast({
      title: 'Download Started',
      description: `${title} is being downloaded...`,
    });
  };

  const filteredPapers = previousYearPapers.filter(paper => 
    selectedCategory === 'All' || paper.category === selectedCategory
  );

  const filteredMagazines = currentAffairsMagazines.filter(mag =>
    selectedCategory === 'All' || mag.category === 'All' || mag.category === selectedCategory
  );

  const filteredMaterials = studyMaterials.filter(mat =>
    selectedCategory === 'All' || mat.category === 'All' || mat.category === selectedCategory
  );

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
          <span className="text-foreground">Downloads</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Free Downloads
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Current Affairs Magazines, Previous Year Papers & Study Materials
              </p>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search downloads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-muted/50"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Total Downloads', value: '2.5M+', icon: Download },
              { label: 'PDF Resources', value: '500+', icon: FileText },
              { label: 'Exam Categories', value: '8', icon: Folder },
              { label: 'Updated Monthly', value: '50+', icon: Calendar },
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
        <div className="flex flex-wrap gap-2 mb-8 p-4 bg-muted/30 rounded-xl">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="gap-2"
              >
                <IconComponent className="h-4 w-4" />
                {cat.name}
                <Badge variant="secondary" className="ml-1 text-xs">{cat.count}</Badge>
              </Button>
            );
          })}
        </div>

        <Tabs defaultValue="magazines" className="space-y-8">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="magazines">Current Affairs</TabsTrigger>
            <TabsTrigger value="papers">Previous Year Papers</TabsTrigger>
            <TabsTrigger value="materials">Study Materials</TabsTrigger>
          </TabsList>

          {/* Current Affairs Magazines */}
          <TabsContent value="magazines" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMagazines.map((magazine, idx) => (
                <motion.div
                  key={magazine.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <FileText className="h-8 w-8 text-primary" />
                        </div>
                        {magazine.new && (
                          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">New</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg mt-3">{magazine.title}</CardTitle>
                      <p className="text-primary font-medium">{magazine.month}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {magazine.topics.map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">{topic}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{magazine.pages} Pages</span>
                        <span>{magazine.size}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {magazine.downloads.toLocaleString()} downloads
                        </span>
                        <Button size="sm" onClick={() => handleDownload(magazine.title)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Previous Year Papers */}
          <TabsContent value="papers" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPapers.map((paper, idx) => {
                const categoryData = categories.find(c => c.id === paper.category);
                const IconComponent = categoryData?.icon || FileText;
                return (
                  <motion.div
                    key={paper.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                            <IconComponent className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                              {paper.examName}
                            </h3>
                            <p className="text-sm text-muted-foreground">{paper.year}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="outline">{paper.papers} Papers</Badge>
                          {paper.withSolutions && (
                            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                              With Solutions
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {paper.downloads.toLocaleString()} downloads
                          </span>
                          <Button size="sm" variant="outline" onClick={() => handleDownload(paper.examName)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Study Materials */}
          <TabsContent value="materials" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material, idx) => (
                <motion.div
                  key={material.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold mb-1">{material.title}</h3>
                          <Badge variant="secondary" className="text-xs">{material.category}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{material.description}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span>{material.pages} Pages</span>
                        <span>{material.size}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {material.downloads.toLocaleString()} downloads
                        </span>
                        <Button size="sm" onClick={() => handleDownload(material.title)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <section className="mt-16 p-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">Want More Premium Resources?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Upgrade to our premium plans to access exclusive study materials, video courses, 
            and personalized preparation strategies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing">
              <Button size="lg">View Premium Plans</Button>
            </Link>
            <Link to="/blog">
              <Button size="lg" variant="outline">Read Our Blog</Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Downloads;
