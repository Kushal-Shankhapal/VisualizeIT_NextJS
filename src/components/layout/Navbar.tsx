"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import SignInModal from '@/components/auth/SignInModal';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      { name: "Digital Logic & Computer Organization", code: "161302", href: "/subjects/dlco" },
      { name: "Discrete Mathematics", code: "161303", href: "/subjects/discrete-math" },
    ],
    sem4: [
      { name: "Operating Systems", code: "161401", href: "/subjects/operating-systems" },
      { name: "Database Management System", code: "161402", href: "/subjects/dbms" },
      { name: "Computer Graphics", code: "161403", href: "/subjects/computer-graphics" },
    ]
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[var(--bg)]/90 backdrop-blur-md shadow-[0_4px_16px_rgba(163,177,198,0.4)]' 
        : 'bg-[var(--bg)]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo ... */}
          
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-md bg-[var(--accent)] flex items-center justify-center shadow-[var(--shadow-glow)] group-focus-visible:ring-2">
              <span className="text-[var(--accent-fg)] font-bold text-lg font-mono leading-none pt-0.5">V</span>
            </div>
            <span className="font-mono font-bold text-xl tracking-tight text-[var(--text)]">
              VisualizeIT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group/nav-item">
                <Link 
                  href={link.href}
                  className="px-3 py-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors rounded-lg hover:bg-[var(--muted)] flex items-center gap-1"
                >
                  {link.label}
                  {link.isMegamenu && (
                    <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>

                {link.isMegamenu && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover/nav-item:opacity-100 group-hover/nav-item:visible transition-all duration-300">
                    <div className="bg-[var(--dark-panel)] rounded-2xl shadow-[var(--shadow-float)] border border-white/5 p-6 w-[500px] grid grid-cols-2 gap-8">
                      {/* Sem III */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1 h-3 bg-[var(--accent)] rounded-full" />
                          <span className="font-mono text-[9px] uppercase font-bold text-white/40 tracking-widest">Semester III</span>
                        </div>
                        <div className="space-y-1">
                          {subjects.sem3.map(sub => (
                            <Link 
                              key={sub.code} 
                              href={sub.href}
                              className="flex flex-col p-2.5 rounded-xl hover:bg-white/5 transition-all group/sub"
                            >
                              <span className="font-mono text-[8px] text-[var(--accent)] font-bold opacity-60">#{sub.code}</span>
                              <span className="text-xs font-bold text-white/80 group-hover/sub:text-[var(--accent)] transition-colors">{sub.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Sem IV */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1 h-3 bg-[var(--accent)] rounded-full" />
                          <span className="font-mono text-[9px] uppercase font-bold text-white/40 tracking-widest">Semester IV</span>
                        </div>
                        <div className="space-y-1">
                          {subjects.sem4.map(sub => (
                            <Link 
                              key={sub.code} 
                              href={sub.href}
                              className="flex flex-col p-2.5 rounded-xl hover:bg-white/5 transition-all group/sub"
                            >
                              <span className="font-mono text-[8px] text-[var(--accent)] font-bold opacity-60">#{sub.code}</span>
                              <span className="text-xs font-bold text-white/80 group-hover/sub:text-[var(--accent)] transition-colors">{sub.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-3 pl-4 border-l border-[var(--border-dark)]/20">
                <Link href="/dashboard" className="flex items-center gap-2 group">
                  {session.user?.image ? (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name || "User"} 
                      className="w-8 h-8 rounded-full border-2 border-[var(--border-dark)] shadow-[var(--shadow-card)] group-hover:border-[var(--accent)] transition-all"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[var(--muted)] flex items-center justify-center border-2 border-[var(--border-dark)] shadow-[var(--shadow-card)]">
                      <span className="text-xs font-bold text-[var(--text-muted)]">{session.user?.name?.charAt(0) || "U"}</span>
                    </div>
                  )}
                  <span className="text-sm font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    Dashboard
                  </span>
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--accent)] uppercase tracking-widest pl-2"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Button 
                variant="primary" 
                className="!min-h-[36px] !py-2 !px-4 text-sm"
                onClick={() => setIsSignInModalOpen(true)}
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[var(--bg)] shadow-[var(--shadow-card)] active:shadow-[var(--shadow-pressed)]"
            >
              <svg className="w-6 h-6 text-[var(--text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--bg)] border-t border-[var(--border-light)] shadow-[var(--shadow-card)] absolute w-full left-0 mt-0">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-bold text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--muted)]"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-6 pt-6 border-t border-[var(--border-dark)] flex flex-col gap-4">
              {session ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3">
                    <img 
                      src={session.user?.image || ""} 
                      alt="avatar" 
                      className="w-10 h-10 rounded-full border-2 border-[var(--border-dark)]" 
                    />
                    <div>
                      <div className="font-bold text-[var(--text)]">{session.user?.name}</div>
                      <div className="text-xs text-[var(--text-muted)]">View Dashboard</div>
                    </div>
                  </Link>
                  <Button variant="secondary" onClick={() => signOut({ callbackUrl: '/' })} className="w-full">Sign Out</Button>
                </>
              ) : (
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => setIsSignInModalOpen(true)}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)} 
      />
    </nav>
  );
}
