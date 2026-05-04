'use client';

import { useState } from 'react';
import './toc-unit5.css';

import ProgressBar from './components/ProgressBar';
import SectionWrapper from './components/SectionWrapper';
import Section1Hook from './components/Section1Hook';
import Section2Tape from './components/Section2Tape';
import Section3States from './components/Section3States';
import Section4SevenTuple from './components/Section4SevenTuple';
import Section5Trace from './components/Section5Trace';
import Section6MachineLab from './components/Section6MachineLab';
import Section7BigPicture from './components/Section7BigPicture';

export default function TocUnit5Page() {
  const [unlocked, setUnlocked] = useState<boolean[]>([
    true,  // 0 — Section 1 (always visible)
    false, // 1 — Section 2
    false, // 2 — Section 3
    false, // 3 — Section 4
    false, // 4 — Section 5
    false, // 5 — Section 6
    false, // 6 — Section 7
  ]);

  const unlock = (index: number) => {
    setUnlocked((prev) => {
      if (prev[index]) return prev; // already unlocked
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  return (
    <div className="toc-page">
      {/* SEO */}
      <title>Turing Machines — Unit V | VisualizeIT</title>

      {/* Sticky progress bar */}
      <ProgressBar unlockedSections={unlocked} />

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 pb-24" aria-label="TOC Unit V — Turing Machines">

        {/* Section 1 — always visible */}
        <Section1Hook onUnlock={() => unlock(1)} />

        {/* Section 2 — Tape */}
        <SectionWrapper isUnlocked={unlocked[1]} sectionIndex={1} onUnlock={() => unlock(2)}>
          <Section2Tape onUnlock={() => unlock(2)} />
        </SectionWrapper>

        {/* Section 3 — States */}
        <SectionWrapper isUnlocked={unlocked[2]} sectionIndex={2} onUnlock={() => unlock(3)}>
          <Section3States isUnlocked={unlocked[2]} onUnlock={() => unlock(3)} />
        </SectionWrapper>

        {/* Section 4 — 7-Tuple */}
        <SectionWrapper isUnlocked={unlocked[3]} sectionIndex={3} onUnlock={() => unlock(4)}>
          <Section4SevenTuple onUnlock={() => unlock(4)} />
        </SectionWrapper>

        {/* Section 5 — Trace + Full Simulator */}
        <SectionWrapper isUnlocked={unlocked[4]} sectionIndex={4} onUnlock={() => unlock(5)}>
          <Section5Trace isUnlocked={unlocked[4]} onUnlock={() => unlock(5)} />
        </SectionWrapper>

        {/* Section 6 — Machine Lab */}
        <SectionWrapper isUnlocked={unlocked[5]} sectionIndex={5} onUnlock={() => unlock(6)}>
          <Section6MachineLab onUnlock={() => unlock(6)} />
        </SectionWrapper>

        {/* Section 7 — Big Picture */}
        <SectionWrapper isUnlocked={unlocked[6]} sectionIndex={6} onUnlock={() => {}}>
          <Section7BigPicture onUnlock={() => {}} />
        </SectionWrapper>

      </main>
    </div>
  );
}
