import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const baseStyles = "min-h-[44px] px-6 py-2.5 font-bold text-sm transition-all duration-200 flex items-center justify-center active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed rounded-md";

  const variants = {
    primary: "bg-[var(--green)] text-[var(--green-fg)] uppercase tracking-[0.06em] hover:brightness-110 border-none shadow-[var(--shadow-glow-green)]",
    secondary: "bg-transparent text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-white",
    ghost: "bg-transparent text-[var(--text-muted)] hover:text-white border-none",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
