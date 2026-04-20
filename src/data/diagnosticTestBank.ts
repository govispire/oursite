import { MentorStage } from './mentorPoolData';

export interface DiagnosticTestMeta {
  id: string;
  title: string;
  subject: string;
  questions: number;
  durationMins: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
}

export const buildDiagnosticTests = (
  stage: MentorStage,
  subjects: string[],
  examCategory: string
): DiagnosticTestMeta[] => {
  const base: DiagnosticTestMeta[] = subjects.slice(0, 4).map((subject, i) => ({
    id: `diag-${i}`,
    title: `${subject} Diagnostic`,
    subject,
    questions: stage === 'mains' ? 30 : 25,
    durationMins: stage === 'mains' ? 30 : 20,
    difficulty: i === 0 ? 'Easy' : i === 1 ? 'Medium' : 'Medium',
    description: `Identify your baseline in ${subject} for ${examCategory.toUpperCase()} ${stage}.`,
  }));

  base.push({
    id: 'diag-mock',
    title: stage === 'mains' ? 'Full Mains Mini Mock' : 'Full Prelims Mini Mock',
    subject: 'Mixed',
    questions: stage === 'mains' ? 60 : 50,
    durationMins: stage === 'mains' ? 60 : 40,
    difficulty: 'Hard',
    description: 'A comprehensive mixed test to map weak vs strong areas.',
  });

  return base;
};
