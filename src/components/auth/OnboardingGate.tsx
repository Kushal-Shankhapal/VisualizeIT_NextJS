import React from 'react';
import { auth } from '@/lib/auth';
import { getProfile } from '@/app/actions/profile';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

interface OnboardingGateProps {
  children: React.ReactNode;
}

export default async function OnboardingGate({ children }: OnboardingGateProps) {
  const session = await auth();
  const headerList = await headers();
  const pathname = headerList.get('x-pathname') || '';

  // Only run gate if logged in and NOT on the profile or registration page
  if (session?.user?.id && !pathname.includes('/profile') && !pathname.includes('/api/auth')) {
    const profile = await getProfile(session.user.id);
    
    // If no profile or not completed, redirect to profile page
    if (!profile || !profile.onboarding_completed) {
      redirect('/profile');
    }
  }

  return <>{children}</>;
}
