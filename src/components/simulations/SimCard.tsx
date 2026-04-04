"use client"

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import BookmarkButton from '@/components/ui/BookmarkButton';
import QuizModal from '@/components/ui/QuizModal';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import quizzesData from '@/data/quizzes.json';

interface Simulation {
  id: string;
  title: string;
  description: string;
  subject: string;
  subjectCode: string;
  branch: string;
  year: number;
  semester: number;
  unit: string;
  tag: string;
  emoji: string;
  url: string;
  type: string;
}

interface SimCardProps {
  simulation: Simulation;
}

export default function SimCard({ simulation }: SimCardProps) {
  const { data: session } = useSession();
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  
  const hasQuiz = (quizzesData as any)[simulation.id]?.length > 0;

  const handleOpenSimulation = async () => {
    window.open(simulation.url, '_blank', 'noopener,noreferrer');
    
    if (session?.user?.id) {
      try {
        await supabase.from('recent_activity').insert({
          user_id: session.user.id,
          simulation_id: simulation.id
        });
      } catch (e) {
        // Silent fail for logging errors
      }
    }
  };

  return (
    <>
      <Card hoverable withVents className="h-full flex flex-col justify-between group !p-6">
        <div>
          {/* Top Row: Meta Badges & Bookmark */}
          <div className="flex items-start justify-between mb-5">
             <div className="flex flex-col gap-1.5 flex-1">
                <Badge variant="recessed" className="font-mono text-[9px] w-fit border border-[var(--border-light)]/5">
                   #{simulation.subjectCode}
                </Badge>
                <div className="flex flex-wrap gap-1.5">
                   <Badge className="text-[8px] px-2 py-0.5 bg-[var(--muted)]/50">
                      {simulation.unit.toUpperCase()}
                   </Badge>
                   <Badge variant="accent" className="text-[8px] px-2 py-0.5 shadow-sm">
                      SEM {simulation.semester === 3 ? 'III' : 'IV'}
                   </Badge>
                </div>
             </div>
             <BookmarkButton simulationId={simulation.id} userId={session?.user?.id} className="relative z-20" />
          </div>

          {/* Title & Subject */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors line-clamp-1 tracking-tight">
              {simulation.title}
            </h3>
            <p className="text-[10px] uppercase font-mono font-extrabold text-[var(--text-muted)] tracking-[0.15em] mt-0.5">
              {simulation.subject}
            </p>
          </div>

          <p className="text-sm font-medium text-[var(--text-muted)] line-clamp-2 mb-6 leading-relaxed">
            {simulation.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2.5 mt-auto pt-5 border-t border-[var(--border-light)]/10">
          <Button 
            variant="primary" 
            className="flex-[1.5] text-[10px] uppercase tracking-widest font-extrabold h-11 px-0 shadow-[var(--shadow-card)]"
            onClick={handleOpenSimulation}
          >
            Open Launch →
          </Button>
          {hasQuiz && (
            <Button 
              variant="secondary" 
              className="flex-1 text-[10px] uppercase tracking-widest font-extrabold h-11 px-0 shadow-[var(--shadow-recessed)]"
              onClick={() => setIsQuizOpen(true)}
            >
              Quiz
            </Button>
          )}
        </div>
      </Card>

      {hasQuiz && (
        <QuizModal 
          isOpen={isQuizOpen} 
          onClose={() => setIsQuizOpen(false)} 
          simulationId={simulation.id}
          simulationTitle={simulation.title}
          questions={(quizzesData as any)[simulation.id]}
          userId={session?.user?.id}
        />
      )}
    </>
  );
}
