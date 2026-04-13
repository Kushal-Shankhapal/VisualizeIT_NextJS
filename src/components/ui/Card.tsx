import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  withVents?: boolean;
  accentEdge?: 'left' | 'top' | 'none';
}

export function Card({ children, className = '', hoverable = false, withVents = false, accentEdge = 'left', ...props }: CardProps) {
  // Build border-radius based on accent edge
  const radiusMap = {
    left: 'rounded-r-xl rounded-l-none',
    top: 'rounded-b-xl rounded-t-none',
    none: 'rounded-xl',
  };

  return (
    <div
      className={`
        relative bg-[var(--surface)] p-6 overflow-hidden
        ${radiusMap[accentEdge]}
        border border-[var(--border-subtle)]
        transition-all duration-300
        ${hoverable ? 'hover:-translate-y-1 hover:border-[var(--border)] hover:shadow-[var(--shadow-float)]' : 'shadow-[var(--shadow-card)]'}
        ${className}
      `}
      {...props}
    >
      {/* Accent rail */}
      {accentEdge === 'left' && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--accent)]" />
      )}
      {accentEdge === 'top' && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--accent)]" />
      )}

      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
