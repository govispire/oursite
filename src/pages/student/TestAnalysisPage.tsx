import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TestAnalysisView from '@/components/student/analysis/TestAnalysisView';

const TestAnalysisPage: React.FC = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  return (
    <div className="-m-4 h-[calc(100vh-4rem)] sm:-m-6">
      <TestAnalysisView testId={testId} variant="page" onClose={() => navigate(-1)} />
    </div>
  );
};

export default TestAnalysisPage;
