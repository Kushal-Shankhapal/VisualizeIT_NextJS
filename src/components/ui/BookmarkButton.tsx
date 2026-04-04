"use client"

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface BookmarkButtonProps {
  simulationId: string;
  userId?: string;
  className?: string;
}

export default function BookmarkButton({ simulationId, userId, className = "" }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (userId) {
      checkBookmarkStatus();
    }
  }, [userId, simulationId]);

  const checkBookmarkStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', userId)
        .eq('simulation_id', simulationId)
        .single();

      if (data) setIsBookmarked(true);
    } catch (e) {
      // Silent fail if table/row not found
    }
  };

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      // Basic aesthetic notification instead of alert
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 bg-[var(--dark-panel)] text-white px-6 py-3 rounded-full shadow-[var(--shadow-float)] border border-white/10 z-[200] font-mono text-xs uppercase tracking-widest animate-in slide-in-from-bottom-2 duration-300';
      toast.innerText = 'Sign in to bookmark simulations';
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.classList.add('animate-out', 'fade-out', 'duration-300');
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 3000);
      return;
    }

    // Optimistic UI
    const previousState = isBookmarked;
    setIsBookmarked(!previousState);

    try {
      if (previousState) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', userId)
          .eq('simulation_id', simulationId);
      } else {
        await supabase
          .from('bookmarks')
          .insert({ user_id: userId, simulation_id: simulationId });
      }
    } catch (error) {
      console.error("Bookmark sync error:", error);
      setIsBookmarked(previousState); // Rollback
    }
  };

  return (
    <button 
      onClick={toggleBookmark}
      className={`p-2 rounded-lg transition-all duration-300 ${
        isBookmarked 
          ? 'bg-[var(--accent)] text-white shadow-[var(--shadow-glow)]' 
          : 'bg-[var(--bg)] text-[var(--text-muted)] shadow-[var(--shadow-recessed)] hover:text-[var(--text)]'
      } ${className}`}
      title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
    >
      <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  );
}
