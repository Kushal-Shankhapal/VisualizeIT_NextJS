# VisualizeIT 🚀

> **Curriculum-aligned interactive simulation platform for engineering students at KBTCOE, affiliated with Savitribai Phule Pune University (SPPU).**

Welcome to the team! 👋 We are super excited to have you on board. This README will serve as your ultimate guide to understanding how VisualizeIT works, how to get it running on your machine, and how to contribute to the project.

---

## 📖 Project Overview

**What does VisualizeIT do?**
VisualizeIT brings engineering concepts to life. Instead of reading about CPU scheduling or network topologies in textbooks, students can interact with them in real-time through web-based simulations. 

**Who is it for?**
It is built specifically for engineering students at KBTCOE (SPPU). The simulations are tailored to align directly with the university's curriculum, making it a highly relevant study companion.

**What problem does it solve?**
Theoretical engineering concepts can be notoriously difficult to grasp. By providing an interactive, visual, and engaging learning platform—complete with progress tracking, quizzes, and an AI assistant to answer doubts—VisualizeIT bridges the gap between theory and practical understanding.

---

## 💻 Local Setup Guide

Let's get you up and running! Follow these steps to set up the project locally.

### 1. Clone the Repository
Open your terminal and clone the repository:
```bash
git clone <repository-url>
cd visualize-it
```

### 2. Install Dependencies
We use npm as our package manager. Run:
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following keys. Ask a team member for the actual values!
```env
# Auth.js Secrets
AUTH_SECRET="your-generated-auth-secret" # Run `npx auth secret` to generate

# Supabase Credentials (from your Supabase project settings)
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Gemini AI Key
GEMINI_API_KEY="your-gemini-flash-api-key"
```

### 4. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. You're all set! 🎉

---

## 🛠️ Tech Stack

We've chosen a modern, developer-friendly stack to ensure the application is fast, scalable, and easy to maintain.

*   **Next.js (App Router):** Chosen for its excellent server-side rendering, seamless routing, and robust API route capabilities.
*   **React 19:** Powers our interactive UI components, utilizing the latest features for optimal performance.
*   **TypeScript:** Adds static typing, catching errors early and making the codebase much easier to navigate and refactor.
*   **Tailwind CSS 4:** Allows us to build beautiful, responsive designs incredibly fast using utility classes without writing custom CSS.
*   **Supabase:** Provides our PostgreSQL database and Row Level Security (RLS) out of the box, saving us from managing complex backend infrastructure.
*   **Auth.js v5 (formerly NextAuth):** Gives us a secure, flexible authentication system tailored for Next.js.
*   **bcryptjs:** Used for securely hashing user passwords before storing them in the database.
*   **Vercel:** Our deployment platform of choice, offering zero-config deployments perfectly optimized for Next.js.

---

## 🧩 Module Breakdown

Here is how the core pieces of VisualizeIT fit together:

### 1. Authentication (`Auth.js` + `bcryptjs`)
We use Auth.js with the **Credentials provider**. When a student signs up, their password is securely hashed using `bcryptjs` before being saved to Supabase. During login, the entered password is encrypted and compared against the hash.

### 2. Onboarding Modal
When a student logs in for the very first time, they are greeted with an onboarding modal. This helps them set up their profile (like selecting their academic year or branch) so we can personalize their dashboard.

### 3. Simulation Listing & Filtering
The dashboard presents a grid of available simulations. Students can filter them by subject, year, or topic, making it easy to find exactly what they need to study for their SPPU exams.

### 4. Simulation Detail Page
Clicking a simulation opens its dedicated page. This page hosts the interactive simulation (rendered securely) alongside theory context, instructions, and an embedded quiz.

### 5. Progress Tracking
We track student progress using a `sim_progress` table in Supabase. It records two main flags for each student-simulation pair:
*   `visited` (boolean): Has the student opened this simulation?
*   `quiz_passed` (boolean): Has the student successfully passed the attached quiz?
This data fuels the progress bars on their dashboard.

### 6. "Ask AI" Integration (Gemini Flash)
Got a doubt while running a simulation? Students can use the "Ask AI" chat feature powered by Google's Gemini Flash model to get instant, context-aware explanations about the engineering concept they are studying.

