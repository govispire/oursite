import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const REVIEWS = [
  { id: 'r1', student: 'Rahul Sharma', mentor: 'Rajesh Kumar', rating: 5, comment: 'Very helpful with quant tricks and consistent follow-up.', flagged: false },
  { id: 'r2', student: 'Priya Patel', mentor: 'Neha Verma', rating: 4, comment: 'Great explanations but sometimes slow to reply.', flagged: false },
  { id: 'r3', student: 'Amit Kumar', mentor: 'Suresh Gowda', rating: 2, comment: 'Tasks were not personalized.', flagged: true },
  { id: 'r4', student: 'Sneha Gupta', mentor: 'Priya Menon', rating: 5, comment: 'Mains writing improved drastically!', flagged: false },
];

const MentorReviews: React.FC = () => (
  <div className="p-4 sm:p-6 space-y-4">
    <div>
      <h1 className="text-2xl font-bold">Mentor Reviews</h1>
      <p className="text-sm text-muted-foreground">Student feedback on mentorship quality.</p>
    </div>
    <div className="space-y-3">
      {REVIEWS.map(r => (
        <Card key={r.id} className={r.flagged ? 'border-destructive/40' : ''}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{r.student}</span>
                  <span className="text-xs text-muted-foreground">→ {r.mentor}</span>
                  {r.flagged && <Badge variant="destructive" className="text-[10px]"><Flag className="w-3 h-3 mr-1" />Flagged</Badge>}
                </div>
                <div className="flex gap-0.5 mb-2">{[1,2,3,4,5].map(n => <Star key={n} className={`w-3 h-3 ${n <= r.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />)}</div>
                <p className="text-sm text-muted-foreground">{r.comment}</p>
              </div>
              {r.flagged && <Button size="sm" variant="outline">Resolve</Button>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default MentorReviews;
