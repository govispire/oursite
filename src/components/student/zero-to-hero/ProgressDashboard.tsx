import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Target, 
  Zap, 
  TrendingUp, 
  Crown,
  Medal,
  Award
} from 'lucide-react';
import { useZeroToHero } from '@/hooks/useZeroToHero';
import { motion } from 'framer-motion';

const ProgressDashboard = () => {
  const { journeyState } = useZeroToHero();

  const totalDays = journeyState.goalDuration || 15;
  const completedDays = journeyState.completedDays.length;
  const overallProgress = (completedDays / totalDays) * 100;
  const totalXP = completedDays * 75;

  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, name: 'Priya S.', xp: 2450, avatar: '👩‍🎓', streak: 15 },
    { rank: 2, name: 'Rahul K.', xp: 2280, avatar: '👨‍💻', streak: 12 },
    { rank: 3, name: 'Ananya M.', xp: 2150, avatar: '👩‍💼', streak: 10 },
    { rank: 4, name: 'You', xp: totalXP, avatar: '🎯', streak: journeyState.streak, isUser: true },
    { rank: 5, name: 'Vikram R.', xp: 1890, avatar: '👨‍🎓', streak: 8 },
    { rank: 6, name: 'Sneha P.', xp: 1750, avatar: '👩‍🔬', streak: 7 },
    { rank: 7, name: 'Arjun D.', xp: 1620, avatar: '👨‍🏫', streak: 6 },
  ].sort((a, b) => b.xp - a.xp).map((item, index) => ({ ...item, rank: index + 1 }));

  const userRank = leaderboard.find(l => l.isUser)?.rank || 4;

  return (
    <div className="space-y-6">
      {/* XP & Rank Overview */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-0 bg-gradient-to-br from-primary to-primary/80 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total XP Earned</p>
                <p className="text-4xl font-bold">{totalXP}</p>
                <p className="text-sm opacity-80 mt-1">+75 XP per day completed</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Zap className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-amber-400 to-orange-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Your Rank</p>
                <p className="text-4xl font-bold">#{userRank}</p>
                <p className="text-sm opacity-80 mt-1">Top {Math.round((userRank / 100) * 100)}% of learners</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Trophy className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Journey Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Journey Progress
            </span>
            <Badge variant="outline" className="text-primary border-primary">
              {completedDays}/{totalDays} Days
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Progress value={overallProgress} className="h-4" />
            <div 
              className="absolute top-0 h-4 flex items-center justify-center text-xs font-bold text-white"
              style={{ left: `${Math.min(overallProgress, 95)}%` }}
            >
              {Math.round(overallProgress)}%
            </div>
          </div>
          
          {/* Milestones */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>Start</span>
            <span className={overallProgress >= 25 ? 'text-primary font-medium' : ''}>25%</span>
            <span className={overallProgress >= 50 ? 'text-primary font-medium' : ''}>50%</span>
            <span className={overallProgress >= 75 ? 'text-primary font-medium' : ''}>75%</span>
            <span className={overallProgress >= 100 ? 'text-primary font-medium' : ''}>Mastery!</span>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboard.map((player, index) => (
              <motion.div
                key={player.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                  player.isUser 
                    ? 'bg-primary/10 border-2 border-primary' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {/* Rank Badge */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  player.rank === 1 
                    ? 'bg-amber-400 text-white' 
                    : player.rank === 2 
                    ? 'bg-gray-300 text-gray-700' 
                    : player.rank === 3 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {player.rank <= 3 ? (
                    player.rank === 1 ? <Crown className="h-5 w-5" /> :
                    player.rank === 2 ? <Medal className="h-5 w-5" /> :
                    <Award className="h-5 w-5" />
                  ) : (
                    `#${player.rank}`
                  )}
                </div>

                {/* Avatar & Name */}
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{player.avatar}</span>
                  <div>
                    <p className={`font-medium ${player.isUser ? 'text-primary' : 'text-gray-900'}`}>
                      {player.name}
                      {player.isUser && <span className="ml-2 text-xs">(You)</span>}
                    </p>
                    <p className="text-xs text-gray-500">{player.streak} day streak 🔥</p>
                  </div>
                </div>

                {/* XP */}
                <div className="text-right">
                  <p className="font-bold text-gray-900">{player.xp.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">XP</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weak Areas Mastery */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Weak Areas → Mastery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {journeyState.weakAreas.map((area) => {
            const areaProgress = Math.min(overallProgress + Math.random() * 20, 100);
            return (
              <div key={area.subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{area.subject}</span>
                  <Badge 
                    variant={areaProgress >= 80 ? 'default' : 'secondary'}
                    className={areaProgress >= 80 ? 'bg-green-500' : ''}
                  >
                    {areaProgress >= 80 ? 'Mastered!' : `${Math.round(areaProgress)}%`}
                  </Badge>
                </div>
                <Progress value={areaProgress} className="h-2" />
                <div className="flex flex-wrap gap-1">
                  {area.topics.map((topic) => (
                    <Badge key={topic} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}

          {journeyState.weakAreas.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No weak areas selected yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDashboard;
