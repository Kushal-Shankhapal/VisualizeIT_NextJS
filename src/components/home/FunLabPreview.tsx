import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function FunLabPreview() {
  return (
    <Card className="bg-[#1e2325] border border-[var(--border-dark)]/50 shadow-[var(--shadow-float)] overflow-hidden h-full flex flex-col justify-between group" withVents>
      <div className="p-8 relative z-10">
        <Badge variant="accent" className="mb-4">Experimental</Badge>
        <h3 className="text-3xl font-sans font-bold text-white mb-3">The Fun Lab</h3>
        <p className="text-[var(--border-dark)] leading-relaxed mb-8 max-w-sm">
          A sandbox environment for uncapped algorithm testing. Stress test data structures, purposely create deadlocks, and break things safely.
        </p>
        <Link href="/fun-lab">
          <Button variant="primary">Enter Sandbox</Button>
        </Link>
      </div>

      {/* Decorative Warning Graphic */}
      <div className="h-48 w-full mt-auto relative bg-[#0f1416] flex items-center justify-center overflow-hidden border-t border-[rgba(255,107,129,0.2)]">
        {/* Warning Stripes */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 20px, #ff4757 20px, #ff4757 40px)' }}>
        </div>
        
        {/* Central Core */}
        <div className="relative w-24 h-24 rounded-full border border-[#ff4757]/40 flex items-center justify-center bg-[#0f1416] z-10 shadow-[0_0_30px_rgba(255,71,87,0.2)]">
          <div className="w-16 h-16 rounded-full border-2 border-[#ff4757] border-dashed animate-[spin_4s_linear_infinite] flex items-center justify-center absolute"></div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff4757] to-[#800f19] shadow-[0_0_20px_#ff4757] animate-pulse"></div>
        </div>
      </div>
    </Card>
  );
}
