import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Target, ArrowRight, Sparkles } from 'lucide-react';

export const FreeTestCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-primary via-primary to-secondary text-primary-foreground">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-primary-foreground rounded-full translate-y-1/2" />
      </div>

      <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
          <Target className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
              Personalized Recommendation
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold leading-tight">
            Not sure where to start?
          </h3>
          <p className="text-sm opacity-90 mt-1">
            Take a 10-min free diagnostic test and we'll recommend the perfect course for you.
          </p>
        </div>

        <Button
          size="lg"
          variant="secondary"
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold shadow-lg w-full sm:w-auto"
          onClick={() => navigate('/student/diagnostic-tests')}
        >
          Take Free Test
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </Card>
  );
};
