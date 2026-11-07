"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { deleteGuideProfile, saveGuideProfile, signGuideUpload } from "@/app/guide-connect/apply/actions";
import { ImageField } from "@/components/blog/ImageField";
import { districts, getDistrict } from "@/data/districts";
import { INTEREST_TAGS } from "@/lib/blog-input";
import { cloudinaryUrl } from "@/lib/images";
import { GUIDE_LANGUAGES, GUIDE_LIMITS, type GuideSaveIntent } from "@/lib/guide-input";
import type { BlogImage, DestinationOption, GuideProfileInput, GuideStatus, InterestTag } from "@/lib/types";

const field =
  "w-full rounded-2xl border border-line bg-paper px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-accent-ink";
const labelClass = "text-[11px] font-semibold uppercase tracking-[0.2em] text-muted";
const chip = (on: boolean) =>
  `rounded-full border px-3 py-1.5 text-sm transition-colors ${
    on ? "border-accent-ink bg-brass/15 text-accent-ink" : "border-line text-muted hover:text-ink"
  }`;

function Counter({ value, max }: { value: string; max: number }) {
  return (
    <span className={`text-xs ${value.length > max ? "text-accent-ink" : "text-muted"}`}>
      {value.length}/{max}
    </span>
  );
}

/** What the buttons do depends on where the profile is in review, so they say it plainly. */
const ACTIONS: Record<GuideStatus | "new", { draft: string; submit: string; note?: string }> = {
  new: { draft: "Save draft", submit: "Send for review" },
  draft: { draft: "Save draft", submit: "Send for review" },
  pending: {
    draft: "Withdraw to draft",
    submit: "Update submission",
    note: "Your profile is waiting for review. “Update submission” keeps it in the queue with your changes; “Withdraw to draft” takes it out until you send it again.",
  },
  published: {
    draft: "Unlist to draft",
    submit: "Send changes for review",
    note: "Your profile is listed. Sending changes takes it off Guide Connect until the team approves them; unlisting keeps it private as a draft.",
  },
  rejected: {
    draft: "Save draft",
    submit: "Send for review again",
    note: "Your profile was sent back by the team. Make the changes below and send it again.",
  },
};

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export function GuideForm({
  profileId,
  status: initialStatus,
  reviewNote,
  initial,
  places,
  account,
}: {
  profileId: string | null;
  status?: GuideStatus;
  reviewNote?: string;
  initial: GuideProfileInput;
  places: DestinationOption[];
  /** Name and photo come from the account; the form only shows them. */
  account: { name?: string; image?: string };
}) {
  const router = useRouter();
  const [status, setStatus] = useState<GuideStatus | undefined>(initialStatus);
  const [headline, setHeadline] = useState(initial.headline);
  const [about, setAbout] = useState(initial.about);
  const [guidingSince, setGuidingSince] = useState(initial.guidingSince ? String(initial.guidingSince) : "");
  const [photo, setPhoto] = useState<BlogImage | undefined>(initial.photo);
  const [rates, setRates] = useState(initial.rates);
  const [phone, setPhone] = useState(initial.phone);
  const [whatsapp, setWhatsapp] = useState(initial.whatsapp);
  const [contactEmail, setContactEmail] = useState(initial.contactEmail);
  const [licenceNo, setLicenceNo] = useState(initial.licenceNo);
  const [districtIds, setDistrictIds] = useState(initial.districtIds);
  const [destinationIds, setDestinationIds] = useState(initial.destinationIds);
  const [specialties, setSpecialties] = useState<InterestTag[]>(initial.specialties);
  const [languages, setLanguages] = useState(initial.languages);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "ok"; text: string }>();
  const [pending, startTransition] = useTransition();

  const actions = ACTIONS[status ?? "new"];

  const touch = <T,>(set: (value: T) => void) => (value: T) => {
    set(value);
    setDirty(true);
    setMessage(undefined);
  };

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const placesById = useMemo(() => new Map(places.map((p) => [p.id, p])), [places]);
  // Only places in the districts the guide picked, grouped in the map's order.
  const placeGroups = useMemo(
    () =>
      districts
        .filter((d) => districtIds.includes(d.id))
        .map((d) => ({ district: d, places: places.filter((p) => p.districtId === d.id) }))
        .filter((group) => group.places.length > 0),
    [places, districtIds],
  );

  function toggleDistrict(id: string) {
    const next = toggle(districtIds, id);
    touch(setDistrictIds)(next);
    // Dropping a district drops the places listed under it.
    setDestinationIds((ids) => ids.filter((pid) => next.includes(placesById.get(pid)?.districtId ?? "")));
  }

  function save(intent: GuideSaveIntent) {
    setMessage(undefined);
    const input: GuideProfileInput = {
      headline,
      about,
      guidingSince: guidingSince ? Number(guidingSince) : undefined,
      photo,
      rates,
      phone,
      whatsapp: Boolean(phone) && whatsapp,
      contactEmail,
      licenceNo,
      districtIds,
      destinationIds,
      specialties,
      languages,
    };
    startTransition(async () => {
      const result = await saveGuideProfile(input, intent);
      if (!result.ok) {
        setMessage({ tone: "error", text: result.error });
        return;
      }
      setDirty(false);
      setStatus(intent === "submit" ? "pending" : "draft");
      setMessage({
        tone: "ok",
        text:
          intent === "submit"
            ? "Sent for review. We'll list your profile once the team has checked it."
            : "Draft saved.",
      });
      router.refresh();
    });
  }

  function withdraw() {
    if (
      (status === "pending" || status === "published") &&
      !window.confirm(
        status === "published"
          ? "Take your profile off Guide Connect and keep it as a private draft?"
          : "Take your profile out of the review queue?",
      )
    ) {
      return;
    }
    save("draft");
  }

  function remove() {
    if (!window.confirm("Delete your guide profile? Your traveler account and stories stay.")) return;
    startTransition(async () => {
      const result = await deleteGuideProfile();
      if (!result.ok) {
        setMessage({ tone: "error", text: result.error });
        return;
      }
      setDirty(false);
      router.push("/account");
    });
  }

  const statusText =
    message?.text ??
    (pending ? "Saving…" : dirty ? "Unsaved changes" : "Every profile is reviewed before it is listed.");

  const portrait = photo?.url ?? account.image;
  const name = account.name ?? "Your name";

  return (
    <div className="space-y-14">
      {actions.note && (
        <p className="glass rounded-2xl px-5 py-4 text-sm leading-relaxed text-ink">
          {actions.note}
          {status === "rejected" && reviewNote && (
            <span className="mt-2 block">
              <span className="text-muted">Reviewer&apos;s note: </span>
              {reviewNote}
            </span>
          )}
          {status === "published" && profileId && (
            <Link href={`/guide-connect/${profileId}`} className="link-draw mt-2 inline-block text-accent-ink">
              View your listing →
            </Link>
          )}
        </p>
      )}

      <section className="space-y-6">
        <h2 className="font-display border-b border-line pb-3 text-3xl text-ink">About you</h2>

        <div className="flex items-center gap-4 rounded-3xl border border-line p-5">
          {portrait ? (
            <img src={cloudinaryUrl(portrait, 160)} alt="" referrerPolicy="no-referrer" className="h-16 w-16 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="font-display grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brass text-2xl text-forest-deep">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0 text-sm">
            <p className="font-display text-2xl text-ink">{name}</p>
            <p className="mt-1 text-muted">
              Your listing uses your profile name.{" "}
              <Link href="/account" className="link-draw text-ink">
                Change it on your account page
              </Link>
              .
            </p>
          </div>
        </div>

        <div>
          <p className={labelClass}>Portrait (optional)</p>
          <p className="mt-1 text-xs text-muted">
            A clear photo of your face helps travelers recognise you. Without one we use your
            Google or Facebook photo.
          </p>
          <div className="mt-2 max-w-sm">
            <ImageField label="Add a portrait" value={photo} onChange={touch(setPhoto)} sign={signGuideUpload} />
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="headline" className={labelClass}>Headline</label>
            <Counter value={headline} max={GUIDE_LIMITS.headline} />
          </div>
          <input
            id="headline"
            value={headline}
            onChange={(e) => touch(setHeadline)(e.target.value)}
            placeholder="Trekking guide for Khaptad and the Bajhang high country"
            className={`${field} font-display mt-2 text-2xl`}
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="about" className={labelClass}>About you</label>
            <Counter value={about} max={GUIDE_LIMITS.about} />
          </div>
          <textarea
            id="about"
            value={about}
            onChange={(e) => touch(setAbout)(e.target.value)}
            rows={7}
            placeholder="Where you grew up, the routes you walk most, the kind of trips you lead and what travelers should know before going with you. Leave a blank line between paragraphs."
            className={`${field} mt-2 resize-y leading-relaxed`}
          />
        </div>

        <div className="max-w-xs">
          <label htmlFor="since" className={labelClass}>Guiding since (year)</label>
          <input
            id="since"
            type="number"
            inputMode="numeric"
            min={1960}
            max={new Date().getFullYear()}
            value={guidingSince}
            onChange={(e) => touch(setGuidingSince)(e.target.value)}
            placeholder="2015"
            className={`${field} mt-2`}
          />
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="font-display border-b border-line pb-3 text-3xl text-ink">Where you guide</h2>

        <fieldset>
          <legend className={labelClass}>Districts you work in</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {districts.map((d) => {
              const on = districtIds.includes(d.id);
              return (
                <button key={d.id} type="button" aria-pressed={on} onClick={() => toggleDistrict(d.id)} className={chip(on)}>
                  {d.name}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor="place" className={labelClass}>Places you know well (optional)</label>
          <p className="mt-1 text-xs text-muted">
            You&apos;ll be listed on these destination pages as a local guide.
          </p>
          <select
            id="place"
            value=""
            disabled={placeGroups.length === 0 || destinationIds.length >= GUIDE_LIMITS.destinations}
            onChange={(e) => {
              const value = e.target.value;
              if (value && !destinationIds.includes(value)) touch(setDestinationIds)([...destinationIds, value]);
            }}
            className={`${field} mt-2`}
          >
            <option value="">
              {placeGroups.length === 0
                ? "Pick a district first"
                : destinationIds.length >= GUIDE_LIMITS.destinations
                  ? `Up to ${GUIDE_LIMITS.destinations} places`
                  : "Add a place…"}
            </option>
            {placeGroups.map(({ district, places: group }) => (
              <optgroup key={district.id} label={district.name}>
                {group.map((place) => (
                  <option key={place.id} value={place.id} disabled={destinationIds.includes(place.id)}>
                    {place.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {destinationIds.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {destinationIds.map((placeId) => {
                const place = placesById.get(placeId);
                if (!place) return null;
                return (
                  <li key={placeId}>
                    <button
                      type="button"
                      onClick={() => touch(setDestinationIds)(destinationIds.filter((x) => x !== placeId))}
                      className="rounded-full border border-line px-3 py-1.5 text-sm text-ink hover:border-accent-ink hover:text-accent-ink"
                      aria-label={`Remove ${place.name}`}
                    >
                      {place.name}
                      <span className="text-muted"> · {getDistrict(place.districtId)?.name}</span> ×
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <fieldset>
          <legend className={labelClass}>Languages you guide in</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {GUIDE_LANGUAGES.map((language) => {
              const on = languages.includes(language);
              return (
                <button
                  key={language}
                  type="button"
                  aria-pressed={on}
                  onClick={() => touch(setLanguages)(toggle(languages, language))}
                  className={chip(on)}
                >
                  {language}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className={labelClass}>Good for (optional)</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {INTEREST_TAGS.map((tag) => {
              const on = specialties.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={on}
                  onClick={() => touch(setSpecialties)(toggle(specialties, tag))}
                  className={chip(on)}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="rates" className={labelClass}>Rates (optional)</label>
            <Counter value={rates} max={GUIDE_LIMITS.rates} />
          </div>
          <textarea
            id="rates"
            value={rates}
            onChange={(e) => touch(setRates)(e.target.value)}
            rows={3}
            placeholder="What you usually charge per day or per trip, and what it includes — food, porters, permits."
            className={`${field} mt-2 resize-y`}
          />
        </div>
      </section>

      <section className="space-y-6">
        <div className="border-b border-line pb-3">
          <h2 className="font-display text-3xl text-ink">How travelers reach you</h2>
          <p className="mt-1 text-xs text-muted">
            Shown only to signed-in travelers, never in the page itself. Add at least one.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className={labelClass}>Phone</label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              maxLength={GUIDE_LIMITS.phone}
              onChange={(e) => touch(setPhone)(e.target.value)}
              placeholder="98XXXXXXXX"
              className={`${field} mt-2`}
            />
            <label className="mt-3 flex items-center gap-3 text-sm text-ink">
              <input
                type="checkbox"
                checked={whatsapp}
                disabled={!phone}
                onChange={(e) => touch(setWhatsapp)(e.target.checked)}
                className="accent-brass"
              />
              This number is on WhatsApp
            </label>
          </div>
          <div>
            <label htmlFor="contactEmail" className={labelClass}>Email</label>
            <input
              id="contactEmail"
              type="email"
              autoComplete="email"
              value={contactEmail}
              maxLength={GUIDE_LIMITS.email}
              onChange={(e) => touch(setContactEmail)(e.target.value)}
              className={`${field} mt-2`}
            />
          </div>
        </div>
        <div className="max-w-sm">
          <label htmlFor="licence" className={labelClass}>Guide licence number (optional)</label>
          <input
            id="licence"
            value={licenceNo}
            maxLength={GUIDE_LIMITS.licenceNo}
            onChange={(e) => touch(setLicenceNo)(e.target.value)}
            className={`${field} mt-2`}
          />
          <p className="mt-1 text-xs text-muted">Only the Drishya team sees this, to help with review.</p>
        </div>
      </section>

      {profileId && (
        <section className="rounded-3xl border border-line p-6">
          <h2 className="font-display text-2xl font-semibold text-ink">Delete guide profile</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Removes your listing and everything on this page. Your traveler account and
            stories stay.
          </p>
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            className="mt-4 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent-ink hover:text-accent-ink disabled:opacity-50"
          >
            Delete guide profile
          </button>
        </section>
      )}

      <div className="glass-strong sticky bottom-4 z-10 flex flex-col gap-3 rounded-3xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <p
          role={message?.tone === "error" ? "alert" : "status"}
          className={`text-sm ${message?.tone === "error" ? "text-accent-ink" : "text-muted"}`}
        >
          {statusText}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={withdraw}
            disabled={pending}
            className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent-ink disabled:opacity-50"
          >
            {actions.draft}
          </button>
          <button
            type="button"
            onClick={() => save("submit")}
            disabled={pending}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {actions.submit}
          </button>
        </div>
      </div>
    </div>
  );
}
