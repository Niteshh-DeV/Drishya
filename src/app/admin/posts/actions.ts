"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import type { PostPaths } from "@/lib/db/blog-authoring";
import { approvePost, rejectPost } from "@/lib/db/blog-review";

const NOTE_MAX = 500;

/**
 * Every public page that lists the post: the blog index, the post itself,
 * the district and destination pages showing "Stories from here", and the
 * author's traveler page.
 */
function refreshPublicPages(paths: PostPaths) {
  revalidatePath("/blog");
  revalidatePath(`/blog/${paths.slug}`);
  for (const path of paths.destinationPaths) revalidatePath(path);
  for (const id of paths.districtIds) revalidatePath(`/districts/${id}`);
  if (paths.authorId) revalidatePath(`/travelers/${paths.authorId}`);
  revalidatePath("/admin/posts");
}

export async function approve(formData: FormData) {
  if (!(await requireAdmin())) throw new Error("Only admins can review stories.");
  const id = String(formData.get("id") ?? "");
  const paths = await approvePost(id);
  if (paths) refreshPublicPages(paths);
}

export async function reject(formData: FormData) {
  if (!(await requireAdmin())) throw new Error("Only admins can review stories.");
  const id = String(formData.get("id") ?? "");
  const note = String(formData.get("note") ?? "").trim().slice(0, NOTE_MAX);
  if (!note) throw new Error("Add a note so the author knows what to change.");
  const paths = await rejectPost(id, note);
  // Rejecting a pending post changes nothing public; taking one down does.
  if (paths?.wasPublished) refreshPublicPages(paths);
  else revalidatePath("/admin/posts");
}
