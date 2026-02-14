export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'member';
  score: number;
  testsCompleted: number;
  streak: number;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  category: string;
  code: string;
  isPublic: boolean;
  members: TeamMember[];
  rank: number;
  avgScore: number;
  streak: number;
  totalTests: number;
  goalProgress: number;
  badges: string[];
  userRole: 'admin' | 'member';
}

export interface ScheduledTest {
  id: string;
  title: string;
  teamId: string;
  teamName: string;
  mode: 'anytime' | 'limited' | 'immediate';
  type: string;
  subject: string;
  difficulty: string;
  questions: number;
  duration: number;
  totalMarks: number;
  scheduledAt: string;
  windowHours?: number;
  status: 'live' | 'upcoming' | 'expired';
  completedBy: number;
  totalMembers: number;
  userCompleted: boolean;
}

export interface LeaderboardTeam {
  id: string;
  name: string;
  avatar: string;
  members: number;
  tests: number;
  streak: number;
  score: number;
  trend: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  message: string;
  timestamp: string;
}

export type TestMode = 'anytime' | 'limited' | 'immediate';
export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'all-time';
