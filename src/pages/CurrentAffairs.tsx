import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, ChevronRight, Home, Bell, TrendingUp, Filter, Search, BookOpen, 
  Globe, Landmark, Briefcase, AlertCircle, Grid3X3, List, Image, Layers, 
  Tag, ArrowRight, Play, CheckCircle, Trophy, Zap, FileText, Hash,
  Moon, Sun, Type, Bookmark, BookmarkCheck, X, Mail, Settings, Eye,
  Minus, Plus, ChevronDown, ChevronUp, Heart, Share2, ExternalLink, Link2,
  Facebook, Twitter, Linkedin, Copy, MessageCircle, Volume2, VolumeX, Check,
  Pause, Square
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import LandingHeader from '@/components/LandingHeader';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

type ViewMode = 'grid' | 'list' | 'thumbnail' | 'all-in-one';

interface Article {
  id: string;
  title: string;
  category: string;
  importance: 'high' | 'medium' | 'low';
  excerpt: string;
  content?: string;
  readTime: string;
  date: string;
  image?: string;
  tags: string[];
  topic: string;
  relatedIds: string[];
  hasQuiz: boolean;
  quizQuestions?: number;
}

interface ReadingSettings {
  isDarkMode: boolean;
  fontSize: number;
  lineHeight: number;
  fontFamily: 'sans' | 'serif' | 'mono';
}

interface DigestPreferences {
  enabled: boolean;
  frequency: 'daily' | 'weekly';
  categories: string[];
  email: string;
}

interface ReadingProgress {
  articleId: string;
  progress: number; // 0-100 percentage
  scrollPosition: number;
  lastRead: string;
}

