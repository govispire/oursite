import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { useExamCategoryContext } from '@/contexts/ExamCategoryContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { 
  examCategories, 
  bankingExams, 
  sscExams, 
  railwayExams, 
  upscExams,
  getExamsByCategory 
} from '@/data/examData';
import {
  BookOpen, ChevronRight, Play, FileText, ClipboardCheck,
  Download, Star, Clock, Users, CheckCircle, Video, Target, Award,
  Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, X, 
  List, ChevronLeft, Calendar, AlertCircle, BarChart3, Brain, Globe, 
  FileEdit, Calculator, Languages, Layers
} from 'lucide-react';

// Exam-specific syllabus data structure
interface ExamSyllabusConfig {
  examId: string;
  examName: string;
  fullName: string;
  stages: string;
  examDate: string;
  tiers: TierConfig[];
  logo: string;
}

interface TierConfig {
  id: string;
  name: string;
  duration: string;
  totalMarks: number;
  negativeMarking: string;
  sectionalCutoff: boolean;
  subjects: SubjectConfig[];
}

interface SubjectConfig {
  id: string;
  name: string;
  marks: number;
  icon: React.ReactNode;
  iconBg: string;
  topics: TopicConfig[];
}

interface TopicConfig {
  id: string;
  name: string;
  progress: number;
  videos: VideoResource[];
  pdfs: PDFResource[];
  tests: TestResource[];
}

