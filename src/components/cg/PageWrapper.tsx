'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis();
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div
      className="cg-scope"
      style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        fontFamily: 'var(--font-inter), sans-serif',
        paddingTop: '90px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {children}
      </div>
    </div>
  );
}
