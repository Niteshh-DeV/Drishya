/** Account data access, for the account page and its server actions. */
import { prisma } from "./prisma";

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
