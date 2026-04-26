import React from 'react';
import { Card } from '@/components/ui/card';
import { GraduationCap, Users, Trophy, FileText, MessageCircle } from 'lucide-react';

const ITEMS = [
  { icon: GraduationCap, value: '500+', label: 'Expert Instructors' },
  { icon: Users, value: '50K+', label: 'Active Students' },
  { icon: Trophy, value: '98%', label: 'Success Rate' },
  { icon: FileText, value: '10K+', label: 'Mock Tests' },
  { icon: MessageCircle, value: '24/7', label: 'Mentor Support' },
];

export const TrustValueStrip: React.FC = () => {
  return (
    <Card className="border border-border bg-card p-5 sm:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {ITEMS.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="text-base font-bold text-foreground leading-tight">{value}</div>
              <div className="text-[10px] text-muted-foreground leading-tight">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
