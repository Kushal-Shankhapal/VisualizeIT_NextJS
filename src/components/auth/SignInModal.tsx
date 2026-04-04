"use client"

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        // Auth.js returns the error message from authorize()
        setError(result.error === 'CredentialsSignin' 
          ? 'Invalid email or password' 
          : result.error
        );
      } else {
        onClose();
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[var(--bg)] rounded-[16px] p-10 shadow-[var(--shadow-float)] border border-[var(--border-light)] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-[var(--muted)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Logo Mark */}
          <div className="w-12 h-12 rounded-lg bg-[var(--accent)] flex items-center justify-center shadow-[var(--shadow-glow)] mb-8">
            <span className="text-[var(--accent-fg)] font-bold text-2xl font-mono leading-none pt-0.5">V</span>
          </div>

          <h2 className="text-2xl font-sans font-bold text-[var(--text)] mb-2">
            Sign in to VisualizeIT
          </h2>
          <p className="text-[var(--text-muted)] mb-8 text-sm">
            Access your bookmarked simulations and track your quiz progress across all engineering modules.
          </p>

          {/* Email + Password Form */}
          <form onSubmit={handleCredentialsSignIn} className="w-full space-y-4 text-left">
            {/* Error Display */}
            {error && (
              <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-xl px-4 py-3 text-sm text-[var(--accent)] font-semibold text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@example.com"
                className="w-full bg-[var(--bg)] text-[var(--text)] font-semibold px-4 py-3 rounded-xl border border-[var(--border-light)]/20 shadow-[var(--shadow-recessed)] outline-none focus:border-[var(--accent)]/50 focus:shadow-[0_0_0_2px_rgba(255,71,87,0.1)] transition-all placeholder:text-[var(--text-muted)]/30 text-sm"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter your password"
                className="w-full bg-[var(--bg)] text-[var(--text)] font-semibold px-4 py-3 rounded-xl border border-[var(--border-light)]/20 shadow-[var(--shadow-recessed)] outline-none focus:border-[var(--accent)]/50 focus:shadow-[0_0_0_2px_rgba(255,71,87,0.1)] transition-all placeholder:text-[var(--text-muted)]/30 text-sm"
                disabled={isLoading}
              />
            </div>

            <Button 
              variant="primary" 
              type="submit"
              className="w-full h-12 flex items-center justify-center gap-3 !px-0 text-sm uppercase tracking-widest font-extrabold"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6 w-full">
            <div className="h-[1px] bg-[var(--border-light)]/20 flex-1" />
            <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]/50 uppercase tracking-widest shrink-0">
              or
            </span>
            <div className="h-[1px] bg-[var(--border-light)]/20 flex-1" />
          </div>

          {/* Google Sign In */}
          <Button 
            variant="secondary" 
            className="w-full h-12 flex items-center justify-center gap-3 !px-0"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>
          
          {/* Register Link */}
          <div className="mt-6 w-full text-center">
            <p className="text-sm text-[var(--text-muted)]">
              New here?{' '}
              <Link 
                href="/register" 
                onClick={onClose}
                className="text-[var(--accent)] font-bold hover:underline"
              >
                Create an account →
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-[var(--border-light)] w-full">
            <p className="text-[10px] uppercase font-mono tracking-widest text-[var(--text-muted)]">
              Industrial Grade Education // Secure Access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
