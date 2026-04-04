import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const baseStyles = "min-h-[48px] px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center active:translate-y-[2px] active:shadow-[var(--shadow-pressed)]";
  
  const variants = {
    primary: "bg-[var(--accent)] text-[var(--accent-fg)] uppercase tracking-[0.04em] shadow-[var(--shadow-glow)] hover:brightness-110 border-none",
    secondary: "bg-[var(--bg)] text-[var(--text)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)] hover:-translate-y-1 border-none",
    ghost: "bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] border-none",
  };

  const currentVariant = variants[variant] || variants.primary;

  return (
    <button className={`${baseStyles} ${currentVariant} ${className}`} {...props}>
      {children}
    </button>
  );
}
