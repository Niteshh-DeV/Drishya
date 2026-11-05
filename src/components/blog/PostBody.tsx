import { Reveal } from "@/components/site/Reveal";
import { cloudinaryUrl } from "@/lib/images";
import type { BlogPostSection } from "@/lib/types";

/** Blank lines separate paragraphs; single line breaks are kept as written. */
function paragraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * A post's sections stitched back together. Shared by the public post page,
 * the editor preview and the admin review queue, so everyone sees exactly
 * what readers will. Text renders as plain React text — never as HTML.
 *
 * Sits in a reading column (max-w-2xl); photos break out a little wider.
 */
export function PostBody({ sections }: { sections: Omit<BlogPostSection, "id">[] }) {
  return (
    <div className="space-y-16">
      {sections.map((section, index) => (
        <Reveal key={index} y={20}>
          <section>
            {section.heading && (
              <h2 className="font-display text-[2rem] font-medium leading-tight text-ink sm:text-4xl">
                {section.heading}
              </h2>
            )}
            <div className={`space-y-6 text-[1.0625rem] leading-[1.85] text-ink/85 ${section.heading ? "mt-5" : ""}`}>
              {paragraphs(section.body).map((text, i) => (
                <p
                  key={i}
                  className={`whitespace-pre-line ${
                    index === 0 && i === 0 ? "font-display text-[1.6rem] leading-[1.45] text-ink sm:text-[1.85rem]" : ""
                  }`}
                >
                  {text}
                </p>
              ))}
            </div>
            {section.imageUrl && (
              <figure className="mt-10 sm:-mx-12 lg:-mx-28">
                <img
                  src={cloudinaryUrl(section.imageUrl, 1600)}
                  alt={section.imageCaption ?? ""}
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover"
                />
                {section.imageCaption && (
                  <figcaption className="mt-3 px-4 text-sm italic text-muted sm:px-12 lg:px-28">
                    {section.imageCaption}
                  </figcaption>
                )}
              </figure>
            )}
          </section>
        </Reveal>
      ))}
    </div>
  );
}
