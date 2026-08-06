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
  'Full Test': 'bg-primary/10 text-primary border-primary/25',
  'Live Test': 'bg-danger-soft text-danger border-danger/25',
  'Speed Test': 'bg-warning-soft text-warning border-warning/25',
  'Sectional Test': 'bg-neutralstate-soft text-foreground/70 border-border',
  Prelims: 'bg-primary/10 text-primary border-primary/25',
  Mains: 'bg-secondary/10 text-secondary border-secondary/25',
  PYQ: 'bg-gold-soft text-gold border-gold/30',
};

export const AnalysisHeader: React.FC<Props> = ({ analysis, variant, onClose, onOpenSolutions, onReview }) => (
  <div className="flex flex-col gap-3 border-b border-border/70 bg-surface px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
    <div className="flex min-w-0 items-start gap-3">
      {variant === 'page' && (
        <Button variant="ghost" size="icon" onClick={onClose} className="mt-0.5 h-8 w-8 shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      <div className="min-w-0">
        <MicroLabel>Test analysis</MicroLabel>
        <h1 className="truncate text-lg font-bold leading-tight text-foreground sm:text-xl">
          {analysis.testName}
        </h1>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
              typeTone[analysis.typeTag] || typeTone['Full Test']
            )}
          >
            {analysis.typeTag}
          </span>
          <span className="text-xs text-muted-foreground/80">{analysis.examFamily}</span>
          <span className="text-xs text-muted-foreground/60">•</span>
          <span className="text-xs text-muted-foreground/80">{analysis.date}</span>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <Button size="sm" onClick={onOpenSolutions} className="bg-success text-success-foreground hover:bg-success/90">
        <FileText className="mr-1.5 h-4 w-4" />
        Solutions
      </Button>
      <Button size="sm" variant="outline" onClick={onReview}>
        <ListChecks className="mr-1.5 h-4 w-4" />
        Review
      </Button>
      {variant === 'modal' && (
        <Button size="icon" variant="ghost" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  </div>
);
