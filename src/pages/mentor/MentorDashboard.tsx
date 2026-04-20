import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Users, Target, MessageSquare, TrendingUp, Trophy, Calendar, Search, Plus, AlertCircle } from 'lucide-react';
import { mentorPool, LANGUAGE_LABELS, STAGE_LABELS, MentorLanguage, MentorStage } from '@/data/mentorPoolData';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface MentorStudent {
  id: string;
  name: string;
  photo: string;
  exam: string;
  stage: MentorStage;
  language: MentorLanguage;
  score: number;
  taskCompletion: number;
  lastActive: string;
  streak: number;
  status: 'active' | 'inactive' | 'at-risk';
}

const STUDENTS: MentorStudent[] = [
  { id: 's1', name: 'Rahul Sharma', photo: 'https://i.pravatar.cc/100?img=1', exam: 'IBPS PO', stage: 'prelims', language: 'hindi', score: 78, taskCompletion: 92, lastActive: '2h ago', streak: 14, status: 'active' },
  { id: 's2', name: 'Priya Patel', photo: 'https://i.pravatar.cc/100?img=5', exam: 'SSC CGL', stage: 'mains', language: 'english', score: 65, taskCompletion: 70, lastActive: '4h ago', streak: 7, status: 'active' },
  { id: 's3', name: 'Amit Kumar', photo: 'https://i.pravatar.cc/100?img=8', exam: 'UPSC CSE', stage: 'mains', language: 'hindi', score: 52, taskCompletion: 40, lastActive: '2d ago', streak: 0, status: 'at-risk' },
  { id: 's4', name: 'Sneha Gupta', photo: 'https://i.pravatar.cc/100?img=9', exam: 'CAT', stage: 'overall', language: 'english', score: 88, taskCompletion: 96, lastActive: '30m ago', streak: 28, status: 'active' },
  { id: 's5', name: 'Karthik Iyer', photo: 'https://i.pravatar.cc/100?img=12', exam: 'SBI Clerk', stage: 'prelims', language: 'tamil', score: 71, taskCompletion: 85, lastActive: '1h ago', streak: 12, status: 'active' },
  { id: 's6', name: 'Lakshmi Nair', photo: 'https://i.pravatar.cc/100?img=20', exam: 'TNPSC Group 2', stage: 'prelims', language: 'malayalam', score: 60, taskCompletion: 55, lastActive: '5h ago', streak: 4, status: 'active' },
  { id: 's7', name: 'Manoj Reddy', photo: 'https://i.pravatar.cc/100?img=14', exam: 'RBI Grade B', stage: 'mains', language: 'telugu', score: 75, taskCompletion: 80, lastActive: '1h ago', streak: 18, status: 'active' },
  { id: 's8', name: 'Divya Krishnan', photo: 'https://i.pravatar.cc/100?img=25', exam: 'IBPS Clerk', stage: 'prelims', language: 'kannada', score: 45, taskCompletion: 30, lastActive: '3d ago', streak: 0, status: 'inactive' },
];

const TREND_DATA = [
  { week: 'W1', avg: 58 }, { week: 'W2', avg: 62 }, { week: 'W3', avg: 65 }, { week: 'W4', avg: 70 }, { week: 'W5', avg: 73 }, { week: 'W6', avg: 76 },
];

const TASK_TEMPLATES = [
  '20 Quant questions', '1 Reasoning puzzle', '1 English RC', 'Daily current affairs', '1 Sectional mock', 'Weak-area revision',
];

