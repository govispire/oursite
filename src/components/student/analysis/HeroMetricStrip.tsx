import React from 'react';
import type { FullAnalysis } from '@/data/analysisEngine';
import { MicroLabel, Rail, useCountUp } from './primitives';
import { cn } from '@/lib/utils';

const accuracyTone = (a: number) =>
  a >= 80 ? { text: 'text-success', bar: 'bg-success' } : a >= 60 ? { text: 'text-warning', bar: 'bg-warning' } : { text: 'text-danger', bar: 'bg-danger' };

const Metric: React.FC<{
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  rail: number;
  tone?: string;
  valueClass?: string;
}> = ({ label, value, sub, rail, tone = 'bg-primary', valueClass }) => (
  <div className="flex flex-col justify-between gap-2 px-4 py-3.5 sm:px-5">
    <MicroLabel>{label}</MicroLabel>
    <div className={cn('text-2xl font-bold leading-none tabular-nums sm:text-[26px]', valueClass)}>{value}</div>
    <div className="space-y-1.5">
      <Rail value={rail} tone={tone} />
      {sub && <div className="text-[11px] text-muted-foreground/85">{sub}</div>}
    </div>
  </div>
);

export const HeroMetricStrip: React.FC<{ analysis: FullAnalysis }> = ({ analysis }) => {
  const score = useCountUp(analysis.score);
  const percentile = useCountUp(analysis.percentile);
  const accuracy = useCountUp(analysis.accuracy);
  const acc = accuracyTone(analysis.accuracy);
  const scorePct = (analysis.score / analysis.maxScore) * 100;

  return (
    <div className="grid grid-cols-2 divide-border/70 rounded-xl border border-border/70 bg-surface shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
      <Metric
        label="Score"
        value={
          <>
            {score.toFixed(1)}
            <span className="ml-1 text-sm font-semibold text-muted-foreground/80">/ {analysis.maxScore}</span>
          </>
        }
        sub={`${scorePct.toFixed(1)}% of maximum`}
        rail={scorePct}
      />
      <Metric
        label="Rank"
        value={<>#{analysis.rank.toLocaleString('en-IN')}</>}
        sub={`of ${analysis.totalStudents.toLocaleString('en-IN')} takers`}
        rail={100 - (analysis.rank / analysis.totalStudents) * 100}
        tone="bg-secondary"
      />
      <Metric
        label="Percentile"
        value={<>{percentile.toFixed(1)}%</>}
        sub={`Beat ${analysis.percentile.toFixed(1)}% of students`}
        rail={analysis.percentile}
        tone="bg-primary"
      />
      <Metric
        label="Accuracy"
        value={<>{accuracy.toFixed(1)}%</>}
        valueClass={acc.text}
        sub={
          <span className="flex items-center gap-2">
            <span className="text-success">{analysis.correct} correct</span>
            <span className="text-danger">{analysis.wrong} wrong</span>
          </span>
        }
        rail={analysis.accuracy}
        tone={acc.bar}
      />
      <Metric
        label="Attempted"
        value={
          <>
            {analysis.attempted}
            <span className="ml-1 text-sm font-semibold text-muted-foreground/80">of {analysis.totalQuestions} Qs</span>
          </>
        }
        sub={`${analysis.skipped} skipped`}
        rail={(analysis.attempted / analysis.totalQuestions) * 100}
        tone="bg-neutralstate"
      />
    </div>
  );
};
