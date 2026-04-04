import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Led } from '@/components/ui/Led';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AboutSection() {
  return (
    <section className="bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Hardware Panel - Fixed Height */}
          <div className="bg-[var(--bg)] h-[280px] rounded-[30px] shadow-[var(--shadow-card)] p-5 relative flex flex-col justify-between">
            {/* Corner Screws */}
            <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-gradient-to-br from-[#c8cdd6] to-[#a8b1bc] shadow-inner" />
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br from-[#c8cdd6] to-[#a8b1bc] shadow-inner" />
            <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-gradient-to-br from-[#c8cdd6] to-[#a8b1bc] shadow-inner" />
            <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br from-[#c8cdd6] to-[#a8b1bc] shadow-inner" />

            {/* Header info */}
            <div className="flex items-center gap-3">
              <div className="flex gap-1 items-center">
                <div className="w-0.5 h-4 bg-[var(--border)] rounded-full" />
                <div className="w-0.5 h-4 bg-[var(--border)] rounded-full" />
                <div className="w-0.5 h-4 bg-[var(--border)] rounded-full" />
              </div>
              <Badge>System Stats</Badge>
              <Led color="yellow" />
            </div>

            {/* Stats Grid - Compressed */}
            <div className="grid grid-cols-2 gap-3 flex-1 my-4">
              <div className="bg-[var(--bg)] rounded-xl shadow-[var(--shadow-recessed)] p-3 flex flex-col justify-center text-center">
                <span className="text-2xl font-bold text-[var(--text)] font-mono leading-none">50+</span>
                <span className="text-[8px] text-[var(--text-muted)] uppercase tracking-wider mt-1">Simulations</span>
              </div>
              <div className="bg-[var(--bg)] rounded-xl shadow-[var(--shadow-recessed)] p-3 flex flex-col justify-center text-center">
                <span className="text-2xl font-bold text-[var(--text)] font-mono leading-none">08+</span>
                <span className="text-[8px] text-[var(--text-muted)] uppercase tracking-wider mt-1">Subjects</span>
              </div>
              <div className="bg-[var(--bg)] rounded-xl shadow-[var(--shadow-recessed)] p-3 flex flex-col justify-center text-center">
                <span className="text-2xl font-bold text-[var(--text)] font-mono leading-none">04</span>
                <span className="text-[8px] text-[var(--text-muted)] uppercase tracking-wider mt-1">Branches</span>
              </div>
              <div className="bg-[var(--bg)] rounded-xl shadow-[var(--shadow-recessed)] p-3 flex flex-col justify-center text-center">
                <span className="text-2xl font-bold text-[var(--accent)] font-mono leading-none">Real-Time</span>
                <span className="text-[8px] text-[var(--text-muted)] uppercase tracking-wider mt-1">Responses</span>
              </div>
            </div>

            {/* Feature Badges - Bottom */}
            <div className="flex flex-wrap gap-2">
              {['Real-time', 'Curriculum', 'Interactive'].map(tag => (
                <span key={tag} className="text-[8px] font-mono font-bold uppercase tracking-widest bg-[var(--muted)] px-2 py-0.5 rounded shadow-[var(--shadow-recessed)] opacity-70">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Text Content */}
          <div>
            <span className="text-[var(--accent)] font-mono text-xs uppercase tracking-[0.2em] font-bold block mb-4">
              // about.system
            </span>
            <h2 className="text-3xl lg:text-4xl font-sans text-[var(--text)] leading-snug mb-6">
              Engineering Concepts, <br />
              Reimagined
            </h2>
            <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
              <p>
                VisualizeIT turns complex engineering topics into clean, interactive visuals : helping students understand faster, deeper, and smarter.
              </p>
              <p>
                No more struggling through dense theory or static diagrams. Every simulation responds in real time to your inputs, letting you develop genuine intuition : not just memorization.
              </p>
            </div>
            <div className="flex gap-4 mt-10">
              <Link href="/simulations">
                <Button variant="primary">Browse Modules</Button>
              </Link>
              <Link href="/about">
                <Button variant="secondary">Learn More</Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
