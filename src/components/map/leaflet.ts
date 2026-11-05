import L from "leaflet";

/**
 * OpenStreetMap tiles shared by every Leaflet map on the site. They need no
 * key or account. The `.leaflet-tile-pane` filter in globals.css softens
 * their colours toward the paper palette. (CARTO's lighter basemaps were
 * tried, but they now require an API key and serve placeholder tiles
 * without one.)
 */
export const BASE_TILES = {
  url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

/** Small rotated-square teardrop pin, filled with a palette CSS variable. */
export function teardropPin(color: string, className: string): L.DivIcon {
  return L.divIcon({
    className,
    html: `<span style="display:block;width:18px;height:18px;border-radius:999px 999px 999px 0;background:${color};border:3px solid var(--color-paper);transform:rotate(-45deg);box-shadow:0 4px 12px color-mix(in srgb,var(--color-forest-deep) 35%,transparent)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 18],
  });
}

/** Districts Khaptad National Park reaches into, checked against both boundaries. */
export const KHAPTAD_DISTRICTS = new Set(["bajhang", "bajura", "doti", "achham"]);

/**
 * Bounds of the whole province plus a margin, so the maps can't be dragged
 * or zoomed out to the plains of India.
 */
export const PROVINCE_BOUNDS = L.latLngBounds([27.9, 79.6], [30.8, 82.3]);

const pinCache = new Map<string, L.DivIcon>();

/**
 * Teardrop pin for a destination: forest, or brass for a hidden gem. Icons
 * are cached and never swapped, so a pin drops in once (staggered by
 * `order`) and keeps its element; hover and highlight states are classes
 * toggled on that element (`is-active`, `is-dim`; see `.place-pin` in
 * globals.css).
 */
export function placePin(hiddenGem: boolean, order: number): L.DivIcon {
  const delay = Math.min(order, 14) * 60;
  const key = `${hiddenGem ? "gem" : "place"}-${delay}`;
  const cached = pinCache.get(key);
  if (cached) return cached;
  const color = hiddenGem ? "var(--color-brass)" : "var(--color-forest)";
  const icon = L.divIcon({
    className: "place-pin",
    html: `<span class="place-pin-body"><svg aria-hidden="true" width="30" height="38" viewBox="0 0 32 40" fill="none" style="--pin-delay:${delay}ms"><path d="M16 39C16 39 29 25.4 29 14.5C29 7.596 23.18 2 16 2C8.82 2 3 7.596 3 14.5C3 25.4 16 39 16 39Z" fill="${color}" stroke="var(--color-paper)" stroke-width="2.5"/><circle cx="16" cy="14.5" r="4.5" fill="var(--color-paper)"/></svg></span>`,
    iconSize: [30, 38],
    iconAnchor: [15, 38],
  });
  pinCache.set(key, icon);
  return icon;
}
