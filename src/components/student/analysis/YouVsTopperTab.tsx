import React from 'react';
import type { FullAnalysis } from '@/data/analysisEngine';
import { formatDuration } from '@/data/analysisEngine';
import { Panel, MicroLabel } from './primitives';
import { cn } from '@/lib/utils';
import { Trophy, Crown, Target, Timer, Percent } from 'lucide-react';

const Podium: React.FC<{ analysis: FullAnalysis }> = ({ analysis }) => {
  const top5 = analysis.leaderboard.slice(0, 5);
  const order = [3, 1, 0, 2, 4]; // 4th, 2nd, 1st, 3rd, 5th
  const heights = ['h-16', 'h-24', 'h-32', 'h-24', 'h-16'];
  const tones = [
    'bg-neutralstate-soft border-border',
    'bg-neutralstate-soft border-border',
    'bg-gold-soft border-gold/40',
    'bg-neutralstate-soft border-border',
    'bg-neutralstate-soft border-border',
  ];

  return (
    <div className="flex items-end justify-center gap-2 sm:gap-4">
      {order.map((idx, pos) => {
        const e = top5[idx];
        if (!e) return null;
        const isFirst = idx === 0;
        return (
          <div key={e.rank} className="flex w-[19%] min-w-[58px] flex-col items-center">
            {isFirst && <Crown className="mb-1 h-5 w-5 text-gold" />}
            <div
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-full border text-sm font-bold sm:h-12 sm:w-12',
                isFirst ? 'border-gold/50 bg-gold-soft text-gold' : 'border-border bg-surface-muted text-foreground/80'
              )}
            >
              {e.initials}
            </div>
            <div className="mt-1.5 w-full truncate text-center text-[11px] font-medium">{e.name}</div>
            <div className="text-[10px] tabular-nums text-muted-foreground/80">{e.timeTaken}</div>
            <div
              className={cn(
                'mt-1.5 flex w-full flex-col items-center justify-center rounded-t-lg border border-b-0 pt-2',
                heights[pos],
                tones[pos]
              )}
            >
              <span className="text-lg font-bold tabular-nums">#{e.rank}</span>
              <span className="text-[11px] font-semibold tabular-nums">{e.score.toFixed(1)}</span>
              <span className="text-[10px] text-muted-foreground/80">{e.percentile.toFixed(1)}%ile</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const YouVsTopperTab: React.FC<{ analysis: FullAnalysis }> = ({ analysis }) => {
  const { topper } = analysis;
  const scoreGap = topper.score - analysis.score;
  const pctDiff = ((scoreGap / Math.max(1, topper.score)) * 100).toFixed(1);

  const metrics = [
    {
      icon: Percent,
      label: 'You beat',
      value: `${analysis.percentile.toFixed(1)}%`,
      hint: 'of all test takers',
    },
    {
      icon: Target,
      label: 'Accuracy gap',
      value: `${analysis.accuracy.toFixed(0)}% vs ${topper.accuracy.toFixed(0)}%`,
      hint: `${(topper.accuracy - analysis.accuracy).toFixed(1)} pts behind`,
    },
    {
      icon: Timer,
      label: 'Time gap',
      value: `${formatDuration(analysis.timeTakenSec)} vs ${formatDuration(topper.timeTakenSec)}`,
      hint: `${formatDuration(Math.abs(analysis.timeTakenSec - topper.timeTakenSec))} slower`,
    },
    {
      icon: Trophy,
      label: 'Score gap',
      value: `${scoreGap.toFixed(1)} marks`,
      hint: `${pctDiff}% behind rank #1`,
    },
  ];

  const recommendations = analysis.sections
    .map((s) => ({ name: s.name, diff: (topper.sectionScores[s.name] ?? s.score) - s.score }))
    .filter((r) => r.diff > 0)
    .sort((a, b) => b.diff - a.diff);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <MicroLabel className="text-primary/80">You</MicroLabel>
          <div className="mt-1.5 text-3xl font-bold tabular-nums">{analysis.score.toFixed(1)}</div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-foreground/80">
            <span>Rank <b className="tabular-nums">#{analysis.rank}</b></span>
            <span>Percentile <b className="tabular-nums">{analysis.percentile.toFixed(1)}%</b></span>
            <span>Accuracy <b className="tabular-nums">{analysis.accuracy.toFixed(0)}%</b></span>
          </div>
        </div>
        <div className="rounded-xl border border-gold/40 bg-gold-soft p-5">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-gold" />
            <MicroLabel className="text-gold">Topper — {topper.name}</MicroLabel>
          </div>
          <div className="mt-1.5 text-3xl font-bold tabular-nums text-gold">{topper.score.toFixed(1)}</div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-foreground/80">
            <span>Rank <b>#1</b></span>
            <span>Percentile <b className="tabular-nums">99.9%</b></span>
            <span>Accuracy <b className="tabular-nums">{topper.accuracy.toFixed(0)}%</b></span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-border/70 bg-surface p-4">
            <div className="flex items-center gap-2">
              <m.icon className="h-4 w-4 text-muted-foreground/80" />
              <MicroLabel>{m.label}</MicroLabel>
            </div>
            <div className="mt-1.5 text-base font-bold tabular-nums">{m.value}</div>
            <p className="mt-0.5 text-[11px] text-muted-foreground/80">{m.hint}</p>
          </div>
        ))}
      </div>

      <Panel title="Subject wise comparison">
        <div className="space-y-5">
          {analysis.sections.map((s) => {
            const t = topper.sectionScores[s.name] ?? s.score;
            const max = Math.max(s.maxScore, t);
            return (
              <div key={s.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">{s.name}</span>
                  <span className="tabular-nums text-muted-foreground/85">
                    <b className="text-primary">{s.score.toFixed(1)}</b> vs <b className="text-gold">{t.toFixed(1)}</b>
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-border/60">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(s.score / max) * 100}%` }} />
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-border/60">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${(t / max) * 100}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {recommendations.length > 0 && (
        <Panel title="What closes the gap">
          <ul className="space-y-2.5">
            {recommendations.map((r) => (
              <li key={r.name} className="flex items-start gap-3 rounded-lg bg-surface-muted px-3 py-2.5 text-sm">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  Score <b className="tabular-nums">{r.diff.toFixed(1)} more marks</b> in <b>{r.name}</b> to reach topper level.
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel title="Top 5 performers">
        <Podium analysis={analysis} />
        <div className="mt-6 space-y-1.5">
          {analysis.leaderboard.slice(5).map((e) => (
            <div key={e.rank} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-surface-muted">
              <span className="w-8 shrink-0 tabular-nums text-muted-foreground/80">#{e.rank}</span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-muted text-[11px] font-semibold">
                {e.initials}
              </span>
              <span className="min-w-0 flex-1 truncate">{e.name}</span>
              <span className="tabular-nums text-muted-foreground/80">{e.timeTaken}</span>
              <span className="w-14 text-right font-semibold tabular-nums">{e.score.toFixed(1)}</span>
            </div>
          ))}
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm">
            <span className="w-8 shrink-0 font-semibold tabular-nums text-primary">#{analysis.rank}</span>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
              YOU
            </span>
            <span className="min-w-0 flex-1 truncate font-semibold">Your position</span>
            <span className="tabular-nums text-muted-foreground/80">{formatDuration(analysis.timeTakenSec)}</span>
            <span className="w-14 text-right font-bold tabular-nums text-primary">{analysis.score.toFixed(1)}</span>
          </div>
        </div>
      </Panel>
    </div>
  );
};
