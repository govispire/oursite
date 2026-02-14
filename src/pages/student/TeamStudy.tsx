import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import HeroStats from '@/components/student/team-study/HeroStats';
import LeaderboardSection from '@/components/student/team-study/LeaderboardSection';
import MyTeamsGrid from '@/components/student/team-study/MyTeamsGrid';
import ScheduledTestsList from '@/components/student/team-study/ScheduledTestsList';
import JoinTeamSection from '@/components/student/team-study/JoinTeamSection';
import TeamChat from '@/components/student/team-study/TeamChat';
import CreateTeamModal from '@/components/student/team-study/CreateTeamModal';
import { mockTeams, mockScheduledTests, mockLeaderboard, publicTeams, mockChatMessages } from '@/components/student/team-study/teamStudyData';

const TeamStudy = () => {
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const { toast } = useToast();

  const handleCreateTeam = (data: any) => {
    toast({ title: '🎉 Team Created!', description: `${data.name} is ready. Share the code with friends!` });
  };

  const handleScheduleTest = (teamId: string, data: any) => {
    toast({ title: '✅ Test Scheduled', description: `${data.testName} has been scheduled for your team.` });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Study</h1>
          <p className="text-sm text-muted-foreground">Collaborate, compete, and conquer together</p>
        </div>
        <Button onClick={() => setShowCreateTeam(true)}>
          <Plus className="h-4 w-4 mr-1" /> Create Team
        </Button>
      </div>

      <HeroStats teams={mockTeams} />
      <LeaderboardSection leaderboard={mockLeaderboard} />
      <MyTeamsGrid teams={mockTeams} onScheduleTest={handleScheduleTest} />
      <ScheduledTestsList tests={mockScheduledTests} />
      <JoinTeamSection publicTeams={publicTeams} />
      <TeamChat messages={mockChatMessages} />

      <CreateTeamModal
        open={showCreateTeam}
        onClose={() => setShowCreateTeam(false)}
        onCreate={handleCreateTeam}
      />
    </div>
  );
};

export default TeamStudy;
