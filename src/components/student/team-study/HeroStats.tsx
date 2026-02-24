import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Trophy, Flame, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Team } from './TeamStudyTypes';

interface HeroStatsProps {
  teams: Team[];
}

const useCountUp = (target: number, duration = 1200) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
};

const StatCard = ({ icon, label, value, gradient, delay }: { icon: React.ReactNode; label: string; value: number | string; gradient: string; delay: number }) => {
  const numericValue = typeof value === 'number' ? value : parseInt(value.toString().replace('#', '')) || 0;
  const animated = useCountUp(numericValue);
  const displayValue = typeof value === 'string' && value.startsWith('#') ? `#${animated}` : animated;

  const sparkline = [40, 55, 45, 70, 60, 80, 75, 90, 85, 95];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
    >
      <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
        <CardContent className="p-4 flex items-center gap-3">
          <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="22" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="138" strokeDashoffset="40" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-2xl font-extrabold tracking-tight">{displayValue}</p>
            <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
            <svg className="w-full h-4 mt-1" viewBox="0 0 100 20" preserveAspectRatio="none">
              <polyline
                points={sparkline.map((p, i) => `${i * 11},${20 - p / 5}`).join(' ')}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary/40"
              />
            </svg>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const HeroStats: React.FC<HeroStatsProps> = ({ teams }) => {
  const bestRank = teams.length > 0 ? Math.min(...teams.map(t => t.rank)) : 0;
  const maxStreak = teams.length > 0 ? Math.max(...teams.map(t => t.streak)) : 0;
  const totalTests = teams.reduce((sum, t) => sum + t.totalTests, 0);

  const stats = [
    { icon: <Users className="h-5 w-5" />, label: 'Active Teams', value: teams.length, gradient: 'from-blue-500 to-cyan-400' },
    { icon: <Trophy className="h-5 w-5" />, label: 'Best Rank', value: `#${bestRank}`, gradient: 'from-yellow-400 to-amber-500' },
    { icon: <Flame className="h-5 w-5" />, label: 'Day Streak', value: maxStreak, gradient: 'from-orange-500 to-red-400' },
    { icon: <FileCheck className="h-5 w-5" />, label: 'Tests Taken', value: totalTests, gradient: 'from-emerald-500 to-teal-400' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <StatCard key={stat.label} {...stat} delay={i * 0.1} />
      ))}
    </div>
  );
};

export default HeroStats;
