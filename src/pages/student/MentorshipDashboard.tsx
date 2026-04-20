import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Brain, Trophy, Star, Sparkles, ArrowRight } from 'lucide-react';
import { useMentorship } from '@/contexts/MentorshipContext';
import { LANGUAGE_LABELS, STAGE_LABELS } from '@/data/mentorPoolData';
import { useToast } from '@/hooks/use-toast';

const MentorshipDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile, mentor, tasks, toggleTask, diagnostics, review, saveReview } = useMentorship();
  const { toast } = useToast();
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!profile || !mentor) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Get Your Personal Mentor</h1>
        <p className="text-muted-foreground">Tell us your goal and we'll match you with the right mentor for daily guidance.</p>
        <Button size="lg" onClick={() => navigate('/student/mentorship-onboarding')}>
          Start Setup <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    );
  }

  const completed = tasks.filter(t => t.completed).length;
  const taskProgress = tasks.length ? (completed / tasks.length) * 100 : 0;
  const avgScore = diagnostics.length ? Math.round(diagnostics.reduce((s, d) => s + d.score, 0) / diagnostics.length) : null;

  const submitReview = () => {
    saveReview({ rating, explanation: rating, responseSpeed: rating, motivation: rating, comment, submittedAt: new Date().toISOString() });
    setReviewOpen(false);
    toast({ title: 'Review submitted', description: 'Thanks for your feedback!' });
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-5">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/70 h-3" />
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img src={mentor.photo} alt={mentor.name} className="w-16 h-16 rounded-full object-cover" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bold text-lg">{mentor.name}</h2>
                <Badge variant="secondary">{mentor.rating}★</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{mentor.bio}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {mentor.expertise.map(e => <Badge key={e} variant="outline" className="text-xs">{STAGE_LABELS[e]}</Badge>)}
                <Badge variant="outline" className="text-xs">{LANGUAGE_LABELS[profile.language]}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => navigate('/student/mentor-chat')}><MessageSquare className="w-4 h-4 mr-1" />Chat</Button>
              <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline"><Star className="w-4 h-4 mr-1" />Review</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Rate your mentor</DialogTitle></DialogHeader>
                  <div className="flex gap-1 justify-center py-2">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setRating(n)}>
                        <Star className={`w-7 h-7 ${n <= rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                      </button>
                    ))}
                  </div>
                  <Textarea placeholder="Share your experience..." value={comment} onChange={(e) => setComment(e.target.value)} />
                  <DialogFooter><Button onClick={submitReview}>Submit</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" />Today's Tasks</h3>
              <Badge variant="secondary">{completed}/{tasks.length}</Badge>
            </div>
            <Progress value={taskProgress} className="h-2 mb-3" />
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {tasks.map((t) => (
                <div key={t.id} className={`flex items-start gap-3 p-3 rounded-lg border ${t.completed ? 'bg-muted/40 opacity-60' : 'bg-card'}`}>
                  <Checkbox checked={t.completed} onCheckedChange={() => toggleTask(t.id)} className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${t.completed ? 'line-through' : ''}`}>{t.title}</div>
                    <div className="flex gap-2 mt-1 text-xs text-muted-foreground items-center">
                      <span>{t.subject}</span>·<span>{t.estimatedMins}min</span>·
                      <Badge variant={t.source === 'mentor' ? 'default' : 'outline'} className="text-[10px] py-0">
                        {t.source === 'mentor' ? 'Mentor' : 'System'}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${t.priority === 'high' ? 'border-destructive/50 text-destructive' : ''}`}>{t.priority}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2"><Brain className="w-4 h-4 text-primary" /><h3 className="font-semibold">Diagnostic Profile</h3></div>
              {avgScore === null ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Take 5 quick tests so your mentor can plan your week.</p>
                  <Button size="sm" onClick={() => navigate('/student/diagnostic-tests')}>Start Diagnostic</Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">{avgScore}%</div>
                  <p className="text-xs text-muted-foreground">Average across {diagnostics.length} tests</p>
                  <Button size="sm" variant="outline" className="w-full" onClick={() => navigate('/student/diagnostic-results')}>View Details</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2"><Trophy className="w-4 h-4 text-primary" /><h3 className="font-semibold">Leaderboard</h3></div>
              <div className="text-3xl font-bold text-primary">#7</div>
              <p className="text-xs text-muted-foreground">in your mentor's batch this week</p>
              <Progress value={70} className="h-2 mt-3" />
            </CardContent>
          </Card>

          {review && (
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">Your review</div>
                <div className="flex gap-1">{[1,2,3,4,5].map(n => <Star key={n} className={`w-3 h-3 ${n <= review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />)}</div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorshipDashboard;
