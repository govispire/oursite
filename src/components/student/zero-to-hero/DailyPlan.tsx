import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  FileQuestion, 
  FileText, 
  Lock, 
  Check, 
  Play,
  ChevronRight,
  Trophy,
  Zap,
  Calendar,
  Target
} from 'lucide-react';
import { useZeroToHero } from '@/hooks/useZeroToHero';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const DailyPlan = () => {
  const { journeyState, completeTask } = useZeroToHero();
  const [expandedDay, setExpandedDay] = useState<number>(journeyState.currentDay);
  
  const totalDays = journeyState.goalDuration || 15;
  const completedDaysCount = journeyState.completedDays.length;
  const overallProgress = (completedDaysCount / totalDays) * 100;

  // Get current weak area being worked on
  const currentWeakArea = journeyState.weakAreas[0];

  const handleCompleteTask = (day: number, taskId: string) => {
    completeTask(day, taskId);
    
    const dayTasks = journeyState.dailyTasks[day] || [];
    const completedCount = dayTasks.filter(t => t.completed).length + 1;
    const xpEarned = taskId.includes('video') ? 20 : taskId.includes('quiz') ? 30 : 25;
    
    toast({
      title: `+${xpEarned} XP Earned! 🎉`,
      description: `Task ${completedCount}/${dayTasks.length} completed for Day ${day}`,
    });
  };

  const isDayLocked = (day: number) => {
    if (day === 1) return false;
    const prevDayTasks = journeyState.dailyTasks[day - 1] || [];
    return !prevDayTasks.every(task => task.completed);
  };

  const isDayCompleted = (day: number) => {
    return journeyState.completedDays.includes(day);
  };

  const getDayProgress = (day: number) => {
    const tasks = journeyState.dailyTasks[day] || [];
    if (tasks.length === 0) return 0;
    return (tasks.filter(t => t.completed).length / tasks.length) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{completedDaysCount}/{totalDays}</p>
              <p className="text-xs text-gray-500">Days Done</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-100 to-orange-50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-200 flex items-center justify-center">
              <Zap className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{journeyState.streak}</p>
              <p className="text-xs text-gray-500">Day Streak</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-100 to-purple-50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-200 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{(completedDaysCount * 75)}</p>
              <p className="text-xs text-gray-500">Total XP</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-100 to-blue-50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-200 flex items-center justify-center">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{Math.round(overallProgress)}%</p>
              <p className="text-xs text-gray-500">Progress</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Topic Banner */}
      {currentWeakArea && (
        <Card className="border-0 bg-gradient-to-r from-primary to-primary/80 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Currently Mastering</p>
              <h3 className="text-xl font-bold">{currentWeakArea.subject}</h3>
              <p className="text-sm opacity-80">{currentWeakArea.topics.join(', ')}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{Math.round(overallProgress)}%</p>
              <p className="text-xs opacity-80">to Mastery</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Day Cards */}
      <div className="space-y-3">
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
          const isLocked = isDayLocked(day);
          const isCompleted = isDayCompleted(day);
          const isExpanded = expandedDay === day;
          const dayTasks = journeyState.dailyTasks[day] || [];
          const dayProgress = getDayProgress(day);

          return (
            <Card 
              key={day}
              className={`overflow-hidden transition-all ${
                isCompleted 
                  ? 'border-primary/50 bg-primary/5' 
                  : isLocked 
                  ? 'border-gray-200 opacity-60' 
                  : 'border-gray-200 hover:border-primary/30'
              }`}
            >
              {/* Day Header */}
              <div 
                className={`p-4 flex items-center justify-between cursor-pointer ${
                  !isLocked ? 'hover:bg-gray-50' : ''
                }`}
                onClick={() => !isLocked && setExpandedDay(isExpanded ? 0 : day)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                    isCompleted 
                      ? 'bg-primary text-white' 
                      : isLocked 
                      ? 'bg-gray-200 text-gray-400' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {isCompleted ? <Check className="h-6 w-6" /> : isLocked ? <Lock className="h-5 w-5" /> : day}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900">Day {day}</h4>
                    <p className="text-sm text-gray-500">
                      {isCompleted 
                        ? 'Completed! +75 XP' 
                        : isLocked 
                        ? 'Complete previous day to unlock' 
                        : `${dayTasks.filter(t => t.completed).length}/${dayTasks.length} tasks done`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {!isLocked && !isCompleted && (
                    <div className="w-24">
                      <Progress value={dayProgress} className="h-2" />
                    </div>
                  )}
                  {isCompleted && (
                    <Badge className="bg-primary/20 text-primary">Mastered</Badge>
                  )}
                  {!isLocked && (
                    <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  )}
                </div>
              </div>

              {/* Expanded Tasks */}
              <AnimatePresence>
                {isExpanded && !isLocked && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t"
                  >
                    <div className="p-4 space-y-3 bg-gray-50">
                      {dayTasks.map((task, index) => {
                        const isTaskLocked = index > 0 && !dayTasks[index - 1].completed;
                        const taskIcon = task.type === 'video' ? Video : task.type === 'quiz' ? FileQuestion : FileText;
                        const TaskIcon = taskIcon;
                        
                        return (
                          <div 
                            key={task.id}
                            className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                              task.completed 
                                ? 'bg-primary/10 border border-primary/20' 
                                : isTaskLocked 
                                ? 'bg-gray-100 opacity-50' 
                                : 'bg-white border border-gray-200 hover:border-primary/30'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              task.completed 
                                ? 'bg-primary text-white' 
                                : isTaskLocked 
                                ? 'bg-gray-200 text-gray-400' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {task.completed ? <Check className="h-5 w-5" /> : isTaskLocked ? <Lock className="h-4 w-4" /> : <TaskIcon className="h-5 w-5" />}
                            </div>
                            
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                              <p className="text-xs text-gray-500">{task.duration} mins • +{task.type === 'video' ? 20 : task.type === 'quiz' ? 30 : 25} XP</p>
                            </div>
                            
                            {task.completed ? (
                              <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">Done</Badge>
                            ) : isTaskLocked ? (
                              <Badge variant="secondary" className="text-xs">Locked</Badge>
                            ) : (
                              <Button 
                                size="sm" 
                                className="bg-primary hover:bg-primary/90 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCompleteTask(day, task.id);
                                }}
                              >
                                <Play className="h-3 w-3 mr-1" />
                                Start
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DailyPlan;