interface VideoResource {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  rating: number;
  views: string;
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

// Generate resources for a topic
const generateTopicResources = (topicName: string, subjectName: string) => ({
  videos: [
    { id: `v1-${topicName}`, title: `${topicName} Basics`, instructor: 'Rajesh Kumar', duration: '45 min', rating: 4.8, views: '12K', isCompleted: false },
    { id: `v2-${topicName}`, title: `${topicName} Advanced`, instructor: 'Priya Sharma', duration: '35 min', rating: 4.7, views: '8K', isCompleted: false },
    { id: `v3-${topicName}`, title: `${topicName} Practice`, instructor: 'Amit Verma', duration: '40 min', rating: 4.9, views: '15K', isCompleted: false },
    { id: `v4-${topicName}`, title: `${topicName} Shortcuts`, instructor: 'Neha Singh', duration: '50 min', rating: 4.6, views: '6K', isCompleted: false },
  ],
  pdfs: [
    { id: `p1-${topicName}`, title: `${topicName} Complete Notes`, type: 'notes' as const, pages: 45, size: '3.2 MB', downloads: 5420 },
    { id: `p2-${topicName}`, title: 'PYQs 2020-2024', type: 'pyq' as const, pages: 28, size: '2.1 MB', downloads: 8920 },
    { id: `p3-${topicName}`, title: 'Formula Sheet', type: 'formula' as const, pages: 8, size: '0.5 MB', downloads: 12450 },
    { id: `p4-${topicName}`, title: 'Quick Revision Summary', type: 'summary' as const, pages: 12, size: '0.8 MB', downloads: 6780 },
  ],
  tests: [
    { id: `t1-${topicName}`, title: `${topicName} Basics Test`, questions: 20, duration: '15 min', difficulty: 'Easy' as const, attempts: 1240, avgScore: 72 },
    { id: `t2-${topicName}`, title: `${topicName} Advanced`, questions: 30, duration: '25 min', difficulty: 'Medium' as const, attempts: 890, avgScore: 65 },
    { id: `t3-${topicName}`, title: `${topicName} Practice`, questions: 25, duration: '20 min', difficulty: 'Medium' as const, attempts: 1560, avgScore: 68 },
    { id: `t4-${topicName}`, title: `${topicName} Master Test`, questions: 50, duration: '45 min', difficulty: 'Hard' as const, attempts: 450, avgScore: 58 },
  ]
});

// Exam syllabus configurations
const examSyllabusData: Record<string, ExamSyllabusConfig> = {
  'ibps-po': {
    examId: 'ibps-po',
    examName: 'IBPS PO',
    fullName: 'Institute of Banking Personnel Selection - Probationary Officer',
    stages: 'Prelims + Mains + Interview',
    examDate: 'October 2026',
    logo: 'https://res.cloudinary.com/dsyxrhbwb/image/upload/v1744125077/ibps_ygpzwj.webp',
    tiers: [
      {
        id: 'prelims',
        name: 'Prelims',
        duration: '60 minutes',
        totalMarks: 100,
        negativeMarking: '0.25 marks per wrong answer',
        sectionalCutoff: true,
        subjects: [
          {
            id: 'quant-prelims',
            name: 'Quantitative Aptitude',
            marks: 35,
            icon: <Calculator className="h-5 w-5 text-white" />,
            iconBg: 'bg-emerald-500',
            topics: [
              { id: 'simplification', name: 'Simplification & Approximation', progress: 60, ...generateTopicResources('Simplification', 'Quant') },
              { id: 'number-series', name: 'Number Series', progress: 40, ...generateTopicResources('Number Series', 'Quant') },
              { id: 'data-interpretation', name: 'Data Interpretation', progress: 25, ...generateTopicResources('DI', 'Quant') },
              { id: 'quadratic', name: 'Quadratic Equations', progress: 80, ...generateTopicResources('Quadratic', 'Quant') },
              { id: 'arithmetic', name: 'Arithmetic (Percentage, Ratio, Average)', progress: 55, ...generateTopicResources('Arithmetic', 'Quant') },
            ]
          },
          {
            id: 'reasoning-prelims',
            name: 'Reasoning Ability',
            marks: 35,
            icon: <Brain className="h-5 w-5 text-white" />,
            iconBg: 'bg-pink-500',
            topics: [
              { id: 'puzzles', name: 'Puzzles & Seating Arrangement', progress: 45, ...generateTopicResources('Puzzles', 'Reasoning') },
              { id: 'coding-decoding', name: 'Coding-Decoding', progress: 70, ...generateTopicResources('Coding', 'Reasoning') },
              { id: 'inequality', name: 'Inequality', progress: 90, ...generateTopicResources('Inequality', 'Reasoning') },
              { id: 'syllogism', name: 'Syllogism', progress: 35, ...generateTopicResources('Syllogism', 'Reasoning') },
              { id: 'blood-relations', name: 'Blood Relations', progress: 60, ...generateTopicResources('Blood Relations', 'Reasoning') },
            ]
          },
          {
            id: 'english-prelims',
            name: 'English Language',
            marks: 30,
            icon: <Languages className="h-5 w-5 text-white" />,
            iconBg: 'bg-amber-500',
            topics: [
              { id: 'reading-comp', name: 'Reading Comprehension', progress: 50, ...generateTopicResources('RC', 'English') },
              { id: 'cloze-test', name: 'Cloze Test', progress: 65, ...generateTopicResources('Cloze', 'English') },
              { id: 'para-jumbles', name: 'Para Jumbles', progress: 40, ...generateTopicResources('Para Jumbles', 'English') },
              { id: 'error-spotting', name: 'Error Spotting', progress: 75, ...generateTopicResources('Error Spotting', 'English') },
            ]
          }
        ]
      },
      {
        id: 'mains',
        name: 'Mains',
        duration: '180 minutes',
        totalMarks: 200,
        negativeMarking: '0.25 marks per wrong answer',
        sectionalCutoff: true,
        subjects: [
          {
            id: 'di-mains',
            name: 'Data Analysis & Interpretation',
            marks: 35,
            icon: <BarChart3 className="h-5 w-5 text-white" />,
            iconBg: 'bg-blue-500',
            topics: [
              { id: 'tabular-di', name: 'Tabular DI', progress: 0, ...generateTopicResources('Tabular DI', 'DI') },
              { id: 'bar-graph', name: 'Bar Graph DI', progress: 0, ...generateTopicResources('Bar Graph', 'DI') },
              { id: 'pie-chart', name: 'Pie Chart DI', progress: 0, ...generateTopicResources('Pie Chart', 'DI') },
              { id: 'caselet', name: 'Caselet DI', progress: 0, ...generateTopicResources('Caselet', 'DI') },
              { id: 'mixed-di', name: 'Mixed DI', progress: 0, ...generateTopicResources('Mixed DI', 'DI') },
            ]
          },
          {
            id: 'reasoning-mains',
            name: 'Reasoning & Computer Aptitude',
            marks: 45,
            icon: <Brain className="h-5 w-5 text-white" />,
            iconBg: 'bg-pink-500',
            topics: [
              { id: 'complex-puzzles', name: 'Complex Puzzles', progress: 20, ...generateTopicResources('Complex Puzzles', 'Reasoning') },
              { id: 'input-output', name: 'Input-Output', progress: 0, ...generateTopicResources('Input-Output', 'Reasoning') },
              { id: 'logical-reasoning', name: 'Logical Reasoning', progress: 0, ...generateTopicResources('Logical', 'Reasoning') },
              { id: 'data-sufficiency', name: 'Data Sufficiency', progress: 0, ...generateTopicResources('Data Sufficiency', 'Reasoning') },
              { id: 'computer-aptitude', name: 'Computer Aptitude', progress: 0, ...generateTopicResources('Computer', 'Reasoning') },
            ]
          },
          {
            id: 'english-mains',
            name: 'English Language',
            marks: 40,
            icon: <Languages className="h-5 w-5 text-white" />,
            iconBg: 'bg-amber-500',
            topics: [
              { id: 'rc-mains', name: 'Reading Comprehension', progress: 25, ...generateTopicResources('RC Mains', 'English') },
              { id: 'vocabulary', name: 'Vocabulary Based', progress: 0, ...generateTopicResources('Vocabulary', 'English') },
              { id: 'grammar', name: 'Grammar Based', progress: 0, ...generateTopicResources('Grammar', 'English') },
              { id: 'verbal-ability', name: 'Verbal Ability', progress: 0, ...generateTopicResources('Verbal', 'English') },
            ]
          },
          {
            id: 'ga-mains',
            name: 'General/Economy/Banking Awareness',
            marks: 40,
            icon: <Globe className="h-5 w-5 text-white" />,
            iconBg: 'bg-teal-500',
            topics: [
              { id: 'banking-awareness', name: 'Banking Awareness', progress: 25, ...generateTopicResources('Banking', 'GA') },
              { id: 'economy', name: 'Indian Economy', progress: 0, ...generateTopicResources('Economy', 'GA') },
              { id: 'current-affairs', name: 'Current Affairs', progress: 0, ...generateTopicResources('Current Affairs', 'GA') },
              { id: 'static-gk', name: 'Static GK', progress: 0, ...generateTopicResources('Static GK', 'GA') },
            ]
          },
          {
            id: 'descriptive',
            name: 'Descriptive Writing',
            marks: 25,
            icon: <FileEdit className="h-5 w-5 text-white" />,
            iconBg: 'bg-red-500',
            topics: [
              { id: 'essay', name: 'Essay Writing', progress: 0, ...generateTopicResources('Essay', 'Descriptive') },
              { id: 'letter', name: 'Letter Writing', progress: 0, ...generateTopicResources('Letter', 'Descriptive') },
            ]
          }
        ]
      }
    ]
  },
  'sbi-po': {
    examId: 'sbi-po',
    examName: 'SBI PO',
    fullName: 'State Bank of India - Probationary Officer',
    stages: 'Prelims + Mains + Interview',
    examDate: 'November 2026',
    logo: 'https://res.cloudinary.com/dsyxrhbwb/image/upload/v1744125088/sbi.webp',
    tiers: [
      {
        id: 'prelims',
        name: 'Prelims',
        duration: '60 minutes',
        totalMarks: 100,
        negativeMarking: '0.25 marks per wrong answer',
        sectionalCutoff: true,
        subjects: [
          {
            id: 'quant-sbi',
            name: 'Quantitative Aptitude',
            marks: 35,
            icon: <Calculator className="h-5 w-5 text-white" />,
            iconBg: 'bg-emerald-500',
            topics: [
              { id: 'simplification-sbi', name: 'Simplification', progress: 45, ...generateTopicResources('Simplification', 'Quant') },
              { id: 'number-series-sbi', name: 'Number Series', progress: 30, ...generateTopicResources('Number Series', 'Quant') },
              { id: 'di-sbi', name: 'Data Interpretation', progress: 55, ...generateTopicResources('DI', 'Quant') },
              { id: 'quadratic-sbi', name: 'Quadratic Equations', progress: 70, ...generateTopicResources('Quadratic', 'Quant') },
              { id: 'miscellaneous-sbi', name: 'Miscellaneous', progress: 40, ...generateTopicResources('Misc', 'Quant') },
            ]
          },
          {
            id: 'reasoning-sbi',
            name: 'Reasoning Ability',
            marks: 35,
            icon: <Brain className="h-5 w-5 text-white" />,
            iconBg: 'bg-pink-500',
            topics: [
              { id: 'puzzles-sbi', name: 'Puzzles & Seating', progress: 50, ...generateTopicResources('Puzzles', 'Reasoning') },
              { id: 'coding-sbi', name: 'Coding-Decoding', progress: 65, ...generateTopicResources('Coding', 'Reasoning') },
              { id: 'inequality-sbi', name: 'Inequality', progress: 80, ...generateTopicResources('Inequality', 'Reasoning') },
              { id: 'syllogism-sbi', name: 'Syllogism', progress: 45, ...generateTopicResources('Syllogism', 'Reasoning') },
              { id: 'direction-sbi', name: 'Direction Sense', progress: 55, ...generateTopicResources('Direction', 'Reasoning') },
            ]
          },
          {
            id: 'english-sbi',
            name: 'English Language',
            marks: 30,
            icon: <Languages className="h-5 w-5 text-white" />,
            iconBg: 'bg-amber-500',
            topics: [
              { id: 'rc-sbi', name: 'Reading Comprehension', progress: 40, ...generateTopicResources('RC', 'English') },
              { id: 'cloze-sbi', name: 'Cloze Test', progress: 55, ...generateTopicResources('Cloze', 'English') },
              { id: 'fillers-sbi', name: 'Sentence Fillers', progress: 60, ...generateTopicResources('Fillers', 'English') },
              { id: 'error-sbi', name: 'Error Detection', progress: 70, ...generateTopicResources('Error', 'English') },
            ]
          }
        ]
      },
      {
        id: 'mains',
        name: 'Mains',
        duration: '180 minutes',
        totalMarks: 200,
        negativeMarking: '0.25 marks per wrong answer',
        sectionalCutoff: true,
        subjects: [
          {
            id: 'di-sbi-mains',
            name: 'Data Analysis & Interpretation',
            marks: 35,
            icon: <BarChart3 className="h-5 w-5 text-white" />,
            iconBg: 'bg-blue-500',
            topics: [
              { id: 'tabular-sbi', name: 'Tabular DI', progress: 0, ...generateTopicResources('Tabular DI', 'DI') },
              { id: 'bar-sbi', name: 'Bar/Line Graph', progress: 0, ...generateTopicResources('Bar Graph', 'DI') },
              { id: 'pie-sbi', name: 'Pie Chart', progress: 0, ...generateTopicResources('Pie Chart', 'DI') },
              { id: 'caselet-sbi', name: 'Caselet', progress: 0, ...generateTopicResources('Caselet', 'DI') },
            ]
          },
          {
            id: 'reasoning-sbi-mains',
            name: 'Reasoning & Computer Aptitude',
            marks: 45,
            icon: <Brain className="h-5 w-5 text-white" />,
            iconBg: 'bg-pink-500',
            topics: [
              { id: 'complex-sbi', name: 'Complex Puzzles', progress: 0, ...generateTopicResources('Complex Puzzles', 'Reasoning') },
              { id: 'io-sbi', name: 'Input-Output', progress: 0, ...generateTopicResources('Input-Output', 'Reasoning') },
              { id: 'critical-sbi', name: 'Critical Reasoning', progress: 0, ...generateTopicResources('Critical', 'Reasoning') },
              { id: 'computer-sbi', name: 'Computer Knowledge', progress: 0, ...generateTopicResources('Computer', 'Reasoning') },
            ]
          },
          {
            id: 'english-sbi-mains',
            name: 'English Language',
            marks: 40,
            icon: <Languages className="h-5 w-5 text-white" />,
            iconBg: 'bg-amber-500',
            topics: [
              { id: 'rc-sbi-mains', name: 'Reading Comprehension', progress: 0, ...generateTopicResources('RC Mains', 'English') },
              { id: 'vocab-sbi', name: 'Vocabulary', progress: 0, ...generateTopicResources('Vocabulary', 'English') },
              { id: 'grammar-sbi', name: 'Grammar', progress: 0, ...generateTopicResources('Grammar', 'English') },
            ]
          },
          {
            id: 'ga-sbi-mains',
            name: 'General Awareness',
            marks: 40,
            icon: <Globe className="h-5 w-5 text-white" />,
            iconBg: 'bg-teal-500',
            topics: [
              { id: 'banking-sbi', name: 'Banking Awareness', progress: 0, ...generateTopicResources('Banking', 'GA') },
              { id: 'ca-sbi', name: 'Current Affairs', progress: 0, ...generateTopicResources('Current Affairs', 'GA') },
              { id: 'static-sbi', name: 'Static GK', progress: 0, ...generateTopicResources('Static GK', 'GA') },
            ]
          },
          {
            id: 'descriptive-sbi',
            name: 'Descriptive Paper',
            marks: 25,
            icon: <FileEdit className="h-5 w-5 text-white" />,
            iconBg: 'bg-red-500',
            topics: [
              { id: 'essay-sbi', name: 'Essay Writing', progress: 0, ...generateTopicResources('Essay', 'Descriptive') },
              { id: 'letter-sbi', name: 'Letter Writing', progress: 0, ...generateTopicResources('Letter', 'Descriptive') },
            ]
          }
        ]
      }
    ]
  },
  'ssc-cgl': {
    examId: 'ssc-cgl',
    examName: 'SSC CGL',
    fullName: 'Staff Selection Commission - Combined Graduate Level',
    stages: 'Tier 1 + Tier 2',
    examDate: 'August 2026',
    logo: 'https://res.cloudinary.com/dsyxrhbwb/image/upload/v1744125092/ssc_rrghxu.webp',
    tiers: [
      {
        id: 'tier1',
        name: 'Tier 1',
        duration: '60 minutes',
        totalMarks: 200,
        negativeMarking: '0.50 marks per wrong answer',
        sectionalCutoff: false,
        subjects: [
          {
            id: 'quant-cgl',
            name: 'Quantitative Aptitude',
            marks: 50,
            icon: <Calculator className="h-5 w-5 text-white" />,
            iconBg: 'bg-emerald-500',
            topics: [
              { id: 'arithmetic-cgl', name: 'Arithmetic', progress: 50, ...generateTopicResources('Arithmetic', 'Quant') },
              { id: 'algebra-cgl', name: 'Algebra', progress: 40, ...generateTopicResources('Algebra', 'Quant') },
              { id: 'geometry-cgl', name: 'Geometry', progress: 30, ...generateTopicResources('Geometry', 'Quant') },
              { id: 'trigonometry-cgl', name: 'Trigonometry', progress: 25, ...generateTopicResources('Trigonometry', 'Quant') },
              { id: 'mensuration-cgl', name: 'Mensuration', progress: 35, ...generateTopicResources('Mensuration', 'Quant') },
            ]
          },
          {
            id: 'reasoning-cgl',
            name: 'General Intelligence & Reasoning',
            marks: 50,
            icon: <Brain className="h-5 w-5 text-white" />,
            iconBg: 'bg-pink-500',
            topics: [
              { id: 'analogy-cgl', name: 'Analogy', progress: 60, ...generateTopicResources('Analogy', 'Reasoning') },
              { id: 'classification-cgl', name: 'Classification', progress: 55, ...generateTopicResources('Classification', 'Reasoning') },
              { id: 'series-cgl', name: 'Series', progress: 70, ...generateTopicResources('Series', 'Reasoning') },
              { id: 'matrix-cgl', name: 'Matrix', progress: 45, ...generateTopicResources('Matrix', 'Reasoning') },
              { id: 'non-verbal-cgl', name: 'Non-Verbal Reasoning', progress: 35, ...generateTopicResources('Non-Verbal', 'Reasoning') },
            ]
          },
          {
            id: 'english-cgl',
            name: 'English Comprehension',
            marks: 50,
            icon: <Languages className="h-5 w-5 text-white" />,
            iconBg: 'bg-amber-500',
            topics: [
              { id: 'vocab-cgl', name: 'Vocabulary', progress: 55, ...generateTopicResources('Vocabulary', 'English') },
              { id: 'grammar-cgl', name: 'Grammar', progress: 60, ...generateTopicResources('Grammar', 'English') },
              { id: 'comprehension-cgl', name: 'Comprehension', progress: 45, ...generateTopicResources('Comprehension', 'English') },
              { id: 'idioms-cgl', name: 'Idioms & Phrases', progress: 40, ...generateTopicResources('Idioms', 'English') },
            ]
          },
          {
            id: 'gk-cgl',
            name: 'General Awareness',
            marks: 50,
            icon: <Globe className="h-5 w-5 text-white" />,
            iconBg: 'bg-teal-500',
            topics: [
              { id: 'history-cgl', name: 'History', progress: 30, ...generateTopicResources('History', 'GK') },
              { id: 'polity-cgl', name: 'Polity', progress: 35, ...generateTopicResources('Polity', 'GK') },
              { id: 'geography-cgl', name: 'Geography', progress: 40, ...generateTopicResources('Geography', 'GK') },
              { id: 'science-cgl', name: 'Science', progress: 45, ...generateTopicResources('Science', 'GK') },
              { id: 'ca-cgl', name: 'Current Affairs', progress: 25, ...generateTopicResources('Current Affairs', 'GK') },
            ]
          }
        ]
      },
      {
        id: 'tier2',
        name: 'Tier 2',
        duration: '150 minutes',
        totalMarks: 390,
        negativeMarking: '1 mark per wrong answer',
        sectionalCutoff: true,
        subjects: [
          {
            id: 'paper1-cgl',
            name: 'Paper 1 - Mathematical Abilities',
            marks: 90,
            icon: <Calculator className="h-5 w-5 text-white" />,
            iconBg: 'bg-emerald-500',
            topics: [
              { id: 'advanced-arith', name: 'Advanced Arithmetic', progress: 0, ...generateTopicResources('Advanced Arithmetic', 'Quant') },
              { id: 'advanced-algebra', name: 'Advanced Algebra', progress: 0, ...generateTopicResources('Advanced Algebra', 'Quant') },
              { id: 'advanced-geo', name: 'Advanced Geometry', progress: 0, ...generateTopicResources('Advanced Geometry', 'Quant') },
            ]
          },
          {
            id: 'paper2-cgl',
            name: 'Paper 2 - Reasoning & General Intelligence',
            marks: 60,
            icon: <Brain className="h-5 w-5 text-white" />,
            iconBg: 'bg-pink-500',
            topics: [
              { id: 'adv-reasoning', name: 'Advanced Reasoning', progress: 0, ...generateTopicResources('Advanced Reasoning', 'Reasoning') },
              { id: 'critical', name: 'Critical Thinking', progress: 0, ...generateTopicResources('Critical Thinking', 'Reasoning') },
            ]
          },
          {
            id: 'paper3-cgl',
            name: 'Paper 3 - English & Comprehension',
            marks: 90,
            icon: <Languages className="h-5 w-5 text-white" />,
            iconBg: 'bg-amber-500',
            topics: [
              { id: 'adv-english', name: 'Advanced English', progress: 0, ...generateTopicResources('Advanced English', 'English') },
              { id: 'essay-cgl', name: 'Essay Writing', progress: 0, ...generateTopicResources('Essay', 'English') },
            ]
          },
          {
            id: 'paper4-cgl',
            name: 'Paper 4 - General Awareness',
            marks: 75,
            icon: <Globe className="h-5 w-5 text-white" />,
            iconBg: 'bg-teal-500',
            topics: [
              { id: 'adv-gk', name: 'Advanced GK', progress: 0, ...generateTopicResources('Advanced GK', 'GK') },
              { id: 'finance', name: 'Finance & Economics', progress: 0, ...generateTopicResources('Finance', 'GK') },
            ]
          },
          {
            id: 'paper5-cgl',
            name: 'Paper 5 - Computer Knowledge',
            marks: 75,
            icon: <Layers className="h-5 w-5 text-white" />,
            iconBg: 'bg-purple-500',
            topics: [
              { id: 'computer-basics', name: 'Computer Fundamentals', progress: 0, ...generateTopicResources('Computer Basics', 'Computer') },
              { id: 'networking', name: 'Networking', progress: 0, ...generateTopicResources('Networking', 'Computer') },
            ]
          }
        ]
      }
    ]
  }
};

// Get available exams for selector
const getAvailableExams = () => {
  return [
    { id: 'ibps-po', name: 'IBPS PO', category: 'Banking' },
    { id: 'sbi-po', name: 'SBI PO', category: 'Banking' },
    { id: 'ssc-cgl', name: 'SSC CGL', category: 'SSC' },
  ];
};

const SyllabusPage = () => {
  const navigate = useNavigate();
  const { selectedCategories } = useExamCategoryContext();
  const [selectedExam, setSelectedExam] = useState('ibps-po');
  const [selectedTier, setSelectedTier] = useState('prelims');
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);
  
