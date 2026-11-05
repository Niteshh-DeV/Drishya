/** Account data access, for the account page and its server actions. */
import { prisma } from "./prisma";
import type { AccountProfile } from "@/lib/types";

/** Sign-in providers linked to a user, e.g. ["google"]. */
export async function getLinkedProviders(userId: string): Promise<string[]> {
  const rows = await prisma.account.findMany({
    where: { userId },
    select: { provider: true },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((row) => row.provider);
}

/** Deletes a user; accounts, sessions and blog posts cascade with the row. */
export async function deleteUser(userId: string): Promise<void> {
  await prisma.user.delete({ where: { id: userId } });
}

/** The signed-in traveler's own profile, for the account page. */
export async function getAccountProfile(userId: string): Promise<AccountProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, image: true, bio: true, role: true, createdAt: true },
  });
  if (!user) return null;
  return {
    id: user.id,
    name: user.name ?? undefined,
    email: user.email ?? undefined,
    image: user.image ?? undefined,
    bio: user.bio ?? undefined,
    role: user.role,
    joinedAt: user.createdAt.toISOString(),
  };
}

/**
 * Saves the name and bio shown on the traveler's public page. Auth.js only
 * writes `name` when the account is first created, so an edit here sticks
 * across later sign-ins. Bylines on existing stories keep what was typed
 * in each story's own byline field.
 */
export async function updateProfile(
  userId: string,
  profile: { name: string; bio: string | null },
): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: profile });
}
