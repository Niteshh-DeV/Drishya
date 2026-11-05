import type { BlogPostStatus } from "@/lib/types";

const STATUS: Record<BlogPostStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "border-line text-muted" },
  pending: { label: "In review", className: "border-accent-ink text-accent-ink" },
  published: { label: "Published", className: "border-ink bg-ink text-paper" },
  rejected: { label: "Not approved", className: "border-line text-ink" },
};

/** Where a traveler's story is in review, as a small pill. */
export function StatusBadge({ status }: { status: BlogPostStatus }) {
  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${STATUS[status].className}`}
    >
      {STATUS[status].label}
    </span>
  );
}
