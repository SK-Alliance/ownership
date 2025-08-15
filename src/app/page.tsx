'use client';

import HeroSection from '@/components/home/HeroSection';
import ProblemSolutionSection from '@/components/home/ProblemSolutionSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import WhatMakesItDifferentSection from '@/components/home/WhatMakesItDifferentSection';


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
