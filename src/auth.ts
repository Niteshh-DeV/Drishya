/**
 * Auth.js setup. Travelers sign in with Google or Facebook; users, linked
 * accounts and sessions live in Postgres through the Prisma adapter, so
 * Drishya never stores a password.
 *
 * Credentials come from env vars Auth.js reads by name: AUTH_SECRET,
 * AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET, AUTH_FACEBOOK_ID / AUTH_FACEBOOK_SECRET.
 *
 * Only call `auth()` from pages that already render per request (sign-in,
 * writing, admin). Calling it from a shared layout would read cookies on
 * every route and switch the prerendered district pages to dynamic.
 */
import NextAuth from "next-auth";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import type { UserRole } from "@/lib/types";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // The adapter is typed against the default `@prisma/client` output; ours
  // is generated into src/generated/prisma, which has the same model API.
  adapter: PrismaAdapter(prisma as unknown as Parameters<typeof PrismaAdapter>[0]),
  session: { strategy: "database" },
  providers: [
    // Google verifies email ownership, so signing in with Google may join an
    // existing account with the same address (e.g. one first made through
    // Facebook). Facebook doesn't get the same trust.
    Google({ allowDangerousEmailAccountLinking: true }),
    Facebook,
  ],
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      session.user.role = (user as { role?: UserRole }).role ?? "traveler";
      return session;
    },
  },
});
