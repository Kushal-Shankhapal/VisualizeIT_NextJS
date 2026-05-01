'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Syne } from 'next/font/google';

const syne = Syne({ subsets: ['latin'], weight: ['700'] });

const CONCEPTS = [
  { label: 'The Grid', href: '/cg/unit-1/concept-grid' },
  { label: 'The Algorithms', href: '/cg/unit-1/concept-algorithms' },
];

const SIMULATORS = [
  { label: 'DDA', href: '/cg/unit-1/sim-dda' },
  { label: 'Bresenham Line', href: '/cg/unit-1/sim-bresenham-line' },
  { label: 'Line Comparator', href: '/cg/unit-1/sim-line-comparator' },
  { label: 'Bresenham Circle', href: '/cg/unit-1/sim-bresenham-circle' },
  { label: 'Midpoint Circle', href: '/cg/unit-1/sim-midpoint-circle' },
  { label: 'Circle Comparator', href: '/cg/unit-1/sim-circle-comparator' },
];

const GROUP_LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-jetbrains), monospace',
  fontSize: '10px',
  color: '#8a8a8a',
  letterSpacing: '0.12em',
  fontWeight: 600,
  marginBottom: '7px',
  textTransform: 'uppercase' as const,
};

export default function CGNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      {/* Scoped responsive styles — not relying on Tailwind class generation */}
      <style>{`
        .cg-nav-desktop { display: none; }
        .cg-hamburger   { display: flex;  }
        .cg-mobile-menu { display: block; }

        @media (min-width: 768px) {
          .cg-nav-desktop { display: flex;  }
          .cg-hamburger   { display: none;  }
        }
      `}</style>

      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'rgba(15,15,15,0.97)',
          borderBottom: '1px solid #2a2a2a',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 0', gap: '32px' }}>

            {/* Branding */}
            <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <span className={syne.className} style={{ fontSize: '16px', fontWeight: 700 }}>
                <span style={{ color: '#8a8a8a' }}>VisualizeIT</span>
                <span style={{ color: '#3a3a3a', margin: '0 8px' }}>/</span>
                <span style={{ color: '#7c6af7' }}>CG</span>
              </span>
            </Link>

            {/* Desktop nav groups */}
            <div
              className="cg-nav-desktop"
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'flex-start',
                gap: '48px',
              }}
            >
              <NavGroup label="CONCEPTS" links={CONCEPTS} pathname={pathname} />
              <NavGroup label="SIMULATORS" links={SIMULATORS} pathname={pathname} />
            </div>

            {/* Right side — always visible */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginLeft: 'auto', flexShrink: 0 }}>
              <span style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                color: '#22d3ee',
                border: '1px solid rgba(34,211,238,0.4)',
                borderRadius: '999px',
                padding: '3px 11px',
                whiteSpace: 'nowrap',
              }}>
                Unit I
              </span>

              {/* Hamburger */}
              <button
                className="cg-hamburger"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  flexDirection: 'column',
                  gap: '5px',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{
                    display: 'block',
                    width: '20px',
                    height: '2px',
                    background: '#f0ece4',
                    borderRadius: '2px',
                  }} />
                ))}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div
            className="cg-mobile-menu"
            style={{
              background: '#161616',
              borderTop: '1px solid #2a2a2a',
              padding: '20px 24px 24px',
            }}
          >
            <p style={GROUP_LABEL}>Concepts</p>
            {CONCEPTS.map(({ label, href }) => (
              <MobileNavLink key={href} href={href} label={label}
                active={pathname === href} onClose={() => setMobileOpen(false)} />
            ))}

            <p style={{ ...GROUP_LABEL, marginTop: '20px' }}>Simulators</p>
            {SIMULATORS.map(({ label, href }) => (
              <MobileNavLink key={href} href={href} label={label}
                active={pathname === href} onClose={() => setMobileOpen(false)} />
            ))}
          </div>
        )}
      </nav>
    </>
  );
}

function NavGroup({
  label,
  links,
  pathname,
}: {
  label: string;
  links: { label: string; href: string }[];
  pathname: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <p style={GROUP_LABEL}>{label}</p>
      <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', rowGap: '6px' }}>
        {links.map(({ label: text, href }) => (
          <DesktopNavLink key={href} href={href} label={text} active={pathname === href} />
        ))}
      </div>
    </div>
  );
}

function DesktopNavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-inter), sans-serif',
        fontSize: '13px',
        color: active ? '#22d3ee' : hovered ? '#7c6af7' : '#f0ece4',
        textDecoration: 'none',
        position: 'relative',
        paddingBottom: '3px',
        transition: 'color 200ms',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
      {active && (
        <span style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: '#22d3ee',
          borderRadius: '1px',
        }} />
      )}
    </Link>
  );
}

function MobileNavLink({
  href, label, active, onClose,
}: {
  href: string; label: string; active: boolean; onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      style={{
        display: 'block',
        fontFamily: 'var(--font-inter), sans-serif',
        fontSize: '14px',
        color: active ? '#22d3ee' : '#f0ece4',
        textDecoration: 'none',
        padding: '10px 0',
        borderBottom: '1px solid #2a2a2a',
      }}
    >
      {label}
    </Link>
  );
}