---

## 🗄️ Database & Supabase Schema

Our Supabase PostgreSQL database is structured around users and their learning journeys.

### Core Tables
1.  **`users`**: Stores user profiles (ID, name, email, hashed password, branch, year).
2.  **`sim_progress`**: Tracks progress. 
    *   `id` (PK)
    *   `user_id` (FK to users)
    *   `sim_id` (String identifier for the simulation)
    *   `visited` (Boolean)
    *   `quiz_passed` (Boolean)
    *   `updated_at` (Timestamp)

### Row Level Security (RLS) Policies
Security is paramount. RLS policies ensure that:
*   A user can **only** read and update their own rows in the `users` table.
*   A user can **only** read, insert, and update their own progress in the `sim_progress` table. 
Nobody can peek at another student's test scores!

---

## 🎮 Simulation Architecture

To keep things modular and prevent complex dependency conflicts, **all simulations are self-contained**.

*   **Location:** They live in the `public/sims/` directory.
*   **Structure:** Each simulation has its own folder containing pure `HTML`, `CSS`, and `Vanilla JS` (e.g., `public/sims/cpu-scheduling/simulator.html`).
*   **Integration:** On the Next.js Simulation Detail page, we render the simulation using an `<iframe>` pointing to the static path (`/sims/cpu-scheduling/simulator.html`).
*   **Registration:** To make the platform aware of the simulation, its metadata (title, description, tags, iframe path, quiz questions) is registered in a central JSON/TypeScript config file used by the listing page.

---

## 🗺️ Routing & Pages

We utilize the Next.js App Router (`src/app/`). Here are the primary routes:

1.  `/` - Landing Page (Hero section, features, CampusPreview)
2.  `/login` - User authentication
3.  `/signup` - Account creation
4.  `/dashboard` - Simulation listing, filtering, and progress overview
5.  `/simulations/[id]` - Dynamic route for the Simulation Detail page
6.  `/profile` - User settings and academic details

---

## 🧱 Reusable Components

We love keeping our code DRY (Don't Repeat Yourself). Reusable UI elements are stored in `src/components/`.

*   **`src/components/ui/`**: General UI elements like Buttons, Inputs, Cards, and Modals (often built with Tailwind/Radix).
*   **`src/components/layout/`**: Structural components like the Navbar, Sidebar, and Footer.
*   **`src/components/home/`**: Landing page specific components (e.g., `CampusPreview.tsx`).
*   **`src/components/simulations/`**: Components like `SimCard.tsx` (for the listing), `ProgressBadge.tsx`, and the `AskAI.tsx` chat interface.

---

## 🚀 Deployment

VisualizeIT is deployed seamlessly on **Vercel**. 
*   Our GitHub repository is linked to Vercel.
*   Every push to the `main` branch triggers an automatic build and deployment pipeline.
*   Environment variables are managed securely within the Vercel dashboard.

---

## 🤝 Contributing: How to Add a New Simulation

Want to add a new simulation? Awesome! Here is the workflow:

1.  **Create the Simulation:** Build your simulation using standard HTML/CSS/JS. Ensure it is responsive and self-contained.
2.  **Add to Public Folder:** Create a new folder in `public/sims/` (e.g., `public/sims/new-concept/`) and place your files there. Ensure there is an entry point like `index.html`.
3.  **Register the Metadata:** Open the central simulation configuration file (usually located in `src/data/simulations.ts` or similar). Add a new object containing:
    *   `id`: "new-concept"
    *   `title`: "Your Awesome Concept"
    *   `description`: "Brief description of what it teaches."
    *   `iframePath`: "/sims/new-concept/index.html"
    *   `tags`: ["Subject", "Topic"]
    *   `quiz`: [Array of quiz questions]
4.  **Test Locally:** Run the dev server, navigate to the dashboard, and make sure your new simulation appears, loads correctly in the iframe, and that the quiz/progress tracking works!
5.  **Submit a PR:** Commit your changes and open a Pull Request. We'll review it and get it merged!

Welcome again to the VisualizeIT team! Let's build something amazing for the students. 🎓💻
