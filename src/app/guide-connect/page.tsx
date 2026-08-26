const GUIDE_CARDS = [
  "Guide profile card",
  "Availability card",
  "Trip style card",
  "Language card",
  "Price band card",
  "Safety credential card",
] as const;

export default function GuideConnectPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-[calc(var(--header-h)+2rem)]">
      <header className="glass rounded-3xl p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
          Guide Connect shell
        </p>
        <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Find a local guide
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
          faucibus id risus tristique lectus non gravida id.
        </p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDE_CARDS.map((card) => (
          <article key={card} className="glass glass-card rounded-3xl p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Placeholder
            </p>
            <h2 className="mt-2 text-lg font-semibold text-ink">{card}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">
              Nunc vitae urna in amet elementum tincidunt. Tristique in pretium
              lorem enim varius.
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
