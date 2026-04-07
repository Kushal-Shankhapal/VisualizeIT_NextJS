"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { getBookmarkStatus, addBookmark, removeBookmark } from '@/app/actions/bookmarks';

interface BookmarkButtonProps {
  simulationId: string;
  userId?: string;
  className?: string;
}

export default function BookmarkButton({ simulationId, userId, className = "" }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const checkBookmarkStatus = useCallback(async () => {
    const bookmarked = await getBookmarkStatus(simulationId);
    setIsBookmarked(bookmarked);
  }, [simulationId]);

  useEffect(() => {
    if (userId) {
      checkBookmarkStatus();
    }
  }, [userId, checkBookmarkStatus]);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
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

    // Optimistic UI update
    const previousState = isBookmarked;
    setIsBookmarked(!previousState);

    const result = previousState
      ? await removeBookmark(simulationId)
      : await addBookmark(simulationId);

    if (result.error) {
      console.error("Bookmark sync error:", result.error);
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
