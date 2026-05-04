'use client';

import { useState, useCallback } from 'react';
import ContinueButton from './ContinueButton';

interface Section2Props {
  onUnlock: () => void;
}

const VISIBLE_COUNT = 11;

function TapeDemo() {
  const [cells, setCells] = useState<Record<number, string>>({ 0: '1', 1: '0', 2: '1', 3: '1' });
  const [headPos, setHeadPos] = useState(0);
  const [viewStart, setViewStart] = useState(-1);
  const [editingCell, setEditingCell] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const CELL_W = 48;

  const getVisibleIndices = () =>
    Array.from({ length: VISIBLE_COUNT }, (_, i) => viewStart + i);

  const moveHead = (dir: -1 | 1) => {
    const newPos = headPos + dir;
    setHeadPos(newPos);

    // Scroll view if head goes out of visible range
    if (newPos < viewStart + 2) setViewStart(newPos - 2);
    if (newPos > viewStart + VISIBLE_COUNT - 3) setViewStart(newPos - VISIBLE_COUNT + 3);
  };

  const handleCellClick = (idx: number) => {
    if (idx === headPos) {
      setEditingCell(idx);
      setEditValue(cells[idx] ?? '');
    } else {
      // Move head to that cell first
      setHeadPos(idx);
    }
  };

  const handleCellEdit = useCallback(
    (idx: number, value: string) => {
      const sym = value.trim().charAt(0) || '';
      if (sym) {
        setCells((prev) => ({ ...prev, [idx]: sym }));
      } else {
        setCells((prev) => {
          const next = { ...prev };
          delete next[idx];
          return next;
        });
      }
      setEditingCell(null);
    },
    []
  );

  const visibleIndices = getVisibleIndices();
  // The active cell position within the visible strip (0-indexed)
  const activeOffset = headPos - viewStart;

  return (
    <div className="toc-tape-wrapper">
      {/* Head arrow */}
      <div className="toc-tape-head-indicator" aria-hidden="true">
        <span
          className="toc-tape-head-arrow"
          style={{
            left: `calc(${activeOffset} * ${CELL_W}px + ${CELL_W / 2}px - 0.55rem)`,
          }}
        >
          ▼
        </span>
      </div>

      {/* Tape strip */}
      <div className="toc-tape-strip" role="group" aria-label="Turing Machine tape">
        {visibleIndices.map((idx) => (
          <div
            key={idx}
            className={`toc-tape-cell ${idx === headPos ? 'active' : ''}`}
            onClick={() => handleCellClick(idx)}
            role="button"
            tabIndex={0}
            aria-label={`Cell ${idx}: ${cells[idx] ?? 'blank'}${idx === headPos ? ' (head)' : ''}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleCellClick(idx);
            }}
          >
            {editingCell === idx ? (
              <input
                autoFocus
                maxLength={1}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleCellEdit(idx, editValue)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCellEdit(idx, editValue);
                  if (e.key === 'Escape') setEditingCell(null);
                }}
                aria-label={`Edit cell ${idx}`}
              />
            ) : (
              <span>{cells[idx] ?? ''}</span>
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '0.75rem',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => moveHead(-1)}
            style={{
              background: 'rgba(78,205,196,0.15)',
              color: 'var(--toc-teal)',
              border: '1px solid rgba(78,205,196,0.3)',
              borderRadius: '0.4rem',
              padding: '0.4rem 0.9rem',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
              transition: 'background 200ms',
            }}
            aria-label="Move head left"
          >
            ← Move Left
          </button>
          <button
            onClick={() => moveHead(1)}
            style={{
              background: 'rgba(78,205,196,0.15)',
              color: 'var(--toc-teal)',
              border: '1px solid rgba(78,205,196,0.3)',
              borderRadius: '0.4rem',
              padding: '0.4rem 0.9rem',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
              transition: 'background 200ms',
            }}
            aria-label="Move head right"
          >
            Move Right →
          </button>
        </div>

        {/* Status line */}
        <span
          className="toc-mono"
          style={{ color: 'var(--toc-amber)', fontSize: '0.8rem' }}
          aria-live="polite"
        >
          Head: cell {headPos} · reading:{' '}
          <strong>{cells[headPos] ?? '∅ (blank)'}</strong>
        </span>
      </div>
    </div>
  );
}

export default function Section2Tape({ onUnlock }: Section2Props) {
  return (
    <section className="toc-section" id="section-2">
      <h2>The Tape: Infinite Memory</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem',
        }}
      >
        <p style={{ color: 'var(--toc-muted)', lineHeight: 1.7 }}>
          The tape is the Turing Machine&apos;s memory — an infinitely long strip divided into cells. It starts with the input, all other cells filled with a blank symbol. Think of it like a toilet paper roll: the first few squares have your message, but you can unroll it forever in both directions as scratch space.
        </p>
        <p style={{ color: 'var(--toc-muted)', lineHeight: 1.7 }}>
          The <strong style={{ color: 'var(--toc-amber)' }}>Read/Write Head</strong> scans exactly one cell at a time. At each step it reads the symbol, optionally rewrites it, and moves exactly one cell left or right. This simple mechanism is provably as powerful as any modern computer.
        </p>
      </div>

      <p
        style={{
          color: 'var(--toc-muted)',
          fontSize: '0.875rem',
          fontStyle: 'italic',
          marginBottom: '0.75rem',
        }}
      >
        Click a cell to write a symbol. Move the head with the arrows. The tape extends forever in both directions.
      </p>

      <TapeDemo />

      <ContinueButton onClick={onUnlock} label="Understand States →" />
    </section>
  );
}
