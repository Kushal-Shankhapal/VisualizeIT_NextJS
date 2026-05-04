'use client';

import { Unlock } from 'lucide-react';

interface ContinueButtonProps {
  onClick: () => void;
  label?: string;
}

export default function ContinueButton({ onClick, label = 'Continue →' }: ContinueButtonProps) {
  return (
    <button
      className="toc-continue-btn"
      onClick={onClick}
      aria-label={label}
    >
      <span className="unlock-icon" aria-hidden="true">
        <Unlock size={16} strokeWidth={2.5} />
      </span>
      {label}
    </button>
  );
}
