import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildRecommendations, type FullAnalysis, type StrengthLevel } from '@/data/analysisEngine';
import { Panel, MicroLabel, Rail, levelStyles } from './primitives';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search, Clock, Target } from 'lucide-react';


const LEVELS: { key: StrengthLevel; label: string; range: string }[] = [
  { key: 'strong', label: 'Strong', range: '80%+ accuracy' },
  { key: 'moderate', label: 'Moderate', range: '60–79% accuracy' },
  { key: 'weak', label: 'Weak', range: '40–59% accuracy' },
  { key: 'critical', label: 'Critical', range: 'Below 40% / unattempted' },
];

export const WeaknessPredictorTab: React.FC<{ analysis: FullAnalysis }> = ({ analysis }) => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState<string>('all');
  const [level, setLevel] = useState<StrengthLevel | 'all'>('all');
  const [query, setQuery] = useState('');
  const recommendations = useMemo(() => buildRecommendations(analysis), [analysis]);


  const counts = useMemo(
    () =>
      LEVELS.reduce<Record<string, number>>((acc, l) => {
        acc[l.key] = analysis.topics.filter((t) => t.level === l.key).length;
        return acc;
      }, {}),
    [analysis.topics]
  );

  const filtered = analysis.topics.filter(
    (t) =>
      (subject === 'all' || t.subject === subject) &&
      (level === 'all' || t.level === level) &&
      t.topic.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {LEVELS.map((l) => (
          <button
            key={l.key}
            onClick={() => setLevel(level === l.key ? 'all' : l.key)}
            className={cn(
              'rounded-xl border p-4 text-left transition-all',
              levelStyles[l.key].chip,
              level === l.key ? 'ring-2 ring-offset-1 ring-current/40' : 'hover:brightness-[0.98]'
            )}
          >
            <MicroLabel className={levelStyles[l.key].text}>{l.label}</MicroLabel>
            <div className={cn('mt-1 text-2xl font-bold tabular-nums', levelStyles[l.key].text)}>{counts[l.key] ?? 0}</div>
            <p className="mt-0.5 text-[11px] text-foreground/65">{l.range}</p>
          </button>
        ))}
      </div>

      <Panel
        title="Syllabus topic breakdown"
        subtitle={`${filtered.length} of ${analysis.topics.length} topics shown`}
        right={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search topic"
                className="h-8 w-40 pl-8 text-xs"
              />
            </div>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-8 rounded-md border border-border bg-surface px-2 text-xs"
            >
              <option value="all">All subjects</option>
              {analysis.sections.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as StrengthLevel | 'all')}
              className="h-8 rounded-md border border-border bg-surface px-2 text-xs"
            >
              <option value="all">All levels</option>
              {LEVELS.map((l) => (
                <option key={l.key} value={l.key}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        }
        bodyClassName="p-0 sm:p-0"
      >
        <div className="divide-y divide-border/50">
          {filtered.map((t) => (
            <div key={`${t.subject}-${t.topic}`} className="flex flex-wrap items-center gap-3 px-4 py-3 hover:bg-surface-muted/70 sm:px-5">
              <span className={cn('h-2 w-2 shrink-0 rounded-full', levelStyles[t.level].dot)} />
              <div className="min-w-[150px] flex-1">
                <div className="text-sm font-medium">{t.topic}</div>
                <div className="text-[11px] text-muted-foreground/80">{t.subject}</div>
              </div>
              <div className="w-28">
                <Rail
                  value={t.accuracy}
                  tone={
                    t.level === 'strong'
                      ? 'bg-success'
                      : t.level === 'moderate'
                      ? 'bg-warning'
                      : 'bg-danger'
                  }
                />
              </div>
              <span className="w-14 text-right text-sm font-semibold tabular-nums">{t.accuracy.toFixed(0)}%</span>
              <span className="w-16 text-right text-xs tabular-nums text-muted-foreground/85">
                {t.correct}/{t.total}
              </span>
              <span className="w-20 text-right text-xs tabular-nums text-muted-foreground/85">{t.avgTimePerQ}s / Q</span>
              <span className={cn('rounded-md border px-2 py-0.5 text-[10px] font-semibold', levelStyles[t.level].chip)}>
                {levelStyles[t.level].label}
              </span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground/80">No topics match these filters.</div>
          )}
        </div>
      </Panel>
    </div>
  );
};
