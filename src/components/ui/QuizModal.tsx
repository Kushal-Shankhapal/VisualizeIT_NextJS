"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulationId: string;
  simulationTitle: string;
  questions: Question[];
  userId?: string;
}

export default function QuizModal({ isOpen, onClose, simulationId, simulationTitle, questions, userId }: QuizModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !questions || questions.length === 0) return null;

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
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setQuizFinished(true);
    if (userId) {
      try {
        await supabase.from('quiz_results').insert({
          user_id: userId,
          simulation_id: simulationId,
          score: score,
          total: questions.length
        });
      } catch (e) {
        console.error("Failed to save quiz result:", e);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setScore(0);
    setShowExplanation(false);
    setQuizFinished(false);
  };

  const getPerformanceBadge = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return { label: "Excellent", color: "text-[#2ed573]" };
    if (percentage >= 60) return { label: "Good", color: "text-[var(--accent)]" };
    return { label: "Keep Practicing", color: "text-[var(--text-muted)]" };
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[var(--bg)] rounded-[24px] shadow-[var(--shadow-float)] border border-[var(--border-light)] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border-light)]/10 flex justify-between items-center bg-[var(--dark-panel)]">
          <div>
            <span className="text-[var(--accent)] font-mono text-[10px] uppercase tracking-widest block mb-1">// Quiz Mode</span>
            <h2 className="text-xl font-bold text-white tracking-tight">{simulationTitle}</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white p-2 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8">
          {!quizFinished ? (
            <>
              {/* Progress */}
              <div className="flex justify-between items-end mb-4">
                <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em] font-bold">
                  Question {currentStep + 1} of {questions.length}
                </span>
                <span className="font-mono text-xs font-bold text-[var(--accent)] shadow-[0_0_5px_var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded">
                  {Math.round(((currentStep + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-[var(--muted)] rounded-full mb-10 overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-[var(--accent)] transition-all duration-500 shadow-[0_0_12px_var(--accent)]" 
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question */}
              <div className="min-h-[100px] mb-8">
                <h3 className="text-2xl font-bold text-[var(--text)] leading-snug tracking-tight">
                  {questions[currentStep].question}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-4 mb-8">
                {questions[currentStep].options.map((opt, idx) => {
                  const isCorrect = idx === questions[currentStep].correct;
                  const isSelected = idx === selectedOption;
                  
                  let stateStyle = "bg-[var(--bg)] border-[var(--border-light)]/20 shadow-[var(--shadow-card)] text-[var(--text)]";
                  if (selectedOption !== null) {
                    if (isSelected) {
                      stateStyle = isCorrect 
                        ? "bg-[#2ed573]/10 border-[#2ed573] shadow-[0_0_15px_#2ed57333] text-[#2ed573]" 
                        : "bg-[#ff4757]/10 border-[#ff4757] shadow-[0_0_15px_#ff475733] text-[#ff4757]";
                    } else if (isCorrect) {
                      stateStyle = "bg-[#2ed573]/5 border-[#2ed573]/50 text-[#2ed573]";
                    } else {
                      stateStyle = "opacity-40 grayscale-[0.5]";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={selectedOption !== null}
                      className={`w-full p-4 rounded-xl border text-left font-semibold transition-all duration-300 ${stateStyle} ${selectedOption === null ? 'hover:translate-x-1 hover:border-[var(--accent)]/50 active:scale-[0.98]' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-colors ${isSelected ? 'bg-white/20' : 'bg-[var(--muted)] text-[var(--text-muted)]'}`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Overlay */}
              {showExplanation && (
                <div className="p-6 bg-[var(--muted)]/30 rounded-2xl border border-[var(--border-light)]/10 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-2 mb-3 text-[var(--accent)] font-bold font-mono text-[10px] uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Explanation Output
                  </div>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium">
                    {questions[currentStep].explanation}
                  </p>
                  <Button variant="primary" className="mt-8 w-full h-12 shadow-[var(--shadow-glow)]" onClick={nextQuestion}>
                    {currentStep < questions.length - 1 ? "Next Question" : "View Final Report"}
                  </Button>
                </div>
              )}
            </>
          ) : (
            /* Results Screen */
            <div className="flex flex-col items-center text-center py-6">
              <div className="relative mb-10">
                <div className="w-32 h-32 rounded-full bg-[var(--bg)] border-8 border-[var(--accent)]/20 flex items-center justify-center shadow-[var(--shadow-recessed)]">
                   <span className="text-[var(--text)] text-4xl font-mono font-bold">{score}/{questions.length}</span>
                </div>
                <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-[var(--shadow-glow)] animate-pulse">
                   <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                   </svg>
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-[var(--text)] mb-2">Quiz Sync Complete</h3>
              <p className={`text-xl font-bold font-mono uppercase tracking-[0.3em] mb-12 ${getPerformanceBadge().color}`}>
                // {getPerformanceBadge().label}
              </p>

              <div className="grid grid-cols-2 gap-4 w-full pt-6 border-t border-[var(--border-light)]/10">
                <Button variant="secondary" className="w-full text-xs uppercase tracking-widest font-bold" onClick={resetQuiz}>Retake</Button>
                <Button variant="primary" className="w-full text-xs uppercase tracking-widest font-bold shadow-[var(--shadow-glow)]" onClick={onClose}>Exit Terminal</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
