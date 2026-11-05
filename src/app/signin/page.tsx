import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { getDistrict } from "@/data/districts";
import { getRandomPhoto } from "@/lib/db/destinations";
import { cloudinaryUrl } from "@/lib/images";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

/** Auth.js error codes travelers can actually hit, in plain words. */
const ERRORS: Record<string, string> = {
  OAuthAccountNotLinked:
    "That email is already linked to a Drishya account through the other sign-in option. Please use that one.",
  AccessDenied: "Sign-in was cancelled or not allowed.",
  Configuration: "Sign-in is not set up correctly on our side. Please try again later.",
};

/** Only same-site paths, so a crafted link can't bounce people elsewhere. */
function safeCallback(value: string | string[] | undefined): string {
  const path = typeof value === "string" ? value : "";
  return path.startsWith("/") && !path.startsWith("//") ? path : "/blog";
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const callbackUrl = safeCallback(query.callbackUrl);
  const session = await auth();
  if (session?.user) redirect(callbackUrl);
  const photo = await getRandomPhoto();

  const error =
    typeof query.error === "string"
      ? (ERRORS[query.error] ?? "Something went wrong while signing in. Please try again.")
      : undefined;

  async function withGoogle() {
    "use server";
    await signIn("google", { redirectTo: callbackUrl });
  }

  async function withFacebook() {
    "use server";
    await signIn("facebook", { redirectTo: callbackUrl });
  }

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 pb-16 pt-[calc(var(--header-h)+2rem)]">
      {photo && (
        <>
          <img
            src={cloudinaryUrl(photo.url, 2000)}
            alt=""
            decoding="async"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          {/* Keeps the card readable over bright skies, in both themes. */}
          <div aria-hidden className="absolute inset-0 -z-10 bg-paper/45" />
          <p className="absolute bottom-4 right-5 text-[10px] uppercase tracking-[0.18em] text-ink">
            {photo.placeName}, {getDistrict(photo.districtId)?.name}
            {photo.credit && ` · ${photo.credit}`}
          </p>
        </>
      )}
      <div className="glass-strong w-full max-w-md rounded-3xl p-8 text-center shadow-2xl sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
          Traveler stories
        </p>
        <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight text-ink">
          Sign in to write
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Reading is open to everyone. Sign in to share your own trip through
          Sudurpaschim — from Kailali&apos;s wetlands to the high pastures of
          Bajura. Our team reads every story before it goes live.
        </p>

        {error && (
          <p role="alert" className="mt-6 rounded-2xl border border-line px-4 py-3 text-sm text-ink">
            {error}
          </p>
        )}

        <div className="mt-8 space-y-3">
          <form action={withGoogle}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-full border border-line bg-paper px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-accent-ink"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5">
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.8z" />
                <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1 .7-2.4 1.1-4 1.1-3.1 0-5.7-2.1-6.7-4.9h-4v3.1A12 12 0 0 0 12 24z" />
                <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1z" />
                <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
              </svg>
              Continue with Google
            </button>
          </form>
          <form action={withFacebook}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-full border border-line bg-paper px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-accent-ink"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5">
                <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z" />
              </svg>
              Continue with Facebook
            </button>
          </form>
        </div>

        <p className="mt-8 text-xs leading-relaxed text-muted">
          We only receive your name, email and profile photo. See our{" "}
          <Link href="/privacy" className="underline hover:text-accent-ink">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
