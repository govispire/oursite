/**
 * Solution-review question bank. Deterministic per testId so the palette,
 * the analysis numbers and the question list stay consistent.
 */
import { buildAnalysis } from './analysisEngine';

export type SolutionStatus = 'correct' | 'incorrect' | 'skipped';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface SolutionSet {
  id: string;
  kind: 'passage' | 'di' | 'puzzle';
  title: string;
  body: string;
  table?: { headers: string[]; rows: (string | number)[][] };
}

export interface SolutionQuestion {
  id: number;
  section: string;
  topic: string;
  setId?: string;
  question: string;
  questionHi: string;
  options: string[];
  optionsHi: string[];
  correctIndex: number;
  chosenIndex: number | null;
  status: SolutionStatus;
  difficulty: Difficulty;
  yourTimeSec: number;
  avgTimeSec: number;
  marks: number;
  negative: number;
  globalAccuracy: number;
  explanation: string[];
  keyPoints: string[];
  shortcut: string;
}

export interface SolutionBank {
  testId: string;
  testName: string;
  sections: string[];
  sets: Record<string, SolutionSet>;
  questions: SolutionQuestion[];
}

const hash = (v: string) => {
  let h = 2166136261;
  for (let i = 0; i < v.length; i++) {
    h ^= v.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

const makeRandom = (seed: number) => {
  let s = seed || 7;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
};

const PASSAGE: SolutionSet = {
  id: 'rc-1',
  kind: 'passage',
  title: 'Reading Comprehension — Passage',
  body:
    'India\'s digital payments story is often told through volumes, but the more interesting shift is behavioural. ' +
    'A decade ago a small merchant treated cash as the default and digital as an exception reserved for large tickets. ' +
    'Today, the sub-fifty-rupee transaction is the fastest growing slice of the market, which means the payment rail has become ' +
    'invisible infrastructure rather than a product a customer consciously chooses.\n\n' +
    'That invisibility has consequences. When a rail becomes infrastructure, reliability matters far more than features, and the ' +
    'economics of running it change: revenue per transaction collapses while the cost of guaranteeing uptime rises. ' +
    'Regulators, in turn, begin to treat the operator less like a start-up and more like a utility. The unresolved question is ' +
    'who funds the resilience that everyone now assumes is free.',
};

const DI_SET: SolutionSet = {
  id: 'di-1',
  kind: 'di',
  title: 'Data Interpretation — Branch-wise loan disbursal (in Rs. crore)',
  body: 'Study the table carefully and answer the questions that follow.',
  table: {
    headers: ['Branch', 'Home', 'Auto', 'Personal', 'Total'],
    rows: [
      ['Kochi', 240, 120, 90, 450],
      ['Chennai', 310, 150, 110, 570],
      ['Pune', 190, 95, 85, 370],
      ['Jaipur', 260, 130, 100, 490],
      ['Indore', 210, 105, 75, 390],
    ],
  },
};

const PUZZLE_SET: SolutionSet = {
  id: 'pz-1',
  kind: 'puzzle',
  title: 'Puzzle — Seating arrangement',
  body:
    'Eight friends — A, B, C, D, E, F, G and H — sit around a circular table facing the centre.\n' +
    'A sits third to the left of D. C is an immediate neighbour of both B and F.\n' +
    'E sits second to the right of H, who is not adjacent to A.\n' +
    'G sits exactly between D and B when counted clockwise.',
};

interface Template {
  topic: string;
  setId?: string;
  q: string;
  qHi: string;
  options: string[];
  correct: number;
  explanation: string[];
  keyPoints: string[];
  shortcut: string;
}

const TEMPLATES: Record<string, Template[]> = {
  'English Language': [
    {
      topic: 'Reading Comprehension',
      setId: 'rc-1',
      q: 'According to the passage, the most significant change in digital payments is:',
      qHi: 'गद्यांश के अनुसार, डिजिटल भुगतान में सबसे महत्वपूर्ण बदलाव क्या है?',
      options: [
        'The growth in total transaction volume',
        'A behavioural shift making the rail invisible infrastructure',
        'The entry of global payment operators',
        'A fall in the cost of smartphones',
      ],
      correct: 1,
      explanation: [
        'The author explicitly contrasts volume with behaviour: "the more interesting shift is behavioural".',
        'The following lines describe the rail becoming "invisible infrastructure rather than a product a customer consciously chooses".',
        'Options A, C and D are either secondary details or never mentioned, so option B captures the central claim.',
      ],
      keyPoints: [
        'Main-idea questions reward the sentence that the author frames as more important, not the largest number quoted.',
        'Contrast markers ("but", "rather than") almost always sit next to the answer.',
      ],
      shortcut: 'Scan only for contrast markers first — in main-idea RC questions the answer sits within one line of them.',
    },
    {
      topic: 'Error Spotting',
      q: 'Identify the part that contains an error: (A) Neither the manager (B) nor his assistants (C) was aware of (D) the revised policy.',
      qHi: 'त्रुटि वाले भाग को पहचानें।',
      options: ['(A)', '(B)', '(C)', '(D)'],
      correct: 2,
      explanation: [
        'With "neither ... nor", the verb agrees with the subject closest to it.',
        'The nearer subject is "his assistants" (plural), so the verb must be "were", not "was".',
        'Hence part (C) carries the error.',
      ],
      keyPoints: ['Proximity rule governs neither/nor, either/or and not only/but also.'],
      shortcut: 'Cover everything except the word immediately before the verb — match the verb to that word.',
    },
    {
      topic: 'Para Jumbles',
      q: 'Which sentence should open the paragraph?',
      qHi: 'अनुच्छेद की शुरुआत किस वाक्य से होनी चाहिए?',
      options: ['Sentence P', 'Sentence Q', 'Sentence R', 'Sentence S'],
      correct: 0,
      explanation: [
        'The opening sentence must introduce a noun without referring back to it.',
        'Sentences Q, R and S all begin with pronouns or connectors ("this", "however", "such"), so they depend on earlier context.',
        'Only P introduces the subject independently.',
      ],
      keyPoints: ['An opener never contains a back-referring pronoun.'],
      shortcut: 'Eliminate every option starting with this/that/such/however before reading the sentences fully.',
    },
  ],
  'Reasoning Ability': [
    {
      topic: 'Puzzles & Seating Arrangement',
      setId: 'pz-1',
      q: 'Who sits immediately to the right of D?',
      qHi: 'D के ठीक दाईं ओर कौन बैठा है?',
      options: ['G', 'B', 'F', 'H'],
      correct: 0,
      explanation: [
        'Fix A and D first: A sits third to the left of D, which anchors two positions.',
        'G lies exactly between D and B clockwise, so G occupies the seat immediately clockwise from D.',
        'For a circle facing the centre, clockwise-next means the immediate right, so G is the answer.',
      ],
      keyPoints: ['Facing centre: clockwise = left, anticlockwise = right for movement, but "between X and Y clockwise" fixes adjacency directly.'],
      shortcut: 'Place the definite clue (third to the left) first; conditional clues resolve themselves in one pass afterwards.',
    },
    {
      topic: 'Syllogism',
      q: 'Statements: All pens are books. Some books are red. Conclusions: I. Some pens are red. II. Some books are pens.',
      qHi: 'कथन और निष्कर्ष के आधार पर उत्तर दें।',
      options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
      correct: 1,
      explanation: [
        'All pens are books gives a valid converse: some books are pens. So II follows.',
        '"Some books are red" does not guarantee overlap with the pen subset, so I is only a possibility.',
        'Therefore only conclusion II follows.',
      ],
      keyPoints: ['All A are B always yields "Some B are A".', 'A "some" statement never transfers across two links.'],
      shortcut: 'Convert every universal statement immediately — most exam conclusions are just converses.',
    },
    {
      topic: 'Inequality',
      q: 'If P > Q ≥ R = S < T, which conclusion is definitely true?',
      qHi: 'कौन-सा निष्कर्ष निश्चित रूप से सत्य है?',
      options: ['P > S', 'T > Q', 'R > P', 'S ≥ T'],
      correct: 0,
      explanation: [
        'Trace the chain from P: P > Q, Q ≥ R, R = S, so P > S holds strictly.',
        'T is compared only with S, so no relation with Q can be established.',
      ],
      keyPoints: ['A conclusion is valid only if an unbroken chain of same-direction signs connects the two terms.'],
      shortcut: 'Rewrite the chain left to right and delete every term not in the conclusion.',
    },
  ],
  'Quantitative Aptitude': [
    {
      topic: 'Data Interpretation',
      setId: 'di-1',
      q: 'What is the ratio of home loans in Chennai to total loans in Pune?',
      qHi: 'चेन्नई में होम लोन का पुणे के कुल लोन से अनुपात क्या है?',
      options: ['31 : 37', '31 : 39', '24 : 37', '26 : 37'],
      correct: 0,
      explanation: [
        'Home loans in Chennai = 310 crore. Total loans in Pune = 370 crore.',
        'Ratio = 310 : 370 = 31 : 37 after dividing both by 10.',
      ],
      keyPoints: ['Cancel the common factor before simplifying — it removes an entire step of arithmetic.'],
      shortcut: 'Strip trailing zeros mentally: 310:370 becomes 31:37 instantly.',
    },
    {
      topic: 'Quadratic Equations',
      q: 'Solve: x² − 11x + 30 = 0 and y² − 9y + 20 = 0. Find the relation.',
      qHi: 'x और y के बीच संबंध ज्ञात करें।',
      options: ['x > y', 'x ≥ y', 'x < y', 'Relation cannot be established'],
      correct: 1,
      explanation: [
        'x² − 11x + 30 = 0 gives x = 5, 6.',
        'y² − 9y + 20 = 0 gives y = 4, 5.',
        'Every value of x is greater than or equal to every value of y, so x ≥ y.',
      ],
      keyPoints: ['Compare the smallest x with the largest y before concluding a strict inequality.'],
      shortcut: 'If the smallest root of one equation equals the largest root of the other, the answer is the "≥" option.',
    },
    {
      topic: 'Time & Work',
      q: 'A completes a job in 12 days, B in 18 days. Working together, how long do they take?',
      qHi: 'दोनों मिलकर कार्य कितने दिनों में पूरा करेंगे?',
      options: ['6.8 days', '7.2 days', '7.5 days', '8 days'],
      correct: 1,
      explanation: [
        'Take LCM of 12 and 18 = 36 units of work.',
        'A does 3 units/day, B does 2 units/day, together 5 units/day.',
        'Time = 36 / 5 = 7.2 days.',
      ],
      keyPoints: ['The LCM method avoids fractions entirely in time-and-work problems.'],
      shortcut: 'LCM units beats the 1/a + 1/b formula by roughly 15 seconds per question.',
    },
  ],
  'General Awareness': [
    {
      topic: 'Banking Awareness',
      q: 'Which body regulates the payment and settlement systems in India?',
      qHi: 'भारत में भुगतान और निपटान प्रणाली को कौन नियंत्रित करता है?',
      options: ['SEBI', 'RBI', 'IRDAI', 'NABARD'],
      correct: 1,
      explanation: [
        'The Payment and Settlement Systems Act, 2007 designates the Reserve Bank of India as the regulator.',
        'SEBI regulates securities markets, IRDAI insurance, and NABARD rural finance.',
      ],
      keyPoints: ['Map each Act to its regulator — exams repeat this pairing every cycle.'],
      shortcut: 'If the question mentions payments, settlement or currency, the answer is almost always RBI.',
    },
  ],
  'Computer Aptitude': [
    {
      topic: 'Fundamentals',
      q: 'Which memory is directly accessible by the CPU?',
      qHi: 'CPU द्वारा कौन-सी मेमोरी सीधे एक्सेस की जाती है?',
      options: ['Hard disk', 'Cache memory', 'Optical disk', 'Magnetic tape'],
      correct: 1,
      explanation: [
        'Cache sits closest to the CPU and is accessed directly with the lowest latency.',
        'All other options are secondary storage accessed through controllers.',
      ],
      keyPoints: ['Memory hierarchy: registers > cache > RAM > secondary storage.'],
      shortcut: 'Anything described as "directly accessible" points to cache or registers.',
    },
  ],
};

export const buildSolutionBank = (testIdRaw?: string): SolutionBank => {
  const analysis = buildAnalysis(testIdRaw);
  const rnd = makeRandom(hash(analysis.testId + ':sol'));
  const questions: SolutionQuestion[] = [];
  let counter = 1;

  analysis.sections.forEach((section) => {
    const templates = TEMPLATES[section.name] || TEMPLATES['General Awareness'];
    const perQMark = analysis.maxScore / analysis.totalQuestions;
    // Reproduce the section's correct / wrong / skipped split exactly.
    const statuses: SolutionStatus[] = [
      ...Array<SolutionStatus>(section.correct).fill('correct'),
      ...Array<SolutionStatus>(section.wrong).fill('incorrect'),
      ...Array<SolutionStatus>(section.skipped).fill('skipped'),
    ];
    // Deterministic shuffle so statuses are interleaved, not blocked.
    for (let i = statuses.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [statuses[i], statuses[j]] = [statuses[j], statuses[i]];
    }

    statuses.forEach((status, idx) => {
      const t = templates[idx % templates.length];
      const avg = 30 + Math.floor(rnd() * 60);
      const yourTime = status === 'skipped' ? Math.floor(rnd() * 12) : Math.max(6, Math.round(avg * (0.5 + rnd())));
      const chosenIndex =
        status === 'correct'
          ? t.correct
          : status === 'incorrect'
          ? (t.correct + 1 + Math.floor(rnd() * 3)) % 4
          : null;
      questions.push({
        id: counter++,
        section: section.name,
        topic: t.topic,
        setId: t.setId,
        question: t.q,
        questionHi: t.qHi,
        options: t.options,
        optionsHi: t.options,
        correctIndex: t.correct,
        chosenIndex,
        status,
        difficulty: (['Easy', 'Medium', 'Hard'] as Difficulty[])[Math.floor(rnd() * 3)],
        yourTimeSec: yourTime,
        avgTimeSec: avg,
        marks: status === 'correct' ? Math.round(perQMark * 100) / 100 : 0,
        negative: status === 'incorrect' ? Math.round(perQMark * 25) / 100 : 0,
        globalAccuracy: 30 + Math.floor(rnd() * 62),
        explanation: t.explanation,
        keyPoints: t.keyPoints,
        shortcut: t.shortcut,
      });
    });
  });

  return {
    testId: analysis.testId,
    testName: analysis.testName,
    sections: analysis.sections.map((s) => s.name),
    sets: { 'rc-1': PASSAGE, 'di-1': DI_SET, 'pz-1': PUZZLE_SET },
    questions,
  };
};
