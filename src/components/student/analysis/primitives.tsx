import React from 'react';
import { cn } from '@/lib/utils';
import type { StrengthLevel } from '@/data/analysisEngine';

/** Shared visual primitives for the analysis surfaces. */

export const levelStyles: Record<StrengthLevel, { label: string; chip: string; dot: string; text: string }> = {
  strong: {
    label: 'Strong',
    chip: 'bg-success-soft text-success border-success/25',
    dot: 'bg-success',
    text: 'text-success',
  },
  moderate: {
    label: 'Moderate',
    chip: 'bg-warning-soft text-warning border-warning/25',
    dot: 'bg-warning',
    text: 'text-warning',
  },
  weak: {
    label: 'Weak',
    chip: 'bg-danger-soft text-danger border-danger/20',
    dot: 'bg-danger/70',
    text: 'text-danger',
  },
  critical: {
    label: 'Critical',
    chip: 'bg-danger-soft text-danger border-danger/40',
    dot: 'bg-danger',
    text: 'text-danger',
  },
};

export const Panel: React.FC<{
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, right, className, bodyClassName, children }) => (
  <section
    className={cn(
      'rounded-xl border border-border/70 bg-surface shadow-[0_1px_2px_rgba(15,23,42,0.04)]',
      className
    )}
  >
    {(title || right) && (
      <header className="flex items-start justify-between gap-3 border-b border-border/60 px-4 py-3 sm:px-5 sm:py-4">
        <div className="min-w-0">
          {title && (
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80">
              {title}
            </h3>
          )}
          {subtitle && <p className="mt-1 text-sm text-foreground/70">{subtitle}</p>}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </header>
    )}
    <div className={cn('p-4 sm:p-5', bodyClassName)}>{children}</div>
  </section>
);

export const MicroLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <span className={cn('text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80', className)}>
    {children}
  </span>
);

export const StatPill: React.FC<{
  label: string;
  value: string;
  hint?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
}> = ({ label, value, hint, tone = 'default' }) => {
  const toneText =
    tone === 'success'
      ? 'text-success'
      : tone === 'warning'
      ? 'text-warning'
      : tone === 'danger'
      ? 'text-danger'
      : 'text-foreground';
  return (
    <div className="rounded-lg border border-border/70 bg-surface-muted px-3 py-2.5">
      <MicroLabel>{label}</MicroLabel>
      <div className={cn('mt-1 text-lg font-bold tabular-nums leading-none', toneText)}>{value}</div>
      {hint && <div className="mt-1 text-[11px] text-muted-foreground/80">{hint}</div>}
    </div>
  );
};

export const Rail: React.FC<{ value: number; tone?: string; className?: string }> = ({
  value,
  tone = 'bg-primary',
  className,
}) => (
  <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-border/70', className)}>
    <div
      className={cn('h-full rounded-full transition-[width] duration-700 ease-out', tone)}
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
    />
  </div>
);

/** Animated count-up used by the hero metrics. */
export const useCountUp = (target: number, duration = 700) => {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setValue(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
};

export const chartColors = {
  primary: 'hsl(var(--primary))',
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  danger: 'hsl(var(--danger))',
  neutral: 'hsl(var(--neutralstate))',
  gold: 'hsl(var(--gold))',
  grid: 'hsl(var(--border))',
  muted: 'hsl(var(--muted-foreground))',
};
