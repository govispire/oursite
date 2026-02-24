import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Crown, TrendingUp, TrendingDown, Flame, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { LeaderboardTeam, LeaderboardPeriod } from './TeamStudyTypes';

interface LeaderboardSectionProps {
  leaderboard: LeaderboardTeam[];
}

const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ leaderboard }) => {
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');
  const periods: LeaderboardPeriod[] = ['daily', 'weekly', 'monthly', 'all-time'];
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(0, 5);

  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumHeights = [96, 128, 80];
  const podiumColors = [
    'from-sky-400 to-sky-600',
    'from-yellow-400 to-amber-500',
    'from-emerald-400 to-emerald-600',
  ];
  const avatarSizes = ['w-14 h-14', 'w-20 h-20', 'w-14 h-14'];
  const medals = ['🥈', '👑', '🥉'];

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      {/* Podium */}
      <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-md">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            Top Performing Teams
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-end justify-center gap-5 md:gap-8 pt-8 pb-4">
            {podiumOrder.map((team, idx) => team && (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx === 1 ? 0.1 : idx === 0 ? 0.25 : 0.35, duration: 0.6, ease: 'easeOut' }}
                className="flex flex-col items-center group cursor-pointer"
              >
                {/* Medal / Crown */}
                <motion.span
                  className="text-2xl mb-1"
                  animate={idx === 1 ? { y: [0, -6, 0] } : {}}
                  transition={idx === 1 ? { repeat: Infinity, duration: 2, ease: 'easeInOut' } : {}}
                >
                  {medals[idx]}
                </motion.span>

                {/* Avatar */}
                <div className={cn(
                  "rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl",
                  podiumColors[idx],
                  avatarSizes[idx],
                  idx === 1 && "text-xl ring-4 ring-yellow-300/40 shadow-yellow-400/30 shadow-xl"
                )}>
                  {team.avatar}
                </div>

                {/* Info */}
                <p className="mt-2 text-xs md:text-sm font-bold text-center max-w-[100px] truncate">{team.name}</p>
                <p className={cn(
                  "text-xl font-extrabold",
                  idx === 1 ? "bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent" : "text-foreground"
                )}>
                  {team.score}
                </p>

                {/* Podium bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: podiumHeights[idx] }}
                  transition={{ delay: 0.4 + idx * 0.15, duration: 0.6, ease: 'easeOut' }}
                  className={cn("w-16 md:w-20 rounded-t-xl bg-gradient-to-t mt-2", podiumColors[idx])}
                  style={{ opacity: 0.85 }}
                />
              </motion.div>
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
          <div className="flex gap-1 mt-2 p-1 bg-muted/50 rounded-lg">
            {periods.map(p => (
              <Button
                key={p}
                size="sm"
                variant={period === p ? 'default' : 'ghost'}
                className={cn(
                  "text-xs h-7 px-2.5 capitalize flex-1 transition-all",
                  period === p && "shadow-sm"
                )}
                onClick={() => setPeriod(p)}
              >
                {p}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <AnimatePresence mode="wait">
            <motion.div
              key={period}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-1.5"
            >
              {rest.map((team, idx) => {
                const isYourTeam = team.name === 'Success Squad';
                return (
                  <div
                    key={team.id}
                    className={cn(
                      "flex items-center gap-2 p-2.5 rounded-xl transition-all duration-200 hover:bg-muted/60 cursor-pointer group",
                      isYourTeam && "bg-primary/5 ring-1 ring-primary/20"
                    )}
                  >
                    <Badge variant={idx < 3 ? 'default' : 'secondary'} className={cn(
                      "w-7 h-7 flex items-center justify-center text-xs p-0 rounded-full font-bold shadow-sm",
                      idx === 0 && "bg-gradient-to-br from-yellow-400 to-amber-500 text-white border-0",
                      idx === 1 && "bg-gradient-to-br from-sky-400 to-sky-600 text-white border-0",
                      idx === 2 && "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-0"
                    )}>
                      {idx + 1}
                    </Badge>
                    <div className={cn(
                      "w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-xs font-bold text-white shadow-sm",
                      idx === 0 ? "from-yellow-400 to-amber-500" : idx === 1 ? "from-sky-400 to-sky-600" : idx === 2 ? "from-emerald-400 to-emerald-600" : "from-primary/40 to-primary/70"
                    )}>
                      {team.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-bold truncate">{team.name}</p>
                        {isYourTeam && (
                          <Badge className="text-[8px] h-4 px-1 bg-primary/20 text-primary border-0">YOU</Badge>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {team.members} members • {team.tests} tests • <Flame className="inline h-3 w-3 text-orange-500" />{team.streak}d
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold">{team.score}</p>
                      <span className={cn("text-[10px] flex items-center gap-0.5 font-medium", team.trend > 0 ? "text-green-500" : team.trend < 0 ? "text-red-500" : "text-muted-foreground")}>
                        {team.trend > 0 ? <><TrendingUp className="h-3 w-3" />+{team.trend}</> : team.trend < 0 ? <><TrendingDown className="h-3 w-3" />{team.trend}</> : '—'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
          <Button variant="ghost" className="w-full text-xs text-primary h-8 mt-2">
            View Full Leaderboard <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardSection;
