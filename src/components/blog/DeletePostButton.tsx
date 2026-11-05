"use client";

import { useTransition } from "react";
import { deletePost } from "@/app/blog/write/actions";

export function DeletePostButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
        startTransition(async () => {
          const result = await deletePost(id);
          if (!result.ok) window.alert(result.error);
        });
      }}
      className="text-xs uppercase tracking-[0.16em] text-muted hover:text-accent-ink disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
