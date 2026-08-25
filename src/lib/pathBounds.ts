/** Axis-aligned bounding box in SVG user units. */
export interface Bounds {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Bounding box of an SVG path built only from absolute M/L commands with
 * `x,y` coordinate pairs (which is exactly how `sudurpaschim-svg.json` is
 * generated). We just pull every number and pair them up.
 */
export function pathBounds(d: string): Bounds {
  const nums = d.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = nums[i];
    const y = nums[i + 1];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

/**
 * Smallest box containing all of `list` — used to frame the whole province as
 * the hero's opening "overview" shot before the camera dives into a district.
 */
export function unionBounds(list: Bounds[]): Bounds {
  const minX = Math.min(...list.map((b) => b.x));
  const minY = Math.min(...list.map((b) => b.y));
  const maxX = Math.max(...list.map((b) => b.x + b.w));
  const maxY = Math.max(...list.map((b) => b.y + b.h));
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

/**
 * Produce a `[minX, minY, w, h]` viewBox that frames `b` (plus padding) at a
 * given aspect ratio — the "camera" target for one district. Expanding to the
 * stage aspect means the SVG fills the stage with no letterboxing.
 */
export function framedViewBox(
  b: Bounds,
  aspect: number,
  padRatio = 0.18,
): [number, number, number, number] {
  let w = b.w * (1 + padRatio * 2);
  let h = b.h * (1 + padRatio * 2);
  if (w / h > aspect) {
    h = w / aspect;
  } else {
    w = h * aspect;
  }
  const cx = b.x + b.w / 2;
  const cy = b.y + b.h / 2;
  return [cx - w / 2, cy - h / 2, w, h];
}
