/**
 * Seed source for blog posts. Real posts are written by travelers through the
 * site; this file only holds the team's sample post, so the blog has
 * something to show before the first traveler submission is approved.
 *
 * Every fact here comes from the Badimalika entry in `bajura.ts` — keep it
 * that way, and replace the post once real traveler stories exist.
 */
import type { InterestTag } from "../../src/lib/types";

export interface BlogPostSeed {
  slug: string;
  title: string;
  excerpt: string;
  authorName: string;
  publishedAt: string;
  /** Destination ids, in the order shown under the post. */
  destinationIds: string[];
  /** Cover = that destination's first photo; section photos follow its gallery order. */
  photosFrom?: string;
  tags: InterestTag[];
  sections: {
    heading?: string;
    body: string;
    /** Index into `photosFrom`'s gallery (0 is the cover). */
    photoIndex?: number;
    imageCaption?: string;
  }[];
}

export const blogPosts: BlogPostSeed[] = [
  {
    slug: "planning-the-trek-to-badimalika",
    title: "Planning the trek to Badimalika",
    excerpt:
      "A 4,220-metre Shakti Peeth above Bajura's rolling patan meadows — how to get there, when to go, and what to carry when there are no lodges on the upper pastures.",
    authorName: "Drishya team",
    publishedAt: "2026-11-04T00:00:00Z",
    destinationIds: ["bajura-badimalika"],
    photosFrom: "bajura-badimalika",
    tags: ["Religious", "Trekking", "Nature"],
    sections: [
      {
        heading: "A temple above the meadows",
        body: "Badimalika stands at 4,220 metres in Bajura, a revered Shakti Peeth dedicated to Bhagwati Durga. The pagoda temple sits above twenty-two alpine grasslands, the patan, where clouds skim the grass and the Api and Saipal ranges fill the horizon.\n\nReaching it takes a demanding multi-day trek, and that is much of its appeal: open pastures, grazing horses and mountain country that has seen very little development.",
        photoIndex: 1,
      },
      {
        heading: "Getting to Martadi",
        body: "The trek starts from Martadi, Bajura's district headquarters. You can fly from Nepalgunj to Kolti Airport, or take a jeep from Dhangadhi to Martadi.\n\nFrom Martadi it is two to three days on foot across high ridges to the summit temple.",
      },
      {
        heading: "When to go",
        body: "The big pilgrimage festival falls in Shrawan, around August, in the middle of the monsoon. For a general trek, autumn and spring bring clearer skies.\n\nThe temple is open all year, but in deep winter snow makes the route practically inaccessible and dangerous, and mid-monsoon trails turn heavily muddy.",
        photoIndex: 2,
      },
      {
        heading: "What to carry",
        body: "There are no permanent hotels or lodges on the upper pastures. Plan on the seasonal pilgrim shelters (dharmashala) or carry your own tent and food, and budget for porters or a guide.\n\nAltitude sickness is a real risk at this height, so acclimatise and bring warm clothing. Phone signal only reaches certain high ridges, though towers near the top have recently extended coverage.",
      },
      {
        heading: "The story behind the temple",
        body: "According to the Swasthani Brata Katha, this is where Sati Devi's left shoulder fell as Lord Shiva wandered the earth carrying her body — which is why Badimalika is counted among the Shakti Peeths, and why pilgrims make the climb every Shrawan.",
      },
    ],
  },
];
