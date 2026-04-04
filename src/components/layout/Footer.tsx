import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--dark-panel)] border-t border-[var(--border-dark)] mt-20 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group inline-flex">
              <div className="w-8 h-8 rounded-md bg-[var(--accent)] flex items-center justify-center shadow-[var(--shadow-glow)]">
                <span className="text-[var(--accent-fg)] font-bold text-lg font-mono leading-none pt-0.5">V</span>
              </div>
              <span className="font-mono font-bold text-xl tracking-tight text-[var(--bg)]">
                VisualizeIT
              </span>
            </Link>
            <p className="text-[var(--border-light)]/70 text-sm max-w-sm mb-6">
              An educational engineering simulation platform built for students. Tactile learning through interactive visualizations.
            </p>
            <div className="font-mono text-[10px] text-[var(--border-dark)] tracking-widest uppercase">
              v1.0.0 // SYSTEM ACTIVE
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold text-[var(--border-light)] uppercase tracking-widest mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/simulations" className="text-[var(--border-light)]/70 hover:text-[var(--bg)] text-sm transition-colors">Simulations</Link></li>
              <li><Link href="/academics" className="text-[var(--border-light)]/70 hover:text-[var(--bg)] text-sm transition-colors">Academics</Link></li>
              <li><Link href="/campus" className="text-[var(--border-light)]/70 hover:text-[var(--bg)] text-sm transition-colors">Campus Explorer</Link></li>
              <li><Link href="/fun-lab" className="text-[var(--border-light)]/70 hover:text-[var(--bg)] text-sm transition-colors">Fun Lab</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold text-[var(--border-light)] uppercase tracking-widest mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-[var(--border-light)]/70 hover:text-[var(--bg)] text-sm transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-[var(--border-light)]/70 hover:text-[var(--bg)] text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-[var(--border-light)]/70 hover:text-[var(--bg)] text-sm transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-[var(--border-light)]/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--border-light)]/50 text-sm">
            © {new Date().getFullYear()} VisualizeIT. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Social mock links */}
            <div className="w-8 h-8 rounded-full bg-[var(--bg)]/10 flex items-center justify-center text-[var(--border-light)]/70 hover:text-[var(--bg)] hover:bg-[var(--bg)]/20 transition-all cursor-pointer">
              <span className="font-mono text-xs">GH</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[var(--bg)]/10 flex items-center justify-center text-[var(--border-light)]/70 hover:text-[var(--bg)] hover:bg-[var(--bg)]/20 transition-all cursor-pointer">
              <span className="font-mono text-xs">TW</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
