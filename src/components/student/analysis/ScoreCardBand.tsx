import React from 'react';
import type { FullAnalysis } from '@/data/analysisEngine';
import { MicroLabel } from './primitives';
import { cn } from '@/lib/utils';

/**
 * "Score Card" band — inspired by the hand-drawn notebook scorecard:
 * three headline fractions (Score / Cut-off / Rank) over a ruled metric table.
 */

const Fraction: React.FC<{
  top: string;
  bottom: string;
  label: string;
  tone?: string;
  srText: string;
}> = ({ top, bottom, label, tone = 'text-foreground', srText }) => (
  <div className="flex flex-col items-center gap-2 px-4 py-1">
    <span className="sr-only">{srText}</span>
    <div aria-hidden className="flex flex-col items-center">
      <span className={cn('num text-[34px] font-bold leading-none sm:text-[40px]', tone)}>{top}</span>
      <span className="my-1.5 h-px w-14 rounded-full bg-foreground/25 sm:w-16" />
      <span className="num text-sm font-semibold text-muted-foreground">{bottom}</span>
      <svg viewBox="0 0 90 14" className="mt-1 h-3 w-[86px] text-primary/45" fill="none" aria-hidden>
        <path
          d="M2 9C16 3 34 1.5 50 4.5C62 6.8 74 10 88 5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
    <MicroLabel aria-hidden>{label}</MicroLabel>
  </div>
);

export const ScoreCardBand: React.FC<{ analysis: FullAnalysis }> = ({ analysis }) => {
  const cells = [
    { label: 'Percentile', value: `${analysis.percentile.toFixed(1)}%` },
    { label: 'Accuracy', value: `${analysis.accuracy.toFixed(1)}%` },
    { label: 'Attempted', value: `${analysis.attempted}` },
    { label: 'Correct', value: `${analysis.correct}` },
    { label: 'Wrong', value: `${analysis.wrong}` },
  ];

  return (
    <section
      aria-labelledby="scorecard-heading"
      className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-7">
        <h2 id="scorecard-heading" className="text-base font-semibold text-foreground">
          Score card
        </h2>
        <MicroLabel>{analysis.date}</MicroLabel>
      </div>

      <div className="grid grid-cols-3 divide-x divide-border px-2 py-6 sm:px-6">
        <Fraction
          top={analysis.score.toFixed(0)}
          bottom={`${analysis.maxScore}`}
          label="Score"
          tone="text-primary"
          srText={`Score ${analysis.score.toFixed(1)} out of ${analysis.maxScore}`}
        />
        <Fraction
          top={analysis.overallCutoff.toFixed(0)}
          bottom={`${analysis.maxScore}`}
          label="Cut-off"
          tone={analysis.score >= analysis.overallCutoff ? 'text-success' : 'text-danger'}
          srText={`Cut-off ${analysis.overallCutoff.toFixed(1)} out of ${analysis.maxScore}. You are ${
            analysis.score >= analysis.overallCutoff ? 'above' : 'below'
          } the cut-off.`}
        />
        <Fraction
          top={`${analysis.rank}`}
          bottom={analysis.totalStudents.toLocaleString('en-IN')}
          label="Rank"
          srText={`Rank ${analysis.rank} of ${analysis.totalStudents} test takers`}
        />
      </div>

      <table className="w-full table-fixed border-t border-border text-center">
        <caption className="sr-only">Summary metrics for this attempt</caption>
        <thead>
          <tr>
            {cells.map((c) => (
              <th
                key={c.label}
                scope="col"
                className="border-r border-border px-2 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground last:border-r-0"
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-border">
            {cells.map((c) => (
              <td key={c.label} className="num border-r border-border px-2 py-3.5 text-lg font-bold last:border-r-0">
                {c.value}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default ScoreCardBand;
