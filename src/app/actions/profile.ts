"use server"

import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function upsertProfile(formData: {
  display_name: string;
  college: string;
  branch: string;
  year: number;
  semester: number;
  division: string;
}) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabaseAdmin
    .from('profiles')
    .upsert({
      user_id: session.user.id,
      ...formData,
      onboarding_completed: true,
      created_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id'
    });

  if (error) {
    console.error("Profile upsert error:", error);
    throw new Error(error.message);
  }

  revalidatePath('/dashboard');
  revalidatePath('/profile');
  return { success: true };
}

export async function getProfile(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error("Fetch profile error:", error);
    return null;
  }

  return data;
}
