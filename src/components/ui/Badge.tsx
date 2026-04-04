import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'recessed' | 'accent' | 'default';
}

export function Badge({ children, className = '', variant = 'recessed', ...props }: BadgeProps) {
  const baseStyles = "font-mono text-[10px] uppercase tracking-[0.08em] px-3 py-1 rounded-full font-bold inline-flex items-center justify-center";
  
  const variants = {
    recessed: "bg-[var(--bg)] text-[var(--text-muted)] shadow-[var(--shadow-recessed)]",
    accent: "bg-[var(--accent)] text-[var(--accent-fg)] shadow-[var(--shadow-glow)]",
    default: "bg-[var(--panel)] text-[var(--text)] border border-[var(--border-light)] shadow-sm"
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
