"use client";

import { ViewTransition, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Turns every route change into a view transition. Keyed by pathname, the
 * wrapper exits with the old page and enters with the new one, which is what
 * makes React start the transition; `.page-exit` / `.page-enter` in
 * globals.css style it (the old page drifts away as the new one wipes up
 * from the bottom edge). Shared photos (`.morph`) fly above both, and the
 * dock holds still on top (see Header).
 *
 * Updates that keep the pathname (refreshes, server actions, filters,
 * streamed content) don't touch the key, so they never animate the page.
 * Browsers without view transitions simply swap pages.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <ViewTransition key={pathname} enter="page-enter" exit="page-exit" default="none">
      {/* Fills the space between header and footer, so short pages keep
          the footer at the bottom of the window. */}
      <div id="content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </div>
    </ViewTransition>
  );
}
