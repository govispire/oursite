import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useExamCategoryContext } from '@/contexts/ExamCategoryContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Search, ChevronRight, ChevronDown, Play, FileText, ClipboardCheck,
  Download, Star, Clock, Users, CheckCircle, Video, File, Target, Award,
  GraduationCap, Lightbulb, TrendingUp, Lock, Pause, Volume2, VolumeX, 
  Maximize, SkipBack, SkipForward, Settings, X, ThumbsUp, Share2, Bookmark,
  MessageSquare, List, ChevronLeft
} from 'lucide-react';

interface VideoResource {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  rating: number;
  views: string;
  thumbnail: string;
  isCompleted: boolean;
}

interface PDFResource {
  id: string;
  title: string;
  type: 'notes' | 'pyq' | 'formula' | 'summary';
  pages: number;
  size: string;
  downloads: number;
}

interface TestResource {
  id: string;
  title: string;
  questions: number;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  attempts: number;
  avgScore: number;
}

interface Topic {
  id: string;
  name: string;
  progress: number;
  videos: VideoResource[];
  pdfs: PDFResource[];
  tests: TestResource[];
}

interface Subject {
  id: string;
  name: string;
  icon: React.ReactNode;
  topics: Topic[];
  totalProgress: number;
}

const SyllabusPage = () => {
  const navigate = useNavigate();
  const { selectedCategories } = useExamCategoryContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [resourceDialog, setResourceDialog] = useState<{
    isOpen: boolean;
    topic: Topic | null;
    activeTab: 'videos' | 'pdfs' | 'tests';
  }>({ isOpen: false, topic: null, activeTab: 'videos' });
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);
  
  // Video player state
  const [videoPlayer, setVideoPlayer] = useState<{
    isOpen: boolean;
    video: VideoResource | null;
    topic: Topic | null;
    allVideos: VideoResource[];
  }>({ isOpen: false, video: null, topic: null, allVideos: [] });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Sample video URLs (using free sample videos)
  const sampleVideoUrls = [
    'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  ];
  
  const getVideoUrl = (videoId: string) => {
    const index = parseInt(videoId.replace(/\D/g, '')) % sampleVideoUrls.length;
    return sampleVideoUrls[index];
  };
  
  const openVideoPlayer = (video: VideoResource, topic: Topic) => {
    setVideoPlayer({
      isOpen: true,
      video,
      topic,
      allVideos: topic.videos
    });
    setIsPlaying(false);
    setCurrentTime(0);
  };
  
  const closeVideoPlayer = () => {
    setVideoPlayer({ isOpen: false, video: null, topic: null, allVideos: [] });
    setIsPlaying(false);
    setCurrentTime(0);
    setShowSpeedMenu(false);
  };
  
  const playNextVideo = () => {
    if (!videoPlayer.video || !videoPlayer.allVideos.length) return;
    const currentIndex = videoPlayer.allVideos.findIndex(v => v.id === videoPlayer.video?.id);
    const nextIndex = (currentIndex + 1) % videoPlayer.allVideos.length;
    setVideoPlayer(prev => ({ ...prev, video: prev.allVideos[nextIndex] }));
    setCurrentTime(0);
    setIsPlaying(true);
  };
  
  const playPrevVideo = () => {
    if (!videoPlayer.video || !videoPlayer.allVideos.length) return;
    const currentIndex = videoPlayer.allVideos.findIndex(v => v.id === videoPlayer.video?.id);
    const prevIndex = currentIndex === 0 ? videoPlayer.allVideos.length - 1 : currentIndex - 1;
    setVideoPlayer(prev => ({ ...prev, video: prev.allVideos[prevIndex] }));
    setCurrentTime(0);
    setIsPlaying(true);
  };
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 1;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };
  
  const changePlaybackSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };
  
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
    }
  };
  
  useEffect(() => {
    if (videoRef.current && videoPlayer.video) {
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play();
      }
    }
  }, [videoPlayer.video]);

  // Generate mock syllabus data based on selected categories
  const generateSyllabusData = (): Subject[] => {
    const baseSubjects: Subject[] = [
      {
        id: 'quantitative',
        name: 'Quantitative Aptitude',
        icon: <Target className="h-5 w-5" />,
        totalProgress: 45,
        topics: [
          {
            id: 'number-system',
            name: 'Number System',
            progress: 60,
            videos: [
              { id: 'v1', title: 'Number System Basics', instructor: 'Rajesh Kumar', duration: '45 min', rating: 4.8, views: '12K', thumbnail: '', isCompleted: false },
              { id: 'v2', title: 'Divisibility Rules', instructor: 'Priya Sharma', duration: '35 min', rating: 4.7, views: '8K', thumbnail: '', isCompleted: true },
              { id: 'v3', title: 'HCF & LCM Concepts', instructor: 'Amit Verma', duration: '40 min', rating: 4.9, views: '15K', thumbnail: '', isCompleted: false },
              { id: 'v4', title: 'Remainder Theorem', instructor: 'Neha Singh', duration: '50 min', rating: 4.6, views: '6K', thumbnail: '', isCompleted: false },
            ],
            pdfs: [
              { id: 'p1', title: 'Number System Complete Notes', type: 'notes', pages: 45, size: '3.2 MB', downloads: 5420 },
              { id: 'p2', title: 'PYQs 2020-2024', type: 'pyq', pages: 28, size: '2.1 MB', downloads: 8920 },
              { id: 'p3', title: 'Formula Sheet', type: 'formula', pages: 8, size: '0.5 MB', downloads: 12450 },
              { id: 'p4', title: 'Quick Revision Summary', type: 'summary', pages: 12, size: '0.8 MB', downloads: 6780 },
            ],
            tests: [
              { id: 't1', title: 'Number System Basics Test', questions: 20, duration: '15 min', difficulty: 'Easy', attempts: 1240, avgScore: 72 },
              { id: 't2', title: 'Advanced Number System', questions: 30, duration: '25 min', difficulty: 'Medium', attempts: 890, avgScore: 65 },
              { id: 't3', title: 'HCF & LCM Practice', questions: 25, duration: '20 min', difficulty: 'Medium', attempts: 1560, avgScore: 68 },
              { id: 't4', title: 'Number System Master Test', questions: 50, duration: '45 min', difficulty: 'Hard', attempts: 450, avgScore: 58 },
            ]
          },
          {
            id: 'percentage',
            name: 'Percentage',
            progress: 80,
            videos: [
              { id: 'v5', title: 'Percentage Fundamentals', instructor: 'Rajesh Kumar', duration: '40 min', rating: 4.9, views: '18K', thumbnail: '', isCompleted: true },
              { id: 'v6', title: 'Successive Percentage', instructor: 'Priya Sharma', duration: '30 min', rating: 4.8, views: '10K', thumbnail: '', isCompleted: true },
              { id: 'v7', title: 'Percentage Problems', instructor: 'Amit Verma', duration: '45 min', rating: 4.7, views: '14K', thumbnail: '', isCompleted: false },
              { id: 'v8', title: 'Advanced Applications', instructor: 'Neha Singh', duration: '55 min', rating: 4.6, views: '7K', thumbnail: '', isCompleted: false },
            ],
            pdfs: [
              { id: 'p5', title: 'Percentage Complete Notes', type: 'notes', pages: 35, size: '2.8 MB', downloads: 6230 },
              { id: 'p6', title: 'PYQs 2020-2024', type: 'pyq', pages: 22, size: '1.8 MB', downloads: 7540 },
              { id: 'p7', title: 'Formula Sheet', type: 'formula', pages: 5, size: '0.3 MB', downloads: 9820 },
              { id: 'p8', title: 'Quick Revision Summary', type: 'summary', pages: 10, size: '0.6 MB', downloads: 5430 },
            ],
            tests: [
              { id: 't5', title: 'Percentage Basics', questions: 20, duration: '15 min', difficulty: 'Easy', attempts: 1890, avgScore: 75 },
              { id: 't6', title: 'Percentage Advanced', questions: 25, duration: '20 min', difficulty: 'Medium', attempts: 1120, avgScore: 68 },
              { id: 't7', title: 'Mixed Problems', questions: 30, duration: '25 min', difficulty: 'Medium', attempts: 780, avgScore: 62 },
              { id: 't8', title: 'Percentage Master Test', questions: 40, duration: '35 min', difficulty: 'Hard', attempts: 340, avgScore: 55 },
            ]
          },
          {
            id: 'profit-loss',
            name: 'Profit & Loss',
            progress: 35,
            videos: [
              { id: 'v9', title: 'P&L Basics', instructor: 'Rajesh Kumar', duration: '50 min', rating: 4.8, views: '16K', thumbnail: '', isCompleted: false },
              { id: 'v10', title: 'Discount Concepts', instructor: 'Priya Sharma', duration: '35 min', rating: 4.7, views: '9K', thumbnail: '', isCompleted: false },
              { id: 'v11', title: 'Marked Price Problems', instructor: 'Amit Verma', duration: '45 min', rating: 4.9, views: '11K', thumbnail: '', isCompleted: false },
              { id: 'v12', title: 'Partnership Problems', instructor: 'Neha Singh', duration: '40 min', rating: 4.6, views: '5K', thumbnail: '', isCompleted: false },
            ],
            pdfs: [
              { id: 'p9', title: 'Profit & Loss Notes', type: 'notes', pages: 40, size: '3.0 MB', downloads: 4890 },
              { id: 'p10', title: 'PYQs 2020-2024', type: 'pyq', pages: 25, size: '2.0 MB', downloads: 6780 },
              { id: 'p11', title: 'Formula Sheet', type: 'formula', pages: 6, size: '0.4 MB', downloads: 8540 },
              { id: 'p12', title: 'Quick Revision', type: 'summary', pages: 11, size: '0.7 MB', downloads: 4320 },
            ],
            tests: [
              { id: 't9', title: 'P&L Fundamentals', questions: 20, duration: '15 min', difficulty: 'Easy', attempts: 1450, avgScore: 70 },
              { id: 't10', title: 'Discount Problems', questions: 25, duration: '20 min', difficulty: 'Medium', attempts: 980, avgScore: 64 },
              { id: 't11', title: 'Mixed P&L Test', questions: 30, duration: '25 min', difficulty: 'Medium', attempts: 650, avgScore: 60 },
              { id: 't12', title: 'P&L Master Test', questions: 45, duration: '40 min', difficulty: 'Hard', attempts: 280, avgScore: 52 },
            ]
          },
          {
            id: 'time-work',
            name: 'Time & Work',
            progress: 20,
            videos: [
              { id: 'v13', title: 'Time & Work Basics', instructor: 'Rajesh Kumar', duration: '45 min', rating: 4.8, views: '14K', thumbnail: '', isCompleted: false },
              { id: 'v14', title: 'Pipes & Cisterns', instructor: 'Priya Sharma', duration: '40 min', rating: 4.7, views: '8K', thumbnail: '', isCompleted: false },
              { id: 'v15', title: 'Work Efficiency', instructor: 'Amit Verma', duration: '35 min', rating: 4.9, views: '10K', thumbnail: '', isCompleted: false },
              { id: 'v16', title: 'Advanced Problems', instructor: 'Neha Singh', duration: '50 min', rating: 4.6, views: '6K', thumbnail: '', isCompleted: false },
            ],
            pdfs: [
              { id: 'p13', title: 'Time & Work Notes', type: 'notes', pages: 38, size: '2.9 MB', downloads: 5120 },
              { id: 'p14', title: 'PYQs 2020-2024', type: 'pyq', pages: 24, size: '1.9 MB', downloads: 6340 },
              { id: 'p15', title: 'Formula Sheet', type: 'formula', pages: 7, size: '0.4 MB', downloads: 7890 },
              { id: 'p16', title: 'Quick Revision', type: 'summary', pages: 9, size: '0.5 MB', downloads: 4560 },
            ],
            tests: [
              { id: 't13', title: 'Time & Work Basics', questions: 20, duration: '15 min', difficulty: 'Easy', attempts: 1320, avgScore: 68 },
              { id: 't14', title: 'Pipes & Cisterns', questions: 25, duration: '20 min', difficulty: 'Medium', attempts: 870, avgScore: 62 },
              { id: 't15', title: 'Work Problems', questions: 30, duration: '25 min', difficulty: 'Medium', attempts: 560, avgScore: 58 },
              { id: 't16', title: 'Time & Work Master', questions: 40, duration: '35 min', difficulty: 'Hard', attempts: 220, avgScore: 50 },
            ]
          },
        ]
      },
      {
        id: 'reasoning',
        name: 'Logical Reasoning',
        icon: <Lightbulb className="h-5 w-5" />,
        totalProgress: 55,
        topics: [
          {
            id: 'puzzles',
            name: 'Puzzles & Seating Arrangement',
            progress: 70,
            videos: [
              { id: 'rv1', title: 'Linear Arrangement', instructor: 'Sanjay Mehta', duration: '55 min', rating: 4.9, views: '22K', thumbnail: '', isCompleted: true },
              { id: 'rv2', title: 'Circular Seating', instructor: 'Kavita Joshi', duration: '45 min', rating: 4.8, views: '18K', thumbnail: '', isCompleted: false },
              { id: 'rv3', title: 'Floor-based Puzzles', instructor: 'Rohit Gupta', duration: '50 min', rating: 4.7, views: '15K', thumbnail: '', isCompleted: false },
              { id: 'rv4', title: 'Advanced Puzzles', instructor: 'Anita Rao', duration: '60 min', rating: 4.9, views: '12K', thumbnail: '', isCompleted: false },
            ],
            pdfs: [
              { id: 'rp1', title: 'Puzzles Complete Notes', type: 'notes', pages: 55, size: '4.2 MB', downloads: 8920 },
              { id: 'rp2', title: 'PYQs 2020-2024', type: 'pyq', pages: 35, size: '2.8 MB', downloads: 11540 },
              { id: 'rp3', title: 'Shortcuts & Tricks', type: 'formula', pages: 12, size: '0.8 MB', downloads: 14230 },
              { id: 'rp4', title: 'Quick Revision', type: 'summary', pages: 15, size: '1.0 MB', downloads: 7890 },
            ],
            tests: [
              { id: 'rt1', title: 'Linear Puzzles', questions: 15, duration: '20 min', difficulty: 'Easy', attempts: 2140, avgScore: 70 },
              { id: 'rt2', title: 'Circular Arrangement', questions: 20, duration: '25 min', difficulty: 'Medium', attempts: 1560, avgScore: 62 },
              { id: 'rt3', title: 'Mixed Puzzles', questions: 25, duration: '35 min', difficulty: 'Hard', attempts: 890, avgScore: 55 },
              { id: 'rt4', title: 'Puzzle Master Test', questions: 30, duration: '45 min', difficulty: 'Hard', attempts: 420, avgScore: 48 },
            ]
          },
          {
            id: 'syllogism',
            name: 'Syllogism',
            progress: 50,
            videos: [
              { id: 'rv5', title: 'Syllogism Basics', instructor: 'Sanjay Mehta', duration: '40 min', rating: 4.8, views: '16K', thumbnail: '', isCompleted: true },
              { id: 'rv6', title: 'Possibility Cases', instructor: 'Kavita Joshi', duration: '35 min', rating: 4.7, views: '12K', thumbnail: '', isCompleted: false },
              { id: 'rv7', title: 'Advanced Syllogism', instructor: 'Rohit Gupta', duration: '45 min', rating: 4.9, views: '9K', thumbnail: '', isCompleted: false },
              { id: 'rv8', title: 'Coded Syllogism', instructor: 'Anita Rao', duration: '50 min', rating: 4.6, views: '7K', thumbnail: '', isCompleted: false },
            ],
            pdfs: [
              { id: 'rp5', title: 'Syllogism Notes', type: 'notes', pages: 30, size: '2.4 MB', downloads: 6540 },
              { id: 'rp6', title: 'PYQs 2020-2024', type: 'pyq', pages: 20, size: '1.6 MB', downloads: 8760 },
              { id: 'rp7', title: 'Rules & Tricks', type: 'formula', pages: 8, size: '0.5 MB', downloads: 10230 },
              { id: 'rp8', title: 'Quick Revision', type: 'summary', pages: 10, size: '0.6 MB', downloads: 5430 },
            ],
            tests: [
              { id: 'rt5', title: 'Syllogism Basics', questions: 20, duration: '15 min', difficulty: 'Easy', attempts: 1890, avgScore: 72 },
              { id: 'rt6', title: 'Possibility Based', questions: 25, duration: '20 min', difficulty: 'Medium', attempts: 1230, avgScore: 65 },
              { id: 'rt7', title: 'Advanced Syllogism', questions: 30, duration: '25 min', difficulty: 'Medium', attempts: 780, avgScore: 58 },
              { id: 'rt8', title: 'Syllogism Master', questions: 35, duration: '30 min', difficulty: 'Hard', attempts: 340, avgScore: 52 },
            ]
          },
          {
            id: 'coding-decoding',
            name: 'Coding-Decoding',
            progress: 40,
            videos: [
              { id: 'rv9', title: 'Letter Coding', instructor: 'Sanjay Mehta', duration: '35 min', rating: 4.7, views: '14K', thumbnail: '', isCompleted: false },
              { id: 'rv10', title: 'Number Coding', instructor: 'Kavita Joshi', duration: '30 min', rating: 4.8, views: '11K', thumbnail: '', isCompleted: false },
              { id: 'rv11', title: 'Mixed Coding', instructor: 'Rohit Gupta', duration: '40 min', rating: 4.6, views: '8K', thumbnail: '', isCompleted: false },
              { id: 'rv12', title: 'Sentence Coding', instructor: 'Anita Rao', duration: '45 min', rating: 4.9, views: '6K', thumbnail: '', isCompleted: false },
            ],
            pdfs: [
              { id: 'rp9', title: 'Coding-Decoding Notes', type: 'notes', pages: 28, size: '2.2 MB', downloads: 5890 },
              { id: 'rp10', title: 'PYQs 2020-2024', type: 'pyq', pages: 18, size: '1.4 MB', downloads: 7650 },
              { id: 'rp11', title: 'Shortcuts', type: 'formula', pages: 6, size: '0.4 MB', downloads: 8940 },
              { id: 'rp12', title: 'Quick Revision', type: 'summary', pages: 8, size: '0.5 MB', downloads: 4780 },
            ],
            tests: [
              { id: 'rt9', title: 'Coding Basics', questions: 20, duration: '12 min', difficulty: 'Easy', attempts: 1650, avgScore: 74 },
              { id: 'rt10', title: 'Number Coding', questions: 25, duration: '18 min', difficulty: 'Medium', attempts: 1120, avgScore: 66 },
              { id: 'rt11', title: 'Mixed Coding', questions: 30, duration: '22 min', difficulty: 'Medium', attempts: 680, avgScore: 60 },
              { id: 'rt12', title: 'Coding Master', questions: 35, duration: '28 min', difficulty: 'Hard', attempts: 290, avgScore: 54 },
            ]
          },
        ]
      },
      {
        id: 'english',
        name: 'English Language',
        icon: <BookOpen className="h-5 w-5" />,
        totalProgress: 60,
        topics: [
          {
            id: 'reading-comprehension',
            name: 'Reading Comprehension',
            progress: 75,
            videos: [
              { id: 'ev1', title: 'RC Strategies', instructor: 'Maya Patel', duration: '50 min', rating: 4.9, views: '20K', thumbnail: '', isCompleted: true },
              { id: 'ev2', title: 'Inference Questions', instructor: 'John David', duration: '40 min', rating: 4.8, views: '16K', thumbnail: '', isCompleted: true },
              { id: 'ev3', title: 'Vocabulary in Context', instructor: 'Sarah Khan', duration: '35 min', rating: 4.7, views: '12K', thumbnail: '', isCompleted: false },
              { id: 'ev4', title: 'Advanced RC', instructor: 'Ravi Prakash', duration: '55 min', rating: 4.9, views: '9K', thumbnail: '', isCompleted: false },
            ],
            pdfs: [
              { id: 'ep1', title: 'RC Complete Notes', type: 'notes', pages: 50, size: '3.8 MB', downloads: 9450 },
              { id: 'ep2', title: 'PYQs 2020-2024', type: 'pyq', pages: 40, size: '3.2 MB', downloads: 12340 },
              { id: 'ep3', title: 'Strategy Guide', type: 'formula', pages: 10, size: '0.7 MB', downloads: 8670 },
              { id: 'ep4', title: 'Quick Revision', type: 'summary', pages: 14, size: '0.9 MB', downloads: 6230 },
            ],
            tests: [
              { id: 'et1', title: 'RC Level 1', questions: 15, duration: '20 min', difficulty: 'Easy', attempts: 2340, avgScore: 68 },
              { id: 'et2', title: 'RC Level 2', questions: 20, duration: '30 min', difficulty: 'Medium', attempts: 1780, avgScore: 62 },
              { id: 'et3', title: 'RC Level 3', questions: 25, duration: '40 min', difficulty: 'Hard', attempts: 980, avgScore: 55 },
              { id: 'et4', title: 'RC Master Test', questions: 30, duration: '50 min', difficulty: 'Hard', attempts: 520, avgScore: 50 },
            ]
          },
          {
            id: 'grammar',
            name: 'Grammar & Error Spotting',
            progress: 55,
            videos: [
              { id: 'ev5', title: 'Grammar Basics', instructor: 'Maya Patel', duration: '45 min', rating: 4.8, views: '18K', thumbnail: '', isCompleted: true },
              { id: 'ev6', title: 'Common Errors', instructor: 'John David', duration: '35 min', rating: 4.7, views: '14K', thumbnail: '', isCompleted: false },
              { id: 'ev7', title: 'Sentence Correction', instructor: 'Sarah Khan', duration: '40 min', rating: 4.9, views: '11K', thumbnail: '', isCompleted: false },
              { id: 'ev8', title: 'Advanced Grammar', instructor: 'Ravi Prakash', duration: '50 min', rating: 4.6, views: '7K', thumbnail: '', isCompleted: false },
            ],
            pdfs: [
              { id: 'ep5', title: 'Grammar Notes', type: 'notes', pages: 60, size: '4.5 MB', downloads: 11230 },
              { id: 'ep6', title: 'PYQs 2020-2024', type: 'pyq', pages: 35, size: '2.8 MB', downloads: 9870 },
              { id: 'ep7', title: 'Rules Summary', type: 'formula', pages: 15, size: '1.0 MB', downloads: 13450 },
              { id: 'ep8', title: 'Quick Revision', type: 'summary', pages: 12, size: '0.8 MB', downloads: 7560 },
            ],
            tests: [
              { id: 'et5', title: 'Grammar Basics', questions: 25, duration: '15 min', difficulty: 'Easy', attempts: 2120, avgScore: 72 },
              { id: 'et6', title: 'Error Spotting', questions: 30, duration: '20 min', difficulty: 'Medium', attempts: 1560, avgScore: 65 },
              { id: 'et7', title: 'Sentence Correction', questions: 30, duration: '22 min', difficulty: 'Medium', attempts: 890, avgScore: 60 },
              { id: 'et8', title: 'Grammar Master', questions: 40, duration: '30 min', difficulty: 'Hard', attempts: 450, avgScore: 55 },
            ]
          },
        ]
      },
      {
        id: 'general-awareness',
        name: 'General Awareness',
        icon: <GraduationCap className="h-5 w-5" />,
        totalProgress: 40,
        topics: [
          {
            id: 'banking-awareness',
            name: 'Banking Awareness',
            progress: 50,
            videos: [
              { id: 'gv1', title: 'Banking System', instructor: 'Vikram Sharma', duration: '60 min', rating: 4.9, views: '25K', thumbnail: '', isCompleted: true },
              { id: 'gv2', title: 'RBI Functions', instructor: 'Pooja Gupta', duration: '45 min', rating: 4.8, views: '20K', thumbnail: '', isCompleted: false },
              { id: 'gv3', title: 'Financial Institutions', instructor: 'Arjun Kapoor', duration: '50 min', rating: 4.7, views: '16K', thumbnail: '', isCompleted: false },
              { id: 'gv4', title: 'Banking Products', instructor: 'Sneha Rao', duration: '55 min', rating: 4.9, views: '12K', thumbnail: '', isCompleted: false },
            ],
            pdfs: [
              { id: 'gp1', title: 'Banking Awareness Notes', type: 'notes', pages: 70, size: '5.2 MB', downloads: 15670 },
              { id: 'gp2', title: 'PYQs 2020-2024', type: 'pyq', pages: 45, size: '3.5 MB', downloads: 12340 },
              { id: 'gp3', title: 'Key Facts', type: 'formula', pages: 20, size: '1.4 MB', downloads: 18920 },
              { id: 'gp4', title: 'Quick Revision', type: 'summary', pages: 18, size: '1.2 MB', downloads: 9870 },
            ],
            tests: [
              { id: 'gt1', title: 'Banking Basics', questions: 30, duration: '20 min', difficulty: 'Easy', attempts: 2890, avgScore: 70 },
              { id: 'gt2', title: 'RBI & Policy', questions: 35, duration: '25 min', difficulty: 'Medium', attempts: 2120, avgScore: 64 },
              { id: 'gt3', title: 'Financial Sector', questions: 40, duration: '30 min', difficulty: 'Medium', attempts: 1450, avgScore: 58 },
              { id: 'gt4', title: 'Banking Master', questions: 50, duration: '40 min', difficulty: 'Hard', attempts: 780, avgScore: 52 },
            ]
          },
          {
            id: 'current-affairs',
            name: 'Current Affairs',
            progress: 35,
            videos: [
              { id: 'gv5', title: 'Monthly Current Affairs', instructor: 'Vikram Sharma', duration: '90 min', rating: 4.9, views: '35K', thumbnail: '', isCompleted: false },
              { id: 'gv6', title: 'Economy Updates', instructor: 'Pooja Gupta', duration: '45 min', rating: 4.8, views: '22K', thumbnail: '', isCompleted: false },
              { id: 'gv7', title: 'National Events', instructor: 'Arjun Kapoor', duration: '40 min', rating: 4.7, views: '18K', thumbnail: '', isCompleted: false },
              { id: 'gv8', title: 'International Affairs', instructor: 'Sneha Rao', duration: '50 min', rating: 4.9, views: '14K', thumbnail: '', isCompleted: false },
            ],
            pdfs: [
              { id: 'gp5', title: 'Monthly CA Capsule', type: 'notes', pages: 85, size: '6.5 MB', downloads: 22340 },
              { id: 'gp6', title: 'PYQs 2020-2024', type: 'pyq', pages: 50, size: '4.0 MB', downloads: 15670 },
              { id: 'gp7', title: 'Key Highlights', type: 'formula', pages: 25, size: '1.8 MB', downloads: 19450 },
              { id: 'gp8', title: 'One-liner Facts', type: 'summary', pages: 30, size: '2.0 MB', downloads: 12890 },
            ],
            tests: [
              { id: 'gt5', title: 'Weekly CA Quiz', questions: 25, duration: '15 min', difficulty: 'Easy', attempts: 3450, avgScore: 68 },
              { id: 'gt6', title: 'Monthly CA Test', questions: 50, duration: '35 min', difficulty: 'Medium', attempts: 2780, avgScore: 62 },
              { id: 'gt7', title: 'Last 6 Months CA', questions: 75, duration: '50 min', difficulty: 'Medium', attempts: 1890, avgScore: 56 },
              { id: 'gt8', title: 'CA Master Test', questions: 100, duration: '60 min', difficulty: 'Hard', attempts: 980, avgScore: 50 },
            ]
          },
        ]
      },
    ];

    return baseSubjects;
  };

  const syllabusData = generateSyllabusData();

  const filteredSubjects = syllabusData.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.topics.some(topic => topic.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleVideoComplete = (videoId: string) => {
    setCompletedVideos(prev => {
      if (prev.includes(videoId)) {
        return prev.filter(id => id !== videoId);
      }
      return [...prev, videoId];
    });
    toast.success('Video marked as completed!');
  };

  const handleDownloadPDF = (pdf: PDFResource) => {
    toast.success(`Downloading ${pdf.title}...`);
  };

  const handleStartTest = (test: TestResource) => {
    navigate('/student/tests');
    toast.success(`Starting ${test.title}...`);
  };

  const openResourceDialog = (topic: Topic, tab: 'videos' | 'pdfs' | 'tests') => {
    setResourceDialog({ isOpen: true, topic, activeTab: tab });
  };

  const getPDFTypeColor = (type: string) => {
    switch (type) {
      case 'notes': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'pyq': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'formula': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'summary': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-500/10 text-emerald-600';
      case 'Medium': return 'bg-amber-500/10 text-amber-600';
      case 'Hard': return 'bg-red-500/10 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const totalTopics = syllabusData.reduce((acc, subject) => acc + subject.topics.length, 0);
  const completedTopics = syllabusData.reduce((acc, subject) => 
    acc + subject.topics.filter(t => t.progress >= 100).length, 0);
  const overallProgress = Math.round(syllabusData.reduce((acc, s) => acc + s.totalProgress, 0) / syllabusData.length);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Know Your Syllabus
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your progress and access resources for each topic
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subjects or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{syllabusData.length}</div>
            <div className="text-xs text-muted-foreground">Subjects</div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{totalTopics}</div>
            <div className="text-xs text-muted-foreground">Topics</div>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{completedTopics}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card className="bg-sky-500/5 border-sky-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-sky-600">{overallProgress}%</div>
            <div className="text-xs text-muted-foreground">Overall</div>
          </CardContent>
        </Card>
      </div>

      {/* Subjects */}
      <div className="space-y-4">
        {filteredSubjects.map((subject) => (
          <Card key={subject.id} className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer hover:bg-muted/50 transition-colors py-4"
              onClick={() => setExpandedSubject(expandedSubject === subject.id ? null : subject.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {subject.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{subject.topics.length} topics</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium">{subject.totalProgress}% Complete</div>
                    <Progress value={subject.totalProgress} className="w-24 h-2 mt-1" />
                  </div>
                  {expandedSubject === subject.id ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            {expandedSubject === subject.id && (
              <CardContent className="border-t pt-4 space-y-3">
                {subject.topics.map((topic) => (
                  <div 
                    key={topic.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{topic.name}</h4>
                        {topic.progress >= 100 && (
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          {topic.videos.length} Videos
                        </span>
                        <span className="flex items-center gap-1">
                          <File className="h-3 w-3" />
                          {topic.pdfs.length} PDFs
                        </span>
                        <span className="flex items-center gap-1">
                          <ClipboardCheck className="h-3 w-3" />
                          {topic.tests.length} Tests
                        </span>
                      </div>
                      <Progress value={topic.progress} className="w-full max-w-xs h-1.5 mt-2" />
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => openResourceDialog(topic, 'videos')}
                      className="gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Resources
                    </Button>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Resource Dialog */}
      <Dialog open={resourceDialog.isOpen} onOpenChange={(open) => !open && setResourceDialog({ isOpen: false, topic: null, activeTab: 'videos' })}>
        <DialogContent className="max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {resourceDialog.topic?.name} - Resources
            </DialogTitle>
          </DialogHeader>
          
          <Tabs value={resourceDialog.activeTab} onValueChange={(v) => setResourceDialog(prev => ({ ...prev, activeTab: v as any }))}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="videos" className="gap-2">
                <Video className="h-4 w-4" />
                Videos ({resourceDialog.topic?.videos.length})
              </TabsTrigger>
              <TabsTrigger value="pdfs" className="gap-2">
                <FileText className="h-4 w-4" />
                PDFs ({resourceDialog.topic?.pdfs.length})
              </TabsTrigger>
              <TabsTrigger value="tests" className="gap-2">
                <ClipboardCheck className="h-4 w-4" />
                Tests ({resourceDialog.topic?.tests.length})
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[50vh] mt-4">
              <TabsContent value="videos" className="space-y-3 m-0">
                {resourceDialog.topic?.videos.map((video) => (
                  <Card 
                    key={video.id} 
                    className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => resourceDialog.topic && openVideoPlayer(video, resourceDialog.topic)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0 relative group">
                        <Play className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{video.title}</h4>
                        <p className="text-sm text-muted-foreground">{video.instructor}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {video.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                            {video.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {video.views}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Checkbox 
                          checked={completedVideos.includes(video.id) || video.isCompleted}
                          onCheckedChange={() => handleVideoComplete(video.id)}
                        />
                        <Button 
                          size="sm" 
                          className="gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            resourceDialog.topic && openVideoPlayer(video, resourceDialog.topic);
                          }}
                        >
                          <Play className="h-4 w-4" />
                          Watch
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="pdfs" className="space-y-3 m-0">
                {resourceDialog.topic?.pdfs.map((pdf) => (
                  <Card key={pdf.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium">{pdf.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={getPDFTypeColor(pdf.type)}>
                              {pdf.type === 'pyq' ? 'PYQs' : pdf.type.charAt(0).toUpperCase() + pdf.type.slice(1)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{pdf.pages} pages • {pdf.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{pdf.downloads.toLocaleString()} downloads</span>
                        <Button size="sm" onClick={() => handleDownloadPDF(pdf)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="tests" className="space-y-3 m-0">
                {resourceDialog.topic?.tests.map((test) => (
                  <Card key={test.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium">{test.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getDifficultyColor(test.difficulty)}>
                              {test.difficulty}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {test.questions} Qs • {test.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <div className="text-xs text-muted-foreground">
                          <div>{test.attempts.toLocaleString()} attempts</div>
                          <div>Avg: {test.avgScore}%</div>
                        </div>
                        <Button size="sm" onClick={() => handleStartTest(test)}>
                          Start
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Video Player Dialog */}
      <Dialog open={videoPlayer.isOpen} onOpenChange={(open) => !open && closeVideoPlayer()}>
        <DialogContent className="max-w-6xl max-h-[95vh] p-0 overflow-hidden">
          <div className="flex flex-col lg:flex-row h-[85vh]">
            {/* Main Video Section */}
            <div className="flex-1 flex flex-col bg-black">
              {/* Video Container */}
              <div className="relative flex-1 flex items-center justify-center bg-black">
                <video
                  ref={videoRef}
                  src={videoPlayer.video ? getVideoUrl(videoPlayer.video.id) : ''}
                  className="w-full h-full object-contain"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => {
                    handleVideoComplete(videoPlayer.video?.id || '');
                    playNextVideo();
                  }}
                  onClick={togglePlay}
                />
                
                {/* Play/Pause Overlay */}
                {!isPlaying && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                    onClick={togglePlay}
                  >
                    <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                      <Play className="h-10 w-10 text-primary ml-1" />
                    </div>
                  </div>
                )}

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <Slider
                      value={[currentTime]}
                      max={duration || 100}
                      step={0.1}
                      onValueChange={handleSeek}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-white/70 mt-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-white/20"
                        onClick={() => skip(-10)}
                      >
                        <SkipBack className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-white/20 h-12 w-12"
                        onClick={togglePlay}
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-white/20"
                        onClick={() => skip(10)}
                      >
                        <SkipForward className="h-5 w-5" />
                      </Button>

                      {/* Volume */}
                      <div className="flex items-center gap-2 ml-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-white hover:bg-white/20"
                          onClick={toggleMute}
                        >
                          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </Button>
                        <Slider
                          value={[isMuted ? 0 : volume]}
                          max={1}
                          step={0.1}
                          onValueChange={handleVolumeChange}
                          className="w-20"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Playback Speed */}
                      <div className="relative">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-white hover:bg-white/20 text-xs"
                          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                        >
                          {playbackSpeed}x
                        </Button>
                        {showSpeedMenu && (
                          <div className="absolute bottom-full mb-2 right-0 bg-background rounded-lg shadow-lg border p-1 min-w-[80px]">
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                              <button
                                key={speed}
                                className={`w-full px-3 py-1.5 text-sm text-left rounded hover:bg-muted ${playbackSpeed === speed ? 'bg-muted font-medium' : ''}`}
                                onClick={() => changePlaybackSpeed(speed)}
                              >
                                {speed}x
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-white/20 lg:hidden"
                        onClick={() => setShowPlaylist(!showPlaylist)}
                      >
                        <List className="h-5 w-5" />
                      </Button>

                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-white/20"
                        onClick={toggleFullscreen}
                      >
                        <Maximize className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="bg-background p-4 border-t">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold line-clamp-2">{videoPlayer.video?.title}</h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{videoPlayer.video?.views} views</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        {videoPlayer.video?.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={isBookmarked ? 'text-amber-500' : ''}
                      onClick={() => {
                        setIsBookmarked(!isBookmarked);
                        toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
                      }}
                    >
                      <Bookmark className={`h-4 w-4 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
                      Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-3 mt-4 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{videoPlayer.video?.instructor}</p>
                    <p className="text-sm text-muted-foreground">Instructor</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Playlist Sidebar */}
            <div className={`w-full lg:w-80 border-l bg-background flex flex-col ${showPlaylist ? 'block' : 'hidden lg:block'}`}>
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Playlist</h3>
                  <p className="text-sm text-muted-foreground">{videoPlayer.topic?.name}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setShowPlaylist(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2">
                  {videoPlayer.allVideos.map((video, index) => (
                    <div
                      key={video.id}
                      className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        videoPlayer.video?.id === video.id 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setVideoPlayer(prev => ({ ...prev, video }))}
                    >
                      <div className="text-xs text-muted-foreground w-5 pt-0.5">
                        {videoPlayer.video?.id === video.id ? (
                          <Play className="h-4 w-4 text-primary" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="w-20 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0 relative">
                        <Play className="h-4 w-4 text-muted-foreground" />
                        {(completedVideos.includes(video.id) || video.isCompleted) && (
                          <div className="absolute inset-0 bg-emerald-500/20 rounded flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{video.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{video.instructor}</p>
                        <p className="text-xs text-muted-foreground">{video.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SyllabusPage;
