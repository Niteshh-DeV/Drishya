import Link from "next/link";
import { getDistrict } from "@/data/districts";
import { cloudinaryUrl } from "@/lib/images";
import type { GuideSummary } from "@/lib/types";

/** "Guiding since 2014", or nothing when the guide didn't say. */
export function guidingSinceLabel(year?: number): string | undefined {
  return year ? `Guiding since ${year}` : undefined;
}

export function guideDistrictNames(guide: Pick<GuideSummary, "districtIds">): string[] {
  return guide.districtIds.map((id) => getDistrict(id)?.name).filter((n): n is string => Boolean(n));
}

/**
 * The guide's uploaded portrait, resized through Cloudinary, else their
 * Google/Facebook photo, else an initial on brass.
 */
export function GuidePortrait({
  guide,
  size = "h-16 w-16",
  width = 160,
  className = "",
}: {
  guide: Pick<GuideSummary, "name" | "image">;
  size?: string;
  /** Pixel width to request from Cloudinary. */
  width?: number;
  className?: string;
}) {
  if (guide.image) {
    return (
      // Google avatars refuse hotlinking when a referrer is sent.
      <img
        src={cloudinaryUrl(guide.image, width)}
        alt=""
        referrerPolicy="no-referrer"
        className={`${size} shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={`${size} font-display grid shrink-0 place-items-center rounded-full bg-brass text-2xl font-semibold text-forest-deep ${className}`}
    >
      {guide.name.charAt(0).toUpperCase()}
    </span>
  );
}

export function GuideCard({ guide }: { guide: GuideSummary }) {
  const since = guidingSinceLabel(guide.guidingSince);
  return (
    <Link href={`/guide-connect/${guide.id}`} className="group block border-t border-line pt-6">
      <div className="flex items-center gap-4">
        <GuidePortrait guide={guide} />
        <div className="min-w-0">
          <p className="truncate text-[10px] uppercase tracking-[0.24em] text-accent-ink">
            {guideDistrictNames(guide).join(" · ")}
          </p>
          <h3 className="font-display mt-1 text-[1.75rem] leading-tight text-ink transition-colors group-hover:text-accent-ink">
            {guide.name}
          </h3>
        </div>
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted">{guide.headline}</p>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        {[guide.languages.length > 0 && `Speaks ${guide.languages.join(", ")}`, since]
          .filter(Boolean)
          .join(" · ")}
      </p>
      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-accent-ink">
        View profile <span aria-hidden className="card-arrow">→</span>
      </p>
    </Link>
  );
}

/** "Local guides" on district and destination pages; nothing when there are none. */
export function LocalGuides({ guides, placeName }: { guides: GuideSummary[]; placeName: string }) {
  if (guides.length === 0) return null;

  return (
    <section className="mx-auto mt-28 max-w-6xl">
      <div className="flex items-end justify-between border-b border-line pb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted">Guide Connect</p>
          <h2 className="font-display mt-2 text-4xl text-ink sm:text-5xl">
            Local guides for {placeName}
          </h2>
        </div>
        <Link
          href="/guide-connect"
          className="text-xs uppercase tracking-[0.18em] text-muted hover:text-accent-ink"
        >
          All guides →
        </Link>
      </div>
      <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>
    </section>
  );
}
