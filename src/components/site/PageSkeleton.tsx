/**
 * Placeholder shown by `loading.tsx` while a card-grid page (Hidden Gems,
 * a traveler's page) that wasn't prefetched streams in. It keeps the real
 * page's rhythm — a centred title, then the grid — so content lands where
 * the eye already is.
 *
 * Destination and story pages deliberately have no skeleton: a card photo
 * flies into their cover during the page transition, and that only works
 * when the page arrives in one piece, which their prerendered, prefetched
 * HTML does.
 */
function Line({ className }: { className: string }) {
  return <span aria-hidden className={`skeleton block rounded-full ${className}`} />;
}

function CardGrid() {
  return (
    <div className="mx-auto mt-20 grid max-w-6xl gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i}>
          <span aria-hidden className="skeleton block aspect-[4/3] w-full" />
          <Line className="mt-5 h-2.5 w-1/3" />
          <Line className="mt-4 h-6 w-4/5" />
          <Line className="mt-3 h-3 w-full" />
          <Line className="mt-2 h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <main aria-busy="true" className="min-h-screen bg-paper">
      <p className="sr-only" role="status">
        Loading…
      </p>
      <div className="mx-auto max-w-360 px-5 pb-24 pt-[calc(var(--header-h)+4rem)] sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          <Line className="h-2.5 w-40" />
          <span aria-hidden className="skeleton mt-7 block h-[clamp(3rem,9vw,7rem)] w-[min(80%,40rem)]" />
          <span aria-hidden className="mt-10 block h-16 w-px bg-line" />
          <Line className="mt-8 h-3 w-[min(90%,34rem)]" />
          <Line className="mt-3 h-3 w-[min(70%,26rem)]" />
        </div>

        <CardGrid />
      </div>
    </main>
  );
}
