"use client";

import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { pendingReviewCount } from "@/app/admin/posts/actions";

const itemClass =
  "dock-item grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full text-stone outline-none hover:bg-slate/70 hover:text-dock-text focus-visible:bg-slate/70 focus-visible:text-dock-text focus-visible:ring-1 focus-visible:ring-brass/60";

function closeMenu(event: MouseEvent<HTMLElement>) {
  event.currentTarget.closest("details")?.removeAttribute("open");
}

/** Sign-in link, or the traveler's avatar with a small account menu. */
export function AccountButton() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isAdmin = session?.user?.role === "admin";
  const [toReview, setToReview] = useState(0);

  // Re-checked on navigation, so the badge drops after approving a story.
  useEffect(() => {
    if (!isAdmin) return;
    let live = true;
    pendingReviewCount().then((n) => live && setToReview(n), () => {});
    return () => {
      live = false;
    };
  }, [isAdmin, pathname]);

  // Hold the slot while the session loads so the dock doesn't shift.
  if (status === "loading") return <span aria-hidden className="h-9 w-9 shrink-0" />;

  if (!session?.user) {
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

  const { name, email, image } = session.user;
  const initial = (name ?? email ?? "?").charAt(0).toUpperCase();

  return (
    <details className="relative">
      <summary
        aria-label="Account menu"
        className={`${itemClass} cursor-pointer list-none marker:hidden [&::-webkit-details-marker]:hidden`}
      >
        {image ? (
          // Google avatars refuse hotlinking when a referrer is sent.
          <img src={image} alt="" referrerPolicy="no-referrer" className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <span className="grid h-7 w-7 place-items-center rounded-full bg-brass text-xs font-semibold text-forest">
            {initial}
          </span>
        )}
      </summary>
      <div className="dock absolute right-0 top-full z-10 mt-2 min-w-52 rounded-2xl p-1.5 text-sm shadow-xl">
        <p className="truncate px-4 pb-2 pt-2.5 text-xs text-stone">{name ?? email}</p>
        {[
          { label: "Write a story", href: "/blog/write" },
          { label: "My stories", href: "/blog/mine" },
          { label: "Your account", href: "/account" },
          ...(isAdmin ? [{ label: "Review stories", href: "/admin/posts", count: toReview }] : []),
        ].map((item: { label: string; href: string; count?: number }) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={closeMenu}
            className="block rounded-xl px-4 py-2.5 font-medium text-dock-text outline-none hover:bg-slate/70 focus-visible:bg-slate/70 focus-visible:ring-1 focus-visible:ring-brass/60"
          >
            {item.label}
            {item.count ? (
              <span className="ml-2 rounded-full bg-brass px-1.5 py-0.5 text-[10px] font-semibold text-forest-deep">
                {item.count}
              </span>
            ) : null}
          </Link>
        ))}
        <button
          type="button"
          onClick={(event) => {
            closeMenu(event);
            void signOut({ redirectTo: "/" });
          }}
          className="block w-full rounded-xl px-4 py-2.5 text-left font-medium text-dock-text outline-none hover:bg-slate/70 focus-visible:bg-slate/70 focus-visible:ring-1 focus-visible:ring-brass/60"
        >
          Sign out
        </button>
      </div>
    </details>
  );
}
