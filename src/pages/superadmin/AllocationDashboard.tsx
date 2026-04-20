import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, UserCheck, AlertTriangle, Repeat } from 'lucide-react';
import { mentorPool, LANGUAGE_LABELS, STAGE_LABELS } from '@/data/mentorPoolData';
import { getAvailableMentors, getOverloadedMentors } from '@/lib/mentorMatching';

const AllocationDashboard: React.FC = () => {
  const available = getAvailableMentors();
  const overloaded = getOverloadedMentors();
  const totalCapacity = mentorPool.reduce((s, m) => s + m.capacity, 0);
  const totalAssigned = mentorPool.reduce((s, m) => s + m.studentsAssigned, 0);
  const utilization = Math.round((totalAssigned / totalCapacity) * 100);

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Allocation Dashboard</h1>
        <p className="text-sm text-muted-foreground">Live mentor capacity and student allocation overview.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat icon={<Users />} label="Total mentors" value={`${mentorPool.length}`} />
        <Stat icon={<UserCheck />} label="Available" value={`${available.length}`} />
        <Stat icon={<AlertTriangle />} label="At capacity" value={`${overloaded.length}`} />
        <Stat icon={<Repeat />} label="Utilization" value={`${utilization}%`} />
      </div>

      <Card><CardContent className="p-4">
        <h3 className="font-semibold mb-3">Capacity by mentor</h3>
        <div className="space-y-3">
          {mentorPool.map(m => {
            const pct = (m.studentsAssigned / m.capacity) * 100;
            return (
              <div key={m.id}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <img src={m.photo} className="w-6 h-6 rounded-full" />
                    <span className="font-medium">{m.name}</span>
                    <span className="text-xs text-muted-foreground">{m.languages.map(l => LANGUAGE_LABELS[l].split(' ')[0]).join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={pct >= 100 ? 'destructive' : pct >= 80 ? 'secondary' : 'outline'}>{m.studentsAssigned}/{m.capacity}</Badge>
                    <Button size="sm" variant="ghost" disabled={pct < 100}>Reassign</Button>
                  </div>
                </div>
                <Progress value={pct} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent></Card>
    </div>
  );
};

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <Card><CardContent className="p-3">
    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
      <span className="w-4 h-4 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>{label}
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </CardContent></Card>
);

export default AllocationDashboard;
