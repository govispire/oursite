/**
 * Deterministic analysis engine.
 * The same testId always produces the same numbers, so the modal, the full page
 * and the solution viewer never disagree with each other.
 */

export type ExamTypeTag =
  | 'Full Test'
  | 'Live Test'
  | 'Speed Test'
  | 'Sectional Test'
  | 'Prelims'
  | 'Mains'
  | 'PYQ';

export type StrengthLevel = 'strong' | 'moderate' | 'weak' | 'critical';

export interface AnalysisSection {
  name: string;
  total: number;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  score: number;
  maxScore: number;
  rank: number;
  percentile: number;
  accuracy: number;
  timeSpent: number; // minutes
  idealTime: number; // minutes
  cutoff: number;
  topperScore: number;
}

export interface AnalysisTopic {
  topic: string;
  subject: string;
  total: number;
  correct: number;
  attempted: number;
  accuracy: number;
  avgTimePerQ: number; // seconds
  level: StrengthLevel;
}

export interface HistoryPoint {
  test: string;
  date: string;
  score: number;
  rank: number;
  accuracy: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  initials: string;
  score: number;
  percentile: number;
  timeTaken: string;
  isYou?: boolean;
}

export interface FullAnalysis {
  testId: string;
  testName: string;
  examFamily: string;
  typeTag: ExamTypeTag;
  date: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  score: number;
  maxScore: number;
  negativeMarks: number;
  rank: number;
  totalStudents: number;
  percentile: number;
  accuracy: number;
  timeTakenSec: number;
  maxTimeSec: number;
  overallCutoff: number;
  readiness: number;
  sections: AnalysisSection[];
  topics: AnalysisTopic[];
  history: HistoryPoint[];
  leaderboard: LeaderboardEntry[];
  topper: {
    name: string;
    initials: string;
    score: number;
    accuracy: number;
    timeTakenSec: number;
    percentile: number;
    sectionScores: Record<string, number>;
  };
}

/* ---------------------------------------------------------------- helpers */

const hashString = (value: string) => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

const makeRandom = (seed: number) => {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
};

const pick = <T,>(rnd: () => number, list: T[]) => list[Math.floor(rnd() * list.length) % list.length];
const between = (rnd: () => number, min: number, max: number) => Math.round(min + rnd() * (max - min));
const round1 = (n: number) => Math.round(n * 10) / 10;

export const prettifyTestId = (id: string) =>
  id.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return s ? `${m}m ${s}s` : `${m}m`;
};

export const strengthOf = (accuracy: number, attempted: number): StrengthLevel => {
  if (attempted === 0) return 'critical';
  if (accuracy >= 80) return 'strong';
  if (accuracy >= 60) return 'moderate';
  if (accuracy >= 40) return 'weak';
  return 'critical';
};

/* ---------------------------------------------------------------- content */

const SUBJECT_TOPICS: Record<string, string[]> = {
  'English Language': [
    'Reading Comprehension',
    'Para Jumbles',
    'Error Spotting',
    'Cloze Test',
    'Sentence Improvement',
    'Vocabulary',
    'Fillers',
  ],
  'Reasoning Ability': [
    'Puzzles & Seating Arrangement',
    'Syllogism',
    'Blood Relations',
    'Inequality',
    'Coding-Decoding',
    'Direction Sense',
    'Data Sufficiency',
  ],
  'Quantitative Aptitude': [
    'Data Interpretation',
    'Quadratic Equations',
    'Number Series',
    'Simplification',
    'Time & Work',
    'Profit & Loss',
    'Percentage & Ratio',
  ],
  'General Awareness': [
    'Banking Awareness',
    'Current Affairs',
    'Static GK',
    'Financial Awareness',
    'Government Schemes',
  ],
  'Computer Aptitude': ['Fundamentals', 'MS Office', 'Networking', 'Security', 'Abbreviations'],
};

const FIRST_NAMES = [
  'Aarav', 'Diya', 'Rohit', 'Ananya', 'Karthik', 'Meera', 'Vikram', 'Sneha',
  'Arjun', 'Priya', 'Rahul', 'Nisha', 'Sanjay', 'Kavya', 'Imran',
];
const LAST_NAMES = ['Sharma', 'Nair', 'Reddy', 'Patel', 'Iyer', 'Khan', 'Verma', 'Das', 'Menon', 'Gupta'];

const detectType = (id: string): ExamTypeTag => {
  const l = id.toLowerCase();
  if (l.includes('pyq') || l.includes('previous')) return 'PYQ';
  if (l.includes('live')) return 'Live Test';
  if (l.includes('speed')) return 'Speed Test';
  if (l.includes('sectional')) return 'Sectional Test';
  if (l.includes('mains')) return 'Mains';
  if (l.includes('prelims')) return 'Prelims';
  return 'Full Test';
};

