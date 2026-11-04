import L from "leaflet";

/** OpenStreetMap tiles shared by every Leaflet map on the site. */
export const OSM_TILES = {
  url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
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
