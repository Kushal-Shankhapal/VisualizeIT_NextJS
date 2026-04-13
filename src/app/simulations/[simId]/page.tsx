import React from 'react';
import { notFound, redirect } from 'next/navigation';
import simulationsData from '@/data/simulations.json';
import quizzesData from '@/data/quizzes.json';
import { auth } from '@/lib/auth';
import { getSimProgress, trackVisit } from '@/app/actions/sim-progress';
import SimDetailTabs from '@/components/simulations/SimDetailTabs';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import BookmarkButton from '@/components/ui/BookmarkButton';
import Link from 'next/link';

interface SimPageProps {
  params: Promise<{ simId: string }>;
}

export default async function SimulationDetailPage({ params }: SimPageProps) {
  const { simId } = await params;
  const simulation = (simulationsData as any).find((s: any) => s.id === simId);

  if (!simulation) {
    notFound();
  }

  const session = await auth();
  const userId = session?.user?.id;
  
  let progress = null;
  if (userId) {
    progress = await getSimProgress(userId, simId);
    // Track visit as soon as page loads
    await trackVisit(simId);
  }

  const questions = (quizzesData as any)[simId] || [];

  return (
    <div className="py-24 min-h-screen bg-[var(--bg)]">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-12 text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--text-muted)]">
          <Link href="/simulations" className="hover:text-[var(--accent)] transition-colors">Library</Link>
          <span>/</span>
          <span className="text-[var(--text)]">{simulation.id}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Info & Launch */}
          <div className="lg:col-span-4 space-y-10">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <Badge variant="accent">SYSTEM // {simulation.tag}</Badge>
                <Badge variant="recessed">#{simulation.subjectCode}</Badge>
              </div>
              <h1 className="text-4xl font-extrabold text-[var(--text)] tracking-tight leading-tight mb-4">{simulation.title}</h1>
              <p className="text-[var(--text-muted)] leading-relaxed font-medium mb-8">
                {simulation.description}
              </p>
              
              <div className="flex items-center gap-4">
                 <a href={simulation.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                   <Button variant="primary" className="w-full h-14 shadow-[var(--shadow-glow)] uppercase tracking-widest font-extrabold">
                     Launch Simulation ↗
                   </Button>
                 </a>
                 <BookmarkButton simulationId={simulation.id} userId={userId} className="h-14 w-14 rounded-xl flex items-center justify-center bg-[var(--bg)] shadow-[var(--shadow-card)]" />
              </div>
            </div>

            {/* What you'll learn */}
            {simulation.learnPoints && (
              <div className="bg-[var(--dark-panel)] p-8 rounded-3xl border border-[var(--border-light)]/5 shadow-[var(--shadow-recessed)]">
                <h3 className="text-[10px] font-mono font-bold text-[var(--accent)] uppercase tracking-[0.3em] mb-6">Module Objectives</h3>
                <ul className="space-y-4">
                  {simulation.learnPoints.map((point: string, i: number) => (
                    <li key={i} className="flex gap-4 group">
                      <div className="w-5 h-5 rounded-md bg-[var(--bg)] border border-[var(--border-light)]/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-[var(--accent)] transition-colors">
                        <span className="text-[8px] font-mono font-bold text-[var(--accent)]">{i + 1}</span>
                      </div>
                      <span className="text-[13px] font-medium text-[var(--text-muted)] line-clamp-2 leading-snug">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Tabs */}
          <div className="lg:col-span-8">
            <SimDetailTabs 
              simulationId={simId} 
              questions={questions} 
              userId={userId} 
              initialProgress={progress}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
