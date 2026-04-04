import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Choose Your Topic",
      desc: "Browse simulations by branch, year, or subject. Find exactly what you're studying."
    },
    {
      num: "02",
      title: "Adjust Parameters",
      desc: "Set inputs, change algorithms, and configure the simulation to match your test cases."
    },
    {
      num: "03",
      title: "Watch It Run",
      desc: "Animations and dynamic models respond instantly. Complex ideas become obvious."
    },
    {
      num: "04",
      title: "Master the Concept",
      desc: "Experiment, analyze, and repeat. Build real intuition through hands-on practice."
    }
  ];

  return (
    <section className="bg-[var(--dark-panel)] blueprint-grid relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-[var(--accent)] font-mono text-xs uppercase tracking-[0.2em] font-bold block mb-4">
            / / process_flow
          </span>
          <h2 className="text-4xl lg:text-5xl text-white mb-4">How It Works</h2>
          <p className="text-white/40 max-w-xl">
            Four steps from zero to understood. Master engineering through interaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              {/* Connector line for desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-[28px] left-[50%] w-full h-[2px] bg-white/10 -z-0" />
              )}
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#1a1f2e] shadow-[var(--shadow-sharp)] border border-white/5 flex items-center justify-center font-mono text-xl font-bold text-[var(--accent)] mb-6 group-hover:shadow-[0_0_15px_rgba(255,71,87,0.3)] transition-all">
                  {step.num}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed line-clamp-2 px-4 italic">
                  &quot;{step.desc}&quot;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
