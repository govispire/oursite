import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Trophy, Clock, Target, Brain, TrendingUp, Star, 
  Play, CheckCircle, Lock, Flame, Award, Zap,
  Calculator, BookOpen, FileText, Globe, Users,
  ChevronRight, Sparkles, AlertTriangle, BarChart3, ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import QuizAttempt, { QuizResult } from '@/components/student/quiz/QuizAttempt';
import StreakRewards from '@/components/student/quiz/StreakRewards';
import { getQuestionsForQuiz } from '@/data/quizQuestionsData';

interface Quiz {
  id: string;
  title: string;
  subject: string;
  questions: number;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
  score?: number;
  isLocked: boolean;
  isNew?: boolean;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  quizzesCompleted: number;
}

interface Recommendation {
  topic: string;
  subject: string;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
  accuracy: number;
  suggestedQuizzes: number;
  examRelevance: number;
}

const subjectIcons: Record<string, React.ReactNode> = {
  'Quantitative Aptitude': <Calculator className="h-5 w-5" />,
  'Reasoning': <Brain className="h-5 w-5" />,
  'English': <BookOpen className="h-5 w-5" />,
  'General Awareness': <Globe className="h-5 w-5" />,
  'Current Affairs': <FileText className="h-5 w-5" />,
};

const subjectColors: Record<string, string> = {
  'Quantitative Aptitude': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Reasoning': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'English': 'bg-green-500/10 text-green-500 border-green-500/20',
  'General Awareness': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  'Current Affairs': 'bg-red-500/10 text-red-500 border-red-500/20',
};

