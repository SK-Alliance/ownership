'use client';

import HeroSection from '@/components/HeroSection';
import ProblemSolutionSection from '@/components/ProblemSolutionSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import WhatMakesItDifferentSection from '@/components/WhatMakesItDifferentSection';


export default function Home() {
  return (
    <main className="min-h-screen bg-main">
      <HeroSection />
      <ProblemSolutionSection />
      <HowItWorksSection />
      <WhatMakesItDifferentSection />
    </main>
  );
}