const detectFamily = (id: string) => {
  const l = id.toLowerCase();
  if (l.includes('sbi')) return 'SBI PO';
  if (l.includes('ibps')) return 'IBPS PO';
  if (l.includes('rrb')) return 'IBPS RRB';
  if (l.includes('ssc')) return 'SSC CGL';
  if (l.includes('upsc')) return 'UPSC CSE';
  if (l.includes('rbi')) return 'RBI Grade B';
  return 'SBI PO';
};

const SECTION_BLUEPRINT: Record<string, { name: string; total: number; marks: number; ideal: number; cutoff: number }[]> = {
  'SBI PO': [
    { name: 'English Language', total: 30, marks: 30, ideal: 20, cutoff: 9.5 },
    { name: 'Reasoning Ability', total: 35, marks: 35, ideal: 20, cutoff: 10.25 },
    { name: 'Quantitative Aptitude', total: 35, marks: 35, ideal: 20, cutoff: 8.5 },
  ],
  'IBPS PO': [
    { name: 'English Language', total: 30, marks: 30, ideal: 20, cutoff: 8 },
    { name: 'Reasoning Ability', total: 35, marks: 35, ideal: 20, cutoff: 10 },
    { name: 'Quantitative Aptitude', total: 35, marks: 35, ideal: 20, cutoff: 9 },
  ],
  'IBPS RRB': [
    { name: 'Reasoning Ability', total: 40, marks: 40, ideal: 22, cutoff: 12 },
    { name: 'Quantitative Aptitude', total: 40, marks: 40, ideal: 23, cutoff: 11 },
  ],
  'SSC CGL': [
    { name: 'Reasoning Ability', total: 25, marks: 50, ideal: 15, cutoff: 14 },
    { name: 'General Awareness', total: 25, marks: 50, ideal: 10, cutoff: 12 },
    { name: 'Quantitative Aptitude', total: 25, marks: 50, ideal: 20, cutoff: 16 },
    { name: 'English Language', total: 25, marks: 50, ideal: 15, cutoff: 15 },
  ],
  'UPSC CSE': [
    { name: 'General Awareness', total: 50, marks: 100, ideal: 60, cutoff: 42 },
    { name: 'Reasoning Ability', total: 50, marks: 100, ideal: 60, cutoff: 45 },
  ],
  'RBI Grade B': [
    { name: 'General Awareness', total: 40, marks: 40, ideal: 25, cutoff: 15 },
    { name: 'Reasoning Ability', total: 30, marks: 30, ideal: 25, cutoff: 11 },
    { name: 'Quantitative Aptitude', total: 30, marks: 30, ideal: 25, cutoff: 10 },
  ],
};

/* ------------------------------------------------------------------ build */

