import React from 'react';

interface LedProps {
  color?: 'green' | 'red' | 'yellow' | 'accent';
  pulsing?: boolean;
}

export function Led({ color = 'green', pulsing = true }: LedProps) {
  const colors = {
    green: "bg-[#2ed573] shadow-[0_0_8px_2px_rgba(46,213,115,0.6)]",
    red: "bg-[#ff4757] shadow-[0_0_8px_2px_rgba(255,71,87,0.6)]",
    yellow: "bg-[#ffa502] shadow-[0_0_8px_2px_rgba(255,165,2,0.6)]",
    accent: "bg-[var(--accent)] shadow-[var(--shadow-glow)]",
  };

  return (
    <div 
      className={`w-2 h-2 rounded-full ${colors[color]} ${pulsing ? 'animate-pulse' : ''}`}
    />
  );
}
