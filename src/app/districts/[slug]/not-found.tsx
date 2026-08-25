import Link from "next/link";

export default function DistrictNotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-20 pt-[calc(var(--header-h)+4rem)] text-center">
      <h1 className="font-display text-4xl font-semibold text-ink">
        District not found
      </h1>
      <p className="mt-2 text-ink/70">
        We don&apos;t have a page for that district. Sudurpaschim has nine —
        pick one from the map.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-brass px-4 py-2 text-sm font-semibold text-forest-deep transition-colors hover:bg-brass-light"
      >
        ← Back to the map
      </Link>
    </main>
  );
}
