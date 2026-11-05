"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { savePost } from "@/app/blog/write/actions";
import { districts, getDistrict } from "@/data/districts";
import { INTEREST_TAGS, LIMITS, type SaveIntent } from "@/lib/blog-input";
import { cloudinaryUrl } from "@/lib/images";
import type {
  BlogImage,
  BlogPostInput,
  BlogPostStatus,
  DestinationOption,
  InterestTag,
} from "@/lib/types";
import { ImageField } from "./ImageField";
import { PostBody } from "./PostBody";

type Section = BlogPostInput["sections"][number] & { key: string };

const field =
  "w-full rounded-2xl border border-line bg-paper px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-accent-ink";
const labelClass = "text-[11px] font-semibold uppercase tracking-[0.2em] text-muted";

/** Quiet period after the last edit before a draft saves itself. */
const AUTOSAVE_MS = 8000;

let keySeed = 0;
const newKey = () => `s${Date.now().toString(36)}${(keySeed++).toString(36)}`;
const emptySection = (): Section => ({ key: newKey(), body: "" });

function Counter({ value, max }: { value: string; max: number }) {
  return (
    <span className={`text-xs ${value.length > max ? "text-accent-ink" : "text-muted"}`}>
      {value.length}/{max}
    </span>
  );
}

/**
 * What each button does depends on where the post is in review, so the
 * labels say it plainly — "Save draft" on a post in the queue would
 * otherwise pull it out without the author realising.
 */
const ACTIONS: Record<BlogPostStatus | "new", { draft: string; submit: string; note?: string }> = {
  new: { draft: "Save draft", submit: "Send for review" },
  draft: { draft: "Save draft", submit: "Send for review" },
  pending: {
    draft: "Withdraw to draft",
    submit: "Update submission",
    note: "This story is waiting for review. “Update submission” keeps it in the queue with your changes; “Withdraw to draft” takes it out until you send it again.",
  },
  published: {
    draft: "Unpublish to draft",
    submit: "Send changes for review",
    note: "This story is live. Sending changes takes it off the site until the team approves them; unpublishing keeps it private as a draft.",
  },
  rejected: {
    draft: "Save draft",
    submit: "Send for review again",
    note: "This story was sent back by the team. Make the changes below and send it again.",
  },
};

