'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { SectionWrapperProps } from '../types';

export default function SectionWrapper({
  isUnlocked,
  sectionIndex,
  children,
}: SectionWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (isUnlocked && wrapperRef.current) {
      setTimeout(() => {
        wrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [isUnlocked]);

  return (
    <AnimatePresence>
      {isUnlocked && (
        <motion.div
          ref={wrapperRef}
          key={`section-${sectionIndex}`}
          initial={prefersReduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
