<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Drishya — project guide for AI agents

Drishya is an interactive, AI-assisted tourism platform for **Sudurpaschim Province, Nepal** (9 districts). It is a 6th-semester Minor Project (Computer Engineering, Far Western University) built by a student group. Core idea: a scroll-driven district map as the landing centerpiece, plus district/destination content, local guide connections, a blog, a recommendation engine, and — last — a RAG-powered AI assistant.

Prefer changes that are small, reviewable, and consistent with what already exists. Don't re-litigate decisions listed under "Decisions already made".

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript (`strict`)
- Tailwind CSS v4 — CSS-based config in `src/app/globals.css` (`@theme`), no `tailwind.config.js`
- `motion` (Framer Motion) for animation
- Leaflet 1.9 + react-leaflet 5 for geographic maps
- Prisma 7 + Neon (Postgres) for content data
- Planned, not yet built: Auth.js (guide login), Cloudinary (images), Upstash Vector + sentence-transformers + Groq/OpenRouter (RAG assistant), recommendation engine
- Hosting: Vercel. Everything must stay on free tiers.

## Commands

```bash
npm install
npm run dev        # next dev --hostname 0.0.0.0 (LAN-testable on phones)
npm run build      # prerenders all district pages; needs DATABASE_URL once the DB layer is in
npm run start
npx tsc --noEmit   # typecheck — run before finishing any task
```

There is no lint or test script yet. Don't add dependencies without being asked.

Database (Prisma 7):

```bash
npx prisma migrate dev --name <name>
npx prisma db seed
npx prisma studio
```

Env vars (`.env.local`, also set in Vercel): `DATABASE_URL` (Neon pooled, used at runtime) and `DIRECT_URL` (Neon direct, used by the Prisma CLI).

## Project structure

```
src/
  app/                       App Router pages
    page.tsx                 Landing: pinned hero map + district grid
    districts/[slug]/        District page (Leaflet map + destinations)
      [destination]/         Destination detail page
    blog/, guide-connect/, hidden-gems/   Currently placeholder shells (lorem ipsum)
  components/
    site/                    Header (floating "dock"), Footer, Logo, ThemeToggle, Reveal, PageTransition
    hero-map/                HeroMap (scroll-driven SVG camera), DistrictNav (bottom ruler)
    district-map/            DistrictMap (react-leaflet), DistrictMapLoader (ssr:false wrapper)
  data/
    districts.ts             Source of truth for the 9 districts (ids, slugs, centers, blurbs)
    landmarks.ts             Starter landmark pins on the hero map
    sudurpaschim-svg.json    Hero SVG district paths
    baitadi.ts, bajura.ts, dadeldhura.ts, …   Destination content (seed sources)
    sample-pois.ts           Legacy sample markers — being replaced by real destinations
  lib/
    types.ts                 Shared types (District, Destination, Poi, …)
    pathBounds.ts, heroCamera.ts   Hero camera math
    db/                      Prisma client + data-access layer
  generated/prisma/          Generated Prisma client (gitignored)
prisma/                      schema.prisma, seed.ts, migrations/
public/data/                 sudurpaschim-districts.simplified.geojson (fed to Leaflet)
map-data/                    Source-of-truth map data archive
```

## Architecture rules

**Two map layers, by design.** The landing hero is a custom SVG whose animated `viewBox` is a scroll-driven camera; district pages use real geography via react-leaflet + GeoJSON. Don't merge them or swap one for the other.

**Data flow.** Destination content lives in Postgres. The `.ts` files in `src/data/` are *seed sources*, not runtime data.
- Pages and components import destination data **only** from `src/lib/db/destinations.ts`. Never import the Prisma client or the `src/data/<district>.ts` files from UI code.
- The data layer returns plain serializable objects (`Destination`), safe to pass from server components into client components.
- Client components (including the Leaflet map) never fetch destination data themselves; a server component passes it as props.
- Pages are prerendered (`generateStaticParams`) with `export const revalidate = 3600`, so the demo still works if the DB is briefly unreachable. Don't switch pages to per-request dynamic rendering.
- Re-running the seed overwrites DB edits for the seeded rows. Don't suggest reseeding casually once content has been edited in the database.

