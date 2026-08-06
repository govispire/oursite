import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { FullAnalysis } from '@/data/analysisEngine';
import { Panel, StatPill, MicroLabel, Rail, chartColors } from './primitives';
import { cn } from '@/lib/utils';
import { Lightbulb } from 'lucide-react';

export const OverviewTab: React.FC<{ analysis: FullAnalysis }> = ({ analysis }) => {
  const donut = [
    { name: 'Correct', value: analysis.correct, color: chartColors.success },
    { name: 'Incorrect', value: analysis.wrong, color: chartColors.danger },
    { name: 'Unattempted', value: analysis.skipped, color: chartColors.warning },
  ];

  const takeaway = (() => {
    const top = analysis.sections.reduce((a, b) => (a.accuracy > b.accuracy ? a : b));
    const low = analysis.sections.reduce((a, b) => (a.accuracy < b.accuracy ? a : b));
    return `Accuracy of ${analysis.accuracy.toFixed(1)}% puts you at rank #${analysis.rank.toLocaleString('en-IN')} — the top ${(100 - analysis.percentile).toFixed(1)}% of ${analysis.totalStudents.toLocaleString('en-IN')} aspirants. ${top.name} is carrying your score at ${top.accuracy.toFixed(0)}% accuracy, while ${low.name} at ${low.accuracy.toFixed(0)}% is where the next ${Math.max(2, Math.round(low.wrong * 0.8))} marks are hiding.`;
  })();

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatPill
          label="Attempted"
          value={`${analysis.attempted}`}
          hint={`${((analysis.attempted / analysis.totalQuestions) * 100).toFixed(0)}% of paper`}
        />
        <StatPill
          label="Negative marks"
          value={`−${analysis.negativeMarks.toFixed(2)}`}
          hint={`${analysis.wrong} wrong answers`}
          tone="danger"
        />
        <StatPill label="Net score" value={analysis.score.toFixed(1)} hint={`out of ${analysis.maxScore}`} tone="success" />
        <StatPill
          label="Accuracy"
          value={`${analysis.accuracy.toFixed(1)}%`}
          hint={`${analysis.correct}/${analysis.attempted} correct`}
          tone={analysis.accuracy >= 80 ? 'success' : analysis.accuracy >= 60 ? 'warning' : 'danger'}
        />
      </div>

      <Panel title="Section wise performance" bodyClassName="p-0 sm:p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left">
                {['Section', 'Attempted', 'Correct / Wrong', 'Skipped', 'Score', 'Rank', 'Percentile', 'Accuracy', 'Time'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {analysis.sections.map((s) => (
                <tr key={s.name} className="border-b border-border/40 last:border-0 hover:bg-surface-muted/70">
                  <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                  <td className="px-4 py-3 tabular-nums">{s.attempted}/{s.total}</td>
                  <td className="px-4 py-3 tabular-nums">
                    <span className="font-semibold text-success">{s.correct}</span>
                    <span className="mx-1 text-muted-foreground/50">/</span>
                    <span className="font-semibold text-danger">{s.wrong}</span>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground/90">{s.skipped}</td>
                  <td className="px-4 py-3 font-semibold tabular-nums">{s.score.toFixed(1)}<span className="text-muted-foreground/70">/{s.maxScore}</span></td>
                  <td className="px-4 py-3 tabular-nums">#{s.rank}</td>
                  <td className="px-4 py-3 tabular-nums">{s.percentile.toFixed(1)}%</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-11 tabular-nums">{s.accuracy.toFixed(0)}%</span>
                      <Rail
                        value={s.accuracy}
                        tone={s.accuracy >= 80 ? 'bg-success' : s.accuracy >= 60 ? 'bg-warning' : 'bg-danger'}
                        className="w-16"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground/90">{s.timeSpent}m</td>
                </tr>
              ))}
              <tr className="bg-surface-muted font-semibold">
                <td className="px-4 py-3">Overall</td>
                <td className="px-4 py-3 tabular-nums">{analysis.attempted}/{analysis.totalQuestions}</td>
                <td className="px-4 py-3 tabular-nums">
                  <span className="text-success">{analysis.correct}</span>
                  <span className="mx-1 text-muted-foreground/50">/</span>
                  <span className="text-danger">{analysis.wrong}</span>
                </td>
                <td className="px-4 py-3 tabular-nums">{analysis.skipped}</td>
                <td className="px-4 py-3 tabular-nums">{analysis.score.toFixed(1)}/{analysis.maxScore}</td>
                <td className="px-4 py-3 tabular-nums">#{analysis.rank}</td>
                <td className="px-4 py-3 tabular-nums">{analysis.percentile.toFixed(1)}%</td>
                <td className="px-4 py-3 tabular-nums">{analysis.accuracy.toFixed(0)}%</td>
                <td className="px-4 py-3 tabular-nums">{Math.round(analysis.timeTakenSec / 60)}m</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Question summary">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative h-[190px] w-[190px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donut} dataKey="value" innerRadius={62} outerRadius={88} paddingAngle={2} stroke="none">
                    {donut.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: '1px solid hsl(var(--border))',
                      background: 'hsl(var(--surface))',
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold tabular-nums">{analysis.totalQuestions}</span>
                <MicroLabel>Questions</MicroLabel>
              </div>
            </div>
            <ul className="w-full space-y-2.5">
              {donut.map((d) => (
                <li key={d.name} className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2">
                  <span className="flex items-center gap-2 text-sm">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
                    {d.name}
                  </span>
                  <span className="text-sm font-semibold tabular-nums">
                    {d.value}
                    <span className="ml-1.5 text-xs font-normal text-muted-foreground/80">
                      {((d.value / analysis.totalQuestions) * 100).toFixed(0)}%
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel title="Section wise time analysis" subtitle="Your pace against the ideal topper split">
          <div className="space-y-4">
            {analysis.sections.map((s) => {
              const delta = s.timeSpent - s.idealTime;
              const over = delta > 0;
              return (
                <div key={s.name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium">{s.name}</span>
                    <span className={cn('text-xs font-semibold tabular-nums', over ? 'text-danger' : 'text-success')}>
                      {over ? '+' : ''}
                      {delta} min
                    </span>
                  </div>
                  <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-border/60">
                    <div
                      className={cn('h-full rounded-full', over ? 'bg-danger/80' : 'bg-success/80')}
                      style={{ width: `${Math.min(100, (s.timeSpent / (s.idealTime * 1.6)) * 100)}%` }}
                    />
                    <div
                      className="absolute top-0 h-full w-px bg-foreground/50"
                      style={{ left: `${Math.min(100, (s.idealTime / (s.idealTime * 1.6)) * 100)}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[11px] text-muted-foreground/80">
                    <span>You {s.timeSpent}m</span>
                    <span>Ideal {s.idealTime}m</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <div className="flex gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <MicroLabel className="text-primary/80">Key takeaway</MicroLabel>
          <p className="mt-1 text-sm leading-relaxed text-foreground/85">{takeaway}</p>
        </div>
      </div>
    </div>
  );
};
