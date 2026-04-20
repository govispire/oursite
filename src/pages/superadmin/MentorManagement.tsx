import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Check, X } from 'lucide-react';
import { mentorPool, LANGUAGE_LABELS, STAGE_LABELS, MentorPoolEntry } from '@/data/mentorPoolData';
import { useToast } from '@/hooks/use-toast';

const MentorManagement: React.FC = () => {
  const { toast } = useToast();
  const [pool, setPool] = useState<MentorPoolEntry[]>(mentorPool);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');

  const filtered = pool.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  const approve = (id: string) => {
    toast({ title: 'Mentor approved', description: 'Mentor is now active.' });
  };

  const create = () => {
    if (!name.trim()) return;
    toast({ title: 'Mentor created', description: `${name} added (pending approval).` });
    setName(''); setOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">Mentor Management</h1>
          <p className="text-sm text-muted-foreground">Create, approve, and manage mentor pool.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-1" />New Mentor</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Mentor</DialogTitle></DialogHeader>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <DialogFooter><Button onClick={create}>Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Input placeholder="Search mentors..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(m => (
          <Card key={m.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <img src={m.photo} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.rating}★ · {m.yearsExperience}y exp</div>
                </div>
                <Badge variant="secondary">{m.studentsAssigned}/{m.capacity}</Badge>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {m.expertise.map(e => <Badge key={e} variant="outline" className="text-[10px]">{STAGE_LABELS[e]}</Badge>)}
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {m.languages.map(l => <Badge key={l} variant="outline" className="text-[10px]">{LANGUAGE_LABELS[l]}</Badge>)}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => approve(m.id)}><Check className="w-3 h-3 mr-1" />Approve</Button>
                <Button size="sm" variant="ghost"><X className="w-3 h-3" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MentorManagement;
