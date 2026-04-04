import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import simulationsData from '@/data/simulations.json';
import Link from 'next/link';
import SimCard from '@/components/simulations/SimCard';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session || !session.user?.id) {
    redirect('/');
  }

  // 1. Fetch Bookmarks
  const { data: bookmarksRaw } = await supabase
    .from('bookmarks')
    .select('simulation_id')
    .eq('user_id', session.user.id);
  
  const bookmarkedIds = bookmarksRaw?.map(b => b.simulation_id) || [];
  const bookmarkedSims = simulationsData.filter(sim => bookmarkedIds.includes(sim.id));

  // 2. Fetch Recent Activity
  const { data: activitiesRaw } = await supabase
    .from('recent_activity')
    .select('*')
    .eq('user_id', session.user.id)
    .order('opened_at', { ascending: false });

  const uniqueActivity = (activitiesRaw || []).reduce((acc: any[], curr) => {
    if (!acc.find(a => a.simulation_id === curr.simulation_id)) {
      acc.push(curr);
    }
    return acc;
  }, []).slice(0, 10);

  // 3. Fetch Quiz Results
  const { data: resultsRaw } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('user_id', session.user.id)
    .order('taken_at', { ascending: false })
    .limit(20);

  const avgScore = resultsRaw && resultsRaw.length > 0
    ? (resultsRaw.reduce((sum, r) => sum + r.score, 0) / (resultsRaw.reduce((sum, r) => sum + r.total, 0))).toFixed(1)
    : 0;

  return (
    <div className="py-24 bg-[var(--bg)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <Badge variant="accent" className="mb-4">Internal System Access</Badge>
            <h1 className="text-4xl lg:text-5xl font-sans text-[var(--text)] font-extrabold tracking-tight mb-2">
              User <span className="text-[var(--text-muted)] font-normal italic">Terminal</span>
            </h1>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em]">
              <span className="text-[var(--text-muted)]">Auth_Status:</span>
              <span className="text-[#2ed573] font-bold">Verified</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#2ed573] shadow-[0_0_8px_#2ed573] animate-pulse" />
            </div>
          </div>

          <form action={async () => {
            "use server"
            await signOut({ redirectTo: "/" });
          }}>
            <Button variant="secondary" type="submit" className="px-8 font-bold uppercase text-[10px] tracking-widest h-11 shadow-[var(--shadow-recessed)]">
              Terminate_Session
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 gap-16">
          
          {/* Section 1: User Profile & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 !p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                <div className="w-24 h-24 rounded-full p-1 bg-[var(--bg)] shadow-[var(--shadow-card)] border-4 border-[var(--border-dark)] relative shrink-0">
                  <img 
                    src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=random`} 
                    alt={session.user.name || "User"} 
                    className="w-full h-full rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#2ed573] border-4 border-[var(--bg)] shadow-sm" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[var(--text)] mb-1 leading-tight">{session.user.name}</h2>
                  <p className="text-[var(--text-muted)] font-mono text-xs uppercase tracking-widest mb-6 opacity-60">{session.user.email}</p>
                  
                  <div className="bg-[var(--bg)] rounded-xl p-4 border border-white/5 shadow-[var(--shadow-recessed)] max-w-lg">
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium">
                      <span className="text-[var(--accent)] font-bold font-mono text-[10px] uppercase block mb-1">System Note:</span>
                      Synchronized with KBTCOE SE IT Syllabus. All simulation data, bookmarks, and quiz progress are live.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="flex flex-col justify-center items-center text-center !p-8">
               <span className="font-mono text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">Performance_Index</span>
               <div className="w-24 h-24 rounded-full bg-[var(--bg)] shadow-[var(--shadow-recessed)] flex items-center justify-center border-4 border-[var(--accent)]/20 mb-4">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold text-[var(--text)]">{avgScore}</span>
                    <span className="text-[8px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-widest">Avg_Score</span>
                  </div>
               </div>
               <Badge className="text-[9px] px-4 py-1">Across {resultsRaw?.length || 0} Quizzes</Badge>
            </Card>
          </div>

          {/* Section 2: Bookmarks */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-2xl font-extrabold text-[var(--text)] tracking-tight">Active Bookmarks</h3>
              <div className="h-[1px] bg-[var(--border-light)]/10 flex-1" />
              <Badge variant="recessed">{bookmarkedSims.length} Units</Badge>
            </div>

            {bookmarkedSims.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {bookmarkedSims.map((sim) => (
                  <SimCard key={sim.id} simulation={sim as any} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-[var(--dark-panel)] rounded-[32px] border border-dashed border-white/5 shadow-[var(--shadow-recessed)]">
                 <div className="w-16 h-16 rounded-3xl bg-white/5 mx-auto flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                 </div>
                 <h4 className="text-xl font-bold text-white uppercase tracking-widest mb-2">No Saved Modules</h4>
                 <p className="text-white/40 text-sm max-w-xs mx-auto mb-8">Bookmark simulations for quick access from your terminal.</p>
                 <Link href="/simulations">
                    <Button variant="secondary" className="px-8 text-[10px] uppercase font-bold tracking-widest">Open Library</Button>
                 </Link>
              </div>
            )}
          </div>

          {/* Section 3: Activity & Quizzes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Recent Activity */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-xl font-extrabold text-[var(--text)] tracking-tight uppercase tracking-[0.05em]">Recent Activity</h3>
                <div className="h-[1px] bg-[var(--border-light)]/10 flex-1" />
              </div>
              <div className="space-y-4">
                {uniqueActivity.length > 0 ? (
                  uniqueActivity.map((act) => {
                    const sim = simulationsData.find(s => s.id === act.simulation_id);
                    if (!sim) return null;
                    return (
                      <div key={act.id} className="bg-[var(--dark-panel)] rounded-2xl p-4 border border-white/5 shadow-[var(--shadow-card)] flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-[var(--bg)] shadow-[var(--shadow-recessed)] flex items-center justify-center text-xl">
                              {sim.emoji}
                           </div>
                           <div>
                              <h4 className="text-sm font-bold text-white group-hover:text-[var(--accent)] transition-colors">{sim.title}</h4>
                              <div className="flex items-center gap-2">
                                 <Badge className="text-[7px] px-1.5 py-0 opacity-60 tracking-wider">#{sim.subjectCode}</Badge>
                                 <span className="font-mono text-[8px] text-white/20 uppercase">Opened: {new Date(act.opened_at).toLocaleDateString()}</span>
                              </div>
                           </div>
                        </div>
                        <Button 
                          variant="secondary" 
                          className="text-[8px] uppercase font-bold tracking-[0.2em] px-3 h-8 shadow-sm"
                          onClick={() => window.open(sim.url, '_blank')}
                        >
                          Open_Again
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-white/20 font-mono text-xs uppercase tracking-widest bg-white/5 border border-dashed border-white/5 rounded-2xl">
                     // No_Activity_Logged
                  </div>
                )}
              </div>
            </div>

            {/* Quiz Results */}
            <div>
               <div className="flex items-center gap-4 mb-8">
                <h3 className="text-xl font-extrabold text-[var(--text)] tracking-tight uppercase tracking-[0.05em]">Quiz Results</h3>
                <div className="h-[1px] bg-[var(--border-light)]/10 flex-1" />
              </div>
              <div className="space-y-4">
                 {resultsRaw && resultsRaw.length > 0 ? (
                   resultsRaw.map((res) => {
                     const sim = simulationsData.find(s => s.id === res.simulation_id);
                     if (!sim) return null;
                     const percentage = (res.score / res.total) * 100;
                     const color = percentage >= 80 ? 'bg-[#2ed573]' : percentage >= 50 ? 'bg-[#ffa502]' : 'bg-[#ff4757]';
                     
                     return (
                       <div key={res.id} className="bg-[var(--dark-panel)] rounded-2xl p-4 border border-white/5 shadow-[var(--shadow-card)] flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_currentColor] animate-pulse shrink-0`} />
                             <div>
                                <h4 className="text-sm font-bold text-white">{sim.title}</h4>
                                <span className="font-mono text-[8px] text-white/20 uppercase">{new Date(res.taken_at).toLocaleDateString()}</span>
                             </div>
                          </div>
                          <div className="bg-[var(--bg)] px-3 py-1.5 rounded-xl shadow-[var(--shadow-recessed)] border border-white/5 flex items-center gap-2">
                             <span className="font-mono text-xs font-bold text-white">{res.score}/{res.total}</span>
                             <div className="w-[1px] h-3 bg-white/10" />
                             <span className={`font-mono text-[9px] font-bold uppercase ${percentage >= 80 ? 'text-[#2ed573]' : 'text-[var(--text-muted)]'}`}>
                                {percentage === 100 ? 'EXCL' : percentage >= 80 ? 'PASS' : 'REVW'}
                             </span>
                          </div>
                       </div>
                     );
                   })
                 ) : (
                  <div className="py-12 text-center text-white/20 font-mono text-xs uppercase tracking-widest bg-white/5 border border-dashed border-white/5 rounded-2xl">
                     // No_Results_Sync
                  </div>
                 )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