function timeLabel(date: Date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function PostEditor({
  postId,
  status: initialStatus,
  reviewNote,
  initial,
  places,
}: {
  postId: string | null;
  status?: BlogPostStatus;
  reviewNote?: string;
  initial: BlogPostInput;
  places: DestinationOption[];
}) {
  const router = useRouter();
  const [id, setId] = useState(postId);
  const [status, setStatus] = useState<BlogPostStatus | undefined>(initialStatus);
  const [title, setTitle] = useState(initial.title);
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [authorName, setAuthorName] = useState(initial.authorName);
  const [cover, setCover] = useState<BlogImage | undefined>(initial.cover);
  const [coverCredit, setCoverCredit] = useState(initial.coverCredit ?? "");
  const [sections, setSections] = useState<Section[]>(() =>
    initial.sections.length
      ? initial.sections.map((s) => ({ ...s, key: newKey() }))
      : [emptySection()],
  );
  const [destinationIds, setDestinationIds] = useState(initial.destinationIds);
  const [tags, setTags] = useState<InterestTag[]>(initial.tags);
  const [mode, setMode] = useState<"write" | "preview">("write");
  // Bumped on every edit; autosave and the "unsaved" marker key off it.
  const [version, setVersion] = useState(0);
  const [savedVersion, setSavedVersion] = useState(0);
  const [savedAt, setSavedAt] = useState<Date>();
  const [message, setMessage] = useState<{ tone: "error" | "ok"; text: string }>();
  const [pending, startTransition] = useTransition();

  const dirty = version !== savedVersion;
  const actions = ACTIONS[status ?? "new"];
  const autosaves = status === undefined || status === "draft";

  const touch = <T,>(set: (value: T) => void) => (value: T) => {
    set(value);
    setVersion((v) => v + 1);
    setMessage(undefined);
  };

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const placesById = useMemo(() => new Map(places.map((p) => [p.id, p])), [places]);
  const placesByDistrict = useMemo(
    () =>
      districts
        .map((d) => ({ district: d, places: places.filter((p) => p.districtId === d.id) }))
        .filter((group) => group.places.length > 0),
    [places],
  );

  const input: BlogPostInput = {
    title,
    excerpt,
    authorName,
    cover,
    coverCredit: coverCredit || undefined,
    sections: sections.map(({ key: _key, ...section }) => section),
    destinationIds,
    tags,
  };
  const inputRef = useRef(input);
  inputRef.current = input;
  const idRef = useRef(id);
  idRef.current = id;

  const save = useCallback(
    (intent: SaveIntent, { quiet = false } = {}) => {
      if (!quiet) setMessage(undefined);
      const snapshot = version;
      startTransition(async () => {
        const result = await savePost(idRef.current, inputRef.current, intent);
        if (!result.ok) {
          // Autosave stays silent about validation; a manual save shows it.
          if (!quiet) setMessage({ tone: "error", text: result.error });
          return;
        }
        setSavedVersion(snapshot);
        setSavedAt(new Date());
        if (intent === "submit") {
          router.push("/blog/mine?submitted=1");
          return;
        }
        setStatus("draft");
        if (!quiet) setMessage({ tone: "ok", text: "Draft saved." });
        if (!idRef.current) {
          setId(result.id);
          idRef.current = result.id;
          // Swap the URL without remounting the form mid-typing.
          window.history.replaceState(null, "", `/blog/write/${result.id}`);
        }
      });
    },
    [router, version],
  );

  useEffect(() => {
    if (!autosaves || !dirty || !title.trim() || pending) return;
    const timer = setTimeout(() => save("draft", { quiet: true }), AUTOSAVE_MS);
    return () => clearTimeout(timer);
  }, [autosaves, dirty, title, pending, save]);

  function updateSection(key: string, patch: Partial<Section>) {
    setSections((list) => list.map((s) => (s.key === key ? { ...s, ...patch } : s)));
    setVersion((v) => v + 1);
    setMessage(undefined);
  }

  function moveSection(index: number, by: -1 | 1) {
    setSections((list) => {
      const next = [...list];
      const [item] = next.splice(index, 1);
      next.splice(index + by, 0, item);
      return next;
    });
    setVersion((v) => v + 1);
  }

  function withdraw() {
    if (
      (status === "pending" || status === "published") &&
      !window.confirm(
        status === "published"
          ? "Take this story off the site and keep it as a private draft?"
          : "Take this story out of the review queue?",
      )
    ) {
      return;
    }
    save("draft");
  }

  const statusText =
    message?.text ??
    (pending
      ? "Saving…"
      : dirty
        ? autosaves && title.trim()
          ? "Unsaved changes — saving shortly"
          : "Unsaved changes"
        : savedAt
          ? `Saved at ${timeLabel(savedAt)}`
          : "Every story is reviewed before it is published.");

  const previewDistricts = [
    ...new Set(
      destinationIds
        .map((pid) => getDistrict(placesById.get(pid)?.districtId ?? "")?.name)
        .filter(Boolean),
    ),
  ];

  return (
    <div className="space-y-10">
      {actions.note && (
        <p className="glass rounded-2xl px-5 py-4 text-sm leading-relaxed text-ink">
          {actions.note}
          {status === "rejected" && reviewNote && (
            <span className="mt-2 block">
              <span className="text-muted">Reviewer&apos;s note: </span>
              {reviewNote}
            </span>
          )}
        </p>
      )}

      <div role="tablist" aria-label="Editor mode" className="flex gap-1 border-b border-line">
        {(["write", "preview"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
              mode === m ? "border-accent-ink text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {m === "write" ? "Write" : "Preview"}
          </button>
        ))}
      </div>

      {mode === "preview" ? (
        <article className="overflow-hidden">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-accent-ink">
            {["Traveler story", previewDistricts.join(" · ")].filter(Boolean).join(" — ")}
          </p>
          <h1 className="font-display mt-4 text-center text-5xl font-medium leading-tight text-ink text-balance break-words">
            {title || <span className="text-muted">Your title</span>}
          </h1>
          {excerpt && (
            <p className="mx-auto mt-5 max-w-xl text-center leading-relaxed text-muted">{excerpt}</p>
          )}
          {authorName && <p className="mt-5 text-center text-sm text-ink">By {authorName}</p>}
          {cover && (
            <img src={cloudinaryUrl(cover.url, 1400)} alt="" className="mt-10 max-h-[28rem] w-full object-cover" />
          )}
          <div className="mx-auto mt-12 max-w-2xl px-1 sm:px-12">
            {input.sections.some((s) => s.body || s.heading || s.image) ? (
              <PostBody
                sections={input.sections.map((s) => ({
                  heading: s.heading,
                  body: s.body,
                  imageUrl: s.image?.url,
                  imageCaption: s.imageCaption,
                }))}
              />
            ) : (
              <p className="text-center text-sm text-muted">Your sections will appear here.</p>
            )}
          </div>
        </article>
      ) : (
        <>
          <section className="space-y-6">
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="title" className={labelClass}>Title</label>
                <Counter value={title} max={LIMITS.title} />
              </div>
              <input
                id="title"
                value={title}
                onChange={(e) => touch(setTitle)(e.target.value)}
                placeholder="Three days on the patan below Badimalika"
                className={`${field} font-display mt-2 text-2xl`}
              />
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="excerpt" className={labelClass}>Summary</label>
                <Counter value={excerpt} max={LIMITS.excerpt} />
              </div>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => touch(setExcerpt)(e.target.value)}
                rows={2}
                placeholder="One or two sentences for the story card — where you went and what made it worth it."
                className={`${field} mt-2 resize-y`}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="authorName" className={labelClass}>Byline</label>
                <input
                  id="authorName"
                  value={authorName}
                  onChange={(e) => touch(setAuthorName)(e.target.value)}
                  maxLength={LIMITS.authorName}
                  className={`${field} mt-2`}
                />
              </div>
            </div>

            <div>
              <p className={labelClass}>Cover photo</p>
              <div className="mt-2 space-y-3">
                <ImageField label="Add a cover photo" value={cover} onChange={touch(setCover)} />
                {cover && (
                  <input
                    value={coverCredit}
                    onChange={(e) => touch(setCoverCredit)(e.target.value)}
                    maxLength={LIMITS.credit}
                    placeholder="Photo credit, if it isn't yours"
                    className={`${field} text-sm`}
                  />
                )}
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-end justify-between border-b border-line pb-3">
              <h2 className="font-display text-3xl text-ink">Sections</h2>
              <span className="text-xs text-muted">
                {sections.length}/{LIMITS.sections}
              </span>
            </div>

            <ol className="mt-6 space-y-6">
              {sections.map((section, index) => (
                <li key={section.key} className="space-y-4 rounded-3xl border border-line p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-ink">
                      Section {index + 1}
                    </span>
                    <div className="flex gap-1 text-xs">
                      <button
                        type="button"
                        onClick={() => moveSection(index, -1)}
                        disabled={index === 0}
                        aria-label={`Move section ${index + 1} up`}
                        className="rounded-full border border-line px-3 py-1 text-muted hover:text-accent-ink disabled:opacity-40"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(index, 1)}
                        disabled={index === sections.length - 1}
                        aria-label={`Move section ${index + 1} down`}
                        className="rounded-full border border-line px-3 py-1 text-muted hover:text-accent-ink disabled:opacity-40"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const hasContent = section.body || section.heading || section.image;
                          if (hasContent && !window.confirm(`Remove section ${index + 1}?`)) return;
                          setSections((list) =>
                            list.length > 1 ? list.filter((s) => s.key !== section.key) : [emptySection()],
                          );
                          setVersion((v) => v + 1);
                        }}
                        className="rounded-full border border-line px-3 py-1 text-muted hover:text-accent-ink"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <input
                    value={section.heading ?? ""}
                    onChange={(e) => updateSection(section.key, { heading: e.target.value })}
                    maxLength={LIMITS.heading}
                    placeholder={index === 0 ? "Heading (optional), e.g. The jeep to Martadi" : "Heading (optional)"}
                    aria-label={`Section ${index + 1} heading`}
                    className={`${field} font-display text-xl`}
                  />
                  <div>
                    <textarea
                      value={section.body}
                      onChange={(e) => updateSection(section.key, { body: e.target.value })}
                      rows={7}
                      placeholder={
                        index === 0
                          ? "Start where your trip started. What did you see, hear, eat? Leave a blank line between paragraphs."
                          : "Write this part of your story. Leave a blank line between paragraphs."
                      }
                      aria-label={`Section ${index + 1} text`}
                      className={`${field} resize-y leading-relaxed`}
                    />
                    <div className="mt-1 text-right">
                      <Counter value={section.body} max={LIMITS.body} />
                    </div>
                  </div>
                  <ImageField
                    label="Add a photo to this section (optional)"
                    value={section.image}
                    onChange={(image) => updateSection(section.key, { image })}
                  />
                  {section.image && (
                    <input
                      value={section.imageCaption ?? ""}
                      onChange={(e) => updateSection(section.key, { imageCaption: e.target.value })}
                      maxLength={LIMITS.caption}
                      placeholder="Caption (optional)"
                      aria-label={`Section ${index + 1} caption`}
                      className={`${field} text-sm`}
                    />
                  )}
                </li>
              ))}
            </ol>

            {sections.length < LIMITS.sections && (
              <button
                type="button"
                onClick={() => {
                  setSections((list) => [...list, emptySection()]);
                  setVersion((v) => v + 1);
                }}
                className="mt-6 w-full rounded-3xl border border-dashed border-line py-4 text-sm font-medium text-muted transition-colors hover:border-accent-ink hover:text-accent-ink"
              >
                + Add section
              </button>
            )}
          </section>

          <section className="space-y-6">
            <div>
              <label htmlFor="place" className={labelClass}>Places in this story</label>
              <p className="mt-1 text-xs text-muted">
                Your story will appear on these destination pages and on a map.
              </p>
              <select
                id="place"
                value=""
                disabled={destinationIds.length >= LIMITS.destinations}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value && !destinationIds.includes(value)) {
                    touch(setDestinationIds)([...destinationIds, value]);
                  }
                }}
                className={`${field} mt-2`}
              >
                <option value="">
                  {destinationIds.length >= LIMITS.destinations
                    ? `Up to ${LIMITS.destinations} places`
                    : "Add a place…"}
                </option>
                {placesByDistrict.map(({ district, places: group }) => (
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
              <legend className={labelClass}>Interests</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {INTEREST_TAGS.map((tag) => {
                  const on = tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      aria-pressed={on}
                      onClick={() => touch(setTags)(on ? tags.filter((t) => t !== tag) : [...tags, tag])}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        on
                          ? "border-accent-ink bg-brass/15 text-accent-ink"
                          : "border-line text-muted hover:text-ink"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </section>
        </>
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
