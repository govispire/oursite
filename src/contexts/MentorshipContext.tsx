import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { MentorPoolEntry, MentorLanguage, MentorStage } from '@/data/mentorPoolData';

export interface OnboardingProfile {
  examCategory: string;
  examCategoryName: string;
  targetExam: string;
  stage: MentorStage;
  subjects: string[];
  language: MentorLanguage;
  learningStyle: 'strict' | 'balanced' | 'flexible';
}

export interface DiagnosticResult {
  testId: string;
  subject: string;
  score: number;
  accuracy: number;
  speed: number;
  completedAt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  subject: string;
  estimatedMins: number;
  priority: 'high' | 'medium' | 'low';
  source: 'system' | 'mentor';
  completed: boolean;
  date: string;
}

export interface ChatMessage {
  id: string;
  from: 'student' | 'mentor';
  text: string;
  at: string;
  read: boolean;
}

export interface MentorReview {
  rating: number;
  explanation: number;
  responseSpeed: number;
  motivation: number;
  comment: string;
  submittedAt: string;
}

interface MentorshipState {
  profile: OnboardingProfile | null;
  mentor: MentorPoolEntry | null;
  diagnostics: DiagnosticResult[];
  tasks: TaskItem[];
  messages: ChatMessage[];
  review: MentorReview | null;
}

interface MentorshipContextValue extends MentorshipState {
  setProfile: (p: OnboardingProfile) => void;
  setMentor: (m: MentorPoolEntry) => void;
  addDiagnostic: (d: DiagnosticResult) => void;
  setTasks: (t: TaskItem[]) => void;
  toggleTask: (id: string) => void;
  addMentorTask: (task: Omit<TaskItem, 'id' | 'completed' | 'source' | 'date'>) => void;
  sendMessage: (text: string, from?: 'student' | 'mentor') => void;
  saveReview: (r: MentorReview) => void;
  resetMentorship: () => void;
}

const STORAGE_KEY = 'mentorship_state_v1';

const MentorshipContext = createContext<MentorshipContextValue | null>(null);

export const MentorshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<MentorshipState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { profile: null, mentor: null, diagnostics: [], tasks: [], messages: [], review: null };
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const setProfile = useCallback((profile: OnboardingProfile) => setState((s) => ({ ...s, profile })), []);
  const setMentor = useCallback((mentor: MentorPoolEntry) => setState((s) => ({ ...s, mentor })), []);
  const addDiagnostic = useCallback((d: DiagnosticResult) => setState((s) => ({ ...s, diagnostics: [...s.diagnostics.filter(x => x.testId !== d.testId), d] })), []);
  const setTasks = useCallback((tasks: TaskItem[]) => setState((s) => ({ ...s, tasks })), []);
  const toggleTask = useCallback((id: string) => setState((s) => ({ ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t) })), []);
  const addMentorTask = useCallback((task: Omit<TaskItem, 'id' | 'completed' | 'source' | 'date'>) => setState((s) => ({
    ...s,
    tasks: [...s.tasks, { ...task, id: `m-${Date.now()}`, completed: false, source: 'mentor', date: new Date().toISOString() }],
  })), []);
  const sendMessage = useCallback((text: string, from: 'student' | 'mentor' = 'student') => setState((s) => ({
    ...s,
    messages: [...s.messages, { id: `msg-${Date.now()}-${Math.random()}`, from, text, at: new Date().toISOString(), read: from === 'student' }],
  })), []);
  const saveReview = useCallback((review: MentorReview) => setState((s) => ({ ...s, review })), []);
  const resetMentorship = useCallback(() => setState({ profile: null, mentor: null, diagnostics: [], tasks: [], messages: [], review: null }), []);

  return (
    <MentorshipContext.Provider value={{ ...state, setProfile, setMentor, addDiagnostic, setTasks, toggleTask, addMentorTask, sendMessage, saveReview, resetMentorship }}>
      {children}
    </MentorshipContext.Provider>
  );
};

export const useMentorship = () => {
  const ctx = useContext(MentorshipContext);
  if (!ctx) throw new Error('useMentorship must be used inside MentorshipProvider');
  return ctx;
};
