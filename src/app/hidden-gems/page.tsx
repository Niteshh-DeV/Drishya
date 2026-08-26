const GEM_CARDS = [
  "River bend lookout",
  "Forest shrine trail",
  "Village tea ridge",
  "Monsoon waterfall point",
  "Sunrise pasture",
  "Stone path hamlet",
] as const;

export default function HiddenGemsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-[calc(var(--header-h)+2rem)]">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
          Hidden Gems shell
        </p>
        <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Off-map places worth the detour
        </h1>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GEM_CARDS.map((gem) => (
          <article key={gem} className="glass rounded-3xl p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Placeholder gem
            </p>
            <h2 className="font-display mt-2 text-2xl font-semibold text-ink">{gem}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis
              posuere porttitor tristique quam in.
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
