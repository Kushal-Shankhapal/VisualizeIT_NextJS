<div align="center">
  <img src="/public/logo.png" alt="VisualizeIT Logo" width="120" height="120" style="margin-bottom: 20px;" />
  
  # 🚀 VisualizeIT 
  ### *Interactive Engineering Education Reimagined*
  
  [![Next.js 16](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React 19](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
  [![NextAuth v5](https://img.shields.io/badge/NextAuth-v5_Beta-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://authjs.dev/)

  **VisualizeIT** is a high-performance, interactive educational platform designed to bridge the gap between theoretical engineering concepts and practical understanding. Built specifically for the **KBTCOE SE IT 2024 Pattern**, it provides students with a visually rich environment to experiment with complex algorithms and system behaviors.

  [Explore Simulations](#-core-modules) • [Tech Stack](#-tech-stack) • [Installation](#-getting-started) • [Project Structure](#-architecture)
</div>

---

## 🌟 Key Features

- **🎯 Curriculum Aligned**: Specifically mapped to the SE IT 2024 Pattern (SPPU) syllabus.
- **⚡ Interactive Simulations**: Real-time visualizations of DSA, OS Scheduling, and DBMS operations.
- **🔐 Secure Authentication**: Integrated NextAuth v5 with Supabase for robust user management.
- **🎨 Modern HUD UI**: A premium, dark-mode "Heads-Up Display" aesthetic using Tailwind CSS 4 and customized design tokens.
- **📊 Personalized Dashboard**: Tracks user progress, favorite simulations, and academic performance.
- **🎮 Fun Lab & Campus**: Explorable virtual spaces that gamify the learning experience.

---

## 🧩 Core Modules

### 1. 📂 Simulation Vault
The heart of the platform. A searchable, filterable library of interactive modules categorized by subject, semester (III/IV), and unit. 
- **Data Structures**: Sorting, Searching, Linked Lists, Trees, and Graphs.
- **Operating Systems**: CPU Scheduling (FCFS, ROUND ROBIN, SJF), Memory Management.
- **DBMS**: SQL Query execution visualizers and ER Diagram tools.
- **Computer Graphics**: Line drawing, Clipping, and Transformation algorithms.

### 2. 🎓 Academics Portal
A structured view of the curriculum including syllabus breakdowns, lecture notes, and assignment trackers.

### 3. 🧪 Fun Lab
Experimental zone for high-fidelity interactive tools that go beyond the standard curriculum, encouraging creative engineering.

### 4. 🏢 Virtual Campus
A conceptual module providing a digital twin experience of the campus environment, integrating social and academic life.

---

## 🛠 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16.1.6** | Core framework with App Router support. |
| **React 19** | Modern UI library with Concurrent Mode and Server Components. |
| **Tailwind CSS 4** | Next-generation CSS utility framework for rapid, high-performance styling. |
| **Supabase** | Backend-as-a-Service for PostgreSQL database and storage. |
| **NextAuth v5 (Beta)** | Modern authentication framework with Supabase Adapter. |
| **TypeScript** | Static typing for enterprise-grade code reliability. |
| **Framer Motion** | Fluid, spring-based animations for an organic feel. |

---

## 🏗 Architecture

```text
visualize-it/
├── src/
│   ├── app/                # Next.js App Router (Pages & API)
│   │   ├── (auth)/         # Authentication routes
│   │   ├── dashboard/      # User dashboard logic
│   │   ├── simulations/    # Interactive module library
│   │   ├── academics/      # Course-specific content
│   │   ├── campus/         # Virtual campus experience
│   │   └── fun-lab/        # Experimental features
│   ├── components/         # Reusable UI Architecture
│   │   ├── ui/             # Core design system components
│   │   ├── home/           # Landing page sections
│   │   ├── simulations/    # Simulation-specific components
│   │   └── layout/         # Persistent Navbar & Footer
│   ├── lib/                # Shared utilities & configurations
│   │   ├── auth.ts         # NextAuth configuration
│   │   ├── supabase.ts     # Supabase client init
│   │   └── types/          # Global TypeScript interfaces
│   ├── data/               # Local JSON data for simulations/courses
│   └── assets/             # Static images and icons
├── public/                 # Globally accessible static files
├── supabase_setup.sql      # Database schema and table definitions
├── next.config.ts          # Project configuration
└── tailwind.config.ts      # Design system & theme tokens
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- npm / pnpm / yarn
- Supabase account (for database & auth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kushal-Shankhapal/VisualizeIT_NextJS.git
   cd visualize-it
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   AUTH_SECRET=your_auth_js_secret
   ```

4. **Database Setup**
   Run the provided `supabase_setup.sql` in your Supabase SQL Editor to initialize the required tables.

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to see the result.

---

## 📈 Future Roadmap

- [ ] **AI-Powered Learning**: Integration of LLMs for personalized doubt solving.
- [ ] **Real-time Collaboration**: Multi-user simulation rooms for collaborative learning.
- [ ] **3D Campus Map**: Full WebGL implementation of the virtual campus.
- [ ] **Mobile App**: PWA or React Native companion app.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  Developed with ❤️ by <b>Kushal Shankhapal</b> & Team <br/>
  <i>Final Year Project - Computer Engineering</i>
</div>
