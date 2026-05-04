"use client"

import React, { useState, useMemo, useEffect } from 'react';
import simulationsData from '@/data/simulations.json';
import SimCard from '@/components/simulations/SimCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface SimulationsClientProps {
  userProfile?: {
    branch: string;
    semester: number;
    year: number;
  } | null;
  isLoggedIn: boolean;
  progressData?: any[];
}

export default function SimulationsClient({ userProfile, isLoggedIn, progressData = [] }: SimulationsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [unitFilter, setUnitFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);

  // Load "show all" preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('visualize_it_show_all');
    if (saved) setShowAll(JSON.parse(saved));
  }, []);

  const handleToggleShowAll = () => {
    const nextValue = !showAll;
    setShowAll(nextValue);
    localStorage.setItem('visualize_it_show_all', JSON.stringify(nextValue));
  };

  const subjects = [
    "All",
    "Data Structures",
    "Operating Systems",
    "Database Management System",
    "Computer Graphics",
    "Theory of Computation"
  ];

  const units = ["All", "Unit I", "Unit II", "Unit III", "Unit IV", "Unit V"];

  const filteredSimulations = useMemo(() => {
    return simulationsData.filter(sim => {
      // 1. Base Filters (Search, Subject, Unit)
      const matchesSearch = sim.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           sim.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = subjectFilter === "All" || sim.subject === subjectFilter;
      const matchesUnit = unitFilter === "All" || sim.unit === unitFilter;

      // 2. Smart Profile Filter (Semester)
      let matchesProfile = true;
      if (isLoggedIn && userProfile && !showAll && semesterFilter === "All") {
        // If 2nd Year IT, show Sem III and IV
        if (userProfile.year === 2) {
            matchesProfile = sim.semester === 3 || sim.semester === 4;
        } else {
            matchesProfile = sim.semester === userProfile.semester;
        }
      }

      // 3. Manual Semester Filter (Overrides Smart Filter)
      const matchesManualSemester = semesterFilter === "All" || 
                                   (semesterFilter === "Semester III" ? sim.semester === 3 : sim.semester === 4);

      return matchesSearch && matchesSubject && matchesUnit && matchesProfile && matchesManualSemester;
    });
  }, [searchQuery, subjectFilter, semesterFilter, unitFilter, showAll, isLoggedIn, userProfile]);

  return (
    <div className="py-32 relative z-10 min-h-screen bg-[var(--bg)]">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <Badge variant="accent" className="mb-4">Simulation Vault</Badge>
            <h1 className="text-5xl lg:text-6xl font-sans text-[var(--text)] font-extrabold tracking-tight">
              Curriculum <span className="text-[var(--text-muted)] font-normal italic">Library</span>
            </h1>
            <p className="mt-4 text-[var(--text-muted)] max-w-2xl text-lg font-medium">
              Browse engineering modules specific to KBTCOE SE IT 2024 Pattern. Filter by semester, unit, or subject to find your lab assignment.
            </p>
          </div>

          {isLoggedIn && userProfile && (
            <div className="flex flex-col items-end gap-3">
              <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-2xl px-4 py-2 flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_8px_var(--accent)]" />
                 <span className="text-xs font-bold text-[var(--accent)] font-mono uppercase tracking-wider">
                    {showAll ? "Viewing All Modules" : `Filtered for ${userProfile.branch} — Sem ${userProfile.year === 2 ? 'III & IV' : userProfile.semester}`}
                 </span>
              </div>
              <button 
                onClick={handleToggleShowAll}
                className="text-[10px] font-mono font-bold text-[var(--text-muted)] hover:text-[var(--accent)] uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                {showAll ? "[ USE_PROFILE_FILTER ]" : "[ SHOW_ALL_SIMULATIONS ]"}
              </button>
            </div>
          )}
        </div>

        {/* Search & Filters */}
        <div className="space-y-6 mb-16">
          {/* Search Bar */}
          <div className="bg-[var(--bg)] shadow-[var(--shadow-recessed)] rounded-2xl px-6 py-4 flex items-center border border-white/5">
            <span className="font-mono text-[var(--accent)] font-bold mr-4 opacity-50">/SEARCH/</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by algorithm name or subject..." 
              className="bg-transparent border-none outline-none w-full text-[var(--text)] font-sans font-bold placeholder-[var(--text-muted)]/30"
            />
          </div>

          {/* Filter Rows */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subject Filter */}
            <div className="bg-[var(--dark-panel)] rounded-2xl p-6 shadow-[var(--shadow-card)] border border-white/5">
              <span className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] block mb-4">01 // Subject_Select</span>
              <select 
                 value={subjectFilter}
                 onChange={(e) => setSubjectFilter(e.target.value)}
                 className="w-full bg-[var(--bg)] text-white font-bold p-3 rounded-xl border border-white/10 shadow-[var(--shadow-recessed)] outline-none cursor-pointer"
              >
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Semester Filter */}
            <div className="bg-[var(--dark-panel)] rounded-2xl p-6 shadow-[var(--shadow-card)] border border-white/5">
              <span className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] block mb-4">02 // Sem_Level</span>
              <div className="flex bg-[var(--bg)] p-1 rounded-xl shadow-[var(--shadow-recessed)] h-[50px]">
                 {["All", "Semester III", "Semester IV"].map(sem => (
                   <button 
                     key={sem}
                     onClick={() => setSemesterFilter(sem)}
                     className={`flex-1 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${semesterFilter === sem ? 'bg-[var(--accent)] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                   >
                     {sem.split(' ')[1] || sem}
                   </button>
                 ))}
              </div>
            </div>

            {/* Unit Filter */}
            <div className="bg-[var(--dark-panel)] rounded-2xl p-6 shadow-[var(--shadow-card)] border border-white/5">
              <span className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] block mb-4">03 // Unit_Access</span>
              <select 
                 value={unitFilter}
                 onChange={(e) => setUnitFilter(e.target.value)}
                 className="w-full bg-[var(--bg)] text-white font-bold p-3 rounded-xl border border-white/10 shadow-[var(--shadow-recessed)] outline-none cursor-pointer"
              >
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div>
          <div className="flex items-center gap-4 mb-8">
             <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
                Library Output
             </h2>
             <div className="h-[1px] bg-white/5 flex-1" />
             <span className="font-mono text-[10px] text-white/30 font-bold uppercase">{filteredSimulations.length} Modules Matched</span>
          </div>

          {filteredSimulations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-1">
              {filteredSimulations.map((sim) => {
                const prog = progressData.find(p => p.sim_id === sim.id);
                const status = prog?.quiz_passed ? 'done' : (prog?.visited ? 'visited' : null);
                return <SimCard key={sim.id} simulation={sim as any} progressStatus={status} />;
              })}
            </div>
          ) : (
            <div className="py-32 text-center bg-[var(--dark-panel)] rounded-[40px] border border-dashed border-white/10 shadow-[var(--shadow-recessed)]">
              <div className="text-6xl mb-6 grayscale opacity-30">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">No Matches Found</h3>
              <p className="text-white/40 font-medium">Try adjusting your filters or refining your search term to find hidden modules.</p>
              <button 
                onClick={() => {setSearchQuery(""); setSubjectFilter("All"); setSemesterFilter("All"); setUnitFilter("All");}}
                className="mt-8 text-[var(--accent)] font-mono text-[10px] font-bold uppercase tracking-[0.2em] hover:brightness-125 transition-all"
              >
                [ RESET_FILTERS ]
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
