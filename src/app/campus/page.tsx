"use client"

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function CampusPage() {
  const EXPLORER_URL = "https://campusconnectpbl.github.io/CampusConnect2/model.html";

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-24 pb-12 flex flex-col">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <Badge variant="accent" className="mb-4">Spatial Matrix v2.0</Badge>
            <h1 className="text-4xl lg:text-5xl font-sans text-white font-extrabold tracking-tight">
              Campus <span className="text-[var(--text-muted)] font-normal italic">Explorer</span>
            </h1>
            <p className="mt-4 text-[var(--text-muted)] max-w-2xl font-medium">
              Explore the KBTCOE engineering blocks in a 3D interactive environment. 
              No authorization required for spatial exploration.
            </p>
          </div>
          <Button 
            variant="primary" 
            onClick={() => window.open(EXPLORER_URL, '_blank')}
            className="shadow-[var(--shadow-glow)] font-bold uppercase tracking-widest text-xs px-10 h-12"
          >
            Launch Fullscreen Explorer ↗
          </Button>
        </div>
      </div>

      {/* Hero Iframe Section */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative w-full h-[600px] lg:h-[750px] rounded-[40px] overflow-hidden bg-[var(--dark-panel)] border border-white/5 shadow-[var(--shadow-float)]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none z-10" />
          
          <iframe 
            src={EXPLORER_URL}
            className="w-full h-full border-none"
            title="KBTCOE Campus Explorer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          {/* Overlays */}
          <div className="absolute bottom-10 left-10 z-20 hidden md:block">
            <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl max-w-xs">
              <span className="font-mono text-[10px] text-[var(--accent)] font-bold uppercase tracking-widest block mb-2">// Navigation_Controls</span>
              <p className="text-white/60 text-[10px] leading-relaxed font-medium">
                Use your mouse to rotate the perspective. Scroll to zoom. Click on simulation hotspots to trigger lab-specific data modules.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12">
        <div className="flex items-center gap-4 text-[var(--text-muted)] opacity-30 font-mono text-[9px] uppercase tracking-[0.3em] font-bold">
           <div className="h-[1px] bg-current flex-1" />
           Physical Reality: 100% Calibrated
           <div className="h-[1px] bg-current flex-1" />
        </div>
      </div>
    </div>
  );
}
