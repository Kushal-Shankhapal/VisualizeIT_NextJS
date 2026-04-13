import React from 'react';
import { Button } from '@/components/ui/Button';
import simulationsData from '@/data/simulations.json';
import Link from 'next/link';
import SimCard from '@/components/simulations/SimCard';
import { Card } from '@/components/ui/Card';

export default function FeaturedSimulations() {
  const featured = simulationsData.slice(0, 5);

  return (
    <section id="featured" className="py-24 relative z-10">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">

        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <p className="text-xs font-mono text-[var(--accent)] uppercase tracking-[0.15em] mb-3">Curriculum Library</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Featured Simulations
            </h2>
          </div>
          <Link href="/simulations">
            <Button variant="secondary" className="px-6 text-xs uppercase tracking-widest">
              View All Modules
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((sim) => (
            <SimCard key={sim.id} simulation={sim as any} />
          ))}

          {/* 6th CTA slot */}
          <Link href="/simulations" className="block h-full group">
            <Card hoverable className="h-full min-h-[200px] border-[var(--border)] bg-[rgba(77,122,255,0.05)] flex flex-col items-start justify-end p-8 transition-all group-hover:bg-[rgba(77,122,255,0.08)]">
              <p className="text-xs font-mono text-[var(--accent)] uppercase tracking-widest mb-3">10+ modules available</p>
              <h3 className="text-xl font-bold text-white mb-2">Explore the Full Library</h3>
              <p className="text-sm text-[var(--text-muted)] mb-6">DSA, Operating Systems, DBMS — all curriculum-aligned for SE IT.</p>
              <div className="flex items-center gap-2 text-[var(--accent)] text-sm font-semibold">
                Browse all
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Card>
          </Link>
        </div>

      </div>
    </section>
  );
}
