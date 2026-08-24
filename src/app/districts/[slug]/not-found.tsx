import Link from "next/link";

export default function DistrictNotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-semibold text-ink">District not found</h1>
      <p className="mt-2 text-ink/70">
        We don&apos;t have a page for that district. Sudurpaschim has nine —
        pick one from the map.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
      >
        ← Back to the map
      </Link>
    </main>
  );
}
