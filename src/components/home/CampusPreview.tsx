import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function CampusPreview() {
  return (
    <Card className="bg-[var(--dark-panel)] border border-[#1e2325] shadow-[var(--shadow-float)] overflow-hidden h-full flex flex-col justify-between" withVents>
      <div className="p-8 relative z-10">
        <Badge variant="accent" className="mb-4">Live Environment</Badge>
        <h3 className="text-3xl font-sans font-bold text-white mb-3">Campus Explorer</h3>
        <p className="text-[var(--border-dark)] leading-relaxed mb-8 max-w-sm">
          Navigate a 3D interactive map of the engineering blocks. Access location-specific simulations based on the active labs in real-time.
        </p>
        <Link 
          href="https://campusconnectpbl.github.io/CampusConnect2/model.html" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button variant="primary">Launch Explorer</Button>
        </Link>
      </div>
      
      {/* Decorative Grid Graphic */}
      <div className="h-48 w-full mt-auto relative border-t border-[rgba(255,255,255,0.05)] bg-[#0f1416]">
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'linear-gradient(rgba(46,213,115,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(46,213,115,0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>
        {/* Mock 3D building blocks */}
        <div className="absolute bottom-8 left-12 w-16 h-24 bg-[var(--dark-panel)] border-t border-l border-[#2ed573]/30 shadow-[4px_4px_0_rgba(0,0,0,0.5)] transform -skew-x-[20deg]"></div>
        <div className="absolute bottom-16 left-36 w-20 h-16 bg-[var(--dark-panel)] border-t border-l border-[#2ed573]/30 shadow-[4px_4px_0_rgba(0,0,0,0.5)] transform -skew-x-[20deg]"></div>
      </div>
    </Card>
  );
}
