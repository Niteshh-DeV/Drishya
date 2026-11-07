import type { BlogPostStatus } from "@/lib/types";

const STATUS: Record<BlogPostStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "border-line text-muted" },
  pending: { label: "In review", className: "border-accent-ink text-accent-ink" },
  published: { label: "Published", className: "border-ink bg-ink text-paper" },
  rejected: { label: "Not approved", className: "border-line text-ink" },
};

/**
 * Where a traveler's story (or a guide profile — same states) is in review,
 * as a small pill. `label` renames a state, e.g. "Listed" for a guide.
 */
export function StatusBadge({ status, label }: { status: BlogPostStatus; label?: string }) {
  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${STATUS[status].className}`}
    >
      {label ?? STATUS[status].label}
    </span>
  );
}
