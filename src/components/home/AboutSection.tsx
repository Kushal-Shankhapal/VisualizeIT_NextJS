import React from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AboutSection() {
  const stats = [
    { val: "10+", label: "Simulations" },
    { val: "3",   label: "Subjects" },
    { val: "4",   label: "Branches" },
    { val: "Live", label: "Real-Time" },
  ];

  const tags = ["Real-time Interaction", "Curriculum Aligned", "KBTCOE SE IT"];

  return (
    <section className="relative bg-[var(--surface)] border-y border-[var(--border-subtle)] py-24">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Stats Panel */}
          <div className="bg-[var(--bg)] rounded-2xl border border-[var(--border-subtle)] p-8 relative">
            {/* Corner screws */}
            <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-[var(--surface-2)] border border-white/5" />
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[var(--surface-2)] border border-white/5" />
            <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-[var(--surface-2)] border border-white/5" />
            <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-[var(--surface-2)] border border-white/5" />

            <div className="flex items-center gap-2 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--green)] shadow-[0_0_8px_var(--green)]" />
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Platform Stats</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map(stat => (
                <div key={stat.label} className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl p-4">
                  <span className="block text-2xl font-bold text-white font-mono leading-none mb-1">{stat.val}</span>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="text-[10px] font-mono bg-[rgba(77,122,255,0.08)] text-[var(--accent)] border border-[var(--border-subtle)] px-2.5 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="text-xs font-mono text-[var(--accent)] uppercase tracking-[0.15em] mb-4">About the Platform</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-snug mb-6 tracking-tight">
              Engineering Concepts,<br />Reimagined
            </h2>
            <div className="space-y-4 text-[var(--text-muted)] text-base leading-relaxed">
              <p>
                VisualizeIT turns complex engineering topics into clean, interactive visuals — helping students understand faster, deeper, and smarter.
              </p>
              <p>
                No more struggling through dense theory or static diagrams. Every simulation responds in real time to your inputs, building genuine intuition — not just memorization.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-10">
              <Link href="/simulations">
                <Button variant="primary" className="px-7 h-11">Browse Modules</Button>
              </Link>
              <Link href="/about">
                <Button variant="secondary" className="px-7 h-11">Learn More</Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
