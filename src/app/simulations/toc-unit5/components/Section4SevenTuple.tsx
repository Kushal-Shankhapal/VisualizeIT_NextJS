'use client';

import { useState } from 'react';
import ContinueButton from './ContinueButton';

interface Section4Props {
  onUnlock: () => void;
}

interface CardData {
  symbol: string;
  name: string;
  meaning: string;
  example: string;
}

const CARDS: CardData[] = [
  {
    symbol: 'Q',
    name: 'States',
    meaning: 'A finite set of internal states representing the machine\'s "memory" at any moment.',
    example: 'Q = {right, carry, done}',
  },
  {
    symbol: 'Σ',
    name: 'Input Alphabet',
    meaning: 'The set of valid input symbols — cannot include the blank symbol.',
    example: 'Σ = {0, 1}',
  },
  {
    symbol: 'Γ',
    name: 'Tape Alphabet',
    meaning: 'All symbols that can appear on the tape, including Σ and the blank (□).',
    example: 'Γ = {0, 1, □}',
  },
  {
    symbol: 'δ',
    name: 'Transition Function',
    meaning: 'The rulebook: Q × Γ → Q × Γ × {L, R}. Given (state, read) → (new state, write, direction).',
    example: 'δ(carry,1) = (carry,0,L)',
  },
  {
    symbol: 'q₀',
    name: 'Start State',
    meaning: 'The state the machine begins in before reading any input.',
    example: 'q₀ = right',
  },
  {
    symbol: 'q_acc',
    name: 'Accept State',
    meaning: 'A designated halt state — entering it immediately accepts the input.',
    example: 'q_acc = done',
  },
  {
    symbol: 'q_rej',
    name: 'Reject State',
    meaning: 'A designated halt state — entering it immediately rejects. Implicit if no transition exists.',
    example: 'q_rej = (implicit)',
  },
];

function FlipCard({ card, index }: { card: CardData; index: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className={`toc-flip-card ${flipped ? 'flipped' : ''}`}
      onClick={() => setFlipped((f) => !f)}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${card.symbol} — ${card.name}. ${flipped ? 'Click to flip back.' : 'Click to reveal.'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') setFlipped((f) => !f);
      }}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="toc-flip-inner">
        {/* Front */}
        <div className="toc-flip-front">
          <span className="toc-flip-symbol">{card.symbol}</span>
          <span className="toc-flip-name">{card.name}</span>
        </div>
        {/* Back */}
        <div className="toc-flip-back">
          <span className="toc-flip-symbol">{card.symbol}</span>
          <p className="toc-flip-meaning">{card.meaning}</p>
          <code className="toc-flip-example">{card.example}</code>
        </div>
      </div>
    </div>
  );
}

export default function Section4SevenTuple({ onUnlock }: Section4Props) {
  return (
    <section className="toc-section" id="section-4">
      <h2>The 7-Tuple: Giving It a Name</h2>

      <p style={{ color: 'var(--toc-muted)', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 700 }}>
        A Turing Machine is formally defined as a 7-tuple{' '}
        <code className="toc-mono" style={{ color: 'var(--toc-amber)' }}>
          M = (Q, Σ, Γ, δ, q₀, q_acc, q_rej)
        </code>
        . Each symbol below is one part of that definition. Click a card to reveal its meaning — mapped to the Binary Increment machine.
      </p>

      {/* Cards */}
      <div className="toc-card-grid">
        {CARDS.slice(0, 4).map((card, i) => (
          <FlipCard key={card.symbol} card={card} index={i} />
        ))}
      </div>
      <div
        className="toc-card-grid"
        style={{ gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: 'calc(3 * 140px + 2 * 0.75rem)' }}
      >
        {CARDS.slice(4).map((card, i) => (
          <FlipCard key={card.symbol} card={card} index={i + 4} />
        ))}
      </div>

      {/* Notation note */}
      <details
        style={{
          marginTop: '1.5rem',
          background: 'var(--toc-surface)',
          border: '1px solid var(--toc-border)',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem',
        }}
      >
        <summary
          style={{
            cursor: 'pointer',
            color: 'var(--toc-teal)',
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
        >
          ℹ Notation: SPPU (K.L.P. Mishra) vs Sipser
        </summary>
        <p
          style={{
            color: 'var(--toc-muted)',
            fontSize: '0.85rem',
            marginTop: '0.75rem',
            lineHeight: 1.65,
          }}
        >
          SPPU often references K.L.P. Mishra&apos;s textbook which defines the 7-tuple as{' '}
          <code className="toc-mono" style={{ color: 'var(--toc-amber)' }}>
            (Q, Σ, Γ, δ, q₀, b, F)
          </code>{' '}
          where <code className="toc-mono">b</code> is the blank symbol and{' '}
          <code className="toc-mono">F</code> is a set of final states. Michael Sipser&apos;s modern
          convention (used here and in most university courses globally) is{' '}
          <code className="toc-mono" style={{ color: 'var(--toc-teal)' }}>
            (Q, Σ, Γ, δ, q₀, q_accept, q_reject)
          </code>{' '}
          — separating accept and reject states explicitly. For SPPU exams, both are acceptable; clarify
          your notation in the answer.
        </p>
      </details>

      <ContinueButton onClick={onUnlock} label="Now watch it run →" />
    </section>
  );
}