const MentorDashboard: React.FC = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<MentorStudent | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskTarget, setTaskTarget] = useState<string>('all');
  const [chatStudent, setChatStudent] = useState<string | null>(null);
  const [chatText, setChatText] = useState('');

  const filtered = useMemo(() => STUDENTS.filter(s =>
    (stageFilter === 'all' || s.stage === stageFilter) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  ), [search, stageFilter]);

  const totalStudents = STUDENTS.length;
  const todayCompletion = Math.round(STUDENTS.reduce((s, x) => s + x.taskCompletion, 0) / STUDENTS.length);
  const atRisk = STUDENTS.filter(s => s.status === 'at-risk' || s.status === 'inactive').length;
  const top = [...STUDENTS].sort((a, b) => b.taskCompletion - a.taskCompletion);

  const assignTask = () => {
    if (!taskTitle.trim()) return;
    toast({ title: 'Task assigned', description: `"${taskTitle}" → ${taskTarget === 'all' ? 'all students' : taskTarget}` });
    setTaskTitle('');
  };

  const sendChat = () => {
    if (!chatText.trim() || !chatStudent) return;
    toast({ title: 'Message sent', description: `To ${chatStudent}` });
    setChatText('');
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">Mentor Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your batch of students.</p>
        </div>
        <Badge variant="secondary" className="text-sm">{totalStudents}/20 students</Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat icon={<Users className="w-4 h-4" />} label="Students" value={`${totalStudents}`} />
        <Stat icon={<Target className="w-4 h-4" />} label="Today completion" value={`${todayCompletion}%`} />
        <Stat icon={<MessageSquare className="w-4 h-4" />} label="Pending msgs" value="3" />
        <Stat icon={<AlertCircle className="w-4 h-4" />} label="At risk" value={`${atRisk}`} />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card><CardContent className="p-4">
            <h3 className="font-semibold mb-3">Batch trend (avg score)</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Line type="monotone" dataKey="avg" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-3 mt-4">
          <div className="flex gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stages</SelectItem>
                {Object.entries(STAGE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {filtered.map(s => (
              <Card key={s.id} className="cursor-pointer hover:border-primary/50" onClick={() => setSelectedStudent(s)}>
                <CardContent className="p-4 flex gap-3">
                  <img src={s.photo} alt={s.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium truncate">{s.name}</div>
                      <Badge variant={s.status === 'active' ? 'secondary' : s.status === 'at-risk' ? 'destructive' : 'outline'} className="text-[10px]">{s.status}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{s.exam} · {STAGE_LABELS[s.stage]} · {LANGUAGE_LABELS[s.language]}</div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>Score {s.score}%</span><span>Tasks {s.taskCompletion}%</span>
                    </div>
                    <Progress value={s.taskCompletion} className="h-1.5 mt-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Dialog open={!!selectedStudent} onOpenChange={(o) => !o && setSelectedStudent(null)}>
            <DialogContent className="max-w-lg">
              {selectedStudent && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                      <img src={selectedStudent.photo} className="w-10 h-10 rounded-full" />
                      {selectedStudent.name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <Info label="Exam" value={selectedStudent.exam} />
                      <Info label="Stage" value={STAGE_LABELS[selectedStudent.stage]} />
                      <Info label="Language" value={LANGUAGE_LABELS[selectedStudent.language]} />
                      <Info label="Streak" value={`${selectedStudent.streak} days`} />
                      <Info label="Score" value={`${selectedStudent.score}%`} />
                      <Info label="Last active" value={selectedStudent.lastActive} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold mb-1">Task completion</div>
                      <Progress value={selectedStudent.taskCompletion} className="h-2" />
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => { setChatStudent(selectedStudent.name); setSelectedStudent(null); setTab('chat'); }}>
                      <MessageSquare className="w-4 h-4 mr-1" />Message
                    </Button>
                    <Button onClick={() => { setTaskTarget(selectedStudent.name); setSelectedStudent(null); setTab('tasks'); }}>
                      <Plus className="w-4 h-4 mr-1" />Assign Task
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-3 mt-4">
          <Card><CardContent className="p-4 space-y-3">
            <h3 className="font-semibold">Assign Task</h3>
            <div className="flex flex-wrap gap-2">
              {TASK_TEMPLATES.map(t => (
                <Button key={t} size="sm" variant="outline" onClick={() => setTaskTitle(t)}>{t}</Button>
              ))}
            </div>
            <Input placeholder="Task title..." value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
            <Select value={taskTarget} onValueChange={setTaskTarget}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All students (batch)</SelectItem>
                {STUDENTS.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={assignTask}><Plus className="w-4 h-4 mr-1" />Assign</Button>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-3 mt-4">
          <div className="grid lg:grid-cols-3 gap-3">
            <Card><CardContent className="p-3 space-y-1 max-h-96 overflow-y-auto">
              {STUDENTS.map(s => (
                <button key={s.id} onClick={() => setChatStudent(s.name)} className={`w-full flex items-center gap-2 p-2 rounded-lg text-left hover:bg-muted ${chatStudent === s.name ? 'bg-muted' : ''}`}>
                  <img src={s.photo} className="w-8 h-8 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{s.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{s.exam}</div>
                  </div>
                </button>
              ))}
            </CardContent></Card>
            <Card className="lg:col-span-2"><CardContent className="p-4">
              {chatStudent ? (
                <div className="space-y-3">
                  <h3 className="font-semibold">Chat with {chatStudent}</h3>
                  <div className="h-64 bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground flex items-end justify-center">Conversation preview…</div>
                  <Textarea placeholder="Type a message or guidance note..." value={chatText} onChange={(e) => setChatText(e.target.value)} />
                  <Button onClick={sendChat}>Send</Button>
                </div>
              ) : <p className="text-sm text-muted-foreground text-center py-8">Select a student to start chat</p>}
            </CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-3 mt-4">
          <div className="grid sm:grid-cols-2 gap-3">
            {STUDENTS.slice(0, 6).map(s => (
              <Card key={s.id}><CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{s.name}</span>
                  <Badge variant={s.score >= 70 ? 'secondary' : 'outline'}>{s.score}%</Badge>
                </div>
                <Progress value={s.score} className="h-2 mb-2" />
                <div className="text-xs text-muted-foreground">Weak: {s.score < 60 ? 'Quant, GA' : 'GA'}</div>
              </CardContent></Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-3 mt-4">
          <Card><CardContent className="p-4 space-y-2">
            <h3 className="font-semibold flex items-center gap-2"><Trophy className="w-4 h-4 text-primary" />Top performers</h3>
            {top.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/40">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">{i + 1}</div>
                <img src={s.photo} className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.exam} · streak {s.streak}d</div>
                </div>
                <Badge variant="secondary">{s.taskCompletion}%</Badge>
              </div>
            ))}
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <Card><CardContent className="p-3">
    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">{icon}{label}</div>
    <div className="text-xl font-bold">{value}</div>
  </CardContent></Card>
);

const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div><div className="text-xs text-muted-foreground">{label}</div><div className="font-medium">{value}</div></div>
);

export default MentorDashboard;
