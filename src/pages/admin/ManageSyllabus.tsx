import React, { useState, useMemo, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Clock, Target, CheckCircle2, Calendar, Search, Plus, Edit, Trash2, Eye,
  Upload, MoreVertical, GripVertical, AlertCircle, Save, X,
  Download, RotateCcw, ExternalLink, Pencil
} from 'lucide-react';
import {
  ExamSyllabusConfig,
  TopicConfig,
  SubjectConfig,
  TierConfig,
  VideoResource,
  PdfResource,
  TestResource,
} from '@/data/syllabusData';
import { useSyllabusStore, tierMutators } from '@/hooks/useSyllabusStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { ResourceForm } from '@/components/admin/syllabus/ResourceForm';

const ManageSyllabus = () => {
  const { data: syllabusData, updateExam, upsertExam, deleteExam, resetToDefaults, exportJSON, importJSON } =
    useSyllabusStore();

  const allExams = Object.values(syllabusData);
  const [selectedExam, setSelectedExam] = useState<string>(allExams[0]?.examId || '');
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const importFileRef = useRef<HTMLInputElement>(null);
  const csvFileRef = useRef<HTMLInputElement>(null);

  // Dialog states
  const [addExamDialog, setAddExamDialog] = useState(false);
  const [editExamDialog, setEditExamDialog] = useState(false);
  const [addTierDialog, setAddTierDialog] = useState(false);
  const [editTierDialog, setEditTierDialog] = useState(false);
  const [addSubjectDialog, setAddSubjectDialog] = useState(false);
  const [addTopicDialog, setAddTopicDialog] = useState(false);
  const [bulkUploadDialog, setBulkUploadDialog] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [activeSubjectId, setActiveSubjectId] = useState('');

  const [resourceDialog, setResourceDialog] = useState<{
    isOpen: boolean;
    topicId: string;
    subjectId: string;
    type: 'videos' | 'pdfs' | 'tests';
    editingId?: string | null;
    showForm?: boolean;
  }>({ isOpen: false, topicId: '', subjectId: '', type: 'videos' });

  const [editTopicDialog, setEditTopicDialog] = useState<{ isOpen: boolean; topicId: string; subjectId: string; name: string; description: string }>({ isOpen: false, topicId: '', subjectId: '', name: '', description: '' });
  const [editSubjectDialog, setEditSubjectDialog] = useState<{ isOpen: boolean; subjectId: string; name: string; marks: string; iconBg: string }>({ isOpen: false, subjectId: '', name: '', marks: '', iconBg: 'bg-blue-50' });

  // Form states
  const [newExamForm, setNewExamForm] = useState({ shortName: '', fullName: '', category: 'banking', stages: '', examDate: '', logo: '' });
  const [examEditForm, setExamEditForm] = useState({ shortName: '', fullName: '', category: 'banking', stages: '', examDate: '', logo: '' });
  const [newTierForm, setNewTierForm] = useState({ name: '', duration: '', totalMarks: '', negativeMarking: '', sectionalCutoff: false });
  const [tierEditForm, setTierEditForm] = useState({ id: '', name: '', duration: '', totalMarks: '', negativeMarking: '', sectionalCutoff: false });
  const [newSubjectForm, setNewSubjectForm] = useState({ name: '', marks: '', iconBg: 'bg-blue-50' });
  const [newTopicForm, setNewTopicForm] = useState({ name: '', description: '' });
  const [csvPreview, setCsvPreview] = useState<Array<Record<string, string>>>([]);

  const examConfig = syllabusData[selectedExam];

  React.useEffect(() => {
    if (examConfig && examConfig.tiers.length > 0) {
      const exists = examConfig.tiers.find((t) => t.id === selectedTier);
      if (!exists) setSelectedTier(examConfig.tiers[0].id);
    } else {
      setSelectedTier('');
    }
  }, [selectedExam, examConfig, selectedTier]);

  React.useEffect(() => {
    if (!selectedExam && allExams[0]) setSelectedExam(allExams[0].examId);
  }, [selectedExam, allExams]);

  const currentTier = examConfig?.tiers.find(t => t.id === selectedTier) || examConfig?.tiers[0];

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

  const tryUpdate = (fn: () => void, successMsg?: string) => {
    try {
      fn();
      if (successMsg) toast({ title: successMsg, type: 'success' });
    } catch (e: any) {
      toast({ title: 'Save failed', description: e?.message || 'Unknown error', type: 'error' });
    }
  };

  // ===== CRUD =====
  const handleAddExam = () => {
    if (!newExamForm.shortName || !newExamForm.fullName) return;
    const examId = newExamForm.shortName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const newExam: ExamSyllabusConfig = {
      examId,
      examName: newExamForm.shortName,
      fullName: newExamForm.fullName,
      category: newExamForm.category,
      stages: newExamForm.stages || 'Prelims + Mains',
      examDate: newExamForm.examDate || 'TBD',
      logo: newExamForm.logo || 'https://upload.wikimedia.org/wikipedia/en/thumb/5/58/State_Bank_of_India_logo.svg/74px-State_Bank_of_India_logo.svg.png',
      tiers: []
    };
    tryUpdate(() => {
      upsertExam(newExam);
      setSelectedExam(examId);
      setAddExamDialog(false);
      setNewExamForm({ shortName: '', fullName: '', category: 'banking', stages: '', examDate: '', logo: '' });
    }, `Exam "${newExam.examName}" added`);
  };

  const openEditExam = () => {
    if (!examConfig) return;
    setExamEditForm({
      shortName: examConfig.examName,
      fullName: examConfig.fullName,
      category: examConfig.category,
      stages: examConfig.stages,
      examDate: examConfig.examDate,
      logo: examConfig.logo,
    });
    setEditExamDialog(true);
  };

  const handleEditExam = () => {
    tryUpdate(() => {
      updateExam(selectedExam, (e) => ({
        ...e,
        examName: examEditForm.shortName || e.examName,
        fullName: examEditForm.fullName || e.fullName,
        category: examEditForm.category || e.category,
        stages: examEditForm.stages || e.stages,
        examDate: examEditForm.examDate || e.examDate,
        logo: examEditForm.logo || e.logo,
      }));
      setEditExamDialog(false);
    }, 'Exam updated');
  };

  const handleDeleteExam = () => {
    if (!examConfig) return;
    if (!confirm(`Delete "${examConfig.examName}" and all its subjects/topics? This cannot be undone.`)) return;
    tryUpdate(() => {
      deleteExam(selectedExam);
      const remaining = Object.keys(syllabusData).filter(k => k !== selectedExam);
      setSelectedExam(remaining[0] || '');
    }, 'Exam deleted');
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
    tryUpdate(() => {
      updateExam(selectedExam, (e) => ({ ...e, tiers: [...e.tiers, newTier] }));
      setSelectedTier(tierId);
      setAddTierDialog(false);
      setNewTierForm({ name: '', duration: '', totalMarks: '', negativeMarking: '', sectionalCutoff: false });
    }, `Tier "${newTier.name}" added`);
  };

  const openEditTier = () => {
    if (!currentTier) return;
    setTierEditForm({
      id: currentTier.id,
      name: currentTier.name,
      duration: currentTier.duration,
      totalMarks: String(currentTier.totalMarks),
      negativeMarking: currentTier.negativeMarking,
      sectionalCutoff: currentTier.sectionalCutoff,
    });
    setEditTierDialog(true);
  };

  const handleEditTier = () => {
    tryUpdate(() => {
      updateExam(selectedExam, (e) =>
        tierMutators.mapTier(e, tierEditForm.id, (t) => ({
          ...t,
          name: tierEditForm.name || t.name,
          duration: tierEditForm.duration || t.duration,
          totalMarks: Number(tierEditForm.totalMarks) || t.totalMarks,
          negativeMarking: tierEditForm.negativeMarking || t.negativeMarking,
          sectionalCutoff: tierEditForm.sectionalCutoff,
        }))
      );
      setEditTierDialog(false);
    }, 'Tier updated');
  };

  const handleDeleteTier = () => {
    if (!currentTier) return;
    if (!confirm(`Delete tier "${currentTier.name}"?`)) return;
    tryUpdate(() => {
      updateExam(selectedExam, (e) => ({ ...e, tiers: e.tiers.filter((t) => t.id !== currentTier.id) }));
      setSelectedTier('');
    }, 'Tier deleted');
  };

  const handleAddSubject = () => {
    if (!newSubjectForm.name || !currentTier) return;
    const subjectId = newSubjectForm.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const newSubject: SubjectConfig = {
      id: subjectId,
      name: newSubjectForm.name,
      marks: Number(newSubjectForm.marks) || 35,
      iconName: 'BookOpen',
      iconBg: newSubjectForm.iconBg,
      topics: []
    };
    tryUpdate(() => {
      updateExam(selectedExam, (e) =>
        tierMutators.mapTier(e, currentTier.id, (t) => ({ ...t, subjects: [...t.subjects, newSubject] }))
      );
      setAddSubjectDialog(false);
      setNewSubjectForm({ name: '', marks: '', iconBg: 'bg-blue-50' });
    }, `Subject "${newSubject.name}" added`);
  };

  const handleEditSubject = () => {
    if (!editSubjectDialog.name || !currentTier) return;
    tryUpdate(() => {
      updateExam(selectedExam, (e) =>
        tierMutators.mapSubject(e, currentTier.id, editSubjectDialog.subjectId, (s) => ({
          ...s,
          name: editSubjectDialog.name,
          marks: Number(editSubjectDialog.marks) || s.marks,
          iconBg: editSubjectDialog.iconBg || s.iconBg,
        }))
      );
      setEditSubjectDialog({ isOpen: false, subjectId: '', name: '', marks: '', iconBg: 'bg-blue-50' });
    }, 'Subject updated');
  };

  const handleDeleteSubject = (subjectId: string) => {
    if (!currentTier) return;
    if (!confirm('Delete this subject and all its topics?')) return;
    tryUpdate(() => {
      updateExam(selectedExam, (e) =>
        tierMutators.mapTier(e, currentTier.id, (t) => ({ ...t, subjects: t.subjects.filter((s) => s.id !== subjectId) }))
      );
    }, 'Subject deleted');
  };

  const handleAddTopic = () => {
    if (!newTopicForm.name || !activeSubjectId || !currentTier) return;
    const topicId = newTopicForm.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const newTopic: TopicConfig = {
      id: topicId,
      name: newTopicForm.name,
      progress: 0,
      description: newTopicForm.description || undefined,
      videos: [],
      pdfs: [],
      tests: []
    };
    tryUpdate(() => {
      updateExam(selectedExam, (e) =>
        tierMutators.mapSubject(e, currentTier.id, activeSubjectId, (s) => ({ ...s, topics: [...s.topics, newTopic] }))
      );
      setAddTopicDialog(false);
      setNewTopicForm({ name: '', description: '' });
    }, 'Topic added');
  };

  const handleEditTopic = () => {
    if (!editTopicDialog.name || !currentTier) return;
    tryUpdate(() => {
      updateExam(selectedExam, (e) =>
        tierMutators.mapTopic(e, currentTier.id, editTopicDialog.subjectId, editTopicDialog.topicId, (tp) => ({
          ...tp,
          name: editTopicDialog.name,
          description: editTopicDialog.description || undefined,
        }))
      );
      setEditTopicDialog({ isOpen: false, topicId: '', subjectId: '', name: '', description: '' });
    }, 'Topic updated');
  };

  const handleDeleteTopic = (subjectId: string, topicId: string) => {
    if (!currentTier) return;
    if (!confirm('Delete this topic?')) return;
    tryUpdate(() => {
      updateExam(selectedExam, (e) =>
        tierMutators.mapSubject(e, currentTier.id, subjectId, (s) => ({ ...s, topics: s.topics.filter((tp) => tp.id !== topicId) }))
      );
    }, 'Topic deleted');
  };

  // Resource ops
  const dialogTopic = useMemo<TopicConfig | null>(() => {
    if (!currentTier || !resourceDialog.topicId) return null;
    for (const subject of currentTier.subjects) {
      const topic = subject.topics.find(t => t.id === resourceDialog.topicId);
      if (topic) return topic;
    }
    return null;
  }, [currentTier, resourceDialog.topicId]);

  const editingResource = useMemo(() => {
    if (!dialogTopic || !resourceDialog.editingId) return null;
    if (resourceDialog.type === 'videos') return dialogTopic.videos.find((v) => v.id === resourceDialog.editingId) || null;
    if (resourceDialog.type === 'pdfs') return dialogTopic.pdfs.find((v) => v.id === resourceDialog.editingId) || null;
    return dialogTopic.tests.find((v) => v.id === resourceDialog.editingId) || null;
  }, [dialogTopic, resourceDialog]);

  const saveResource = (resource: VideoResource | PdfResource | TestResource) => {
    if (!currentTier) return;
    const { topicId, subjectId, type, editingId } = resourceDialog;
    tryUpdate(() => {
      updateExam(selectedExam, (e) =>
        tierMutators.mapTopic(e, currentTier.id, subjectId, topicId, (tp) => {
          if (type === 'videos') {
            const arr = editingId ? tp.videos.map((v) => (v.id === editingId ? (resource as VideoResource) : v)) : [...tp.videos, resource as VideoResource];
            return { ...tp, videos: arr };
          }
          if (type === 'pdfs') {
            const arr = editingId ? tp.pdfs.map((v) => (v.id === editingId ? (resource as PdfResource) : v)) : [...tp.pdfs, resource as PdfResource];
            return { ...tp, pdfs: arr };
          }
          const arr = editingId ? tp.tests.map((v) => (v.id === editingId ? (resource as TestResource) : v)) : [...tp.tests, resource as TestResource];
          return { ...tp, tests: arr };
        })
      );
      setResourceDialog((p) => ({ ...p, editingId: null, showForm: false }));
    }, editingId ? 'Resource updated' : 'Resource added');
  };

  const handleDeleteResource = (topicId: string, type: 'videos' | 'pdfs' | 'tests', resourceId: string) => {
    if (!currentTier) return;
    tryUpdate(() => {
      updateExam(selectedExam, (e) => ({
        ...e,
        tiers: e.tiers.map((t) =>
          t.id !== currentTier.id
            ? t
            : {
                ...t,
                subjects: t.subjects.map((s) => ({
                  ...s,
                  topics: s.topics.map((tp) => {
                    if (tp.id !== topicId) return tp;
                    if (type === 'videos') return { ...tp, videos: tp.videos.filter((v) => v.id !== resourceId) };
                    if (type === 'pdfs') return { ...tp, pdfs: tp.pdfs.filter((v) => v.id !== resourceId) };
                    return { ...tp, tests: tp.tests.filter((v) => v.id !== resourceId) };
                  }),
                })),
              }
        ),
      }));
    }, 'Resource deleted');
  };

  // ===== Header utilities =====
  const handleExport = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `syllabus-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Syllabus exported', type: 'success' });
  };

  const handleImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importJSON(String(reader.result));
        toast({ title: 'Syllabus imported', type: 'success' });
      } catch (e: any) {
        toast({ title: 'Import failed', description: e?.message || 'Invalid JSON', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  // ===== Bulk CSV upload =====
  const parseCSV = (text: string): Array<Record<string, string>> => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (!lines.length) return [];
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    return lines.slice(1).map((line) => {
      const cols = line.split(',').map((c) => c.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, i) => (row[h] = cols[i] || ''));
      return row;
    });
  };

  const handleCsvFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const rows = parseCSV(String(reader.result));
      setCsvPreview(rows);
    };
    reader.readAsText(file);
  };

  const applyBulk = () => {
    if (!currentTier || !csvPreview.length) return;
    tryUpdate(() => {
      updateExam(selectedExam, (e) =>
        tierMutators.mapTier(e, currentTier.id, (t) => {
          let subjects = [...t.subjects];
          for (const row of csvPreview) {
            const subjectName = row.subject;
            const topicName = row.topic;
            const resourceType = (row.resource_type || '').toLowerCase();
            if (!subjectName || !topicName) continue;

            let subj = subjects.find((s) => s.name.toLowerCase() === subjectName.toLowerCase());
            if (!subj) {
              subj = {
                id: `${subjectName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                name: subjectName,
                marks: 0,
                iconName: 'BookOpen',
                iconBg: 'bg-blue-50',
                topics: [],
              };
              subjects = [...subjects, subj];
            } else {
              subjects = subjects.map((s) => (s.id === subj!.id ? { ...s, topics: [...s.topics] } : s));
              subj = subjects.find((s) => s.id === subj!.id)!;
            }

            let topic = subj.topics.find((tp) => tp.name.toLowerCase() === topicName.toLowerCase());
            if (!topic) {
              topic = { id: `${topicName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name: topicName, progress: 0, videos: [], pdfs: [], tests: [] };
              subj.topics.push(topic);
            }

            const id = `${resourceType}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
            if (resourceType === 'video' && row.title) {
              topic.videos.push({
                id,
                title: row.title,
                instructor: row.instructor || 'Instructor',
                duration: row.duration || '15 min',
                rating: 4.5,
                completed: false,
                url: row.url_or_filename || '',
                source: 'external',
              });
            } else if (resourceType === 'pdf' && row.title) {
              topic.pdfs.push({
                id,
                title: row.title,
                pages: Number(row.pages) || 10,
                type: 'notes',
                url: row.url_or_filename || '',
              });
            } else if (resourceType === 'test' && row.title) {
              topic.tests.push({
                id,
                title: row.title,
                questions: Number(row.questions) || 20,
                duration: row.duration || '20 min',
                difficulty: ((row.difficulty || 'medium').toLowerCase() as TestResource['difficulty']),
                url: row.url_or_filename || undefined,
              });
            }
          }
          return { ...t, subjects };
        })
      );
      setBulkUploadDialog(false);
      setCsvPreview([]);
    }, `Imported ${csvPreview.length} rows`);
  };

  const downloadCsvTemplate = () => {
    const csv = 'subject,topic,resource_type,title,url_or_filename,duration,pages,questions,difficulty,instructor\nQuantitative Aptitude,Number Systems,video,Basics of Numbers,https://youtu.be/abc,30 min,,,,Rahul Sharma\nQuantitative Aptitude,Number Systems,pdf,Number Systems Notes,https://example.com/notes.pdf,,15,,,\nQuantitative Aptitude,Number Systems,test,Number Systems Practice,,20 min,,25,medium,';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'syllabus-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

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
            Add, edit and organize exam syllabus, subjects, topics & resources. Saved locally in this browser.
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1.5"><MoreVertical className="h-4 w-4" /> Tools</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExport}><Download className="h-4 w-4 mr-2" /> Export JSON</DropdownMenuItem>
              <DropdownMenuItem onClick={() => importFileRef.current?.click()}><Upload className="h-4 w-4 mr-2" /> Import JSON</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setBulkUploadDialog(true)}><Upload className="h-4 w-4 mr-2" /> Bulk CSV Upload</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => setConfirmReset(true)}>
                <RotateCcw className="h-4 w-4 mr-2" /> Reset to Defaults
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            ref={importFileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImportFile(f); e.target.value = ''; }}
          />
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
                      <DropdownMenuItem onClick={openEditExam}><Edit className="h-4 w-4 mr-2" /> Edit Exam Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={handleDeleteExam}><Trash2 className="h-4 w-4 mr-2" /> Delete Exam</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">{examConfig.stages}</Badge>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {examConfig.examDate}</span>
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
      <div className="flex items-center justify-between gap-4 flex-wrap">
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
          {currentTier && (
            <>
              <Button size="sm" variant="ghost" onClick={openEditTier} className="gap-1.5">
                <Pencil className="h-3.5 w-3.5" /> Edit Tier
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDeleteTier} className="gap-1.5 text-destructive hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
          <Button size="sm" variant="outline" onClick={() => setAddTierDialog(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add Tier
          </Button>
          <Button size="sm" variant="outline" onClick={() => setAddSubjectDialog(true)} className="gap-1.5" disabled={!currentTier}>
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

      {/* Subjects */}
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
                      <DropdownMenuItem onClick={() => setEditSubjectDialog({ isOpen: true, subjectId: subject.id, name: subject.name, marks: String(subject.marks), iconBg: subject.iconBg })}>
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
                            <TableCell><GripVertical className="h-4 w-4 text-muted-foreground/50" /></TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{topic.name}</p>
                                {topic.description && <p className="text-xs text-muted-foreground">{topic.description}</p>}
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
                                onClick={() => setResourceDialog({ isOpen: true, topicId: topic.id, subjectId: subject.id, type: 'videos', editingId: null, showForm: false })}
                                className="inline-flex items-center gap-1 text-sm hover:text-primary transition-colors"
                              >
                                <Video className="h-3.5 w-3.5" />
                                <span className="font-medium">{topic.videos.length}</span>
                              </button>
                            </TableCell>
                            <TableCell className="text-center">
                              <button
                                onClick={() => setResourceDialog({ isOpen: true, topicId: topic.id, subjectId: subject.id, type: 'pdfs', editingId: null, showForm: false })}
                                className="inline-flex items-center gap-1 text-sm hover:text-primary transition-colors"
                              >
                                <FileText className="h-3.5 w-3.5" />
                                <span className="font-medium">{topic.pdfs.length}</span>
                              </button>
                            </TableCell>
                            <TableCell className="text-center">
                              <button
                                onClick={() => setResourceDialog({ isOpen: true, topicId: topic.id, subjectId: subject.id, type: 'tests', editingId: null, showForm: false })}
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
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditTopicDialog({ isOpen: true, topicId: topic.id, subjectId: subject.id, name: topic.name, description: topic.description || '' })}>
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

      {/* Add Exam */}
      <Dialog open={addExamDialog} onOpenChange={setAddExamDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add New Exam</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Short Name *</Label>
                <Input className="mt-1" value={newExamForm.shortName} onChange={e => setNewExamForm(p => ({ ...p, shortName: e.target.value }))} />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={newExamForm.category} onValueChange={v => setNewExamForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
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
              <Label>Full Name *</Label>
              <Input className="mt-1" value={newExamForm.fullName} onChange={e => setNewExamForm(p => ({ ...p, fullName: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Stages</Label>
                <Input className="mt-1" value={newExamForm.stages} onChange={e => setNewExamForm(p => ({ ...p, stages: e.target.value }))} />
              </div>
              <div>
                <Label>Exam Date</Label>
                <Input className="mt-1" value={newExamForm.examDate} onChange={e => setNewExamForm(p => ({ ...p, examDate: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Logo URL</Label>
              <Input className="mt-1" value={newExamForm.logo} onChange={e => setNewExamForm(p => ({ ...p, logo: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddExamDialog(false)}>Cancel</Button>
            <Button onClick={handleAddExam} className="gap-1.5"><Save className="h-4 w-4" /> Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Exam */}
      <Dialog open={editExamDialog} onOpenChange={setEditExamDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit Exam Details</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Short Name</Label>
                <Input className="mt-1" value={examEditForm.shortName} onChange={e => setExamEditForm(p => ({ ...p, shortName: e.target.value }))} />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={examEditForm.category} onValueChange={v => setExamEditForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
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
              <Input className="mt-1" value={examEditForm.fullName} onChange={e => setExamEditForm(p => ({ ...p, fullName: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Stages</Label>
                <Input className="mt-1" value={examEditForm.stages} onChange={e => setExamEditForm(p => ({ ...p, stages: e.target.value }))} />
              </div>
              <div>
                <Label>Exam Date</Label>
                <Input className="mt-1" value={examEditForm.examDate} onChange={e => setExamEditForm(p => ({ ...p, examDate: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Logo URL</Label>
              <Input className="mt-1" value={examEditForm.logo} onChange={e => setExamEditForm(p => ({ ...p, logo: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditExamDialog(false)}>Cancel</Button>
            <Button onClick={handleEditExam} className="gap-1.5"><Save className="h-4 w-4" /> Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tier */}
      <Dialog open={addTierDialog} onOpenChange={setAddTierDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add New Tier / Stage</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tier Name</Label>
              <Input className="mt-1" value={newTierForm.name} onChange={e => setNewTierForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duration</Label>
                <Input className="mt-1" value={newTierForm.duration} onChange={e => setNewTierForm(p => ({ ...p, duration: e.target.value }))} />
              </div>
              <div>
                <Label>Total Marks</Label>
                <Input type="number" className="mt-1" value={newTierForm.totalMarks} onChange={e => setNewTierForm(p => ({ ...p, totalMarks: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Negative Marking</Label>
                <Input className="mt-1" value={newTierForm.negativeMarking} onChange={e => setNewTierForm(p => ({ ...p, negativeMarking: e.target.value }))} />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch id="sc-add" checked={newTierForm.sectionalCutoff} onCheckedChange={v => setNewTierForm(p => ({ ...p, sectionalCutoff: v }))} />
                <Label htmlFor="sc-add">Sectional Cutoff</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTierDialog(false)}>Cancel</Button>
            <Button onClick={handleAddTier} className="gap-1.5"><Save className="h-4 w-4" /> Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tier */}
      <Dialog open={editTierDialog} onOpenChange={setEditTierDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit Tier</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tier Name</Label>
              <Input className="mt-1" value={tierEditForm.name} onChange={e => setTierEditForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duration</Label>
                <Input className="mt-1" value={tierEditForm.duration} onChange={e => setTierEditForm(p => ({ ...p, duration: e.target.value }))} />
              </div>
              <div>
                <Label>Total Marks</Label>
                <Input type="number" className="mt-1" value={tierEditForm.totalMarks} onChange={e => setTierEditForm(p => ({ ...p, totalMarks: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Negative Marking</Label>
                <Input className="mt-1" value={tierEditForm.negativeMarking} onChange={e => setTierEditForm(p => ({ ...p, negativeMarking: e.target.value }))} />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch id="sc-edit" checked={tierEditForm.sectionalCutoff} onCheckedChange={v => setTierEditForm(p => ({ ...p, sectionalCutoff: v }))} />
                <Label htmlFor="sc-edit">Sectional Cutoff</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTierDialog(false)}>Cancel</Button>
            <Button onClick={handleEditTier} className="gap-1.5"><Save className="h-4 w-4" /> Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subject */}
      <Dialog open={addSubjectDialog} onOpenChange={setAddSubjectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add New Subject</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Subject Name</Label>
              <Input className="mt-1" value={newSubjectForm.name} onChange={e => setNewSubjectForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Marks</Label>
                <Input type="number" className="mt-1" value={newSubjectForm.marks} onChange={e => setNewSubjectForm(p => ({ ...p, marks: e.target.value }))} />
              </div>
              <div>
                <Label>Icon Color</Label>
                <Select value={newSubjectForm.iconBg} onValueChange={v => setNewSubjectForm(p => ({ ...p, iconBg: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
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
            <Button onClick={handleAddSubject} className="gap-1.5"><Save className="h-4 w-4" /> Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subject */}
      <Dialog open={editSubjectDialog.isOpen} onOpenChange={open => setEditSubjectDialog(p => ({ ...p, isOpen: open }))}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit Subject</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Subject Name</Label>
              <Input className="mt-1" value={editSubjectDialog.name} onChange={e => setEditSubjectDialog(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Marks</Label>
                <Input type="number" className="mt-1" value={editSubjectDialog.marks} onChange={e => setEditSubjectDialog(p => ({ ...p, marks: e.target.value }))} />
              </div>
              <div>
                <Label>Icon Color</Label>
                <Select value={editSubjectDialog.iconBg} onValueChange={v => setEditSubjectDialog(p => ({ ...p, iconBg: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
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
            <Button variant="outline" onClick={() => setEditSubjectDialog(p => ({ ...p, isOpen: false }))}>Cancel</Button>
            <Button onClick={handleEditSubject} className="gap-1.5"><Save className="h-4 w-4" /> Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Topic */}
      <Dialog open={addTopicDialog} onOpenChange={setAddTopicDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add New Topic</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Topic Name</Label>
              <Input className="mt-1" value={newTopicForm.name} onChange={e => setNewTopicForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Textarea className="mt-1" rows={3} value={newTopicForm.description} onChange={e => setNewTopicForm(p => ({ ...p, description: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTopicDialog(false)}>Cancel</Button>
            <Button onClick={handleAddTopic} className="gap-1.5"><Save className="h-4 w-4" /> Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Topic */}
      <Dialog open={editTopicDialog.isOpen} onOpenChange={open => setEditTopicDialog(p => ({ ...p, isOpen: open }))}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit Topic</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Topic Name</Label>
              <Input className="mt-1" value={editTopicDialog.name} onChange={e => setEditTopicDialog(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea className="mt-1" rows={3} value={editTopicDialog.description} onChange={e => setEditTopicDialog(p => ({ ...p, description: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTopicDialog(p => ({ ...p, isOpen: false }))}>Cancel</Button>
            <Button onClick={handleEditTopic} className="gap-1.5"><Save className="h-4 w-4" /> Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resource Manager */}
      <Dialog open={resourceDialog.isOpen} onOpenChange={(open) => { if (!open) setResourceDialog((p) => ({ ...p, isOpen: false, editingId: null, showForm: false })); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {resourceDialog.type === 'videos' && <Video className="h-5 w-5 text-primary" />}
              {resourceDialog.type === 'pdfs' && <FileText className="h-5 w-5 text-primary" />}
              {resourceDialog.type === 'tests' && <Target className="h-5 w-5 text-primary" />}
              Manage {resourceDialog.type === 'pdfs' ? 'PDFs' : resourceDialog.type === 'tests' ? 'Tests' : 'Videos'} — {dialogTopic?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {/* Existing list */}
            {resourceDialog.type === 'videos' && dialogTopic?.videos.map((video, idx) => (
              <Card key={video.id} className="p-3 border border-border/60">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{idx + 1}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{video.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {video.instructor} · {video.duration}
                        {video.source ? ` · ${video.source}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {video.url && !video.url.startsWith('data:') && (
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                        <a href={video.url} target="_blank" rel="noreferrer"><ExternalLink className="h-3.5 w-3.5" /></a>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setResourceDialog((p) => ({ ...p, editingId: video.id, showForm: true }))}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteResource(resourceDialog.topicId, 'videos', video.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {resourceDialog.type === 'pdfs' && dialogTopic?.pdfs.map((pdf, idx) => (
              <Card key={pdf.id} className="p-3 border border-border/60">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{idx + 1}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{pdf.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{pdf.pages} pages · {pdf.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {pdf.url && !pdf.url.startsWith('data:') && (
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                        <a href={pdf.url} target="_blank" rel="noreferrer"><ExternalLink className="h-3.5 w-3.5" /></a>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setResourceDialog((p) => ({ ...p, editingId: pdf.id, showForm: true }))}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteResource(resourceDialog.topicId, 'pdfs', pdf.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {resourceDialog.type === 'tests' && dialogTopic?.tests.map((test, idx) => (
              <Card key={test.id} className="p-3 border border-border/60">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{idx + 1}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{test.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{test.questions} questions · {test.duration} · {test.difficulty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setResourceDialog((p) => ({ ...p, editingId: test.id, showForm: true }))}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteResource(resourceDialog.topicId, 'tests', test.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {/* Form (add or edit) */}
            {resourceDialog.showForm && (
              <Card className="p-4 border-2 border-dashed border-primary/30">
                <ResourceForm
                  kind={resourceDialog.type}
                  initial={editingResource as any}
                  onCancel={() => setResourceDialog((p) => ({ ...p, editingId: null, showForm: false }))}
                  onSave={saveResource}
                />
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setResourceDialog((p) => ({ ...p, isOpen: false, editingId: null, showForm: false }))}>Close</Button>
            {!resourceDialog.showForm && (
              <Button className="gap-1.5" onClick={() => setResourceDialog((p) => ({ ...p, editingId: null, showForm: true }))}>
                <Plus className="h-4 w-4" /> Add {resourceDialog.type === 'pdfs' ? 'PDF' : resourceDialog.type === 'tests' ? 'Test' : 'Video'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk CSV Upload */}
      <Dialog open={bulkUploadDialog} onOpenChange={(o) => { setBulkUploadDialog(o); if (!o) setCsvPreview([]); }}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Bulk Upload via CSV</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Imports rows into the current tier <strong>{currentTier?.name || '—'}</strong>. Subjects/topics are created if missing.
            </p>
            <div
              onClick={() => csvFileRef.current?.click()}
              className="cursor-pointer rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-primary/40"
            >
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Click to choose CSV file</p>
              <p className="text-xs text-muted-foreground mt-1">Columns: subject, topic, resource_type (video/pdf/test), title, url_or_filename, duration, pages, questions, difficulty, instructor</p>
            </div>
            <input
              ref={csvFileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCsvFile(f); e.target.value = ''; }}
            />
            <div className="flex gap-2">
              <Button variant="link" size="sm" className="text-xs gap-1 p-0" onClick={downloadCsvTemplate}>
                <Download className="h-3 w-3" /> Download template
              </Button>
            </div>
            {csvPreview.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Preview ({csvPreview.length} rows)</p>
                <div className="border rounded-lg overflow-auto max-h-64">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Topic</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Title</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvPreview.slice(0, 50).map((r, i) => (
                        <TableRow key={i}>
                          <TableCell>{r.subject}</TableCell>
                          <TableCell>{r.topic}</TableCell>
                          <TableCell>{r.resource_type}</TableCell>
                          <TableCell>{r.title}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setBulkUploadDialog(false); setCsvPreview([]); }}>Cancel</Button>
            <Button onClick={applyBulk} disabled={!csvPreview.length || !currentTier} className="gap-1.5">
              <Upload className="h-4 w-4" /> Import {csvPreview.length} rows
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Reset */}
      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Reset to Defaults?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will discard all your local edits and restore the original syllabus data. This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmReset(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { resetToDefaults(); setConfirmReset(false); toast({ title: 'Reset to defaults', type: 'success' }); }} className="gap-1.5">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageSyllabus;
