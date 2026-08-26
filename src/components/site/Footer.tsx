import Link from "next/link";
import { Logo } from "./Logo";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const FOOTER_LINKS: FooterLink[] = [
  { label: "Map", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Guide Connect", href: "/guide-connect" },
  { label: "Hidden Gems", href: "/hidden-gems" },
  { label: "niteshjoshi.me", href: "https://niteshjoshi.me", external: true },
];

const SOCIAL_PLACEHOLDERS = ["Instagram", "YouTube", "Contact"];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-line/25 bg-forest text-dock-text">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <Logo />
          <p className="mt-3 max-w-md text-sm leading-relaxed text-stone/85">
            Drishya · FWU tourism project. Built by the team to map stories,
            stays, and local routes across Sudurpaschim.
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-stone/65">
            Team credit: FWU × Drishya
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
          <p className="mt-3 text-xs text-stone/70">
            {SOCIAL_PLACEHOLDERS.join(" · ")} · coming soon
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.16em] text-stone/65">
            © {year} Drishya
          </p>
        </div>
      </div>
    </footer>
  );
}
