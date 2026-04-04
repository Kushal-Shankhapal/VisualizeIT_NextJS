"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      // Success — redirect to home page (user can sign in from there)
      router.push('/?registered=true');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-[var(--shadow-glow)] mx-auto mb-6">
            <span className="text-[var(--accent-fg)] font-bold text-3xl font-mono leading-none pt-0.5">V</span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--text)] tracking-tight mb-2">
            Create Account
          </h1>
          <p className="text-[var(--text-muted)] text-sm">
            Join VisualizeIT to track your progress and unlock all features.
          </p>
        </div>

        <Card className="!p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Display */}
            {error && (
              <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-xl px-4 py-3 text-sm text-[var(--accent)] font-semibold">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Kushal Shankhapal"
                className="w-full bg-[var(--bg)] text-[var(--text)] font-semibold px-4 py-3 rounded-xl border border-[var(--border-light)]/20 shadow-[var(--shadow-recessed)] outline-none focus:border-[var(--accent)]/50 focus:shadow-[0_0_0_2px_rgba(255,71,87,0.1)] transition-all placeholder:text-[var(--text-muted)]/30"
                disabled={isLoading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-[var(--bg)] text-[var(--text)] font-semibold px-4 py-3 rounded-xl border border-[var(--border-light)]/20 shadow-[var(--shadow-recessed)] outline-none focus:border-[var(--accent)]/50 focus:shadow-[0_0_0_2px_rgba(255,71,87,0.1)] transition-all placeholder:text-[var(--text-muted)]/30"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                className="w-full bg-[var(--bg)] text-[var(--text)] font-semibold px-4 py-3 rounded-xl border border-[var(--border-light)]/20 shadow-[var(--shadow-recessed)] outline-none focus:border-[var(--accent)]/50 focus:shadow-[0_0_0_2px_rgba(255,71,87,0.1)] transition-all placeholder:text-[var(--text-muted)]/30"
                disabled={isLoading}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="w-full bg-[var(--bg)] text-[var(--text)] font-semibold px-4 py-3 rounded-xl border border-[var(--border-light)]/20 shadow-[var(--shadow-recessed)] outline-none focus:border-[var(--accent)]/50 focus:shadow-[0_0_0_2px_rgba(255,71,87,0.1)] transition-all placeholder:text-[var(--text-muted)]/30"
                disabled={isLoading}
              />
            </div>

            {/* Submit */}
            <Button 
              variant="primary" 
              type="submit"
              className="w-full h-12 text-sm uppercase tracking-widest font-extrabold shadow-[var(--shadow-glow)]"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-[1px] bg-[var(--border-light)]/20 flex-1" />
            <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]/50 uppercase tracking-widest">
              Already registered?
            </span>
            <div className="h-[1px] bg-[var(--border-light)]/20 flex-1" />
          </div>

          {/* Sign In Link */}
          <Link href="/" className="block">
            <Button 
              variant="secondary" 
              className="w-full h-12 text-sm uppercase tracking-widest font-extrabold"
              type="button"
            >
              Sign In Instead
            </Button>
          </Link>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[var(--border-light)]/10 text-center">
            <Badge className="text-[8px] px-3 py-1">
              Industrial Grade Education // Secure Access
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}
