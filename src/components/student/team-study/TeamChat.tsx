import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage } from './TeamStudyTypes';

interface TeamChatProps {
  messages: ChatMessage[];
}

const TeamChat: React.FC<TeamChatProps> = ({ messages }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chatMessages, setChatMessages] = useState(messages);

  const handleSend = () => {
    if (!input.trim()) return;
    setChatMessages(prev => [...prev, {
      id: `c${Date.now()}`,
      sender: 'You',
      avatar: 'Y',
      message: input,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setInput('');
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
        {!open && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-red-500">
            {chatMessages.length}
          </Badge>
        )}
      </button>

      {/* Chat Panel */}
      <div className={cn(
        "fixed bottom-20 right-6 z-50 w-80 bg-background border rounded-xl shadow-2xl transition-all duration-300 overflow-hidden",
        open ? "opacity-100 translate-y-0 h-[420px]" : "opacity-0 translate-y-4 h-0 pointer-events-none"
      )}>
        <div className="p-3 border-b bg-primary/5">
          <p className="font-semibold text-sm">Team Chat</p>
          <p className="text-[10px] text-muted-foreground">Success Squad • 5 members online</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ height: 'calc(100% - 110px)' }}>
          {chatMessages.map(msg => (
            <div key={msg.id} className={cn("flex gap-2", msg.sender === 'You' && "flex-row-reverse")}>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center text-[10px] font-bold text-primary-foreground flex-shrink-0">
                {msg.avatar}
              </div>
              <div className={cn("max-w-[200px]", msg.sender === 'You' && "text-right")}>
                <p className="text-[10px] text-muted-foreground">{msg.sender} • {msg.timestamp}</p>
                <div className={cn(
                  "mt-0.5 px-3 py-1.5 rounded-xl text-xs",
                  msg.sender === 'You' ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted rounded-tl-none"
                )}>
                  {msg.message}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-2 border-t flex gap-2">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="text-xs h-8"
          />
          <Button size="sm" className="h-8 w-8 p-0" onClick={handleSend}>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default TeamChat;
