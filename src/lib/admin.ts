import { auth } from "@/auth";

/**
 * The signed-in admin's user id, or null. Sessions are stored in the
 * database, so a role change takes effect on the next request.
 */
export async function requireAdmin(): Promise<string | null> {
  const session = await auth();
  return session?.user?.role === "admin" ? session.user.id : null;
}
