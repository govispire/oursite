import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Trophy, Flame, FileCheck } from 'lucide-react';
import { Team } from './TeamStudyTypes';

interface HeroStatsProps {
  teams: Team[];
}

const HeroStats: React.FC<HeroStatsProps> = ({ teams }) => {
  const bestRank = teams.length > 0 ? Math.min(...teams.map(t => t.rank)) : 0;
  const maxStreak = teams.length > 0 ? Math.max(...teams.map(t => t.streak)) : 0;
  const totalTests = teams.reduce((sum, t) => sum + t.totalTests, 0);

  const stats = [
    { icon: <Users className="h-5 w-5" />, label: 'Active Teams', value: teams.length, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: <Trophy className="h-5 w-5" />, label: 'Best Rank', value: `#${bestRank}`, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { icon: <Flame className="h-5 w-5" />, label: 'Day Streak', value: maxStreak, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { icon: <FileCheck className="h-5 w-5" />, label: 'Tests Taken', value: totalTests, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${stat.bg}`}>
              <span className={stat.color}>{stat.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HeroStats;
