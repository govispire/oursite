import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trophy, Flame, Users, FileCheck, Eye, BarChart2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Team } from './TeamStudyTypes';
import ScheduleTestModal from './ScheduleTestModal';

interface MyTeamsGridProps {
  teams: Team[];
  onScheduleTest: (teamId: string, data: any) => void;
}

const MyTeamsGrid: React.FC<MyTeamsGridProps> = ({ teams, onScheduleTest }) => {
  const [detailTeam, setDetailTeam] = useState<Team | null>(null);
  const [scheduleTeamId, setScheduleTeamId] = useState<string | null>(null);

  return (
    <>
      <div>
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" /> My Teams
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(team => (
            <Card key={team.id} className="border-none shadow-sm hover:shadow-md transition-shadow group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center text-sm font-bold text-primary-foreground">
                      {team.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <CardTitle className="text-sm">{team.name}</CardTitle>
                      <Badge variant="secondary" className="text-[10px] mt-0.5">{team.category}</Badge>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{team.userRole === 'admin' ? '👑 Admin' : 'Member'}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold">#{team.rank}</p>
                    <p className="text-[10px] text-muted-foreground">Rank</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{team.avgScore}%</p>
                    <p className="text-[10px] text-muted-foreground">Avg Score</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold flex items-center justify-center gap-0.5">
                      <Flame className="h-4 w-4 text-orange-500" />{team.streak}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Streak</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Goal Progress</span>
                    <span>{team.goalProgress}%</span>
                  </div>
                  <Progress value={team.goalProgress} className="h-1.5" />
                </div>

                <div className="flex items-center gap-1 flex-wrap">
                  {team.badges.slice(0, 3).map(badge => (
                    <Badge key={badge} variant="secondary" className="text-[9px] px-1.5 py-0">
                      {badge}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex -space-x-2">
                    {team.members.slice(0, 4).map((m, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[9px] font-medium">
                        {m.avatar}
                      </div>
                    ))}
                    {team.members.length > 4 && (
                      <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[9px]">
                        +{team.members.length - 4}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setDetailTeam(team)}>
                      <Eye className="h-3 w-3 mr-1" /> Details
                    </Button>
                    {team.userRole === 'admin' && (
                      <Button size="sm" className="h-7 text-xs" onClick={() => setScheduleTeamId(team.id)}>
                        <Calendar className="h-3 w-3 mr-1" /> Schedule
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Detail Dialog */}
      <Dialog open={!!detailTeam} onOpenChange={() => setDetailTeam(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              {detailTeam?.name}
            </DialogTitle>
          </DialogHeader>
          {detailTeam && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{detailTeam.description}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <p className="text-xl font-bold">#{detailTeam.rank}</p>
                  <p className="text-xs text-muted-foreground">Team Rank</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <p className="text-xl font-bold">{detailTeam.avgScore}%</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">Members ({detailTeam.members.length})</p>
                <div className="space-y-2">
                  {detailTeam.members.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">{m.avatar}</div>
                        <div>
                          <p className="text-sm font-medium">{m.name}</p>
                          <p className="text-[10px] text-muted-foreground">{m.role === 'admin' ? '👑 Admin' : `Member • ${m.testsCompleted} tests`}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{m.score}%</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Flame className="h-3 w-3 text-orange-500" />{m.streak}d
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-xs text-muted-foreground mr-1">Team Code:</span>
                <Badge variant="outline" className="font-mono text-xs">{detailTeam.code}</Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Test Modal */}
      <ScheduleTestModal
        open={!!scheduleTeamId}
        onClose={() => setScheduleTeamId(null)}
        onSubmit={(data) => {
          if (scheduleTeamId) onScheduleTest(scheduleTeamId, data);
          setScheduleTeamId(null);
        }}
      />
    </>
  );
};

export default MyTeamsGrid;
