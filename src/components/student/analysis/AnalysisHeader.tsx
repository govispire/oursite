import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, ListChecks, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FullAnalysis } from '@/data/analysisEngine';
import { MicroLabel } from './primitives';

interface Props {
  analysis: FullAnalysis;
  variant: 'page' | 'modal';
  onClose?: () => void;
  onOpenSolutions: () => void;
  onReview: () => void;
}

const typeTone: Record<string, string> = {
  'Full Test': 'bg-primary/10 text-primary',
  'Live Test': 'bg-danger-soft text-danger',
  'Speed Test': 'bg-warning-soft text-warning',
  'Sectional Test': 'bg-neutralstate-soft text-foreground/70',
  Prelims: 'bg-primary/10 text-primary',
  Mains: 'bg-secondary/10 text-secondary',
  PYQ: 'bg-gold-soft text-gold',
};

export const AnalysisHeader: React.FC<Props> = ({ analysis, variant, onClose, onOpenSolutions, onReview }) => (
  <div className="border-b border-border bg-surface">
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 px-5 py-6 sm:px-8 sm:py-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        {variant === 'page' && (
          <Button variant="ghost" size="icon" aria-label="Go back" onClick={onClose} className="mt-1 h-8 w-8 shrink-0 rounded-full">
            <ArrowLeft className="h-4 w-4" aria-hidden />
          </Button>
        )}
        <div className="min-w-0">
          <MicroLabel>Test analysis</MicroLabel>
          <h1 className="mt-2 truncate text-2xl font-bold leading-tight text-foreground sm:text-[32px]">
            {analysis.testName}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-muted-foreground">
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]',
                typeTone[analysis.typeTag] || typeTone['Full Test']
              )}
            >
              {analysis.typeTag}
            </span>
            <span>{analysis.examFamily}</span>
            <span className="text-muted-foreground/50">·</span>
            <span>{analysis.date}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" onClick={onOpenSolutions} className="h-10 rounded-xl px-4">
          <FileText className="mr-1.5 h-4 w-4" />
          Solutions
        </Button>
        <Button size="sm" variant="outline" onClick={onReview} className="h-10 rounded-xl border-border px-4">
          <ListChecks className="mr-1.5 h-4 w-4" />
          Review
        </Button>
        {variant === 'modal' && (
          <Button size="icon" variant="ghost" aria-label="Close analysis" onClick={onClose} className="h-9 w-9 rounded-full">
            <X className="h-4 w-4" aria-hidden />
          </Button>
        )}
      </div>
    </div>
  </div>
);

