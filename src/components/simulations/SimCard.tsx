"use client"

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import BookmarkButton from '@/components/ui/BookmarkButton';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

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
  progressStatus?: 'done' | 'visited' | null;
}

export default function SimCard({ simulation, progressStatus }: SimCardProps) {
  const { data: session } = useSession();

  return (
    <div className="relative group">
      {/* Progress Badge Overlay */}
      {progressStatus === 'done' && (
        <div className="absolute -top-2 -right-2 z-30 bg-[#2ed573] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-[0_0_15px_#2ed57366] animate-in zoom-in duration-300">
          ✓ DONE
        </div>
      )}
      {progressStatus === 'visited' && (
        <div className="absolute top-4 left-4 z-30 w-2.5 h-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] animate-pulse" title="Visited" />
      )}

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
        <div className="mt-auto pt-5 border-t border-[var(--border-light)]/10">
          <Link href={`/simulations/${simulation.id}`} className="block w-full">
            <Button 
              variant="primary" 
              className="w-full text-[10px] uppercase tracking-widest font-extrabold h-11 px-0 shadow-[var(--shadow-card)]"
            >
              Learn & Launch →
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
