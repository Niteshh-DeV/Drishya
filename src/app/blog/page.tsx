export default function BlogIndexPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-[calc(var(--header-h)+2rem)]">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
          Field notes
        </p>
        <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Stories from Sudurpaschim
        </h1>
      </header>

      <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted">
        Stories are being prepared. There are no published posts yet.
      </p>
    </main>
  );
}
