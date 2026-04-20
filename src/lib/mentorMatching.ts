import { mentorPool, MentorPoolEntry, MentorLanguage, MentorStage } from '@/data/mentorPoolData';

export interface MatchCriteria {
  language: MentorLanguage;
  stage: MentorStage;
  examCategory: string;
}

export interface MatchResult {
  mentor: MentorPoolEntry | null;
  reason: string;
  fallbackUsed: boolean;
}

const hasCapacity = (m: MentorPoolEntry) => m.studentsAssigned < m.capacity;

export const findBestMentor = ({ language, stage, examCategory }: MatchCriteria): MatchResult => {
  // Tier 1: language + stage + category + capacity
  let pool = mentorPool.filter(
    (m) =>
      m.languages.includes(language) &&
      m.expertise.includes(stage) &&
      m.examCategories.includes(examCategory) &&
      hasCapacity(m)
  );
  if (pool.length) {
    return { mentor: pool.sort((a, b) => b.rating - a.rating)[0], reason: 'Exact match: language + stage + exam', fallbackUsed: false };
  }

  // Tier 2: language + stage + capacity
  pool = mentorPool.filter((m) => m.languages.includes(language) && m.expertise.includes(stage) && hasCapacity(m));
  if (pool.length) {
    return { mentor: pool.sort((a, b) => b.rating - a.rating)[0], reason: 'Matched by language + stage', fallbackUsed: true };
  }

  // Tier 3: language + capacity
  pool = mentorPool.filter((m) => m.languages.includes(language) && hasCapacity(m));
  if (pool.length) {
    return { mentor: pool.sort((a, b) => b.rating - a.rating)[0], reason: 'Matched by language only', fallbackUsed: true };
  }

  // Tier 4: overall mentor + capacity
  pool = mentorPool.filter((m) => m.expertise.includes('overall') && hasCapacity(m));
  if (pool.length) {
    return { mentor: pool.sort((a, b) => b.rating - a.rating)[0], reason: 'Assigned overall mentor', fallbackUsed: true };
  }

  return { mentor: null, reason: 'No mentors available — added to manual queue', fallbackUsed: true };
};

export const getAvailableMentors = () => mentorPool.filter(hasCapacity);
export const getOverloadedMentors = () => mentorPool.filter((m) => m.studentsAssigned >= m.capacity);
