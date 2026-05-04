'use client';

import { useEffect, useRef } from 'react';
import ContinueButton from './ContinueButton';

interface Section1Props {
  onUnlock: () => void;
}

export default function Section1Hook({ onUnlock }: Section1Props) {
  const canvasRef = useRef<SVGSVGElement>(null);

  // Animated tape: highlight moves right every 1.5s, loops
  useEffect(() => {
    let activeCell = 0;
    const CELLS = 7;
    const svg = canvasRef.current;
    if (!svg) return;

    const cells = svg.querySelectorAll<SVGRectElement>('.tape-cell-bg');
    const head = svg.querySelector<SVGPolygonElement>('#tape-head');
    const CELL_W = 60;
    const TAPE_X = 20;

    function updateTape() {
      cells.forEach((cell, i) => {
        cell.setAttribute('fill', i === activeCell ? '#e8c547' : '#12121a');
        cell.setAttribute('opacity', i === activeCell ? '0.9' : '1');
      });
      if (head) {
        const cx = TAPE_X + activeCell * CELL_W + CELL_W / 2;
        head.setAttribute('points', `${cx - 8},6 ${cx + 8},6 ${cx},18`);
      }
      activeCell = (activeCell + 1) % CELLS;
    }

    updateTape();
    const id = setInterval(updateTape, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="toc-section" id="section-1">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
        }}
      >
        {/* ── Left column: text ─────────────────────────────────────── */}
        <div>
          <span className="toc-pill">Unit V · Turing Machines</span>

          <h1 style={{ marginBottom: '1rem' }}>
            What Can a Computer{' '}
            <span style={{ color: 'var(--toc-amber)' }}>Actually</span> Do?
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--toc-muted)',
              lineHeight: 1.7,
              marginBottom: '1.25rem',
            }}
          >
            Imagine a chef who can only see one tiny cutting board at a time. To cook, they follow a strict recipe book: <em>"If you see an egg and you are in the Baking State — crack it, step right, enter the Mixing State."</em> That chef is a Turing Machine.
          </p>

          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--toc-muted)',
              lineHeight: 1.7,
              marginBottom: '1rem',
            }}
          >
            A Turing Machine (TM) is an idealized mathematical model of a computer invented by Alan Turing in 1936. By stripping computation down to its bare essentials — a tape of memory, a read/write head, and a rulebook — it reveals the absolute limits of what any algorithm can and cannot do.
          </p>

          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--toc-muted)',
              lineHeight: 1.7,
            }}
          >
            We study TMs not because we build them, but because understanding them means understanding <em>computation itself</em> — which problems are solvable, which are provably impossible, and why.
          </p>
        </div>

        {/* ── Right column: SVG animation ───────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          {/* Rulebook */}
          <div
            style={{
              alignSelf: 'flex-end',
              marginRight: '2rem',
              background: 'var(--toc-surface)',
              border: '1px solid var(--toc-border)',
              borderRadius: '0.5rem',
              padding: '0.5rem 0.75rem',
              fontSize: '0.75rem',
              color: 'var(--toc-muted)',
              fontFamily: 'var(--font-jetbrains, monospace)',
              animation: 'toc-pulse-glow 2s ease-in-out infinite',
            }}
          >
            <span style={{ color: 'var(--toc-amber)', fontSize: '1.1rem' }}>δ</span> — Rulebook
          </div>

          <svg
            ref={canvasRef}
            width="100%"
            viewBox="0 0 440 80"
            style={{ maxWidth: 440, overflow: 'visible' }}
            aria-label="Animated Turing Machine tape"
            role="img"
          >
            {/* Head triangle */}
            <polygon id="tape-head" points="50,6 66,6 58,18" fill="#e8c547" />

            {/* Tape cells */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <g key={i}>
                <rect
                  className="tape-cell-bg"
                  x={20 + i * 60}
                  y={22}
                  width={58}
                  height={48}
                  rx={4}
                  fill="#12121a"
                  stroke="#1e1e2e"
                  strokeWidth={1}
                />
                <text
                  x={20 + i * 60 + 29}
                  y={51}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#4ecdc4"
                  fontSize={14}
                  fontFamily="var(--font-jetbrains, monospace)"
                >
                  {i === 0 ? '1' : i === 1 ? '0' : i === 2 ? '1' : i === 3 ? '1' : '·'}
                </text>
              </g>
            ))}
            {/* Fade edges */}
            <defs>
              <linearGradient id="tapeEdgeFade" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0a0a0f" stopOpacity="1" />
                <stop offset="12%" stopColor="#0a0a0f" stopOpacity="0" />
                <stop offset="88%" stopColor="#0a0a0f" stopOpacity="0" />
                <stop offset="100%" stopColor="#0a0a0f" stopOpacity="1" />
              </linearGradient>
            </defs>
            <rect x={0} y={20} width={440} height={54} fill="url(#tapeEdgeFade)" />
          </svg>

          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--toc-muted)',
              textAlign: 'center',
              fontStyle: 'italic',
              maxWidth: 320,
            }}
          >
            The head reads one cell at a time. Every 1.5 s it moves right — looping forever on the infinite tape.
          </p>
        </div>
      </div>

      <ContinueButton onClick={onUnlock} label="Explore the Tape →" />
    </section>
  );
}
