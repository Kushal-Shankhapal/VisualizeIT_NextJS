'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import TMIframe, { TMIframeHandle } from './TMIframe';
import ContinueButton from './ContinueButton';
import { machineMap } from '../machines';

interface Section5Props {
  onUnlock: () => void;
  isUnlocked: boolean;
}

interface TraceStep {
  step: number;
  state: string;
  read: string;
  action: string;
  newState: string;
}

const TRACE_STEPS: TraceStep[] = [
  { step: 1, state: 'right', read: '1', action: 'write 1, move R', newState: 'right' },
  { step: 2, state: 'right', read: '0', action: 'write 0, move R', newState: 'right' },
  { step: 3, state: 'right', read: '1', action: 'write 1, move R', newState: 'right' },
  { step: 4, state: 'right', read: '1', action: 'write 1, move R', newState: 'right' },
  { step: 5, state: 'right', read: '□', action: 'write □, move L', newState: 'carry' },
  { step: 6, state: 'carry', read: '1', action: 'write 0, move L', newState: 'carry' },
  { step: 7, state: 'carry', read: '1', action: 'write 0, move L', newState: 'carry' },
  { step: 8, state: 'carry', read: '0', action: 'write 1, move L', newState: 'done (HALT)' },
];

const BINARY_INC_YAML = machineMap['binary-increment']?.yaml ?? '';

export default function Section5Trace({ onUnlock, isUnlocked }: Section5Props) {
  const [visibleRows, setVisibleRows] = useState(0);
  const [flashRow, setFlashRow] = useState<number | null>(null);
  const iframeRef = useRef<TMIframeHandle>(null);
  const prefersReduced = useReducedMotion();

  // Animate rows in one-by-one
  useEffect(() => {
    if (!isUnlocked) return;
    let count = 0;
    const id = setInterval(() => {
      count++;
      setVisibleRows(count);
      setFlashRow(count - 1);
      setTimeout(() => setFlashRow(null), 420);
      if (count >= TRACE_STEPS.length) clearInterval(id);
    }, 380);
    return () => clearInterval(id);
  }, [isUnlocked]);

  // Load binary increment into the full sim after trace starts
  useEffect(() => {
    if (!isUnlocked) return;
    const t = setTimeout(() => {
      iframeRef.current?.sendMessage({ type: 'LOAD_YAML', yaml: BINARY_INC_YAML });
    }, 2200);
    return () => clearTimeout(t);
  }, [isUnlocked]);

  return (
    <section className="toc-section" id="section-5">
      <h2>Your First Turing Machine</h2>

      <p style={{ color: 'var(--toc-muted)', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 700 }}>
        The <strong style={{ color: 'var(--toc-amber)' }}>Binary Increment</strong> machine adds 1 to any binary number. Input:{' '}
        <code className="toc-mono" style={{ color: 'var(--toc-code)' }}>1011</code>. Expected output:{' '}
        <code className="toc-mono" style={{ color: 'var(--toc-accept)' }}>1100</code>. Watch the 8-step execution trace animate below, then try stepping through it yourself in the simulator.
      </p>

      {/* Trace table */}
      <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
        <table className="toc-trace-table" aria-label="Binary Increment execution trace">
          <thead>
            <tr>
              <th>Step</th>
              <th>State</th>
              <th>Read</th>
              <th>Action</th>
              <th>New State</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {TRACE_STEPS.slice(0, visibleRows).map((row, i) => (
                <motion.tr
                  key={row.step}
                  initial={prefersReduced ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  style={
                    flashRow === i
                      ? { animation: 'toc-flash-amber 0.4s ease-out' }
                      : undefined
                  }
                >
                  <td className="toc-mono" style={{ color: 'var(--toc-amber)' }}>
                    {row.step}
                  </td>
                  <td className="toc-mono" style={{ color: 'var(--toc-teal)' }}>
                    {row.state}
                  </td>
                  <td className="toc-mono">{row.read}</td>
                  <td className="toc-mono" style={{ color: 'var(--toc-code)' }}>
                    {row.action}
                  </td>
                  <td
                    className="toc-mono"
                    style={{
                      color: row.newState.includes('HALT')
                        ? 'var(--toc-accept)'
                        : 'var(--toc-text)',
                    }}
                  >
                    {row.newState}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Full simulator */}
      <p
        style={{
          color: 'var(--toc-muted)',
          fontSize: '0.82rem',
          fontStyle: 'italic',
          marginBottom: '0.5rem',
        }}
      >
        The Binary Increment machine has been pre-loaded below. Use <strong>Step</strong> to follow each row of the trace above, or hit <strong>Run</strong> to watch it execute automatically.
      </p>

      <TMIframe
        ref={iframeRef}
        mode="full"
        height={520}
        id="section5-simulator"
      />

      <p
        style={{
          color: 'var(--toc-muted)',
          fontSize: '0.82rem',
          fontStyle: 'italic',
          marginTop: '0.75rem',
        }}
      >
        Try editing the YAML in the right panel to change the input. What happens with input <code className="toc-mono" style={{ color: 'var(--toc-amber)' }}>111</code> — does the carry propagate past the leftmost digit?
      </p>

      <ContinueButton onClick={onUnlock} label="Explore More Machines →" />
    </section>
  );
}
