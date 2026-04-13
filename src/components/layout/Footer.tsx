import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border-subtle)] mt-0 relative z-20">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <Image src="/logo.png" alt="VisualizeIT" width={28} height={28} className="rounded object-contain" />
              <span className="font-mono font-bold text-lg tracking-tight text-white group-hover:text-[var(--accent)] transition-colors">
                VisualizeIT
              </span>
            </Link>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-sm">
              An educational engineering simulation platform for KBTCOE students. Learn complex concepts through interactive, curriculum-aligned visualizations.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Simulations", href: "/simulations" },
                { label: "Academics", href: "/academics" },
                { label: "Campus Explorer", href: "/campus" },
                { label: "Fun Lab", href: "/fun-lab" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", href: "/about" },
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} VisualizeIT. All rights reserved.
          </p>
          <p className="text-xs text-white/20 font-mono">
            SE IT · KBTCOE · 2024 Pattern
          </p>
        </div>
      </div>
    </footer>
  );
}
