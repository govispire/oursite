import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { 
  Search,
  Star, 
  MessageSquare, 
  Video, 
  Calendar,
  Clock,
  ChevronRight,
  Users,
  TrendingUp,
  Award,
  Play,
  Filter,
  Heart,
  CheckCircle2,
  Target,
  Sparkles
} from 'lucide-react';
import { enhancedMentors } from '@/data/enhancedMentorshipData';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const MentorshipDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<typeof enhancedMentors[0] | null>(null);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const navigate = useNavigate();

  // Active mentors
  const activeMentors = enhancedMentors.filter(m => m.status === 'active');
  const hasActiveMentors = activeMentors.length > 0;

  // Student's journey stats
  const journeyStats = {
    sessionsCompleted: 15,
    hoursLearned: 42,
    currentStreak: 7,
    improvement: 23
  };

  // Featured mentors for discovery
  const featuredMentors = enhancedMentors.slice(0, 4);

  // Success stories data
  const successStories = [
    { id: 1, name: 'Rahul Sharma', exam: 'UPSC CSE 2023', rank: 45, mentor: 'Dr. Rajesh Kumar', avatar: '👨‍🎓' },
    { id: 2, name: 'Priya Patel', exam: 'SBI PO 2023', rank: 12, mentor: 'Priya Sharma', avatar: '👩‍🎓' },
    { id: 3, name: 'Amit Singh', exam: 'SSC CGL 2023', rank: 89, mentor: 'Amit Singh', avatar: '👨‍💼' },
  ];

  const handleMentorClick = (mentor: typeof enhancedMentors[0]) => {
    setSelectedMentor(mentor);
    setShowMentorModal(true);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Section - Personalized Welcome */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/90 to-primary p-6 text-primary-foreground">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">Your Learning Journey</h1>
          <p className="text-primary-foreground/80 text-sm mb-4">
            Connect with expert mentors who've walked your path
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[
              { label: 'Sessions', value: journeyStats.sessionsCompleted, icon: Video },
              { label: 'Hours', value: journeyStats.hoursLearned, icon: Clock },
              { label: 'Streak', value: `${journeyStats.currentStreak}d`, icon: TrendingUp },
              { label: 'Growth', value: `+${journeyStats.improvement}%`, icon: Target },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-[10px] text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute right-10 bottom-0 w-20 h-20 bg-white/5 rounded-full blur-xl" />
      </div>

      {/* Active Mentors - Priority Section */}
      {hasActiveMentors && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Your Active Mentors
            </h2>
            <Badge variant="outline" className="text-xs">
              {activeMentors.length} active
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMentors.map((mentor) => (
              <Card 
                key={mentor.id} 
                className="p-4 hover:shadow-md transition-all cursor-pointer border-l-4 border-l-primary"
                onClick={() => handleMentorClick(mentor)}
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                    👨‍🏫
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{mentor.name}</h3>
                        <p className="text-xs text-muted-foreground">{mentor.qualification}</p>
                      </div>
                      {mentor.unreadMessages > 0 && (
                        <Badge className="bg-red-500 text-white text-[10px]">
                          {mentor.unreadMessages} new
                        </Badge>
                      )}
                    </div>
                    
                    {/* Progress */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-primary">{mentor.progress.progressPercentage}%</span>
                      </div>
                      <Progress value={mentor.progress.progressPercentage} className="h-1.5" />
                    </div>
                    
                    {/* Next Session */}
                    {mentor.nextSession && (
                      <div className="mt-3 flex items-center gap-2 text-xs bg-muted/50 p-2 rounded-lg">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span>Next: {mentor.nextSession.topic}</span>
                        <span className="text-muted-foreground ml-auto">{mentor.nextSession.time}</span>
                      </div>
                    )}
                    
                    {/* Quick Actions */}
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1 text-xs h-8">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Chat
                      </Button>
                      <Button size="sm" className="flex-1 text-xs h-8">
                        <Video className="h-3 w-3 mr-1" />
                        Join Session
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Find a Mentor Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Find Your Mentor
          </h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => navigate('/student/mentorship/selection')}
          >
            Browse All <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by subject, exam, or mentor name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Quick Filters */}
        <div className="flex flex-wrap gap-2">
          {['UPSC', 'Banking', 'SSC', 'Railway', 'CAT/MBA'].map((cat) => (
            <Button key={cat} variant="outline" size="sm" className="text-xs h-7 rounded-full">
              {cat}
            </Button>
          ))}
        </div>

        {/* Featured Mentors Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {featuredMentors.map((mentor) => (
            <Card 
              key={mentor.id}
              className="p-3 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => handleMentorClick(mentor)}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-2xl mx-auto mb-2 group-hover:scale-105 transition-transform">
                  👨‍🏫
                </div>
                <h4 className="font-medium text-sm truncate">{mentor.name}</h4>
                <p className="text-[10px] text-muted-foreground truncate">{mentor.subjects[0]}</p>
                
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-medium">{mentor.rating}</span>
                  <span className="text-[10px] text-muted-foreground">({mentor.reviews})</span>
                </div>
                
                <div className="mt-2">
                  <span className="text-sm font-bold text-primary">₹{mentor.price}</span>
                  <span className="text-[10px] text-muted-foreground">/session</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Success Stories - Social Proof */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Success Stories
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {successStories.map((story) => (
            <Card key={story.id} className="p-4 bg-gradient-to-br from-yellow-50/50 to-transparent dark:from-yellow-900/10">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{story.avatar}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{story.name}</h4>
                  <p className="text-xs text-muted-foreground">{story.exam}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-primary/10 text-primary text-[10px]">
                      Rank {story.rank}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      Mentored by {story.mentor}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Mentorship - Value Props */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-center">Why Get a Mentor?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '🎯', title: 'Personalized Guidance', desc: 'Study plans tailored to you' },
            { icon: '📈', title: '3x Faster Progress', desc: 'Learn from their mistakes' },
            { icon: '💡', title: 'Expert Strategies', desc: 'Proven exam techniques' },
            { icon: '🤝', title: 'Accountability', desc: 'Stay on track always' },
          ].map((item, idx) => (
            <Card key={idx} className="p-4 text-center hover:shadow-md transition-all">
              <div className="text-3xl mb-2">{item.icon}</div>
              <h4 className="font-medium text-sm">{item.title}</h4>
              <p className="text-[10px] text-muted-foreground mt-1">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {!hasActiveMentors && (
        <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <div className="text-4xl mb-3">🚀</div>
          <h3 className="text-lg font-semibold mb-2">Start Your Mentorship Journey</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Join thousands of successful students who cracked their dream exams with expert guidance
          </p>
          <Button onClick={() => navigate('/student/mentorship/selection')}>
            Find Your Mentor
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Card>
      )}

      {/* Mentor Detail Modal */}
      <Dialog open={showMentorModal} onOpenChange={setShowMentorModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="sr-only">Mentor Details</DialogTitle>
          </DialogHeader>
          
          {selectedMentor && (
            <div className="space-y-4">
              {/* Mentor Header */}
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                  👨‍🏫
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{selectedMentor.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedMentor.qualification}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium ml-1">{selectedMentor.rating}</span>
                      <span className="text-xs text-muted-foreground ml-1">({selectedMentor.reviews} reviews)</span>
                    </div>
                    <Badge variant="outline">{selectedMentor.experience}</Badge>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground">{selectedMentor.bio}</p>

              {/* Subjects */}
              <div>
                <h4 className="text-sm font-medium mb-2">Subjects</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMentor.subjects.map((sub, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {sub}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Languages & Availability */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Languages</h4>
                  <p className="text-sm text-muted-foreground">{selectedMentor.languages.join(', ')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Availability</h4>
                  <p className="text-sm text-muted-foreground">{selectedMentor.availability.join(', ')}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <span className="text-2xl font-bold text-primary">₹{selectedMentor.price}</span>
                  <span className="text-sm text-muted-foreground">/session</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button>Book Session</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentorshipDashboard;
