"use client"

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RESOURCES, SimResources } from '@/data/resources';
import { submitQuizResult } from '@/app/actions/sim-progress';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface SimDetailTabsProps {
  simulationId: string;
  questions: Question[];
  userId?: string;
  initialProgress?: any;
}

export default function SimDetailTabs({ simulationId, questions, userId, initialProgress }: SimDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<'resources' | 'quiz' | 'activity'>('resources');
  
  // Quiz State
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resources = RESOURCES[simulationId] || null;

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === questions[currentStep].correct) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(s => s + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = async () => {
    setQuizFinished(true);
    if (userId) {
      setIsSubmitting(true);
      await submitQuizResult(simulationId, score, questions.length);
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setScore(0);
    setShowExplanation(false);
    setQuizFinished(false);
    setQuizStarted(true);
  };

  // Tab Header Component
  const TabButton = ({ id, label, icon }: { id: typeof activeTab, label: string, icon: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-5 text-sm font-bold uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 border-b-2 ${
        activeTab === id 
          ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/5' 
          : 'border-transparent text-[var(--text-muted)] hover:text-white hover:bg-white/5'
      }`}
    >
      <span>{icon}</span>
      {label}
    </button>
  );

  return (
    <Card className="!p-0 overflow-hidden shadow-[var(--shadow-float)] border border-[var(--border-light)]/20">
      {/* Tabs Nav */}
      <div className="flex bg-[var(--dark-panel)] border-b border-[var(--border-light)]/10">
        <TabButton id="resources" label="Resources" icon="📚" />
        <TabButton id="quiz" label="Quiz" icon="📋" />
        <TabButton id="activity" label="Statistics" icon="📊" />
      </div>

      <div className="p-8 min-h-[400px]">
        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {!resources ? (
              <div className="py-20 text-center opacity-40 italic">No supplemental resources currently indexed for this module.</div>
            ) : (
              <>
                <ResourceSection title="NPTEL Lectures" items={resources.nptel} />
                <ResourceSection title="YouTube Playlists" items={resources.youtube} />
                <ResourceSection title="Articles & Explanations" items={resources.articles} />
                <ResourceSection title="Interactive Textbooks" items={resources.textbooks} />
              </>
            )}
          </div>
        )}

        {/* Quiz Tab */}
        {activeTab === 'quiz' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {!questions || questions.length === 0 ? (
              <div className="py-20 text-center opacity-40 italic">Diagnostic terminal offline. No quiz data found for this sim.</div>
            ) : !quizStarted ? (
              <div className="flex flex-col items-center text-center py-10">
                <div className="w-20 h-20 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center mb-6 border border-[var(--accent)]/20">
                  <span className="text-4xl">📋</span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--text)] mb-2">Module Diagnostic</h3>
                <p className="text-[var(--text-muted)] max-w-sm mb-8">Test your understanding of {questions.length} core concepts related to this simulation.</p>
                
                {initialProgress?.quiz_attempted && (
                  <div className="mb-8 p-4 bg-[var(--muted)]/30 rounded-xl border border-[var(--border-light)]/10 inline-flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${initialProgress.quiz_passed ? 'bg-[#2ed573]' : 'bg-[var(--accent)]'} shadow-sm`} />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Last Result: {initialProgress.best_score}/{initialProgress.total_questions} ({initialProgress.quiz_passed ? 'PASSED' : 'FAILED'})
                    </span>
                  </div>
                )}

                <Button variant="primary" className="h-14 px-10 shadow-[var(--shadow-glow)]" onClick={() => setQuizStarted(true)}>
                  Initialize Quiz Terminal
                </Button>
              </div>
            ) : quizFinished ? (
              <div className="flex flex-col items-center text-center py-10">
                <div className="relative mb-10">
                  <div className="w-32 h-32 rounded-full bg-[var(--bg)] border-8 border-[var(--accent)]/20 flex items-center justify-center shadow-[var(--shadow-recessed)]">
                    <span className="text-[var(--text)] text-4xl font-mono font-bold">{score}/{questions.length}</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-[var(--text)] mb-2">Sync Complete</h3>
                <p className={`text-xl font-bold font-mono uppercase tracking-[0.3em] mb-12 ${score/questions.length >= 0.6 ? 'text-[#2ed573]' : 'text-[var(--accent)]'}`}>
                  // {score/questions.length >= 0.6 ? 'PASSED' : 'PRACTICE REQUIRED'}
                </p>
                <div className="flex gap-4">
                  <Button variant="secondary" onClick={resetQuiz} disabled={isSubmitting}>Retake Test</Button>
                  <Button variant="primary" onClick={() => {setQuizStarted(false); setQuizFinished(false);}} className="shadow-[var(--shadow-glow)]">Finish</Button>
                </div>
              </div>
            ) : (
              <div className="max-w-xl mx-auto">
                <div className="flex justify-between items-end mb-4">
                  <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em] font-bold">Q_{currentStep + 1} // SYNCING...</span>
                  <span className="font-mono text-[10px] text-[var(--accent)] font-bold">{Math.round(((currentStep + 1) / questions.length) * 100)}% Complete</span>
                </div>
                <div className="h-1 w-full bg-[var(--muted)] rounded-full mb-10 overflow-hidden">
                  <div className="h-full bg-[var(--accent)] transition-all duration-500 shadow-[0_0_8px_var(--accent)]" style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }} />
                </div>
                <h3 className="text-xl font-bold text-[var(--text)] mb-8 leading-relaxed">{questions[currentStep].question}</h3>
                <div className="grid grid-cols-1 gap-3 mb-8">
                  {questions[currentStep].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={selectedOption !== null}
                      className={`w-full p-4 rounded-xl border text-left font-semibold transition-all duration-300 flex items-center gap-4 ${
                        selectedOption === null 
                          ? 'bg-[var(--bg)] border-[var(--border-light)]/20 hover:border-[var(--accent)]/50 hover:bg-white/5' 
                          : idx === questions[currentStep].correct 
                            ? 'bg-[#2ed573]/10 border-[#2ed573] text-[#2ed573]'
                            : idx === selectedOption 
                              ? 'bg-[#ff4757]/10 border-[#ff4757] text-[#ff4757]'
                              : 'opacity-40 grayscale border-[var(--border-light)]/10'
                      }`}
                    >
                      <span className="w-8 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center font-mono text-xs text-[var(--text-muted)] shrink-0">{String.fromCharCode(65 + idx)}</span>
                      <span className="text-sm">{opt}</span>
                    </button>
                  ))}
                </div>
                {showExplanation && (
                  <div className="p-6 bg-[var(--muted)]/20 rounded-2xl border border-[var(--border-light)]/10 animate-in fade-in zoom-in duration-300">
                    <p className="text-sm text-[var(--text-muted)] mb-6 font-medium italic">"{questions[currentStep].explanation}"</p>
                    <Button variant="primary" className="w-full h-12 shadow-[var(--shadow-glow)]" onClick={nextQuestion}>
                      {currentStep < questions.length - 1 ? "Next Diagnostic Point →" : "Generate Final Sync Report"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 py-10 text-center">
             <div className="w-20 h-20 rounded-full border-4 border-dashed border-[var(--border-light)]/20 flex items-center justify-center mx-auto mb-6 text-3xl grayscale opacity-30">📈</div>
             <h3 className="text-xl font-bold text-[var(--text)] mb-2 uppercase tracking-widest">Personal Metrics</h3>
             <p className="text-[var(--text-muted)] mb-10 max-w-xs mx-auto">Track your engagement and mastering status for this specific engineering module.</p>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                <StatCard label="Module Visit" value={initialProgress?.visited ? "CONFIRMED" : "PENDING"} status={initialProgress?.visited ? "success" : "neutral"} />
                <StatCard label="Quiz Accuracy" value={initialProgress?.best_score ? `${Math.round((initialProgress.best_score / initialProgress.total_questions) * 100)}%` : "N/A"} status={initialProgress?.quiz_passed ? "success" : "neutral"} />
             </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function ResourceSection({ title, items }: { title: string, items: any[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h4 className="text-[13px] font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_5px_var(--accent)]" />
        {title}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, i) => (
          <a 
            key={i} 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group block p-5 rounded-2xl bg-[var(--bg)] border border-[var(--border-light)]/10 shadow-[var(--shadow-card)] hover:border-[var(--accent)]/30 hover:shadow-[var(--shadow-float)] transition-all"
          >
            <div className="flex justify-between items-start mb-2">
               <h5 className="font-bold text-base text-[var(--text)] group-hover:text-[var(--accent)] transition-colors leading-tight">{item.title}</h5>
               {item.free && <Badge className="bg-[#2ed573]/10 text-[#2ed573] text-[9px] font-bold border-none">FREE</Badge>}
            </div>
            {item.channel && <p className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-widest">{item.channel}</p>}
            <div className="mt-4 text-[11px] text-[var(--accent)] font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              ACCESS RESOURCE ↗
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, status }: { label: string, value: string, status: 'success' | 'danger' | 'neutral' }) {
  const statusColors = {
    success: 'text-[#2ed573]',
    danger: 'text-[var(--accent)]',
    neutral: 'text-[var(--text-muted)]'
  };
  return (
    <div className="bg-[var(--bg)] p-6 rounded-2xl border border-[var(--border-light)]/10 shadow-[var(--shadow-recessed)] text-left">
      <span className="text-[8px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-2">{label}</span>
      <span className={`text-lg font-bold font-mono ${statusColors[status]}`}>{value}</span>
    </div>
  );
}
