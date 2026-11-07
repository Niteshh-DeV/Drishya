"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { inFolder, signUpload, type UploadSignature } from "@/lib/cloudinary-upload";
import { deleteOwnGuideProfile, saveOwnGuideProfile } from "@/lib/db/guide-authoring";
import { validateGuideInput, type GuideSaveIntent } from "@/lib/guide-input";
import { refreshGuidePages } from "@/lib/guide-pages";

type ActionResult<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const SESSION_ENDED = "Your session has ended. Please sign in again.";

async function requireUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

function uploadFolder(userId: string) {
  return `drishya/guides/${userId}`;
}

/**
 * Saves the signed-in user's guide profile. "submit" sends it to the review
 * queue; "draft" keeps it private. Either way a listed profile comes off the
 * directory until it is approved again.
 */
export async function saveGuideProfile(
  raw: unknown,
  intent: GuideSaveIntent,
): Promise<ActionResult<{ id: string }>> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: SESSION_ENDED };

  const parsed = validateGuideInput(raw, intent);
  if (!parsed.ok) return parsed;
  if (!inFolder([parsed.value.photo], uploadFolder(userId))) {
    return { ok: false, error: "The photo could not be verified. Please upload it again." };
  }

  const saved = await saveOwnGuideProfile(userId, parsed.value, intent === "submit" ? "pending" : "draft");
  if (!saved.ok) return saved;
  if (saved.before?.wasPublished) refreshGuidePages(saved.before);
  revalidatePath("/account");
  return { ok: true, id: saved.id };
}

export async function deleteGuideProfile(): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: SESSION_ENDED };

  const paths = await deleteOwnGuideProfile(userId);
  if (!paths) return { ok: false, error: "You don't have a guide profile." };
  if (paths.wasPublished) refreshGuidePages(paths);
  revalidatePath("/account");
  return { ok: true };
}

export async function signGuideUpload(): Promise<ActionResult<{ upload: UploadSignature }>> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Please sign in to upload a photo." };
  return { ok: true, upload: signUpload(uploadFolder(userId)) };
}
