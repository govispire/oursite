import { MentorStage } from './mentorPoolData';

export interface PredefinedTask {
  id: string;
  title: string;
  subject: string;
  estimatedMins: number;
  priority: 'high' | 'medium' | 'low';
  type: 'practice' | 'mock' | 'revision' | 'reading';
}

export const buildDailyTasks = (stage: MentorStage, subjects: string[]): PredefinedTask[] => {
  const tasks: PredefinedTask[] = [
    { id: 't1', title: '20 Quantitative Aptitude questions', subject: 'Quant', estimatedMins: 30, priority: 'high', type: 'practice' },
    { id: 't2', title: '1 English Reading Comprehension', subject: 'English', estimatedMins: 15, priority: 'medium', type: 'practice' },
    { id: 't3', title: '1 Reasoning puzzle set', subject: 'Reasoning', estimatedMins: 25, priority: 'medium', type: 'practice' },
    { id: 't4', title: 'Daily Current Affairs (10 Q)', subject: 'GA', estimatedMins: 15, priority: 'high', type: 'reading' },
    { id: 't5', title: '1 Sectional Mock Test', subject: 'Mixed', estimatedMins: 30, priority: 'high', type: 'mock' },
    { id: 't6', title: 'Revision: yesterday weak topics', subject: 'Mixed', estimatedMins: 20, priority: 'low', type: 'revision' },
  ];
  if (stage === 'mains') {
    tasks.push({ id: 't7', title: 'Descriptive essay writing', subject: 'English', estimatedMins: 40, priority: 'high', type: 'practice' });
  }
  if (stage === 'interview') {
    tasks.push({ id: 't8', title: 'Mock interview Q&A practice', subject: 'Personality', estimatedMins: 30, priority: 'high', type: 'practice' });
  }
  return tasks;
};
