import React, { useMemo, useState } from 'react';
import { buildAnalysis, previousTestIds, prettifyTestId, type FullAnalysis } from '@/data/analysisEngine';
import { Panel, MicroLabel } from './primitives';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

const Delta: React.FC<{ diff: number; suffix?: string; invert?: boolean }> = ({ diff, suffix = '', invert }) => {
  const better = invert ? diff < 0 : diff > 0;
  const same = Math.abs(diff) < 0.05;
  const Icon = same ? Minus : better ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-bold',
        same ? 'text-muted-foreground' : better ? 'text-success' : 'text-danger'
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {same ? 'no change' : `${diff > 0 ? '+' : ''}${diff.toFixed(1)}${suffix}`}
    </span>
  );
};

const rows = (a: FullAnalysis) => [
  { key: 'Score', value: a.score, display: `${a.score.toFixed(1)} / ${a.maxScore}`, suffix: '' },
  { key: 'Accuracy', value: a.accuracy, display: `${a.accuracy.toFixed(1)}%`, suffix: '%' },
  { key: 'Percentile', value: a.percentile, display: `${a.percentile.toFixed(1)}%`, suffix: '%' },
  { key: 'Rank', value: a.rank, display: `#${a.rank.toLocaleString('en-IN')}`, suffix: '', invert: true },
  { key: 'Attempted', value: a.attempted, display: `${a.attempted} / ${a.totalQuestions}`, suffix: '' },
  { key: 'Correct', value: a.correct, display: `${a.correct}`, suffix: '' },
  { key: 'Wrong', value: a.wrong, display: `${a.wrong}`, suffix: '', invert: true },
  { key: 'Time taken', value: Math.round(a.timeTakenSec / 60), display: `${Math.round(a.timeTakenSec / 60)}m`, suffix: 'm', invert: true },
];

export const ComparisonPanel: React.FC<{ analysis: FullAnalysis }> = ({ analysis }) => {
  const options = useMemo(() => previousTestIds(analysis.testId), [analysis.testId]);
  const [compareId, setCompareId] = useState(options[0]);
  const previous = useMemo(() => buildAnalysis(compareId), [compareId]);

  const current = rows(analysis);
  const prev = rows(previous);

  return (
    <Panel
      title="Comparison mode"
      subtitle="This attempt measured against a previous test"
      right={
        <div className="flex items-center gap-2">
          <label htmlFor="compare-test" className="text-xs text-muted-foreground">
            Compare with
          </label>
          <select
            id="compare-test"
            value={compareId}
            onChange={(e) => setCompareId(e.target.value)}
            className="h-8 max-w-[220px] rounded-md border border-border bg-surface px-2 text-xs"
          >
            {options.map((id) => (
              <option key={id} value={id}>
                {prettifyTestId(id)}
              </option>
            ))}
          </select>
        </div>
      }
      bodyClassName="px-0 sm:px-0 pb-2"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-sm">
          <caption className="sr-only">
            Side by side comparison between {analysis.testName} and {prettifyTestId(compareId)}
          </caption>
          <thead>
            <tr className="border-y border-border text-left">
              <th scope="col" className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Metric
              </th>
              <th scope="col" className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Previous · {prettifyTestId(compareId)}
              </th>
              <th scope="col" className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                Current · {analysis.testName}
              </th>
              <th scope="col" className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Change
              </th>
            </tr>
          </thead>
          <tbody>
            {current.map((r, i) => (
              <tr key={r.key} className="border-b border-border/70 last:border-0 hover:bg-surface-muted">
                <th scope="row" className="px-5 py-3.5 text-left font-semibold text-foreground">
                  {r.key}
                </th>
                <td className="num px-5 py-3.5 text-right text-muted-foreground">{prev[i].display}</td>
                <td className="num px-5 py-3.5 text-right font-semibold text-foreground">{r.display}</td>
                <td className="px-5 py-3.5 text-right">
                  <Delta diff={r.value - prev[i].value} suffix={r.suffix} invert={r.invert} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 px-5 pb-4 pt-5 sm:grid-cols-2 sm:px-7">
        {analysis.sections.map((s) => {
          const p = previous.sections.find((x) => x.name === s.name);
          if (!p) return null;
          const diff = s.accuracy - p.accuracy;
          return (
            <div key={s.name} className="rounded-xl border border-border bg-surface-muted px-4 py-3">
              <MicroLabel>{s.name}</MicroLabel>
              <div className="mt-1.5 flex items-baseline justify-between">
                <span className="num text-lg font-bold">{s.accuracy.toFixed(0)}%</span>
                <Delta diff={diff} suffix="%" />
              </div>
              <p className="mt-1 text-[11.5px] text-muted-foreground">Previously {p.accuracy.toFixed(0)}% accuracy</p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

export default ComparisonPanel;