**Next.js 16 specifics.**
- Page `params` are Promises: `const { slug } = await params;` (see `src/app/districts/[slug]/page.tsx`).
- Leaflet touches `window`, so maps load through a `"use client"` wrapper using `dynamic(..., { ssr: false })`.
- Read the Next.js docs in `node_modules/next/dist/docs/` before using any API you aren't sure about.

**Server vs client.** Default to server components. Add `"use client"` only where needed (maps, motion, state, event handlers).

## Content data rules (important)

The `Destination` type is in `src/lib/types.ts`.

- `position` is `[lat, lon] | null`. **Never invent coordinates.** Skip `null` positions everywhere (no marker, no small map).
- Most fields beyond identity are optional. Hide a block when its field is missing; never render "undefined" or fake placeholders.
- `verify?: string[]` lists fields the source flagged as unconfirmed. Show a subtle "Some details are still being verified" note when non-empty.
- Never fabricate history, culture, fees, opening hours, or phone numbers. If something is unknown, leave it out.
- `tagline`/`blurb` in `districts.ts` and `landmarks.ts` are starter content, not authoritative.
- Long descriptions and cultural notes double as the future RAG corpus — keep them as clear prose, not fragments.
- Categories, interest tags, seasons and budget levels are string unions in `types.ts` and lookup tables in the database (`Category`, `InterestTag`, `Season`, `BudgetLevel`); keep the two identical. List fields live in child tables (`DestinationCategory`, `DestinationAlternateName`, `DestinationSource`, …), not array columns.
- `prisma db seed` and `npm run cloudinary:seed` only add rows/photos that are missing; `--overwrite` resets existing ones to the `.ts` values.

## Design system

Palette tokens are defined in `src/app/globals.css` under `@theme` and used as Tailwind utilities:

- `forest` (primary), `slate`, `brass` (accent), `stone` (neutral), `paper` (background)
- Semantic aliases to use in components: `text-ink`, `text-muted`, `text-accent-ink`, `bg-brass`, `border-line`, `text-dock-text`
- Bright `brass` is only for fills/markers; use `accent-ink` (brass-ink) for small text — contrast matters here.
- Surfaces: `glass`, `glass-strong`, `glass-card` utility classes (frosted panels). Display type: `font-display` (Cormorant Garamond).
- Dark mode via `html[data-theme="dark"]` token overrides — use tokens, never hard-coded colors, so dark mode keeps working.
- Pages that sit under the floating header pad with `pt-[calc(var(--header-h)+Xrem)]`.
- Respect `prefers-reduced-motion` (existing components use `useReducedMotion`; keep that pattern).
- Layout convention: `mx-auto max-w-6xl px-4`.

## Decisions already made (don't reopen unless asked)

- Neon over Supabase: Auth.js and Cloudinary cover auth/storage, and Neon has no pause/wake delay during live demos.
- Postgres over NoSQL: the model is relational (districts → destinations → guides → blog posts).
- The RAG assistant is deliberately the **last** phase — district content must exist before embeddings can be generated.
- The recommendation engine (weighted scoring on budget, interests, season, distance) is core scope.
- Hero camera and dock/header styling are finished and tuned; don't restructure them without being asked.

## Working style

- The maintainer gives numbered lists of changes and expects direct implementation.
- Keep code comments and copy natural and specific (real district names, real regional references). Avoid generic filler.
- Run `npx tsc --noEmit` (and `npm run build` when touching routes or data fetching) before reporting a task done, and state anything you couldn't verify.
- Don't touch `districts.ts`, `landmarks.ts`, or the hero-map components unless the task is explicitly about them.