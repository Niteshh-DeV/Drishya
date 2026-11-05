"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getAccountSummary, type AccountSummary } from "@/app/account/actions";
import type { UserRole } from "@/lib/types";
import { useDismiss } from "./useDismiss";

const itemClass =
  "dock-item relative grid h-9 w-9 shrink-0 place-items-center rounded-full text-stone outline-none hover:bg-slate/70 hover:text-dock-text focus-visible:bg-slate/70 focus-visible:text-dock-text focus-visible:ring-1 focus-visible:ring-brass/60";

const menuLinkClass =
  "flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 font-medium text-dock-text outline-none transition-colors hover:bg-slate/70 focus-visible:bg-slate/70 focus-visible:ring-1 focus-visible:ring-brass/60";

const ROLE_LABELS: Record<UserRole, string> = {
  traveler: "Traveler",
  guide: "Guide",
  admin: "Admin",
};

function Avatar({ image, initial, size }: { image?: string | null; initial: string; size: string }) {
  return image ? (
    // Google avatars refuse hotlinking when a referrer is sent.
    <img src={image} alt="" referrerPolicy="no-referrer" className={`${size} rounded-full object-cover`} />
  ) : (
    <span className={`${size} font-display grid place-items-center rounded-full bg-brass font-semibold text-forest-deep`}>
      {initial}
    </span>
  );
}

/**
 * Sign-in link, or the traveler's avatar with an account menu: who they
 * are, how many stories they've published (linking to their public page),
 * and their writing and account pages. Admins also see the review queue,
 * with a brass dot on the avatar while stories are waiting.
 */
export function AccountButton() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState<AccountSummary | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const user = session?.user;
  const isAdmin = user?.role === "admin";

  const refresh = useCallback(() => {
    getAccountSummary().then(setSummary, () => {});
  }, []);

  // Load on sign-in, and again each time the menu opens (in the click
  // handler). Admins also re-check on navigation, so the review dot clears
  // after approving a story.
  const userId = user?.id;
  const adminPath = isAdmin ? pathname : null;
  useEffect(() => {
    if (userId) refresh();
  }, [userId, adminPath, refresh]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const close = useCallback(() => setOpen(false), []);
  useDismiss({ open, close, inside: wrapperRef, trigger: buttonRef });

  // Hold the slot while the session loads so the dock doesn't shift.
  if (status === "loading") return <span aria-hidden className="h-9 w-9 shrink-0" />;

  if (!user) {
    return (
      <Link
        href={`/signin?callbackUrl=${encodeURIComponent(pathname)}`}
        aria-label="Sign in"
        title="Sign in"
        className={itemClass}
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      </Link>
    );
  }

  const { name, email, image } = user;
  const initial = (name ?? email ?? "?").charAt(0).toUpperCase();
  const toReview = summary?.toReview ?? 0;
  const published = summary?.published ?? 0;

  const links: { label: string; href: string; count?: number }[] = [
    { label: "Write a story", href: "/blog/write" },
    { label: "My stories", href: "/blog/mine", count: summary ? published + summary.unpublished : undefined },
    { label: "Profile & account", href: "/account" },
    ...(isAdmin ? [{ label: "Review stories", href: "/admin/posts", count: toReview || undefined }] : []),
  ];

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          if (!open) refresh();
          setOpen(!open);
        }}
        className={itemClass}
      >
        <Avatar image={image} initial={initial} size="h-7 w-7 text-xs" />
        {isAdmin && toReview > 0 && (
          <span
            aria-hidden
            className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-brass ring-2 ring-forest"
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Account"
            className="dock absolute right-0 top-full mt-3 w-72 origin-top-right rounded-3xl p-1.5 text-sm shadow-xl"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: reduced ? 0.1 : 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 px-3.5 pb-3 pt-3">
              <Avatar image={image} initial={initial} size="h-11 w-11 text-lg" />
              <div className="min-w-0">
                <p className="truncate font-medium text-dock-text">{name ?? "Traveler"}</p>
                {email && <p className="truncate text-xs text-stone">{email}</p>}
              </div>
              <span className="ml-auto shrink-0 rounded-full border border-brass/50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-brass-light">
                {ROLE_LABELS[user.role] ?? "Traveler"}
              </span>
            </div>

            <div className="mx-1.5 mb-1.5 rounded-2xl bg-forest-deep/45 px-3.5 py-3">
              {summary === null ? (
                <span aria-hidden className="block h-4 w-32 animate-pulse rounded-full bg-stone/15" />
              ) : published > 0 ? (
                <Link
                  href={`/travelers/${user.id}`}
                  role="menuitem"
                  className="group flex items-baseline justify-between gap-3 outline-none"
                >
                  <span className="text-stone">
                    <span className="font-display text-xl text-dock-text">{published}</span>{" "}
                    {published === 1 ? "story" : "stories"} published
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-brass-light">
                    Your page <span className="card-arrow">→</span>
                  </span>
                </Link>
              ) : (
                <p className="text-xs leading-relaxed text-stone">
                  Your traveler page appears once your first story is published.
                </p>
              )}
            </div>

            {links.map((item) => (
              <Link key={item.href} href={item.href} role="menuitem" className={menuLinkClass}>
                {item.label}
                {item.count ? (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      item.href === "/admin/posts" ? "bg-brass text-forest-deep" : "bg-slate/80 text-stone"
                    }`}
                  >
                    {item.count}
                  </span>
                ) : null}
              </Link>
            ))}
            <div className="mx-3 my-1 h-px bg-stone/15" />
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                void signOut({ redirectTo: "/" });
              }}
              className={`${menuLinkClass} w-full text-left text-stone hover:text-dock-text`}
            >
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
