import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, MessageSquare, Calendar } from 'lucide-react';
import { useMentorship } from '@/contexts/MentorshipContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const DiagnosticResults: React.FC = () => {
  const navigate = useNavigate();
  const { diagnostics, mentor } = useMentorship();

  const sorted = useMemo(() => [...diagnostics].sort((a, b) => b.score - a.score), [diagnostics]);
  const strong = sorted.filter(d => d.score >= 75);
  const average = sorted.filter(d => d.score >= 50 && d.score < 75);
  const weak = sorted.filter(d => d.score < 50);
  const avgScore = sorted.length ? Math.round(sorted.reduce((s, d) => s + d.score, 0) / sorted.length) : 0;
  const avgAcc = sorted.length ? Math.round(sorted.reduce((s, d) => s + d.accuracy, 0) / sorted.length) : 0;
  const avgSpeed = sorted.length ? Math.round(sorted.reduce((s, d) => s + d.speed, 0) / sorted.length) : 0;

  if (!diagnostics.length) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">No diagnostic results yet.</p>
        <Button className="mt-3" onClick={() => navigate('/student/diagnostic-tests')}>Start Tests</Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <Badge variant="secondary" className="mb-2">Results</Badge>
        <h1 className="text-2xl font-bold">Your Diagnostic Profile</h1>
        <p className="text-sm text-muted-foreground">Your mentor {mentor?.name} can now build a personalized improvement plan.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <KpiCard label="Avg Score" value={`${avgScore}%`} />
        <KpiCard label="Accuracy" value={`${avgAcc}%`} />
        <KpiCard label="Speed" value={`${avgSpeed}%`} />
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3 text-sm">Subject-wise Performance</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sorted}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-3 gap-3">
        <Bucket title="Strong" icon={<TrendingUp className="w-4 h-4" />} colorClass="text-green-600 border-green-500/30" items={strong} />
        <Bucket title="Average" icon={<Minus className="w-4 h-4" />} colorClass="text-yellow-600 border-yellow-500/30" items={average} />
        <Bucket title="Needs Focus" icon={<TrendingDown className="w-4 h-4" />} colorClass="text-red-600 border-red-500/30" items={weak} />
      </div>

      <div className="flex flex-wrap gap-2 justify-end">
        <Button variant="outline" onClick={() => navigate('/student/mentor-chat')}><MessageSquare className="w-4 h-4 mr-1" />Message Mentor</Button>
        <Button onClick={() => navigate('/student/mentorship')}><Calendar className="w-4 h-4 mr-1" />See Daily Tasks</Button>
      </div>
    </div>
  );
};

const KpiCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Card><CardContent className="p-4 text-center">
    <div className="text-2xl font-bold text-primary">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </CardContent></Card>
);

const Bucket: React.FC<{ title: string; icon: React.ReactNode; colorClass: string; items: { subject: string; score: number }[] }> = ({ title, icon, colorClass, items }) => (
  <Card className={`border-2 ${colorClass}`}>
    <CardContent className="p-4">
      <div className={`flex items-center gap-2 mb-2 font-semibold ${colorClass.split(' ')[0]}`}>{icon}{title} ({items.length})</div>
      {items.length === 0 ? <p className="text-xs text-muted-foreground">None</p> :
        <ul className="space-y-1 text-sm">{items.map(i => <li key={i.subject} className="flex justify-between"><span>{i.subject}</span><span className="font-medium">{i.score}%</span></li>)}</ul>
      }
    </CardContent>
  </Card>
);

export default DiagnosticResults;
