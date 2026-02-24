import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Users, Globe, Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateTeamModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
}

const categories = [
  { value: 'UPSC', emoji: '🏛️', gradient: 'from-indigo-500 to-violet-500' },
  { value: 'SSC', emoji: '📝', gradient: 'from-amber-500 to-orange-500' },
  { value: 'Banking', emoji: '🏦', gradient: 'from-emerald-500 to-teal-500' },
  { value: 'Railway', emoji: '🚂', gradient: 'from-rose-500 to-pink-500' },
  { value: 'State PSC', emoji: '🗺️', gradient: 'from-sky-500 to-blue-500' },
];

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ open, onClose, onCreate }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const catData = categories.find(c => c.value === category);

  const handleCreate = () => {
    onCreate({ name, description, category, isPublic });
    setName(''); setDescription(''); setCategory(''); setIsPublic(false); setStep(1);
    onClose();
  };

  const canProceed = step === 1 ? name && category : true;

  return (
    <Dialog open={open} onOpenChange={() => { onClose(); setStep(1); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Create New Team
          </DialogTitle>
          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-2">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-1.5">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  step >= s ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground"
                )}>
                  {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                </div>
                <span className="text-[11px] text-muted-foreground">{s === 1 ? 'Details' : 'Preview'}</span>
                {s < 2 && <div className={cn("w-8 h-0.5 rounded-full", step > 1 ? "bg-primary" : "bg-muted")} />}
              </div>
            ))}
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <Label className="text-xs font-medium">Team Name</Label>
                <Input placeholder="e.g., UPSC Warriors" value={name} onChange={e => setName(e.target.value)} className="mt-1" />
              </div>

              <div>
                <Label className="text-xs font-medium mb-2 block">Exam Category</Label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={cn(
                        "p-3 rounded-xl border-2 text-center transition-all duration-200",
                        category === cat.value
                          ? "border-primary bg-primary/5 shadow-sm scale-[1.02]"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <span className="text-xl">{cat.emoji}</span>
                      <p className="text-xs font-semibold mt-1">{cat.value}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium">Description</Label>
                <Textarea placeholder="What's your team about?" value={description} onChange={e => setDescription(e.target.value)} rows={2} className="mt-1" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <div className="flex items-center gap-2">
                  {isPublic ? <Globe className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                  <div>
                    <p className="text-sm font-medium">{isPublic ? 'Public' : 'Private'} Team</p>
                    <p className="text-[10px] text-muted-foreground">{isPublic ? 'Anyone can discover and join' : 'Join via invite code only'}</p>
                  </div>
                </div>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              </div>

              <Button className="w-full" onClick={() => setStep(2)} disabled={!canProceed}>
                Continue to Preview
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <p className="text-xs text-muted-foreground">Here's how your team will look:</p>
              {/* Preview card */}
              <Card className="overflow-hidden border shadow-md">
                <div className={cn("h-1.5 bg-gradient-to-r", catData?.gradient || 'from-primary to-accent')} />
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-base font-bold text-white shadow-md", catData?.gradient || 'from-primary to-accent')}>
                      {name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '??'}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{name || 'Team Name'}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge variant="outline" className="text-[10px]">{category || 'Category'}</Badge>
                        <Badge variant="secondary" className="text-[10px]">
                          {isPublic ? '🌐 Public' : '🔒 Private'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {description && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
                    <span>👑 Admin: You</span>
                    <span>👥 1 member</span>
                    <span>🔥 0d streak</span>
                  </div>
                </div>
              </Card>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground" onClick={handleCreate}>
                  🚀 Create Team
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeamModal;
