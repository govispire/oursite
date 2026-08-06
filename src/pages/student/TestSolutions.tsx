import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { buildSolutionBank, type SolutionStatus } from '@/data/solutionsData';
import {
  X, ChevronLeft, ChevronRight, Star, BookMarked, Flag, MessageSquare,
  Zap, Check, Clock, PanelRightClose, PanelRightOpen, Lightbulb, Target,
} from 'lucide-react';

type Filter = 'all' | SolutionStatus;

const statusTone: Record<SolutionStatus, { chip: string; label: string; palette: string }> = {
  correct: { chip: 'bg-success-soft text-success border-success/25', label: 'Correct', palette: 'bg-success text-success-foreground' },
  incorrect: { chip: 'bg-danger-soft text-danger border-danger/25', label: 'Incorrect', palette: 'bg-danger text-danger-foreground' },
  skipped: { chip: 'bg-neutralstate-soft text-foreground/70 border-border', label: 'Not Attempted', palette: 'bg-neutralstate text-neutralstate-foreground' },
};

const diffTone: Record<string, string> = {
  Easy: 'bg-success-soft text-success border-success/25',
  Medium: 'bg-warning-soft text-warning border-warning/25',
  Hard: 'bg-danger-soft text-danger border-danger/25',
};

const Chip: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <span className={cn('inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-muted px-2 py-1 text-[11px] font-semibold', className)}>
    {children}
  </span>
);

