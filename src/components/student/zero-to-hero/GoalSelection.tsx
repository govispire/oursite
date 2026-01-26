import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Zap, 
  Target, 
  Trophy,
  ArrowLeft,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useZeroToHero, GoalDuration } from '@/hooks/useZeroToHero';
import { motion } from 'framer-motion';

const GoalSelection = () => {
  const { selectGoal, resetJourney } = useZeroToHero();

  const goals: { duration: GoalDuration; title: string; subtitle: string; features: string[]; icon: React.ElementType; recommended?: boolean }[] = [
    {
      duration: 5,
      title: '5-Day Sprint',
      subtitle: 'Quick & Focused',
      features: [
        '1 topic at a time',
        'Intensive daily sessions',
        'Perfect for last-minute prep'
      ],
      icon: Zap
    },
    {
      duration: 10,
      title: '10-Day Challenge',
      subtitle: 'Balanced Approach',
      features: [
        '2-3 topics coverage',
        'Steady progression',
        'Best for most students'
      ],
      icon: Target,
      recommended: true
    },
    {
      duration: 15,
      title: '15-Day Mastery',
      subtitle: 'Deep Learning',
      features: [
        'Multiple weak areas',
        'Thorough revision cycles',
        'Complete topic mastery'
      ],
      icon: Trophy
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={resetJourney}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Choose Your Commitment</h2>
          <p className="text-gray-600">Lock in your study period — no backing out!</p>
        </div>
      </div>

      {/* Goal Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {goals.map((goal, index) => {
          const GoalIcon = goal.icon;
          return (
            <motion.div
              key={goal.duration}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card 
                className={`relative cursor-pointer transition-all hover:shadow-lg border-2 ${
                  goal.recommended 
                    ? 'border-primary shadow-md' 
                    : 'border-gray-200 hover:border-primary/50'
                }`}
                onClick={() => selectGoal(goal.duration)}
              >
                {goal.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                    Recommended
                  </div>
                )}
                
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                    goal.recommended ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                  }`}>
                    <GoalIcon className="h-8 w-8" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{goal.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{goal.subtitle}</p>
                  
                  <div className="flex items-center justify-center gap-1 text-primary font-semibold mb-4">
                    <Clock className="h-4 w-4" />
                    <span>{goal.duration} Days</span>
                  </div>
                  
                  <div className="space-y-2 text-left">
                    {goal.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full mt-5 ${
                      goal.recommended 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    onClick={() => selectGoal(goal.duration)}
                  >
                    Select {goal.duration} Days
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Info Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3"
      >
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
          <Clock className="h-4 w-4 text-amber-600" />
        </div>
        <div>
          <p className="font-medium text-amber-800">Commitment Matters</p>
          <p className="text-sm text-amber-700">
            Once you lock a period, daily tasks will be generated. Complete them to unlock the next section!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default GoalSelection;
