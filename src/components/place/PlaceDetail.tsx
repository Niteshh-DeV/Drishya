import Link from "next/link";
import { RelatedStories } from "@/components/blog/PostCard";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { LocalGuides } from "@/components/guides/GuideCard";
import { ParallaxImage } from "@/components/site/ParallaxImage";
import { Reveal } from "@/components/site/Reveal";
import { RevealTitle } from "@/components/site/RevealTitle";
import { cloudinaryUrl, coverImageUrl } from "@/lib/images";
import { displayTitleSize } from "@/lib/typography";
import type {
  BlogPostSummary,
  Destination,
  DestinationImage,
  District,
  GuideSummary,
} from "@/lib/types";
import { DestinationMapLoader } from "./DestinationMapLoader";
import { PlaceCoverImage } from "./PlaceCoverImage";
import { PlaceMenu } from "./PlaceMenu";

interface PlaceDetailProps {
  destination: Destination;
  district: District;
  nextPlace?: { slug: string; name: string };
  nextDistrict?: District;
  stories?: BlogPostSummary[];
  /** Listed guides who named this place among the ones they know. */
  guides?: GuideSummary[];
}

/** Keeps [label, text] rows whose text is present. */
function present(rows: [string, string | undefined][]): [string, string][] {
  return rows.filter((row): row is [string, string] => Boolean(row[1]));
}

function EditorialImage({
  destination,
  photo,
  index,
}: {
  destination: Destination;
  photo: DestinationImage;
  index: number;
}) {
  return (
    <ParallaxImage
      src={cloudinaryUrl(photo.secureUrl, 1600)}
      alt={`${destination.name} view ${index + 2}`}
      className="h-[min(58vh,34rem)] w-full"
    />
  );
}

/** Place-page reveal: a longer rise than the site default. */
function RevealSection(props: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return <Reveal y={40} {...props} />;
}

