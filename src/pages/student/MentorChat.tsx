import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send } from 'lucide-react';
import { useMentorship } from '@/contexts/MentorshipContext';
import { formatDistanceToNow } from 'date-fns';

const QUICK_REPLIES = [
  'I did not understand this',
  'My test score is low',
  'Please give a revision plan',
  'I need extra task',
];

const MentorChat: React.FC = () => {
  const navigate = useNavigate();
  const { mentor, messages, sendMessage } = useMentorship();
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (msg: string) => {
    if (!msg.trim()) return;
    sendMessage(msg, 'student');
    setText('');
    setTimeout(() => {
      sendMessage('Got it! I will review and send back guidance shortly.', 'mentor');
    }, 1100);
  };

  if (!mentor) return <div className="p-6 text-center text-muted-foreground">No mentor assigned yet.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto">
      <header className="flex items-center gap-3 p-3 border-b bg-card">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4" /></Button>
        <img src={mentor.photo} alt={mentor.name} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1">
          <div className="font-semibold leading-tight">{mentor.name}</div>
          <div className="text-xs text-muted-foreground">Replies in ~{mentor.responseMins} min</div>
        </div>
        <Badge variant="secondary">Online</Badge>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
        {messages.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-10">
            Say hi to {mentor.name.split(' ')[0]} 👋
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.from === 'student' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${m.from === 'student' ? 'bg-primary text-primary-foreground' : 'bg-card border'}`}>
              <div>{m.text}</div>
              <div className={`text-[10px] mt-1 opacity-70`}>{formatDistanceToNow(new Date(m.at), { addSuffix: true })}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="p-3 border-t bg-card space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {QUICK_REPLIES.map(q => (
            <Button key={q} variant="outline" size="sm" className="whitespace-nowrap text-xs" onClick={() => send(q)}>{q}</Button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="flex gap-2">
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." />
          <Button type="submit" size="icon"><Send className="w-4 h-4" /></Button>
        </form>
      </div>
    </div>
  );
};

export default MentorChat;
