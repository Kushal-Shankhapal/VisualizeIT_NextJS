'use client';

import { CheckCircle } from 'lucide-react';
import ContinueButton from './ContinueButton';

interface Section7Props {
  onUnlock: () => void;
}

const VARIANTS = [
  {
    variant: 'Deterministic TM (DTM)',
    difference: 'One strictly defined action for every (state, symbol) pair.',
    power: 'Standard',
    intuition: 'A train on a single straight track — every junction is pre-determined.',
  },
  {
    variant: 'Nondeterministic TM (NTM)',
    difference: 'Can have multiple possible transitions for the same (state, symbol). Guesses the right path.',
    power: 'Equal',
    intuition: 'A multiverse tree. If any branch reaches accept, the whole machine accepts.',
  },
  {
    variant: 'Multi-Tape TM',
    difference: 'Has k independent tapes and k read/write heads working simultaneously.',
    power: 'Equal',
    intuition: 'A chef with 3 cutting boards vs. one massive counter. Same food, different speed.',
  },
  {
    variant: 'Universal TM (UTM)',
    difference: 'Takes the encoded description of another TM + its input, and simulates that TM.',
    power: 'Equal',
    intuition: 'A smartphone. Fixed hardware reads any "app description" to become a calculator, game, or browser.',
  },
];

