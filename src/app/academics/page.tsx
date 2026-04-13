import React from 'react';
import { Badge } from '@/components/ui/Badge';

export default function AcademicsPage() {
  return (
    <div className="py-24 relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <Badge variant="recessed" className="mb-6">&gt; Initializing System...</Badge>
      <h1 className="text-4xl lg:text-5xl font-sans text-[var(--text)] mb-4">
        Academics <span className="text-[var(--text-muted)]">Syllabus</span>
      </h1>
      <p className="text-[var(--text-muted)] max-w-lg mb-8">
        This portal allows mapping specific simulations directly to your university curriculum courses and semester timelines.
      </p>
      <div className="font-mono text-xs text-[var(--accent)] tracking-widest uppercase animate-pulse font-bold">
        Status: Under Construction
      </div>
    </div>
  );
}
