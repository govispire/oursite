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

  const donutLabel = (v: number) => `${((v / analysis.totalQuestions) * 100).toFixed(0)}%`;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatPill
          label="Attempted"
          value={`${analysis.attempted}`}
          hint={`${((analysis.attempted / analysis.totalQuestions) * 100).toFixed(0)}% of the paper`}
        />
        <StatPill
          label="Negative marks"
          value={`−${analysis.negativeMarks.toFixed(2)}`}
          hint={`${analysis.wrong} wrong answers`}
          tone="danger"
        />
        <StatPill label="Net score" value={analysis.score.toFixed(1)} hint={`out of ${analysis.maxScore}`} />
        <StatPill
          label="Accuracy"
          value={`${analysis.accuracy.toFixed(1)}%`}
          hint={`${analysis.correct} of ${analysis.attempted} correct`}
          tone={analysis.accuracy >= 80 ? 'success' : analysis.accuracy >= 60 ? 'warning' : 'danger'}
        />
      </div>

      <Panel title="Section wise performance" subtitle="Every section, ruled side by side" bodyClassName="px-0 sm:px-0 pb-2">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className="border-y border-border text-left">
                {['Section', 'Attempted', 'Correct / Wrong', 'Skipped', 'Score', 'Rank', 'Percentile', 'Accuracy', 'Time'].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={cn(
                        'px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground',
                        i > 0 && 'text-right'
                      )}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {analysis.sections.map((s) => (
                <tr key={s.name} className="border-b border-border/70 transition-colors last:border-0 hover:bg-surface-muted">
                  <td className="px-5 py-4 font-semibold text-foreground">{s.name}</td>
                  <td className="num px-5 py-4 text-right text-muted-foreground">
                    {s.attempted}/{s.total}
                  </td>
                  <td className="num px-5 py-4 text-right">
                    <span className="font-semibold text-success">{s.correct}</span>
                    <span className="mx-1 text-muted-foreground/50">/</span>
                    <span className="font-semibold text-danger">{s.wrong}</span>
                  </td>
                  <td className="num px-5 py-4 text-right text-muted-foreground">{s.skipped}</td>
                  <td className="num px-5 py-4 text-right font-semibold text-foreground">
                    {s.score.toFixed(1)}
                    <span className="font-normal text-muted-foreground">/{s.maxScore}</span>
                  </td>
                  <td className="num px-5 py-4 text-right text-muted-foreground">#{s.rank}</td>
                  <td className="num px-5 py-4 text-right text-muted-foreground">{s.percentile.toFixed(1)}%</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Rail
                        value={s.accuracy}
                        tone={s.accuracy >= 80 ? 'bg-success' : s.accuracy >= 60 ? 'bg-warning' : 'bg-danger'}
                        className="w-20"
                      />
                      <span className="num w-10 text-right font-semibold">{s.accuracy.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="num px-5 py-4 text-right text-muted-foreground">{s.timeSpent}m</td>
                </tr>
              ))}
              <tr className="border-t-2 border-border bg-surface-muted font-semibold">
                <td className="px-5 py-4">Overall</td>
                <td className="num px-5 py-4 text-right">
                  {analysis.attempted}/{analysis.totalQuestions}
                </td>
                <td className="num px-5 py-4 text-right">
                  <span className="text-success">{analysis.correct}</span>
                  <span className="mx-1 text-muted-foreground/50">/</span>
                  <span className="text-danger">{analysis.wrong}</span>
                </td>
                <td className="num px-5 py-4 text-right">{analysis.skipped}</td>
                <td className="num px-5 py-4 text-right">
                  {analysis.score.toFixed(1)}/{analysis.maxScore}
                </td>
                <td className="num px-5 py-4 text-right">#{analysis.rank}</td>
                <td className="num px-5 py-4 text-right">{analysis.percentile.toFixed(1)}%</td>
                <td className="num px-5 py-4 text-right">{analysis.accuracy.toFixed(0)}%</td>
                <td className="num px-5 py-4 text-right">{Math.round(analysis.timeTakenSec / 60)}m</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Question summary" subtitle="How the paper broke down">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
            <div className="relative h-[190px] w-[190px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donut} dataKey="value" innerRadius={74} outerRadius={90} paddingAngle={1.5} stroke="none">
                    {donut.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid hsl(var(--border))',
                      background: 'hsl(var(--surface))',
                      fontSize: 12,
                      boxShadow: '0 8px 24px rgba(16,24,40,0.08)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="num text-[28px] font-bold leading-none">{analysis.totalQuestions}</span>
                <MicroLabel className="mt-1.5">Questions</MicroLabel>
              </div>
            </div>
            <ul className="w-full divide-y divide-border">
              {donut.map((d) => (
                <li key={d.name} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <span className="flex items-center gap-2.5 text-sm text-foreground">
                    <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                    {d.name}
                  </span>
                  <span className="num text-sm font-semibold">
                    {d.value}
                    <span className="ml-2 font-normal text-muted-foreground">{donutLabel(d.value)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel title="Section wise time analysis" subtitle="Your pace against the ideal topper split">
          <div className="space-y-6">
            {analysis.sections.map((s) => {
              const delta = s.timeSpent - s.idealTime;
              const over = delta > 0;
              return (
                <div key={s.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-foreground">{s.name}</span>
                    <span className={cn('num text-xs font-bold', over ? 'text-danger' : 'text-success')}>
                      {over ? '+' : ''}
                      {delta} min
                    </span>
                  </div>
                  <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className={cn('h-full rounded-full transition-[width] duration-700', over ? 'bg-danger' : 'bg-success')}
                      style={{ width: `${Math.min(100, (s.timeSpent / (s.idealTime * 1.6)) * 100)}%` }}
                    />
                  </div>
                  <div
                    className="relative -mt-1.5 h-3"
                    aria-hidden
                  >
                    <span
                      className="absolute top-0 block h-3 w-px bg-foreground/40"
                      style={{ left: `${100 / 1.6}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[11.5px] text-muted-foreground">
                    <span>You {s.timeSpent}m</span>
                    <span>Ideal {s.idealTime}m</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <div className="flex gap-4 rounded-2xl border border-primary/20 bg-primary/[0.04] p-6">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <MicroLabel className="text-primary">Key takeaway</MicroLabel>
          <p className="mt-2 text-[15px] leading-relaxed text-foreground/85">{takeaway}</p>
        </div>
      </div>
    </div>
  );
};

