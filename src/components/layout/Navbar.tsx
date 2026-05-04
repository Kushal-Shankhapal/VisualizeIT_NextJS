"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import SignInModal from '@/components/auth/SignInModal';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const close = () => setMobileMenuOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Simulations", href: "/simulations" },
    { label: "Subjects", href: "#", isMegamenu: true },
    { label: "Academics", href: "/academics" },
    { label: "Explore Campus", href: "/campus" },
    { label: "Fun Lab", href: "/fun-lab" },
    { label: "About", href: "/about" },
  ];

  const subjects = {
    sem3: [
      { name: "Data Structures", code: "161301", href: "/subjects/data-structures" },
      { name: "Digital Logic & Computer Org.", code: "161302", href: "/subjects/dlco" },
      { name: "Discrete Mathematics", code: "161303", href: "/subjects/discrete-math" },
    ],
    sem4: [
      { name: "Operating Systems", code: "161401", href: "/subjects/operating-systems" },
      { name: "Database Management System", code: "161402", href: "/subjects/dbms" },
      { name: "Computer Graphics", code: "161403", href: "/subjects/computer-graphics" },
    ],
    sem5: [
      { name: "Theory of Computation", code: "314441", href: "/subjects/theory-of-computation" },
    ]
  };

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-[#050508]/85 backdrop-blur-xl border-[rgba(77,122,255,0.12)] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent border-transparent'
      }`}>
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-[68px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <Image
                src="/logo.png"
                alt="VisualizeIT"
                width={32}
                height={32}
                className="rounded object-contain"
              />
              <span className="font-mono font-bold text-lg tracking-tight text-white group-hover:text-[var(--accent)] transition-colors">
                VisualizeIT
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) =>
                link.isMegamenu ? (
                  <div key={link.label} className="relative group/nav">
                    <button className="px-3 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-1">
                      {link.label}
                      <svg className="w-3.5 h-3.5 opacity-50 transition-transform group-hover/nav:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Mega menu */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200">
                      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-[var(--shadow-float)] p-5 w-[640px] grid grid-cols-3 gap-6">
                        {(['sem3', 'sem4', 'sem5'] as const).map((sem) => (
                          <div key={sem}>
                            <p className="text-[10px] font-mono font-bold text-[var(--accent)] uppercase tracking-[0.15em] mb-3">
                              Semester {sem === 'sem3' ? 'III' : sem === 'sem4' ? 'IV' : 'V'}
                            </p>
                            <div className="space-y-1">
                              {subjects[sem].map(sub => (
                                <Link
                                  key={sub.code}
                                  href={sub.href}
                                  className="flex flex-col p-2.5 rounded-lg hover:bg-white/[0.05] transition-all group/sub"
                                >
                                  <span className="text-[9px] font-mono text-[var(--accent)]/50 mb-0.5">#{sub.code}</span>
                                  <span className="text-sm font-medium text-white/80 group-hover/sub:text-white transition-colors">{sub.name}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="px-3 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-3">
              {session ? (
                <div className="flex items-center gap-3">
                  <Link href="/dashboard" className="flex items-center gap-2.5 group">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-8 h-8 rounded-full border border-[var(--border)] group-hover:border-[var(--accent)] transition-all"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center">
                        <span className="text-xs font-bold text-[var(--accent)]">{session.user?.name?.charAt(0) || "U"}</span>
                      </div>
                    )}
                    <span className="text-sm font-semibold text-[var(--text-muted)] group-hover:text-white transition-colors">
                      Dashboard
                    </span>
                  </Link>
                  <div className="w-px h-4 bg-white/10" />
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-xs font-medium text-white/30 hover:text-white/70 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Button variant="primary" className="!min-h-[38px] !py-2 !px-5 text-xs" onClick={() => setIsSignInModalOpen(true)}>
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(!mobileMenuOpen); }}
              className="md:hidden p-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border)] transition-all"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div
            className="md:hidden absolute w-full left-0 top-full bg-[var(--surface)] border-t border-[var(--border-subtle)] border-b border-b-[var(--border)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-6 space-y-1">
              {navLinks.filter(l => !l.isMegamenu).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-3 text-base font-medium text-[var(--text-muted)] hover:text-white transition-colors border-b border-white/[0.04] last:border-b-0"
                >
                  {link.label}
                </Link>
              ))}

              {/* Subjects accordion in mobile */}
              <div>
                <button
                  onClick={() => setSubjectsOpen(!subjectsOpen)}
                  className="w-full flex items-center justify-between px-3 py-3 text-base font-medium text-[var(--text-muted)] border-b border-white/[0.04]"
                >
                  Subjects
                  <svg className={`w-4 h-4 transition-transform ${subjectsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {subjectsOpen && (
                  <div className="px-3 pb-3 pt-1 space-y-4">
                    {(['sem3', 'sem4', 'sem5'] as const).map(sem => (
                      <div key={sem}>
                        <p className="text-[9px] font-mono font-bold text-[var(--accent)] uppercase tracking-[0.15em] mb-2">
                          Semester {sem === 'sem3' ? 'III' : sem === 'sem4' ? 'IV' : 'V'}
                        </p>
                        {subjects[sem].map(sub => (
                          <Link key={sub.code} href={sub.href} onClick={() => setMobileMenuOpen(false)}
                            className="block py-1.5 text-sm text-white/70 hover:text-white">
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/[0.06]">
                {session ? (
                  <div className="space-y-3">
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2">
                      <img src={session.user?.image || ""} alt="avatar" className="w-9 h-9 rounded-full border border-[var(--border)]" />
                      <div>
                        <div className="font-semibold text-white text-sm">{session.user?.name}</div>
                        <div className="text-xs text-[var(--text-muted)]">View Dashboard</div>
                      </div>
                    </Link>
                    <Button variant="secondary" onClick={() => signOut({ callbackUrl: '/' })} className="w-full">Sign Out</Button>
                  </div>
                ) : (
                  <Button variant="primary" className="w-full" onClick={() => { setIsSignInModalOpen(true); setMobileMenuOpen(false); }}>
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
    </>
  );
}
