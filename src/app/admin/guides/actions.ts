"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { approveGuide, rejectGuide } from "@/lib/db/guide-review";
import { refreshGuidePages } from "@/lib/guide-pages";

const NOTE_MAX = 500;

export async function approve(formData: FormData) {
  if (!(await requireAdmin())) throw new Error("Only admins can review guides.");
  const id = String(formData.get("id") ?? "");
  const paths = await approveGuide(id);
  if (paths) refreshGuidePages(paths);
  revalidatePath("/admin/guides");
}

export async function reject(formData: FormData) {
  if (!(await requireAdmin())) throw new Error("Only admins can review guides.");
  const id = String(formData.get("id") ?? "");
  const note = String(formData.get("note") ?? "").trim().slice(0, NOTE_MAX);
  if (!note) throw new Error("Add a note so the guide knows what to change.");
  const paths = await rejectGuide(id, note);
  // Sending back a pending profile changes nothing public; taking one down does.
  if (paths?.wasPublished) refreshGuidePages(paths);
  revalidatePath("/admin/guides");
}
