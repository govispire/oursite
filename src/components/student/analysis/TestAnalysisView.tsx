import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Target, Users, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buildAnalysis, type FullAnalysis } from '@/data/analysisEngine';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AnalysisHeader } from './AnalysisHeader';
import { HeroMetricStrip } from './HeroMetricStrip';
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

  const openSolutions = () => navigate(`/student/test-solutions/${analysis.testId}`);
  const review = () => navigate(`/student/test-solutions/${analysis.testId}?filter=incorrect`);

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <AnalysisHeader analysis={analysis} variant={variant} onClose={onClose} onOpenSolutions={openSolutions} onReview={review} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[1400px] space-y-4 px-4 py-4 sm:px-6 sm:py-5">
          <HeroMetricStrip analysis={analysis} />

          <div className="sticky top-0 z-10 -mx-1 overflow-x-auto bg-background/95 px-1 py-2 backdrop-blur">
            <div className="inline-flex min-w-full gap-1 rounded-xl border border-border/70 bg-surface p-1 sm:min-w-0">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-sm',
                    activeTab === t.key
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground/90 hover:bg-surface-muted hover:text-foreground'
                  )}
                >
                  <t.icon className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{t.label}</span>
                  <span className="sm:hidden">{t.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="animate-fade-in pb-8">
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
