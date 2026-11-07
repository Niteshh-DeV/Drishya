"use server";

import { auth } from "@/auth";
import { getGuideContact } from "@/lib/db/guides";
import type { GuideContact } from "@/lib/types";

/**
 * A guide's phone and email, for signed-in visitors only. Guide pages are
 * prerendered without them, so numbers never sit in the HTML for scrapers.
 */
export async function revealGuideContact(
  id: string,
): Promise<{ ok: true; contact: GuideContact } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Sign in to see contact details." };
  const contact = await getGuideContact(id);
  if (!contact) return { ok: false, error: "This guide is no longer listed." };
  return { ok: true, contact };
}
