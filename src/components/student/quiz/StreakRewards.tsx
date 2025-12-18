import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Flame, Trophy, Gift, Star, Crown, Target, Zap,
  Award, Sparkles, Lock, CheckCircle, Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalQuizzesCompleted: number;
  lastCompletedDate: string;
  todayCompleted: boolean;
  weeklyProgress: boolean[];
}

interface Reward {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  streakRequired: number;
  unlocked: boolean;
  claimed: boolean;
  type: 'badge' | 'bonus' | 'feature';
}

interface StreakRewardsProps {
  streakData: StreakData;
  onClaimReward: (rewardId: string) => void;
}

const StreakRewards: React.FC<StreakRewardsProps> = ({ streakData, onClaimReward }) => {
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [newMilestone, setNewMilestone] = useState<Reward | null>(null);

  const rewards: Reward[] = [
    {
      id: 'streak_3',
      name: 'Quick Starter',
      description: '3 day streak - Unlock bonus quiz',
      icon: <Zap className="h-6 w-6" />,
      streakRequired: 3,
      unlocked: streakData.currentStreak >= 3,
      claimed: false,
      type: 'badge'
    },
    {
      id: 'streak_7',
      name: 'Week Warrior',
      description: '7 day streak - 2x points for a day',
      icon: <Star className="h-6 w-6" />,
      streakRequired: 7,
      unlocked: streakData.currentStreak >= 7,
      claimed: false,
      type: 'bonus'
    },
    {
      id: 'streak_14',
      name: 'Dedicated Learner',
      description: '14 day streak - Unlock premium quiz pack',
      icon: <Award className="h-6 w-6" />,
      streakRequired: 14,
      unlocked: streakData.currentStreak >= 14,
      claimed: false,
      type: 'feature'
    },
    {
      id: 'streak_30',
      name: 'Month Master',
      description: '30 day streak - Exclusive badge + 500 bonus points',
      icon: <Trophy className="h-6 w-6" />,
      streakRequired: 30,
      unlocked: streakData.currentStreak >= 30,
      claimed: false,
      type: 'badge'
    },
    {
      id: 'streak_60',
      name: 'Champion',
      description: '60 day streak - Champion badge + Premium features',
      icon: <Crown className="h-6 w-6" />,
      streakRequired: 60,
      unlocked: streakData.currentStreak >= 60,
      claimed: false,
      type: 'feature'
    },
    {
      id: 'streak_100',
      name: 'Legend',
      description: '100 day streak - Legendary status + All rewards',
      icon: <Sparkles className="h-6 w-6" />,
      streakRequired: 100,
      unlocked: streakData.currentStreak >= 100,
      claimed: false,
      type: 'badge'
    }
  ];

  const nextMilestone = rewards.find(r => !r.unlocked);
  const daysToNextMilestone = nextMilestone ? nextMilestone.streakRequired - streakData.currentStreak : 0;

  const handleClaimReward = (reward: Reward) => {
    if (!reward.unlocked) return;
    
    setNewMilestone(reward);
    setShowCelebration(true);
    onClaimReward(reward.id);
    
    toast.success(`🎉 ${reward.name} Unlocked!`, {
      description: reward.description
    });

    setTimeout(() => {
      setShowCelebration(false);
      setNewMilestone(null);
    }, 3000);
  };

  const getStreakColor = () => {
    if (streakData.currentStreak >= 30) return 'text-yellow-500';
    if (streakData.currentStreak >= 14) return 'text-orange-500';
    if (streakData.currentStreak >= 7) return 'text-primary';
    return 'text-muted-foreground';
  };

  const getStreakBgColor = () => {
    if (streakData.currentStreak >= 30) return 'bg-yellow-500/10 border-yellow-500/30';
    if (streakData.currentStreak >= 14) return 'bg-orange-500/10 border-orange-500/30';
    if (streakData.currentStreak >= 7) return 'bg-primary/10 border-primary/30';
    return 'bg-muted';
  };

  return (
    <>
      {/* Streak Card */}
      <Card className={`${getStreakBgColor()} transition-all`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${streakData.currentStreak >= 7 ? 'bg-gradient-to-br from-orange-400 to-red-500' : 'bg-muted'}`}>
                <Flame className={`h-6 w-6 ${streakData.currentStreak >= 7 ? 'text-white' : getStreakColor()}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className={`text-3xl font-bold ${getStreakColor()}`}>
                  {streakData.currentStreak} <span className="text-lg">days</span>
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowRewardsModal(true)}>
              <Gift className="h-4 w-4 mr-1" />
              Rewards
            </Button>
          </div>

          {/* Weekly Progress */}
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">This Week</p>
            <div className="flex gap-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <div
                  key={index}
                  className={`flex-1 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-all ${
                    streakData.weeklyProgress[index]
                      ? 'bg-green-500 text-white'
                      : index === new Date().getDay() - 1 || (index === 6 && new Date().getDay() === 0)
                      ? 'bg-primary/20 border-2 border-primary border-dashed'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {streakData.weeklyProgress[index] ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    day
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Next Milestone */}
          {nextMilestone && (
            <div className="bg-background/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Next: {nextMilestone.name}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {daysToNextMilestone} days left
                </Badge>
              </div>
              <Progress 
                value={(streakData.currentStreak / nextMilestone.streakRequired) * 100} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {streakData.currentStreak}/{nextMilestone.streakRequired} days completed
              </p>
            </div>
          )}

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-background/50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold">{streakData.longestStreak}</p>
              <p className="text-xs text-muted-foreground">Best Streak</p>
            </div>
            <div className="bg-background/50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold">{streakData.totalQuizzesCompleted}</p>
              <p className="text-xs text-muted-foreground">Total Quizzes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Modal */}
      <Dialog open={showRewardsModal} onOpenChange={setShowRewardsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Streak Rewards
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-3 p-1">
              {rewards.map((reward) => (
                <Card
                  key={reward.id}
                  className={`transition-all ${
                    reward.unlocked
                      ? 'bg-gradient-to-r from-primary/5 to-primary/10 border-primary/30'
                      : 'opacity-60'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          reward.unlocked
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {reward.unlocked ? reward.icon : <Lock className="h-6 w-6" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{reward.name}</h4>
                          {reward.unlocked && (
                            <Badge className="bg-green-500/10 text-green-500 text-xs">
                              Unlocked!
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          <span className="text-xs text-muted-foreground">
                            {reward.streakRequired} day streak required
                          </span>
                        </div>
                      </div>
                      {reward.unlocked && !reward.claimed && (
                        <Button size="sm" onClick={() => handleClaimReward(reward)}>
                          Claim
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && newMilestone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="inline-block p-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-4"
              >
                {newMilestone.icon}
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">🎉 {newMilestone.name}</h2>
              <p className="text-muted-foreground">{newMilestone.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StreakRewards;
