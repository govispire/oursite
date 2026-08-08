import React from 'react';
import type { FullAnalysis } from '@/data/analysisEngine';
import { MicroLabel, Rail, useCountUp } from './primitives';
import { cn } from '@/lib/utils';

const accuracyTone = (a: number) =>
  a >= 80
    ? { text: 'text-success', bar: 'bg-success' }
    : a >= 60
    ? { text: 'text-warning', bar: 'bg-warning' }
    : { text: 'text-danger', bar: 'bg-danger' };

const Metric: React.FC<{
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  rail: number;
  tone?: string;
  valueClass?: string;
}> = ({ label, value, sub, rail, tone = 'bg-neutralstate', valueClass }) => (
  <div className="flex flex-col gap-3 px-5 py-5 sm:px-6">
    <MicroLabel>{label}</MicroLabel>
    <div className={cn('num text-[22px] font-bold leading-none sm:text-2xl', valueClass)}>{value}</div>
    <div className="space-y-2">
      <Rail value={rail} tone={tone} />
      {sub && <div className="text-[11.5px] leading-tight text-muted-foreground">{sub}</div>}
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
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="grid grid-cols-1 divide-y divide-border lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2.4fr)] lg:divide-x lg:divide-y-0">
        {/* Headline result */}
        <div className="px-6 py-6 sm:px-8">
          <MicroLabel>Final score</MicroLabel>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="num text-[44px] font-bold leading-none text-primary sm:text-[52px]">
              {score.toFixed(1)}
            </span>
            <span className="num text-lg font-semibold text-muted-foreground">/ {analysis.maxScore}</span>
          </div>
          <div className="mt-4">
            <Rail value={scorePct} tone="bg-primary" />
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
            {scorePct.toFixed(1)}% of the maximum, ahead of{' '}
            <span className="font-semibold text-foreground">{analysis.percentile.toFixed(1)}%</span> of{' '}
            {analysis.totalStudents.toLocaleString('en-IN')} takers.
          </p>
        </div>

        {/* Supporting figures */}
        <div className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
          <Metric
            label="Rank"
            value={<>#{analysis.rank.toLocaleString('en-IN')}</>}
            sub={`of ${analysis.totalStudents.toLocaleString('en-IN')} takers`}
            rail={100 - (analysis.rank / analysis.totalStudents) * 100}
          />
          <Metric
            label="Percentile"
            value={<>{percentile.toFixed(1)}%</>}
            sub={`Top ${(100 - analysis.percentile).toFixed(1)}%`}
            rail={analysis.percentile}
          />
          <Metric
            label="Accuracy"
            value={<>{accuracy.toFixed(1)}%</>}
            valueClass={acc.text}
            sub={
              <span className="flex items-center gap-2">
                <span className="text-success">{analysis.correct} right</span>
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
                <span className="ml-1 text-sm font-semibold text-muted-foreground">/ {analysis.totalQuestions}</span>
              </>
            }
            sub={`${analysis.skipped} skipped`}
            rail={(analysis.attempted / analysis.totalQuestions) * 100}
          />
        </div>
      </div>
    </div>
  );
};
