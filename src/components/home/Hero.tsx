"use client"

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Led } from '@/components/ui/Led';

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

  useEffect(() => {
    if (isSorted) {
      const resetTimeout = setTimeout(() => {
        setArray([...INITIAL_ARRAY]);
        setItIndex(0);
        setInnerIndex(0);
        setComparisons(0);
        setSwaps(0);
        setIsSorted(false);
        setCurrentStep(0);
      }, 2000);
      return () => clearTimeout(resetTimeout);
    }

    const interval = setInterval(() => {
      let n = array.length;
      let newArray = [...array];
      let i = itIndex;
      let j = innerIndex;

      if (i < n - 1) {
        setComparisons(prev => prev + 1);
        setCurrentStep(prev => prev + 1);
        
        if (newArray[j] > newArray[j + 1]) {
          [newArray[j], newArray[j + 1]] = [newArray[j + 1], newArray[j]];
          setSwaps(prev => prev + 1);
        }

        let nextJ = j + 1;
        let nextI = i;

        if (nextJ >= n - 1 - i) {
          nextJ = 0;
          nextI = i + 1;
        }

        if (nextI >= n - 1) {
          setIsSorted(true);
        }

        setArray(newArray);
        setInnerIndex(nextJ);
        setItIndex(nextI);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [itIndex, innerIndex, array, isSorted]);

  return (
    <section className="hero relative overflow-hidden py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
          style={{ gridTemplateColumns: '55fr 45fr' }}
        >
          
          {/* Left: Text Content */}
          <div className="relative z-10 flex flex-col items-start text-left">
            <div className="flex items-center gap-3 mb-8">
              <Led color="red" pulsing={true} />
              <Badge variant="accent">Beta v1.0</Badge>
              <Badge>Engineering Simulations</Badge>
            </div>
            
            <h1 
              className="font-sans text-[var(--text)] mb-6 leading-[1.1] tracking-tight font-extrabold"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              Don&apos;t Just Think,<br />
              <span className="text-[var(--accent)]">VisualizeIT.</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-[var(--text-muted)] mb-10 max-w-xl leading-relaxed">
              Interactive simulations aligned with real engineering curricula. 
              Explore, experiment, and learn by doing: not just reading.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="#featured">
                <Button variant="primary" className="px-8 shadow-[var(--shadow-glow)]">
                  Start Exploring
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link href="/simulations">
                <Button variant="secondary" className="px-8 font-bold">
                  Explore Simulations
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Device Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div 
              className="w-full max-w-[420px] aspect-[4/5] rounded-[32px] bg-[#1a1f2e] p-5 relative overflow-hidden shadow-[20px_20px_40px_#babecc,-8px_-8px_20px_#ffffff,inset_0_0_0_3px_#0d1117] group transition-all"
            >
              {/* Carbon Fiber Background */}
              <div 
                className="absolute inset-0 rounded-[32px] pointer-events-none opacity-[0.07]"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 4px), repeating-linear-gradient(-45deg, #000 0, #000 2px, transparent 2px, transparent 4px)`
                }}
              />

              {/* Device Header */}
              <div className="flex items-center justify-between mb-4 px-2 relative z-10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-inner" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e] shadow-inner" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840] shadow-inner" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-white/50 font-bold tracking-widest uppercase">Sorting Visualizer : Active</span>
                  <div className="w-2 h-2 rounded-full bg-[#28c840] shadow-[0_0_10px_#28c840] animate-pulse" />
                </div>
              </div>

              {/* Screen Container */}
              <div className="relative h-[calc(100%-88px)] rounded-[20px] bg-[#0d1117] p-6 shadow-[inset_0_2px_20px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
                
                {/* CRT Scanline Overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none z-20 opacity-[0.15]"
                  style={{
                    background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%)',
                    backgroundSize: '100% 4px'
                  }}
                />

                {/* Simulation Label */}
                <span className="font-mono text-[10px] text-white/30 tracking-wider mb-6 block uppercase font-bold">
                  // BUBBLE_SORT.SIM : STEP {currentStep}/{totalSteps}
                </span>
                
                {/* Visualizer Area */}
                <div className="flex-1 flex items-end gap-1.5 mb-8 px-1 min-h-[140px]">
                  {array.map((val, idx) => (
                    <div 
                      key={idx}
                      className="flex-1 rounded-t-[2px] transition-all duration-300 relative group/bar"
                      style={{ 
                        height: `${val}%`, 
                        backgroundColor: (idx === innerIndex || idx === innerIndex + 1) ? 'var(--accent)' : '#a8b1bd',
                        boxShadow: (idx === innerIndex || idx === innerIndex + 1) ? '0 0 15px var(--accent)' : 'none',
                        opacity: isSorted ? 1 : (idx > array.length - 1 - itIndex ? 0.4 : 1)
                      }}
                    >
                      {isSorted && idx === 0 && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-[var(--accent)] font-bold animate-bounce">OK</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Comparing Label */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-[1px] bg-[var(--accent)]/30 flex-1" />
                  <span className="font-mono text-[9px] text-[var(--accent)] uppercase font-extrabold tracking-[0.2em]">Comparing</span>
                  <div className="h-[1px] bg-[var(--accent)]/30 flex-1" />
                </div>

                {/* Device Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-center shadow-[var(--shadow-recessed)]">
                    <span className="block font-mono text-xl font-bold text-white mb-1">{comparisons.toString().padStart(2, '0')}</span>
                    <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest font-bold">Comparisons</span>
                  </div>
                  <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-center shadow-[var(--shadow-recessed)]">
                    <span className="block font-mono text-xl font-bold text-white mb-1">{swaps.toString().padStart(2, '0')}</span>
                    <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest font-bold">Swaps</span>
                  </div>
                  <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-center shadow-[var(--shadow-recessed)]">
                    <span className="block font-mono text-xl font-bold text-[var(--accent)] mb-1">O(n²)</span>
                    <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest font-bold">Complexity</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-auto h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-red-600 shadow-[0_0_12px_#dc2626] transition-all duration-300" 
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              {/* Vent Slots Bottom */}
              <div className="mt-4 flex justify-between items-center px-2">
                <div className="flex gap-2.5">
                  <div className="w-10 h-1.5 bg-black/40 rounded-full shadow-inner" />
                  <div className="w-10 h-1.5 bg-black/40 rounded-full shadow-inner" />
                </div>
                <div className="flex gap-4">
                   <div className="w-4 h-4 rounded-full bg-black/60 shadow-inner flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                   </div>
                   <div className="w-4 h-4 rounded-full bg-black/60 shadow-inner flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                   </div>
                </div>
              </div>
            </div>

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-br from-[var(--accent)]/5 to-transparent rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
