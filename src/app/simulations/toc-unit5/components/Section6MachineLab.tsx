'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import ContinueButton from './ContinueButton';
import { machines } from '../machines';
import type { Machine } from '../types';

interface Section6Props {
  onUnlock: () => void;
}

const TIERS = ['beginner', 'intermediate', 'advanced'] as const;
const TIER_LABELS = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };

const MISCONCEPTIONS = [
  {
    wrong: 'Turing Machines must read the whole input string.',
    correct:
      'A TM can accept, reject, or loop after reading just the first symbol — it is not forced to scan to the end.',
  },
  {
    wrong: 'A Multi-tape TM can compute things a single-tape TM cannot.',
    correct:
      'Every multi-tape TM can be simulated by a single-tape TM. They compute the exact same class of problems, just at different speeds.',
  },
  {
    wrong: 'Halting just means getting to the end of the tape.',
    correct:
      'The tape is infinite — there is no "end". Halting strictly means entering the q_accept or q_reject state.',
  },
  {
    wrong: 'If a machine doesn\'t accept, it must reject.',
    correct:
      'TMs have a third outcome: Looping. A machine can run forever without ever deciding. This is the core of undecidability.',
  },
  {
    wrong: 'The Halting Problem is just hard to code.',
    correct:
      'It is mathematically impossible — no algorithm, now or ever, can perfectly predict whether all programs halt or loop.',
  },
  {
    wrong: 'Turing machines were physical computers Alan Turing built.',
    correct:
      'TMs are abstract mathematical models. A true TM requires an infinitely long tape, which violates physical reality.',
  },
];

function MachineCard({
  machine,
  isActive,
  onClick,
}: {
  machine: Machine;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`toc-machine-card tier-${machine.tier} ${isActive ? 'active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={`Load machine: ${machine.name}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--toc-text)' }}>
          {machine.name}
        </h3>
        <span className={`toc-tier-badge ${machine.tier}`}>{TIER_LABELS[machine.tier]}</span>
      </div>
      <p
        style={{
          color: 'var(--toc-muted)',
          fontSize: '0.78rem',
          marginTop: '0.4rem',
          marginBottom: '0.75rem',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {machine.purpose}
      </p>
      <button
        style={{
          background: 'transparent',
          border: `1px solid ${machine.tier === 'beginner' ? 'var(--toc-teal)' : machine.tier === 'intermediate' ? 'var(--toc-amber)' : 'var(--toc-reject)'}`,
          color: machine.tier === 'beginner' ? 'var(--toc-teal)' : machine.tier === 'intermediate' ? 'var(--toc-amber)' : 'var(--toc-reject)',
          borderRadius: '0.35rem',
          padding: '0.25rem 0.6rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        aria-label={`Load ${machine.name} in simulator`}
      >
        Load →
      </button>
    </div>
  );
}

function AnnotationPanel({ machine }: { machine: Machine }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(machine.yaml).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [machine.yaml]);

  const scrollToSim = () => {
    document.getElementById('section5-simulator')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.3 }}
      style={{
        background: '#0e0e1a',
        border: '1px solid var(--toc-amber)',
        borderRadius: '0.875rem',
        padding: '1.5rem',
        marginTop: '1.5rem',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* Left: info */}
        <div>
          <h3 style={{ color: 'var(--toc-amber)', marginBottom: '1rem' }}>{machine.name}</h3>

          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--toc-teal)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Purpose
          </p>
          <p style={{ color: 'var(--toc-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            {machine.purpose}
          </p>

          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--toc-teal)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Key Insight
          </p>
          <p style={{ color: 'var(--toc-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            {machine.insight}
          </p>

          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--toc-teal)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            SPPU Topic
          </p>
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(78,205,196,0.12)',
              border: '1px solid rgba(78,205,196,0.2)',
              color: 'var(--toc-teal)',
              borderRadius: '0.35rem',
              padding: '0.2rem 0.5rem',
              fontSize: '0.78rem',
            }}
          >
            {machine.topic}
          </span>
        </div>

        {/* Right: exercise + YAML */}
        <div>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--toc-amber)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Try This
          </p>

          <div className="toc-callout amber" style={{ marginBottom: '1rem' }}>
            {machine.exercise}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--toc-muted)', fontWeight: 600 }}>YAML</span>
            <button
              onClick={handleCopy}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                background: 'transparent',
                border: '1px solid var(--toc-border)',
                borderRadius: '0.35rem',
                padding: '0.2rem 0.5rem',
                color: copied ? 'var(--toc-accept)' : 'var(--toc-muted)',
                fontSize: '0.72rem',
                cursor: 'pointer',
                transition: 'color 200ms',
              }}
              aria-label="Copy YAML to clipboard"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy YAML'}
            </button>
          </div>

          <pre
            style={{
              background: '#080810',
              border: '1px solid var(--toc-border)',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-jetbrains, monospace)',
              color: 'var(--toc-code)',
              overflowX: 'auto',
              maxHeight: '180px',
              overflowY: 'auto',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {machine.yaml}
          </pre>

          <button
            onClick={scrollToSim}
            style={{
              marginTop: '0.75rem',
              background: 'transparent',
              border: '1px solid var(--toc-amber)',
              borderRadius: '0.4rem',
              padding: '0.35rem 0.75rem',
              color: 'var(--toc-amber)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
            aria-label="Jump to simulator section"
          >
            ↑ Jump to Simulator
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Section6MachineLab({ onUnlock }: Section6Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeMachine = machines.find((m) => m.id === activeId) ?? null;

  const handleSelect = useCallback((id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <section className="toc-section" id="section-6">
      <h2>The Machine Lab</h2>

      <p style={{ color: 'var(--toc-muted)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 700 }}>
        Nine curated machines — from beginner to advanced — covering every machine type you&apos;ll encounter in SPPU Unit V. Select any machine to see its purpose, key insight, and YAML to load into the simulator above.
      </p>

      {TIERS.map((tier) => (
        <div key={tier} style={{ marginBottom: '2rem' }}>
          <p
            style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color:
                tier === 'beginner'
                  ? 'var(--toc-teal)'
                  : tier === 'intermediate'
                  ? 'var(--toc-amber)'
                  : 'var(--toc-reject)',
              marginBottom: '0.75rem',
            }}
          >
            {TIER_LABELS[tier]}
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {machines
              .filter((m) => m.tier === tier)
              .map((m) => (
                <MachineCard
                  key={m.id}
                  machine={m}
                  isActive={activeId === m.id}
                  onClick={() => handleSelect(m.id)}
                />
              ))}
          </div>
        </div>
      ))}

      {/* Annotation Panel */}
      <AnimatePresence>
        {activeMachine && <AnnotationPanel key={activeId} machine={activeMachine} />}
      </AnimatePresence>

      {/* Misconceptions */}
      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ color: 'var(--toc-reject)' }}>⚠</span> Common Misconceptions
        </h3>
        <div className="toc-accordion">
          {MISCONCEPTIONS.map((m, i) => (
            <details key={i}>
              <summary>{m.wrong}</summary>
              <div className="accordion-body">{m.correct}</div>
            </details>
          ))}
        </div>
      </div>

      <ContinueButton onClick={onUnlock} label="The Bigger Picture →" />
    </section>
  );
}
