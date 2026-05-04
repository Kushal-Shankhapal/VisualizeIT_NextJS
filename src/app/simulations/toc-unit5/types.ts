// Shared TypeScript types for TOC Unit V — Turing Machines page

export type SectionIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Machine {
  id: string;
  name: string;
  tier: 'beginner' | 'intermediate' | 'advanced';
  purpose: string;
  insight: string;
  exercise: string;
  topic: string;
  yaml: string;
}

export interface SectionWrapperProps {
  isUnlocked: boolean;
  onUnlock: () => void;
  children: React.ReactNode;
  sectionIndex: SectionIndex;
}

export interface TMStateUpdate {
  type: 'STATE_UPDATE';
  currentState: string;
  headSymbol: string;
  stepCount: number;
  isHalted: boolean;
  isAccepted: boolean;
}

export type TMOutboundMessage =
  | { type: 'LOAD_YAML'; yaml: string }
  | { type: 'STEP' }
  | { type: 'RUN' }
  | { type: 'RESET' };
