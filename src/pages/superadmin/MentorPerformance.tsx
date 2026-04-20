import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Clock, TrendingUp } from 'lucide-react';
import { mentorPool } from '@/data/mentorPoolData';

const MentorPerformance: React.FC = () => {
  const ranked = [...mentorPool].sort((a, b) => b.rating - a.rating);
  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Mentor Performance</h1>
        <p className="text-sm text-muted-foreground">Track mentor quality, response time, and student outcomes.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {ranked.map((m, i) => (
          <Card key={m.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">{i + 1}</div>
                <img src={m.photo} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.studentsAssigned}/{m.capacity} students</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <Metric icon={<Star className="w-3 h-3" />} label="Rating" value={`${m.rating}`} />
                <Metric icon={<Clock className="w-3 h-3" />} label="Response" value={`${m.responseMins}m`} />
                <Metric icon={<TrendingUp className="w-3 h-3" />} label="Engagement" value={`${Math.min(100, 60 + i * 3)}%`} />
              </div>
              <Progress value={m.rating * 20} className="h-2 mt-3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Metric: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-muted/40 rounded-lg p-2 text-center">
    <div className="flex items-center justify-center gap-1 text-muted-foreground">{icon}{label}</div>
    <div className="font-bold">{value}</div>
  </div>
);

export default MentorPerformance;
