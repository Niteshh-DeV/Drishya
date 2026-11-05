"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { validatePostInput, type SaveIntent } from "@/lib/blog-input";
import cloudinary from "@/lib/cloudinary";
import {
  createAuthorPost,
  deleteAuthorPost,
  updateAuthorPost,
  type PostPaths,
} from "@/lib/db/blog-authoring";
import type { BlogImage, BlogPostInput } from "@/lib/types";

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
  const base = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`;
  const folder = `${uploadFolder(userId)}/`;
  const images = [input.cover, ...input.sections.map((s) => s.image)].filter(
    (img): img is BlogImage => Boolean(img),
  );
  return images.every(
    (img) =>
      img.publicId.startsWith(folder) &&
      img.url.startsWith(base) &&
      img.url.includes(img.publicId),
  );
}

/** Published pages that showed this post need to drop or update it. */
function refreshPublicPages(paths: PostPaths) {
  if (!paths.wasPublished) return;
  revalidatePath("/blog");
  revalidatePath(`/blog/${paths.slug}`);
  for (const path of paths.destinationPaths) revalidatePath(path);
  for (const id of paths.districtIds) revalidatePath(`/districts/${id}`);
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

/** Upload parameters the browser sends to Cloudinary unchanged; all of them are signed. */
export interface UploadSignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  allowedFormats: string;
  /** Resizes the stored original so phone photos don't eat the free-tier storage. */
  transformation: string;
}

export async function signBlogUpload(): Promise<ActionResult<{ upload: UploadSignature }>> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Please sign in to upload photos." };

  const params = {
    timestamp: Math.round(Date.now() / 1000),
    folder: uploadFolder(userId),
    allowed_formats: "jpg,jpeg,png,webp,heic",
    transformation: "c_limit,w_2400,h_2400",
  };
  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!,
  );
  return {
    ok: true,
    upload: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
      apiKey: process.env.CLOUDINARY_API_KEY!,
      timestamp: params.timestamp,
      signature,
      folder: params.folder,
      allowedFormats: params.allowed_formats,
      transformation: params.transformation,
    },
  };
}
