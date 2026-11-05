/**
 * Limits and validation for the traveler profile (name and bio). The
 * account form imports the limits for its counters; `saveProfile` runs
 * `validateProfileInput` on every save.
 */
export const PROFILE_LIMITS = {
  name: 60,
  bio: 280,
} as const;

export interface ProfileInput {
  name: string;
  bio: string;
}

type Result = { ok: true; value: { name: string; bio: string | null } } | { ok: false; error: string };

export function validateProfileInput(input: ProfileInput): Result {
  const name = input.name.replace(/\s+/g, " ").trim();
  // Keep the traveler's paragraph breaks, but no runs of blank lines.
  const bio = input.bio.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

  if (!name) return { ok: false, error: "Add the name you'd like other travelers to see." };
  if (name.length > PROFILE_LIMITS.name) {
    return { ok: false, error: `Keep your name under ${PROFILE_LIMITS.name} characters.` };
  }
  if (bio.length > PROFILE_LIMITS.bio) {
    return { ok: false, error: `Keep your bio under ${PROFILE_LIMITS.bio} characters.` };
  }
  return { ok: true, value: { name, bio: bio || null } };
}
