import React from 'react';
import { auth } from '@/lib/auth';
import { getProfile } from '@/app/actions/profile';
import { getAllUserProgress } from '@/app/actions/sim-progress';
import SimulationsClient from '@/components/simulations/SimulationsClient';

export default async function SimulationsPage() {
  const session = await auth();
  let userProfile = null;
  let progressData = [];

  if (session?.user?.id) {
    userProfile = await getProfile(session.user.id);
    progressData = await getAllUserProgress(session.user.id);
  }

  return (
    <SimulationsClient 
      userProfile={userProfile} 
      isLoggedIn={!!session?.user?.id} 
      progressData={progressData}
    />
  );
}
