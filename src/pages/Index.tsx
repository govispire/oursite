
import React from 'react';
import LandingHeader from '@/components/LandingHeader';
import Hero from '@/components/Hero';
import FeatureSection from '@/components/FeatureSection';
import ExamCategorySection from '@/components/ExamCategorySection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="w-full min-h-screen">
      <LandingHeader />
      <main className="w-full">
        <Hero />
        <FeatureSection />
        <ExamCategorySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
