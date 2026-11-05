/**
 * Limits and validation for traveler-written posts. The writing form imports
 * the limits for its counters; the server actions run `validatePostInput` on
 * every save, so nothing the browser sends is trusted as-is.
 */
import type { BlogImage, BlogPostInput, InterestTag } from "@/lib/types";

export const LIMITS = {
  title: 120,
  excerpt: 300,
  authorName: 60,
  heading: 120,
  body: 8000,
  caption: 200,
  credit: 120,
  sections: 20,
  destinations: 6,
  /** Per photo, checked in the browser before upload. */
  imageBytes: 8 * 1024 * 1024,
} as const;

/** Same values as the `InterestTag` lookup table. */
export const INTEREST_TAGS = [
  "Culture", "History", "Religious", "Nature", "Wildlife",
  "Adventure", "Trekking", "Relaxation", "Archaeology",
] as const satisfies readonly InterestTag[];

/** A draft only needs a title; a post sent for review needs the full shape. */
export type SaveIntent = "draft" | "submit";

type Result = { ok: true; value: BlogPostInput } | { ok: false; error: string };

function text(value: unknown, field: string, max: number): string {
  if (value == null) return "";
  if (typeof value !== "string") throw new Error(`${field} must be text.`);
  const trimmed = value.trim();
  if (trimmed.length > max) throw new Error(`${field} is longer than ${max} characters.`);
  return trimmed;
}

function image(value: unknown): BlogImage | undefined {
  if (value == null) return undefined;
  const v = value as Partial<BlogImage>;
  if (typeof v.publicId !== "string" || typeof v.url !== "string") {
    throw new Error("A photo is missing its upload details.");
  }
  return { publicId: v.publicId, url: v.url };
}

export function validatePostInput(raw: unknown, intent: SaveIntent): Result {
  try {
    const input = (raw ?? {}) as Record<string, unknown>;
    const title = text(input.title, "Title", LIMITS.title);
    const excerpt = text(input.excerpt, "Summary", LIMITS.excerpt);
    const authorName = text(input.authorName, "Byline", LIMITS.authorName);
    const coverCredit = text(input.coverCredit, "Cover credit", LIMITS.credit);

    const rawSections = Array.isArray(input.sections) ? input.sections : [];
    if (rawSections.length > LIMITS.sections) {
      throw new Error(`A story can have at most ${LIMITS.sections} sections.`);
    }
    const sections = rawSections.map((s, i) => {
      const section = (s ?? {}) as Record<string, unknown>;
      const n = i + 1;
      const img = image(section.image);
      const caption = text(section.imageCaption, `Section ${n} caption`, LIMITS.caption);
      return {
        heading: text(section.heading, `Section ${n} heading`, LIMITS.heading) || undefined,
        body: text(section.body, `Section ${n} text`, LIMITS.body),
        image: img,
        imageCaption: img && caption ? caption : undefined,
      };
    });

    const destinationIds = [
      ...new Set(
        (Array.isArray(input.destinationIds) ? input.destinationIds : []).filter(
          (id): id is string => typeof id === "string",
        ),
      ),
    ];
    if (destinationIds.length > LIMITS.destinations) {
      throw new Error(`Pick at most ${LIMITS.destinations} places.`);
    }
    const tags = [
      ...new Set(
        (Array.isArray(input.tags) ? input.tags : []).filter((t): t is InterestTag =>
          (INTEREST_TAGS as readonly unknown[]).includes(t),
        ),
      ),
    ];

    if (!title) throw new Error("Give your story a title.");
    if (intent === "submit") {
      if (!excerpt) throw new Error("Add a short summary before sending for review.");
      if (!authorName) throw new Error("Add the name to show as your byline.");
      if (!sections.some((s) => s.body)) {
        throw new Error("Write at least one section before sending for review.");
      }
      if (destinationIds.length === 0) {
        throw new Error("Pick at least one place your story is about.");
      }
    }

    return {
      ok: true,
      value: {
        title,
        excerpt,
        authorName,
        cover: image(input.cover),
        coverCredit: coverCredit || undefined,
        // Drop sections left completely empty in the editor.
        sections: sections.filter((s) => s.body || s.heading || s.image),
        destinationIds,
        tags,
      },
    };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Invalid story." };
  }
}

/** "Planning the trek to Badimalika" → "planning-the-trek-to-badimalika-k3f9q". */
export function makeSlug(title: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .slice(0, 60)
    .replace(/-+$/, "");
  const suffix = Math.random().toString(36).slice(2, 7);
  // Titles written only in Devanagari strip to nothing; the suffix still makes it unique.
  return base ? `${base}-${suffix}` : `story-${suffix}`;
}
