import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileCheck, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { differenceInSeconds, parseISO } from 'date-fns';
import { ScheduledTest } from './TeamStudyTypes';

interface ScheduledTestsListProps {
  tests: ScheduledTest[];
}

const modeIcons = { anytime: '📅', limited: '⏱️', immediate: '⚡' };
const modeLabels = { anytime: 'Anytime', limited: 'Time-Limited', immediate: 'Immediate' };

const statusBorder: Record<string, string> = {
  live: 'border-l-green-500',
  upcoming: 'border-l-yellow-500',
  expired: 'border-l-red-400',
};
const statusBadge: Record<string, string> = {
  live: 'bg-green-500/10 text-green-600 border-green-200',
  upcoming: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
  expired: 'bg-red-500/10 text-red-600 border-red-200',
};

const CountdownDisplay = ({ scheduledAt }: { scheduledAt: string }) => {
  const [diff, setDiff] = useState(0);
  useEffect(() => {
    const update = () => setDiff(Math.max(0, differenceInSeconds(parseISO(scheduledAt), new Date())));
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [scheduledAt]);
  const hrs = Math.floor(diff / 3600);
  const mins = Math.floor((diff % 3600) / 60);
  if (diff <= 0) return null;
  return (
    <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
      <Clock className="h-3 w-3" /> {hrs}h {mins}m
    </span>
  );
};

const ScheduledTestsList: React.FC<ScheduledTestsListProps> = ({ tests }) => {
  const upcoming = tests.filter(t => t.status === 'upcoming');
  const live = tests.filter(t => t.status === 'live');
  const expired = tests.filter(t => t.status === 'expired' || t.userCompleted);

  const renderTest = (test: ScheduledTest, idx: number) => {
    const completionPct = (test.completedBy / test.totalMembers) * 100;
    return (
      <motion.div
        key={test.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05, duration: 0.3 }}
      >
        <Card className={cn("border-none shadow-sm border-l-4 overflow-hidden", statusBorder[test.status])}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold">{test.title}</h3>
                  <Badge variant="outline" className="text-[10px]">
                    {modeIcons[test.mode]} {modeLabels[test.mode]}
                    {test.mode === 'limited' && ` • ${test.windowHours}hr`}
                  </Badge>
                  {test.status === 'live' && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-medium text-green-600">LIVE</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  {test.teamName} • {test.questions} questions • {test.duration} min • {test.difficulty}
                </p>

                <div className="flex items-center gap-3">
                  <p className="text-xs text-muted-foreground">
                    {new Date(test.scheduledAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {(test.status === 'upcoming' || test.status === 'live') && (
                    <CountdownDisplay scheduledAt={test.scheduledAt} />
                  )}
                </div>

                {/* Completion progress */}
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <div className="flex-1 max-w-[120px]">
                    <Progress value={completionPct} className="h-1.5" />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {test.completedBy}/{test.totalMembers} completed
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Badge className={cn("text-[10px] border", statusBadge[test.status])}>
                  {test.status === 'live' && '🟢 Live'}
                  {test.status === 'upcoming' && '🟡 Upcoming'}
                  {test.status === 'expired' && '🔴 Expired'}
                </Badge>
                {test.status === 'live' && !test.userCompleted && (
                  <Button size="sm" className="text-xs h-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm">📝 Take Test</Button>
                )}
                {test.status === 'upcoming' && (
                  <Button size="sm" variant="outline" className="text-xs h-8" disabled>⏰ Not Yet</Button>
                )}
                {(test.status === 'expired' || test.userCompleted) && (
                  <Button size="sm" variant="ghost" className="text-xs h-8">📊 Results</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
        <FileCheck className="h-5 w-5 text-primary" /> Scheduled Tests
      </h2>
      <Tabs defaultValue="all">
        <TabsList className="mb-3">
          <TabsTrigger value="all" className="text-xs">All ({tests.length})</TabsTrigger>
          <TabsTrigger value="live" className="text-xs">🟢 Live ({live.length})</TabsTrigger>
          <TabsTrigger value="upcoming" className="text-xs">🟡 Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="completed" className="text-xs">Completed ({expired.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-3">{tests.map((t, i) => renderTest(t, i))}</TabsContent>
        <TabsContent value="live" className="space-y-3">{live.map((t, i) => renderTest(t, i))}</TabsContent>
        <TabsContent value="upcoming" className="space-y-3">{upcoming.map((t, i) => renderTest(t, i))}</TabsContent>
        <TabsContent value="completed" className="space-y-3">{expired.map((t, i) => renderTest(t, i))}</TabsContent>
      </Tabs>
    </div>
  );
};

export default ScheduledTestsList;