const TestSolutions: React.FC = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const bank = useMemo(() => buildSolutionBank(testId), [testId]);
  const key = bank.testId;

  const [section, setSection] = useLocalStorage<string>(`sol:${key}:section`, bank.sections[0]);
  const [filter, setFilter] = useLocalStorage<Filter>(`sol:${key}:filter`, (params.get('filter') as Filter) || 'all');
  const [currentId, setCurrentId] = useLocalStorage<number>(`sol:${key}:q`, bank.questions[0]?.id ?? 1);
  const [bookmarks, setBookmarks] = useLocalStorage<number[]>(`sol:${key}:bookmarks`, []);
  const [notebook, setNotebook] = useLocalStorage<number[]>(`sol:${key}:notebook`, []);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [paletteOpen, setPaletteOpen] = useState(true);

  const activeSection = bank.sections.includes(section) ? section : bank.sections[0];
  const sectionQuestions = bank.questions.filter((q) => q.section === activeSection);
  const visible = sectionQuestions.filter((q) => filter === 'all' || q.status === filter);
  const current = bank.questions.find((q) => q.id === currentId) || sectionQuestions[0];
  const set = current?.setId ? bank.sets[current.setId] : undefined;

  if (!current) return null;

  const idxInSection = sectionQuestions.findIndex((q) => q.id === current.id);
  const go = (delta: number) => {
    const next = sectionQuestions[idxInSection + delta];
    if (next) setCurrentId(next.id);
  };
  const jumpToFirstIncorrect = () => {
    const firstWrong = bank.questions.find((q) => q.status === 'incorrect');
    if (firstWrong) {
      setSection(firstWrong.section);
      setCurrentId(firstWrong.id);
    }
  };
  const toggle = (list: number[], setter: (v: number[]) => void, id: number) =>
    setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const speed =
    current.status === 'skipped'
      ? { label: 'Skipped', icon: Clock, tone: 'text-muted-foreground' }
      : current.yourTimeSec < current.avgTimeSec * 0.7
      ? { label: 'Superfast', icon: Zap, tone: 'text-success' }
      : current.yourTimeSec <= current.avgTimeSec * 1.15
      ? { label: 'On Time', icon: Check, tone: 'text-primary' }
      : { label: 'Slow', icon: Clock, tone: 'text-danger' };

  const options = lang === 'hi' ? current.optionsHi : current.options;

  const QuestionBody = (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Chip className={statusTone[current.status].chip}>{statusTone[current.status].label}</Chip>
        <Chip className={diffTone[current.difficulty]}>{current.difficulty}</Chip>
        <Chip>
          <Clock className="h-3 w-3" /> Your {current.yourTimeSec}s · Avg {current.avgTimeSec}s
        </Chip>
        <Chip className={current.marks ? 'text-success' : current.negative ? 'text-danger' : ''}>
          {current.marks ? `+${current.marks.toFixed(2)} mark` : current.negative ? `−${current.negative.toFixed(2)} mark` : '0 mark'}
        </Chip>
        <Chip>
          <Target className="h-3 w-3" /> {current.globalAccuracy}% got this right
        </Chip>
        <Chip className={speed.tone}>
          <speed.icon className="h-3 w-3" /> {speed.label}
        </Chip>
      </div>

      <div>
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
          Question {current.id} · {current.topic}
        </div>
        <p className="text-[15px] leading-relaxed text-foreground">
          {lang === 'hi' ? current.questionHi : current.question}
        </p>
      </div>

      <div className="space-y-2">
        {options.map((opt, i) => {
          const isCorrect = i === current.correctIndex;
          const isYours = i === current.chosenIndex;
          return (
            <div
              key={i}
              className={cn(
                'flex items-start gap-3 rounded-lg border px-3 py-2.5 text-sm',
                isCorrect
                  ? 'border-success/40 bg-success-soft'
                  : isYours
                  ? 'border-danger/40 bg-danger-soft'
                  : 'border-border/70 bg-surface-muted'
              )}
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-[11px] font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
              {isCorrect && <Check className="h-4 w-4 shrink-0 text-success" />}
              {isYours && !isCorrect && <X className="h-4 w-4 shrink-0 text-danger" />}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-border/70 bg-surface p-4">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
          <Lightbulb className="h-3.5 w-3.5" /> Step-by-step explanation
        </div>
        <ol className="space-y-2 text-sm leading-relaxed text-foreground/85">
          {current.explanation.map((step, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary/80">Key points</div>
          <ul className="list-disc space-y-1 pl-4 text-sm text-foreground/85">
            {current.keyPoints.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-warning/30 bg-warning-soft p-4">
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-warning">
            <Zap className="h-3.5 w-3.5" /> Shortcut tip
          </div>
          <p className="text-sm text-foreground/85">{current.shortcut}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => toggle(bookmarks, setBookmarks, current.id)}
          className={cn(bookmarks.includes(current.id) && 'border-gold/40 bg-gold-soft text-gold')}
        >
          <Star className="mr-1.5 h-4 w-4" /> {bookmarks.includes(current.id) ? 'Bookmarked' : 'Bookmark'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => toggle(notebook, setNotebook, current.id)}
          className={cn(notebook.includes(current.id) && 'border-danger/40 bg-danger-soft text-danger')}
        >
          <BookMarked className="mr-1.5 h-4 w-4" /> Mistake Notebook
        </Button>
        <Button size="sm" variant="outline">
          <Flag className="mr-1.5 h-4 w-4" /> Report Issue
        </Button>
        <Button size="sm" variant="outline">
          <MessageSquare className="mr-1.5 h-4 w-4" /> Discuss
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 bg-surface px-4 py-3">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
            Examerit · Review mode
          </div>
          <h1 className="truncate text-base font-bold">{bank.testName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as 'en' | 'hi')}
            className="h-8 rounded-md border border-border bg-surface px-2 text-xs"
          >
            <option value="en">View in English</option>
            <option value="hi">हिंदी में देखें</option>
          </select>
          <Button size="icon" variant="ghost" className="h-8 w-8 lg:hidden" onClick={() => setPaletteOpen((p) => !p)}>
            {paletteOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => navigate(-1)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex gap-1 overflow-x-auto border-b border-border/70 bg-surface px-4 py-2">
        {bank.sections.map((s) => (
          <button
            key={s}
            onClick={() => {
              setSection(s);
              const first = bank.questions.find((q) => q.section === s);
              if (first) setCurrentId(first.id);
            }}
            className={cn(
              'whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold',
              activeSection === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground/90 hover:bg-surface-muted'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1">
        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-5">
          {set ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <aside className="rounded-xl border border-border/70 bg-surface p-4 lg:sticky lg:top-0 lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto">
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
                  {set.title}
                </div>
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/85">{set.body}</p>
                {set.table && (
                  <table className="mt-3 w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/60">
                        {set.table.headers.map((h) => (
                          <th key={h} className="px-2 py-1.5 text-left font-semibold text-muted-foreground/80">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {set.table.rows.map((row, i) => (
                        <tr key={i} className="border-b border-border/40 last:border-0">
                          {row.map((cell, j) => (
                            <td key={j} className="px-2 py-1.5 tabular-nums">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </aside>
              <div>{QuestionBody}</div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl">{QuestionBody}</div>
          )}
        </main>

        {paletteOpen && (
          <aside className="hidden w-64 shrink-0 overflow-y-auto border-l border-border/70 bg-surface p-4 lg:block">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">Palette</span>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setPaletteOpen(false)}>
                <PanelRightClose className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="mb-3 grid grid-cols-2 gap-1">
              {(['all', 'correct', 'incorrect', 'skipped'] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'rounded-md border px-2 py-1 text-[11px] font-semibold capitalize',
                    filter === f ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground/90'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {visible.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentId(q.id)}
                  className={cn(
                    'flex h-8 items-center justify-center rounded-md text-xs font-semibold',
                    statusTone[q.status].palette,
                    q.id === current.id && 'ring-2 ring-foreground/60 ring-offset-1'
                  )}
                >
                  {q.id}
                </button>
              ))}
            </div>
          </aside>
        )}
      </div>

      <footer className="flex items-center justify-between gap-2 border-t border-border/70 bg-surface px-4 py-3">
        <Button variant="outline" size="sm" onClick={() => go(-1)} disabled={idxInSection <= 0}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Previous
        </Button>
        <Button variant="outline" size="sm" onClick={jumpToFirstIncorrect} className="border-danger/40 text-danger">
          Jump to first incorrect
        </Button>
        <Button size="sm" onClick={() => go(1)} disabled={idxInSection >= sectionQuestions.length - 1}>
          Next <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </footer>
    </div>
  );
};

export default TestSolutions;
