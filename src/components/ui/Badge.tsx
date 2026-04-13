import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'recessed' | 'accent' | 'default' | 'green';
}

export function Badge({ children, className = '', variant = 'recessed', ...props }: BadgeProps) {
  const baseStyles = "font-mono text-[10px] uppercase tracking-[0.1em] px-2.5 py-0.5 rounded font-bold inline-flex items-center justify-center";

  const variants = {
    recessed: "bg-white/[0.04] text-[var(--text-muted)] border border-white/5",
    accent:   "bg-[rgba(77,122,255,0.15)] text-[var(--accent)] border border-[rgba(77,122,255,0.25)]",
    default:  "bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border-subtle)]",
    green:    "bg-[rgba(0,255,149,0.12)] text-[var(--green)] border border-[rgba(0,255,149,0.2)]",
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
