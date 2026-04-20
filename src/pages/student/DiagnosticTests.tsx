import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Clock, Target, ArrowRight, Check } from 'lucide-react';
import { useMentorship } from '@/contexts/MentorshipContext';
import { buildDiagnosticTests } from '@/data/diagnosticTestBank';
import { useToast } from '@/hooks/use-toast';

const DiagnosticTests: React.FC = () => {
  const navigate = useNavigate();
  const { profile, addDiagnostic, diagnostics } = useMentorship();
  const { toast } = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  const tests = useMemo(() => {
    if (!profile) return [];
    return buildDiagnosticTests(profile.stage, profile.subjects, profile.examCategory);
  }, [profile]);

  if (!profile) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Complete onboarding first.</p>
        <Button className="mt-3" onClick={() => navigate('/student/mentorship-onboarding')}>Start Onboarding</Button>
      </div>
    );
  }

  const completedIds = new Set(diagnostics.map(d => d.testId));
  const allDone = completedIds.size >= tests.length;

  const runTest = (testId: string, subject: string) => {
    setBusy(testId);
    setTimeout(() => {
      const score = 40 + Math.floor(Math.random() * 50);
      addDiagnostic({
        testId, subject, score,
        accuracy: 50 + Math.floor(Math.random() * 45),
        speed: 50 + Math.floor(Math.random() * 45),
        completedAt: new Date().toISOString(),
      });
      toast({ title: `Completed: ${subject}`, description: `Score: ${score}%` });
      setBusy(null);
    }, 900);
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <Badge variant="secondary" className="mb-2">Diagnostic</Badge>
        <h1 className="text-2xl font-bold">5-Test Mentor Profile Assessment</h1>
        <p className="text-sm text-muted-foreground">Complete these to help your mentor build your personalized plan.</p>
      </div>

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Progress</div>
            <div className="font-semibold">{completedIds.size} / {tests.length} tests done</div>
          </div>
          <Progress value={(completedIds.size / tests.length) * 100} className="w-40 h-2" />
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        {tests.map((t, i) => {
          const done = completedIds.has(t.id);
          return (
            <Card key={t.id} className={done ? 'border-primary/40' : ''}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">{i + 1}</div>
                    <div>
                      <div className="font-semibold">{t.title}</div>
                      <div className="text-xs text-muted-foreground">{t.subject}</div>
                    </div>
                  </div>
                  {done && <Badge className="bg-primary"><Check className="w-3 h-3 mr-1" />Done</Badge>}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Brain className="w-3 h-3" />{t.questions} Q</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{t.durationMins} min</span>
                  <span className="flex items-center gap-1"><Target className="w-3 h-3" />{t.difficulty}</span>
                </div>
                <p className="text-xs text-muted-foreground">{t.description}</p>
                <Button size="sm" disabled={done || busy === t.id} onClick={() => runTest(t.id, t.subject)} className="w-full">
                  {busy === t.id ? 'Running…' : done ? 'Completed' : 'Start Test'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button disabled={!allDone} onClick={() => navigate('/student/diagnostic-results')}>
          View Results <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default DiagnosticTests;
