import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import TestAnalysisView from '@/components/student/analysis/TestAnalysisView';
import type { TestAnalysisData } from '@/data/testAnalysisData';

interface TestAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisData: TestAnalysisData;
}

export const TestAnalysisModal: React.FC<TestAnalysisModalProps> = ({ isOpen, onClose, analysisData }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="h-[95vh] w-[96vw] max-w-[1400px] overflow-hidden p-0">
      <TestAnalysisView
        testId={analysisData?.testId}
        testName={analysisData?.testName}
        variant="modal"
        onClose={onClose}
      />
    </DialogContent>
  </Dialog>
);

export default TestAnalysisModal;
