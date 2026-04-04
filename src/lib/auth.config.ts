import type { NextAuthConfig } from 'next-auth';
import GoogleProvider from "next-auth/providers/google";

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    session({ session, user, token }) {
      if (session.user) {
        // user is available when using database sessions, token is available for JWT
        session.user.id = user?.id || token?.sub || '';
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
