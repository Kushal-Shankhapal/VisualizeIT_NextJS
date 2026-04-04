import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  withVents?: boolean;
}

export function Card({ children, className = '', hoverable = false, withVents = false, ...props }: CardProps) {
  return (
    <div 
      className={`
        relative bg-[var(--bg)] rounded-2xl p-6
        shadow-[var(--shadow-card)] border border-[var(--border-light)]/20
        transition-all duration-300
        ${hoverable ? 'hover:-translate-y-1 hover:shadow-[var(--shadow-float)]' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Corner screws: 4 small circles (10px) using radial-gradient */}
      <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full shadow-[var(--shadow-recessed)] bg-[var(--muted)] overflow-hidden">
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.8),_transparent_50%)]" />
      </div>
      <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full shadow-[var(--shadow-recessed)] bg-[var(--muted)] overflow-hidden">
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.8),_transparent_50%)]" />
      </div>
      <div className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full shadow-[var(--shadow-recessed)] bg-[var(--muted)] overflow-hidden">
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.8),_transparent_50%)]" />
      </div>
      <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full shadow-[var(--shadow-recessed)] bg-[var(--muted)] overflow-hidden">
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.8),_transparent_50%)]" />
      </div>

      {/* Vent slots if requested */}
      {withVents && (
        <div className="absolute top-4 right-10 flex gap-1">
          <div className="w-[2px] h-[18px] bg-[var(--dark-panel)] rounded-full shadow-[var(--shadow-recessed)] opacity-60" />
          <div className="w-[2px] h-[18px] bg-[var(--dark-panel)] rounded-full shadow-[var(--shadow-recessed)] opacity-60" />
          <div className="w-[2px] h-[18px] bg-[var(--dark-panel)] rounded-full shadow-[var(--shadow-recessed)] opacity-60" />
        </div>
      )}

      {/* Content wrapper to stay above background elements */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  )
}
