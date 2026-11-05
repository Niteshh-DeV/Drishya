import type { Metadata } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { ProfileForm } from "@/components/account/ProfileForm";
import { formatPostDate } from "@/components/blog/PostCard";
import { StatusBadge } from "@/components/blog/StatusBadge";
import { RevealTitle } from "@/components/site/RevealTitle";
import { countAuthorPosts, getAuthorPosts } from "@/lib/db/blog-authoring";
import { deleteUser, getAccountProfile, getLinkedProviders } from "@/lib/db/users";
import type { UserRole } from "@/lib/types";

export const metadata: Metadata = {
  title: "Your profile",
  robots: { index: false },
};

const PROVIDER_NAMES: Record<string, string> = {
  google: "Google",
  facebook: "Facebook",
};

const ROLE_LABELS: Record<UserRole, string> = {
  traveler: "Traveler",
  guide: "Guide",
  admin: "Admin",
};

function joinedLabel(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kathmandu",
  }).format(new Date(iso));
}

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin?callbackUrl=/account");

  const userId = session.user.id;
  const [profile, providers, counts, posts] = await Promise.all([
    getAccountProfile(userId),
    getLinkedProviders(userId),
    countAuthorPosts(userId),
    getAuthorPosts(userId),
  ]);
  if (!profile) redirect("/signin?callbackUrl=/account");

  async function deleteAccount() {
    "use server";
    const current = await auth();
    if (!current?.user) redirect("/signin");
    await deleteUser(current.user.id);
    // Their published stories may be on cached blog, district and place pages.
    revalidatePath("/", "layout");
    await signOut({ redirectTo: "/" });
  }

  const name = profile.name ?? "Traveler";
  const recent = posts.slice(0, 5);
  const stats: [string, number][] = [
    ["Published", counts.published],
    ["In review", counts.pending],
    ["Drafts", counts.draft],
    ["Sent back", counts.rejected],
  ];

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-5 pb-24 pt-[calc(var(--header-h)+4rem)] sm:px-10">
        <header className="flex flex-col items-center text-center">
          {profile.image ? (
            // Google avatars refuse hotlinking when a referrer is sent.
            <img
              src={profile.image}
              alt=""
              referrerPolicy="no-referrer"
              className="h-28 w-28 rounded-full object-cover ring-1 ring-brass/60 ring-offset-4 ring-offset-paper"
            />
          ) : (
            <span className="font-display grid h-28 w-28 place-items-center rounded-full bg-brass text-5xl text-forest-deep ring-1 ring-brass/60 ring-offset-4 ring-offset-paper">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-accent-ink">
            {ROLE_LABELS[profile.role]} · Joined {joinedLabel(profile.joinedAt)}
          </p>
          <RevealTitle
            text={name}
            className="font-display mt-4 max-w-4xl text-balance text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-[0.95] text-ink"
          />
          {profile.bio && (
            <p className="mx-auto mt-6 max-w-xl whitespace-pre-line text-base leading-relaxed text-muted sm:text-lg">
              {profile.bio}
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.18em]">
            {counts.published > 0 && (
              <Link href={`/travelers/${userId}`} className="link-draw pb-0.5 text-accent-ink">
                View your traveler page →
              </Link>
            )}
            <Link href="/blog/write" className="link-draw pb-0.5 text-muted hover:text-ink">
              Write a story
            </Link>
          </div>
        </header>

        <dl className="mx-auto mt-16 grid max-w-4xl grid-cols-2 border-y border-line sm:grid-cols-4">
          {stats.map(([label, value], index) => (
            <div
              key={label}
              className={`px-5 py-6 text-center ${index % 2 === 0 ? "border-r border-line" : ""} ${index < 2 ? "border-b border-line sm:border-b-0" : ""} sm:border-r sm:last:border-r-0`}
            >
              <dt className="text-[10px] uppercase tracking-[0.24em] text-muted">{label}</dt>
              <dd className="font-display mt-2 text-4xl text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mx-auto mt-24 grid max-w-5xl gap-16 lg:grid-cols-[1fr_1fr]">
          <section>
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted">What travelers see</p>
            <h2 className="font-display mt-2 border-b border-line pb-4 text-4xl text-ink">Your profile</h2>
            <div className="mt-8">
              <ProfileForm name={profile.name ?? ""} bio={profile.bio ?? ""} />
            </div>
          </section>

          <section>
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted">Field notes</p>
            <div className="mt-2 flex items-end justify-between gap-4 border-b border-line pb-4">
              <h2 className="font-display text-4xl text-ink">Your stories</h2>
              {posts.length > 0 && (
                <Link href="/blog/mine" className="link-draw pb-0.5 text-xs uppercase tracking-[0.18em] text-muted hover:text-ink">
                  All {posts.length} →
                </Link>
              )}
            </div>
            {recent.length === 0 ? (
              <p className="mt-8 text-sm leading-relaxed text-muted">
                You haven&apos;t written a story yet. Been to the lakes of Ramaroshan or
                up to Khaptad? Tell other travelers how it went.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {recent.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={post.status === "published" ? `/blog/${post.slug}` : `/blog/write/${post.id}`}
                      className="group flex items-center gap-4 py-5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-display truncate text-2xl text-ink transition-colors group-hover:text-accent-ink">
                          {post.title}
                        </p>
                        <p className="mt-1 text-xs text-muted">Updated {formatPostDate(post.updatedAt)}</p>
                      </div>
                      <StatusBadge status={post.status} />
                      <span aria-hidden className="card-arrow text-accent-ink">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section className="mx-auto mt-24 max-w-5xl">
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted">Private</p>
          <h2 className="font-display mt-2 border-b border-line pb-4 text-4xl text-ink">Sign-in</h2>
          <dl className="divide-y divide-line text-sm">
            {profile.email && (
              <div className="flex justify-between gap-4 py-4">
                <dt className="text-muted">Email</dt>
                <dd className="text-ink">{profile.email}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4 py-4">
              <dt className="text-muted">Signed in with</dt>
              <dd className="text-ink">{providers.map((p) => PROVIDER_NAMES[p] ?? p).join(", ")}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Your email is never shown on Drishya. See the{" "}
            <Link href="/privacy" className="link-draw text-ink">
              privacy policy
            </Link>
            .
          </p>
        </section>

        <section className="mx-auto mt-16 max-w-5xl rounded-3xl border border-line p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-ink">Delete my account</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
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
      </div>
    </main>
  );
}
