import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TestMode } from './TeamStudyTypes';

interface ScheduleTestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const ScheduleTestModal: React.FC<ScheduleTestModalProps> = ({ open, onClose, onSubmit }) => {
  const [mode, setMode] = useState<TestMode>('anytime');
  const [testName, setTestName] = useState('');
  const [testType, setTestType] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questions, setQuestions] = useState('50');
  const [duration, setDuration] = useState('60');
  const [windowHours, setWindowHours] = useState('5');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const modes: { value: TestMode; icon: React.ReactNode; label: string; desc: string }[] = [
    { value: 'anytime', icon: <Calendar className="h-4 w-4" />, label: '📅 Anytime', desc: 'Available indefinitely' },
    { value: 'limited', icon: <Clock className="h-4 w-4" />, label: '⏱️ Time-Limited', desc: 'Available for set duration' },
    { value: 'immediate', icon: <Zap className="h-4 w-4" />, label: '⚡ Immediate', desc: 'Take right when scheduled' },
  ];

  const handleSubmit = () => {
    onSubmit({ testName, testType, subject, difficulty, questions: parseInt(questions), duration: parseInt(duration), mode, windowHours: mode === 'limited' ? parseInt(windowHours) : undefined, date, time });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>🧪 Schedule Test</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Test Name</Label>
            <Input placeholder="e.g., Mock Test #17" value={testName} onChange={e => setTestName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <Select value={testType} onValueChange={setTestType}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {['Prelims', 'Mains', 'CSAT', 'Sectional', 'Speed'].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {['GS', 'History', 'Polity', 'Geography', 'Economy', 'Science', 'English', 'Quant', 'Reasoning'].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {['Easy', 'Medium', 'Hard', 'Mixed'].map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Questions</Label>
              <Input type="number" value={questions} onChange={e => setQuestions(e.target.value)} />
            </div>
            <div>
              <Label>Duration (min)</Label>
              <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Test Mode</Label>
            <div className="grid grid-cols-3 gap-2">
              {modes.map(m => (
                <button
                  key={m.value}
                  onClick={() => setMode(m.value)}
                  className={cn(
                    "p-2.5 rounded-lg border text-center transition-all text-xs",
                    mode === m.value ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50"
                  )}
                >
                  <p className="font-semibold">{m.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {mode === 'limited' && (
            <div>
              <Label>Availability Window</Label>
              <Select value={windowHours} onValueChange={setWindowHours}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['3', '5', '12', '24', '48'].map(h => (
                    <SelectItem key={h} value={h}>{h} hours</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <Label>Time</Label>
              <Input type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>

          <Button className="w-full" onClick={handleSubmit} disabled={!testName || !testType || !subject}>
            Schedule Test
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleTestModal;
