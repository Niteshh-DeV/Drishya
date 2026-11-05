import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { deleteUser, getLinkedProviders } from "@/lib/db/users";

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false },
};

const PROVIDER_NAMES: Record<string, string> = {
  google: "Google",
  facebook: "Facebook",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin?callbackUrl=/account");

  const providers = await getLinkedProviders(session.user.id);

  async function deleteAccount() {
    "use server";
    const current = await auth();
    if (!current?.user) redirect("/signin");
    await deleteUser(current.user.id);
    // Their published stories may be on cached blog, district and place pages.
    revalidatePath("/", "layout");
    await signOut({ redirectTo: "/" });
  }

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-[calc(var(--header-h)+2rem)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
        Account
      </p>
      <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight">
        {session.user.name ?? "Your account"}
      </h1>

      <dl className="mt-8 divide-y divide-line border-y border-line text-sm">
        {session.user.email && (
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-muted">Email</dt>
            <dd className="text-ink">{session.user.email}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4 py-3">
          <dt className="text-muted">Signed in with</dt>
          <dd className="text-ink">
            {providers.map((p) => PROVIDER_NAMES[p] ?? p).join(", ")}
          </dd>
        </div>
      </dl>

      <section className="mt-16 rounded-3xl border border-line p-6">
        <h2 className="font-display text-2xl font-semibold text-ink">Delete my account</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Permanently removes your profile, sign-in links, sessions and every
          story you have written, published or not. This cannot be undone.
        </p>
        <form action={deleteAccount} className="mt-5 space-y-4">
          <label className="flex items-start gap-3 text-sm text-ink">
            <input type="checkbox" name="confirm" required className="mt-1 accent-brass" />
            I understand my account and stories will be deleted permanently.
          </label>
          <button
            type="submit"
            className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent-ink hover:text-accent-ink"
          >
            Delete my account
          </button>
        </form>
      </section>
    </main>
  );
}
