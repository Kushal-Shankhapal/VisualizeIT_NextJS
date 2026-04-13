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
    <div className="relative group h-full">
      {/* Progress badge */}
      {progressStatus === 'done' && (
        <div className="absolute -top-2.5 -right-2.5 z-30 bg-[var(--green)] text-[var(--green-fg)] text-[9px] font-bold px-2.5 py-0.5 rounded font-mono uppercase tracking-widest shadow-[var(--shadow-glow-green)]">
          ✓ Done
        </div>
      )}
      {progressStatus === 'visited' && (
        <div className="absolute top-4 left-4 z-30 w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] animate-pulse" title="Visited" />
      )}

      <Card hoverable withVents className="h-full flex flex-col justify-between group-hover:border-[var(--border)]">
        <div>
          {/* Meta */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex flex-col gap-1.5 flex-1">
              <span className="font-mono text-[9px] text-[var(--accent)]/60 uppercase tracking-widest">#{simulation.subjectCode}</span>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="recessed" className="text-[9px]">{simulation.unit}</Badge>
                <Badge variant="accent" className="text-[9px]">Sem {simulation.semester}</Badge>
              </div>
            </div>
            <BookmarkButton simulationId={simulation.id} userId={session?.user?.id} className="relative z-20 !p-1.5 !rounded-lg !min-h-0" />
          </div>

          {/* Title */}
          <div className="mb-3">
            <h3 className="text-base font-bold text-white group-hover:text-[var(--accent)] transition-colors leading-snug mb-1">
              {simulation.title}
            </h3>
            <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest opacity-60">
              {simulation.subject}
            </p>
          </div>

          <p className="text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-5">
            {simulation.description}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-auto pt-4 border-t border-white/[0.05]">
          <Link href={`/simulations/${simulation.id}`} className="block w-full">
            <Button variant="primary" className="w-full text-[11px] h-10">
              Learn & Launch
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
