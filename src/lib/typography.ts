/**
 * Font size for an uppercase Cormorant display title (place and district
 * names) that keeps its longest word on one line. A fixed size broke
 * "GHODAGHODI" mid-word at 9.5rem, and "ARCHAEOLOGICAL" would overflow a
 * phone even at the old minimum.
 *
 * `containerRem` is the title's max width; on narrower screens the title
 * gets ~86% of the viewport (the page gutters take the rest).
 */
export function displayTitleSize(
  text: string,
  { maxRem, containerRem }: { maxRem: number; containerRem: number },
): string {
  const longest = Math.max(4, ...text.split(/\s+/).map((word) => word.length));
  // Average uppercase advance plus the 0.06em tracking, with some headroom.
  const ems = longest * 0.85;
  const fluid = (86 / ems).toFixed(2);
  const max = Math.min(maxRem, containerRem / ems).toFixed(2);
  // Even the floor must fit a ~20rem phone column.
  const min = Math.min(2.25, 20 / ems).toFixed(2);
  return `clamp(${min}rem, ${fluid}vw, ${max}rem)`;
}
