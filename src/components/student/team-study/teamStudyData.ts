import { Team, ScheduledTest, LeaderboardTeam, ChatMessage } from './TeamStudyTypes';

export const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Success Squad',
    description: 'UPSC aspirants aiming for top 100 ranks. Daily mocks and discussions.',
    category: 'UPSC',
    code: 'SS2026',
    isPublic: false,
    members: [
      { id: 'u1', name: 'You', avatar: 'Y', role: 'admin', score: 82, testsCompleted: 24, streak: 15 },
      { id: 'u2', name: 'Priya Sharma', avatar: 'PS', role: 'member', score: 78, testsCompleted: 22, streak: 12 },
      { id: 'u3', name: 'Rahul Verma', avatar: 'RV', role: 'member', score: 85, testsCompleted: 26, streak: 18 },
      { id: 'u4', name: 'Anita Desai', avatar: 'AD', role: 'member', score: 76, testsCompleted: 20, streak: 10 },
      { id: 'u5', name: 'Vikram Singh', avatar: 'VS', role: 'member', score: 80, testsCompleted: 23, streak: 14 },
    ],
    rank: 12,
    avgScore: 80.2,
    streak: 15,
    totalTests: 28,
    goalProgress: 68,
    badges: ['Top 20', '15-day Streak', 'Rising Star'],
    userRole: 'admin',
  },
  {
    id: '2',
    name: 'Banking Blazers',
    description: 'IBPS and SBI exam preparation group with weekly mock tests.',
    category: 'Banking',
    code: 'BB2026',
    isPublic: true,
    members: [
      { id: 'u1', name: 'You', avatar: 'Y', role: 'member', score: 75, testsCompleted: 18, streak: 8 },
      { id: 'u6', name: 'Neha Patel', avatar: 'NP', role: 'admin', score: 88, testsCompleted: 30, streak: 22 },
      { id: 'u7', name: 'Arjun Kumar', avatar: 'AK', role: 'member', score: 72, testsCompleted: 16, streak: 6 },
    ],
    rank: 8,
    avgScore: 78.3,
    streak: 8,
    totalTests: 22,
    goalProgress: 55,
    badges: ['Top 10', 'Consistent'],
    userRole: 'member',
  },
  {
    id: '3',
    name: 'SSC Warriors',
    description: 'SSC CGL and CHSL preparation with daily practice and doubt solving.',
    category: 'SSC',
    code: 'SW2026',
    isPublic: false,
    members: [
      { id: 'u1', name: 'You', avatar: 'Y', role: 'admin', score: 90, testsCompleted: 32, streak: 20 },
      { id: 'u8', name: 'Deepa Roy', avatar: 'DR', role: 'member', score: 84, testsCompleted: 28, streak: 16 },
      { id: 'u9', name: 'Karan Mehta', avatar: 'KM', role: 'member', score: 79, testsCompleted: 25, streak: 13 },
      { id: 'u10', name: 'Sita Ram', avatar: 'SR', role: 'member', score: 86, testsCompleted: 30, streak: 19 },
    ],
    rank: 5,
    avgScore: 84.8,
    streak: 20,
    totalTests: 35,
    goalProgress: 82,
    badges: ['Top 5', '20-day Streak', 'Champion', 'Rising Star'],
    userRole: 'admin',
  },
];

export const mockScheduledTests: ScheduledTest[] = [
  {
    id: 't1', title: 'Mock Test #16 - General Studies', teamId: '1', teamName: 'Success Squad',
    mode: 'anytime', type: 'Prelims', subject: 'GS', difficulty: 'Medium',
    questions: 100, duration: 120, totalMarks: 200, scheduledAt: '2026-02-15T18:00:00',
    status: 'live', completedBy: 3, totalMembers: 5, userCompleted: false,
  },
  {
    id: 't2', title: 'Quantitative Aptitude Challenge', teamId: '2', teamName: 'Banking Blazers',
    mode: 'limited', type: 'Sectional', subject: 'Quant', difficulty: 'Hard',
    questions: 50, duration: 60, totalMarks: 100, scheduledAt: '2026-02-16T10:00:00',
    windowHours: 5, status: 'upcoming', completedBy: 0, totalMembers: 3, userCompleted: false,
  },
  {
    id: 't3', title: 'Team Challenge - English', teamId: '3', teamName: 'SSC Warriors',
    mode: 'immediate', type: 'Speed', subject: 'English', difficulty: 'Easy',
    questions: 30, duration: 30, totalMarks: 60, scheduledAt: '2026-02-14T14:00:00',
    status: 'expired', completedBy: 4, totalMembers: 4, userCompleted: true,
  },
  {
    id: 't4', title: 'Indian Polity Deep Dive', teamId: '1', teamName: 'Success Squad',
    mode: 'limited', type: 'Mains', subject: 'Polity', difficulty: 'Hard',
    questions: 80, duration: 90, totalMarks: 160, scheduledAt: '2026-02-17T09:00:00',
    windowHours: 12, status: 'upcoming', completedBy: 0, totalMembers: 5, userCompleted: false,
  },
];

