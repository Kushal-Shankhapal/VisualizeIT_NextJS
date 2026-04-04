import React from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getProfile } from '@/app/actions/profile';
import ProfileForm from '@/components/auth/ProfileForm';

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/');
  }

  const profile = await getProfile(session.user.id);

  // If already completed and someone navigates here directly, they can still edit,
  // but usually they'd be redirected away if we wanted to enforce one-time.
  // The prompt says "Only show once", but also "redirect users who signed up for the first time 
  // and those who dont have their profile details fully filled to the profile page".

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-2xl">
        <ProfileForm initialData={profile} userName={session.user.name || undefined} />
      </div>
    </div>
  );
}
