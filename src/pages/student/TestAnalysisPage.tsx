import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft, FileText, BookOpen, Target, Calendar, Clock, Timer,
  TrendingUp, Users, CheckCircle2, Award, BarChart3, Brain,
  Languages, Calculator, ClipboardList, Trophy, Medal,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import { mockTestAnalysis } from '@/data/testAnalysisData';

type TabKey = 'overview' | 'section' | 'subject' | 'question' | 'time' | 'compare';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'section', label: 'Section Wise' },
  { key: 'subject', label: 'Subject Wise' },
  { key: 'question', label: 'Question Wise' },
  { key: 'time', label: 'Time Analysis' },
  { key: 'compare', label: 'Compare' },
];

// Reference test fixture (matches the reference image)
const referenceTest = {
  name: 'IBPS PO Prelims 2024 (Mock Test 12)',
  subtitle: 'Full Syllabus Mock Test',
  subjects: ['English', 'Quantitative Aptitude', 'Reasoning Ability'],
  date: '12 May 2024',
  time: '10:00 AM – 11:00 AM',
  duration: '60 Minutes',
  score: 70,
  maxScore: 100,
  percentile: 87.45,
  topPercent: 12.55,
  accuracy: 76.32,
  attempted: 229,
  totalQuestions: 300,
  rank: 12612,
  totalStudents: 125000,
  improvement: 18.6,
  sections: [
    { name: 'Reasoning Ability', icon: Brain, attempted: 30, correct: 28, wrong: 2, skipped: 5, score: 28, max: 35, rank: 15, percentile: 92, accuracy: 93.3, time: 45 },
    { name: 'English Language', icon: Languages, attempted: 25, correct: 22, wrong: 3, skipped: 5, score: 22, max: 30, rank: 25, percentile: 88, accuracy: 88, time: 35 },
    { name: 'Quantitative Aptitude', icon: Calculator, attempted: 25, correct: 20, wrong: 5, skipped: 10, score: 20, max: 35, rank: 30, percentile: 85, accuracy: 80, time: 40 },
  ],
  performanceTrend: [
    { name: 'Mock 1', you: 12, avg: 22, topper: 72 },
    { name: 'Mock 2', you: 28, avg: 32, topper: 78 },
    { name: 'Mock 3', you: 36, avg: 48, topper: 80 },
    { name: 'Mock 4', you: 30, avg: 38, topper: 78 },
    { name: 'Mock 5', you: 38, avg: 42, topper: 84 },
    { name: 'Mock 6', you: 42, avg: 50, topper: 88 },
    { name: 'Mock 7', you: 45, avg: 56, topper: 90 },
    { name: 'Mock 8', you: 36, avg: 50, topper: 92 },
    { name: 'Mock 9', you: 32, avg: 46, topper: 90 },
    { name: 'Mock 10', you: 38, avg: 48, topper: 94 },
    { name: 'Mock 11', you: 50, avg: 52, topper: 96 },
    { name: 'Mock 12', you: 70, avg: 56, topper: 95 },
  ],
  questionSummary: { correct: 229, incorrect: 56, unattempted: 15, total: 300 },
  timeAnalysis: [
    { section: 'Reasoning Ability', spent: 45, ideal: 40, accuracy: 93.3 },
    { section: 'English Language', spent: 35, ideal: 30, accuracy: 88 },
    { section: 'Quantitative Aptitude', spent: 40, ideal: 40, accuracy: 80 },
    { section: 'Overall', spent: 120, ideal: 110, accuracy: 88 },
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

const TestAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const t = referenceTest;

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
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-9">
              <FileText className="h-4 w-4" /> Review Test
            </Button>
            <Button variant="outline" className="gap-2 h-9">
              <BookOpen className="h-4 w-4" /> View Solutions
            </Button>
            <Button variant="outline" className="gap-2 h-9">
              <Target className="h-4 w-4" /> Weakness Map
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Test Header Card */}
        <Card className="p-5 sm:p-6">
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
                {t.subjects.map((s, i) => (
                  <React.Fragment key={s}>
                    <Badge variant="secondary" className="rounded-full font-normal">{s}</Badge>
                    {i < t.subjects.length - 1 && <span className="text-muted-foreground/40">•</span>}
                  </React.Fragment>
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
              <KpiCard
                label="Score" value={`${t.score}`} suffix={` / ${t.maxScore}`}
                caption="Good Performance" captionTone="success"
                icon={TrendingUp} valueTone="success"
              />
              <KpiCard
                label="Percentile" value={t.percentile.toFixed(2)}
                caption={`You're in top ${t.topPercent}%`} captionTone="info"
                icon={Users} valueTone="info"
              />
              <KpiCard
                label="Accuracy" value={`${t.accuracy.toFixed(2)}`} suffix="%"
                caption={`${t.attempted} / ${t.totalQuestions}`} captionTone="info"
                icon={CheckCircle2} valueTone="default"
              />
              <KpiCard
                label="Rank" value={t.rank.toLocaleString()}
                caption={`Out of ${(t.totalStudents / 100000).toFixed(2)}L`} captionTone="muted"
                icon={Award} valueTone="default"
              />
              <KpiCard
                label="Improvement" value={`+${t.improvement}`} suffix="%"
                caption="Better than last test" captionTone="success"
                icon={BarChart3} valueTone="success"
              />
            </div>

            {/* Section Wise Performance */}
            <SectionPerformanceCard sections={t.sections} />

            {/* Performance Overview + Question Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2 p-5">
                <h3 className="font-semibold mb-1">Performance Overview</h3>
                <p className="text-xs text-muted-foreground mb-3">Score progression across recent mock tests</p>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={t.performanceTrend} margin={{ top: 10, right: 24, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                      <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="you" name="Your Score" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="avg" name="Average Score" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="topper" name="Topper Score" stroke="hsl(217 91% 60%)" strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
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
              <Card className="p-5">
                <h3 className="font-semibold mb-4">Time Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-muted-foreground border-b border-border">
                        <th className="py-2 font-medium">Section</th>
                        <th className="py-2 font-medium">Time Spent</th>
                        <th className="py-2 font-medium">Ideal Time</th>
                        <th className="py-2 font-medium">Difference</th>
                        <th className="py-2 font-medium">Accuracy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {t.timeAnalysis.map((row, i) => {
                        const diff = row.spent - row.ideal;
                        const isOverall = row.section === 'Overall';
                        return (
                          <tr key={row.section} className={`border-b border-border last:border-0 ${isOverall ? 'font-semibold' : ''}`}>
                            <td className="py-3">{row.section}</td>
                            <td className="py-3">{row.spent}m</td>
                            <td className="py-3">{row.ideal}m</td>
                            <td className={`py-3 ${diff > 0 ? 'text-destructive' : diff < 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                              {diff > 0 ? `+${diff}m` : `${diff}m`}
                            </td>
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <Progress value={row.accuracy} className="h-1.5 w-16" />
                                <span className="text-xs">{row.accuracy}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 px-3 py-2.5 text-sm text-blue-700 dark:text-blue-300">
                  <Info className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>You spent more time than ideal in Reasoning Ability and English Language. Try to improve your speed while maintaining accuracy.</span>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="font-semibold mb-4">Leaderboard (Top 10)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-muted-foreground border-b border-border">
                        <th className="py-2 font-medium">Rank</th>
                        <th className="py-2 font-medium">Student Name</th>
                        <th className="py-2 font-medium text-right">Score</th>
                        <th className="py-2 font-medium text-right">Percentile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {t.leaderboard.map(row => (
                        <tr key={row.rank} className="border-b border-border last:border-0">
                          <td className="py-2.5">
                            <RankBadge rank={row.rank} />
                          </td>
                          <td className="py-2.5">{row.name}</td>
                          <td className="py-2.5 text-right">{row.score} / 100</td>
                          <td className="py-2.5 text-right text-primary font-medium">{row.percentile}%</td>
                        </tr>
                      ))}
                      <tr className="bg-primary/5">
                        <td className="py-2.5 font-semibold text-primary">{t.rank.toLocaleString()}</td>
                        <td className="py-2.5 font-semibold">You (Your Rank)</td>
                        <td className="py-2.5 text-right font-semibold">{t.score} / 100</td>
                        <td className="py-2.5 text-right text-primary font-semibold">{t.percentile}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
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
const SectionPerformanceCard: React.FC<{ sections: typeof referenceTest.sections }> = ({ sections }) => {
  const totals = sections.reduce(
    (acc, s) => ({
      attempted: acc.attempted + s.attempted,
      correct: acc.correct + s.correct,
      wrong: acc.wrong + s.wrong,
      skipped: acc.skipped + s.skipped,
      score: acc.score + s.score,
      max: acc.max + s.max,
      time: acc.time + s.time,
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
                <td className="py-3 text-center">{s.accuracy}%</td>
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
              <td className="py-3 text-center">16</td>
              <td className="py-3 text-center text-primary">92%</td>
              <td className="py-3 text-center">88%</td>
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

/* -------- Question Summary Donut -------- */
const QuestionDonut: React.FC<{ data: typeof referenceTest.questionSummary }> = ({ data }) => {
  const chartData = [
    { name: 'Correct', value: data.correct, color: 'hsl(var(--primary))' },
    { name: 'Incorrect', value: data.incorrect, color: 'hsl(var(--destructive))' },
    { name: 'Unattempted', value: data.unattempted, color: 'hsl(38 92% 60%)' },
  ];
  const pct = (n: number) => ((n / data.total) * 100).toFixed(2);
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
              <span className="font-medium text-foreground">{(d as any).value}</span> ({pct((d as any).value)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* -------- Rank Badge -------- */
const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank === 1) return <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold"><Trophy className="h-3.5 w-3.5" /></span>;
  if (rank === 2) return <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold"><Medal className="h-3.5 w-3.5" /></span>;
  if (rank === 3) return <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold"><Medal className="h-3.5 w-3.5" /></span>;
  return <span className="inline-block w-6 text-center text-sm text-muted-foreground">{rank}</span>;
};

export default TestAnalysisPage;
