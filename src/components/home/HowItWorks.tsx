import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Choose a Topic",
      desc: "Browse simulations by subject or semester. Find exactly what you're studying right now.",
      icon: "◈"
    },
    {
      num: "02",
      title: "Set Your Parameters",
      desc: "Adjust inputs, swap algorithms, and configure the simulation to match your test cases.",
      icon: "◇"
    },
    {
      num: "03",
      title: "Watch It Run",
      desc: "Animations respond instantly. Complex logic becomes visually obvious in seconds.",
      icon: "▷"
    },
    {
      num: "04",
      title: "Master the Concept",
      desc: "Experiment, analyze, and repeat. Build real intuition through hands-on exploration.",
      icon: "◉"
    }
  ];

  return (
    <section className="blueprint-grid relative py-24">
      {/* Top gradient fade */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[var(--bg)] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />

      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="mb-16">
          <p className="text-xs font-mono text-[var(--accent)] uppercase tracking-[0.15em] mb-3">Process</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3">How It Works</h2>
          <p className="text-[var(--text-muted)] max-w-lg">
            Four steps from zero to understood. Master engineering through interaction, not memorization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              {/* Connector line — desktop only */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+28px)] right-0 h-px bg-gradient-to-r from-[var(--border)] to-transparent z-0" />
              )}

              <div className="relative z-10 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl p-6 h-full hover:border-[var(--border)] transition-all">
                {/* Step number */}
                <div className="w-14 h-14 rounded-xl bg-[rgba(77,122,255,0.08)] border border-[var(--border-subtle)] flex items-center justify-center font-mono text-lg font-bold text-[var(--accent)] mb-5 group-hover:bg-[rgba(77,122,255,0.12)] transition-colors">
                  {step.num}
                </div>
                <h3 className="text-white font-bold text-lg mb-2 leading-snug">{step.title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
