"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const INITIAL_ARRAY = [45, 80, 20, 95, 35, 70, 15, 60, 50, 85, 25, 55];

export default function Hero() {
  const [array, setArray] = useState([...INITIAL_ARRAY]);
  const [itIndex, setItIndex] = useState(0);
  const [innerIndex, setInnerIndex] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [isSorted, setIsSorted] = useState(false);
  const [totalSteps] = useState((INITIAL_ARRAY.length * (INITIAL_ARRAY.length - 1)) / 2);
  const [currentStep, setCurrentStep] = useState(0);

  // Animated stats
  const [modulesCount, setModulesCount] = useState(0);
  const [subjectsCount, setSubjectsCount] = useState(0);

  useEffect(() => {
    if (isSorted) {
      const t = setTimeout(() => {
        setArray([...INITIAL_ARRAY]);
        setItIndex(0); setInnerIndex(0);
        setComparisons(0); setSwaps(0);
        setIsSorted(false); setCurrentStep(0);
      }, 2500);
      return () => clearTimeout(t);
    }

    const interval = setInterval(() => {
      const n = array.length;
      const newArray = [...array];
      const i = itIndex;
      const j = innerIndex;

      if (i < n - 1) {
        setComparisons(p => p + 1);
        setCurrentStep(p => p + 1);
        if (newArray[j] > newArray[j + 1]) {
          [newArray[j], newArray[j + 1]] = [newArray[j + 1], newArray[j]];
          setSwaps(p => p + 1);
        }
        let nextJ = j + 1;
        let nextI = i;
        if (nextJ >= n - 1 - i) { nextJ = 0; nextI = i + 1; }
        if (nextI >= n - 1) setIsSorted(true);
        setArray(newArray);
        setInnerIndex(nextJ);
        setItIndex(nextI);
      }
    }, 380);

    return () => clearInterval(interval);
  }, [itIndex, innerIndex, array, isSorted]);
  useEffect(() => {
    // Stat animations run only on mount
    const delay = setTimeout(() => {
      let m = 0;
      const mInt = setInterval(() => { m += 1; setModulesCount(m); if (m >= 10) clearInterval(mInt); }, 40);
      let s = 0;
      const sInt = setInterval(() => { s += 1; setSubjectsCount(s); if (s >= 3) clearInterval(sInt); }, 150);
      return () => { clearInterval(mInt); clearInterval(sInt); };
    }, 300);
    return () => clearTimeout(delay);
  }, []);

  return (
    <section className="relative min-h-screen -mt-[68px] pt-[68px] flex items-center overflow-hidden">
      {/* Ambient background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_top_left,rgba(77,122,255,0.08)_0%,transparent_65%)]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,255,149,0.04)_0%,transparent_65%)]" />
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch" style={{ gridTemplateColumns: '55fr 45fr' }}>

          {/* Left: Copy */}
          {/* TWEAK ALIGNMENT HERE: Adjust 'lg:pl-12' (padding-left) to shift the text content more to the right */}
          <div className="relative z-10 flex flex-col items-start text-left justify-center lg:pl-12">
            <h1
              className="text-white font-extrabold leading-[1.07] tracking-tight mb-6"
              style={{ fontSize: 'clamp(3rem, 5.5vw, 6rem)' }}
            >
              Don&apos;t Just Think,<br />
              <span className="text-[var(--accent)]">VisualizeIT.</span>
            </h1>

            <p className="text-[var(--text-muted)] text-xl leading-relaxed mb-10 max-w-[540px]">
              Interactive simulations aligned with your engineering curriculum. Explore, experiment, and understand by doing, not just reading.
            </p>

            {/* Stat strip */}
            <div className="flex items-center gap-6 mb-10 w-full">
              {[
                { val: modulesCount >= 10 ? "10+" : modulesCount.toString(), label: "Active Modules" },
                { val: subjectsCount.toString(), label: "Core Subjects" },
                { val: "SE IT", label: "2024 Pattern" },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-xl font-bold text-[#00FF95] font-mono">{stat.val}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-4 pt-10 border-t border-white/[0.06] w-full">
              <Link href="/simulations">
                <Button variant="primary" className="px-7 h-12">
                  Start Exploring
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link href="#featured">
                <Button variant="secondary" className="px-7 h-12">
                  Browse Modules
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Live Sorting Visualizer */}
          {/* TWEAK ALIGNMENT HERE: Adjust 'lg:pr-12' (padding-right) to shift the sim box more to the left */}
          <div className="relative flex justify-center lg:justify-end items-stretch lg:pr-12">
            <div className="w-full max-w-[520px] rounded-2xl bg-[var(--surface)] border border-[var(--border-subtle)] p-5 shadow-[var(--shadow-float)] overflow-hidden flex flex-col">

              {/* Window chrome */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-[inset_0_-1px_1px_rgba(0,0,0,0.2)]" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E] shadow-[inset_0_-1px_1px_rgba(0,0,0,0.2)]" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840] shadow-[inset_0_-1px_1px_rgba(0,0,0,0.2)]" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-white/30 font-medium tracking-widest uppercase">
                    {isSorted ? 'Sorted ✓' : 'Sorting...'}
                  </span>
                  <div className={`w-1.5 h-1.5 rounded-full ${isSorted ? 'bg-[var(--green)]' : 'bg-[var(--accent)] animate-pulse'}`} />
                </div>
              </div>

              {/* Screen */}
              <div className="bg-[#030609] rounded-xl p-5 border border-white/[0.04] flex-1 flex flex-col">

                {/* Algorithm label */}
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-4">
                  Bubble Sort — Step {currentStep}/{totalSteps}
                </p>

                {/* Bars */}
                <div className="flex items-end gap-1 flex-1 min-h-[170px]">
                  {array.map((val, idx) => {
                    const isActive = idx === innerIndex || idx === innerIndex + 1;
                    const isFrozen = idx > array.length - 1 - itIndex;
                    return (
                      <div
                        key={idx}
                        className="flex-1 rounded-t-[2px] transition-all duration-300"
                        style={{
                          height: `${val}%`,
                          backgroundColor: isSorted ? '#00FF95' : isActive ? '#00FF95' : '#4D7AFF',
                          opacity: isSorted ? 1 : isFrozen ? 0.25 : 1,
                          boxShadow: isActive && !isSorted ? '0 0 10px rgba(0,255,149,0.5)' : 'none',
                        }}
                      />
                    );
                  })}
                </div>

                {/* Stats */}
                <div className="mt-auto pt-6">
                  {/* Comparing label */}
                  <div className="h-5 mb-4 flex justify-center">
                    {!isSorted && (
                      <p className="text-[10px] font-bold font-mono text-white/50 uppercase tracking-widest bg-[var(--accent)]/10 px-3 py-1 rounded inline-block">
                        Comparing elements {innerIndex} and {innerIndex + 1}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: comparisons.toString().padStart(2, '0'), label: "Comparisons" },
                    { val: swaps.toString().padStart(2, '0'), label: "Swaps" },
                    { val: "O(n²)", label: "Complexity" },
                  ].map(stat => (
                    <div key={stat.label} className="bg-[var(--surface)] border border-white/[0.04] rounded-lg p-2.5 text-center">
                      <span className="block font-mono text-base font-bold text-white mb-0.5">{stat.val}</span>
                      <span className="text-[8px] text-white/30 uppercase tracking-widest">{stat.label}</span>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div className="mt-2.5 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent)] transition-all duration-300"
                    style={{ width: `${Math.min((currentStep / totalSteps) * 100, 100)}%` }}
                  />
                </div>
                </div>
              </div>
            </div>

            {/* Glow beneath the card */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
