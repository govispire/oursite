import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ChevronDown, ChevronUp, BookOpen, Video, FileText,
  Clock, Target, Play, Download, CheckCircle2, Star,
  Zap, Calendar, Search, Plus, Edit, Trash2, Eye,
  Upload, Settings, Copy, MoreVertical, GripVertical,
  AlertCircle, Save, X, BarChart2, Users, Layers
} from 'lucide-react';
import {
  allSyllabusData,
  ExamSyllabusConfig,
  TopicConfig,
  SubjectConfig,
  TierConfig
} from '@/data/syllabusData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

const ManageSyllabus = () => {
  // Deep clone for mutable local state
  const [syllabusData, setSyllabusData] = useState<Record<string, ExamSyllabusConfig>>(() =>
    JSON.parse(JSON.stringify(allSyllabusData))
  );

  const allExams = Object.values(syllabusData);
  const [selectedExam, setSelectedExam] = useState<string>(allExams[0]?.examId || '');
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog states
  const [addExamDialog, setAddExamDialog] = useState(false);
  const [addTierDialog, setAddTierDialog] = useState(false);
  const [addSubjectDialog, setAddSubjectDialog] = useState(false);
  const [addTopicDialog, setAddTopicDialog] = useState(false);
  const [editResourceDialog, setEditResourceDialog] = useState<{
    isOpen: boolean;
    topicId: string;
    subjectId: string;
    type: 'videos' | 'pdfs' | 'tests';
  }>({ isOpen: false, topicId: '', subjectId: '', type: 'videos' });
  const [bulkUploadDialog, setBulkUploadDialog] = useState(false);
  const [activeSubjectId, setActiveSubjectId] = useState('');

  // Edit states
  const [editTopicDialog, setEditTopicDialog] = useState<{ isOpen: boolean; topicId: string; subjectId: string; name: string }>({ isOpen: false, topicId: '', subjectId: '', name: '' });
  const [editSubjectDialog, setEditSubjectDialog] = useState<{ isOpen: boolean; subjectId: string; name: string; marks: string }>({ isOpen: false, subjectId: '', name: '', marks: '' });

  // Form states
  const [newExamForm, setNewExamForm] = useState({ shortName: '', fullName: '', category: 'banking', stages: '', examDate: '', logo: '' });
  const [newTierForm, setNewTierForm] = useState({ name: '', duration: '', totalMarks: '', negativeMarking: '', sectionalCutoff: false });
  const [newSubjectForm, setNewSubjectForm] = useState({ name: '', marks: '', iconBg: 'bg-blue-50' });
  const [newTopicForm, setNewTopicForm] = useState({ name: '', description: '' });
  const [addResourceForm, setAddResourceForm] = useState({ title: '', instructor: '', duration: '', pages: '', type: '', questions: '', difficulty: '' });
  const [showAddResourceForm, setShowAddResourceForm] = useState(false);

  const examConfig = syllabusData[selectedExam];

  React.useEffect(() => {
    if (examConfig && examConfig.tiers.length > 0 && !selectedTier) {
      setSelectedTier(examConfig.tiers[0].id);
    }
  }, [selectedExam, examConfig, selectedTier]);

  React.useEffect(() => {
    if (examConfig && examConfig.tiers.length > 0) {
      setSelectedTier(examConfig.tiers[0].id);
    }
  }, [selectedExam]);

  const currentTier = examConfig?.tiers.find(t => t.id === selectedTier) || examConfig?.tiers[0];

  // Helper to update syllabusData immutably
  const updateExam = (examId: string, updater: (exam: ExamSyllabusConfig) => ExamSyllabusConfig) => {
    setSyllabusData(prev => ({
      ...prev,
      [examId]: updater({ ...prev[examId] })
    }));
  };

  const getCurrentTopic = () => {
    if (!currentTier) return null;
    for (const subject of currentTier.subjects) {
      const topic = subject.topics.find(t => t.id === editResourceDialog.topicId);
      if (topic) return topic;
    }
    return null;
  };

  // Stats
  const overallStats = useMemo(() => {
    if (!examConfig) return { totalTopics: 0, totalVideos: 0, totalPdfs: 0, totalTests: 0, totalSubjects: 0 };
    let totalTopics = 0, totalVideos = 0, totalPdfs = 0, totalTests = 0, totalSubjects = 0;
    examConfig.tiers.forEach(tier => {
      totalSubjects += tier.subjects.length;
      tier.subjects.forEach(subject => {
        subject.topics.forEach(topic => {
          totalTopics++;
          totalVideos += topic.videos.length;
          totalPdfs += topic.pdfs.length;
          totalTests += topic.tests.length;
        });
      });
    });
    return { totalTopics, totalVideos, totalPdfs, totalTests, totalSubjects };
  }, [examConfig]);

  // Filter
  const filteredSubjects = useMemo(() => {
    if (!currentTier || !searchQuery) return currentTier?.subjects || [];
    const query = searchQuery.toLowerCase();
    return currentTier.subjects.map(subject => ({
      ...subject,
      topics: subject.topics.filter(topic =>
        topic.name.toLowerCase().includes(query) ||
        subject.name.toLowerCase().includes(query)
      )
    })).filter(subject => subject.topics.length > 0);
  }, [currentTier, searchQuery]);

  const toggleSubject = (subjectId: string) => {
    setExpandedSubjects(prev =>
      prev.includes(subjectId) ? prev.filter(id => id !== subjectId) : [...prev, subjectId]
    );
  };

  // ===== CRUD Operations =====

  const handleAddExam = () => {
    if (!newExamForm.shortName || !newExamForm.fullName) return;
    const examId = newExamForm.shortName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const newExam: ExamSyllabusConfig = {
      examId,
      examName: newExamForm.shortName,
      fullName: newExamForm.fullName,
      category: newExamForm.category as any,
      stages: newExamForm.stages || 'Prelims + Mains',
      examDate: newExamForm.examDate || 'TBD',
      logo: newExamForm.logo || 'https://upload.wikimedia.org/wikipedia/en/thumb/5/58/State_Bank_of_India_logo.svg/74px-State_Bank_of_India_logo.svg.png',
      tiers: []
    };
    setSyllabusData(prev => ({ ...prev, [examId]: newExam }));
    setSelectedExam(examId);
    setAddExamDialog(false);
    setNewExamForm({ shortName: '', fullName: '', category: 'banking', stages: '', examDate: '', logo: '' });
    toast({ title: 'Exam added', description: `${newExamForm.shortName} has been created.`, type: 'success' });
  };

  const handleDeleteExam = () => {
    if (!examConfig) return;
    setSyllabusData(prev => {
      const next = { ...prev };
      delete next[selectedExam];
      return next;
    });
    const remaining = Object.keys(syllabusData).filter(k => k !== selectedExam);
    setSelectedExam(remaining[0] || '');
    toast({ title: 'Exam deleted', type: 'success' });
  };

  const handleAddTier = () => {
    if (!newTierForm.name || !examConfig) return;
    const tierId = newTierForm.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const newTier: TierConfig = {
      id: tierId,
      name: newTierForm.name,
      duration: newTierForm.duration || '60 minutes',
      totalMarks: Number(newTierForm.totalMarks) || 100,
      negativeMarking: newTierForm.negativeMarking || '-0.25 per wrong',
      sectionalCutoff: newTierForm.sectionalCutoff,
      subjects: []
    };
    updateExam(selectedExam, exam => ({ ...exam, tiers: [...exam.tiers, newTier] }));
    setSelectedTier(tierId);
    setAddTierDialog(false);
    setNewTierForm({ name: '', duration: '', totalMarks: '', negativeMarking: '', sectionalCutoff: false });
    toast({ title: 'Tier added', description: `${newTierForm.name} has been created.`, type: 'success' });
  };

  const handleAddSubject = () => {
    if (!newSubjectForm.name || !currentTier) return;
    const subjectId = newSubjectForm.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const newSubject: SubjectConfig = {
      id: subjectId,
      name: newSubjectForm.name,
      marks: newSubjectForm.marks || '35',
      iconBg: newSubjectForm.iconBg,
      topics: []
    };
    updateExam(selectedExam, exam => ({
      ...exam,
      tiers: exam.tiers.map(t => t.id === selectedTier ? { ...t, subjects: [...t.subjects, newSubject] } : t)
    }));
    setAddSubjectDialog(false);
    setNewSubjectForm({ name: '', marks: '', iconBg: 'bg-blue-50' });
    toast({ title: 'Subject added', description: `${newSubjectForm.name} has been created.`, type: 'success' });
  };

  const handleAddTopic = () => {
    if (!newTopicForm.name || !activeSubjectId) return;
    const topicId = newTopicForm.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const newTopic: TopicConfig = {
      id: topicId,
      name: newTopicForm.name,
      videos: [],
      pdfs: [],
      tests: []
    };
    updateExam(selectedExam, exam => ({
      ...exam,
      tiers: exam.tiers.map(t => t.id === selectedTier ? {
        ...t,
        subjects: t.subjects.map(s => s.id === activeSubjectId ? { ...s, topics: [...s.topics, newTopic] } : s)
      } : t)
    }));
    setAddTopicDialog(false);
    setNewTopicForm({ name: '', description: '' });
    toast({ title: 'Topic added', type: 'success' });
  };

  const handleDeleteTopic = (subjectId: string, topicId: string) => {
    updateExam(selectedExam, exam => ({
      ...exam,
      tiers: exam.tiers.map(t => t.id === selectedTier ? {
        ...t,
        subjects: t.subjects.map(s => s.id === subjectId ? { ...s, topics: s.topics.filter(tp => tp.id !== topicId) } : s)
      } : t)
    }));
    toast({ title: 'Topic deleted', type: 'success' });
  };

  const handleEditTopic = () => {
    if (!editTopicDialog.name) return;
    updateExam(selectedExam, exam => ({
      ...exam,
      tiers: exam.tiers.map(t => t.id === selectedTier ? {
        ...t,
        subjects: t.subjects.map(s => s.id === editTopicDialog.subjectId ? {
          ...s,
          topics: s.topics.map(tp => tp.id === editTopicDialog.topicId ? { ...tp, name: editTopicDialog.name } : tp)
        } : s)
      } : t)
    }));
    setEditTopicDialog({ isOpen: false, topicId: '', subjectId: '', name: '' });
    toast({ title: 'Topic updated', type: 'success' });
  };

  const handleDeleteSubject = (subjectId: string) => {
    updateExam(selectedExam, exam => ({
      ...exam,
      tiers: exam.tiers.map(t => t.id === selectedTier ? {
        ...t,
        subjects: t.subjects.filter(s => s.id !== subjectId)
      } : t)
    }));
    toast({ title: 'Subject deleted', type: 'success' });
  };

  const handleEditSubject = () => {
    if (!editSubjectDialog.name) return;
    updateExam(selectedExam, exam => ({
      ...exam,
      tiers: exam.tiers.map(t => t.id === selectedTier ? {
        ...t,
        subjects: t.subjects.map(s => s.id === editSubjectDialog.subjectId ? { ...s, name: editSubjectDialog.name, marks: editSubjectDialog.marks } : s)
      } : t)
    }));
    setEditSubjectDialog({ isOpen: false, subjectId: '', name: '', marks: '' });
    toast({ title: 'Subject updated', type: 'success' });
  };

  const handleAddResource = () => {
    if (!addResourceForm.title) return;
    const { topicId, subjectId, type } = editResourceDialog;
    const resourceId = type + '-' + Date.now();

    updateExam(selectedExam, exam => ({
      ...exam,
      tiers: exam.tiers.map(t => t.id === selectedTier ? {
        ...t,
        subjects: t.subjects.map(s => {
          if (s.id !== subjectId && !s.topics.find(tp => tp.id === topicId)) return s;
          return {
            ...s,
            topics: s.topics.map(tp => {
              if (tp.id !== topicId) return tp;
              if (type === 'videos') {
                return { ...tp, videos: [...tp.videos, { id: resourceId, title: addResourceForm.title, instructor: addResourceForm.instructor || 'Instructor', duration: addResourceForm.duration || '15 min', url: '' }] };
              } else if (type === 'pdfs') {
                return { ...tp, pdfs: [...tp.pdfs, { id: resourceId, title: addResourceForm.title, pages: addResourceForm.pages || '10', type: addResourceForm.type || 'Notes', downloadUrl: '' }] };
              } else {
                return { ...tp, tests: [...tp.tests, { id: resourceId, title: addResourceForm.title, questions: addResourceForm.questions || '20', duration: addResourceForm.duration || '30 min', difficulty: (addResourceForm.difficulty || 'Medium') as any }] };
              }
            })
          };
        })
      } : t)
    }));
    setAddResourceForm({ title: '', instructor: '', duration: '', pages: '', type: '', questions: '', difficulty: '' });
    setShowAddResourceForm(false);
    toast({ title: `${type === 'pdfs' ? 'PDF' : type === 'tests' ? 'Test' : 'Video'} added`, type: 'success' });
  };

  const handleDeleteResource = (topicId: string, resourceType: 'videos' | 'pdfs' | 'tests', resourceId: string) => {
    updateExam(selectedExam, exam => ({
      ...exam,
      tiers: exam.tiers.map(t => t.id === selectedTier ? {
        ...t,
        subjects: t.subjects.map(s => ({
          ...s,
          topics: s.topics.map(tp => {
            if (tp.id !== topicId) return tp;
            if (resourceType === 'videos') return { ...tp, videos: tp.videos.filter(v => v.id !== resourceId) };
            if (resourceType === 'pdfs') return { ...tp, pdfs: tp.pdfs.filter(p => p.id !== resourceId) };
            return { ...tp, tests: tp.tests.filter(t => t.id !== resourceId) };
          })
        }))
      } : t)
    }));
    toast({ title: 'Resource deleted', type: 'success' });
  };

  // Get live topic data for resource dialog
  const getDialogTopic = (): TopicConfig | null => {
    if (!currentTier || !editResourceDialog.topicId) return null;
    for (const subject of currentTier.subjects) {
      const topic = subject.topics.find(t => t.id === editResourceDialog.topicId);
      if (topic) return topic;
    }
    return null;
  };

  const dialogTopic = getDialogTopic();

  if (!examConfig) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No syllabus data available.</p>
          <Button className="mt-4" onClick={() => setAddExamDialog(true)}><Plus className="h-4 w-4 mr-2" /> Add First Exam</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Syllabus</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add, edit and organize exam syllabus, subjects, topics & resources
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-48 h-9"
            />
          </div>
          <Button size="sm" variant="outline" onClick={() => setBulkUploadDialog(true)} className="gap-1.5">
            <Upload className="h-4 w-4" /> Bulk Upload
          </Button>
          <Button size="sm" onClick={() => setAddExamDialog(true)} className="gap-1.5">
            <Plus className="h-4 w-4" /> Add Exam
          </Button>
        </div>
      </div>

      {/* Exam Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {Object.values(syllabusData).map((exam) => (
          <button
            key={exam.examId}
            onClick={() => setSelectedExam(exam.examId)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
              selectedExam === exam.examId
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:border-primary/40'
            }`}
          >
            <img src={exam.logo} alt={exam.examName} className="w-5 h-5 object-contain" />
            {exam.examName}
          </button>
        ))}
      </div>

      {/* Exam Info Card */}
      <Card className="border border-border/60">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <img src={examConfig.logo} alt={examConfig.examName} className="w-12 h-12 object-contain" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">{examConfig.fullName}</h2>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Edit className="h-4 w-4 mr-2" /> Edit Exam Details</DropdownMenuItem>
                      <DropdownMenuItem><Eye className="h-4 w-4 mr-2" /> Preview (Student View)</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={handleDeleteExam}><Trash2 className="h-4 w-4 mr-2" /> Delete Exam</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">{examConfig.stages}</Badge>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {examConfig.examDate}
                  </span>
                  <Badge variant="outline" className="text-xs capitalize">{examConfig.category}</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {[
                { label: 'Subjects', value: overallStats.totalSubjects },
                { label: 'Topics', value: overallStats.totalTopics },
                { label: 'Videos', value: overallStats.totalVideos },
                { label: 'PDFs', value: overallStats.totalPdfs },
                { label: 'Tests', value: overallStats.totalTests },
              ].map(stat => (
                <div key={stat.label} className="text-center p-2 bg-muted/30 rounded-lg">
                  <p className="text-lg font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tier Selector */}
      <div className="flex items-center justify-between gap-4">
        {examConfig.tiers.length > 0 && (
          <Tabs value={selectedTier} onValueChange={setSelectedTier}>
            <TabsList className="bg-muted/30 p-1">
              {examConfig.tiers.map((tier) => (
                <TabsTrigger key={tier.id} value={tier.id} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  {tier.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setAddTierDialog(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add Tier
          </Button>
          <Button size="sm" variant="outline" onClick={() => setAddSubjectDialog(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add Subject
          </Button>
        </div>
      </div>

      {/* Tier Info */}
      {currentTier && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-3 border border-border/60">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-medium text-sm">{currentTier.duration}</p>
              </div>
            </div>
          </Card>
          <Card className="p-3 border border-border/60">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Total Marks</p>
                <p className="font-medium text-sm">{currentTier.totalMarks}</p>
              </div>
            </div>
          </Card>
          <Card className="p-3 border border-border/60">
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-destructive" />
              <div>
                <p className="text-xs text-muted-foreground">Negative Marking</p>
                <p className="font-medium text-sm truncate">{currentTier.negativeMarking}</p>
              </div>
            </div>
          </Card>
          <Card className="p-3 border border-border/60">
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`h-4 w-4 ${currentTier.sectionalCutoff ? 'text-primary' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-xs text-muted-foreground">Sectional Cutoff</p>
                <p className="font-medium text-sm">{currentTier.sectionalCutoff ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Subjects & Topics */}
      <div className="space-y-3">
        {filteredSubjects.map((subject) => {
          const isExpanded = expandedSubjects.includes(subject.id);
          const subjectTopicCount = subject.topics.length;
          const subjectVideoCount = subject.topics.reduce((s, t) => s + t.videos.length, 0);
          const subjectPdfCount = subject.topics.reduce((s, t) => s + t.pdfs.length, 0);
          const subjectTestCount = subject.topics.reduce((s, t) => s + t.tests.length, 0);

          return (
            <Card key={subject.id} className="border border-border/60 overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => toggleSubject(subject.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${subject.iconBg}`}>
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{subject.name}</h3>
                      <Badge variant="secondary" className="text-xs">{subject.marks} marks</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                      <span>{subjectTopicCount} topics</span>
                      <span>{subjectVideoCount} videos</span>
                      <span>{subjectPdfCount} PDFs</span>
                      <span>{subjectTestCount} tests</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditSubjectDialog({ isOpen: true, subjectId: subject.id, name: subject.name, marks: subject.marks })}>
                        <Edit className="h-4 w-4 mr-2" /> Edit Subject
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setActiveSubjectId(subject.id); setAddTopicDialog(true); }}>
                        <Plus className="h-4 w-4 mr-2" /> Add Topic
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteSubject(subject.id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Subject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="w-8"></TableHead>
                        <TableHead>Topic</TableHead>
                        <TableHead className="text-center w-20">Videos</TableHead>
                        <TableHead className="text-center w-20">PDFs</TableHead>
                        <TableHead className="text-center w-20">Tests</TableHead>
                        <TableHead className="text-center w-24">Status</TableHead>
                        <TableHead className="text-right w-28">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subject.topics.map((topic) => {
                        const hasAllResources = topic.videos.length > 0 && topic.pdfs.length > 0 && topic.tests.length > 0;
                        const missingResources: string[] = [];
                        if (topic.videos.length === 0) missingResources.push('Videos');
                        if (topic.pdfs.length === 0) missingResources.push('PDFs');
                        if (topic.tests.length === 0) missingResources.push('Tests');

                        return (
                          <TableRow key={topic.id} className="hover:bg-muted/10">
                            <TableCell><GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab" /></TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{topic.name}</p>
                                {missingResources.length > 0 && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <AlertCircle className="h-3 w-3 text-amber-500" />
                                    <span className="text-xs text-amber-600">Missing: {missingResources.join(', ')}</span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <button
                                onClick={() => setEditResourceDialog({ isOpen: true, topicId: topic.id, subjectId: subject.id, type: 'videos' })}
                                className="inline-flex items-center gap-1 text-sm hover:text-primary transition-colors"
                              >
                                <Video className="h-3.5 w-3.5" />
                                <span className="font-medium">{topic.videos.length}</span>
                              </button>
                            </TableCell>
                            <TableCell className="text-center">
                              <button
                                onClick={() => setEditResourceDialog({ isOpen: true, topicId: topic.id, subjectId: subject.id, type: 'pdfs' })}
                                className="inline-flex items-center gap-1 text-sm hover:text-primary transition-colors"
                              >
                                <FileText className="h-3.5 w-3.5" />
                                <span className="font-medium">{topic.pdfs.length}</span>
                              </button>
                            </TableCell>
                            <TableCell className="text-center">
                              <button
                                onClick={() => setEditResourceDialog({ isOpen: true, topicId: topic.id, subjectId: subject.id, type: 'tests' })}
                                className="inline-flex items-center gap-1 text-sm hover:text-primary transition-colors"
                              >
                                <Target className="h-3.5 w-3.5" />
                                <span className="font-medium">{topic.tests.length}</span>
                              </button>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant={hasAllResources ? 'default' : 'secondary'}
                                className={`text-xs ${hasAllResources ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'}`}
                              >
                                {hasAllResources ? 'Complete' : 'Incomplete'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditTopicDialog({ isOpen: true, topicId: topic.id, subjectId: subject.id, name: topic.name })}>
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteTopic(subject.id, topic.id)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  <div className="p-3 border-t bg-muted/10">
                    <Button size="sm" variant="outline" onClick={() => { setActiveSubjectId(subject.id); setAddTopicDialog(true); }} className="gap-1.5 text-xs">
                      <Plus className="h-3.5 w-3.5" /> Add Topic to {subject.name}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* ====== DIALOGS ====== */}

      {/* Add Exam Dialog */}
      <Dialog open={addExamDialog} onOpenChange={setAddExamDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add New Exam</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Exam Short Name</Label>
                <Input placeholder="e.g. SBI PO" className="mt-1" value={newExamForm.shortName} onChange={e => setNewExamForm(p => ({ ...p, shortName: e.target.value }))} />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={newExamForm.category} onValueChange={v => setNewExamForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banking">Banking</SelectItem>
                    <SelectItem value="ssc">SSC</SelectItem>
                    <SelectItem value="railway">Railway</SelectItem>
                    <SelectItem value="upsc">UPSC</SelectItem>
                    <SelectItem value="state-psc">State PSC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Full Name</Label>
              <Input placeholder="e.g. State Bank of India Probationary Officer" className="mt-1" value={newExamForm.fullName} onChange={e => setNewExamForm(p => ({ ...p, fullName: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Stages</Label>
                <Input placeholder="e.g. Prelims + Mains + Interview" className="mt-1" value={newExamForm.stages} onChange={e => setNewExamForm(p => ({ ...p, stages: e.target.value }))} />
              </div>
              <div>
                <Label>Expected Exam Date</Label>
                <Input placeholder="e.g. Nov 2025" className="mt-1" value={newExamForm.examDate} onChange={e => setNewExamForm(p => ({ ...p, examDate: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Logo URL</Label>
              <Input placeholder="https://..." className="mt-1" value={newExamForm.logo} onChange={e => setNewExamForm(p => ({ ...p, logo: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddExamDialog(false)}>Cancel</Button>
            <Button onClick={handleAddExam} className="gap-1.5"><Save className="h-4 w-4" /> Save Exam</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tier Dialog */}
      <Dialog open={addTierDialog} onOpenChange={setAddTierDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add New Tier / Stage</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tier Name</Label>
              <Input placeholder="e.g. Prelims" className="mt-1" value={newTierForm.name} onChange={e => setNewTierForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duration</Label>
                <Input placeholder="e.g. 60 minutes" className="mt-1" value={newTierForm.duration} onChange={e => setNewTierForm(p => ({ ...p, duration: e.target.value }))} />
              </div>
              <div>
                <Label>Total Marks</Label>
                <Input type="number" placeholder="100" className="mt-1" value={newTierForm.totalMarks} onChange={e => setNewTierForm(p => ({ ...p, totalMarks: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Negative Marking</Label>
                <Input placeholder="e.g. -0.25 per wrong" className="mt-1" value={newTierForm.negativeMarking} onChange={e => setNewTierForm(p => ({ ...p, negativeMarking: e.target.value }))} />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch id="sectional-cutoff" checked={newTierForm.sectionalCutoff} onCheckedChange={v => setNewTierForm(p => ({ ...p, sectionalCutoff: v }))} />
                <Label htmlFor="sectional-cutoff">Sectional Cutoff</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTierDialog(false)}>Cancel</Button>
            <Button onClick={handleAddTier} className="gap-1.5"><Save className="h-4 w-4" /> Save Tier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subject Dialog */}
      <Dialog open={addSubjectDialog} onOpenChange={setAddSubjectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add New Subject</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Subject Name</Label>
              <Input placeholder="e.g. Quantitative Aptitude" className="mt-1" value={newSubjectForm.name} onChange={e => setNewSubjectForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Marks</Label>
                <Input type="number" placeholder="35" className="mt-1" value={newSubjectForm.marks} onChange={e => setNewSubjectForm(p => ({ ...p, marks: e.target.value }))} />
              </div>
              <div>
                <Label>Icon Color</Label>
                <Select value={newSubjectForm.iconBg} onValueChange={v => setNewSubjectForm(p => ({ ...p, iconBg: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select color" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bg-blue-50">Blue</SelectItem>
                    <SelectItem value="bg-green-50">Green</SelectItem>
                    <SelectItem value="bg-purple-50">Purple</SelectItem>
                    <SelectItem value="bg-orange-50">Orange</SelectItem>
                    <SelectItem value="bg-red-50">Red</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddSubjectDialog(false)}>Cancel</Button>
            <Button onClick={handleAddSubject} className="gap-1.5"><Save className="h-4 w-4" /> Save Subject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Topic Dialog */}
      <Dialog open={addTopicDialog} onOpenChange={setAddTopicDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add New Topic</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Topic Name</Label>
              <Input placeholder="e.g. Number Systems" className="mt-1" value={newTopicForm.name} onChange={e => setNewTopicForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Textarea placeholder="Brief description..." className="mt-1" rows={3} value={newTopicForm.description} onChange={e => setNewTopicForm(p => ({ ...p, description: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTopicDialog(false)}>Cancel</Button>
            <Button onClick={handleAddTopic} className="gap-1.5"><Save className="h-4 w-4" /> Save Topic</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Topic Dialog */}
      <Dialog open={editTopicDialog.isOpen} onOpenChange={open => setEditTopicDialog(p => ({ ...p, isOpen: open }))}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit Topic</DialogTitle></DialogHeader>
          <div>
            <Label>Topic Name</Label>
            <Input className="mt-1" value={editTopicDialog.name} onChange={e => setEditTopicDialog(p => ({ ...p, name: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTopicDialog(p => ({ ...p, isOpen: false }))}>Cancel</Button>
            <Button onClick={handleEditTopic} className="gap-1.5"><Save className="h-4 w-4" /> Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subject Dialog */}
      <Dialog open={editSubjectDialog.isOpen} onOpenChange={open => setEditSubjectDialog(p => ({ ...p, isOpen: open }))}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit Subject</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Subject Name</Label>
              <Input className="mt-1" value={editSubjectDialog.name} onChange={e => setEditSubjectDialog(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <Label>Marks</Label>
              <Input type="number" className="mt-1" value={editSubjectDialog.marks} onChange={e => setEditSubjectDialog(p => ({ ...p, marks: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSubjectDialog(p => ({ ...p, isOpen: false }))}>Cancel</Button>
            <Button onClick={handleEditSubject} className="gap-1.5"><Save className="h-4 w-4" /> Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Resources Dialog */}
      <Dialog open={editResourceDialog.isOpen} onOpenChange={(open) => { setEditResourceDialog(prev => ({ ...prev, isOpen: open })); setShowAddResourceForm(false); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editResourceDialog.type === 'videos' && <Video className="h-5 w-5 text-primary" />}
              {editResourceDialog.type === 'pdfs' && <FileText className="h-5 w-5 text-primary" />}
              {editResourceDialog.type === 'tests' && <Target className="h-5 w-5 text-primary" />}
              Manage {editResourceDialog.type === 'pdfs' ? 'PDFs' : editResourceDialog.type === 'tests' ? 'Tests' : 'Videos'} — {dialogTopic?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {editResourceDialog.type === 'videos' && dialogTopic?.videos.map((video, idx) => (
              <Card key={video.id} className="p-3 border border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{idx + 1}</div>
                    <div>
                      <p className="text-sm font-medium">{video.title}</p>
                      <p className="text-xs text-muted-foreground">{video.instructor} · {video.duration}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteResource(editResourceDialog.topicId, 'videos', video.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ))}

            {editResourceDialog.type === 'pdfs' && dialogTopic?.pdfs.map((pdf, idx) => (
              <Card key={pdf.id} className="p-3 border border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{idx + 1}</div>
                    <div>
                      <p className="text-sm font-medium">{pdf.title}</p>
                      <p className="text-xs text-muted-foreground">{pdf.pages} pages · {pdf.type}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteResource(editResourceDialog.topicId, 'pdfs', pdf.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ))}

            {editResourceDialog.type === 'tests' && dialogTopic?.tests.map((test, idx) => (
              <Card key={test.id} className="p-3 border border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{idx + 1}</div>
                    <div>
                      <p className="text-sm font-medium">{test.title}</p>
                      <p className="text-xs text-muted-foreground">{test.questions} questions · {test.duration} · {test.difficulty}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteResource(editResourceDialog.topicId, 'tests', test.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ))}

            {/* Add Resource Form */}
            {showAddResourceForm && (
              <Card className="p-4 border-2 border-dashed border-primary/30">
                <div className="space-y-3">
                  <Input placeholder="Title" value={addResourceForm.title} onChange={e => setAddResourceForm(p => ({ ...p, title: e.target.value }))} />
                  {editResourceDialog.type === 'videos' && (
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="Instructor" value={addResourceForm.instructor} onChange={e => setAddResourceForm(p => ({ ...p, instructor: e.target.value }))} />
                      <Input placeholder="Duration (e.g. 15 min)" value={addResourceForm.duration} onChange={e => setAddResourceForm(p => ({ ...p, duration: e.target.value }))} />
                    </div>
                  )}
                  {editResourceDialog.type === 'pdfs' && (
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="Pages" value={addResourceForm.pages} onChange={e => setAddResourceForm(p => ({ ...p, pages: e.target.value }))} />
                      <Input placeholder="Type (Notes/PYQs)" value={addResourceForm.type} onChange={e => setAddResourceForm(p => ({ ...p, type: e.target.value }))} />
                    </div>
                  )}
                  {editResourceDialog.type === 'tests' && (
                    <div className="grid grid-cols-3 gap-3">
                      <Input placeholder="Questions" value={addResourceForm.questions} onChange={e => setAddResourceForm(p => ({ ...p, questions: e.target.value }))} />
                      <Input placeholder="Duration" value={addResourceForm.duration} onChange={e => setAddResourceForm(p => ({ ...p, duration: e.target.value }))} />
                      <Select value={addResourceForm.difficulty} onValueChange={v => setAddResourceForm(p => ({ ...p, difficulty: v }))}>
                        <SelectTrigger><SelectValue placeholder="Difficulty" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddResource}><Save className="h-3.5 w-3.5 mr-1" /> Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setShowAddResourceForm(false)}>Cancel</Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditResourceDialog(prev => ({ ...prev, isOpen: false })); setShowAddResourceForm(false); }}>Close</Button>
            {!showAddResourceForm && (
              <Button className="gap-1.5" onClick={() => setShowAddResourceForm(true)}>
                <Plus className="h-4 w-4" /> Add {editResourceDialog.type === 'pdfs' ? 'PDF' : editResourceDialog.type === 'tests' ? 'Test' : 'Video'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog open={bulkUploadDialog} onOpenChange={setBulkUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Bulk Upload Syllabus</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Card className="p-6 border-2 border-dashed border-border text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Upload CSV or Excel file</p>
              <p className="text-xs text-muted-foreground mt-1">Format: Subject, Topic, Videos, PDFs, Tests</p>
              <Button variant="outline" size="sm" className="mt-3">Choose File</Button>
            </Card>
            <Button variant="link" size="sm" className="text-xs gap-1 p-0">
              <Download className="h-3 w-3" /> Download Template
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkUploadDialog(false)}>Cancel</Button>
            <Button onClick={() => { setBulkUploadDialog(false); toast({ title: 'Upload complete', type: 'success' }); }} className="gap-1.5"><Upload className="h-4 w-4" /> Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageSyllabus;
