"use server"

import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function getBookmarkStatus(simulationId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  const { data } = await supabaseAdmin
    .from('bookmarks')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('simulation_id', simulationId)
    .maybeSingle();

  return !!data;
}

export async function addBookmark(simulationId: string): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };

  const { error } = await supabaseAdmin
    .from('bookmarks')
    .insert({ user_id: session.user.id, simulation_id: simulationId });

  // 23505 = unique_violation: already bookmarked — treat as success
  if (error && error.code !== '23505') return { error: error.message };

  return {};
}

export async function removeBookmark(simulationId: string): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };

  const { error } = await supabaseAdmin
    .from('bookmarks')
    .delete()
    .eq('user_id', session.user.id)
    .eq('simulation_id', simulationId);

  if (error) return { error: error.message };

  return {};
}
