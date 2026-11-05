import Link from "next/link";
import type { ReactNode } from "react";
import { Magnetic } from "./Magnetic";
import { RevealTitle } from "./RevealTitle";

/**
 * The shared layout for "not found" and error pages, in the same editorial
 * frame as the rest of the site: eyebrow, display title, a hairline, a line
 * of explanation and a way back.
 */
export function NotFoundView({
  eyebrow,
  title,
  body,
  links,
  action,
}: {
  eyebrow: string;
  title: string;
  body: string;
  links: { href: string; label: string }[];
  /** An extra button before the links, e.g. "Try again" on the error page. */
  action?: ReactNode;
}) {
  return (
    <main className="flex min-h-[80vh] items-center bg-paper text-ink">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-[calc(var(--header-h)+4rem)] text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-ink">{eyebrow}</p>
        <RevealTitle
          text={title}
          className="font-display mt-5 text-balance text-[clamp(3rem,9vw,6.5rem)] font-medium uppercase leading-[0.9] tracking-[0.05em] text-ink"
        />
        <div className="mx-auto mt-10 h-16 w-px bg-line" />
        <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{body}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {action}
          {links.map((link, index) => (
            <Magnetic key={link.href}>
              <Link
                href={link.href}
                className={
                  index === 0 && !action
                    ? "inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90"
                    : "inline-block rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-accent-ink hover:text-accent-ink"
                }
              >
                {link.label}
              </Link>
            </Magnetic>
          ))}
        </div>
      </div>
    </main>
  );
}
