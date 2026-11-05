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
- Lenis for smooth wheel scrolling; React `<ViewTransition>` (built into Next 16's React canary) for page transitions
- Prisma 7 + Neon (Postgres) for content data
- Auth.js v5 (`next-auth@5` beta) with Google + Facebook sign-in, Prisma adapter, database sessions
- Cloudinary for destination photos and blog uploads
- Planned, not yet built: Upstash Vector + sentence-transformers + Groq/OpenRouter (RAG assistant), recommendation engine
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

Env vars (`.env.local`, also set in Vercel): `DATABASE_URL` (Neon pooled, used at runtime) and `DIRECT_URL` (Neon direct, used by the Prisma CLI); `CLOUDINARY_*`; `AUTH_SECRET`, `AUTH_GOOGLE_ID/SECRET`, `AUTH_FACEBOOK_ID/SECRET`. `AUTH_URL=http://localhost:3000` is for local dev only — `npm run dev` binds to 0.0.0.0, and OAuth callbacks are registered for localhost. Don't set it on Vercel. See `.env.example`.

Apply migrations to Neon with `prisma migrate diff` + `prisma migrate deploy`, not `migrate dev`: if `migrate dev` detects drift it offers to reset the database, which would wipe the content. After a migration, restart `npm run dev` — the dev server caches the old Prisma client on `globalThis`.

## Project structure

```
src/
  app/                       App Router pages
    page.tsx                 Landing: pinned hero map + district grid
    districts/[slug]/        District page (Leaflet map + destinations)
      [destination]/         Destination detail page
    blog/                    Index + [slug] post page (public, prerendered)
      write/, write/[id]/, mine/   Traveler editor + "My stories" (signed in)
    admin/posts/             Review queue (admin role only)
    signin/, privacy/        Auth.js sign-in, privacy policy
    account/                 Profile page (name, bio, story counts, deletion) + actions.ts
    travelers/[id]/          Public traveler page (only once a story is published)
    guide-connect/           Coming-soon page
    hidden-gems/             Hidden gems grid
  components/
    site/                    Header (floating "dock"), AccountButton, Footer, Logo, ThemeToggle,
                             PageTransition, SmoothScroll, Intro, Reveal, RevealTitle,
                             ParallaxImage, Magnetic, PageSkeleton, useDismiss
    account/                 ProfileForm
    hero-map/                HeroMap (scroll-driven SVG camera), DistrictNav (bottom ruler)
    district-map/            DistrictMap (react-leaflet), DistrictMapLoader (ssr:false wrapper)
    region-map/              RegionMap: the /map explorer (district filter, place list)
    map/                     Shared Leaflet parts: leaflet.ts (tiles, pins, bounds), PlaceMarkers,
                             MapPlaceCard, MapGestures, usePlacePreview
  data/
    districts.ts             Source of truth for the 9 districts (ids, slugs, centers, blurbs)
    landmarks.ts             Starter landmark pins on the hero map
    sudurpaschim-svg.json    Hero SVG district paths
    baitadi.ts, bajura.ts, dadeldhura.ts, …   Destination content (seed sources)
    sample-pois.ts           Legacy sample markers — being replaced by real destinations
  lib/
    types.ts                 Shared types (District, Destination, Poi, …)
    pathBounds.ts, heroCamera.ts   Hero camera math
    db/                      Prisma client + data-access layer (destinations, blog,
                             blog-authoring, blog-review, users, travelers)
    blog-input.ts            Post limits + validation shared by editor and server actions
    profile-input.ts         Profile (name, bio) limits + validation
  auth.ts                    Auth.js config (providers, adapter, session callback)
  generated/prisma/          Generated Prisma client (gitignored)
prisma/                      schema.prisma, seed.ts, migrations/
public/data/                 sudurpaschim-districts.simplified.geojson (fed to Leaflet)
map-data/                    Source-of-truth map data archive
```

## Architecture rules

**Two map layers, by design.** The landing hero is a custom SVG whose animated `viewBox` is a scroll-driven camera; district pages use real geography via react-leaflet + GeoJSON. Don't merge them or swap one for the other.

**Data flow.** Destination content lives in Postgres. The `.ts` files in `src/data/` are *seed sources*, not runtime data.
- Pages and components import destination data **only** from `src/lib/db/destinations.ts` (blog data from the `src/lib/db/blog*.ts` files). Never import the Prisma client or the `src/data/<district>.ts` files from UI code.
- The data layer returns plain serializable objects (`Destination`), safe to pass from server components into client components.
- Client components (including the Leaflet map) never fetch destination data themselves; a server component passes it as props.
- Pages are prerendered (`generateStaticParams`) with `export const revalidate = 3600`, so the demo still works if the DB is briefly unreachable. Don't switch pages to per-request dynamic rendering.
- Re-running the seed overwrites DB edits for the seeded rows. Don't suggest reseeding casually once content has been edited in the database.

**Next.js 16 specifics.**
- Page `params` are Promises: `const { slug } = await params;` (see `src/app/districts/[slug]/page.tsx`).
- Leaflet touches `window`, so maps load through a `"use client"` wrapper using `dynamic(..., { ssr: false })`.
- Read the Next.js docs in `node_modules/next/dist/docs/` before using any API you aren't sure about.

**Map tiles.** Every Leaflet map uses `BASE_TILES` from `src/components/map/leaflet.ts` (key-less OpenStreetMap tiles); a `.leaflet-tile-pane` filter in globals.css mutes them to the palette. CARTO's basemaps now need an API key, so don't switch to them. Tiles overlap by a pixel and blend normally (overriding Leaflet's `plus-lighter`) to hide seams at fractional zoom.

**Leaflet maps.** Every interactive map includes `<MapGestures />`: the wheel scrolls the page until the map is clicked, and on touch one finger scrolls the page and two move the map. Destination pins go through `PlaceMarkers` + `MapPlaceCard` (+ `usePlacePreview`): stable `placePin` icons (never rebuilt; state is `is-active`/`is-dim` classes), hover to preview on desktop, tap-to-preview then tap-to-open on phones, and the card docks along the bottom on narrow maps. District maps keep the view near the district (`minZoom`/`maxBounds`); Khaptad National Park is drawn on the four districts it reaches (`KHAPTAD_DISTRICTS`).

**Display titles.** Huge uppercase place/district names take their size from `displayTitleSize()` (`src/lib/typography.ts`), so the longest word always fits on one line. Don't use `overflow-wrap:anywhere` on them; it splits words.

**Server vs client.** Default to server components. Add `"use client"` only where needed (maps, motion, state, event handlers).

## Blog and accounts

- Anyone reads; travelers sign in (Google/Facebook via Auth.js) to write. Posts are a title, summary, cover and ordered sections (`BlogPostSection`); the post page stitches them together with `PostBody`. User text is rendered as plain React text — never as HTML.
- Status flow: `draft` → `pending` → `published` | `rejected`. Only admins publish (`/admin/posts`). Editing a published post sends it back to review. `src/lib/db/blog.ts` returns published posts only; author and review queries live in `blog-authoring.ts` and `blog-review.ts`.
- Server actions re-check the session and validate input with `validatePostInput`; author functions take the user id and enforce ownership in the query.
- Photos upload from the browser straight to Cloudinary with a server-signed request, into `drishya/blog/<userId>/`. Saves reject images outside that folder.
- Publishing, unpublishing and deleting call `revalidatePath` for `/blog`, the post, and the district/destination pages showing "Stories from here".
- **Never call `auth()` from a layout or a prerendered page** — it reads cookies and would make every route dynamic. The header reads the session client-side (`useSession`); only `/signin`, `/account`, `/blog/write*`, `/blog/mine` and `/admin/*` call `auth()`.
- Roles (`traveler` | `guide` | `admin`) live on `User.role`. Sessions are in the database, so role changes apply on the next request. Grant admin in Prisma Studio.
- Profiles: travelers edit their display name and `User.bio` on `/account`. `/travelers/[id]` (prerendered, `src/lib/db/travelers.ts`) exists only for users with a published story and shows name, photo, bio, join month and published stories — never email or unpublished work. Anything that changes a published post also revalidates `/travelers/<authorId>` (`PostPaths.authorId`); saving a profile revalidates the traveler page and their post pages ("About the author").
- Posts without an author account (`byTeam`) are labelled "From the Drishya team"; never present them as traveler stories.
- Post rendering is shared: `PostBody` (sections), `PostCard`/`Byline`/`RelatedStories`, `PlacesInStory` + `StoryMap` (Leaflet, client-only). The editor autosaves only drafts — autosaving a pending or published post would change its review status.
- Traveler stories are personal accounts. Label them as such, and don't treat them as verified destination facts (including in the future RAG corpus).

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
- Respect `prefers-reduced-motion`. In motion components, keep rendering the **same element tree** and only zero the durations/offsets (see `Reveal`, `ParallaxImage`): the server can't know the preference, and swapping in a plain element on the client leaves the server's `opacity: 0` in place.

### Motion

- **Scrolling:** Lenis (`SmoothScroll` in the root layout) eases wheel input; touch stays native. Read it with `useLenis()` from `lenis/react` and fall back to `window.scrollTo` when it's undefined. It never takes the wheel over `.leaflet-container`.
- **Page transitions:** `PageTransition` wraps the page in a `<ViewTransition>` keyed by pathname (`.page-exit` / `.page-enter` in globals.css). The dock is its own named boundary held still on top (`.dock-hold`). Only navigations animate; don't add `ViewTransition`s with a non-`none` `default`/`update` elsewhere, or ordinary updates will start transitions.
- **Shared photos:** a card photo and the cover it opens into share a name — `placeCoverName(id)` (`src/lib/site.ts`) for destinations, `postCoverName(id)` (`PostCard`) for stories — with `share="morph" default="none"`. A name may appear only once per page. Don't add `loading.tsx` to destination or story routes: a skeleton-first navigation can't morph.
- **Titles:** page `h1`s use `RevealTitle` (pure CSS word reveal, waits for the intro on the first page of a visit). Below-the-fold blocks use `Reveal`; photos use `ParallaxImage` (curtain + drift; `reveal={false}` for morph targets).
- **Theme switch:** `ThemeToggle` reveals the new theme as a circle from the button via `document.startViewTransition` (`[data-theme-switch]` in globals.css).
- **Utilities in globals.css:** `card-media` / `card-arrow` (card hover inside a `group` link), `link-draw` (underline draws in), `ken-burns`, `drop-cap`, `skeleton`. The intro (`Intro`) is CSS-only and shows once per browser session.
- Layout convention: `mx-auto max-w-6xl px-4`.

### Pages and metadata

- 404s and the error page use `NotFoundView` (`src/components/site/`), in the same editorial frame as content pages.
- Link previews: pages with a photo set `openGraph.images` (and `twitter.images`) with `shareImageUrl()` from `src/lib/images.ts` (1200×630 JPEG crop). Everything else falls back to `src/app/opengraph-image.tsx`. A page-level `openGraph` object replaces the parent's, so include `images` whenever you set one.
- Icons come from `brand/`: `src/app/icon.svg`, `src/app/apple-icon.png`, `public/icon-192.png` / `icon-512.png` (used by `manifest.ts`).

## Decisions already made (don't reopen unless asked)

- Neon over Supabase: Auth.js and Cloudinary cover auth/storage, and Neon has no pause/wake delay during live demos.
- Postgres over NoSQL: the model is relational (districts → destinations → guides → blog posts).
- The RAG assistant is deliberately the **last** phase — district content must exist before embeddings can be generated.
- The recommendation engine (weighted scoring on budget, interests, season, distance) is core scope.
- Hero camera and dock/header styling are finished and tuned; don't restructure them without being asked. The dock's behaviour (active-section pill, settling on scroll, tucking away on long pages, full-screen phone menu) was added on request and is tuned too.

## Working style

- The maintainer gives numbered lists of changes and expects direct implementation.
- Keep code comments and copy natural and specific (real district names, real regional references). Avoid generic filler.
- Run `npx tsc --noEmit` (and `npm run build` when touching routes or data fetching) before reporting a task done, and state anything you couldn't verify.
- Don't touch `districts.ts`, `landmarks.ts`, or the hero-map components unless the task is explicitly about them.