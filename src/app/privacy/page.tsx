import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Drishya collects when you sign in, and how to delete it.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-[calc(var(--header-h)+2rem)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
        Privacy
      </p>
      <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        Your data on Drishya
      </h1>

      <div className="mt-10 space-y-10 text-base leading-relaxed text-ink/85">
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink">Reading</h2>
          <p className="mt-3">
            You can read every district page, destination and traveler story
            without an account. Drishya does not use advertising or tracking
            cookies.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-ink">Signing in</h2>
          <p className="mt-3">
            Writing a story needs an account. You sign in with Google or
            Facebook, which share your name, email address and profile photo
            with us. We never see or store your password. A session cookie
            keeps you signed in until you sign out or it expires.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-ink">Your stories</h2>
          <p className="mt-3">
            Stories you write, and the photos you upload with them, are stored
            with your account. They stay private until our team reviews and
            publishes them; published stories show the name you chose as the
            byline.
          </p>
          <p className="mt-3">
            Once one of your stories is published, you also get a public
            traveler page. It shows your display name, profile photo, the bio
            you wrote (if any), the month you joined and your published
            stories, and each published story shows your bio under it. Your
            email address and unpublished stories are never shown. You can
            change your name and bio on{" "}
            <Link href="/account" className="underline hover:text-accent-ink">
              your account page
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-ink">Guide profiles</h2>
          <p className="mt-3">
            If you list yourself as a guide, we store what you enter on{" "}
            <Link href="/guide-connect/apply" className="underline hover:text-accent-ink">
              your guide profile
            </Link>
            : headline, description, districts, places, languages, rates, the
            contact phone number and email you give, and a licence number if
            you add one. Nothing is public until our team reviews and lists the
            profile. Your phone number and contact email are then shown only to
            signed-in visitors who ask to see them; the licence number is only
            ever seen by our reviewers. You can unlist or delete the profile at
            any time from the same page.
          </p>
        </section>

        <section id="delete">
          <h2 className="font-display text-2xl font-semibold text-ink">Deleting your data</h2>
          <p className="mt-3">
            Sign in, open{" "}
            <Link href="/account" className="underline hover:text-accent-ink">
              your account page
            </Link>{" "}
            and choose <strong>Delete my account</strong>. This permanently
            removes your profile, your linked Google or Facebook sign-in, your
            sessions, every story you have written and any guide profile. You can also remove
            Drishya from the apps connected to your Google or Facebook account.
          </p>
        </section>
      </div>
    </main>
  );
}
