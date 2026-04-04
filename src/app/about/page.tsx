import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export default function AboutPage() {
  return (
    <div className="py-24 relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[70vh]">
      <div className="text-center mb-16">
        <Badge variant="recessed" className="mb-4">Hardware Manifesto</Badge>
        <h1 className="text-4xl lg:text-5xl font-sans text-[var(--text)]">
          About <span className="text-[var(--text-muted)]">VisualizeIT</span>
        </h1>
      </div>
      
      <Card hoverable className="p-8 md:p-12 mb-8">
        <h2 className="text-2xl font-bold font-sans text-[var(--text)] mb-6">Our Mission</h2>
        <div className="space-y-4 text-[var(--text-muted)] text-lg leading-relaxed">
          <p>
            Software engineering is fundamentally about building machines. Yet, we teach it by writing abstract text on whiteboards. 
          </p>
          <p>
            VisualizeIT was built to bridge that gap. We create tactile, interactive "control panels" for algorithms, operating systems, and databases, allowing students to develop mechanical intuition through experimentation.
          </p>
          <p>
            We don't just want you to memorize the time complexity. We want you to feel the gears turning.
          </p>
        </div>
      </Card>
    </div>
  );
}
