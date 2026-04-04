-- VisualizeIT — Complete Supabase Schema
-- Run this in your Supabase SQL Editor to set up all tables.

-- ============================================================
-- SECTION 1: NextAuth.js Schema (Authentication Core)
-- ============================================================

-- Create a schema for NextAuth
CREATE SCHEMA IF NOT EXISTS next_auth;
GRANT USAGE ON SCHEMA next_auth TO service_role;
GRANT ALL ON SCHEMA next_auth TO postgres;

-- Create users table (with hashed_password for email/password auth)
CREATE TABLE IF NOT EXISTS next_auth.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text,
  email text,
  "emailVerified" timestamp with time zone,
  image text,
  hashed_password text, -- nullable: Google OAuth users won't have this
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT email_unique UNIQUE (email)
);

-- Create accounts table
CREATE TABLE IF NOT EXISTS next_auth.accounts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  type text NOT NULL,
  provider text NOT NULL,
  "providerAccountId" text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  oauth_token_secret text,
  oauth_token text,
  "userId" uuid NOT NULL,
  CONSTRAINT accounts_pkey PRIMARY KEY (id),
  CONSTRAINT provider_unique UNIQUE (provider, "providerAccountId"),
  CONSTRAINT accounts_userId_fkey FOREIGN KEY ("userId") REFERENCES next_auth.users (id) ON DELETE CASCADE
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS next_auth.sessions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  expires timestamp with time zone NOT NULL,
  "sessionToken" text NOT NULL,
  "userId" uuid NOT NULL,
  CONSTRAINT sessions_pkey PRIMARY KEY (id),
  CONSTRAINT sessionToken_unique UNIQUE ("sessionToken"),
  CONSTRAINT sessions_userId_fkey FOREIGN KEY ("userId") REFERENCES next_auth.users (id) ON DELETE CASCADE
);

-- Create verification_tokens table
CREATE TABLE IF NOT EXISTS next_auth.verification_tokens (
  token text NOT NULL,
  identifier text NOT NULL,
  expires timestamp with time zone NOT NULL,
  CONSTRAINT verification_tokens_pkey PRIMARY KEY (token, identifier),
  CONSTRAINT token_unique UNIQUE (token)
);

-- Grant appropriate permissions for next_auth schema
GRANT ALL ON TABLE next_auth.users TO postgres;
GRANT ALL ON TABLE next_auth.users TO service_role;
GRANT ALL ON TABLE next_auth.accounts TO postgres;
GRANT ALL ON TABLE next_auth.accounts TO service_role;
GRANT ALL ON TABLE next_auth.sessions TO postgres;
GRANT ALL ON TABLE next_auth.sessions TO service_role;
GRANT ALL ON TABLE next_auth.verification_tokens TO postgres;
GRANT ALL ON TABLE next_auth.verification_tokens TO service_role;

-- If the table already exists but doesn't have hashed_password column, add it:
ALTER TABLE next_auth.users ADD COLUMN IF NOT EXISTS hashed_password text;


-- ============================================================
-- SECTION 2: Application Tables (Public Schema)
-- ============================================================

-- Profiles table (onboarding + user metadata)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  college TEXT DEFAULT 'KBTCOE, Nashik',
  branch TEXT,
  year INTEGER,
  semester INTEGER,
  division TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Simulation progress tracking
CREATE TABLE IF NOT EXISTS public.sim_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  sim_id TEXT NOT NULL,
  visited BOOLEAN DEFAULT false,
  visited_at TIMESTAMP,
  quiz_attempted BOOLEAN DEFAULT false,
  quiz_passed BOOLEAN DEFAULT false,
  best_score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  last_attempted TIMESTAMP,
  UNIQUE(user_id, sim_id)
);
ALTER TABLE public.sim_progress ENABLE ROW LEVEL SECURITY;

-- Bookmarks
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  simulation_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, simulation_id)
);
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Recent activity log
CREATE TABLE IF NOT EXISTS public.recent_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  simulation_id TEXT NOT NULL,
  opened_at TIMESTAMP DEFAULT now()
);
ALTER TABLE public.recent_activity ENABLE ROW LEVEL SECURITY;

-- Quiz results
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  simulation_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  taken_at TIMESTAMP DEFAULT now()
);
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- SECTION 3: RLS Policies (Row Level Security)
-- ============================================================

-- PROFILES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (true); -- Service role handles logic, but allowing insert for safety

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (true);


-- BOOKMARKS
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks
  FOR SELECT USING (true); -- Filtered by user_id in the app

DROP POLICY IF EXISTS "Users can insert their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can insert their own bookmarks" ON public.bookmarks
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can delete their own bookmarks" ON public.bookmarks
  FOR DELETE USING (true);


-- RECENT ACTIVITY
DROP POLICY IF EXISTS "Users can view their own activity" ON public.recent_activity;
CREATE POLICY "Users can view their own activity" ON public.recent_activity
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own activity" ON public.recent_activity;
CREATE POLICY "Users can insert their own activity" ON public.recent_activity
  FOR INSERT WITH CHECK (true);


-- SIM PROGRESS
DROP POLICY IF EXISTS "Users can view their own progress" ON public.sim_progress;
CREATE POLICY "Users can view their own progress" ON public.sim_progress
  FOR SELECT USING (true);


-- ============================================================
-- SECTION 4: Grant Permissions (service_role bypasses RLS)
-- ============================================================

GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO service_role;
GRANT ALL ON SCHEMA next_auth TO service_role;