export function PlaceDetail({
  destination,
  district,
  nextPlace,
  nextDistrict,
  stories = [],
  guides = [],
}: PlaceDetailProps) {
  const image = coverImageUrl(destination);
  const gallery = destination.photos?.slice(1) ?? [];
  const paragraphs = destination.longDescription
    ? destination.longDescription.split(/\n+/).filter(Boolean)
    : [destination.shortDescription];
  const notes = present([
    ["Cultural note", destination.culturalNote],
    ["Safety notes", destination.safetyNotes],
  ]);
  const info = present([
    ["Entry", destination.entryFee],
    ["Best time", destination.bestSeasons.join(", ")],
    ["Budget", destination.budget],
    ["Nearest town", destination.nearestTown],
    ["Elevation", destination.elevationM ? `${destination.elevationM} m` : undefined],
    ["Hours", destination.openingHours],
  ]);
  const menuItems = present([
    ["Description", destination.longDescription ?? destination.shortDescription],
    ["Safety notes", destination.safetyNotes],
    ["How to get there", destination.howToGetThere],
    ["Best time", destination.bestTimeNote ?? destination.bestSeasons.join(", ")],
    ["Nearby stays & food", destination.nearbyStaysFood],
    ["Cultural note", destination.culturalNote],
  ]);
  const practical = present([
    ["How to get there", destination.howToGetThere],
    ["Nearby stays & food", destination.nearbyStaysFood],
    ["Best-time note", destination.bestTimeNote],
    ["Budget note", destination.budgetNote],
  ]);
  const tags = [...destination.category, ...destination.interestTags];

  return (
    <main className="place-page min-h-screen bg-paper text-ink">
      <ReadingProgress />
      <PlaceMenu
        districtName={district.name}
        placeName={destination.name}
        items={menuItems}
      />

      <div className="mx-auto max-w-[90rem] px-5 pb-24 pt-32 sm:px-10 lg:px-16">
        <RevealSection className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-ink">
            {district.name}
          </p>
          <RevealTitle
            text={destination.name}
            className="font-display mt-5 max-w-full text-balance break-words font-medium uppercase leading-[0.88] tracking-[0.06em] text-ink"
            style={{ fontSize: displayTitleSize(destination.name, { maxRem: 9.5, containerRem: 64 }) }}
          />
          {destination.nameNepali && (
            <p className="mt-4 text-lg text-muted">{destination.nameNepali}</p>
          )}
          <div className="mx-auto mt-10 h-20 w-px bg-line" />
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {destination.shortDescription}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
          {destination.hiddenGem && (
            <p className="mx-auto mt-5 max-w-lg text-xs uppercase tracking-[0.18em] text-accent-ink">
              Hidden gem
              {destination.hiddenGemReason
                ? ` · ${destination.hiddenGemReason}`
                : ""}
            </p>
          )}
        </RevealSection>

        {/* Not wrapped in a reveal: a card photo morphs into this frame on
            arrival, so it has to be on screen from the first frame. */}
        {image && (
          <figure className="mx-[calc(50%-50vw)] mt-20">
            <PlaceCoverImage
              destinationId={destination.id}
              src={cloudinaryUrl(image, 2000)}
              alt={destination.name}
            />
            {destination.photoCredit && (
              <figcaption className="mx-5 mt-3 text-right text-[10px] uppercase tracking-[0.16em] text-muted sm:mx-10 lg:mx-16">
                {destination.photoCredit}
              </figcaption>
            )}
          </figure>
        )}

        <div id="destination-details">
        <RevealSection
          className="mx-auto mt-32 max-w-6xl"
          delay={0.15}
        >
          {/* The short description already sits under the title, so the side
              column shows "Best for" only when there is one. */}
          <div
            className={
              destination.bestFor
                ? "grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"
                : "mx-auto max-w-3xl"
            }
          >
            {destination.bestFor && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-muted">Best for</p>
                <p className="font-display mt-4 text-[clamp(1.6rem,2.6vw,2.6rem)] leading-[1.2] text-ink">
                  {destination.bestFor}
                </p>
              </div>
            )}
            <div className="space-y-7 text-[1.0625rem] leading-[1.9] text-ink/80 sm:text-[1.1875rem]">
              {paragraphs.map((paragraph, index) => (
                <RevealSection key={`${paragraph.slice(0, 20)}-${index}`} delay={index * 0.15}>
                  {/* A drop cap needs a few lines to sit in; skip it on a one-liner. */}
                  <p className={index === 0 && paragraph.length > 180 ? "drop-cap" : undefined}>
                    {paragraph}
                  </p>
                </RevealSection>
              ))}
            </div>
          </div>
        </RevealSection>
        </div>

        {practical.length > 0 && (
          <RevealSection className="mx-auto mt-28 max-w-5xl" delay={0.15}>
            <div className="grid gap-8 border-y border-line py-8 sm:grid-cols-2">
              {practical.map(([label, value]) => (
                <div key={label}>
                  <h2 className="text-[11px] uppercase tracking-[0.24em] text-muted">
                    {label}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-ink">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </RevealSection>
        )}

        {gallery[0] && (
          <RevealSection className="mx-auto mt-20 max-w-5xl" delay={0.12}>
            <EditorialImage
              destination={destination}
              photo={gallery[0]}
              index={0}
            />
          </RevealSection>
        )}

        {notes.length > 0 && (
          <RevealSection className="mx-auto mt-32 max-w-3xl" delay={0.15}>
            <div className="space-y-8 border-t border-line pt-8">
              {notes.map(([label, note], index) => (
                <div key={label} className="grid grid-cols-[3rem_1fr] gap-5">
                  <span className="font-display text-2xl text-accent-ink">
                    {["I", "II", "III"][index]}
                  </span>
                  <div>
                    <h2 className="text-[11px] uppercase tracking-[0.24em] text-muted">
                      {label}
                    </h2>
                    <p className="mt-2 text-base leading-relaxed text-muted">
                      {note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        )}

        {gallery[1] && (
          <RevealSection className="mx-auto mt-28 max-w-4xl" delay={0.12}>
            <EditorialImage
              destination={destination}
              photo={gallery[1]}
              index={1}
            />
          </RevealSection>
        )}

        {info.length > 0 && (
          <RevealSection className="mx-auto mt-32 max-w-2xl text-center" delay={0.15}>
            <dl className="border-y border-line">
              {info.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-2 gap-5 border-b border-line py-5 text-left last:border-b-0 sm:grid-cols-[1fr_1.5fr]"
                >
                  <dt className="text-[11px] uppercase tracking-[0.24em] text-muted">
                    {label}
                  </dt>
                  <dd className="text-sm uppercase tracking-[0.12em] text-ink">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </RevealSection>
        )}

        {gallery[2] && (
          <RevealSection className="mx-auto mt-28 max-w-5xl" delay={0.12}>
            <EditorialImage
              destination={destination}
              photo={gallery[2]}
              index={2}
            />
          </RevealSection>
        )}

        <DestinationMapLoader destination={destination} />

        {(destination.alternateNames.length > 0 ||
          (destination.sources?.length ?? 0) > 0 ||
          (destination.verify?.length ?? 0) > 0) && (
          <RevealSection className="mx-auto mt-28 grid max-w-5xl gap-10 border-t border-line pt-8 sm:grid-cols-2" delay={0.15}>
            {destination.alternateNames.length > 0 && (
              <div>
                <h2 className="text-[11px] uppercase tracking-[0.24em] text-muted">
                  Also known as
                </h2>
                <p className="mt-3 text-base leading-relaxed text-ink">
                  {destination.alternateNames.join(" · ")}
                </p>
              </div>
            )}
            {destination.sources && destination.sources.length > 0 && (
              <div>
                <h2 className="text-[11px] uppercase tracking-[0.24em] text-muted">
                  Sources
                </h2>
                <ul className="mt-3 space-y-2 text-sm text-ink">
                  {destination.sources.map((source, index) => (
                    <li key={source.url ?? source.label ?? index}>
                      {source.url ? (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all hover:text-accent-ink"
                        >
                          {source.label ?? source.url}
                        </a>
                      ) : (
                        source.label
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {destination.verify && destination.verify.length > 0 && (
              <p className="text-xs leading-relaxed text-muted sm:col-span-2">
                Some details are still being verified:{" "}
                {destination.verify.join(", ")}.
              </p>
            )}
          </RevealSection>
        )}

        {gallery.length > 3 && (
          <RevealSection
            className="mx-auto mt-28 grid max-w-6xl gap-5 sm:grid-cols-2"
            delay={0.12}
          >
            {gallery.slice(3).map((photo, index) => (
              <EditorialImage
                key={photo.id}
                destination={destination}
                photo={photo}
                index={index + 3}
              />
            ))}
          </RevealSection>
        )}

        <RelatedStories posts={stories} placeName={destination.name} />
        <LocalGuides guides={guides} placeName={destination.name} />

        <RevealSection className="mx-auto mt-36 flex max-w-5xl flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-end sm:justify-between" delay={0.15}>
          <Link href="/map" className="link-draw self-start pb-0.5 text-sm uppercase tracking-[0.2em] text-muted hover:text-accent-ink">
            ← Back to map
          </Link>
          {nextPlace && nextDistrict && (
            <Link
              href={`/districts/${nextDistrict.slug}/${nextPlace.slug}`}
              className="group text-right"
            >
              <span className="block text-[10px] uppercase tracking-[0.22em] text-muted">
                Next place · {nextDistrict.name}
              </span>
              <span className="font-display mt-1 block text-3xl text-ink transition-colors group-hover:text-accent-ink">
                {nextPlace.name} <span aria-hidden className="card-arrow">→</span>
              </span>
            </Link>
          )}
        </RevealSection>
      </div>
    </main>
  );
}
