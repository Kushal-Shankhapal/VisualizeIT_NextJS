import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import simulationsData from '@/data/simulations.json';
import Link from 'next/link';
import SimCard from '@/components/simulations/SimCard';
import { Card } from '@/components/ui/Card';

export default function FeaturedSimulations() {
  // Show top 5 real simulations
  const featured = simulationsData.slice(0, 5);

  return (
    <section id="featured" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <Badge variant="recessed" className="mb-4">Top Modules</Badge>
            <h2 className="text-4xl lg:text-5xl font-sans text-[var(--text)] tracking-tight">
              Featured <span className="text-[var(--text-muted)]">Visualizations</span>
            </h2>
          </div>
          <Link href="/simulations">
            <Button variant="secondary" className="!px-8 font-bold text-xs uppercase tracking-widest">View Full Library</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((sim, i) => (
            <SimCard key={sim.id} simulation={sim as any} />
          ))}

          {/* 6th Slot: Accent CTA Card */}
          <Link href="/simulations" className="block h-full group">
            <Card hoverable className="h-full bg-[var(--accent)] border-none shadow-[var(--shadow-glow)] flex flex-col items-center justify-center text-center group-hover:brightness-110 !p-10 transition-all">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-6 shadow-inner backdrop-blur-sm">
                <svg className="w-10 h-10 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Explore Library</h3>
              <p className="text-white/80 font-medium text-sm">Browse 10+ complete engineering simulations for SE IT</p>
            </Card>
          </Link>
        </div>

      </div>
    </section>
  );
}
