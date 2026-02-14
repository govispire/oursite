import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Search, Flame, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Team } from './TeamStudyTypes';

interface JoinTeamSectionProps {
  publicTeams: Team[];
}

const JoinTeamSection: React.FC<JoinTeamSectionProps> = ({ publicTeams }) => {
  const [teamCode, setTeamCode] = useState('');
  const [filter, setFilter] = useState('All');
  const { toast } = useToast();
  const categories = ['All', 'UPSC', 'SSC', 'Banking', 'Railway'];

  const filtered = filter === 'All' ? publicTeams : publicTeams.filter(t => t.category === filter);

  const handleJoinByCode = () => {
    if (teamCode.length !== 6) {
      toast({ title: 'Invalid Code', description: 'Team code must be 6 characters.', variant: 'destructive' });
      return;
    }
    toast({ title: '🎉 Joined Team!', description: `Successfully joined with code ${teamCode.toUpperCase()}` });
    setTeamCode('');
  };

  return (
    <div className="space-y-4">
      {/* Join by Code */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Join a Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter 6-digit team code"
              value={teamCode}
              onChange={e => setTeamCode(e.target.value.toUpperCase().slice(0, 6))}
              className="font-mono tracking-widest uppercase"
              maxLength={6}
            />
            <Button onClick={handleJoinByCode} disabled={teamCode.length !== 6}>Join</Button>
          </div>
        </CardContent>
      </Card>

      {/* Public Teams */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" /> Discover Public Teams
          </CardTitle>
          <div className="flex gap-1 mt-2 flex-wrap">
            {categories.map(cat => (
              <Button
                key={cat}
                size="sm"
                variant={filter === cat ? 'default' : 'ghost'}
                className="text-xs h-7"
                onClick={() => setFilter(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {filtered.map(team => (
            <div key={team.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {team.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{team.name}</p>
                    <Badge variant="secondary" className="text-[10px]">{team.category}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{team.description}</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                    <span><Users className="inline h-3 w-3" /> {team.members.length}</span>
                    <span><Trophy className="inline h-3 w-3" /> #{team.rank}</span>
                    <span>{team.avgScore}% avg</span>
                    <span><Flame className="inline h-3 w-3 text-orange-500" /> {team.streak}d</span>
                  </div>
                </div>
              </div>
              <Button size="sm" className="text-xs h-8">Join</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinTeamSection;
