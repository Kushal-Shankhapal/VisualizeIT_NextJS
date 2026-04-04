import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase-admin';
import simulationsData from '@/data/simulations.json';
import Link from 'next/link';
import SimCard from '@/components/simulations/SimCard';
import { getProfile } from '@/app/actions/profile';
import { getAllUserProgress } from '@/app/actions/sim-progress';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session || !session.user?.id) {
    redirect('/');
  }

  const userId = session.user.id;

  // 1. Fetch User Profile
  const profile = await getProfile(userId);

  // 2. Fetch Bookmarks
  const { data: bookmarksRaw } = await supabaseAdmin
    .from('bookmarks')
    .select('simulation_id')
    .eq('user_id', userId);
  
  const bookmarkedIds = bookmarksRaw?.map(b => b.simulation_id) || [];
  const bookmarkedSims = (simulationsData as any).filter((sim: any) => bookmarkedIds.includes(sim.id));

  // 3. Fetch Recent Activity (Distinct by sim_id)
  const { data: activitiesRaw } = await supabaseAdmin
    .from('recent_activity')
    .select('*')
    .eq('user_id', userId)
    .order('opened_at', { ascending: false });

  const uniqueActivity = (activitiesRaw || []).reduce((acc: any[], curr) => {
    if (!acc.find(a => a.simulation_id === curr.simulation_id)) {
      acc.push(curr);
    }
    return acc;
  }, []).slice(0, 5);

  // 4. Fetch Progress Stats
  const progressData = await getAllUserProgress(userId);
  const totalSims = (simulationsData as any).length;
  const visitedCount = progressData.filter(p => p.visited).length;
  const passedCount = progressData.filter(p => p.quiz_passed).length;
  
  // 5. Calculate Average Score
  const totalPassedScore = progressData.reduce((sum, p) => sum + (p.best_score || 0), 0);
  const totalQuestionsMatched = progressData.reduce((sum, p) => sum + (p.total_questions || 0), 0);
  const avgScore = totalQuestionsMatched > 0 
    ? ((totalPassedScore / totalQuestionsMatched) * 100).toFixed(0)
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

        <div className="grid grid-cols-1 gap-12">
          
          {/* Section 1: User Profile & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <Card className="lg:col-span-3 !p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                <div className="w-24 h-24 rounded-3xl p-1 bg-[var(--bg)] shadow-[var(--shadow-card)] border-2 border-[var(--border-light)]/20 relative shrink-0 overflow-hidden">
                  <img 
                    src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=random`} 
                    alt={session.user.name || "User"} 
                    className="w-full h-full rounded-2xl object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-[var(--text)] leading-tight">{profile?.display_name || session.user.name}</h2>
                    {profile?.onboarding_completed && (
                      <Badge className="bg-[#2ed573]/10 text-[#2ed573] border-none uppercase text-[8px] px-2">Profile_Synced</Badge>
                    )}
                  </div>
                  <p className="text-[var(--text-muted)] font-mono text-xs uppercase tracking-widest mb-6 opacity-60">
                    {profile?.branch || 'General'} // Year {profile?.year || 'N/A'} // Division {profile?.division || 'N/A'}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border-light)]/10 shadow-[var(--shadow-recessed)]">
                       <span className="text-[8px] font-mono font-bold text-[var(--text-muted)] uppercase block mb-1">Modules_Explored</span>
                       <span className="text-xl font-bold text-[var(--text)]">{visitedCount}<span className="text-[10px] text-[var(--text-muted)]">/{totalSims}</span></span>
                    </div>
                    <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border-light)]/10 shadow-[var(--shadow-recessed)]">
                       <span className="text-[8px] font-mono font-bold text-[var(--text-muted)] uppercase block mb-1">Quizzes_Cleared</span>
                       <span className="text-xl font-bold text-[#2ed573]">{passedCount}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border-light)]/10 shadow-[var(--shadow-recessed)]">
                       <span className="text-[8px] font-mono font-bold text-[var(--text-muted)] uppercase block mb-1">Avg_Accuracy</span>
                       <span className="text-xl font-bold text-[var(--accent)]">{avgScore}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="flex flex-col justify-center items-center text-center !p-8 bg-[var(--dark-panel)] border-[var(--accent)]/10">
               <span className="font-mono text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">Mastery_Level</span>
               <div className="w-24 h-24 rounded-full bg-[var(--bg)] shadow-[var(--shadow-recessed)] flex items-center justify-center border-4 border-[var(--accent)]/20 mb-4 relative">
                  <div className="absolute inset-0 rounded-full border-4 border-[var(--accent)] border-t-transparent animate-spin duration-[3000ms]" />
                  <span className="text-3xl font-bold text-[var(--text)]">{Math.round((passedCount/totalSims)*100)}%</span>
               </div>
               <Badge variant="accent" className="text-[9px] px-4 py-1 shadow-[0_0_10px_var(--accent)]">
                 {passedCount/totalSims >= 0.8 ? 'Advanced' : passedCount/totalSims >= 0.4 ? 'Intermediate' : 'Novice'}
               </Badge>
            </Card>
          </div>

          {/* Section 2: Bookmarks */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-extrabold text-[var(--text)] tracking-tight uppercase tracking-[0.05em]">Saved Terminal Links</h3>
              <div className="h-[1px] bg-[var(--border-light)]/10 flex-1" />
              <Link href="/simulations">
                <Button variant="ghost" className="text-[10px] uppercase font-bold tracking-widest p-0 h-auto hover:text-[var(--accent)]">Open_Library_Module ↗</Button>
              </Link>
            </div>

            {bookmarkedSims.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {bookmarkedSims.map((sim: any) => {
                  const prog = progressData.find(p => p.sim_id === sim.id);
                  const status = prog?.quiz_passed ? 'done' : (prog?.visited ? 'visited' : null);
                  return <SimCard key={sim.id} simulation={sim} progressStatus={status} />;
                })}
              </div>
            ) : (
              <div className="py-20 text-center bg-[var(--dark-panel)] rounded-[32px] border border-dashed border-white/5 shadow-[var(--shadow-recessed)]">
                 <div className="w-16 h-16 rounded-3xl bg-white/5 mx-auto flex items-center justify-center mb-6">
                    <span className="text-3xl opacity-20">🔖</span>
                 </div>
                 <h4 className="text-xl font-bold text-white uppercase tracking-widest mb-2">No Active Bookmarks</h4>
                 <p className="text-white/40 text-sm max-w-xs mx-auto mb-8">Save simulation modules for high-priority terminal access.</p>
                 <Link href="/simulations">
                    <Button variant="secondary" className="px-8 text-[10px] uppercase font-bold tracking-widest h-11 border border-white/5">Access Repository</Button>
                 </Link>
              </div>
            )}
          </div>

          {/* Section 3: Recent Activity Log */}
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-xl font-extrabold text-[var(--text)] tracking-tight uppercase tracking-[0.05em]">Recent Event Log</h3>
              <div className="h-[1px] bg-[var(--border-light)]/10 flex-1" />
            </div>
            <div className="space-y-3">
              {uniqueActivity.length > 0 ? (
                uniqueActivity.map((act) => {
                  const sim = (simulationsData as any).find((s: any) => s.id === act.simulation_id);
                  if (!sim) return null;
                  const prog = progressData.find(p => p.sim_id === sim.id);
                  return (
                    <div key={act.id} className="bg-[var(--dark-panel)] rounded-2xl p-4 border border-white/5 shadow-[var(--shadow-card)] flex items-center justify-between group hover:border-[var(--accent)]/30 transition-all">
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-12 rounded-xl bg-[var(--bg)] shadow-[var(--shadow-recessed)] flex items-center justify-center text-2xl group-hover:bg-[var(--accent)]/10 transition-colors">
                            {sim.emoji}
                         </div>
                         <div>
                            <h4 className="text-base font-bold text-white mb-1">{sim.title}</h4>
                            <div className="flex items-center gap-3">
                               <Badge className="text-[7px] px-1.5 py-0 opacity-60 tracking-wider">UNIT // {sim.unit}</Badge>
                               <div className="w-1 h-1 rounded-full bg-white/10" />
                               <span className="font-mono text-[9px] text-white/30 uppercase">Last Access: {new Date(act.opened_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                        {prog?.quiz_passed && (
                          <div className="hidden sm:flex items-center gap-2 bg-[#2ed573]/10 px-3 py-1.5 rounded-lg border border-[#2ed573]/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#2ed573]" />
                            <span className="text-[8px] font-mono font-bold text-[#2ed573] uppercase">Mastery_Level_High</span>
                          </div>
                        )}
                        <Link href={`/simulations/${sim.id}`}>
                          <Button 
                            variant="ghost" 
                            className="text-[9px] uppercase font-bold tracking-[0.2em] px-4 h-10 border border-white/5 hover:border-[var(--accent)]/50"
                          >
                            Re_Launch →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-white/20 font-mono text-xs uppercase tracking-widest bg-white/5 border border-dashed border-white/5 rounded-2xl">
                   // No_Recent_Activity_Detected
                </div>
              )}
            </div>
            {uniqueActivity.length > 0 && (
              <p className="mt-6 text-[9px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-widest text-center opacity-40">Showing last 5 active cycles</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