const DailyQuizzes = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    { id: '1', title: 'Number System Basics', subject: 'Quantitative Aptitude', questions: 15, duration: 10, difficulty: 'Easy', completed: true, score: 87, isLocked: false },
    { id: '2', title: 'Percentage & Profit Loss', subject: 'Quantitative Aptitude', questions: 15, duration: 12, difficulty: 'Medium', completed: false, isLocked: false, isNew: true },
    { id: '3', title: 'Coding-Decoding', subject: 'Reasoning', questions: 15, duration: 15, difficulty: 'Easy', completed: true, score: 92, isLocked: false },
    { id: '4', title: 'Syllogism Advanced', subject: 'Reasoning', questions: 15, duration: 12, difficulty: 'Hard', completed: false, isLocked: false },
    { id: '5', title: 'Reading Comprehension', subject: 'English', questions: 15, duration: 15, difficulty: 'Medium', completed: false, isLocked: false },
    { id: '6', title: 'Error Spotting', subject: 'English', questions: 15, duration: 10, difficulty: 'Easy', completed: true, score: 78, isLocked: false },
    { id: '7', title: 'Banking Awareness', subject: 'General Awareness', questions: 15, duration: 15, difficulty: 'Medium', completed: false, isLocked: false, isNew: true },
    { id: '8', title: 'Weekly Current Affairs', subject: 'Current Affairs', questions: 15, duration: 20, difficulty: 'Medium', completed: false, isLocked: false },
    { id: '9', title: 'Data Interpretation', subject: 'Quantitative Aptitude', questions: 15, duration: 18, difficulty: 'Hard', completed: false, isLocked: true },
    { id: '10', title: 'Blood Relations', subject: 'Reasoning', questions: 15, duration: 12, difficulty: 'Medium', completed: false, isLocked: true },
  ]);

  const [streakData, setStreakData] = useState({
    currentStreak: 6,
    longestStreak: 14,
    totalQuizzesCompleted: 89,
    lastCompletedDate: new Date().toISOString(),
    todayCompleted: true,
    weeklyProgress: [true, true, true, true, true, true, false]
  });

  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: 'Priya Sharma', avatar: 'PS', score: 2840, streak: 45, quizzesCompleted: 156 },
    { rank: 2, name: 'Rahul Kumar', avatar: 'RK', score: 2720, streak: 38, quizzesCompleted: 142 },
    { rank: 3, name: 'Anjali Singh', avatar: 'AS', score: 2650, streak: 32, quizzesCompleted: 138 },
    { rank: 4, name: 'Vikram Patel', avatar: 'VP', score: 2580, streak: 28, quizzesCompleted: 125 },
    { rank: 5, name: 'Sneha Reddy', avatar: 'SR', score: 2490, streak: 25, quizzesCompleted: 118 },
    { rank: 6, name: 'Amit Verma', avatar: 'AV', score: 2420, streak: 22, quizzesCompleted: 112 },
    { rank: 7, name: 'Neha Gupta', avatar: 'NG', score: 2350, streak: 19, quizzesCompleted: 105 },
    { rank: 8, name: 'You', avatar: 'YU', score: 2180, streak: streakData.currentStreak, quizzesCompleted: streakData.totalQuizzesCompleted },
  ];

  const recommendations: Recommendation[] = [
    { 
      topic: 'Data Interpretation', 
      subject: 'Quantitative Aptitude', 
      reason: 'Low accuracy in recent tests', 
      priority: 'High', 
      accuracy: 42,
      suggestedQuizzes: 5,
      examRelevance: 95
    },
    { 
      topic: 'Syllogism', 
      subject: 'Reasoning', 
      reason: 'Frequently asked in IBPS PO', 
      priority: 'High', 
      accuracy: 48,
      suggestedQuizzes: 4,
      examRelevance: 90
    },
    { 
      topic: 'Para Jumbles', 
      subject: 'English', 
      reason: 'Not practiced recently', 
      priority: 'Medium', 
      accuracy: 55,
      suggestedQuizzes: 3,
      examRelevance: 75
    },
    { 
      topic: 'Banking Terms', 
      subject: 'General Awareness', 
      reason: 'High weightage in upcoming exam', 
      priority: 'High', 
      accuracy: 60,
      suggestedQuizzes: 4,
      examRelevance: 88
    },
    { 
      topic: 'Time & Work', 
      subject: 'Quantitative Aptitude', 
      reason: 'Improving but needs more practice', 
      priority: 'Medium', 
      accuracy: 65,
      suggestedQuizzes: 3,
      examRelevance: 80
    },
  ];

  const subjects = ['all', 'Quantitative Aptitude', 'Reasoning', 'English', 'General Awareness', 'Current Affairs'];
  
  const filteredQuizzes = selectedSubject === 'all' 
    ? quizzes 
    : quizzes.filter(q => q.subject === selectedSubject);

  const completedToday = quizzes.filter(q => q.completed).length;
  const totalToday = quizzes.filter(q => !q.isLocked).length;

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-500/10 text-green-500';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-500';
      case 'Hard': return 'bg-red-500/10 text-red-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'Low': return 'bg-green-500/10 text-green-500 border-green-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Award className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-medium text-muted-foreground">#{rank}</span>;
  };

  const handleStartQuiz = (quiz: Quiz) => {
    if (quiz.isLocked) {
      toast.error('This quiz is locked!', {
        description: 'Complete more quizzes to unlock this one.'
      });
      return;
    }
    setActiveQuiz(quiz);
  };

  const handleQuizComplete = (result: QuizResult) => {
    // Update quiz completion status
    setQuizzes(prev => prev.map(q => 
      q.id === result.quizId 
        ? { ...q, completed: true, score: result.score }
        : q
    ));

    // Update streak data
    setStreakData(prev => ({
      ...prev,
      totalQuizzesCompleted: prev.totalQuizzesCompleted + 1,
      weeklyProgress: prev.weeklyProgress.map((v, i) => 
        i === new Date().getDay() - 1 || (i === 6 && new Date().getDay() === 0) ? true : v
      )
    }));

    // Show completion toast
    toast.success(`🎉 Quiz completed! Score: ${result.score}%`, {
      description: `${result.correctAnswers}/${result.totalQuestions} correct answers`
    });

    // Check for streak milestone
    if (streakData.currentStreak === 6) {
      setStreakData(prev => ({ ...prev, currentStreak: 7 }));
      toast.success('🔥 7 Day Streak Achieved!', {
        description: 'You unlocked "Week Warrior" badge!'
      });
    }
  };

  const handleClaimReward = (rewardId: string) => {
    console.log('Claiming reward:', rewardId);
    // Handle reward claiming logic
  };

  // Show quiz attempt interface if a quiz is active
  if (activeQuiz) {
    const questions = getQuestionsForQuiz(activeQuiz.subject, activeQuiz.questions);
    
    return (
      <div>
        <Button 
          variant="ghost" 
          className="m-4"
          onClick={() => setActiveQuiz(null)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Quizzes
        </Button>
        <QuizAttempt
          quizId={activeQuiz.id}
          quizTitle={activeQuiz.title}
          subject={activeQuiz.subject}
          duration={activeQuiz.duration}
          questions={questions}
          onComplete={handleQuizComplete}
          onExit={() => setActiveQuiz(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            Daily Free Quizzes
          </h1>
          <p className="text-muted-foreground mt-1">Practice daily to boost your exam preparation</p>
        </div>
        <div className="flex items-center gap-4">
          <Card className="px-4 py-2 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-semibold">{streakData.currentStreak} Day Streak</span>
            </div>
          </Card>
          <Card className="px-4 py-2 bg-green-500/5 border-green-500/20">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-semibold">{completedToday}/{totalToday} Today</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Today's Progress</h3>
              <Progress value={(completedToday / totalToday) * 100} className="h-3 mb-2" />
              <p className="text-sm text-muted-foreground">
                Complete {totalToday - completedToday} more quizzes to unlock bonus rewards!
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{completedToday}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-500">257</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">85%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Quiz Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subject Filter */}
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubject(subject)}
                className="capitalize"
              >
                {subject === 'all' ? 'All Subjects' : subject}
              </Button>
            ))}
          </div>

          {/* Quiz Cards */}
          <div className="grid gap-4">
            {filteredQuizzes.map((quiz) => (
              <Card 
                key={quiz.id} 
                className={`transition-all hover:shadow-md ${quiz.isLocked ? 'opacity-60' : ''} ${quiz.completed ? 'border-green-500/30 bg-green-500/5' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-3 rounded-xl ${subjectColors[quiz.subject] || 'bg-muted'}`}>
                        {subjectIcons[quiz.subject]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{quiz.title}</h4>
                          {quiz.isNew && (
                            <Badge className="bg-primary/10 text-primary text-xs">NEW</Badge>
                          )}
                          {quiz.completed && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span>{quiz.subject}</span>
                          <span>•</span>
                          <span>{quiz.questions} Questions</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {quiz.duration} mins
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty}
                      </Badge>
                      {quiz.completed ? (
                        <div className="text-right">
                          <p className="font-semibold text-green-500">{quiz.score}%</p>
                          <p className="text-xs text-muted-foreground">Score</p>
                        </div>
                      ) : quiz.isLocked ? (
                        <Button size="sm" variant="outline" disabled>
                          <Lock className="h-4 w-4 mr-1" />
                          Locked
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handleStartQuiz(quiz)}>
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar - Streak Rewards, Recommendations & Leaderboard */}
        <div className="space-y-6">
          {/* Streak Rewards Card */}
          <StreakRewards 
            streakData={streakData}
            onClaimReward={handleClaimReward}
          />

          {/* Smart Recommendations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Smart Recommendations
              </CardTitle>
              <p className="text-sm text-muted-foreground">Based on your performance & exam patterns</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendations.slice(0, 3).map((rec, index) => (
                <Card key={index} className="p-3 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-sm">{rec.topic}</h5>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(rec.priority)}`}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{rec.subject}</p>
                      <div className="flex items-center gap-1 text-xs">
                        <AlertTriangle className="h-3 w-3 text-yellow-500" />
                        <span className="text-muted-foreground">{rec.reason}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-background rounded p-1.5">
                      <p className="text-xs font-semibold text-red-500">{rec.accuracy}%</p>
                      <p className="text-[10px] text-muted-foreground">Accuracy</p>
                    </div>
                    <div className="bg-background rounded p-1.5">
                      <p className="text-xs font-semibold text-primary">{rec.suggestedQuizzes}</p>
                      <p className="text-[10px] text-muted-foreground">Quizzes</p>
                    </div>
                    <div className="bg-background rounded p-1.5">
                      <p className="text-xs font-semibold text-green-500">{rec.examRelevance}%</p>
                      <p className="text-[10px] text-muted-foreground">Exam Rel.</p>
                    </div>
                  </div>
                </Card>
              ))}
              <Button variant="outline" className="w-full" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Full Analysis
              </Button>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Daily Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="daily">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="daily" className="flex-1">Today</TabsTrigger>
                  <TabsTrigger value="weekly" className="flex-1">Week</TabsTrigger>
                  <TabsTrigger value="monthly" className="flex-1">Month</TabsTrigger>
                </TabsList>
                <TabsContent value="daily" className="mt-0">
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {leaderboard.map((entry) => (
                        <div 
                          key={entry.rank} 
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                            entry.name === 'You' 
                              ? 'bg-primary/10 border border-primary/30' 
                              : 'bg-muted/30 hover:bg-muted/50'
                          }`}
                        >
                          <div className="w-8 flex justify-center">
                            {getRankBadge(entry.rank)}
                          </div>
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-sm">
                            {entry.avatar}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium text-sm ${entry.name === 'You' ? 'text-primary' : ''}`}>
                              {entry.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Flame className="h-3 w-3 text-orange-500" />
                                {entry.streak} days
                              </span>
                              <span>•</span>
                              <span>{entry.quizzesCompleted} quizzes</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">{entry.score}</p>
                            <p className="text-xs text-muted-foreground">pts</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="weekly">
                  <div className="text-center py-8 text-muted-foreground">
                    Weekly leaderboard data
                  </div>
                </TabsContent>
                <TabsContent value="monthly">
                  <div className="text-center py-8 text-muted-foreground">
                    Monthly leaderboard data
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DailyQuizzes;
