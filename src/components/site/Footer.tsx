"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const FOOTER_LINKS: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "Map", href: "/map" },
  { label: "Hidden Gems", href: "/hidden-gems" },
  { label: "Field Notes", href: "/blog" },
  { label: "Guide Connect", href: "/guide-connect" },
  { label: "Privacy", href: "/privacy" },
];

/** Team members; a `href` links the name to their own site. */
const TEAM: { name: string; href?: string }[] = [
  { name: "Nitesh Joshi", href: "https://niteshjoshi.me" },
  { name: "Bipana Dhami" },
  { name: "Pooja Bhatt" },
  { name: "Gomati Badu" },
];

export function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();
  if (pathname.startsWith("/place/")) return null;

  return (
    <footer className="mt-20 border-t border-line/25 bg-forest text-dock-text">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <Logo />
          <p className="mt-3 max-w-md text-sm leading-relaxed text-stone/85">
            The districts, destinations and traveler stories of Nepal&apos;s
            Sudurpaschim Province, in one place. A Computer Engineering minor
            project at Far Western University.
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-stone/65">
            Built by{" "}
            {TEAM.map((member, index) => (
              <span key={member.name}>
                {index > 0 && " · "}
                {member.href ? (
                  <a
                    href={member.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline-offset-4 transition-colors hover:text-brass-light hover:underline"
                  >
                    {member.name}
                  </a>
                ) : (
                  member.name
                )}
              </span>
            ))}
          </p>
        </div>

        <div className="text-sm sm:text-right">
          <nav className="flex flex-wrap gap-4 sm:justify-end">
            {FOOTER_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-stone/90 transition-colors hover:text-brass-light"
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer noopener" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="mt-3 text-xs uppercase tracking-[0.16em] text-stone/65">
            © {year} Drishya
          </p>
        </div>
      </div>
    </footer>
  );
}
