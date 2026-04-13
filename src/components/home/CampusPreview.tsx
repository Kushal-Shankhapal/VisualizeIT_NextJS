import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function CampusPreview() {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl overflow-hidden h-full flex flex-col">
      <div className="p-8">
        <Badge variant="green" className="mb-4">Live Environment</Badge>
        <h3 className="text-2xl font-bold text-white mb-3">Campus Explorer</h3>
        <p className="text-[var(--text-muted)] leading-relaxed mb-6 max-w-sm">
          Navigate a 3D interactive map of the engineering blocks. Access location-specific simulations based on the active labs.
        </p>
        <Link
          href="https://campusconnectpbl.github.io/CampusConnect2/model.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" className="h-10 px-6">Launch Explorer</Button>
        </Link>
      </div>

      {/* Campus Model Preview Image */}
      <div className="mt-auto relative h-72 border-t border-white/[0.04] bg-[#030609]">
        <Image
          src="/model-preview.png"
          alt="Campus 3D Model Preview"
          fill
          className="object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />
      </div>
    </div>
  );
}
