"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { validatePostInput, type SaveIntent } from "@/lib/blog-input";
import { inFolder, signUpload, type UploadSignature } from "@/lib/cloudinary-upload";
import {
  createAuthorPost,
  deleteAuthorPost,
  updateAuthorPost,
  type PostPaths,
} from "@/lib/db/blog-authoring";
import type { BlogPostInput } from "@/lib/types";

type ActionResult<T = object> = ({ ok: true } & T) | { ok: false; error: string };

async function requireUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

function uploadFolder(userId: string) {
  return `drishya/blog/${userId}`;
}

/** Photos must be Cloudinary uploads from this traveler's own folder. */
function ownsImages(input: BlogPostInput, userId: string): boolean {
  return inFolder([input.cover, ...input.sections.map((s) => s.image)], uploadFolder(userId));
}

/** Published pages that showed this post need to drop or update it. */
function refreshPublicPages(paths: PostPaths) {
  if (!paths.wasPublished) return;
  revalidatePath("/blog");
  revalidatePath(`/blog/${paths.slug}`);
  for (const path of paths.destinationPaths) revalidatePath(path);
  for (const id of paths.districtIds) revalidatePath(`/districts/${id}`);
  if (paths.authorId) revalidatePath(`/travelers/${paths.authorId}`);
}

/**
 * Creates the post when `id` is null, otherwise updates the traveler's own
 * post. "submit" sends it to the review queue; "draft" keeps it private.
 */
export async function savePost(
  id: string | null,
  raw: unknown,
  intent: SaveIntent,
): Promise<ActionResult<{ id: string }>> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Your session has ended. Please sign in again." };

  const parsed = validatePostInput(raw, intent);
  if (!parsed.ok) return parsed;
  if (!ownsImages(parsed.value, userId)) {
    return { ok: false, error: "One of the photos could not be verified. Please upload it again." };
  }

  const status = intent === "submit" ? "pending" : "draft";
  if (id == null) {
    const created = await createAuthorPost(userId, parsed.value, status);
    return { ok: true, id: created.id };
  }

  const paths = await updateAuthorPost(id, userId, parsed.value, status);
  if (!paths) return { ok: false, error: "That story was not found in your account." };
  refreshPublicPages(paths);
  return { ok: true, id };
}

export async function deletePost(id: string): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Your session has ended. Please sign in again." };

  const paths = await deleteAuthorPost(id, userId);
  if (!paths) return { ok: false, error: "That story was not found in your account." };
  refreshPublicPages(paths);
  revalidatePath("/blog/mine");
  return { ok: true };
}

export async function signBlogUpload(): Promise<ActionResult<{ upload: UploadSignature }>> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Please sign in to upload photos." };
  return { ok: true, upload: signUpload(uploadFolder(userId)) };
}
