import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Flame, Trophy, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Team } from './TeamStudyTypes';

interface JoinTeamSectionProps {
  publicTeams: Team[];
}

const categoryColors: Record<string, string> = {
  UPSC: 'from-indigo-500 to-violet-500',
  SSC: 'from-amber-500 to-orange-500',
  Banking: 'from-emerald-500 to-teal-500',
  Railway: 'from-rose-500 to-pink-500',
};

const JoinTeamSection: React.FC<JoinTeamSectionProps> = ({ publicTeams }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [filter, setFilter] = useState('All');
  const { toast } = useToast();
  const categories = ['All', 'UPSC', 'SSC', 'Banking', 'Railway'];
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const filtered = filter === 'All' ? publicTeams : publicTeams.filter(t => t.category === filter);

  const handleCodeChange = (idx: number, val: string) => {
    const char = val.toUpperCase().slice(-1);
    const newCode = [...code];
    newCode[idx] = char;
    setCode(newCode);
    if (char && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleJoinByCode = () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      toast({ title: 'Invalid Code', description: 'Enter all 6 characters.', variant: 'destructive' });
      return;
    }
    toast({ title: '🎉 Joined Team!', description: `Successfully joined with code ${fullCode}` });
    setCode(['', '', '', '', '', '']);
  };

  return (
    <div className="space-y-4">
      {/* OTP-style code input */}
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary/60 to-accent/60" />
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Join a Team
          </CardTitle>
          <p className="text-xs text-muted-foreground">Enter the 6-character team code to join</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 justify-center">
            <div className="flex gap-2">
              {code.map((char, idx) => (
                <input
                  key={idx}
                  ref={el => { inputRefs.current[idx] = el; }}
                  type="text"
                  maxLength={1}
                  value={char}
                  onChange={e => handleCodeChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  className={cn(
                    "w-11 h-12 text-center text-lg font-bold uppercase rounded-xl border-2 bg-muted/30 outline-none transition-all duration-200",
                    "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background",
                    char ? "border-primary/50 bg-primary/5" : "border-border"
                  )}
                />
              ))}
            </div>
            <Button
              onClick={handleJoinByCode}
              disabled={code.join('').length !== 6}
              className="h-12 px-6 ml-2 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md"
            >
              Join
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Public Teams */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" /> Discover Public Teams
          </CardTitle>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {categories.map(cat => (
              <Button
                key={cat}
                size="sm"
                variant={filter === cat ? 'default' : 'outline'}
                className={cn(
                  "text-xs h-7 transition-all",
                  filter === cat && "shadow-sm"
                )}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {filtered.map((team, idx) => {
                const gradient = categoryColors[team.category] || 'from-primary to-accent';
                const isHot = team.members.length >= 6;
                return (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl border hover:shadow-md hover:border-primary/30 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-sm font-bold text-white shadow-md group-hover:scale-105 transition-transform", gradient)}>
                        {team.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold">{team.name}</p>
                          <Badge variant="outline" className="text-[10px]">{team.category}</Badge>
                          {isHot && (
                            <Badge className="text-[9px] bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-1.5">
                              🔥 Hot
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{team.description}</p>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-0.5"><Users className="h-3 w-3" /> {team.members.length}</span>
                          <span className="flex items-center gap-0.5"><Trophy className="h-3 w-3" /> #{team.rank}</span>
                          <span>{team.avgScore}% avg</span>
                          <span className="flex items-center gap-0.5"><Flame className="h-3 w-3 text-orange-500" /> {team.streak}d</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className={cn("text-xs h-8 bg-gradient-to-r text-white border-0 shadow-sm opacity-80 group-hover:opacity-100 transition-opacity", gradient)}>
                      Join
                    </Button>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinTeamSection;
