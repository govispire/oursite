import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trophy, Flame, Users, Eye, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Team } from './TeamStudyTypes';
import ScheduleTestModal from './ScheduleTestModal';

interface MyTeamsGridProps {
  teams: Team[];
  onScheduleTest: (teamId: string, data: any) => void;
}

const categoryGradients: Record<string, { border: string; badge: string; avatar: string }> = {
  UPSC: { border: 'from-indigo-500 to-violet-500', badge: 'bg-indigo-500/10 text-indigo-600 border-indigo-200', avatar: 'from-indigo-500 to-violet-500' },
  Banking: { border: 'from-emerald-500 to-teal-500', badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-200', avatar: 'from-emerald-500 to-teal-500' },
  SSC: { border: 'from-amber-500 to-orange-500', badge: 'bg-amber-500/10 text-amber-600 border-amber-200', avatar: 'from-amber-500 to-orange-500' },
  Railway: { border: 'from-rose-500 to-pink-500', badge: 'bg-rose-500/10 text-rose-600 border-rose-200', avatar: 'from-rose-500 to-pink-500' },
};

const getStyle = (category: string) => categoryGradients[category] || categoryGradients.UPSC;

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
          {teams.map((team, idx) => {
            const style = getStyle(team.category);
            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
              >
                <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
                  {/* Category gradient top border */}
                  <div className={`h-1 bg-gradient-to-r ${style.border}`} />
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-sm font-bold text-white shadow-md", style.avatar)}>
                          {team.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <CardTitle className="text-sm">{team.name}</CardTitle>
                          <Badge variant="outline" className={cn("text-[10px] mt-0.5 border", style.badge)}>
                            {team.category}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px]">{team.userRole === 'admin' ? '👑 Admin' : 'Member'}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-muted/40">
                        <p className="text-lg font-extrabold">#{team.rank}</p>
                        <p className="text-[10px] text-muted-foreground">Rank</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/40">
                        <p className="text-lg font-extrabold">{team.avgScore}%</p>
                        <p className="text-[10px] text-muted-foreground">Avg Score</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/40">
                        <p className="text-lg font-extrabold flex items-center justify-center gap-0.5">
                          <Flame className="h-4 w-4 text-orange-500" />{team.streak}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Streak</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                        <span>Goal Progress</span>
                        <span className="font-bold">{team.goalProgress}%</span>
                      </div>
                      <div className="relative">
                        <Progress value={team.goalProgress} className="h-2" />
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-wrap">
                      {team.badges.slice(0, 3).map(badge => (
                        <Badge key={badge} variant="secondary" className={cn("text-[9px] px-1.5 py-0.5 border", style.badge)}>
                          {badge}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Member avatars with hover expand */}
                      <div className="flex -space-x-2 group/avatars">
                        {team.members.slice(0, 4).map((m, i) => (
                          <div
                            key={i}
                            className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-background flex items-center justify-center text-[9px] font-bold transition-all duration-200 hover:scale-110 hover:z-10"
                            style={{ transitionDelay: `${i * 30}ms` }}
                          >
                            {m.avatar}
                          </div>
                        ))}
                        {team.members.length > 4 && (
                          <div className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[9px] font-medium">
                            +{team.members.length - 4}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setDetailTeam(team)}>
                          <Eye className="h-3 w-3 mr-1" /> Details
                        </Button>
                        {team.userRole === 'admin' && (
                          <Button size="sm" className={cn("h-7 text-xs bg-gradient-to-r text-white border-0 shadow-sm", style.border)} onClick={() => setScheduleTeamId(team.id)}>
                            <Calendar className="h-3 w-3 mr-1" /> Schedule
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
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
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 text-center">
                  <p className="text-xl font-extrabold">#{detailTeam.rank}</p>
                  <p className="text-xs text-muted-foreground">Team Rank</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 text-center">
                  <p className="text-xl font-extrabold">{detailTeam.avgScore}%</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
              </div>
              {/* Member performance bars */}
              <div>
                <p className="text-sm font-semibold mb-2">Members ({detailTeam.members.length})</p>
                <div className="space-y-2">
                  {detailTeam.members.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-xs font-bold text-white", getStyle(detailTeam.category).avatar)}>
                          {m.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{m.name}</p>
                          <p className="text-[10px] text-muted-foreground">{m.role === 'admin' ? '👑 Admin' : `Member • ${m.testsCompleted} tests`}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div className="w-20">
                          <Progress value={m.score} className="h-1.5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{m.score}%</p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <Flame className="h-3 w-3 text-orange-500" />{m.streak}d
                          </p>
                        </div>
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
