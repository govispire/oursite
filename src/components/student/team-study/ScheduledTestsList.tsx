import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Zap, FileCheck, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScheduledTest } from './TeamStudyTypes';

interface ScheduledTestsListProps {
  tests: ScheduledTest[];
}

const modeIcons = { anytime: '📅', limited: '⏱️', immediate: '⚡' };
const modeLabels = { anytime: 'Anytime', limited: 'Time-Limited', immediate: 'Immediate' };
const statusColors = {
  live: 'bg-green-500/10 text-green-600 border-green-200',
  upcoming: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
  expired: 'bg-red-500/10 text-red-600 border-red-200',
};

const ScheduledTestsList: React.FC<ScheduledTestsListProps> = ({ tests }) => {
  const upcoming = tests.filter(t => t.status === 'upcoming');
  const live = tests.filter(t => t.status === 'live');
  const expired = tests.filter(t => t.status === 'expired' || t.userCompleted);

  const renderTest = (test: ScheduledTest) => (
    <Card key={test.id} className="border-none shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-sm font-semibold">{test.title}</h3>
              <Badge variant="outline" className="text-[10px]">
                {modeIcons[test.mode]} {modeLabels[test.mode]}
                {test.mode === 'limited' && ` • ${test.windowHours}hr`}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {test.teamName} • {test.questions} questions • {test.duration} min
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {test.mode === 'anytime' && `Scheduled ${new Date(test.scheduledAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
              {test.mode === 'limited' && `Opens ${new Date(test.scheduledAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
              {test.mode === 'immediate' && `Scheduled ${new Date(test.scheduledAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" /> Completed {test.completedBy}/{test.totalMembers}
              </span>
              <Badge className={cn("text-[10px] border", statusColors[test.status])}>
                {test.status === 'live' && '🟢 Live'}
                {test.status === 'upcoming' && '🟡 Upcoming'}
                {test.status === 'expired' && '🔴 Expired'}
              </Badge>
            </div>
          </div>
          <div>
            {test.status === 'live' && !test.userCompleted && (
              <Button size="sm" className="text-xs h-8">📝 Take Test</Button>
            )}
            {test.status === 'upcoming' && (
              <Button size="sm" variant="outline" className="text-xs h-8" disabled>⏰ Not Yet</Button>
            )}
            {test.status === 'expired' && (
              <Button size="sm" variant="ghost" className="text-xs h-8">📊 Results</Button>
            )}
            {test.userCompleted && (
              <Button size="sm" variant="ghost" className="text-xs h-8">📊 Results</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
        <FileCheck className="h-5 w-5 text-primary" /> Scheduled Tests
      </h2>
      <Tabs defaultValue="all">
        <TabsList className="mb-3">
          <TabsTrigger value="all" className="text-xs">All ({tests.length})</TabsTrigger>
          <TabsTrigger value="live" className="text-xs">Live ({live.length})</TabsTrigger>
          <TabsTrigger value="upcoming" className="text-xs">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="completed" className="text-xs">Completed ({expired.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-3">{tests.map(renderTest)}</TabsContent>
        <TabsContent value="live" className="space-y-3">{live.map(renderTest)}</TabsContent>
        <TabsContent value="upcoming" className="space-y-3">{upcoming.map(renderTest)}</TabsContent>
        <TabsContent value="completed" className="space-y-3">{expired.map(renderTest)}</TabsContent>
      </Tabs>
    </div>
  );
};

export default ScheduledTestsList;
