import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Crown, TrendingUp, TrendingDown, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeaderboardTeam, LeaderboardPeriod } from './TeamStudyTypes';

interface LeaderboardSectionProps {
  leaderboard: LeaderboardTeam[];
}

const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ leaderboard }) => {
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');
  const periods: LeaderboardPeriod[] = ['daily', 'weekly', 'monthly', 'all-time'];
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(0, 5);

  const podiumOrder = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd
  const podiumHeights = ['h-24', 'h-32', 'h-20'];
  const podiumColors = [
    'from-sky-400 to-sky-600',
    'from-yellow-400 to-amber-500',
    'from-emerald-400 to-emerald-600',
  ];
  const medals = ['🥈', '👑', '🥉'];

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      {/* Podium */}
      <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" /> Top Performing Teams
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-center gap-4 pt-8 pb-4">
            {podiumOrder.map((team, idx) => team && (
              <div key={team.id} className="flex flex-col items-center group cursor-pointer">
                <span className={cn("text-2xl mb-1", idx === 1 && "animate-bounce")}>{medals[idx]}</span>
                <div className={cn(
                  "w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg shadow-lg transition-transform group-hover:-translate-y-1",
                  podiumColors[idx],
                  idx === 1 && "w-18 h-18 lg:w-20 lg:h-20 text-xl ring-4 ring-yellow-300/50"
                )}>
                  {team.avatar}
                </div>
                <p className="mt-2 text-sm font-semibold text-center max-w-[100px] truncate">{team.name}</p>
                <p className="text-xl font-bold text-primary">{team.score}</p>
                <div className={cn("w-16 rounded-t-lg bg-gradient-to-t mt-2", podiumColors[idx], podiumHeights[idx])} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rankings Sidebar */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Rankings</CardTitle>
          </div>
          <div className="flex gap-1 mt-2">
            {periods.map(p => (
              <Button
                key={p}
                size="sm"
                variant={period === p ? 'default' : 'ghost'}
                className="text-xs h-7 px-2 capitalize"
                onClick={() => setPeriod(p)}
              >
                {p}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {rest.map((team, idx) => (
            <div key={team.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <Badge variant={idx < 3 ? 'default' : 'secondary'} className={cn(
                "w-6 h-6 flex items-center justify-center text-xs p-0 rounded-full",
                idx === 0 && "bg-yellow-500",
                idx === 1 && "bg-gradient-to-r from-sky-400 to-sky-600",
                idx === 2 && "bg-gradient-to-r from-emerald-400 to-emerald-600"
              )}>
                {idx + 1}
              </Badge>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center text-xs font-bold text-primary-foreground">
                {team.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{team.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {team.members} members • {team.tests} tests • <Flame className="inline h-3 w-3 text-orange-500" />{team.streak}d
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{team.score}</p>
                <span className={cn("text-[10px] flex items-center gap-0.5", team.trend > 0 ? "text-green-500" : team.trend < 0 ? "text-red-500" : "text-muted-foreground")}>
                  {team.trend > 0 ? <><TrendingUp className="h-3 w-3" />+{team.trend}</> : team.trend < 0 ? <><TrendingDown className="h-3 w-3" />{team.trend}</> : '—'}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardSection;
