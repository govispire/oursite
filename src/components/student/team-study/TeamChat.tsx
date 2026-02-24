import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from './TeamStudyTypes';

interface TeamChatProps {
  messages: ChatMessage[];
}

const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-3 py-1.5">
    <div className="flex gap-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce"
          style={{ animationDelay: `${i * 150}ms`, animationDuration: '1s' }}
        />
      ))}
    </div>
    <span className="text-[10px] text-muted-foreground ml-1">Priya is typing...</span>
  </div>
);

const TeamChat: React.FC<TeamChatProps> = ({ messages }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chatMessages, setChatMessages] = useState(messages);
  const [showTyping, setShowTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const unread = 3;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatMessages, open]);

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
    setShowTyping(true);
    setTimeout(() => setShowTyping(false), 2500);
  };

  const onlineMembers = ['PS', 'RV', 'AD'];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300",
          "bg-gradient-to-br from-primary to-accent text-primary-foreground",
          "hover:scale-110 hover:shadow-2xl active:scale-95"
        )}
      >
        {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
        {!open && unread > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-red-500 text-white border-2 border-background animate-pulse">
            {unread}
          </Badge>
        )}
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl shadow-2xl overflow-hidden border backdrop-blur-xl bg-background/95"
          >
            {/* Header */}
            <div className="p-3 border-b bg-gradient-to-r from-primary/10 to-accent/10">
              <p className="font-bold text-sm">Team Chat</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex -space-x-1.5">
                  {onlineMembers.map(m => (
                    <div key={m} className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/40 to-primary/70 flex items-center justify-center text-[8px] font-bold text-white border border-background">
                      {m}
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block mr-0.5" />
                  {onlineMembers.length} online
                </span>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="overflow-y-auto p-3 space-y-3" style={{ height: 300 }}>
              {chatMessages.map(msg => (
                <div key={msg.id} className={cn("flex gap-2", msg.sender === 'You' && "flex-row-reverse")}>
                  <div className="relative flex-shrink-0">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/40 to-primary/70 flex items-center justify-center text-[10px] font-bold text-white">
                      {msg.avatar}
                    </div>
                    {onlineMembers.includes(msg.avatar) && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background" />
                    )}
                  </div>
                  <div className={cn("max-w-[200px]", msg.sender === 'You' && "text-right")}>
                    <p className="text-[10px] text-muted-foreground">{msg.sender} • {msg.timestamp}</p>
                    <div className={cn(
                      "mt-0.5 px-3 py-1.5 rounded-2xl text-xs",
                      msg.sender === 'You'
                        ? "bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-tr-sm"
                        : "bg-muted rounded-tl-sm"
                    )}>
                      {msg.message}
                    </div>
                  </div>
                </div>
              ))}
              {showTyping && <TypingIndicator />}
            </div>

            {/* Input */}
            <div className="p-2.5 border-t bg-muted/20 flex gap-2">
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="text-xs h-9 rounded-xl border-muted"
              />
              <Button size="sm" className="h-9 w-9 p-0 rounded-xl bg-gradient-to-r from-primary to-accent" onClick={handleSend}>
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TeamChat;
