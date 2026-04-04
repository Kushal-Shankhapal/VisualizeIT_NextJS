export interface Simulation {
  id: string;
  title: string;
  subject: string;
  branch: string;
  year: number;
  description: string;
  tag: string;
  emoji: string;
  path: string;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  college: string;
  branch: string;
  year: number;
  semester: number;
  division: string;
  onboarding_completed: boolean;
  created_at: string;
}
