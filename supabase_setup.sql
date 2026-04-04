-- NextAuth.js Supabase Schema Settings
-- Run this in your Supabase SQL Editor to set up the authentication tables.

-- Create a schema
CREATE SCHEMA IF NOT EXISTS next_auth;
GRANT USAGE ON SCHEMA next_auth TO service_role;
GRANT ALL ON SCHEMA next_auth TO postgres;

-- Create users table
CREATE TABLE IF NOT EXISTS next_auth.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text,
  email text,
  "emailVerified" timestamp with time zone,
  image text,
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

-- Grant appropriate permissions
GRANT ALL ON TABLE next_auth.users TO postgres;
GRANT ALL ON TABLE next_auth.users TO service_role;
GRANT ALL ON TABLE next_auth.accounts TO postgres;
GRANT ALL ON TABLE next_auth.accounts TO service_role;
GRANT ALL ON TABLE next_auth.sessions TO postgres;
GRANT ALL ON TABLE next_auth.sessions TO service_role;
GRANT ALL ON TABLE next_auth.verification_tokens TO postgres;
GRANT ALL ON TABLE next_auth.verification_tokens TO service_role;
