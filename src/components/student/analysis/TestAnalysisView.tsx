import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Target, Users, Brain, GitCompareArrows } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buildAnalysis, type FullAnalysis } from '@/data/analysisEngine';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { AnalysisHeader } from './AnalysisHeader';
import { HeroMetricStrip } from './HeroMetricStrip';
import { ScoreCardBand } from './ScoreCardBand';
import { ComparisonPanel } from './ComparisonPanel';
import { OverviewTab } from './OverviewTab';
import { ScoreTrendTab } from './ScoreTrendTab';
import { ExamReadinessTab } from './ExamReadinessTab';
import { YouVsTopperTab } from './YouVsTopperTab';
import { WeaknessPredictorTab } from './WeaknessPredictorTab';

type TabKey = 'overview' | 'trend' | 'readiness' | 'topper' | 'weakness';

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'Overview', icon: BarChart3 },
  { key: 'trend', label: 'Score Trend', icon: TrendingUp },
  { key: 'readiness', label: 'Exam Readiness', icon: Target },
  { key: 'topper', label: 'You vs Topper', icon: Users },
  { key: 'weakness', label: 'Weakness Predictor', icon: Brain },
];

interface Props {
  testId?: string;
  testName?: string;
  analysis?: FullAnalysis;
  variant: 'page' | 'modal';
  onClose?: () => void;
}

export const TestAnalysisView: React.FC<Props> = ({ testId, testName, analysis: given, variant, onClose }) => {
  const navigate = useNavigate();
  const analysis = React.useMemo(() => given ?? buildAnalysis(testId, testName), [given, testId, testName]);
  const [activeTab, setActiveTab] = useLocalStorage<TabKey>(`analysis:${analysis.testId}:tab`, 'overview');
  const [compare, setCompare] = useLocalStorage<boolean>(`analysis:${analysis.testId}:compare`, false);
  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const openSolutions = () => navigate(`/student/test-solutions/${analysis.testId}`);
  const review = () => navigate(`/student/test-solutions/${analysis.testId}?filter=incorrect`);

  const onTabKeyDown = (e: React.KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.key === activeTab);
    let next = i;
    if (e.key === 'ArrowRight') next = (i + 1) % TABS.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + TABS.length) % TABS.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = TABS.length - 1;
    else return;
    e.preventDefault();
    setActiveTab(TABS[next].key);
    tabRefs.current[TABS[next].key]?.focus();
  };

  return (
    <div className="analysis-scope flex h-full min-h-0 flex-col bg-background text-foreground">
      <AnalysisHeader analysis={analysis} variant={variant} onClose={onClose} onOpenSolutions={openSolutions} onReview={review} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-7 sm:px-8 sm:py-9">
          <ScoreCardBand analysis={analysis} />

          <div className="mt-6">
            <HeroMetricStrip analysis={analysis} />
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              variant={compare ? 'default' : 'outline'}
              size="sm"
              aria-pressed={compare}
              onClick={() => setCompare(!compare)}
              className="h-9 rounded-xl"
            >
              <GitCompareArrows className="mr-1.5 h-4 w-4" aria-hidden />
              {compare ? 'Hide comparison' : 'Compare with previous test'}
            </Button>
          </div>

          {compare && (
            <div className="mt-4 animate-fade-in">
              <ComparisonPanel analysis={analysis} />
            </div>
          )}

          <div className="sticky top-0 z-10 mt-8 border-b border-border bg-background/95 backdrop-blur">
            <div
              role="tablist"
              aria-label="Test analysis sections"
              onKeyDown={onTabKeyDown}
              className="-mx-1 flex gap-6 overflow-x-auto px-1 sm:gap-8"
            >
              {TABS.map((t) => (
                <button
                  key={t.key}
                  ref={(el) => (tabRefs.current[t.key] = el)}
                  role="tab"
                  id={`analysis-tab-${t.key}`}
                  aria-selected={activeTab === t.key}
                  aria-controls={`analysis-panel-${t.key}`}
                  tabIndex={activeTab === t.key ? 0 : -1}
                  onClick={() => setActiveTab(t.key)}
                  className={cn(
                    'flex items-center gap-2 whitespace-nowrap border-b-2 pb-3.5 pt-1 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-sm',
                    activeTab === t.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  )}
                >
                  <t.icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="hidden sm:inline">{t.label}</span>
                  <span className="sm:hidden">{t.label.split(' ')[0]}</span>
                  <span className="sr-only sm:hidden">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div
            role="tabpanel"
            id={`analysis-panel-${activeTab}`}
            aria-labelledby={`analysis-tab-${activeTab}`}
            tabIndex={0}
            className="animate-fade-in pb-16 pt-7 focus-visible:outline-none"
          >
            {activeTab === 'overview' && <OverviewTab analysis={analysis} />}
            {activeTab === 'trend' && <ScoreTrendTab analysis={analysis} />}
            {activeTab === 'readiness' && <ExamReadinessTab analysis={analysis} />}
            {activeTab === 'topper' && <YouVsTopperTab analysis={analysis} />}
            {activeTab === 'weakness' && <WeaknessPredictorTab analysis={analysis} />}
          </div>
        </div>
      </div>
    </div>
  );
};


export default TestAnalysisView;

