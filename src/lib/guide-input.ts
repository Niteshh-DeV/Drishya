/**
 * Limits and validation for guide profiles. The application form imports the
 * limits and lists; `saveGuideProfile` runs `validateGuideInput` on every
 * save, so nothing the browser sends is trusted as-is.
 */
import { districts } from "@/data/districts";
import { INTEREST_TAGS } from "@/lib/blog-input";
import type { BlogImage, GuideProfileInput, InterestTag } from "@/lib/types";

export const GUIDE_LIMITS = {
  headline: 120,
  about: 2000,
  /** An "about" shorter than this tells a traveler too little to choose a guide. */
  aboutMin: 80,
  rates: 400,
  phone: 20,
  email: 120,
  licenceNo: 40,
  destinations: 12,
  /** Per photo, checked in the browser before upload. */
  imageBytes: 8 * 1024 * 1024,
} as const;

/**
 * Languages a guide can list: the national and link languages, then the
 * languages spoken across the province's hills and Terai.
 */
export const GUIDE_LANGUAGES = [
  "Nepali",
  "English",
  "Hindi",
  "Doteli",
  "Baitadeli",
  "Bajhangi",
  "Bajureli",
  "Achhami",
  "Darchuleli",
  "Dadeldhuri",
  "Tharu",
  "Rana Tharu",
  "Byansi",
] as const;

/** A draft only needs a headline; a profile sent for review needs the full shape. */
export type GuideSaveIntent = "draft" | "submit";

type Result = { ok: true; value: GuideProfileInput } | { ok: false; error: string };

const DISTRICT_IDS = new Set(districts.map((d) => d.id));

function text(value: unknown, field: string, max: number): string {
  if (value == null) return "";
  if (typeof value !== "string") throw new Error(`${field} must be text.`);
  const trimmed = value.trim();
  if (trimmed.length > max) throw new Error(`${field} is longer than ${max} characters.`);
  return trimmed;
}

/** Keep paragraph breaks, but no runs of blank lines. */
function prose(value: unknown, field: string, max: number): string {
  return text(typeof value === "string" ? value.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n") : value, field, max);
}

function strings(value: unknown): string[] {
  return [...new Set((Array.isArray(value) ? value : []).filter((v): v is string => typeof v === "string"))];
}

function photo(value: unknown): BlogImage | undefined {
  if (value == null) return undefined;
  const v = value as Partial<BlogImage>;
  if (typeof v.publicId !== "string" || typeof v.url !== "string") {
    throw new Error("The photo is missing its upload details.");
  }
  return { publicId: v.publicId, url: v.url };
}

/** Digits with optional +, spaces, dashes and brackets: "+977 98-4xxxxxxx", "091 521xxx". */
function isPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return /^\+?[\d\s()-]+$/.test(value) && digits.length >= 7 && digits.length <= 15;
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateGuideInput(raw: unknown, intent: GuideSaveIntent): Result {
  try {
    const input = (raw ?? {}) as Record<string, unknown>;
    const headline = text(input.headline, "Headline", GUIDE_LIMITS.headline).replace(/\s+/g, " ");
    const about = prose(input.about, "About you", GUIDE_LIMITS.about);
    const rates = prose(input.rates, "Rates", GUIDE_LIMITS.rates);
    const phone = text(input.phone, "Phone", GUIDE_LIMITS.phone);
    const contactEmail = text(input.contactEmail, "Contact email", GUIDE_LIMITS.email);
    const licenceNo = text(input.licenceNo, "Licence number", GUIDE_LIMITS.licenceNo);

    let guidingSince: number | undefined;
    if (input.guidingSince != null && input.guidingSince !== "") {
      const year = Number(input.guidingSince);
      const now = new Date().getFullYear();
      if (!Number.isInteger(year) || year < 1960 || year > now) {
        throw new Error(`"Guiding since" should be a year between 1960 and ${now}.`);
      }
      guidingSince = year;
    }

    const districtIds = strings(input.districtIds).filter((id) => DISTRICT_IDS.has(id));
    const destinationIds = strings(input.destinationIds);
    if (destinationIds.length > GUIDE_LIMITS.destinations) {
      throw new Error(`Pick at most ${GUIDE_LIMITS.destinations} places.`);
    }
    const specialties = strings(input.specialties).filter((t): t is InterestTag =>
      (INTEREST_TAGS as readonly string[]).includes(t),
    );
    const languages = strings(input.languages).filter((l) =>
      (GUIDE_LANGUAGES as readonly string[]).includes(l),
    );

    if (phone && !isPhone(phone)) throw new Error("That phone number doesn't look right.");
    if (contactEmail && !isEmail(contactEmail)) throw new Error("That email address doesn't look right.");

    if (!headline) throw new Error("Add a headline — one line on what kind of guiding you do.");
    if (intent === "submit") {
      if (about.length < GUIDE_LIMITS.aboutMin) {
        throw new Error(
          `Tell travelers a little more about yourself (at least ${GUIDE_LIMITS.aboutMin} characters).`,
        );
      }
      if (districtIds.length === 0) throw new Error("Pick at least one district you work in.");
      if (languages.length === 0) throw new Error("Pick the languages you guide in.");
      if (!phone && !contactEmail) {
        throw new Error("Add a phone number or an email so travelers can reach you.");
      }
    }

    return {
      ok: true,
      value: {
        headline,
        about,
        guidingSince,
        photo: photo(input.photo),
        rates,
        phone,
        whatsapp: Boolean(phone) && input.whatsapp === true,
        contactEmail,
        licenceNo,
        districtIds,
        destinationIds,
        specialties,
        languages,
      },
    };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Invalid profile." };
  }
}
