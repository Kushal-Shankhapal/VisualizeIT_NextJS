import React from 'react';
import { Led } from '@/components/ui/Led';

export default function StatsBar() {
  const stats = [
    { label: 'Platform Readiness', value: '100%', detail: 'Curriculum Aligned', icon: <Led color="green" /> },
    { label: 'Active Modules', value: '50+', detail: 'Interactive Sims' },
    { label: 'Coverage', value: '4+', detail: 'Engineering Branches' },
    { label: 'Access Level', value: '24/7', detail: '100% Free' },
  ];

  return (
    <section className="relative z-20 py-6">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--dark-panel)] rounded-2xl px-6 py-4 shadow-[var(--shadow-card)] border border-[var(--border-dark)]/30 backdrop-blur-md">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-[var(--border-dark)]/20">
            {stats.map((stat, i) => (
              <div key={i} className={`flex flex-col ${i === 0 ? '' : 'pl-8'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {stat.icon}
                  <span className="font-mono text-[10px] text-[var(--border-dark)] tracking-widest uppercase font-bold">
                    {stat.label}
                  </span>
                </div>
                <div className="font-sans text-3xl font-bold text-[var(--bg)] tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="font-sans text-sm text-[var(--border-light)]/60 font-medium">
                  {stat.detail}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
