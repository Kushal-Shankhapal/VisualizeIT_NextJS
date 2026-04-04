"use server"

import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function trackVisit(simulationId: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  const { error } = await supabaseAdmin
    .from('sim_progress')
    .upsert({
      user_id: session.user.id,
      sim_id: simulationId,
      visited: true,
      visited_at: new Date().toISOString()
    }, {
      onConflict: 'user_id, sim_id'
    });

  if (error) {
    console.error("Track visit error:", error);
  }

  // Also log to recent_activity
  await supabaseAdmin.from('recent_activity').insert({
    user_id: session.user.id,
    simulation_id: simulationId,
    opened_at: new Date().toISOString()
  });
}

export async function submitQuizResult(simulationId: string, score: number, total: number) {
  const session = await auth();
  if (!session?.user?.id) return;

  const quizPassed = (score / total) >= 0.6; // 60% to pass

  const { error: progressError } = await supabaseAdmin
    .from('sim_progress')
    .upsert({
      user_id: session.user.id,
      sim_id: simulationId,
      quiz_attempted: true,
      quiz_passed: quizPassed,
      best_score: score,
      total_questions: total,
      last_attempted: new Date().toISOString()
    }, {
      onConflict: 'user_id, sim_id'
    });

  if (progressError) console.error("Quiz progress update error:", progressError);

  // Log to quiz_results table for history
  const { error: resultError } = await supabaseAdmin
    .from('quiz_results')
    .insert({
      user_id: session.user.id,
      simulation_id: simulationId,
      score: score,
      total: total,
      taken_at: new Date().toISOString()
    });

  if (resultError) console.error("Quiz result log error:", resultError);

  revalidatePath('/dashboard');
  revalidatePath(`/simulations/${simulationId}`);
  return { success: true, passed: quizPassed };
}

export async function getSimProgress(userId: string, simulationId: string) {
  const { data, error } = await supabaseAdmin
    .from('sim_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('sim_id', simulationId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Get sim progress error:", error);
    return null;
  }

  return data;
}

export async function getAllUserProgress(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('sim_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error("Get all user progress error:", error);
    return [];
  }

  return data;
}
