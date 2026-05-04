'use client';

interface ProgressBarProps {
  unlockedSections: boolean[];
}

export default function ProgressBar({ unlockedSections }: ProgressBarProps) {
  const total = unlockedSections.length;
  const unlockedCount = unlockedSections.filter(Boolean).length;
  const fillPct = ((unlockedCount - 1) / (total - 1)) * 100;

  // The active dot is the last unlocked index
  const activeIndex = unlockedSections.lastIndexOf(true);

  return (
    <div className="toc-progress-bar" role="navigation" aria-label="Course progress">
      {/* Fill line */}
      <div
        className="toc-progress-fill"
        style={{ width: `${Math.max(0, fillPct)}%` }}
        aria-hidden="true"
      />

      {/* Left badge */}
      <span className="toc-pill" style={{ marginBottom: 0, flexShrink: 0 }}>
        Unit V · Turing Machines
      </span>

      {/* Dots */}
      <div className="flex items-center gap-2" role="list" aria-label="Section progress">
        {unlockedSections.map((unlocked, i) => {
          const isActive = i === activeIndex;
          const dotClass = isActive
            ? 'toc-dot toc-dot-active'
            : unlocked
            ? 'toc-dot toc-dot-unlocked'
            : 'toc-dot toc-dot-locked';
          return (
            <span
              key={i}
              className={dotClass}
              role="listitem"
              aria-label={`Section ${i + 1}: ${unlocked ? 'unlocked' : 'locked'}`}
            />
          );
        })}
      </div>

      {/* Counter */}
      <span
        className="toc-mono"
        style={{ fontSize: '0.72rem', color: 'var(--toc-muted)', flexShrink: 0 }}
        aria-live="polite"
        aria-label={`${unlockedCount} of ${total} sections`}
      >
        {unlockedCount} / {total}
      </span>
    </div>
  );
}
