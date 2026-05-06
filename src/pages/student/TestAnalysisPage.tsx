import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ArrowLeft, FileText, BookOpen, Target, Calendar, Clock, Timer,
  TrendingUp, Users, CheckCircle2, Award, BarChart3, Brain,
  Languages, Calculator, ClipboardList, Trophy, Medal, Crown,
  Info, AlertTriangle, ArrowRight, ShieldAlert, Zap, Lock,
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, Area, AreaChart,
} from 'recharts';
import { generateMockAnalysisData } from '@/data/testAnalysisData';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type TabKey = 'overview' | 'section' | 'subject' | 'question' | 'time' | 'compare';
type ActionView = 'review' | 'solutions' | 'weakness' | null;

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'section', label: 'Section Wise' },
  { key: 'subject', label: 'Subject Wise' },
  { key: 'question', label: 'Question Wise' },
  { key: 'time', label: 'Time Analysis' },
  { key: 'compare', label: 'Compare' },
];

// --- Test ownership / access (frontend-only demo guard) -------------------
// Maps testId -> ownerId. Tests not listed here are considered public sample
// tests viewable by any authenticated student.
const TEST_OWNERSHIP: Record<string, string> = {
  // 'sbi-po-mock-1': '1',
};

const getTestRecord = (testId: string | undefined) => {
  const id = testId || 'sbi-po-mock-1';
  // Real impl would fetch by testId. We derive a deterministic mock.
  const name = id
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
  return generateMockAnalysisData(id, name);
};

const TestAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const { user, isAuthenticated } = useAuth();

  // Tab state persisted per test
  const tabKey = `test-analysis:${testId || 'default'}:tab`;
  const actionKey = `test-analysis:${testId || 'default'}:action`;
  const [activeTab, setActiveTab] = useLocalStorage<TabKey>(tabKey as any, 'overview');
  const [activeAction, setActiveAction] = useLocalStorage<ActionView>(actionKey as any, null);

  // Access control: must be authenticated student, and own the test if scoped.
  const ownerId = testId ? TEST_OWNERSHIP[testId] : undefined;
  const accessDenied =
    !isAuthenticated ||
    user?.role !== 'student' ||
    (ownerId !== undefined && user?.id !== ownerId);

  const data = useMemo(() => getTestRecord(testId), [testId]);

  // Build display model from real fetched analysis
  const t = useMemo(() => buildDisplayModel(data, user?.name || 'You'), [data, user?.name]);

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
          <p className="text-sm text-muted-foreground mb-6">
            You don't have permission to view this test analysis. Tests can only be opened by the student who attempted them.
          </p>
          <Button onClick={() => navigate('/student/tests')} className="bg-primary text-primary-foreground">
            Go to My Tests
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">Test Analysis</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <ActionButton
              active={activeAction === 'review'}
              onClick={() => setActiveAction(activeAction === 'review' ? null : 'review')}
              icon={FileText} label="Review Test" primary
            />
            <ActionButton
              active={activeAction === 'solutions'}
              onClick={() => setActiveAction(activeAction === 'solutions' ? null : 'solutions')}
              icon={BookOpen} label="View Solutions"
            />
            <ActionButton
              active={activeAction === 'weakness'}
              onClick={() => setActiveAction(activeAction === 'weakness' ? null : 'weakness')}
              icon={Target} label="Weakness Map"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Test Header Card */}
        <Card className="p-5 sm:p-6 bg-gradient-to-br from-primary/5 via-background to-background border-primary/20">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <ClipboardList className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-foreground leading-tight">{t.name}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{t.subtitle}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {t.subjects.map((s) => (
                  <Badge key={s} variant="secondary" className="rounded-full font-normal">{s}</Badge>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" />{t.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" />{t.time}</span>
                <span className="flex items-center gap-1.5"><Timer className="h-4 w-4 text-primary" />{t.duration}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Active Action Panel */}
        {activeAction === 'review' && (
          <ActionPanel
            tone="primary" icon={FileText} title="Review Test"
            description="Re-attempt the test in review mode. Your previous answers are highlighted; you can change responses without affecting your score."
            cta="Open Review Mode" onAction={() => navigate(`/student/tests`)}
            onClose={() => setActiveAction(null)}
          />
        )}
        {activeAction === 'solutions' && (
          <ActionPanel
            tone="info" icon={BookOpen} title="View Solutions"
            description="Walk through every question with detailed solutions, video explanations and shortcut tips from our subject experts."
            cta="Open Solutions" onAction={() => navigate(`/student/tests`)}
            onClose={() => setActiveAction(null)}
          />
        )}
        {activeAction === 'weakness' && (
          <WeaknessMapPanel
            sections={t.sections}
            onPractice={(name) => navigate(`/student/tests`)}
            onClose={() => setActiveAction(null)}
          />
        )}

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide -mb-px">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 sm:px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <KpiCard label="Score" value={`${t.score}`} suffix={` / ${t.maxScore}`}
                caption="Good Performance" captionTone="success" icon={TrendingUp} valueTone="success" />
              <KpiCard label="Percentile" value={t.percentile.toFixed(2)}
                caption={`You're in top ${t.topPercent}%`} captionTone="info" icon={Users} valueTone="info" />
              <KpiCard label="Accuracy" value={`${t.accuracy.toFixed(2)}`} suffix="%"
                caption={`${t.attempted} / ${t.totalQuestions}`} captionTone="info" icon={CheckCircle2} />
              <KpiCard label="Rank" value={t.rank.toLocaleString()}
                caption={`Out of ${(t.totalStudents / 100000).toFixed(2)}L`} captionTone="muted" icon={Award} />
              <KpiCard label="Improvement" value={`+${t.improvement}`} suffix="%"
                caption="Better than last test" captionTone="success" icon={BarChart3} valueTone="success" />
            </div>

            <SectionPerformanceCard sections={t.sections} />

            {/* Performance Overview + Question Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">Performance Overview</h3>
                    <p className="text-xs text-muted-foreground">Score progression across recent mock tests</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <LegendDot color="bg-primary" label="You" />
                    <LegendDot color="bg-amber-500" label="Average" />
                    <LegendDot color="bg-violet-500" label="Topper" />
                  </div>
                </div>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={t.performanceTrend} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="youGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="topGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(262 83% 62%)" stopOpacity={0.18} />
                          <stop offset="100%" stopColor="hsl(262 83% 62%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                      <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                      <Area type="monotone" dataKey="topper" name="Topper" stroke="hsl(262 83% 62%)" strokeWidth={2.5} fill="url(#topGrad)" dot={{ r: 3, fill: 'hsl(262 83% 62%)' }} />
                      <Area type="monotone" dataKey="you" name="You" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#youGrad)" dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="avg" name="Average" stroke="hsl(38 92% 50%)" strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3, fill: 'hsl(38 92% 50%)' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2 text-sm text-primary">
                  <TrendingUp className="h-4 w-4" />
                  <span>Great! You have improved by {t.improvement}% compared to your last test.</span>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="font-semibold mb-3">Question Summary</h3>
                <QuestionDonut data={t.questionSummary} />
                <Button variant="outline" className="w-full mt-4 border-primary/40 text-primary hover:bg-primary/10 hover:text-primary">
                  View All Questions
                </Button>
              </Card>
            </div>

            {/* Time Analysis + Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TimeAnalysisCard rows={t.timeAnalysis} />
              <LeaderboardCard
                leaderboard={t.leaderboard}
                userRank={t.rank}
                userScore={t.score}
                userPercentile={t.percentile}
                userName={user?.name || 'You'}
              />
            </div>
          </>
        )}

        {activeTab !== 'overview' && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{TABS.find(x => x.key === activeTab)?.label}</span> view is being prepared.
            </p>
            <Button variant="link" className="text-primary mt-2" onClick={() => setActiveTab('overview')}>
              Back to Overview
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

/* -------- Display model -------- */
function buildDisplayModel(data: ReturnType<typeof generateMockAnalysisData>, userName: string) {
  const sections = data.sectionWiseData.map(s => {
    const icon =
      s.sectionName.toLowerCase().includes('reason') ? Brain :
      s.sectionName.toLowerCase().includes('english') ? Languages :
      s.sectionName.toLowerCase().includes('quant') || s.sectionName.toLowerCase().includes('math') ? Calculator :
      ClipboardList;
    return {
      name: s.sectionName, icon,
      attempted: s.attempted, correct: s.correct, wrong: s.wrong, skipped: s.skipped,
      score: s.score, max: s.maxScore, rank: s.rank, percentile: s.percentile,
      accuracy: s.accuracy, time: s.timeSpent,
    };
  });
  const totalQ = data.sectionWiseData.reduce((a, s) => a + s.attempted + s.skipped, 0) || 300;
  const correct = data.sectionWiseData.reduce((a, s) => a + s.correct, 0);
  const wrong = data.sectionWiseData.reduce((a, s) => a + s.wrong, 0);
  const skipped = data.sectionWiseData.reduce((a, s) => a + s.skipped, 0);
  return {
    name: data.testName,
    subtitle: 'Full Syllabus Mock Test',
    subjects: ['English', 'Quantitative Aptitude', 'Reasoning Ability'],
    date: data.date, time: '10:00 AM – 11:00 AM', duration: `${data.maxTime} Minutes`,
    score: data.score, maxScore: data.maxScore,
    percentile: data.percentile, topPercent: +(100 - data.percentile).toFixed(2),
    accuracy: data.accuracy, attempted: correct + wrong, totalQuestions: totalQ,
    rank: data.rank, totalStudents: data.totalStudents,
    improvement: 18.6,
    sections,
    performanceTrend: data.performanceHistory.slice().reverse().map((p, i) => ({
      name: `Mock ${i + 1}`, you: p.score, avg: Math.max(20, p.score - 15), topper: Math.min(100, p.score + 18),
    })),
    questionSummary: { correct, incorrect: wrong, unattempted: skipped, total: correct + wrong + skipped },
    timeAnalysis: [
      ...data.sectionWiseData.map(s => ({ section: s.sectionName, spent: s.timeSpent, ideal: Math.round(s.timeSpent * 0.9), accuracy: s.accuracy })),
      { section: 'Overall', spent: data.timeTaken, ideal: Math.round(data.timeTaken * 0.92), accuracy: data.accuracy },
    ],
    leaderboard: [
      { rank: 1, name: 'Aarav Sharma', score: 92, percentile: 99.45 },
      { rank: 2, name: 'Riya Singh', score: 90, percentile: 99.12 },
      { rank: 3, name: 'Karan Verma', score: 88, percentile: 98.21 },
      { rank: 4, name: 'Neha Gupta', score: 87, percentile: 97.53 },
      { rank: 5, name: 'Arjun Patel', score: 86, percentile: 96.81 },
      { rank: 6, name: 'Simran Kaur', score: 85, percentile: 96.21 },
      { rank: 7, name: 'Vivek Yadav', score: 84, percentile: 95.65 },
      { rank: 8, name: 'Ananya Raj', score: 83, percentile: 94.92 },
      { rank: 9, name: 'Mohit Jain', score: 82, percentile: 94.11 },
      { rank: 10, name: 'Pooja Mehta', score: 81, percentile: 93.42 },
    ],
  };
}

type DisplayModel = ReturnType<typeof buildDisplayModel>;

/* -------- Action Button -------- */
const ActionButton: React.FC<{
  active: boolean; onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string; primary?: boolean;
}> = ({ active, onClick, icon: Icon, label, primary }) => {
  if (primary) {
    return (
      <Button onClick={onClick} className={`gap-2 h-9 ${active ? 'ring-2 ring-primary/40' : ''} bg-primary hover:bg-primary/90 text-primary-foreground`}>
        <Icon className="h-4 w-4" /> {label}
      </Button>
    );
  }
  return (
    <Button variant="outline" onClick={onClick}
      className={`gap-2 h-9 ${active ? 'border-primary text-primary bg-primary/5' : ''}`}>
      <Icon className="h-4 w-4" /> {label}
    </Button>
  );
};

/* -------- Action Panel -------- */
const ActionPanel: React.FC<{
  tone: 'primary' | 'info';
  icon: React.ComponentType<{ className?: string }>;
  title: string; description: string; cta: string;
  onAction: () => void; onClose: () => void;
}> = ({ tone, icon: Icon, title, description, cta, onAction, onClose }) => {
  const toneClasses = tone === 'primary'
    ? 'bg-primary/5 border-primary/30'
    : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900';
  const iconClasses = tone === 'primary' ? 'bg-primary/10 text-primary' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300';
  return (
    <Card className={`p-5 border ${toneClasses}`}>
      <div className="flex items-start gap-4">
        <div className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 ${iconClasses}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          <div className="flex gap-2 mt-3">
            <Button onClick={onAction} className="bg-primary text-primary-foreground gap-2">
              {cta} <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" onClick={onClose}>Dismiss</Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

/* -------- Weakness Map Panel -------- */
const WeaknessMapPanel: React.FC<{
  sections: DisplayModel['sections'];
  onPractice: (name: string) => void;
  onClose: () => void;
}> = ({ sections, onPractice, onClose }) => {
  const ranked = [...sections].sort((a, b) => a.accuracy - b.accuracy);
  const weak = ranked.filter(s => s.accuracy < 90).slice(0, 5);
  const list = weak.length ? weak : ranked.slice(0, 3);
  return (
    <Card className="p-5 border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
            <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-300" />
          </div>
          <div>
            <h3 className="font-semibold">Weakness Map</h3>
            <p className="text-sm text-muted-foreground">Sections and skills where focused practice will boost your score the most.</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.map(s => {
          const gap = 100 - s.accuracy;
          const tone = s.accuracy < 80 ? 'destructive' : s.accuracy < 90 ? 'amber' : 'primary';
          const toneText = tone === 'destructive' ? 'text-destructive' : tone === 'amber' ? 'text-amber-600 dark:text-amber-400' : 'text-primary';
          const toneBg = tone === 'destructive' ? 'bg-destructive' : tone === 'amber' ? 'bg-amber-500' : 'bg-primary';
          return (
            <div key={s.name} className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                    <s.icon className="h-4 w-4 text-foreground" />
                  </div>
                  <span className="font-medium text-sm">{s.name}</span>
                </div>
                <Badge variant="outline" className={`${toneText} border-current`}>{s.accuracy.toFixed(0)}%</Badge>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                Accuracy gap: <span className={`font-medium ${toneText}`}>{gap.toFixed(0)}%</span> · Wrong {s.wrong} · Skipped {s.skipped}
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-3">
                <div className={`h-full ${toneBg}`} style={{ width: `${s.accuracy}%` }} />
              </div>
              <Button size="sm" variant="outline" className="w-full gap-2" onClick={() => onPractice(s.name)}>
                <Zap className="h-3.5 w-3.5" /> Practice question set
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

/* -------- KPI Card -------- */
const KpiCard: React.FC<{
  label: string; value: string; suffix?: string;
  caption: string; captionTone: 'success' | 'info' | 'muted';
  icon: React.ComponentType<{ className?: string }>;
  valueTone?: 'default' | 'success' | 'info';
}> = ({ label, value, suffix, caption, captionTone, icon: Icon, valueTone = 'default' }) => {
  const valueClass =
    valueTone === 'success' ? 'text-primary' :
    valueTone === 'info' ? 'text-blue-600' : 'text-foreground';
  const captionClass =
    captionTone === 'success' ? 'bg-primary/10 text-primary' :
    captionTone === 'info' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40' :
    'bg-muted text-muted-foreground';
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className={`flex items-baseline gap-0.5 ${valueClass}`}>
        <span className="text-3xl font-bold leading-none">{value}</span>
        {suffix && <span className="text-sm font-medium text-muted-foreground">{suffix}</span>}
      </div>
      <span className={`mt-3 inline-block rounded-md px-2 py-0.5 text-[11px] font-medium ${captionClass}`}>{caption}</span>
    </Card>
  );
};

/* -------- Section Wise Performance Card -------- */
const SectionPerformanceCard: React.FC<{ sections: DisplayModel['sections'] }> = ({ sections }) => {
  const totals = sections.reduce(
    (acc, s) => ({
      attempted: acc.attempted + s.attempted, correct: acc.correct + s.correct,
      wrong: acc.wrong + s.wrong, skipped: acc.skipped + s.skipped,
      score: acc.score + s.score, max: acc.max + s.max, time: acc.time + s.time,
    }),
    { attempted: 0, correct: 0, wrong: 0, skipped: 0, score: 0, max: 0, time: 0 }
  );

  return (
    <Card className="p-5">
      <h3 className="font-semibold mb-4">Section Wise Performance</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="py-2 font-medium">Section</th>
              <th className="py-2 font-medium text-center">Attempted</th>
              <th className="py-2 font-medium text-center">Correct / Wrong</th>
              <th className="py-2 font-medium text-center">Skipped</th>
              <th className="py-2 font-medium text-center">Score</th>
              <th className="py-2 font-medium text-center">Rank</th>
              <th className="py-2 font-medium text-center">Percentile</th>
              <th className="py-2 font-medium text-center">Accuracy</th>
              <th className="py-2 font-medium text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {sections.map(s => (
              <tr key={s.name} className="border-b border-border">
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
                      <s.icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="font-medium">{s.name}</span>
                  </div>
                </td>
                <td className="py-3 text-center">{s.attempted}</td>
                <td className="py-3 text-center">
                  <span className="text-primary font-medium">{s.correct}</span>
                  <span className="text-muted-foreground mx-1">/</span>
                  <span className="text-destructive font-medium">{s.wrong}</span>
                </td>
                <td className="py-3 text-center text-muted-foreground">{s.skipped}</td>
                <td className="py-3 text-center"><span className="text-primary font-medium">{s.score}</span> <span className="text-muted-foreground">/ {s.max}</span></td>
                <td className="py-3 text-center">{s.rank}</td>
                <td className="py-3 text-center text-primary font-medium">{s.percentile}%</td>
                <td className="py-3 text-center">{s.accuracy.toFixed(1)}%</td>
                <td className="py-3 text-right text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{s.time}m</span>
                </td>
              </tr>
            ))}
            <tr className="font-semibold">
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center">
                    <BarChart3 className="h-3.5 w-3.5 text-foreground" />
                  </div>
                  <span>Overall</span>
                </div>
              </td>
              <td className="py-3 text-center">{totals.attempted}</td>
              <td className="py-3 text-center">
                <span className="text-primary">{totals.correct}</span>
                <span className="text-muted-foreground mx-1">/</span>
                <span className="text-destructive">{totals.wrong}</span>
              </td>
              <td className="py-3 text-center text-muted-foreground">{totals.skipped}</td>
              <td className="py-3 text-center"><span className="text-primary">{totals.score}</span> <span className="text-muted-foreground font-normal">/ {totals.max}</span></td>
              <td className="py-3 text-center">—</td>
              <td className="py-3 text-center text-primary">—</td>
              <td className="py-3 text-center">{totals.attempted ? Math.round((totals.correct / totals.attempted) * 100) : 0}%</td>
              <td className="py-3 text-right text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{totals.time}m</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs">
        <LegendDot color="bg-primary" label="Correct" />
        <LegendDot color="bg-destructive" label="Wrong" />
        <LegendDot color="bg-muted-foreground/40" label="Skipped" />
      </div>
    </Card>
  );
};

const LegendDot: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
    <span className={`h-3 w-3 rounded-sm ${color}`} />
    {label}
  </span>
);

/* -------- Time Analysis (visual bars) -------- */
const TimeAnalysisCard: React.FC<{ rows: DisplayModel['timeAnalysis'] }> = ({ rows }) => {
  const max = Math.max(...rows.map(r => Math.max(r.spent, r.ideal))) || 1;
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">Time Analysis</h3>
          <p className="text-xs text-muted-foreground">Compare time spent vs ideal pace per section</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <LegendDot color="bg-primary" label="You" />
          <LegendDot color="bg-muted-foreground/40" label="Ideal" />
        </div>
      </div>
      <div className="space-y-4">
        {rows.map(r => {
          const diff = r.spent - r.ideal;
          const isOverall = r.section === 'Overall';
          const overTone = diff > 0 ? 'text-destructive' : diff < 0 ? 'text-primary' : 'text-muted-foreground';
          return (
            <div key={r.section} className={isOverall ? 'pt-3 border-t border-border' : ''}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className={`${isOverall ? 'font-semibold' : 'font-medium'}`}>{r.section}</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground">Acc {r.accuracy.toFixed(0)}%</span>
                  <span className={`font-medium ${overTone}`}>
                    {diff > 0 ? `+${diff}m over` : diff < 0 ? `${Math.abs(diff)}m faster` : 'on pace'}
                  </span>
                </div>
              </div>
              <div className="relative h-6 rounded-md bg-muted overflow-hidden">
                {/* Ideal marker bar (background) */}
                <div className="absolute inset-y-0 left-0 bg-muted-foreground/15 border-r-2 border-dashed border-muted-foreground/50"
                  style={{ width: `${(r.ideal / max) * 100}%` }} />
                {/* Spent bar */}
                <div className={`absolute inset-y-0 left-0 ${diff > 0 ? 'bg-destructive/80' : 'bg-primary'} transition-all`}
                  style={{ width: `${(r.spent / max) * 100}%` }} />
                <div className="relative h-full flex items-center justify-between px-2 text-[11px] font-medium text-primary-foreground mix-blend-luminosity">
                  <span className="text-white drop-shadow">Spent {r.spent}m</span>
                  <span className="text-foreground/80">Ideal {r.ideal}m</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 px-3 py-2.5 text-sm text-blue-700 dark:text-blue-300">
        <Info className="h-4 w-4 mt-0.5 shrink-0" />
        <span>Sections shown in red took longer than ideal. Aim to cut 3–5 minutes there next time without sacrificing accuracy.</span>
      </div>
    </Card>
  );
};

/* -------- Leaderboard with podium -------- */
const initials = (name: string) =>
  name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

const PodiumCol: React.FC<{
  rank: 1 | 2 | 3 | 4 | 5; name: string; score: number; percentile: number;
}> = ({ rank, name, score, percentile }) => {
  const heightCls =
    rank === 1 ? 'h-32' :
    rank === 2 || rank === 3 ? 'h-24' : 'h-16';
  const podiumColor =
    rank === 1 ? 'bg-gradient-to-b from-amber-300 to-amber-500' :
    rank === 2 ? 'bg-gradient-to-b from-slate-300 to-slate-400' :
    rank === 3 ? 'bg-gradient-to-b from-orange-300 to-orange-500' :
    'bg-gradient-to-b from-muted to-muted-foreground/30';
  const ringColor =
    rank === 1 ? 'ring-amber-400' :
    rank === 2 ? 'ring-slate-400' :
    rank === 3 ? 'ring-orange-400' : 'ring-border';
  const avatarSize = rank === 1 ? 'h-14 w-14' : rank === 2 || rank === 3 ? 'h-12 w-12' : 'h-10 w-10';

  return (
    <div className="flex flex-col items-center justify-end">
      {rank === 1 && <Crown className="h-5 w-5 text-amber-500 mb-1" />}
      <Avatar className={`${avatarSize} ring-2 ${ringColor} ring-offset-2 ring-offset-background mb-2`}>
        <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">{initials(name)}</AvatarFallback>
      </Avatar>
      <div className="text-center mb-2 max-w-[88px]">
        <p className="text-xs font-medium truncate">{name}</p>
        <p className="text-[11px] text-muted-foreground">{percentile}%ile</p>
      </div>
      <div className={`w-16 sm:w-20 ${heightCls} ${podiumColor} rounded-t-md flex items-start justify-center pt-2 shadow-sm`}>
        <span className="text-white font-bold text-sm drop-shadow">#{rank}</span>
      </div>
      <div className="text-xs font-semibold text-foreground mt-1">{score} pts</div>
    </div>
  );
};

const LeaderboardCard: React.FC<{
  leaderboard: DisplayModel['leaderboard']; userRank: number; userScore: number;
  userPercentile: number; userName: string;
}> = ({ leaderboard, userRank, userScore, userPercentile, userName }) => {
  const top5 = leaderboard.slice(0, 5);
  const rest = leaderboard.slice(5);
  // Order podium: 4, 2, 1, 3, 5
  const podiumOrder = [
    top5.find(t => t.rank === 4), top5.find(t => t.rank === 2),
    top5.find(t => t.rank === 1), top5.find(t => t.rank === 3),
    top5.find(t => t.rank === 5),
  ].filter(Boolean) as typeof top5;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">Leaderboard</h3>
          <p className="text-xs text-muted-foreground">Top performers in this test</p>
        </div>
        <Trophy className="h-5 w-5 text-amber-500" />
      </div>

      {/* Podium for top 5 */}
      <div className="rounded-xl bg-gradient-to-b from-primary/5 to-transparent p-4 mb-4">
        <div className="grid grid-cols-5 gap-2 items-end">
          {podiumOrder.map(p => (
            <PodiumCol key={p.rank} rank={p.rank as 1 | 2 | 3 | 4 | 5} name={p.name} score={p.score} percentile={p.percentile} />
          ))}
        </div>
      </div>

      {/* Other ranks */}
      <div className="space-y-1.5">
        {rest.map(row => (
          <div key={row.rank} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50">
            <span className="w-7 text-sm font-medium text-muted-foreground text-center">#{row.rank}</span>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-[11px] bg-muted">{initials(row.name)}</AvatarFallback>
            </Avatar>
            <span className="flex-1 text-sm truncate">{row.name}</span>
            <span className="text-xs text-muted-foreground tabular-nums">{row.score} pts</span>
            <span className="text-xs font-medium text-primary tabular-nums w-14 text-right">{row.percentile}%</span>
          </div>
        ))}
      </div>

      {/* User rank */}
      <div className="mt-3 pt-3 border-t border-dashed border-border">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 border border-primary/30">
          <span className="w-7 text-sm font-bold text-primary text-center">#{userRank.toLocaleString()}</span>
          <Avatar className="h-9 w-9 ring-2 ring-primary/40">
            <AvatarFallback className="text-xs bg-primary text-primary-foreground font-semibold">{initials(userName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{userName} <span className="text-xs font-normal text-muted-foreground">(You)</span></p>
            <p className="text-[11px] text-muted-foreground">Keep pushing — top 10 is within reach!</p>
          </div>
          <span className="text-sm font-semibold tabular-nums">{userScore} pts</span>
          <span className="text-sm font-bold text-primary tabular-nums w-14 text-right">{userPercentile}%</span>
        </div>
      </div>
    </Card>
  );
};

/* -------- Question Summary Donut -------- */
const QuestionDonut: React.FC<{ data: { correct: number; incorrect: number; unattempted: number; total: number } }> = ({ data }) => {
  const chartData = [
    { name: 'Correct', value: data.correct, color: 'hsl(var(--primary))' },
    { name: 'Incorrect', value: data.incorrect, color: 'hsl(var(--destructive))' },
    { name: 'Unattempted', value: data.unattempted, color: 'hsl(38 92% 60%)' },
  ];
  const pct = (n: number) => data.total ? ((n / data.total) * 100).toFixed(2) : '0';
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
              {chartData.map(d => <Cell key={d.name} fill={d.color} />)}
            </Pie>
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold">{data.total}</span>
          <span className="text-xs text-muted-foreground">Total</span>
        </div>
      </div>
      <div className="w-full space-y-2 mt-3">
        {chartData.map(d => (
          <div key={d.name} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
              {d.name}
            </span>
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground">{d.value}</span> ({pct(d.value)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestAnalysisPage;
