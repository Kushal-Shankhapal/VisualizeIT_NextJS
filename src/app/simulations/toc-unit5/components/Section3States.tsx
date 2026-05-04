'use client';

import { useEffect, useRef } from 'react';
import TMIframe, { TMIframeHandle } from './TMIframe';
import ContinueButton from './ContinueButton';
import { machineMap } from '../machines';

interface Section3Props {
  onUnlock: () => void;
  isUnlocked: boolean;
}

const SIMPLE_2_STATE_YAML = machineMap['simple-scanner']?.yaml ?? '';

export default function Section3States({ onUnlock, isUnlocked }: Section3Props) {
  const iframeRef = useRef<TMIframeHandle>(null);

  useEffect(() => {
    if (!isUnlocked) return;
    const t = setTimeout(() => {
      iframeRef.current?.sendMessage({ type: 'LOAD_YAML', yaml: SIMPLE_2_STATE_YAML });
    }, 900);
    return () => clearTimeout(t);
  }, [isUnlocked]);

  return (
    <section className="toc-section" id="section-3">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* ── Left: text ──────────────────────────────────────────────── */}
        <div>
          <h2>States: The Machine&apos;s Memory</h2>

          <p style={{ color: 'var(--toc-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
            States represent the machine&apos;s <em>state of mind</em> — its internal memory of what it has seen so far. Think of tying a knot in a handkerchief to remind yourself why you are scanning. A TM always has a <strong style={{ color: 'var(--toc-teal)' }}>finite</strong> number of states, yet combined with an infinite tape, this is enough to simulate any algorithm.
          </p>

          <p style={{ color: 'var(--toc-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            The <strong style={{ color: 'var(--toc-amber)' }}>Transition Function δ</strong> is the actual program. At each step the machine consults its rulebook:
          </p>

          <pre className="toc-code-block" aria-label="Transition function description">
{`At each step the machine asks:
  (current state, symbol read)
    → (write symbol, move direction, new state)

Example: δ(carry, 1) = (0, L, carry)
  "In state 'carry', reading '1':
   write '0', move Left, stay in 'carry'"`}
          </pre>
        </div>

        {/* ── Right: iframe ────────────────────────────────────────────── */}
        <div>
          <p
            style={{
              color: 'var(--toc-muted)',
              fontSize: '0.82rem',
              fontStyle: 'italic',
              marginBottom: '0.5rem',
            }}
          >
            A 2-state scanner. Click <strong>Step</strong> in the simulator — watch the active state pulse as the head moves right.
          </p>
          <TMIframe
            ref={iframeRef}
            mode="diagram"
            height={320}
          />
        </div>
      </div>

      <ContinueButton onClick={onUnlock} label="I understand states →" />
    </section>
  );
}
