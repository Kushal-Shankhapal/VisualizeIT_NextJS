import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function FunLabPreview() {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl overflow-hidden h-full flex flex-col">
      <div className="p-8">
        <Badge variant="accent" className="mb-4">Experimental</Badge>
        <h3 className="text-2xl font-bold text-white mb-3">The Fun Lab</h3>
        <p className="text-[var(--text-muted)] leading-relaxed mb-6 max-w-sm">
          A sandbox environment for uncapped algorithm testing. Stress test data structures, create deadlocks, and break things safely.
        </p>
        <Link href="/fun-lab">
          <Button variant="secondary" className="h-10 px-6">Enter Sandbox</Button>
        </Link>
      </div>

      {/* Decorative Warning Graphic */}
      <div className="h-72 w-full mt-auto relative bg-[#030609] flex items-center justify-center overflow-hidden border-t border-white/[0.04]">
        {/* Warning Stripes */}
        <div className="absolute inset-0 opacity-10"
             style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 20px, var(--accent) 20px, var(--accent) 40px)' }}>
        </div>

        {/* Central Core */}
        <div className="relative w-20 h-20 rounded-full border border-[var(--accent)]/30 flex items-center justify-center bg-[#030609] z-10">
          <div className="w-14 h-14 rounded-full border-2 border-[var(--accent)] border-dashed animate-[spin_4s_linear_infinite] absolute"></div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[#1a3399] shadow-[0_0_30px_rgba(77,122,255,0.4)] animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
