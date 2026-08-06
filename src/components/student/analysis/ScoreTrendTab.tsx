import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import type { FullAnalysis } from '@/data/analysisEngine';
import { Panel, MicroLabel, chartColors } from './primitives';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type Metric = 'score' | 'rank' | 'accuracy';
const METRICS: { key: Metric; label: string }[] = [
  { key: 'score', label: 'Score' },
  { key: 'rank', label: 'Rank' },
  { key: 'accuracy', label: 'Accuracy' },
];
const RANGES = [5, 10, 15];

export const ScoreTrendTab: React.FC<{ analysis: FullAnalysis }> = ({ analysis }) => {
  const [metric, setMetric] = useState<Metric>('score');
  const [range, setRange] = useState(10);

  const data = useMemo(() => analysis.history.slice(-range), [analysis.history, range]);
  const values = data.map((d) => d[metric]);
  const first = values.slice(0, Math.ceil(values.length / 2));
  const last = values.slice(Math.ceil(values.length / 2));
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / Math.max(1, arr.length);
  const delta = avg(last) - avg(first);
  // For rank, lower is better.
  const improving = metric === 'rank' ? delta < -0.5 : delta > 0.5;
  const declining = metric === 'rank' ? delta > 0.5 : delta < -0.5;

  const verdict = improving
    ? { label: 'Improving', icon: TrendingUp, tone: 'text-success', chip: 'bg-success-soft border-success/25' }
    : declining
    ? { label: 'Declining', icon: TrendingDown, tone: 'text-danger', chip: 'bg-danger-soft border-danger/25' }
    : { label: 'Stable', icon: Minus, tone: 'text-warning', chip: 'bg-warning-soft border-warning/25' };

  const best = metric === 'rank' ? Math.min(...values) : Math.max(...values);
  const latest = values[values.length - 1];

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-border/70 bg-surface p-1">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
                metric === m.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground/90 hover:text-foreground'
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="inline-flex rounded-lg border border-border/70 bg-surface p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
                range === r ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground/90 hover:text-foreground'
              )}
            >
              Last {r}
            </button>
          ))}
        </div>
      </div>

      <Panel title={`${METRICS.find((m) => m.key === metric)?.label} trajectory`} subtitle={`Across your last ${range} tests`}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.28} />
                <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={chartColors.grid} strokeDasharray="2 6" vertical={false} />
            <XAxis dataKey="test" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: chartColors.muted }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              reversed={metric === 'rank'}
              tick={{ fontSize: 11, fill: chartColors.muted }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--surface))',
                fontSize: 12,
              }}
            />
            <ReferenceLine y={avg(values)} stroke={chartColors.neutral} strokeDasharray="4 4" />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={chartColors.primary}
              strokeWidth={2.5}
              fill="url(#trendFill)"
              dot={{ r: 3, fill: chartColors.primary, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className={cn('rounded-xl border p-4', verdict.chip)}>
          <MicroLabel>Trend</MicroLabel>
          <div className={cn('mt-1 flex items-center gap-2 text-xl font-bold', verdict.tone)}>
            <verdict.icon className="h-5 w-5" />
            {verdict.label}
          </div>
          <p className="mt-1 text-[11px] text-foreground/70">
            Recent half averages {Math.abs(delta).toFixed(1)} {metric === 'accuracy' ? 'pts' : metric === 'rank' ? 'ranks' : 'marks'}{' '}
            {delta > 0 ? 'higher' : 'lower'} than the earlier half.
          </p>
        </div>
        <div className="rounded-xl border border-border/70 bg-surface p-4">
          <MicroLabel>Best in range</MicroLabel>
          <div className="mt-1 text-xl font-bold tabular-nums">
            {metric === 'rank' ? `#${best}` : metric === 'accuracy' ? `${best.toFixed(1)}%` : best.toFixed(1)}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground/80">Your peak over the selected window.</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-surface p-4">
          <MicroLabel>Latest test</MicroLabel>
          <div className="mt-1 text-xl font-bold tabular-nums">
            {metric === 'rank' ? `#${latest}` : metric === 'accuracy' ? `${latest.toFixed(1)}%` : latest.toFixed(1)}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground/80">{analysis.testName}</p>
        </div>
      </div>
    </div>
  );
};