const CurrentAffairs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  
  // Reading Mode State
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);
  const [readingSettings, setReadingSettings] = useState<ReadingSettings>({
    isDarkMode: false,
    fontSize: 16,
    lineHeight: 1.8,
    fontFamily: 'sans'
  });
  
  // Bookmark State
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>(() => {
    const saved = localStorage.getItem('bookmarkedArticles');
    return saved ? JSON.parse(saved) : [];
  });
  const [showBookmarks, setShowBookmarks] = useState(false);
  
  // Daily Digest State
  const [digestPreferences, setDigestPreferences] = useState<DigestPreferences>(() => {
    const saved = localStorage.getItem('digestPreferences');
    return saved ? JSON.parse(saved) : {
      enabled: false,
      frequency: 'daily',
      categories: [],
      email: ''
    };
  });
  const [showDigestSettings, setShowDigestSettings] = useState(false);

  // Reading Progress State
  const [readingProgressMap, setReadingProgressMap] = useState<Record<string, ReadingProgress>>(() => {
    const saved = localStorage.getItem('readingProgressMap');
    return saved ? JSON.parse(saved) : {};
  });

  // Share Dialog State
  const [shareArticle, setShareArticle] = useState<Article | null>(null);

  // Topic View Dialog State (for viewing all articles in a topic)
  const [topicViewArticles, setTopicViewArticles] = useState<Article[] | null>(null);
  const [topicViewName, setTopicViewName] = useState<string>('');

  // Audio Narration State
  const [isNarrating, setIsNarrating] = useState(false);
  const [narrationArticleId, setNarrationArticleId] = useState<string | null>(null);
  const speechSynthesisRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  // Persist bookmarks
  useEffect(() => {
    localStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarkedArticles));
  }, [bookmarkedArticles]);

  // Persist digest preferences
  useEffect(() => {
    localStorage.setItem('digestPreferences', JSON.stringify(digestPreferences));
  }, [digestPreferences]);

  // Persist reading progress
  useEffect(() => {
    localStorage.setItem('readingProgressMap', JSON.stringify(readingProgressMap));
  }, [readingProgressMap]);

  // Reading progress functions
  const getReadingProgress = (articleId: string): number => {
    return readingProgressMap[articleId]?.progress || 0;
  };

  const updateReadingProgress = (articleId: string, progress: number, scrollPosition: number) => {
    setReadingProgressMap(prev => ({
      ...prev,
      [articleId]: {
        articleId,
        progress: Math.min(100, Math.max(0, progress)),
        scrollPosition,
        lastRead: new Date().toISOString()
      }
    }));
  };

  const getResumePosition = (articleId: string): number => {
    return readingProgressMap[articleId]?.scrollPosition || 0;
  };

  // Share functions
  const getShareUrl = (article: Article) => {
    return `${window.location.origin}/current-affairs/${article.id}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const shareToSocial = (platform: string, article: Article) => {
    const url = getShareUrl(article);
    const text = encodeURIComponent(article.title);
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  // Mark as Read function
  const markAsRead = (articleId: string) => {
    setReadingProgressMap(prev => ({
      ...prev,
      [articleId]: {
        articleId,
        progress: 100,
        scrollPosition: 0,
        lastRead: new Date().toISOString()
      }
    }));
    toast.success('Article marked as read');
  };

  // Audio Narration functions
  const startNarration = (article: Article) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Audio narration is not supported in your browser');
      return;
    }

    // Stop any existing narration
    stopNarration();

    const textToRead = `${article.title}. ${article.excerpt}. ${article.content || ''}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsNarrating(false);
      setNarrationArticleId(null);
    };

    utterance.onerror = () => {
      setIsNarrating(false);
      setNarrationArticleId(null);
      toast.error('Narration stopped due to an error');
    };

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsNarrating(true);
    setNarrationArticleId(article.id);
    toast.success('Starting audio narration');
  };

  const stopNarration = () => {
    window.speechSynthesis.cancel();
    setIsNarrating(false);
    setNarrationArticleId(null);
  };

  const toggleNarration = (article: Article) => {
    if (isNarrating && narrationArticleId === article.id) {
      stopNarration();
    } else {
      startNarration(article);
    }
  };

  // Open Topic View with all articles
  const openTopicView = (topic: string, articles: Article[]) => {
    setTopicViewName(topic);
    setTopicViewArticles(articles);
  };

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
      content: `The Reserve Bank of India (RBI) in its latest Monetary Policy Committee (MPC) meeting has announced several key decisions that are crucial for banking exam aspirants.

**Key Highlights:**

1. **Repo Rate Decision**: The MPC has decided to maintain the repo rate unchanged at 6.50%, prioritizing price stability while supporting growth.

2. **GDP Growth Projection**: The central bank has revised its GDP growth forecast for FY 2024-25, reflecting the resilient domestic economy.

3. **Inflation Target**: CPI inflation is projected to remain within the target band, with the RBI continuing its vigilant stance on price stability.

4. **Liquidity Management**: The central bank has introduced new measures to manage liquidity conditions in the banking system.

5. **Digital Payment Initiatives**: New guidelines for digital payment security and UPI transaction limits have been announced.

**Important Points for Exams:**
- Current Repo Rate: 6.50%
- SDF Rate: 6.25%
- MSF Rate: 6.75%
- Bank Rate: 6.75%
- CRR: 4.50%
- SLR: 18%

This update is particularly important for IBPS PO, SBI PO, and RBI Grade B examinations.`,
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
      content: `The Union Budget 2025-26 presented by the Finance Minister introduces several landmark initiatives and fiscal measures that are expected to feature prominently in competitive examinations.

**Budget Highlights:**

1. **Fiscal Deficit Target**: The government aims to contain fiscal deficit at 5.1% of GDP, continuing the path of fiscal consolidation.

2. **Capital Expenditure**: A significant increase in capex allocation focusing on infrastructure development.

3. **Tax Reforms**: 
   - New income tax slabs under the new regime
   - Corporate tax incentives for green manufacturing
   - Changes in GST structure for specific sectors

4. **Sector-wise Allocations**:
   - Education: Increased allocation for skill development
   - Healthcare: National Health Mission expansion
   - Defence: Modernization of armed forces
   - Agriculture: PM-KISAN enhancement

**Key Schemes Announced:**
- New employment generation scheme
- Green energy transition fund
- Digital infrastructure initiative
- Rural development program

This budget analysis is essential for UPSC, SSC CGL, and banking examinations.`,
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
      content: `The National Education Policy (NEP) 2020 continues to evolve with new implementation updates that are relevant for state-level competitive examinations.

**Recent Updates:**

1. **Academic Bank of Credits**: Implementation status across universities
2. **Four-Year Undergraduate Programs**: Rollout in central universities
3. **Vocational Education Integration**: New guidelines for schools
4. **Digital Learning Initiatives**: PM eVIDYA expansion

Important for TNPSC, UPPSC, MPPSC, and other state PSC examinations.`,
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
      content: `The Defence Acquisition Council (DAC) has approved several significant projects aimed at modernizing India's armed forces.

**Approved Projects:**
1. Advanced fighter aircraft indigenous development
2. Naval vessel construction program
3. Artillery modernization phase II
4. Cyber defence infrastructure upgrade

Total value: ₹10,000 crores

Essential reading for NDA, CDS, and UPSC defence-related questions.`,
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
      content: `Securities and Exchange Board of India (SEBI) has introduced comprehensive new regulations for market intermediaries.

**Key Regulations:**
1. Enhanced disclosure requirements for mutual funds
2. New framework for Alternative Investment Funds
3. Updated guidelines for stock brokers
4. ESG reporting mandates for listed companies

Critical for SEBI Grade A and RBI Grade B examinations.`,
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
      content: `India has signed a landmark Free Trade Agreement (FTA) with the European Union, marking a significant milestone in bilateral trade relations.

**Agreement Highlights:**
1. Tariff reduction on 90% of goods
2. Services sector liberalization
3. Investment protection clauses
4. Intellectual property framework

Expected to boost bilateral trade to $250 billion by 2030.`,
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
      content: `Indian Space Research Organisation (ISRO) has successfully launched GSAT-24, a communication satellite, from Satish Dhawan Space Centre.

**Mission Details:**
- Launch Vehicle: GSLV Mk III
- Orbit: Geostationary Transfer Orbit
- Mission Life: 15 years
- Coverage: Pan-India

This mission strengthens India's communication infrastructure and demonstrates indigenous space capabilities.`,
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
      content: `The Railway Ministry has announced a comprehensive connectivity enhancement program for the Northeast region.

**Project Highlights:**
1. New Vande Bharat routes
2. Gauge conversion projects
3. Station modernization program
4. Safety infrastructure upgrades

Total investment: ₹25,000 crores over 5 years.`,
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
      content: `The government has launched Digital India 2.0, the next phase of the flagship digitalization program.

**New Initiatives:**
1. Universal Digital Identity for services
2. AI-powered governance platforms
3. Digital literacy mission expansion
4. Cybersecurity framework enhancement

Aimed at making India a $1 trillion digital economy by 2030.`,
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
      content: `India achieved its best-ever Olympic performance at Paris 2024, winning multiple medals across various disciplines.

**Medal Tally:**
- Gold: Notable achievements in athletics and shooting
- Silver: Strong performances in wrestling and badminton
- Bronze: Multiple medals in boxing and hockey

This represents a significant improvement in India's Olympic performance trajectory.`,
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

  // Bookmark functions
  const toggleBookmark = (articleId: string) => {
    setBookmarkedArticles(prev => {
      const isBookmarked = prev.includes(articleId);
      if (isBookmarked) {
        toast.success('Article removed from bookmarks');
        return prev.filter(id => id !== articleId);
      } else {
        toast.success('Article saved to bookmarks');
        return [...prev, articleId];
      }
    });
  };

  const isBookmarked = (articleId: string) => bookmarkedArticles.includes(articleId);

  const getBookmarkedArticles = () => allArticles.filter(a => bookmarkedArticles.includes(a.id));

  // Digest functions
  const toggleDigestCategory = (categoryId: string) => {
    setDigestPreferences(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(c => c !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const saveDigestPreferences = () => {
    if (digestPreferences.enabled && !digestPreferences.email) {
      toast.error('Please enter your email address');
      return;
    }
    if (digestPreferences.enabled && digestPreferences.categories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }
    localStorage.setItem('digestPreferences', JSON.stringify(digestPreferences));
    toast.success('Daily digest preferences saved!');
    setShowDigestSettings(false);
  };

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

  // Reading Mode Component with Progress Tracking
  const ReadingMode = () => {
    if (!readingArticle) return null;

    const fontFamilyClass = {
      sans: 'font-sans',
      serif: 'font-serif',
      mono: 'font-mono'
    }[readingSettings.fontFamily];

    const currentProgress = getReadingProgress(readingArticle.id);
    const scrollAreaRef = React.useRef<HTMLDivElement>(null);

    // Handle scroll for progress tracking
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight - target.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      updateReadingProgress(readingArticle.id, progress, scrollTop);
    };

    // Resume from last position on mount
    React.useEffect(() => {
      if (scrollAreaRef.current && readingArticle) {
        const savedPosition = getResumePosition(readingArticle.id);
        if (savedPosition > 0) {
          setTimeout(() => {
            if (scrollAreaRef.current) {
              scrollAreaRef.current.scrollTop = savedPosition;
            }
          }, 100);
        }
      }
    }, [readingArticle?.id]);

    return (
      <Dialog open={!!readingArticle} onOpenChange={() => setReadingArticle(null)}>
        <DialogContent 
          className={`max-w-4xl max-h-[90vh] overflow-hidden p-0 ${readingSettings.isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}
        >
          {/* Reading Progress Bar */}
          <div className={`h-1 ${readingSettings.isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${currentProgress}%` }}
            />
          </div>

          {/* Reading Controls */}
          <div className={`sticky top-0 z-10 p-4 border-b flex items-center justify-between ${readingSettings.isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReadingSettings(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }))}
                className={readingSettings.isDarkMode ? 'text-gray-100' : ''}
              >
                {readingSettings.isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReadingSettings(prev => ({ ...prev, fontSize: Math.max(12, prev.fontSize - 2) }))}
                  className={readingSettings.isDarkMode ? 'text-gray-100' : ''}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className={`text-sm min-w-[60px] text-center ${readingSettings.isDarkMode ? 'text-gray-100' : ''}`}>
                  {readingSettings.fontSize}px
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReadingSettings(prev => ({ ...prev, fontSize: Math.min(24, prev.fontSize + 2) }))}
                  className={readingSettings.isDarkMode ? 'text-gray-100' : ''}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-1 border rounded-lg p-1">
                {(['sans', 'serif', 'mono'] as const).map(font => (
                  <Button
                    key={font}
                    variant={readingSettings.fontFamily === font ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setReadingSettings(prev => ({ ...prev, fontFamily: font }))}
                    className={`text-xs ${readingSettings.isDarkMode && readingSettings.fontFamily !== font ? 'text-gray-100' : ''}`}
                  >
                    {font.charAt(0).toUpperCase() + font.slice(1)}
                  </Button>
                ))}
              </div>

              {/* Progress indicator */}
              <span className={`text-xs ${readingSettings.isDarkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                {Math.round(currentProgress)}% read
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Audio Narration Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleNarration(readingArticle)}
                className={`${readingSettings.isDarkMode ? 'text-gray-100' : ''} ${isNarrating && narrationArticleId === readingArticle.id ? 'text-primary' : ''}`}
              >
                {isNarrating && narrationArticleId === readingArticle.id ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              {/* Mark as Read Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { markAsRead(readingArticle.id); }}
                className={`${readingSettings.isDarkMode ? 'text-gray-100' : ''} ${getReadingProgress(readingArticle.id) >= 100 ? 'text-green-500' : ''}`}
                title="Mark as Read"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShareArticle(readingArticle)}
                className={readingSettings.isDarkMode ? 'text-gray-100' : ''}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleBookmark(readingArticle.id)}
                className={readingSettings.isDarkMode ? 'text-gray-100' : ''}
              >
                {isBookmarked(readingArticle.id) ? (
                  <BookmarkCheck className="h-4 w-4 text-primary" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { stopNarration(); setReadingArticle(null); }}
                className={readingSettings.isDarkMode ? 'text-gray-100' : ''}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Article Content */}
          <div 
            ref={scrollAreaRef}
            className="h-[calc(90vh-100px)] overflow-y-auto"
            onScroll={handleScroll}
          >
            <div className="p-8">
              {readingArticle.image && (
                <img 
                  src={readingArticle.image} 
                  alt={readingArticle.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">{readingArticle.category}</Badge>
                {getImportanceBadge(readingArticle.importance)}
              </div>

              <h1 
                className={`text-3xl font-bold mb-4 ${fontFamilyClass}`}
                style={{ fontSize: readingSettings.fontSize + 8 }}
              >
                {readingArticle.title}
              </h1>

              <div className={`flex items-center gap-4 mb-6 text-sm ${readingSettings.isDarkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {readingArticle.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {readingArticle.readTime}
                </span>
              </div>

              <div 
                className={`prose max-w-none ${readingSettings.isDarkMode ? 'prose-invert' : ''} ${fontFamilyClass}`}
                style={{ 
                  fontSize: readingSettings.fontSize,
                  lineHeight: readingSettings.lineHeight
                }}
              >
                {readingArticle.content?.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4 whitespace-pre-wrap">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t">
                {readingArticle.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>

              {readingArticle.hasQuiz && (
                <Card className={`mt-6 ${readingSettings.isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Test Your Knowledge</p>
                        <p className={`text-sm ${readingSettings.isDarkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                          {readingArticle.quizQuestions} questions available
                        </p>
                      </div>
                    </div>
                    <Button>Start Quiz</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Share Dialog Component
  const ShareDialog = () => {
    if (!shareArticle) return null;

    return (
      <Dialog open={!!shareArticle} onOpenChange={() => setShareArticle(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share Article
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground line-clamp-2">{shareArticle.title}</p>
            
            {/* Social Share Buttons */}
            <div className="grid grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-blue-50 hover:border-blue-500"
                onClick={() => shareToSocial('twitter', shareArticle)}
              >
                <Twitter className="h-5 w-5 text-blue-400" />
                <span className="text-xs">Twitter</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-blue-50 hover:border-blue-700"
                onClick={() => shareToSocial('facebook', shareArticle)}
              >
                <Facebook className="h-5 w-5 text-blue-600" />
                <span className="text-xs">Facebook</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-blue-50 hover:border-blue-600"
                onClick={() => shareToSocial('linkedin', shareArticle)}
              >
                <Linkedin className="h-5 w-5 text-blue-700" />
                <span className="text-xs">LinkedIn</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-green-50 hover:border-green-500"
                onClick={() => shareToSocial('whatsapp', shareArticle)}
              >
                <MessageCircle className="h-5 w-5 text-green-500" />
                <span className="text-xs">WhatsApp</span>
              </Button>
            </div>

            {/* Copy Link */}
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Link2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm truncate flex-1">{getShareUrl(shareArticle)}</span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => copyToClipboard(getShareUrl(shareArticle))}
                className="flex-shrink-0"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Topic View Dialog - Shows all articles in a topic in one page view
  const TopicViewDialog = () => {
    if (!topicViewArticles || topicViewArticles.length === 0) return null;

    return (
      <Dialog open={!!topicViewArticles} onOpenChange={() => setTopicViewArticles(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Hash className="h-6 w-6 text-primary" />
              {topicViewName}
              <Badge variant="secondary" className="ml-2">{topicViewArticles.length} articles</Badge>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(90vh-120px)]">
            <div className="p-6 space-y-8">
              {topicViewArticles.map((article, idx) => {
                const progress = getReadingProgress(article.id);
                const isCurrentlyNarrating = isNarrating && narrationArticleId === article.id;
                return (
                  <div 
                    key={article.id}
                    className="pb-8 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl font-bold text-primary/30 flex-shrink-0">{idx + 1}</span>
                      <div className="flex-1">
                        {/* Article Header */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {getImportanceBadge(article.importance)}
                          <Badge variant="outline">{article.category}</Badge>
                          {article.hasQuiz && (
                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Quiz Available
                            </Badge>
                          )}
                          {progress >= 100 && (
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Read
                            </Badge>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-semibold mb-2">{article.title}</h3>

                        {/* Meta info */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {article.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {article.readTime}
                          </span>
                        </div>

                        {/* Image */}
                        {article.image && (
                          <img 
                            src={article.image} 
                            alt={article.title}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                        )}

                        {/* Content */}
                        <div className="prose max-w-none text-sm">
                          {article.content?.split('\n').map((paragraph, pIdx) => (
                            <p key={pIdx} className="mb-3 whitespace-pre-wrap text-muted-foreground">
                              {paragraph}
                            </p>
                          ))}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-4">
                          {article.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleNarration(article)}
                            className={isCurrentlyNarrating ? 'text-primary border-primary' : ''}
                          >
                            {isCurrentlyNarrating ? (
                              <>
                                <VolumeX className="h-4 w-4 mr-2" />
                                Stop Audio
                              </>
                            ) : (
                              <>
                                <Volume2 className="h-4 w-4 mr-2" />
                                Listen
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(article.id)}
                            className={progress >= 100 ? 'text-green-500 border-green-500' : ''}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            {progress >= 100 ? 'Read' : 'Mark as Read'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleBookmark(article.id)}
                          >
                            {isBookmarked(article.id) ? (
                              <BookmarkCheck className="h-4 w-4 mr-2 text-primary" />
                            ) : (
                              <Bookmark className="h-4 w-4 mr-2" />
                            )}
                            {isBookmarked(article.id) ? 'Saved' : 'Save'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShareArticle(article)}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  };

  // Bookmarks Sheet Component
  const BookmarksSheet = () => (
    <Sheet open={showBookmarks} onOpenChange={setShowBookmarks}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Saved Articles ({bookmarkedArticles.length})
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-6">
          {getBookmarkedArticles().length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No saved articles yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Click the bookmark icon on any article to save it for later
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {getBookmarkedArticles().map(article => (
                <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {article.image && (
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 
                            className="font-semibold line-clamp-2 cursor-pointer hover:text-primary"
                            onClick={() => {
                              setReadingArticle(article);
                              setShowBookmarks(false);
                            }}
                          >
                            {article.title}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBookmark(article.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">{article.category}</Badge>
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  // Daily Digest Settings Dialog
  const DigestSettingsDialog = () => (
    <Dialog open={showDigestSettings} onOpenChange={setShowDigestSettings}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Daily Digest Settings
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Enable Daily Digest</Label>
              <p className="text-sm text-muted-foreground">Get curated news delivered to your inbox</p>
            </div>
            <Switch
              checked={digestPreferences.enabled}
              onCheckedChange={(checked) => setDigestPreferences(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          {digestPreferences.enabled && (
            <>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={digestPreferences.email}
                  onChange={(e) => setDigestPreferences(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Frequency</Label>
                <div className="flex gap-2">
                  <Button
                    variant={digestPreferences.frequency === 'daily' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDigestPreferences(prev => ({ ...prev, frequency: 'daily' }))}
                  >
                    Daily
                  </Button>
                  <Button
                    variant={digestPreferences.frequency === 'weekly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDigestPreferences(prev => ({ ...prev, frequency: 'weekly' }))}
                  >
                    Weekly
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Select Categories</Label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.filter(c => c.id !== 'All').map(category => (
                    <div
                      key={category.id}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        digestPreferences.categories.includes(category.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => toggleDigestCategory(category.id)}
                    >
                      <Checkbox
                        checked={digestPreferences.categories.includes(category.id)}
                        onCheckedChange={() => toggleDigestCategory(category.id)}
                      />
                      <span className="text-sm">{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Button className="w-full" onClick={saveDigestPreferences}>
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredArticles.map((article, idx) => {
        const progress = getReadingProgress(article.id);
        return (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden relative">
              {/* Reading Progress Bar */}
              {progress > 0 && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Badge variant="outline">{article.category}</Badge>
                  {getImportanceBadge(article.importance)}
                  {progress >= 100 && (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Read
                    </Badge>
                  )}
                  {article.hasQuiz && (
                    <Badge className="bg-primary/10 text-primary border-primary/20 ml-auto">
                      <Zap className="h-3 w-3 mr-1" />
                      Quiz
                    </Badge>
                  )}
                </div>
                <h3 
                  className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2"
                  onClick={() => setReadingArticle(article)}
                >
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
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {article.readTime}
                    </span>
                    {progress > 0 && progress < 100 && (
                      <span className="text-xs text-primary">{Math.round(progress)}% read</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => { e.stopPropagation(); toggleNarration(article); }}
                      title="Listen"
                    >
                      {isNarrating && narrationArticleId === article.id ? (
                        <VolumeX className="h-4 w-4 text-primary" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => { e.stopPropagation(); markAsRead(article.id); }}
                      title="Mark as Read"
                    >
                      <Check className={`h-4 w-4 ${progress >= 100 ? 'text-green-500' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => { e.stopPropagation(); setShareArticle(article); }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => { e.stopPropagation(); toggleBookmark(article.id); }}
                    >
                      {isBookmarked(article.id) ? (
                        <BookmarkCheck className="h-4 w-4 text-primary" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setReadingArticle(article)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
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
            <div className="relative h-48 overflow-hidden" onClick={() => setReadingArticle(article)}>
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
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-3 left-3 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                onClick={(e) => { e.stopPropagation(); toggleBookmark(article.id); }}
              >
                {isBookmarked(article.id) ? (
                  <BookmarkCheck className="h-4 w-4 text-primary" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            </div>
            <CardContent className="p-4">
              <h3 
                className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2"
                onClick={() => setReadingArticle(article)}
              >
                {article.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{article.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {article.readTime}
                </span>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto text-primary"
                  onClick={() => setReadingArticle(article)}
                >
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
              <div 
                className="hidden sm:block w-32 h-24 rounded-lg overflow-hidden flex-shrink-0"
                onClick={() => setReadingArticle(article)}
              >
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
                <h3 
                  className="font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-1"
                  onClick={() => setReadingArticle(article)}
                >
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
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); toggleBookmark(article.id); }}
                >
                  {isBookmarked(article.id) ? (
                    <BookmarkCheck className="h-5 w-5 text-primary" />
                  ) : (
                    <Bookmark className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground"
                  onClick={() => setReadingArticle(article)}
                >
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
                <p className="text-muted-foreground text-sm">Click on a topic to view all articles in one page</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {topics.map(topic => (
                <Button
                  key={topic}
                  variant={expandedTopic === topic ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (groupedArticles[topic] && groupedArticles[topic].length > 0) {
                      openTopicView(topic, groupedArticles[topic]);
                    } else {
                      toast.info(`No articles found for ${topic}`);
                    }
                  }}
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
          <Card key={topic} className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-primary" />
                  {topic}
                  <Badge variant="secondary">{articles.length} articles</Badge>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => openTopicView(topic, articles)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Read All ({articles.length})
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {articles.map((article, idx) => {
                  const progress = getReadingProgress(article.id);
                  return (
                    <div 
                      key={article.id}
                      className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer group relative overflow-hidden"
                      onClick={() => setReadingArticle(article)}
                    >
                      {/* Reading Progress Indicator */}
                      {progress > 0 && (
                        <div 
                          className="absolute left-0 top-0 h-full bg-primary/10 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      )}
                      <div className="flex items-start gap-4 relative z-10">
                        <div className="flex flex-col items-center">
                          <span className="text-2xl font-bold text-primary/30">{idx + 1}</span>
                          {progress > 0 && (
                            <span className="text-xs text-primary mt-1">{Math.round(progress)}%</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {getImportanceBadge(article.importance)}
                            {article.hasQuiz && (
                              <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Quiz Available
                              </Badge>
                            )}
                            {progress >= 100 && (
                              <Badge className="bg-primary/10 text-primary border-primary/20">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Read
                              </Badge>
                            )}
                            {progress > 0 && progress < 100 && (
                              <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                <Clock className="h-3 w-3 mr-1" />
                                Continue Reading
                              </Badge>
                            )}
                            <div className="ml-auto flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={(e) => { e.stopPropagation(); setShareArticle(article); }}
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={(e) => { e.stopPropagation(); toggleBookmark(article.id); }}
                              >
                                {isBookmarked(article.id) ? (
                                  <BookmarkCheck className="h-4 w-4 text-primary" />
                                ) : (
                                  <Bookmark className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
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
                          
                          {article.relatedIds.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-border/50">
                              <p className="text-xs text-muted-foreground mb-2">Related News:</p>
                              <div className="flex flex-wrap gap-2">
                                {getRelatedArticles(article).map(related => (
                                  <Badge 
                                    key={related.id} 
                                    variant="outline" 
                                    className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                                    onClick={(e) => { e.stopPropagation(); setReadingArticle(related); }}
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
                  );
                })}
              </CardContent>
            </Card>
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
            
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-muted/50"
                />
              </div>
              
              {/* Bookmark Button */}
              <Button variant="outline" onClick={() => setShowBookmarks(true)} className="gap-2">
                <Bookmark className="h-4 w-4" />
                Saved
                {bookmarkedArticles.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{bookmarkedArticles.length}</Badge>
                )}
              </Button>

              {/* Digest Settings Button */}
              <Button variant="outline" onClick={() => setShowDigestSettings(true)} className="gap-2">
                <Mail className="h-4 w-4" />
                Daily Digest
                {digestPreferences.enabled && (
                  <span className="h-2 w-2 bg-green-500 rounded-full" />
                )}
              </Button>
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

      {/* Reading Mode Dialog */}
      <ReadingMode />
      
      {/* Share Dialog */}
      <ShareDialog />

      {/* Topic View Dialog */}
      <TopicViewDialog />
      
      {/* Bookmarks Sheet */}
      <BookmarksSheet />
      
      {/* Digest Settings Dialog */}
      <DigestSettingsDialog />
      
      <Footer />
    </div>
  );
};

export default CurrentAffairs;