export const buildAnalysis = (testIdRaw?: string, testNameOverride?: string): FullAnalysis => {
  const testId = testIdRaw || 'sbi-po-prelims-mock-1';
  const rnd = makeRandom(hashString(testId));
  const family = detectFamily(testId);
  const typeTag = detectType(testId);
  const blueprint = SECTION_BLUEPRINT[family] || SECTION_BLUEPRINT['SBI PO'];

  const sections: AnalysisSection[] = blueprint.map((bp) => {
    const attempted = between(rnd, Math.round(bp.total * 0.5), bp.total);
    const accuracyBase = 55 + rnd() * 40;
    const correct = Math.max(1, Math.round((attempted * accuracyBase) / 100));
    const wrong = attempted - correct;
    const skipped = bp.total - attempted;
    const perQ = bp.marks / bp.total;
    const score = round1(correct * perQ - wrong * perQ * 0.25);
    const timeSpent = Math.max(5, Math.round(bp.ideal + (rnd() - 0.45) * bp.ideal * 0.5));
    return {
      name: bp.name,
      total: bp.total,
      attempted,
      correct,
      wrong,
      skipped,
      score,
      maxScore: bp.marks,
      rank: between(rnd, 8, 900),
      percentile: round1(70 + rnd() * 29),
      accuracy: round1((correct / Math.max(1, attempted)) * 100),
      timeSpent,
      idealTime: bp.ideal,
      cutoff: bp.cutoff,
      topperScore: round1(Math.min(bp.marks, score + 4 + rnd() * 10)),
    };
  });

  const totalQuestions = sections.reduce((a, s) => a + s.total, 0);
  const attempted = sections.reduce((a, s) => a + s.attempted, 0);
  const correct = sections.reduce((a, s) => a + s.correct, 0);
  const wrong = sections.reduce((a, s) => a + s.wrong, 0);
  const skipped = totalQuestions - attempted;
  const maxScore = sections.reduce((a, s) => a + s.maxScore, 0);
  const score = round1(sections.reduce((a, s) => a + s.score, 0));
  const negativeMarks = round1(
    sections.reduce((a, s) => a + s.wrong * (s.maxScore / s.total) * 0.25, 0)
  );
  const totalStudents = between(rnd, 4200, 24000);
  const rank = between(rnd, 12, Math.round(totalStudents * 0.12));
  const percentile = round1(100 - (rank / totalStudents) * 100);
  const accuracy = round1((correct / Math.max(1, attempted)) * 100);
  const maxTimeSec = sections.reduce((a, s) => a + s.idealTime, 0) * 60;
  const timeTakenSec = Math.min(maxTimeSec, sections.reduce((a, s) => a + s.timeSpent, 0) * 60);
  const overallCutoff = round1(sections.reduce((a, s) => a + s.cutoff, 0) + maxScore * 0.28);

  const cutoffScore = Math.min(100, Math.max(0, ((score - overallCutoff) / Math.max(1, overallCutoff)) * 60 + 55));
  const readiness = Math.round(cutoffScore * 0.55 + accuracy * 0.3 + percentile * 0.15);

  const topics: AnalysisTopic[] = sections.flatMap((section) => {
    const list = SUBJECT_TOPICS[section.name] || [];
    return list.map((topic) => {
      const total = between(rnd, 3, 8);
      const attemptedT = between(rnd, 0, total);
      const acc = attemptedT === 0 ? 0 : round1(30 + rnd() * 70);
      const correctT = Math.round((attemptedT * acc) / 100);
      return {
        topic,
        subject: section.name,
        total,
        attempted: attemptedT,
        correct: correctT,
        accuracy: attemptedT === 0 ? 0 : round1((correctT / attemptedT) * 100),
        avgTimePerQ: between(rnd, 25, 110),
        level: strengthOf(attemptedT === 0 ? 0 : (correctT / attemptedT) * 100, attemptedT),
      };
    });
  });

  const history: HistoryPoint[] = Array.from({ length: 15 }, (_, i) => {
    const idx = 14 - i;
    const drift = (14 - idx) * 1.1;
    const s = Math.max(10, Math.min(maxScore, score - drift + (rnd() - 0.5) * 8));
    return {
      test: `T${idx + 1}`,
      date: new Date(Date.now() - idx * 6 * 86400000).toISOString().slice(0, 10),
      score: round1(s),
      rank: Math.max(1, Math.round(rank * (1 + idx * 0.12))),
      accuracy: round1(Math.max(35, Math.min(99, accuracy - idx * 0.9 + (rnd() - 0.5) * 6))),
    };
  }).reverse();

  const topperScore = round1(Math.min(maxScore, score + 6 + rnd() * 14));
  const topperName = `${pick(rnd, FIRST_NAMES)} ${pick(rnd, LAST_NAMES)}`;
  const topper = {
    name: topperName,
    initials: topperName.split(' ').map((n) => n[0]).join(''),
    score: topperScore,
    accuracy: round1(Math.min(99, accuracy + 4 + rnd() * 9)),
    timeTakenSec: Math.round(timeTakenSec * (0.82 + rnd() * 0.1)),
    percentile: 99.9,
    sectionScores: sections.reduce<Record<string, number>>((acc2, s) => {
      acc2[s.name] = s.topperScore;
      return acc2;
    }, {}),
  };

  const leaderboard: LeaderboardEntry[] = Array.from({ length: 10 }, (_, i) => {
    const name = i === 0 ? topperName : `${pick(rnd, FIRST_NAMES)} ${pick(rnd, LAST_NAMES)}`;
    const s = round1(topperScore - i * (1.2 + rnd()));
    return {
      rank: i + 1,
      name,
      initials: name.split(' ').map((n) => n[0]).join(''),
      score: s,
      percentile: round1(99.9 - i * 0.12),
      timeTaken: formatDuration(Math.round(topper.timeTakenSec + i * between(rnd, 20, 90))),
    };
  });

  return {
    testId,
    testName: testNameOverride || prettifyTestId(testId),
    examFamily: family,
    typeTag,
    date: new Date(Date.now() - between(rnd, 0, 20) * 86400000).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    totalQuestions,
    attempted,
    correct,
    wrong,
    skipped,
    score,
    maxScore,
    negativeMarks,
    rank,
    totalStudents,
    percentile,
    accuracy,
    timeTakenSec,
    maxTimeSec,
    overallCutoff,
    readiness: Math.max(8, Math.min(99, readiness)),
    sections,
    topics,
    history,
    leaderboard,
    topper,
  };
};
