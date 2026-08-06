import React from 'react';
import type { FullAnalysis } from '@/data/analysisEngine';
import { Panel, MicroLabel } from './primitives';
import { cn } from '@/lib/utils';
import { ShieldCheck, AlertTriangle, XCircle } from 'lucide-react';

const ReadinessGauge: React.FC<{ value: number }> = ({ value }) => {
  const size = 220;
  const r = 88;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = 135;
  const sweep = 270;
  const polar = (angle: number, radius = r) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };
  const arc = (from: number, to: number) => {
    const a = polar(from);
    const b = polar(to);
    const large = to - from > 180 ? 1 : 0;
    return `M ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y}`;
  };
  const angleFor = (pct: number) => startAngle + (sweep * pct) / 100;
  const needle = polar(angleFor(value), r - 24);

  const zone =
    value >= 80
      ? { label: "You're Ready!", tone: 'text-success', icon: ShieldCheck }
      : value >= 60
      ? { label: 'Almost Ready', tone: 'text-warning', icon: AlertTriangle }
      : { label: 'Needs Improvement', tone: 'text-danger', icon: XCircle };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size - 20} viewBox={`0 0 ${size} ${size - 10}`}>
        <path d={arc(startAngle, angleFor(60))} stroke="hsl(var(--danger))" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.85} />
        <path d={arc(angleFor(60), angleFor(80))} stroke="hsl(var(--warning))" strokeWidth={14} fill="none" opacity={0.85} />
        <path d={arc(angleFor(80), angleFor(100))} stroke="hsl(var(--success))" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.85} />
        <line x1={cx} y1={cy} x2={needle.x} y2={needle.y} stroke="hsl(var(--foreground))" strokeWidth={3} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={6} fill="hsl(var(--foreground))" />
        <text x={cx} y={cy + 42} textAnchor="middle" className="fill-foreground" style={{ fontSize: 30, fontWeight: 700 }}>
          {value}%
        </text>
      </svg>
      <div className={cn('mt-1 flex items-center gap-2 text-base font-bold', zone.tone)}>
        <zone.icon className="h-5 w-5" />
        {zone.label}
      </div>
    </div>
  );
};

export const ExamReadinessTab: React.FC<{ analysis: FullAnalysis }> = ({ analysis }) => {
  const gap = analysis.score - analysis.overallCutoff;

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,340px)_1fr]">
        <Panel title="Readiness gauge">
          <ReadinessGauge value={analysis.readiness} />
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] font-semibold uppercase tracking-wider">
            <span className="rounded-md bg-danger-soft py-1 text-danger">0–60</span>
            <span className="rounded-md bg-warning-soft py-1 text-warning">60–80</span>
            <span className="rounded-md bg-success-soft py-1 text-success">80–100</span>
          </div>
        </Panel>

        <Panel title="Readiness snapshot" subtitle={`Benchmarked against ${analysis.examFamily} ${analysis.typeTag} standards`}>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border/70 bg-surface-muted p-4">
              <MicroLabel>Your score</MicroLabel>
              <div className="mt-1 text-2xl font-bold tabular-nums">{analysis.score.toFixed(1)}</div>
              <p className="text-[11px] text-muted-foreground/80">out of {analysis.maxScore}</p>
            </div>
            <div className="rounded-lg border border-border/70 bg-surface-muted p-4">
              <MicroLabel>Expected cutoff</MicroLabel>
              <div className="mt-1 text-2xl font-bold tabular-nums">{analysis.overallCutoff.toFixed(1)}</div>
              <p className="text-[11px] text-muted-foreground/80">previous year weighted</p>
            </div>
            <div
              className={cn(
                'rounded-lg border p-4',
                gap >= 0 ? 'border-success/30 bg-success-soft' : 'border-danger/30 bg-danger-soft'
              )}
            >
              <MicroLabel>Cutoff gap</MicroLabel>
              <div className={cn('mt-1 text-2xl font-bold tabular-nums', gap >= 0 ? 'text-success' : 'text-danger')}>
                {gap >= 0 ? '+' : ''}
                {gap.toFixed(1)}
              </div>
              <p className="text-[11px] text-foreground/70">{gap >= 0 ? 'marks above cutoff' : 'marks below cutoff'}</p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-foreground/80">
            {gap >= 0
              ? `You are clearing the expected cutoff with room to spare. Hold this pace and protect your accuracy — a single careless section can erase a ${gap.toFixed(1)} mark buffer.`
              : `You are ${Math.abs(gap).toFixed(1)} marks short of the expected cutoff. Converting your weakest section's wrong answers into correct ones is the fastest route across the line.`}
          </p>
        </Panel>
      </div>

      <Panel title="Sectional cutoff check" subtitle={`${analysis.examFamily} official sectional standards`} bodyClassName="p-0 sm:p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left">
                {['Section', 'Your score', 'Sectional cutoff', 'Margin', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {analysis.sections.map((s) => {
                const margin = s.score - s.cutoff;
                const state =
                  margin >= s.cutoff * 0.25
                    ? { label: 'Safe', cls: 'bg-success-soft text-success border-success/25' }
                    : margin >= 0
                    ? { label: 'Borderline', cls: 'bg-warning-soft text-warning border-warning/25' }
                    : { label: 'Below cutoff', cls: 'bg-danger-soft text-danger border-danger/25' };
                return (
                  <tr key={s.name} className="border-b border-border/40 last:border-0 hover:bg-surface-muted/70">
                    <td className="px-4 py-3 font-medium">{s.name}</td>
                    <td className="px-4 py-3 font-semibold tabular-nums">{s.score.toFixed(1)}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground/90">{s.cutoff.toFixed(2)}</td>
                    <td className={cn('px-4 py-3 font-semibold tabular-nums', margin >= 0 ? 'text-success' : 'text-danger')}>
                      {margin >= 0 ? '+' : ''}
                      {margin.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('rounded-md border px-2 py-1 text-[11px] font-semibold', state.cls)}>{state.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
};
