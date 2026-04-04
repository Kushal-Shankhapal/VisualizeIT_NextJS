"use client"

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import SimCard from '@/components/simulations/SimCard';
import simulationsData from '@/data/simulations.json';

interface SubjectPageProps {
  title: string;
  code: string;
  semester: number;
  description: string;
}

export default function SubjectPage({ title, code, semester, description }: SubjectPageProps) {
  const filteredSims = simulationsData.filter(sim => sim.subjectCode === code);

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Subject Header */}
        <div className="mb-16 relative">
          <div className="absolute -left-8 top-0 w-1 h-24 bg-gradient-to-b from-[var(--accent)] to-transparent rounded-full hidden lg:block" />
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Badge variant="recessed" className="font-mono text-xs py-1.5 px-4 border border-[var(--border-light)]/10 font-bold">#{code}</Badge>
            <Badge variant="accent" className="font-mono text-xs py-1.5 px-4 font-bold">SEM {semester === 3 ? 'III' : 'IV'}</Badge>
          </div>
          <h1 className="text-5xl lg:text-6xl font-sans text-[var(--text)] font-extrabold tracking-tight mb-6">
            {title}
          </h1>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl leading-relaxed font-medium">
            {description}
          </p>
        </div>

        {/* Simulations Section */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl font-bold text-[var(--text)] tracking-tight">Simulations for this Subject</h2>
            <div className="h-[1px] bg-[var(--border-light)]/10 flex-1" />
            <span className="font-mono text-xs text-[var(--text-muted)] font-bold tracking-widest uppercase">{filteredSims.length} Modules Active</span>
          </div>

          {filteredSims.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSims.map((sim) => (
                <SimCard key={sim.id} simulation={sim as any} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-[var(--dark-panel)] rounded-[32px] border border-white/5 border-dashed shadow-[var(--shadow-recessed)]">
              <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-6">
                 <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                 </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">No Simulations Found</h3>
              <p className="text-white/40 text-sm max-w-xs mx-auto">Visualizations for this subject are currently being calibrated and will be online soon.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
