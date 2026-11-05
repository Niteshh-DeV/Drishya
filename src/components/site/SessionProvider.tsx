"use client";

import type { ReactNode } from "react";
import { SessionProvider as AuthSessionProvider } from "next-auth/react";

/**
 * Login state for client components (the dock's account button). The
 * session is fetched from /api/auth/session in the browser, which keeps
 * the layout free of cookies and every content page prerendered.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <AuthSessionProvider refetchOnWindowFocus={false}>{children}</AuthSessionProvider>
  );
}