export default function Section7BigPicture({ onUnlock }: Section7Props) {
  return (
    <section className="toc-section" id="section-7">
      {/* ── A: Variants ─────────────────────────────────────────────── */}
      <h2>The Bigger Picture</h2>

      <h3 style={{ color: 'var(--toc-amber)', marginTop: '0.5rem', marginBottom: '1rem' }}>
        TM Variants
      </h3>

      <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
        <table className="toc-variants-table" aria-label="TM Variants comparison">
          <thead>
            <tr>
              <th>Variant</th>
              <th>What&apos;s Different</th>
              <th>Power</th>
              <th>Visual Intuition</th>
            </tr>
          </thead>
          <tbody>
            {VARIANTS.map((v) => (
              <tr key={v.variant}>
                <td style={{ fontWeight: 600, color: 'var(--toc-text)', whiteSpace: 'nowrap' }}>
                  {v.variant}
                </td>
                <td style={{ color: 'var(--toc-muted)', fontSize: '0.875rem' }}>
                  {v.difference}
                </td>
                <td>
                  <span
                    style={{
                      display: 'inline-block',
                      background: 'rgba(78,205,196,0.15)',
                      color: 'var(--toc-teal)',
                      border: '1px solid rgba(78,205,196,0.25)',
                      borderRadius: '999px',
                      padding: '0.1rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {v.power}
                  </span>
                </td>
                <td>{v.intuition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr style={{ borderColor: 'var(--toc-amber)', opacity: 0.25, margin: '2rem 0' }} />

      {/* ── B: Church-Turing + Halting ──────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {/* Church-Turing Thesis */}
        <div
          style={{
            background: 'var(--toc-surface)',
            borderLeft: '3px solid var(--toc-amber)',
            borderRadius: '0 0.625rem 0.625rem 0',
            padding: '1.25rem',
          }}
        >
          <h3 style={{ color: 'var(--toc-amber)', marginBottom: '0.75rem' }}>Church-Turing Thesis</h3>
          <p style={{ color: 'var(--toc-muted)', fontSize: '0.875rem', lineHeight: 1.65 }}>
            Any algorithmic process that can be carried out by a human can be simulated by a Turing Machine. This is a widely accepted <em>hypothesis</em> — not provable, but never disproven. It bridges the intuitive concept of an "algorithm" with the formal model of a TM.
          </p>
          <p style={{ color: 'var(--toc-muted)', fontSize: '0.875rem', lineHeight: 1.65, marginTop: '0.75rem' }}>
            In practice this means: if you can describe an algorithm precisely in any programming language, a TM can compute it.
          </p>
        </div>

        {/* Halting Problem */}
        <div
          style={{
            background: 'var(--toc-surface)',
            borderLeft: '3px solid var(--toc-reject)',
            borderRadius: '0 0.625rem 0.625rem 0',
            padding: '1.25rem',
          }}
        >
          <h3 style={{ color: 'var(--toc-reject)', marginBottom: '0.75rem' }}>The Halting Problem</h3>
          <p style={{ color: 'var(--toc-muted)', fontSize: '0.875rem', lineHeight: 1.65 }}>
            Is there a single program that can look at <em>any other program + its input</em> and predict whether it will halt or loop forever? Turing proved: <strong style={{ color: 'var(--toc-reject)' }}>No such algorithm can exist</strong>.
          </p>
          <p style={{ color: 'var(--toc-muted)', fontSize: '0.875rem', lineHeight: 1.65, marginTop: '0.75rem' }}>
            Imagine building a perfect debugging tool that promises to scan any student&apos;s code and output "This will infinite-loop" or "This will finish." That tool is literally impossible to create — not just hard to code, but mathematically forbidden.
          </p>
        </div>
      </div>

      <hr style={{ borderColor: 'var(--toc-amber)', opacity: 0.25, margin: '2rem 0' }} />

      {/* ── C: Exam Prep ─────────────────────────────────────────────── */}
      <h3 style={{ color: 'var(--toc-amber)', marginBottom: '1rem' }}>
        What to Focus on for SPPU Exams (CO5)
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Machine Designs */}
        <div>
          <p style={{ fontWeight: 700, color: 'var(--toc-text)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Machine Designs to Practice
          </p>
          {[
            'L = {0ⁿ1ⁿ} — equal 0s and 1s',
            'L = {aⁿbⁿcⁿ} — three equal groups',
            'L = {ww^R} — palindromes',
            'Unary addition & 1s complement',
            'Binary increment and addition',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--toc-amber)', flexShrink: 0, marginTop: '0.05rem' }}>☐</span>
              <span style={{ color: 'var(--toc-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Concepts */}
        <div>
          <p style={{ fontWeight: 700, color: 'var(--toc-text)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Concepts to Understand
          </p>
          {[
            'How a single-tape TM simulates a multi-tape TM',
            'Church-Turing Thesis — philosophical mapping',
            'The Halting Problem & undecidability (conceptual)',
            'NTM vs DTM equivalence proof idea',
            'Formal 7-tuple definition (both SPPU and Sipser notations)',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--toc-teal)', flexShrink: 0, marginTop: '0.05rem' }}>☐</span>
              <span style={{ color: 'var(--toc-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="toc-callout amber">
        <strong>CO5 Note:</strong> This unit maps directly to Course Outcome 5 of the SPPU syllabus — "Design Turing Machines for various languages and understand the concept of computability and undecidability." Focus on constructing formal transition tables and state diagrams, not just describing the machines.
      </div>

      {/* ── Completion Card ──────────────────────────────────────────── */}
      <div className="toc-completion-card">
        <CheckCircle size={48} color="var(--toc-amber)" strokeWidth={1.5} aria-hidden="true" />
        <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Unit V Complete</h3>
        <p style={{ color: 'var(--toc-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          You&apos;ve covered Turing Machines from first principles to exam prep — tape model, 7-tuple, execution traces, the machine lab, TM variants, Church-Turing Thesis, and the Halting Problem.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <a
            href="#"
            style={{
              display: 'inline-block',
              background: 'var(--toc-amber)',
              color: '#0a0a0f',
              borderRadius: '0.5rem',
              padding: '0.75rem 1.5rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
            }}
            aria-label="Take the Unit V quiz"
          >
            Take the Quiz
          </a>
          <a
            href="/"
            style={{
              display: 'inline-block',
              background: 'transparent',
              color: 'var(--toc-amber)',
              border: '1px solid var(--toc-amber)',
              borderRadius: '0.5rem',
              padding: '0.75rem 1.5rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
            }}
            aria-label="Back to dashboard"
          >
            Back to Dashboard
          </a>
        </div>
      </div>

      {/* Hidden unlock trigger — completing section 7 */}
      <div style={{ height: 0, overflow: 'hidden' }}>
        <ContinueButton onClick={onUnlock} label="Complete" />
      </div>
    </section>
  );
}
