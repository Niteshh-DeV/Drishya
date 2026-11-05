"use client";

import { useEffect } from "react";
import { NotFoundView } from "@/components/site/NotFoundView";

/** Shown when a page fails to render, e.g. the database is briefly unreachable. */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <NotFoundView
      eyebrow="Something went wrong"
      title="A wrong turn"
      body="This page ran into a problem while loading. Trying again usually fixes it; if not, the map and every district are still a click away."
      action={
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      }
      links={[{ href: "/", label: "Back to home" }]}
    />
  );
}
