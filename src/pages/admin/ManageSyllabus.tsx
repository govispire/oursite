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

const ManageSyllabus = () => {
  const allExams = Object.values(allSyllabusData);
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
    topic: TopicConfig | null;
    subjectName: string;
    type: 'videos' | 'pdfs' | 'tests';
  }>({ isOpen: false, topic: null, subjectName: '', type: 'videos' });
  const [bulkUploadDialog, setBulkUploadDialog] = useState(false);
  const [activeSubjectId, setActiveSubjectId] = useState('');

  const examConfig = allSyllabusData[selectedExam];

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

  if (!examConfig) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No syllabus data available.</p>
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
        {allExams.map((exam) => (
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

      {/* Exam Info Card — Admin View */}
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
                      <DropdownMenuItem><Copy className="h-4 w-4 mr-2" /> Duplicate Exam</DropdownMenuItem>
                      <DropdownMenuItem><Eye className="h-4 w-4 mr-2" /> Preview (Student View)</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Delete Exam</DropdownMenuItem>
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

            {/* Admin Stats */}
            <div className="grid grid-cols-5 gap-3">
              {[
                { label: 'Subjects', value: overallStats.totalSubjects, color: 'text-primary' },
                { label: 'Topics', value: overallStats.totalTopics, color: 'text-primary' },
                { label: 'Videos', value: overallStats.totalVideos, color: 'text-primary' },
                { label: 'PDFs', value: overallStats.totalPdfs, color: 'text-primary' },
                { label: 'Tests', value: overallStats.totalTests, color: 'text-primary' },
              ].map(stat => (
                <div key={stat.label} className="text-center p-2 bg-muted/30 rounded-lg">
                  <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tier Selector + Add Tier */}
      <div className="flex items-center justify-between gap-4">
        {examConfig.tiers.length > 1 && (
          <Tabs value={selectedTier} onValueChange={setSelectedTier}>
            <TabsList className="bg-muted/30 p-1">
              {examConfig.tiers.map((tier) => (
                <TabsTrigger
                  key={tier.id}
                  value={tier.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
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

      {/* Tier Info Cards */}
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

      {/* Subjects & Topics — Admin Table View */}
      <div className="space-y-3">
        {filteredSubjects.map((subject) => {
          const isExpanded = expandedSubjects.includes(subject.id);
          const subjectTopicCount = subject.topics.length;
          const subjectVideoCount = subject.topics.reduce((s, t) => s + t.videos.length, 0);
          const subjectPdfCount = subject.topics.reduce((s, t) => s + t.pdfs.length, 0);
          const subjectTestCount = subject.topics.reduce((s, t) => s + t.tests.length, 0);

          return (
            <Card key={subject.id} className="border border-border/60 overflow-hidden">
              {/* Subject Header */}
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
                      <DropdownMenuItem><Edit className="h-4 w-4 mr-2" /> Edit Subject</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setActiveSubjectId(subject.id); setAddTopicDialog(true); }}>
                        <Plus className="h-4 w-4 mr-2" /> Add Topic
                      </DropdownMenuItem>
                      <DropdownMenuItem><Copy className="h-4 w-4 mr-2" /> Duplicate Subject</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Delete Subject</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                </div>
              </div>

              {/* Topics Table */}
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
                        const missingResources = [];
                        if (topic.videos.length === 0) missingResources.push('Videos');
                        if (topic.pdfs.length === 0) missingResources.push('PDFs');
                        if (topic.tests.length === 0) missingResources.push('Tests');

                        return (
                          <TableRow key={topic.id} className="hover:bg-muted/10">
                            <TableCell>
                              <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab" />
                            </TableCell>
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
                                onClick={() => setEditResourceDialog({ isOpen: true, topic, subjectName: subject.name, type: 'videos' })}
                                className="inline-flex items-center gap-1 text-sm hover:text-primary transition-colors"
                              >
                                <Video className="h-3.5 w-3.5" />
                                <span className="font-medium">{topic.videos.length}</span>
                              </button>
                            </TableCell>
                            <TableCell className="text-center">
                              <button
                                onClick={() => setEditResourceDialog({ isOpen: true, topic, subjectName: subject.name, type: 'pdfs' })}
                                className="inline-flex items-center gap-1 text-sm hover:text-primary transition-colors"
                              >
                                <FileText className="h-3.5 w-3.5" />
                                <span className="font-medium">{topic.pdfs.length}</span>
                              </button>
                            </TableCell>
                            <TableCell className="text-center">
                              <button
                                onClick={() => setEditResourceDialog({ isOpen: true, topic, subjectName: subject.name, type: 'tests' })}
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
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setActiveSubjectId(subject.id); setAddTopicDialog(true); }}
                      className="gap-1.5 text-xs"
                    >
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
          <DialogHeader>
            <DialogTitle>Add New Exam</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Exam Short Name</Label>
                <Input placeholder="e.g. SBI PO" className="mt-1" />
              </div>
              <div>
                <Label>Category</Label>
                <Select>
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
              <Input placeholder="e.g. State Bank of India Probationary Officer" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Stages</Label>
                <Input placeholder="e.g. Prelims + Mains + Interview" className="mt-1" />
              </div>
              <div>
                <Label>Expected Exam Date</Label>
                <Input type="text" placeholder="e.g. Nov 2025" className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Logo URL</Label>
              <Input placeholder="https://..." className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddExamDialog(false)}>Cancel</Button>
            <Button onClick={() => setAddExamDialog(false)} className="gap-1.5"><Save className="h-4 w-4" /> Save Exam</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tier Dialog */}
      <Dialog open={addTierDialog} onOpenChange={setAddTierDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Tier / Stage</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tier Name</Label>
              <Input placeholder="e.g. Prelims" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duration</Label>
                <Input placeholder="e.g. 60 minutes" className="mt-1" />
              </div>
              <div>
                <Label>Total Marks</Label>
                <Input type="number" placeholder="100" className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Negative Marking</Label>
                <Input placeholder="e.g. -0.25 per wrong" className="mt-1" />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch id="sectional-cutoff" />
                <Label htmlFor="sectional-cutoff">Sectional Cutoff</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTierDialog(false)}>Cancel</Button>
            <Button onClick={() => setAddTierDialog(false)} className="gap-1.5"><Save className="h-4 w-4" /> Save Tier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subject Dialog */}
      <Dialog open={addSubjectDialog} onOpenChange={setAddSubjectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Subject Name</Label>
              <Input placeholder="e.g. Quantitative Aptitude" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Marks</Label>
                <Input type="number" placeholder="35" className="mt-1" />
              </div>
              <div>
                <Label>Icon Color</Label>
                <Select>
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
            <Button onClick={() => setAddSubjectDialog(false)} className="gap-1.5"><Save className="h-4 w-4" /> Save Subject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Topic Dialog */}
      <Dialog open={addTopicDialog} onOpenChange={setAddTopicDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Topic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Topic Name</Label>
              <Input placeholder="e.g. Number Systems" className="mt-1" />
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Textarea placeholder="Brief description of the topic..." className="mt-1" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTopicDialog(false)}>Cancel</Button>
            <Button onClick={() => setAddTopicDialog(false)} className="gap-1.5"><Save className="h-4 w-4" /> Save Topic</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Resources Dialog */}
      <Dialog open={editResourceDialog.isOpen} onOpenChange={(open) => setEditResourceDialog(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editResourceDialog.type === 'videos' && <Video className="h-5 w-5 text-primary" />}
              {editResourceDialog.type === 'pdfs' && <FileText className="h-5 w-5 text-primary" />}
              {editResourceDialog.type === 'tests' && <Target className="h-5 w-5 text-primary" />}
              Manage {editResourceDialog.type === 'pdfs' ? 'PDFs' : editResourceDialog.type === 'tests' ? 'Tests' : 'Videos'} — {editResourceDialog.topic?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {editResourceDialog.type === 'videos' && editResourceDialog.topic?.videos.map((video, idx) => (
              <Card key={video.id} className="p-3 border border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{idx + 1}</div>
                    <div>
                      <p className="text-sm font-medium">{video.title}</p>
                      <p className="text-xs text-muted-foreground">{video.instructor} · {video.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </Card>
            ))}

            {editResourceDialog.type === 'pdfs' && editResourceDialog.topic?.pdfs.map((pdf, idx) => (
              <Card key={pdf.id} className="p-3 border border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{idx + 1}</div>
                    <div>
                      <p className="text-sm font-medium">{pdf.title}</p>
                      <p className="text-xs text-muted-foreground">{pdf.pages} pages · {pdf.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </Card>
            ))}

            {editResourceDialog.type === 'tests' && editResourceDialog.topic?.tests.map((test, idx) => (
              <Card key={test.id} className="p-3 border border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{idx + 1}</div>
                    <div>
                      <p className="text-sm font-medium">{test.title}</p>
                      <p className="text-xs text-muted-foreground">{test.questions} questions · {test.duration} · {test.difficulty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditResourceDialog(prev => ({ ...prev, isOpen: false }))}>Close</Button>
            <Button className="gap-1.5"><Plus className="h-4 w-4" /> Add {editResourceDialog.type === 'pdfs' ? 'PDF' : editResourceDialog.type === 'tests' ? 'Test' : 'Video'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog open={bulkUploadDialog} onOpenChange={setBulkUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Upload Syllabus</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="p-6 border-2 border-dashed border-border text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Upload CSV or Excel file</p>
              <p className="text-xs text-muted-foreground mt-1">Format: Subject, Topic, Videos, PDFs, Tests</p>
              <Button variant="outline" size="sm" className="mt-3">Choose File</Button>
            </Card>
            <div>
              <Button variant="link" size="sm" className="text-xs gap-1 p-0">
                <Download className="h-3 w-3" /> Download Template
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkUploadDialog(false)}>Cancel</Button>
            <Button onClick={() => setBulkUploadDialog(false)} className="gap-1.5"><Upload className="h-4 w-4" /> Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageSyllabus;
