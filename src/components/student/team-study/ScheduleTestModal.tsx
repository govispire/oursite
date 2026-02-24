import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, Zap, FileCheck } from 'lucide-react';
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

  const modes: { value: TestMode; icon: React.ReactNode; emoji: string; label: string; desc: string; gradient: string }[] = [
    { value: 'anytime', icon: <Calendar className="h-5 w-5" />, emoji: '📅', label: 'Anytime', desc: 'Available indefinitely', gradient: 'from-sky-500 to-blue-500' },
    { value: 'limited', icon: <Clock className="h-5 w-5" />, emoji: '⏱️', label: 'Time-Limited', desc: 'Set availability window', gradient: 'from-amber-500 to-orange-500' },
    { value: 'immediate', icon: <Zap className="h-5 w-5" />, emoji: '⚡', label: 'Immediate', desc: 'Take when scheduled', gradient: 'from-rose-500 to-red-500' },
  ];

  const handleSubmit = () => {
    onSubmit({ testName, testType, subject, difficulty, questions: parseInt(questions), duration: parseInt(duration), mode, windowHours: mode === 'limited' ? parseInt(windowHours) : undefined, date, time });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" /> Schedule Test
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-medium">Test Name</Label>
            <Input placeholder="e.g., Mock Test #17" value={testName} onChange={e => setTestName(e.target.value)} className="mt-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium">Type</Label>
              <Select value={testType} onValueChange={setTestType}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {['Prelims', 'Mains', 'CSAT', 'Sectional', 'Speed'].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
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
              <Label className="text-xs font-medium">Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {['Easy', 'Medium', 'Hard', 'Mixed'].map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium">Questions</Label>
              <Input type="number" value={questions} onChange={e => setQuestions(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium">Duration (min)</Label>
              <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="mt-1" />
            </div>
          </div>

          {/* Test Mode as illustrated cards */}
          <div>
            <Label className="text-xs font-medium mb-2 block">Test Mode</Label>
            <div className="grid grid-cols-3 gap-2">
              {modes.map(m => (
                <button
                  key={m.value}
                  onClick={() => setMode(m.value)}
                  className={cn(
                    "p-3 rounded-xl border-2 text-center transition-all duration-200",
                    mode === m.value
                      ? "border-primary bg-primary/5 shadow-sm scale-[1.02]"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white mx-auto mb-1.5",
                    m.gradient
                  )}>
                    {m.icon}
                  </div>
                  <p className="text-xs font-bold">{m.emoji} {m.label}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {mode === 'limited' && (
            <div>
              <Label className="text-xs font-medium">Availability Window</Label>
              <Select value={windowHours} onValueChange={setWindowHours}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
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
              <Label className="text-xs font-medium">Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium">Time</Label>
              <Input type="time" value={time} onChange={e => setTime(e.target.value)} className="mt-1" />
            </div>
          </div>

          {/* Preview card */}
          {testName && (
            <Card className="p-3 bg-muted/30 border-dashed">
              <p className="text-[10px] text-muted-foreground mb-1">PREVIEW</p>
              <p className="text-sm font-bold">{testName}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {testType && <Badge variant="outline" className="text-[10px]">{testType}</Badge>}
                {subject && <Badge variant="secondary" className="text-[10px]">{subject}</Badge>}
                {difficulty && <Badge variant="secondary" className="text-[10px]">{difficulty}</Badge>}
                <Badge variant="outline" className="text-[10px]">
                  {modes.find(m => m.value === mode)?.emoji} {modes.find(m => m.value === mode)?.label}
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{questions} questions • {duration} min</p>
            </Card>
          )}

          <Button className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground" onClick={handleSubmit} disabled={!testName || !testType || !subject}>
            🚀 Schedule Test
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleTestModal;
