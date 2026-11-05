"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { countAuthorPosts } from "@/lib/db/blog-authoring";
import { getPublishedPostSlugsByAuthor } from "@/lib/db/blog";
import { countPendingPosts } from "@/lib/db/blog-review";
import { updateProfile } from "@/lib/db/users";
import { validateProfileInput } from "@/lib/profile-input";

export interface AccountSummary {
  published: number;
  /** Drafts, stories in review and stories sent back — everything not live. */
  unpublished: number;
  /** Stories waiting in the review queue; admins only, otherwise 0. */
  toReview: number;
}

/** Counts for the account menu in the dock. Null when signed out. */
export async function getAccountSummary(): Promise<AccountSummary | null> {
  const session = await auth();
  if (!session?.user) return null;
  const [counts, toReview] = await Promise.all([
    countAuthorPosts(session.user.id),
    session.user.role === "admin" ? countPendingPosts() : Promise.resolve(0),
  ]);
  return {
    published: counts.published,
    unpublished: counts.draft + counts.pending + counts.rejected,
    toReview,
  };
}

export type ProfileFormState =
  | { status: "idle" }
  | { status: "saved" }
  | { status: "error"; error: string };

/** Saves the traveler's display name and bio from the account page. */
export async function saveProfile(
  _previous: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const session = await auth();
  if (!session?.user) return { status: "error", error: "Your session has ended. Please sign in again." };

  const parsed = validateProfileInput({
    name: String(formData.get("name") ?? ""),
    bio: String(formData.get("bio") ?? ""),
  });
  if (!parsed.ok) return { status: "error", error: parsed.error };

  const userId = session.user.id;
  await updateProfile(userId, parsed.value);

  // The public traveler page shows the name and bio, and each published
  // story shows the bio under "About the author".
  revalidatePath("/account");
  revalidatePath(`/travelers/${userId}`);
  for (const slug of await getPublishedPostSlugsByAuthor(userId)) revalidatePath(`/blog/${slug}`);
  return { status: "saved" };
}
