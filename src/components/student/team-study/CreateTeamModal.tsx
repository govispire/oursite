import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface CreateTeamModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ open, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const handleCreate = () => {
    onCreate({ name, description, category, isPublic });
    setName(''); setDescription(''); setCategory(''); setIsPublic(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Team Name</Label>
            <Input placeholder="e.g., UPSC Warriors" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea placeholder="What's your team about?" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Select exam category" /></SelectTrigger>
              <SelectContent>
                {['UPSC', 'SSC', 'Banking', 'Railway', 'State PSC'].map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Public Team</Label>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
          <Button className="w-full" onClick={handleCreate} disabled={!name || !category}>
            Create Team
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeamModal;
