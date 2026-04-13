import NextAuth, { type DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import bcrypt from "bcryptjs"
import { supabaseAdmin } from "@/lib/supabase-admin"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"]
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Query the user from next_auth.users
        const { data: user, error } = await supabaseAdmin
          .schema('next_auth')
          .from('users')
          .select('id, name, email, image, hashed_password')
          .eq('email', email)
          .single();

        if (error || !user) {
          throw new Error("Invalid credentials");
        }

        // If user signed up via Google only (no password set)
        if (!user.hashed_password) {
          throw new Error("This account uses Google sign-in. Please use the Google button.");
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.hashed_password);
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || '';
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If the url is a relative path or from the same origin, allow it
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl + '/dashboard';
    }
  },
  // No custom pages — we use the SignInModal component instead
  // pages: { signIn: '/sign-in' },
})
