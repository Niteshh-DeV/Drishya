"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { saveProfile, type ProfileFormState } from "@/app/account/actions";
import { Magnetic } from "@/components/site/Magnetic";
import { PROFILE_LIMITS } from "@/lib/profile-input";

const fieldClass =
  "mt-2 w-full rounded-2xl border border-line bg-transparent px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-accent-ink";

/** Name and bio for the traveler's public page, with live character counts. */
export function ProfileForm({ name, bio }: { name: string; bio: string }) {
  const [state, action, pending] = useActionState<ProfileFormState, FormData>(saveProfile, {
    status: "idle",
  });
  const { update } = useSession();
  const [nameValue, setNameValue] = useState(name);
  const [bioValue, setBioValue] = useState(bio);
  const dirty = nameValue !== name || bioValue !== bio;

  // Refresh the session so the dock's account menu shows the new name.
  // Once per save: `update` changes identity when the session does.
  const handled = useRef<ProfileFormState | null>(null);
  useEffect(() => {
    if (state.status !== "saved" || handled.current === state) return;
    handled.current = state;
    void update();
  }, [state, update]);

  return (
    <form action={action} className="space-y-6">
      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="profile-name" className="text-[11px] uppercase tracking-[0.22em] text-muted">
            Display name
          </label>
          <span className="text-[11px] text-muted">
            {nameValue.length}/{PROFILE_LIMITS.name}
          </span>
        </div>
        <input
          id="profile-name"
          name="name"
          value={nameValue}
          onChange={(event) => setNameValue(event.target.value)}
          maxLength={PROFILE_LIMITS.name}
          required
          autoComplete="name"
          className={fieldClass}
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="profile-bio" className="text-[11px] uppercase tracking-[0.22em] text-muted">
            Bio
          </label>
          <span className="text-[11px] text-muted">
            {bioValue.length}/{PROFILE_LIMITS.bio}
          </span>
        </div>
        <textarea
          id="profile-bio"
          name="bio"
          value={bioValue}
          onChange={(event) => setBioValue(event.target.value)}
          maxLength={PROFILE_LIMITS.bio}
          rows={4}
          placeholder="Where you're from, how you travel, the corner of Sudurpaschim you keep going back to."
          className={`${fieldClass} resize-none leading-relaxed`}
        />
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Shown on your traveler page and under each story you publish.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Magnetic>
          <button
            type="submit"
            disabled={pending || !dirty}
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? "Saving…" : "Save profile"}
          </button>
        </Magnetic>
        <p role="status" className="text-sm">
          {state.status === "saved" && !dirty && <span className="text-accent-ink">Saved.</span>}
          {state.status === "error" && <span className="text-ink">{state.error}</span>}
        </p>
      </div>
    </form>
  );
}
