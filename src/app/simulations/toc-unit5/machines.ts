// All 9 curated machines for the TOC Unit V Machine Lab.
// YAMLs are sourced from the TM engine's example files (turing-machine-viz/src/examples/)
// and are valid for the turing-machine-viz parser.

import { Machine } from './types';

export const machines: Machine[] = [
  // ─── BEGINNER ───────────────────────────────────────────────────────────────

  {
    id: 'binary-increment',
    name: 'Binary Increment',
    tier: 'beginner',
    purpose: 'Adds 1 to a binary number written on the tape',
    insight: 'Scan right to the end, then carry leftward — flip 1→0 until you hit a 0 or blank, then write 1 and halt',
    exercise: 'Try input 111. What happens when the carry propagates past the leftmost digit?',
    topic: 'Basic TM design, scanning pattern',
    yaml: `name: binary increment
source code: |
  # Adds 1 to a binary number.
  input: '1011'
  blank: ' '
  start state: right
  table:
    # scan to the rightmost digit
    right:
      [1,0]: R
      ' '  : {L: carry}
    # then carry the 1
    carry:
      1      : {write: 0, L}
      [0,' ']: {write: 1, L: done}
    done:
positions:
  right: {x: 230, y: 250}
  carry: {x: 400, y: 250}
  done: {x: 570, y: 250}
`,
  },

  {
    id: 'palindrome',
    name: 'Palindrome Checker',
    tier: 'beginner',
    purpose: "Accepts strings that read the same forwards and backwards (L = {ww^R})",
    insight: 'Mark-and-match: cross off the outermost characters, verify they match, and work inward — repeat until the tape is blank (accept) or a mismatch is found (reject)',
    exercise: 'Try input aba. Then try a single character. How does step count scale with string length?',
    topic: "Language recognition, L = {ww^R}",
    yaml: `name: palindrome
source code: |
  # Accepts palindromes made of the symbols 'a' and 'b'
  input: 'abba' # try a, ab, bb, babab
  blank: ' '
  start state: start
  synonyms:
    accept: {R: accept}
    reject: {R: reject}
  table:
    start:
      a: {write: ' ', R: haveA}
      b: {write: ' ', R: haveB}
      ' ': accept # empty string
    haveA:
      [a,b]: R
      ' ': {L: matchA}
    haveB:
      [a,b]: R
      ' ': {L: matchB}
    matchA:
      a: {write: ' ', L: back} # same symbol at both ends
      b: reject
      ' ': accept # single symbol
    matchB:
      a: reject
      b: {write: ' ', L: back} # same symbol at both ends
      ' ': accept # single symbol
    back:
      [a,b]: L
      ' ': {R: start}
    accept:
    reject:
positions:
  haveA:  {x: 240, y: 185}
  start:  {x: 400, y: 185}
  haveB:  {x: 560, y: 185}
  matchA: {x: 240, y: 315}
  back:   {x: 400, y: 315}
  matchB: {x: 560, y: 315}
  accept: {x: 400, y: 55}
  reject: {x: 400, y: 445}
`,
  },

  {
    id: 'divisible-by-3',
    name: 'Divisible by 3 (Binary)',
    tier: 'beginner',
    purpose: 'Checks if a binary number is divisible by 3 — single left-to-right pass, no rewriting',
    insight: 'Track only the remainder mod 3 as you scan each bit: state q0=remainder 0, q1=remainder 1, q2=remainder 2. Accept in q0.',
    exercise: 'Try 1111 (15 — divisible by 3) and 10100 (20 — not divisible). Can you trace why?',
    topic: 'DFA-like TM, remainder tracking',
    yaml: `name: divisible by 3
source code: |
  # Checks if a binary number is divisible by 3.
  input: '1001' # try '1111' (15), '10100' (20), '111001' (57)
  blank: ' '
  start state: q0
  table:
    q0:
      0: R       # 2*0 + 0 = 0
      1: {R: q1} # 2*0 + 1 = 1
      ' ': {R: accept}
    q1:
      0: {R: q2} # 2*1 + 0 = 2
      1: {R: q0} # 2*1 + 1 = 3
    q2:
      0: {R: q1} # 2*2 + 0 = 4
      1: {R: q2} # 2*2 + 1 = 5
    accept:
positions:
  q0: {x: 230, y: 250}
  q1: {x: 400, y: 250}
  q2: {x: 570, y: 250}
  accept: {x: 230, y: 380}
`,
  },

  // ─── INTERMEDIATE ──────────────────────────────────────────────────────────

  {
    id: 'copy-1s',
    name: 'Copy 1s (String Copy Subroutine)',
    tier: 'intermediate',
    purpose: 'Copies a run of 1s — the fundamental subroutine inside unary multiplication',
    insight: 'Erase one 1, jump to the separator, append a 1 at the end, return — repeat. This is the copy subroutine used by larger TMs.',
    exercise: 'Try input 111. Then try 11111. Does step count grow linearly or quadratically?',
    topic: 'Subroutine-like TM design, multi-pass strategy',
    yaml: `name: copy 1s
source code: |
  # Copies a string of consecutive 1s.
  input: '111'
  blank: 0
  start state: each
  table:
    # mark the current 1 by erasing it
    each:
      0: {R: H}
      1: {write: 0, R: sep}
    # skip to the separator
    sep:
      0: {R: add}
      1: R
    # skip to the end of the copy and write a 1
    add:
      0: {write: 1, L: sepL}
      1: R
    # return to the separator
    sepL:
      0: {L: next}
      1: L
    # return to the erased 1, restore it, and then advance to the next 1
    next:
      0: {write: 1, R: each}
      1: L
    H:
positions:
  each: {x: 400   , y: 100}
  sep:  {x: 400.01, y: 250}
  add:  {x: 400.02, y: 400}
  sepL: {x: 250   , y: 250}
  next: {x: 250.01, y: 100}
  H:    {x: 550   , y: 100}
`,
  },

  {
    id: 'match-three-lengths',
    name: 'aⁿbⁿcⁿ Recognizer',
    tier: 'intermediate',
    purpose: "Accepts strings of form aⁿbⁿcⁿ — a context-sensitive language NO pushdown automaton can recognize",
    insight: 'Three-way marking: mark one a, one b, one c per pass (by capitalizing them). Accept when all are marked. This is why TMs are strictly more powerful than PDAs.',
    exercise: 'Why can a PDA not recognize this? The stack can only track one count at a time.',
    topic: 'Context-sensitive language, TM > PDA',
    yaml: `name: three equal lengths
source code: |
  # Decides the language { aⁿbⁿcⁿ | n ≥ 1 }, that is,
  # accepts a's followed by b's then c's of the same length.
  input: aabbcc # try bac, aabc, aabcc, aabcbc
  blank: ' '
  start state: qA
  table:
    qA:
      a: {write: A, R: qB}
      B: {R: scan}
    qB:
      [a,B]: R
      b: {write: B, R: qC}
    qC:
      [b,C]: R
      c: {write: C, L: back}
    back:
      [a,B,b,C]: L
      A: {R: qA}
    scan:
      [B,C]: R
      ' ': {R: accept}
    accept:
positions:
  qA: {x: 240, y: 250}
  qB: {x: 400, y: 250}
  qC: {x: 560, y: 250}
  back:   {x: 400, y: 370}
  scan:   {x: 320, y: 150}
  accept: {x: 480, y: 150}
`,
  },

  {
    id: 'binary-addition',
    name: 'Binary Addition',
    tier: 'intermediate',
    purpose: 'Adds two binary numbers (format: a+b) — demonstrates multi-number arithmetic on a tape',
    insight: 'Add digit by digit from the right, carrying just like long addition by hand. Uses marked digits (O,I) to track which places have been processed.',
    exercise: 'Try 1011+11001. Then try 1+1111. Trace the carry propagation.',
    topic: 'Arithmetic TMs, multi-pass strategies',
    yaml: `name: binary addition
source code: |
  # Adds two binary numbers together.
  # Format: Given input a+b where a and b are binary numbers,
  # leaves c b on the tape, where c = a+b.
  # Example: '11+1' => '100 1'.
  input: '1011+11001'
  blank: ' '
  start state: right
  table:
    right:
      [0,1,+]: R
      ' ': {L: read}
    read:
      0: {write: c, L: have0}
      1: {write: c, L: have1}
      +: {write: ' ', L: rewrite}
    have0: {[0,1]: L, +: {L: add0}}
    have1: {[0,1]: L, +: {L: add1}}
    add0:
      [0,' ']: {write: O, R: back0}
      1      : {write: I, R: back0}
      [O,I]  : L
    add1:
      [0,' ']: {write: I, R: back1}
      1      : {write: O, L: carry}
      [O,I]  : L
    carry:
      [0,' ']: {write: 1, R: back1}
      1      : {write: 0, L}
    back0:
      [0,1,O,I,+]: R
      c: {write: 0, L: read}
    back1:
      [0,1,O,I,+]: R
      c: {write: 1, L: read}
    rewrite:
      O: {write: 0, L}
      I: {write: 1, L}
      [0,1]: L
      ' ': {R: done}
    done:
positions:
  right:   {x: 300, y: 130}
  rewrite: {x: 500, y: 130}
  done:    {x: 620, y: 130}
  back0:  {x: 250, y: 250}
  read:   {x: 400, y: 250}
  back1:  {x: 550, y: 250}
  carry:  {x: 650, y: 250}
  add0:   {x: 150, y: 400}
  have0:  {x: 300, y: 400}
  have1:  {x: 500, y: 400}
  add1:   {x: 650, y: 400}
`,
  },

  // ─── ADVANCED ──────────────────────────────────────────────────────────────

  {
    id: 'unary-multiplication',
    name: 'Unary Multiplication',
    tier: 'advanced',
    purpose: "Multiplies two unary numbers (e.g. '||*|||' means 2×3) — uses the copy subroutine as a sub-machine",
    insight: 'For each 1 in the first number, copy the entire second number. This is the copy-1s machine used as a subroutine — a real example of TM composition.',
    exercise: 'Try ||*||| (2×3=6). Count the steps. Notice it is O(n²·m) — quadratic in n.',
    topic: 'Unary arithmetic, TM subroutines, SPPU exam machine',
    yaml: `name: unary multiplication
source code: |
  # Multiplies together two unary numbers separated by a '*'.
  # (Unary is like tallying. Here '||*|||' means 2 times 3.)
  input: '||*|||' # try '*', '|*|||', '||||*||'
  blank: ' '
  start state: eachA
  table:
    eachA:
      '|': {write: ' ', R: toB}
      '*': {R: skip}
    toB:
      '|': R
      '*': {R: eachB}
    nextA:
      ' ': {write: '|', R: eachA}
      ['|','*']: L
    skip:
      '|': R
      ' ': {R: done}
    done:
    eachB:
      ' ': {L: nextA}
      '|': {write: ' ', R: sep}
    sep:
      ' ': {R: add}
      '|': R
    add:
      ' ': {write: '|', L: sepL}
      '|': R
    sepL:
      ' ': {L: nextB}
      '|': L
    nextB:
      ' ': {write: '|', R: eachB}
      '|': L
positions:
  eachA:  {x: 400, y:  50}
  toB:    {x: 400, y: 150}
  eachB:  {x: 400, y: 250}
  sep:    {x: 400, y: 350}
  add:    {x: 400, y: 450}
  sepL:   {x: 280, y: 350}
  nextB:  {x: 280, y: 250}
  nextA:  {x: 280, y: 90}
  skip:   {x: 520, y: 90}
  done:   {x: 520, y: 190}
`,
  },

  {
    id: 'busy-beaver-3',
    name: '3-State Busy Beaver',
    tier: 'advanced',
    purpose: 'The 3-state champion: writes maximum 1s on a blank tape before halting — 13 steps, 6 ones',
    insight: 'No algorithm can find BB(n) for large n — it is non-computable. Even knowing this machine exists, we cannot prove it is optimal without exhaustive simulation.',
    exercise: 'Count the steps manually. Does it look random? It is actually deterministic — a key lesson in computability.',
    topic: 'Non-computability, connection to Halting Problem, SPPU advanced topic',
    yaml: `name: 3-state busy beaver
source code: |
  # A 3-state 2-symbol busy beaver for most non-blank symbols.
  # It takes 13 steps and leaves 6 non-blank symbols on the tape.
  blank: '0'
  start state: A
  table:
    A:
      0: {write: 1, R: B}
      1: {L: C}
    B:
      0: {write: 1, L: A}
      1: R
    C:
      0: {write: 1, L: B}
      1: {R: H}
    H:
positions:
  A: {x: 320, y: 296}
  B: {x: 400, y: 157}
  C: {x: 480, y: 296}
  H: {x: 400, y: 376}
`,
  },

  {
    id: 'simple-scanner',
    name: 'Simple 2-State Scanner',
    tier: 'beginner',
    purpose: 'The minimal TM — scans right over input, halts when blank is found. Used to demonstrate the 7-tuple with a tiny machine.',
    insight: 'Two states (scan, done), two symbols (0, 1). The simplest non-trivial TM — perfect for understanding the 7-tuple mapping.',
    exercise: 'What happens if you give it a blank tape? Where does it halt?',
    topic: '7-tuple definition, basic TM model',
    yaml: `name: simple scanner
source code: |
  # Scans right over 0s and 1s, halts when blank is found.
  input: '0101'
  blank: ' '
  start state: scan
  table:
    scan:
      [0,1]: R
      ' ': {L: done}
    done:
positions:
  scan: {x: 300, y: 250}
  done: {x: 500, y: 250}
`,
  },
];

// Convenience: a map from machine ID to Machine object
export const machineMap: Record<string, Machine> = Object.fromEntries(
  machines.map((m) => [m.id, m])
);
