# Drishya

An interactive, AI-assisted tourism platform for Nepal's **Sudurpaschim Province**.
This repository currently contains the **map foundation** — an interactive district
map — that the rest of the platform (guides, RAG assistant, blog, cultural sections)
will build on.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-based config — see `src/app/globals.css`)
- **motion** (Framer Motion) for the hero animations
- **Leaflet 1.9 + react-leaflet 5** for the geographic district maps

## Getting started

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000.

To produce a production build (prerenders all 9 district pages):

```bash
npm run build
```

## The hybrid map architecture

Two complementary map layers, by design:

1. **Landing hero — custom interactive SVG** (`src/components/hero-map/HeroMap.tsx`).
   One district at a time, editorial and illustrated. Each district is an SVG
   `<path>` from `src/data/sudurpaschim-svg.json`; because all 9 share one
   coordinate space, an animated `viewBox` acts as a **camera** that pans/zooms
   to the selected district (`src/lib/pathBounds.ts` computes the framing).
   The selected district gets an ink outline that traces itself on, a hatch
   overlay and its landmarks (`src/data/landmarks.ts`) fading in; neighbours dim.
   Hovering a neighbour warms and lifts it and names it in a corner chip;
   clicking frames it, clicking the framed district opens its page. Driven by
   the bottom **district ruler** (`hero-map/DistrictNav.tsx`) — click or hover a
   tick, or use ←/→ and Enter on the focused stage. Honours
   `prefers-reduced-motion`, and hover states are suppressed for touch input.

2. **District pages — react-leaflet + GeoJSON** (`src/components/district-map/`).
   A real geographic map (OpenStreetMap tiles) that draws the district boundary from
   `public/data/sudurpaschim-districts.simplified.geojson` and plots markers for
   guides, stays and hidden gems. Loaded client-only (`ssr: false`) because Leaflet
   needs `window`.

## Project structure

```
src/
  app/
    layout.tsx                 Root layout + header
    globals.css                Tailwind v4 + palette tokens
    page.tsx                   Landing page (hero + district grid)
    districts/[slug]/
      page.tsx                 District detail (map + sections); prerenders 9 slugs
      not-found.tsx            Invalid-slug fallback
  components/
    site/Header.tsx
    hero-map/
      HeroMap.tsx              Camera/viewBox SVG hero map (client)
      DistrictNav.tsx          Bottom "ruler" district navigator
    district-map/
      DistrictMap.tsx          react-leaflet map (client, dynamically imported)
      DistrictMapLoader.tsx    'use client' wrapper doing dynamic(ssr:false)
  data/
    districts.ts               Single source of truth for the 9 districts
    landmarks.ts               STARTER landmarks floated over the hero map
    sample-pois.ts             SAMPLE markers (replace with real data later)
    sudurpaschim-svg.json      Hero SVG paths
  lib/
    types.ts                   Shared types
    pathBounds.ts              SVG path bbox → camera viewBox framing
public/data/
  sudurpaschim-districts.simplified.geojson   Boundaries fed to Leaflet
map-data/                      Source-of-truth data archive (full + simplified + svg)
```

## Extending it (later phases)

- **Real content** (history, culture, safety, destinations): fill in `blurb`/`tagline`
  in `src/data/districts.ts` and the placeholder sections in the district page.
- **Hero landmarks**: `src/data/landmarks.ts` is starter content — a couple of pins
  per district, positioned as `dx`/`dy` offsets from that district's SVG label
  centroid. Verify the names and nudge the offsets as real destinations land.
- **Guides / stays / hidden gems**: replace `src/data/sample-pois.ts` with DB-backed
  records (Prisma + Postgres). `Poi`/`PoiCategory` in `src/lib/types.ts` are the
  shape the map already consumes.
- **Auth, RAG assistant, blog, recommendation engine**: not yet scaffolded.

## Note on builds

`layout.tsx` loads Cormorant Garamond via `next/font/google`, so `next build`
fetches it from `fonts.googleapis.com`. Offline or proxied builds (some CI
sandboxes) fail there — set `HTTPS_PROXY`, or switch to `next/font/local` with a
self-hosted copy if you need fully offline builds.

## Data provenance

District boundaries derive from the HDX/OCHA Nepal COD `npl_admin2` dataset
(province `adm1_name = "Sudur Paschim"`, pcode `NP07`; 9 districts). The generation
inputs and outputs live in `map-data/` and `nepal-districts/`.