  // Resource dialog state
  const [resourceDialog, setResourceDialog] = useState<{
    isOpen: boolean;
    topic: TopicConfig | null;
    activeTab: 'videos' | 'pdfs' | 'tests';
  }>({ isOpen: false, topic: null, activeTab: 'videos' });
  
  // Video player state
  const [videoPlayer, setVideoPlayer] = useState<{
    isOpen: boolean;
    video: VideoResource | null;
    allVideos: VideoResource[];
  }>({ isOpen: false, video: null, allVideos: [] });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  const sampleVideoUrls = [
    'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  ];

  const examConfig = examSyllabusData[selectedExam] || examSyllabusData['ibps-po'];
  const currentTier = examConfig.tiers.find(t => t.id === selectedTier) || examConfig.tiers[0];
  const availableExams = getAvailableExams();

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const allTopics = currentTier.subjects.flatMap(s => s.topics);
    const completedTopics = allTopics.filter(t => t.progress >= 100).length;
    const totalTopics = allTopics.length;
    const avgProgress = allTopics.reduce((sum, t) => sum + t.progress, 0) / totalTopics || 0;
    const totalVideos = allTopics.reduce((sum, t) => sum + t.videos.length, 0);
    const totalQuestions = allTopics.reduce((sum, t) => sum + t.tests.reduce((s, test) => s + test.questions, 0), 0);
    
    return {
      completedPercent: Math.round(avgProgress),
      topicsDone: `${completedTopics}/${totalTopics}`,
      avgScore: 82,
      totalVideos,
      totalQuestions
    };
  }, [currentTier]);

  const openVideoPlayer = (video: VideoResource, allVideos: VideoResource[]) => {
    setVideoPlayer({ isOpen: true, video, allVideos });
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const closeVideoPlayer = () => {
    setVideoPlayer({ isOpen: false, video: null, allVideos: [] });
    setIsPlaying(false);
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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownloadPDF = (pdf: PDFResource) => {
    toast.success(`Downloading ${pdf.title}...`);
  };

  const handleStartTest = (test: TestResource) => {
    toast.success(`Starting ${test.title}...`);
    navigate('/student/tests');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Exam Syllabus</h1>
            <p className="text-sm text-muted-foreground">Complete tier-wise syllabus with progress tracking</p>
          </div>
          
          {/* Exam Selector Tabs */}
          <div className="flex items-center gap-2 bg-muted/30 rounded-full p-1">
            {availableExams.map((exam) => (
              <button
                key={exam.id}
                onClick={() => {
                  setSelectedExam(exam.id);
                  setSelectedTier(examSyllabusData[exam.id]?.tiers[0]?.id || 'prelims');
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedExam === exam.id
                    ? 'bg-emerald-500 text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  selectedExam === exam.id ? 'bg-white' : 
                  exam.category === 'Banking' ? 'bg-amber-400' : 'bg-amber-400'
                }`}></span>
                {exam.name}
              </button>
            ))}
          </div>
        </div>

        {/* Exam Info Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <img 
                  src={examConfig.logo} 
                  alt={examConfig.examName}
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h2 className="text-xl font-bold text-foreground">{examConfig.fullName}</h2>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Layers className="h-4 w-4" />
                      {examConfig.stages}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {examConfig.examDate}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Tier Selector */}
              <div className="flex items-center gap-2">
                {examConfig.tiers.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                      selectedTier === tier.id
                        ? 'bg-emerald-500 text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {selectedTier === tier.id && <ChevronRight className="h-4 w-4" />}
                    {tier.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Exam Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-muted/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">Duration</span>
                </div>
                <p className="text-lg font-bold text-foreground">{currentTier.duration}</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Target className="h-4 w-4" />
                  <span className="text-xs">Total Marks</span>
                </div>
                <p className="text-lg font-bold text-foreground">{currentTier.totalMarks}</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs">Negative Marking</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{currentTier.negativeMarking}</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-xs">Sectional Cutoff</span>
                </div>
                <p className="text-lg font-bold text-foreground">{currentTier.sectionalCutoff ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 mx-auto text-emerald-500 mb-2" />
              <p className="text-2xl font-bold text-emerald-500">{overallStats.completedPercent}%</p>
              <p className="text-xs text-muted-foreground">Completed</p>
              <Progress value={overallStats.completedPercent} className="h-1 mt-2" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 mx-auto text-emerald-500 mb-2" />
              <p className="text-2xl font-bold text-foreground">{overallStats.topicsDone}</p>
              <p className="text-xs text-muted-foreground">Topics Done</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 mx-auto text-amber-500 mb-2" />
              <p className="text-2xl font-bold text-foreground">{overallStats.avgScore}%</p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Video className="h-6 w-6 mx-auto text-purple-500 mb-2" />
              <p className="text-2xl font-bold text-foreground">{overallStats.totalVideos}</p>
              <p className="text-xs text-muted-foreground">Videos</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <ClipboardCheck className="h-6 w-6 mx-auto text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-foreground">{overallStats.totalQuestions.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Questions</p>
            </CardContent>
          </Card>
        </div>

        {/* Subjects List */}
        <div className="space-y-3">
          {currentTier.subjects.map((subject) => {
            const subjectProgress = Math.round(
              subject.topics.reduce((sum, t) => sum + t.progress, 0) / subject.topics.length
            );
            const completedTopics = subject.topics.filter(t => t.progress >= 100).length;
            
            return (
              <Card 
                key={subject.id}
                className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setExpandedSubject(expandedSubject === subject.id ? null : subject.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${subject.iconBg} flex items-center justify-center`}>
                      {subject.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{subject.name}</h3>
                        <Badge variant="secondary" className="text-xs">{subject.marks} marks</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{completedTopics}/{subject.topics.length} topics completed</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden md:block">
                        <Progress value={subjectProgress} className="w-24 h-2" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">{subjectProgress}%</span>
                      <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${expandedSubject === subject.id ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded Topics */}
                  {expandedSubject === subject.id && (
                    <div className="mt-4 space-y-2 border-t pt-4">
                      {subject.topics.map((topic) => (
                        <div 
                          key={topic.id}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setResourceDialog({ isOpen: true, topic, activeTab: 'videos' });
                          }}
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm text-foreground">{topic.name}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Video className="h-3 w-3" />
                                {topic.videos.length} Videos
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {topic.pdfs.length} PDFs
                              </span>
                              <span className="flex items-center gap-1">
                                <ClipboardCheck className="h-3 w-3" />
                                {topic.tests.length} Tests
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Progress value={topic.progress} className="w-20 h-2" />
                            <span className="text-xs font-medium text-muted-foreground w-8">{topic.progress}%</span>
                            <Button variant="ghost" size="sm" className="text-emerald-600">
                              Resources
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Resource Dialog */}
      <Dialog open={resourceDialog.isOpen} onOpenChange={(open) => setResourceDialog({ ...resourceDialog, isOpen: open })}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{resourceDialog.topic?.name} - Resources</DialogTitle>
          </DialogHeader>
          
          <div className="flex gap-2 border-b pb-2">
            {(['videos', 'pdfs', 'tests'] as const).map((tab) => (
              <Button
                key={tab}
                variant={resourceDialog.activeTab === tab ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setResourceDialog({ ...resourceDialog, activeTab: tab })}
                className="capitalize"
              >
                {tab === 'videos' && <Video className="h-4 w-4 mr-1" />}
                {tab === 'pdfs' && <FileText className="h-4 w-4 mr-1" />}
                {tab === 'tests' && <ClipboardCheck className="h-4 w-4 mr-1" />}
                {tab} ({resourceDialog.topic?.[tab]?.length || 0})
              </Button>
            ))}
          </div>

          <ScrollArea className="h-[400px] pr-4">
            {resourceDialog.activeTab === 'videos' && (
              <div className="space-y-3">
                {resourceDialog.topic?.videos.map((video) => (
                  <div 
                    key={video.id}
                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => openVideoPlayer(video, resourceDialog.topic?.videos || [])}
                  >
                    <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                      <Play className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{video.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{video.instructor}</span>
                        <span>•</span>
                        <span>{video.duration}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {video.rating}
                        </span>
                      </div>
                    </div>
                    {completedVideos.includes(video.id) && (
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {resourceDialog.activeTab === 'pdfs' && (
              <div className="space-y-3">
                {resourceDialog.topic?.pdfs.map((pdf) => (
                  <div key={pdf.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center">
                      <FileText className="h-6 w-6 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{pdf.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs capitalize">{pdf.type}</Badge>
                        <span>{pdf.pages} pages</span>
                        <span>•</span>
                        <span>{pdf.size}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleDownloadPDF(pdf)}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {resourceDialog.activeTab === 'tests' && (
              <div className="space-y-3">
                {resourceDialog.topic?.tests.map((test) => (
                  <div key={test.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                      <ClipboardCheck className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{test.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{test.questions} Qs</span>
                        <span>•</span>
                        <span>{test.duration}</span>
                        <span>•</span>
                        <Badge variant={test.difficulty === 'Easy' ? 'secondary' : test.difficulty === 'Medium' ? 'default' : 'destructive'} className="text-xs">
                          {test.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleStartTest(test)}>
                      Start Test
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Video Player Dialog */}
      <Dialog open={videoPlayer.isOpen} onOpenChange={closeVideoPlayer}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="relative bg-black aspect-video">
            <video
              ref={videoRef}
              src={sampleVideoUrls[0]}
              className="w-full h-full"
              onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
              onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
              onEnded={() => setIsPlaying(false)}
            />
            
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={(value) => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = value[0];
                    setCurrentTime(value[0]);
                  }
                }}
                className="mb-3"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/20">
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <span className="text-white text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsMuted(!isMuted)} 
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => videoRef.current?.requestFullscreen()} 
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={closeVideoPlayer}
              className="absolute top-4 right-4 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-4 bg-background">
            <h3 className="font-semibold">{videoPlayer.video?.title}</h3>
            <p className="text-sm text-muted-foreground">{videoPlayer.video?.instructor} • {videoPlayer.video?.duration}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SyllabusPage;
