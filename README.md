<div align="center">

# VisualizeIT

**Curriculum-aligned interactive simulation platform for engineering students**

[![Live Site](https://img.shields.io/badge/Live%20Site-visualize--it.tech-brightgreen?style=for-the-badge&logo=vercel)](https://visualize-it.tech/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

*A BE Capstone Project — K.B.T. College of Engineering, Gokul Shirgaon, Kolhapur*
*Savitribai Phule Pune University (SPPU) — Computer Engineering, Sem III & IV*

</div>

---

## 📖 Table of Contents

1. [What is VisualizeIT?](#-what-is-visualizeit)
2. [Live Deployment](#-live-deployment)
3. [Core Features](#-core-features)
4. [Tech Stack](#-tech-stack)
5. [Architecture Overview](#-architecture-overview)
6. [Database Schema](#-database-schema)
7. [Authentication System](#-authentication-system)
8. [The Complete User Journey](#-the-complete-user-journey)
9. [Simulation Library (17 Simulations)](#-simulation-library)
10. [Subject Modules](#-subject-modules)
11. [TOC Unit V — Turing Machine Module](#-toc-unit-v--turing-machine-module)
12. [Computer Graphics Module](#-computer-graphics-module)
13. [Progress Tracking & Quiz System](#-progress-tracking--quiz-system)
14. [Bookmark System](#-bookmark-system)
15. [End-to-End Testing](#-end-to-end-testing)
16. [Routing & Pages](#-routing--pages)
17. [Local Setup Guide](#-local-setup-guide)
18. [Project Structure](#-project-structure)
19. [Deployment](#-deployment)
20. [Team](#-team)
21. [Future Prospects](#-future-prospects)

---

## 🎯 What is VisualizeIT?

VisualizeIT is a **full-stack, curriculum-aligned educational simulation platform** built ground-up for engineering students at the second and third year level. It covers **six subjects** across Semesters III and IV of the SPPU Computer Engineering syllabus.

It is **not** a repository of static PDFs or YouTube links. Every simulation is **interactive and web-native**, and the platform tracks each student's progress, quiz performance, and bookmarks across sessions.

> *"Bridges the gap between theoretical knowledge and practical understanding — giving students a visual, interactive, and data-driven learning experience aligned directly with their university curriculum."*

### The Problem It Solves

Theoretical engineering concepts — CPU scheduling, disk algorithms, scan conversion, Turing machines — are notoriously hard to grasp from textbooks alone. VisualizeIT replaces passive reading with:

- Step-by-step animated algorithm visualizations
- Interactive canvas-based simulations
- In-platform quizzes with immediate explanations
- AI-powered doubt resolution (Gemini Flash)
- Persistent progress tracking per student

---

## 🌐 Live Deployment

| Environment | URL |
|---|---|
| **Production** | [https://visualize-it.tech/](https://visualize-it.tech/) |
| **Vercel Mirror** | [https://visualize-it-next-js.vercel.app](https://visualize-it-next-js.vercel.app) |

The domain **visualize-it.tech** was acquired via [get.tech](https://get.tech/) and is configured with DNS pointing to Vercel's edge network.

---

## ✨ Core Features

| Feature | Description |
|---|---|
| 🎮 **17 Interactive Simulations** | Across DS, OS, DBMS, CG, and TOC — each with theory, quiz, and resources |
| 🔐 **Dual Auth (Google + Email/Password)** | Single user model with bcrypt hashing and JWT sessions |
| 🛡️ **Onboarding Gate** | Collects branch/year/semester to personalize the simulation library |
| 📊 **Progress Tracking** | Per-simulation visited/quiz-passed/best-score persisted to PostgreSQL |
| 🔖 **Bookmark System** | Save simulations; bookmarks appear on the dashboard |
| 📈 **Dashboard Analytics** | Mastery level, average quiz accuracy, modules explored, recent activity |
| 🤖 **"Ask AI" (Gemini Flash)** | Context-aware doubt resolution embedded on simulation detail pages |
| 🖥️ **Computer Graphics Module** | Native React/Konva canvas pages with 6 interactive sections |
| 🧠 **Turing Machine Module** | 7-section progressive disclosure page with 9-machine lab and full TM engine |
| 🧪 **Selenium E2E Tests** | Automated test suite against the live production URL |

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| **Framework** | Next.js App Router | 16.2.2 | Hybrid SSR + CSR, Turbopack dev, Webpack prod |
| **UI Runtime** | React | 19.2.3 | Server & Client Components, React Compiler |
| **Language** | TypeScript | 5.x | Strict mode throughout |
| **Styling** | Tailwind CSS | v4 | + scoped CSS variables per module |
| **Auth** | NextAuth (Auth.js) | v5 beta.30 | JWT sessions, Google OAuth + Credentials |
| **Database** | Supabase (PostgreSQL) | 2.100.x | Two schemas: `next_auth` + `public` |
| **DB Auth Adapter** | @auth/supabase-adapter | 1.11.x | Manages OAuth user records |
| **Password Hashing** | bcryptjs | 3.0.x | 12 salt rounds |
| **Canvas Library** | Konva + react-konva | 10.3 / 19.2 | CG module interactive canvases |
| **Animations** | animejs | v4.4.1 | Scroll-reveal animations (named export API) |
| **Smooth Scroll** | Lenis | 1.3.23 | RAF-based smooth scrolling per page |
| **Motion Library** | framer-motion | 11.x | TOC module section transitions |
| **Icons** | lucide-react | latest | UI icon library |
| **Analytics** | @vercel/analytics | latest | Production usage tracking |
| **E2E Testing** | Selenium WebDriver | latest | Python + Chrome WebDriver |
| **Deployment** | Vercel | latest | Zero-config, edge CDN |

---

## 🏗️ Architecture Overview

VisualizeIT uses a **hybrid server/client rendering model** — the right tool for each page:

```
Browser
  │
  ├── Server Components (SSR)
  │     ├── /dashboard        → data-fetched at request time, no client JS
  │     ├── /simulations      → static simulation library listing
  │     └── OnboardingGate    → server-side redirect guard in root layout
  │
  ├── Client Components (CSR)
  │     ├── SignInModal        → auth modal overlay
  │     ├── BookmarkButton     → optimistic bookmark toggle
  │     ├── SimDetailTabs      → quiz state machine
  │     └── CG/TOC pages       → canvas-heavy interactive modules
  │
  └── Server Actions
        ├── trackVisit()       → upserts sim_progress
        ├── submitQuizResult() → writes quiz_results, revalidates cache
        ├── addBookmark()      → optimistic insert with 23505 guard
        └── upsertProfile()    → onboarding data write
```

### Rendering Decision Matrix

| Route | Strategy | Reason |
|---|---|---|
| `/dashboard` | Server Component | Secure DB access, no client JS needed |
| `/simulations/[simId]` | Server + Client hybrid | Server fetches data; client runs quiz |
| `/cg/unit-1/concept-grid` | Client Component | Canvas (Konva requires `window`) |
| `/simulations/toc-unit5` | Client Component | framer-motion + iframe orchestration |
| `/` (Landing) | Client Component | Bubble sort hero animation |

---

## 🗄️ Database Schema

Two PostgreSQL schemas coexist in the same Supabase project:

### `next_auth` Schema (managed by the adapter)

| Table | Key Columns | Notes |
|---|---|---|
| `users` | `id uuid`, `email text UNIQUE`, `hashed_password text` | `hashed_password` is `null` for OAuth users |
| `accounts` | `provider`, `providerAccountId`, `userId FK` | Links Google OAuth to users |
| `sessions` | `sessionToken`, `userId FK`, `expires` | Not used in JWT mode |
| `verification_tokens` | `token`, `identifier`, `expires` | Reserved for email verification |

### `public` Schema (application data)

```sql
profiles
  id uuid PK
  user_id uuid UNIQUE         -- logical FK to next_auth.users.id
  display_name, college, branch, year, semester, division
  onboarding_completed boolean DEFAULT false
  created_at timestamp

sim_progress
  id uuid PK
  user_id uuid
  sim_id text
  visited boolean, visited_at timestamp
  quiz_attempted boolean, quiz_passed boolean
  best_score int, total_questions int
  last_attempted timestamp
  UNIQUE(user_id, sim_id)     -- one row per student per simulation (idempotent upserts)

bookmarks
  id uuid PK
  user_id uuid
  simulation_id text
  created_at timestamp
  UNIQUE(user_id, simulation_id)

recent_activity
  id uuid PK
  user_id uuid
  simulation_id text
  opened_at timestamp          -- every visit appends a new row (no dedup on write)

quiz_results
  id uuid PK
  user_id uuid
  simulation_id text
  score int, total int
  taken_at timestamp           -- full history of every attempt
```

### Row Level Security (RLS)

All five `public` tables have `ENABLE ROW LEVEL SECURITY`. The application enforces user-scoping via server actions calling `supabaseAdmin` (service role), meaning:
- Direct browser access to Supabase is blocked by RLS
- Server-side code uses the service role key (never shipped to the client)
- A user **cannot** read or write another user's progress, even with the anon key

---

## 🔐 Authentication System

### Two Providers, One User Table

```
Email/Password Flow:
  POST /api/auth/register
    → validate input
    → bcrypt.hash(password, 12)
    → INSERT into next_auth.users (hashed_password)

  Login via CredentialsProvider:
    → SELECT from next_auth.users WHERE email = ?
    → check hashed_password IS NOT NULL (else: "Use Google Sign-In")
    → bcrypt.compare(submitted, stored)
    → return { id, name, email, image }
    → JWT issued: token.sub = user.id
    → Session: session.user.id = token.sub

Google OAuth Flow:
  → SupabaseAdapter writes to next_auth.users (hashed_password = null)
  → next_auth.accounts links providerAccountId to userId
  → Same session model: session.user.id = UUID from database
```

### Onboarding Gate

A **server component** (`OnboardingGate.tsx`) sits in the root layout and wraps the entire `{children}` tree. On every page render for authenticated users:

1. Reads `x-pathname` header (injected by Next.js middleware)
2. Calls `getProfile(session.user.id)` — O(1) primary key lookup
3. If `onboarding_completed = false` → redirects to `/profile`
4. Excludes `/profile` and `/api/auth` from this check (prevents infinite redirect)

This ensures **no student can access simulations without first entering their academic details**, which drives the default simulation filter on the library page.

---

## 🗺️ The Complete User Journey

```
Anonymous Visitor
  └── / (landing page with live bubble sort animation in hero)
      └── /simulations (library visible without login)
          └── "Sign In" clicked → SignInModal opens over current page
              ├── Register at /register (email + password)
              └── Sign in with Google
                  └── OnboardingGate intercepts
                      └── /profile (enter branch / year / semester / division)
                          └── "Initialize Terminal" → /dashboard

Authenticated Student
  └── /dashboard
      ├── Stats: modules explored, quizzes cleared, avg accuracy, mastery %
      ├── Mastery level badge (dynamic based on quiz pass rate)
      ├── Saved Modules (bookmarked simulations)
      └── Last 5 activity log entries (deduplicated in-process)

  └── /simulations (filtered by student's semester by default)
      └── Click simulation card
          └── /simulations/[simId]
              ├── Objectives tab
              ├── Resources tab (NPTEL, YouTube, textbook references)
              ├── Quiz tab (5 MCQs with explanations, 60% to pass)
              └── Interactive simulation (iframe or native React)

  └── /cg/unit-1/concept-grid
      └── 6-section scrollable interactive canvas page (CG module)

  └── /simulations/toc-unit5
      └── 7-section progressive disclosure Turing Machine experience
```

---

## 🎮 Simulation Library

### Data Structures — Semester III (SPPU 161301)

| Simulation ID | Title | What It Does |
|---|---|---|
| `sorting` | Sorting Algorithms Visualizer | Step-by-step Bubble, Selection, Insertion, Quick, Merge, Heap sort with comparisons/swaps counter |
| `searching` | Search Visualizer | Linear and Binary search with element-by-element comparison highlighting |
| `stack` | Stack Visualizer | Push/pop on array and linked list representations |
| `queue` | Queue Visualizer | Enqueue/dequeue with front and rear pointer tracking |
| `circular-queue` | Circular Queue Visualization | Wrap-around logic with index calculation |
| `stack-conversion` | Expression Conversion | Infix-to-postfix with intermediate stack state display |
| `linked-list` | Linked List Visualizer | Insert/delete/traverse operations on singly linked list |

### Operating Systems — Semester IV (SPPU 161401)

| Simulation ID | Title | What It Does |
|---|---|---|
| `cpu-scheduling` | CPU Scheduling Visualizer | Gantt chart for FCFS, SJF, Round Robin, Priority scheduling |
| `disk-scheduling` | Disk Scheduling | Head movement chart for SCAN, SSTF, C-SCAN, FCFS, LOOK |
| `page-replacement` | Page Replacement | Frame-by-frame page fault for LRU, Optimal, FIFO, CLOCK |
| `memory-partition` | Memory Partition | Fixed/dynamic memory allocation visualization |
| `file-allocation` | File Allocation | Contiguous, linked, and indexed file allocation methods |

### DBMS — Semester IV (SPPU 161402)

| Simulation ID | Title | What It Does |
|---|---|---|
| `er-diagram` | ER Diagram Visualizer | Entity-relationship diagram builder and viewer |

### Computer Graphics — Semester IV (SPPU 161403)

| Simulation ID | Title | What It Does |
|---|---|---|
| `concept-grid` | The Grid — Raster Fundamentals | 6 interactive canvas sections (pixels, resolution, frame buffer, scan modes, display files, Bresenham) |
| `computer-graphics` | CG Algorithm Simulator | Bresenham and DDA line/circle drawing algorithms |

### Theory of Computation — Semester IV (SPPU 161404)

| Simulation ID | Title | What It Does |
|---|---|---|
| `toc-unit5` | Turing Machine Explorer | 7-section progressive learning journey with 9-machine lab and full TM engine |

> **Total: 17 interactive simulations**, each with a detail page, objectives, resources, 5-question quiz with explanations, and persistent progress tracking.

---

## 📚 Subject Modules

Subject landing pages exist at `/subjects/[slug]/` for all seven subjects:

| Subject | Slug | Status |
|---|---|---|
| Data Structures | `/subjects/data-structures` | ✅ 7 simulations |
| Operating Systems | `/subjects/operating-systems` | ✅ 5 simulations |
| DBMS | `/subjects/dbms` | ✅ 1 simulation |
| Computer Graphics | `/subjects/computer-graphics` | ✅ 2 simulations |
| Theory of Computation | `/subjects/theory-of-computation` | ✅ TOC Unit V built |
| DLCO | `/subjects/dlco` | 🔲 No simulations yet |
| Discrete Mathematics | `/subjects/discrete-math` | 🔲 No simulations yet |

---

## 🧠 TOC Unit V — Turing Machine Module

Located at `/simulations/toc-unit5`, this is the most advanced module in the platform. It is a **7-section progressive disclosure page** built entirely in React with framer-motion transitions and a full Turing Machine engine embedded via iframe.

### Architecture

- **Page:** `src/app/simulations/toc-unit5/page.tsx` — orchestrates section unlock state
- **Components:** `src/app/simulations/toc-unit5/components/` — 11 purpose-built components
- **TM Engine:** `public/sims/turing-machine-viz/` — standalone webpack build embedded via `<TMIframe>`
- **Machine Definitions:** `machines.ts` — 9 curated YAML-encoded Turing machines

### Progressive Disclosure Flow

```
Section 1 — Hook          → "Why can't a regular program solve every problem?"
Section 2 — Tape          → Interactive tape component (read/write head simulation)
Section 3 — States        → State diagram via embedded TM engine (diagram mode)
Section 4 — Seven-Tuple   → Flip card formal definition (Q, Σ, Γ, δ, q₀, qₐ, qᵣ)
Section 5 — Trace Table   → Step-by-step execution trace + full TM engine (full mode)
Section 6 — Machine Lab   → 9-machine interactive library
Section 7 — Big Picture   → TM variants, Halting Problem, undecidability, exam prep
```

Each section is locked until the student completes the previous one (via `ContinueButton`). Unlocking triggers a framer-motion `AnimatePresence` fade+slide entrance.

### The 9-Machine Curated Library

| Tier | Machine | Key Concept |
|---|---|---|
| 🟢 Beginner | Binary Increment | Carry propagation, scan patterns |
| 🟢 Beginner | Unary Addition | Tape manipulation, separator erasing |
| 🟢 Beginner | String Reversal | Multi-pass strategies |
| 🟡 Intermediate | Palindrome Checker | Mark-and-match, language {ww^R} |
| 🟡 Intermediate | aⁿbⁿ Recognizer | CFL recognition, TM ≥ PDA |
| 🟡 Intermediate | Binary Copy | Subroutine-like patterns |
| 🔴 Advanced | aⁿbⁿcⁿ Recognizer | Context-sensitive languages |
| 🔴 Advanced | Busy Beaver BB-3 | Non-computability |
| 🔴 Advanced | Halting Problem | Undecidability, diagonal argument |

### TM Engine iframe Communication

The TM engine supports three `mode` URL params:
- `?mode=tape` — tape only (Section 2)
- `?mode=diagram` — state diagram only (Section 3)
- `?mode=full` — complete engine (Section 5)

The engine accepts `postMessage` for loading machine YAML and triggering step/run/reset from the parent page.

### Design System

```css
--toc-bg:      #0a0a0f    /* near-black page background */
--toc-amber:   #e8c547    /* primary accent, continue buttons */
--toc-teal:    #4ecdc4    /* secondary accent */
--toc-accept:  #57cc99    /* accept state indicator */
--toc-reject:  #e63946    /* reject state indicator */
--toc-active:  #f4a261    /* active state glow */
```

Typography: Space Grotesk (headings), Inter (body), JetBrains Mono (tape/code)

---

## 🎨 Computer Graphics Module

Located at `/cg/unit-1/concept-grid`, this is the first fully native React canvas simulation in the platform — built with Konva instead of a standalone HTML file.

### Why Native React?

The subject demanded a **layered pedagogical flow** that couldn't be achieved with a standalone HTML file. Six concepts build on each other sequentially, each with a related interactive demo.

### The 6 Interactive Sections

| # | Section | Interactive Element | Technical Pattern |
|---|---|---|---|
| 1 | The Smallest Thing on Your Screen | 8×8 pixel smiley zoom demo | Konva canvas, slider, hex labels at high zoom |
| 2 | How Many Pixels? | Resolution comparator (360p/720p/1080p) | Dynamic dot-grid density on 400×225 canvas |
| 3 | Where Pixels Live | Frame buffer refresh animation | 24 staggered `setTimeout` calls with ref-stored IDs |
| 4 | Two Ways to Draw | Raster vs random scan side-by-side | Single shared RAF loop, Konva clipping rect |
| 5 | The Drawing Command List | Display file interpreter | MOVE/LINE step-by-step with cursor visualization |
| 6 | The Bridge Problem | Bresenham's algorithm quiz | Click-to-select grid, reveal with color-coded feedback |

### Architecture

- **Layout:** `src/app/cg/layout.tsx` — server component, wraps all `/cg/` routes
- **Navbar:** `src/components/cg/CGNavbar.tsx` — fixed, responsive, `usePathname` active state
- **Shell:** `src/components/cg/PageWrapper.tsx` — Lenis smooth scroll + `.cg-scope` CSS scope
- **Canvas guard:** Every `<Stage>` gated behind `{mounted && <Stage>}` (prevents Konva SSR crash)

### Design System (`.cg-scope`)

```css
--cg-bg:         #0f0f0f    /* page background */
--cg-surface:    #161616    /* cards, panels */
--cg-violet:     #7c6af7    /* CG branding, active fill */
--cg-cyan:       #22d3ee    /* active links, interactive highlights */
--cg-orange:     #f97316    /* error state (wrong pixel picks) */
```

### Technically Notable Patterns

**Scroll-reveal with one-shot IntersectionObserver:**
```ts
// useReveal hook — fires once on first entry, then disconnects
animate(el, { opacity:[0,1], translateY:['40px','0px'], duration:600, ease:'outQuad' });
obs.disconnect(); // prevents repeat on scroll back
```

**Lenis RAF cleanup (correct pattern):**
```ts
let rafId: number;
function raf(time: number) {
  lenis.raf(time);
  rafId = requestAnimationFrame(raf); // re-assigned every frame
}
// cleanup: cancelAnimationFrame always cancels the latest scheduled frame
```

**Frame buffer animation (no stale closures):**
```ts
setLitCells(prev => new Set([...prev, i])); // functional update inside setTimeout
```

**Bresenham O(1) pixel lookup:**
```ts
const BRESENHAM_PIXELS = new Set(['0,0','1,1','2,1',...]);
BRESENHAM_PIXELS.has(`${col},${row}`) // O(1) regardless of grid size
```

---

## 📊 Progress Tracking & Quiz System

### Progress Tracking

Two server actions power the tracking system:

**`trackVisit(simulationId)`** — called when a student opens a simulation detail page:
```ts
// Upsert ensures one row per (user, sim) — idempotent on repeat visits
supabaseAdmin.from('sim_progress').upsert(
  { visited: true, ... },
  { onConflict: 'user_id, sim_id' }
);
// Append-only log — every visit is a new row
supabaseAdmin.from('recent_activity').insert({ simulation_id, opened_at });
```

**`submitQuizResult(simulationId, score, total)`** — called after quiz completion:
```ts
const quizPassed = (score / total) >= 0.6; // 60% threshold enforced server-side
// Updates sim_progress + writes to quiz_results history
revalidatePath('/dashboard'); // invalidates Next.js data cache
```

### Quiz State Machine

The quiz is a client-side state machine in `SimDetailTabs.tsx`:

```
not-started → started → per-question-loop → finished → (optional restart)
```

- Answer selected → all options lock immediately (no double-answer possible)
- Correct answer turns green, wrong answer turns red, others gray out
- Explanation block fades in with CSS `animate-in fade-in zoom-in`
- On last question → `submitQuizResult` fires server action
- Previous attempt result shown on start screen (server-fetched, no extra round trip)

**Pass threshold:** ≥ 60% (3/5 questions). Enforced in the server action, not the UI.

### Dashboard Aggregation

The dashboard runs **5 data fetches on the server** before rendering:
1. `getProfile(userId)` — branch, year, display_name
2. Bookmarks → list of saved simulation IDs
3. `recent_activity` ordered by `opened_at DESC` — raw visit log
4. `getAllUserProgress(userId)` — all `sim_progress` rows
5. Filter `simulations.json` by bookmarked IDs

Stats computed in-process (no extra DB query):
```ts
visitedCount = progressData.filter(p => p.visited).length
passedCount  = progressData.filter(p => p.quiz_passed).length
avgScore     = (Σ best_score / Σ total_questions) * 100
mastery      = (passedCount / totalSims) * 100
```

---

## 🔖 Bookmark System

Three server actions in `src/app/actions/bookmarks.ts`:

| Action | Description |
|---|---|
| `getBookmarkStatus(simId)` | Returns boolean |
| `addBookmark(simId)` | Optimistic insert; ignores PostgreSQL error 23505 (unique violation = already bookmarked) |
| `removeBookmark(simId)` | Delete filtered by both `user_id` and `simulation_id` |

The `addBookmark` pattern is production-grade:
```ts
// Optimistic insert — if already bookmarked (23505), treat as success
if (error && error.code !== '23505') return { error: error.message };
```

No race condition, no double round trip. The unique constraint is the authoritative dedup mechanism.

---

## 🧪 End-to-End Testing

A **Selenium WebDriver test suite** (`tests/test_visualizeit.py`) runs against the live deployment at `visualize-it.tech`.

### Test Coverage (5 scenarios)

| Test | What It Verifies |
|---|---|
| New user registration | Redirect confirmation after account creation |
| Existing user login | Dashboard redirect after successful login |
| Onboarding gate enforcement | New accounts blocked from dashboard |
| Profile form completion | Redirect to dashboard after onboarding |
| Simulation library | Page load and card rendering |

**Setup:** Python `unittest` module, Chrome WebDriver, implicit 3-second wait, shared helper methods for modal interaction and form submission.

---

## 🗺️ Routing & Pages

| Route | Type | Description |
|---|---|---|
| `/` | Client | Landing page — hero with live bubble sort animation |
| `/simulations` | Server | Simulation library with semester-based filtering |
| `/simulations/[simId]` | Server+Client | Detail page: objectives, resources, quiz, iframe sim |
| `/simulations/toc-unit5` | Client | Turing Machine progressive learning page |
| `/cg/unit-1/concept-grid` | Client | Raster graphics fundamentals — 6 canvas sections |
| `/cg/unit-1/concept-algorithms` | Placeholder | Scaffolded, not yet built |
| `/cg/unit-1/sim-*` | Placeholder | 7 simulator routes scaffolded, not yet built |
| `/dashboard` | Server | Student analytics dashboard |
| `/profile` | Server+Client | Onboarding + profile management |
| `/auth/login` | Client | Login page |
| `/auth/register` | Client | Registration page |
| `/subjects/[slug]` | Server | Subject landing pages (7 subjects) |
| `/about` | Server | About the project |
| `/campus` | Server | Campus section |
| `/academics` | Server | Under construction |
| `/fun-lab` | Client | Easter egg page |

---

## 💻 Local Setup Guide

### Prerequisites

- Node.js ≥ 18.x
- npm ≥ 9.x
- A Supabase project (or use the team's credentials)

### 1. Clone the Repository

```bash
git clone https://github.com/Kushal-Shankhapal/VisualizeIT_NextJS.git
cd visualize-it
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# NextAuth
NEXTAUTH_SECRET="your-generated-secret"  # Run: npx auth secret
NEXTAUTH_URL="http://localhost:3000"      # Use production URL in deployment
```

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). 🎉

### 5. Production Build

```bash
npm run build  # Uses Webpack (not Turbopack) — configured in package.json
npm run start
```

> **Note:** The build script uses `next build --webpack` to avoid a known Turbopack internal error that occurs with the current project structure on some environments.

---

## 📁 Project Structure

```
visualize-it/
├── src/
│   ├── app/
│   │   ├── layout.tsx                   ← Root layout (Navbar, Footer, Analytics)
│   │   ├── page.tsx                     ← Landing page
│   │   ├── globals.css                  ← Global + scoped CG and TOC design tokens
│   │   ├── (auth)/                      ← Auth route group
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/page.tsx           ← Server component dashboard
│   │   ├── profile/page.tsx             ← Onboarding + profile form
│   │   ├── simulations/
│   │   │   ├── page.tsx                 ← Simulation library
│   │   │   ├── [simId]/page.tsx         ← Dynamic detail page
│   │   │   └── toc-unit5/              ← TOC module (full source)
│   │   │       ├── page.tsx
│   │   │       ├── layout.tsx
│   │   │       ├── toc-unit5.css
│   │   │       ├── machines.ts          ← 9 Turing machine definitions
│   │   │       ├── types.ts
│   │   │       └── components/         ← 11 section components
│   │   ├── cg/                         ← Computer Graphics module
│   │   │   ├── layout.tsx
│   │   │   └── unit-1/
│   │   │       ├── concept-grid/page.tsx  ← Built (6 canvas sections)
│   │   │       ├── concept-algorithms/   ← Placeholder
│   │   │       └── sim-*/               ← 7 simulator placeholders
│   │   ├── subjects/                   ← 7 subject landing pages
│   │   ├── actions/                    ← Server Actions
│   │   │   ├── bookmarks.ts
│   │   │   ├── profile.ts
│   │   │   └── sim-progress.ts
│   │   └── api/
│   │       └── auth/
│   │           ├── [...nextauth]/route.ts
│   │           └── register/route.ts
│   ├── components/
│   │   ├── auth/
│   │   │   ├── SignInModal.tsx
│   │   │   └── OnboardingGate.tsx
│   │   ├── cg/
│   │   │   ├── CGNavbar.tsx
│   │   │   ├── PageWrapper.tsx
│   │   │   └── SectionDivider.tsx
│   │   ├── home/                       ← Landing page components
│   │   ├── simulations/
│   │   │   ├── SimDetailTabs.tsx       ← Quiz state machine
│   │   │   ├── SimCard.tsx
│   │   │   ├── BookmarkButton.tsx
│   │   │   └── AskAI.tsx              ← Gemini Flash integration
│   │   ├── layout/                     ← Navbar, Footer
│   │   └── providers/
│   │       └── AuthProvider.tsx
│   ├── lib/
│   │   ├── auth.ts                     ← NextAuth config (2 providers)
│   │   └── supabase-admin.ts           ← Service role client
│   └── proxy.ts                        ← NextAuth middleware proxy
├── public/
│   └── sims/                           ← 14+ iframe-based simulations
│       ├── sorting/
│       ├── cpu-scheduling/
│       ├── turing-machine-viz/         ← TM engine (standalone build)
│       └── ... (17 total)
├── tests/
│   └── test_visualizeit.py             ← Selenium E2E tests
├── references/                         ← Project documentation
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Deployment

VisualizeIT is deployed on **Vercel** with continuous deployment from GitHub:

1. Push to `main` → Vercel auto-builds and deploys
2. Environment variables managed in the Vercel dashboard (never in code)
3. Custom domain **visualize-it.tech** (acquired via [get.tech](https://get.tech/)) configured with DNS A/CNAME records pointing to Vercel's edge network
4. `@vercel/analytics` tracks production usage automatically

### Key Deployment Configuration

| Setting | Value |
|---|---|
| `NEXTAUTH_URL` | `https://visualize-it.tech` |
| Google OAuth Callback | `https://visualize-it.tech/api/auth/callback/google` |
| Build Command | `next build --webpack` |
| Node.js Version | 18.x |

---

## 👥 Team

| Name | Role |
|---|---|
| **Kushal Shankhapal** | Full-Stack Lead — Architecture, Auth, Database, CG Module, TOC Module, Deployment |
| **Yash** | Full-Stack — Simulations, Documentation, Testing |
| **Pushpak Nikam** | Simulations, UI |
| **Shubham Palde** | Simulations, UI |

**Institution:** K.B.T. College of Engineering, Gokul Shirgaon, Kolhapur
**Affiliation:** Savitribai Phule Pune University (SPPU)
**Programme:** B.E. Computer Engineering — Final Year Capstone Project (2025–26)

---

## 🔮 Future Prospects

VisualizeIT was built as a BE capstone project but is designed to scale. Here is what comes next:

### Near-Term (v2 Roadmap)

| Feature | Description |
|---|---|
| 🎬 **Manim Integration** | Render mathematical animations (3Blue1Brown's Manim engine) as embedded videos for abstract concepts like graph theory and automata |
| 🎮 **Godot WASM Simulations** | Embed Godot Engine WebAssembly exports for physics-based and game-like engineering simulations |
| 🔬 **PhET/Scenery Stack** | Integrate University of Colorado's PhET Simulations framework for science-adjacent engineering topics |
| 📝 **DLCO & Discrete Math Modules** | Build out the remaining two subjects (digital logic, boolean algebra, truth tables, K-maps) |
| 🖥️ **CG Simulator Suite** | Build the 7 scaffolded CG simulation routes: DDA, Bresenham Line/Circle, Midpoint Circle, Line Comparator, Circle Comparator |
| 🧩 **CG Concept Algorithms Page** | Complete the algorithms deep-dive with interactive step-through animations |

### Long-Term Vision

| Feature | Description |
|---|---|
| 🌐 **Multi-Engine Simulation Platform** | VisualizeIT evolving into a **Full-Stack Multi-Engine Simulation Platform** — a hub where educators publish curriculum-aligned simulations built in any stack (vanilla JS, React, Godot WASM, Manim, PhET) under one unified student interface with GitHub-style discoverability |
| 🤖 **Enhanced AI Tutoring** | Expand "Ask AI" with simulation-aware context injection, code explanation, and step-by-step worked examples via Gemini Pro |
| 📱 **Mobile App** | React Native companion app for offline simulation access and push notification study reminders |
| 🏫 **Multi-Institution Expansion** | Extend beyond KBTCOE to other SPPU-affiliated colleges; curriculum mapping to multiple universities |
| 📊 **Faculty Analytics Dashboard** | Educator-facing view showing class-level quiz performance, weakest simulation topics, and student engagement heatmaps |
| 🏆 **Gamification Layer** | Leaderboards, streaks, badges, and XP points to drive engagement |
| 🔗 **LMS Integration** | Moodle/Google Classroom integration so progress syncs with institutional LMS |

### Technology Expansion (On Roadmap)

```
Current Stack           →  Future Stack
─────────────────────────────────────────────────────
Next.js 16              →  Next.js 17+ (when stable)
Tailwind CSS v4         →  CSS Layers API refinement
Supabase (REST)         →  Supabase Realtime (collaborative sessions)
Gemini Flash            →  Gemini Pro (richer tutoring)
Selenium E2E            →  Playwright (faster, more reliable)
Static iframes          →  Manim / PhET / Godot WASM sim engines
```

---

<div align="center">

**Built with ❤️ at KBTCOE for the engineering students of SPPU**

[🌐 Live Site](https://visualize-it.tech/) · [📊 Dashboard](https://visualize-it.tech/dashboard) · [🎮 Simulations](https://visualize-it.tech/simulations)

</div>
