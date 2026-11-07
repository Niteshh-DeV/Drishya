import { revalidatePath } from "next/cache";
import type { GuidePaths } from "@/lib/db/guide-authoring";

/**
 * Every public page that lists a guide: the directory, their own page, and
 * the district and destination pages showing "Local guides". Called with the
 * paths from before a change, so pages that showed the guide drop them.
 */
export function refreshGuidePages(paths: GuidePaths) {
  revalidatePath("/guide-connect");
  revalidatePath(`/guide-connect/${paths.id}`);
  for (const id of paths.districtIds) revalidatePath(`/districts/${id}`);
  for (const path of paths.destinationPaths) revalidatePath(path);
}
