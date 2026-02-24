import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Sparkles, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { differenceInHours, differenceInMinutes, parseISO } from 'date-fns';
import HeroStats from '@/components/student/team-study/HeroStats';
import LeaderboardSection from '@/components/student/team-study/LeaderboardSection';
import MyTeamsGrid from '@/components/student/team-study/MyTeamsGrid';
import ScheduledTestsList from '@/components/student/team-study/ScheduledTestsList';
import JoinTeamSection from '@/components/student/team-study/JoinTeamSection';
import TeamChat from '@/components/student/team-study/TeamChat';
import CreateTeamModal from '@/components/student/team-study/CreateTeamModal';
import { mockTeams, mockScheduledTests, mockLeaderboard, publicTeams, mockChatMessages } from '@/components/student/team-study/teamStudyData';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const TeamStudy = () => {
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const { toast } = useToast();

  const handleCreateTeam = (data: any) => {
    toast({ title: '🎉 Team Created!', description: `${data.name} is ready. Share the code with friends!` });
  };

  const handleScheduleTest = (teamId: string, data: any) => {
    toast({ title: '✅ Test Scheduled', description: `${data.testName} has been scheduled for your team.` });
  };

  // Next upcoming test
  const nextTest = mockScheduledTests
    .filter(t => t.status === 'upcoming' || t.status === 'live')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0];

  const getCountdown = () => {
    if (!nextTest) return null;
    const now = new Date();
    const target = parseISO(nextTest.scheduledAt);
    const hrs = differenceInHours(target, now);
    const mins = differenceInMinutes(target, now) % 60;
    if (hrs < 0) return 'Starting now!';
    return `${hrs}h ${mins}m`;
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-20"
    >
      {/* Hero Header */}
      <motion.div variants={item} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary/70 to-accent/60 p-6 md:p-8">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 w-32 h-32 rounded-full bg-white/30 blur-3xl animate-pulse" />
          <div className="absolute bottom-4 right-12 w-40 h-40 rounded-full bg-white/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-white/25 blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-primary-foreground/80" />
              <Badge className="bg-white/20 text-primary-foreground border-white/30 text-[10px]">
                COLLABORATIVE LEARNING
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-primary-foreground tracking-tight">
              Team Study
            </h1>
            <p className="text-sm text-primary-foreground/80 mt-1 max-w-md">
              Collaborate, compete, and conquer together. Your squad is your superpower.
            </p>
          </div>
          <Button
            onClick={() => setShowCreateTeam(true)}
            className="bg-white/20 hover:bg-white/30 text-primary-foreground border border-white/30 backdrop-blur-sm shadow-lg"
          >
            <Plus className="h-4 w-4 mr-1" /> Create Team
          </Button>
        </div>
      </motion.div>

      {/* Hero Stats */}
      <motion.div variants={item}>
        <HeroStats teams={mockTeams} />
      </motion.div>

      {/* Next Test Countdown Banner */}
      {nextTest && (
        <motion.div variants={item}>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground">NEXT SCHEDULED TEST</p>
              <p className="text-sm font-bold truncate">{nextTest.title}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Starts in</p>
              <p className="text-lg font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                {getCountdown()}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leaderboard */}
      <motion.div variants={item}>
        <LeaderboardSection leaderboard={mockLeaderboard} />
      </motion.div>

      {/* My Teams */}
      <motion.div variants={item}>
        <MyTeamsGrid teams={mockTeams} onScheduleTest={handleScheduleTest} />
      </motion.div>

      {/* Scheduled Tests */}
      <motion.div variants={item}>
        <ScheduledTestsList tests={mockScheduledTests} />
      </motion.div>

      {/* Join Team */}
      <motion.div variants={item}>
        <JoinTeamSection publicTeams={publicTeams} />
      </motion.div>

      {/* Chat */}
      <TeamChat messages={mockChatMessages} />

      <CreateTeamModal
        open={showCreateTeam}
        onClose={() => setShowCreateTeam(false)}
        onCreate={handleCreateTeam}
      />
    </motion.div>
  );
};

export default TeamStudy;