export const mockLeaderboard: LeaderboardTeam[] = [
  { id: 'l1', name: 'Success Squad', avatar: 'SS', members: 5, tests: 58, streak: 12, score: 94.2, trend: 3 },
  { id: 'l2', name: 'Achievers Club', avatar: 'AC', members: 6, tests: 52, streak: 10, score: 91.8, trend: -1 },
  { id: 'l3', name: 'The Strivers', avatar: 'TS', members: 4, tests: 45, streak: 8, score: 89.5, trend: 2 },
  { id: 'l4', name: 'Elite Warriors', avatar: 'EW', members: 7, tests: 61, streak: 15, score: 88.1, trend: 0 },
  { id: 'l5', name: 'SSC Warriors', avatar: 'SW', members: 4, tests: 35, streak: 20, score: 84.8, trend: 5 },
];

export const publicTeams: Team[] = [
  {
    id: 'p1', name: 'Elite Warriors', description: 'Top UPSC study group with daily quizzes.',
    category: 'UPSC', code: 'EW2026', isPublic: true,
    members: Array(7).fill({ id: '', name: '', avatar: '', role: 'member' as const, score: 0, testsCompleted: 0, streak: 0 }),
    rank: 4, avgScore: 88.1, streak: 15, totalTests: 61, goalProgress: 75,
    badges: ['Top 5'], userRole: 'member',
  },
  {
    id: 'p2', name: 'Railway Rangers', description: 'RRB NTPC and Group D preparation team.',
    category: 'Railway', code: 'RR2026', isPublic: true,
    members: Array(5).fill({ id: '', name: '', avatar: '', role: 'member' as const, score: 0, testsCompleted: 0, streak: 0 }),
    rank: 18, avgScore: 74.5, streak: 9, totalTests: 30, goalProgress: 48,
    badges: ['Consistent'], userRole: 'member',
  },
  {
    id: 'p3', name: 'IBPS Achievers', description: 'Banking exam group focused on speed and accuracy.',
    category: 'Banking', code: 'IA2026', isPublic: true,
    members: Array(6).fill({ id: '', name: '', avatar: '', role: 'member' as const, score: 0, testsCompleted: 0, streak: 0 }),
    rank: 11, avgScore: 81.2, streak: 11, totalTests: 42, goalProgress: 62,
    badges: ['Top 15', 'Rising Star'], userRole: 'member',
  },
];

export const mockChatMessages: ChatMessage[] = [
  { id: 'c1', sender: 'Priya Sharma', avatar: 'PS', message: 'Hey everyone! Ready for tomorrow\'s mock test?', timestamp: '10:30 AM' },
  { id: 'c2', sender: 'Rahul Verma', avatar: 'RV', message: 'Yes! I\'ve been revising Indian Polity all week 📚', timestamp: '10:32 AM' },
  { id: 'c3', sender: 'You', avatar: 'Y', message: 'Great job team! Our rank improved to #12 this week 🎉', timestamp: '10:35 AM' },
  { id: 'c4', sender: 'Anita Desai', avatar: 'AD', message: 'Can someone share notes on Article 370?', timestamp: '10:40 AM' },
  { id: 'c5', sender: 'Vikram Singh', avatar: 'VS', message: 'I have detailed notes, sharing in a min!', timestamp: '10:42 AM' },
];
