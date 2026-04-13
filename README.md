# 🛰️ VisualizeIT — Engineering Terminal v2.0

VisualizeIT is a high-performance educational platform designed for KBTCOE engineering students (SE IT 2024 Pattern). It transforms abstract theoretical concepts—like Sorting, CPU Scheduling, and ER Diagramming—into interactive, observable, and measurable digital experiences.

---

## 🛠️ The Core Engine (Tech Stack)

| Component | Technology |
|---|---|
| **Framework** | Next.js 16.1.6 (App Router / Turbopack) |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4 (Industrial Neumorphic Design) |
| **Authentication** | Auth.js v5 (Google OAuth + Email/Password Credentials) |
| **Database** | Supabase (PostgreSQL) |
| **Security** | bcryptjs (Password Hashing) & Supabase RLS |
| **Logic** | TypeScript (Strict Typing) |

---

## 🌐 User Lifecycle & Logic Flow

### 1. Unified Access (Auth)
Users can initialize their session via **Google OAuth** for quick access or create a persistent identity via **Email & Password**. All security is handled via industry-standard hashing protocols.

### 2. Autonomous Onboarding
First-time users are automatically gated to the **Profile Initialization Terminal**. This collects vital curriculum data:
*   **Branch**: (IT, CS, Mechanical, etc.)
*   **Academic Cycle**: (Year & Semester)
*   **Division**: (For targeted lab activity tracking)

### 3. Simulation Vault (Curriculum Library)
The library is **context-aware**. It detects your current semester from your profile and auto-filters the simulations relevant to your immediate curriculum (e.g., SE IT Sem III & IV).
*   **Smart Filter**: Auto-shows DSA, OS, or DBMS modules.
*   **Override Mode**: Toggle "Show All" to explore the entire engineering catalog.

### 4. Interactive Detail Hubs
Each module has a dedicated cockpit containing:
*   **Launch Terminal**: Access the full external interactive visualization.
*   **Module Objectives**: Clear "What You'll Learn" bullet points.
*   **Supplemental Resources**: Curated NPTEL lectures, YouTube guides, and Article deep-dives.
*   **Diagnostic Terminal (Quiz)**: Test your knowledge. Passing with 60%+ marks the module as "Cleared" in your progress.

### 5. User Terminal (Mastery Dashboard)
A data-driven view of your academic progress:
*   **Exploration Metrics**: Track visited vs unvisited modules.
*   **Mastery Index**: Visualize your quiz accuracy and "Cleared" module counts.
*   **Bookmark Stack**: Quick-access links to your most-used modules.
*   **Recent Activity Log**: A persistent record of your last 5 simulation cycles.

---

## 🏗️ Technical Manifest (Folder Structure)

```text
├── src/
│   ├── app/                  # Next.js 16 App Router
│   │   ├── (auth)/           # Register, Sign-in routes
│   │   ├── simulations/      # Library & [simId] Detail Page
│   │   ├── profile/          # Dedicated Onboarding Page
│   │   └── dashboard/        # User Terminal
│   ├── components/
│   │   ├── auth/             # OnboardingGate, SignInModal, ProfileForm
│   │   ├── simulations/      # SimCard, SimDetailTabs
│   │   └── ui/               # Primary HUD elements (Button, Card, Badge)
│   ├── lib/                  # Auth configuration & Supabase clients
│   ├── data/                 # JSON configuration for Sim data and Quizzes
│   └── proxy.ts              # Next.js 16 Unified Middleware
```

---

## 🚀 Deployment Command Center

### Environment Initialization
Create a `.env.local` with the following variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_secret_role_key
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=your_url
```

### Local Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

---

## 🛡️ Security Protocol (Data Safety)
*   **Service Role Logic**: Sensitive data (Passwords/Profiles) is managed via server-only clients, bypassing client-side exploitation risks.
*   **RLS (Row Level Security)**: Supabase tables are protected by policies that ensure users can only view and modify their *own* bookmarks and activity logs.
*   **Password Hashing**: Credentials are never stored as plain text, utilizing `bcrypt` for secure authentication.

---

**VisualizeIT** — Industrialized Engineering Education // SE IT 2024 Pattern.
