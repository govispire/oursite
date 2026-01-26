import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Medal, 
  Award, 
  Star, 
  Zap, 
  Target,
  Crown,
  Flame,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useZeroToHero } from '@/hooks/useZeroToHero';
import { motion } from 'framer-motion';

const RewardsSection = () => {
  const { journeyState } = useZeroToHero();
  
  const totalXP = journeyState.completedDays.length * 75;
  const totalDays = journeyState.goalDuration || 15;

  // XP Milestones
  const xpMilestones = [
    { xp: 100, reward: 'Bronze Badge', icon: Medal, unlocked: totalXP >= 100 },
    { xp: 250, reward: 'Silver Badge', icon: Award, unlocked: totalXP >= 250 },
    { xp: 500, reward: 'Gold Badge', icon: Trophy, unlocked: totalXP >= 500 },
    { xp: 1000, reward: 'Platinum Badge', icon: Crown, unlocked: totalXP >= 1000 },
  ];

  // Achievement Badges
  const allBadges = [
    { 
      id: 'first_step', 
      name: 'First Step', 
      icon: Star, 
      description: 'Completed Day 1', 
      unlocked: journeyState.completedDays.length >= 1,
      xp: 50
    },
    { 
      id: 'streak_3', 
      name: 'On Fire', 
      icon: Flame, 
      description: '3-day streak', 
      unlocked: journeyState.streak >= 3,
      xp: 75
    },
    { 
      id: 'streak_5', 
      name: '5-Day Warrior', 
      icon: Zap, 
      description: '5-day streak', 
      unlocked: journeyState.streak >= 5,
      xp: 100
    },
    { 
      id: 'streak_10', 
      name: 'Unstoppable', 
      icon: Trophy, 
      description: '10-day streak', 
      unlocked: journeyState.streak >= 10,
      xp: 200
    },
    { 
      id: 'halfway', 
      name: 'Halfway Hero', 
      icon: Target, 
      description: '50% journey done', 
      unlocked: journeyState.completedDays.length >= totalDays / 2,
      xp: 150
    },
    { 
      id: 'mastery', 
      name: 'Topic Master', 
      icon: Crown, 
      description: 'Complete full journey', 
      unlocked: journeyState.completedDays.length >= totalDays,
      xp: 500
    },
  ];

  const unlockedBadges = allBadges.filter(b => b.unlocked);
  const lockedBadges = allBadges.filter(b => !b.unlocked);
  const nextMilestone = xpMilestones.find(m => !m.unlocked);

  return (
    <div className="space-y-6">
      {/* XP Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-0 bg-gradient-to-br from-primary to-primary/80 text-white md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm opacity-80">Total XP Earned</p>
                <p className="text-5xl font-bold">{totalXP}</p>
              </div>
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                <Zap className="h-10 w-10" />
              </div>
            </div>
            
            {nextMilestone && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Next: {nextMilestone.reward}</span>
                  <span>{nextMilestone.xp - totalXP} XP to go</span>
                </div>
                <Progress 
                  value={(totalXP / nextMilestone.xp) * 100} 
                  className="h-2 bg-white/20"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-amber-400 to-orange-500 text-white">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
              <Trophy className="h-7 w-7" />
            </div>
            <p className="text-3xl font-bold">{unlockedBadges.length}/{allBadges.length}</p>
            <p className="text-sm opacity-80">Badges Earned</p>
          </CardContent>
        </Card>
      </div>

      {/* XP Milestones */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            XP Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {xpMilestones.map((milestone, index) => {
              const MilestoneIcon = milestone.icon;
              return (
                <motion.div
                  key={milestone.xp}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl text-center transition-all ${
                    milestone.unlocked 
                      ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300' 
                      : 'bg-gray-100 opacity-60'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    milestone.unlocked 
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500' 
                      : 'bg-gray-300'
                  }`}>
                    <MilestoneIcon className={`h-6 w-6 ${milestone.unlocked ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <p className="font-bold text-gray-900">{milestone.xp} XP</p>
                  <p className="text-xs text-gray-600">{milestone.reward}</p>
                  {milestone.unlocked && (
                    <Badge className="mt-2 bg-green-500">Unlocked</Badge>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Unlocked Badges ({unlockedBadges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {unlockedBadges.map((badge, index) => {
                const BadgeIcon = badge.icon;
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 text-center"
                  >
                    <div className="absolute -top-2 -right-2 text-2xl">✨</div>
                    <div className="w-14 h-14 mx-auto bg-primary rounded-full flex items-center justify-center mb-3">
                      <BadgeIcon className="h-7 w-7 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900">{badge.name}</h4>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                    <Badge className="mt-2 bg-primary/20 text-primary">+{badge.xp} XP</Badge>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Locked Badges */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-gray-400" />
            Locked Badges ({lockedBadges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {lockedBadges.map((badge, index) => {
              const BadgeIcon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className="p-5 rounded-xl bg-gray-100 border-2 border-gray-200 text-center opacity-60"
                >
                  <div className="w-14 h-14 mx-auto bg-gray-300 rounded-full flex items-center justify-center mb-3">
                    <BadgeIcon className="h-7 w-7 text-gray-500" />
                  </div>
                  <h4 className="font-bold text-gray-700">{badge.name}</h4>
                  <p className="text-sm text-gray-500">{badge.description}</p>
                  <div className="mt-2 text-2xl">🔒</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsSection;
