import React from 'react';
import { Badge } from '@/components/ui/Badge';

export default function FunLabPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center relative overflow-hidden bg-[#0f1416] text-[#ff4757]">
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #ff4757 10px, #ff4757 20px)' }}>
      </div>
      
      <div className="relative z-10 p-12 bg-[#1e2325] border-2 border-[#ff4757] rounded-3xl shadow-[0_0_50px_rgba(255,71,87,0.3)] max-w-lg mx-4">
        <Badge variant="accent" className="mb-6 animate-pulse">&gt; WARNING: SANDBOX ENGAGED</Badge>
        <h1 className="text-4xl lg:text-5xl font-sans mb-4 font-bold text-white shadow-sm">
          The <span className="text-[#ff4757]">Fun Lab</span>
        </h1>
        <p className="text-[var(--border-dark)] mb-8 font-medium leading-relaxed">
          Unrestricted simulation environment. Memory limits bypassed. Safety protocols disabled. 
        </p>
        <div className="font-mono text-xs text-white uppercase tracking-widest bg-[#ff4757]/20 py-3 px-6 rounded-lg inline-flex items-center gap-3 border border-[#ff4757]">
          <span>System booted in experimental mode</span>
        </div>
      </div>
    </div>
  );
}
