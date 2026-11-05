import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/*
 * The link preview for every page that doesn't bring its own photo (home,
 * map, hidden gems, Field Notes…): the Drishya mark on deep forest, like the
 * intro screen. Rendered once at build time.
 */
export const alt = "Drishya — districts, destinations and traveler stories of Sudurpaschim, Nepal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const mark = await readFile(join(process.cwd(), "src/app/icon.svg"), "utf8");
  const markSrc = `data:image/svg+xml;base64,${Buffer.from(mark).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 96px",
          gap: 64,
          background: "radial-gradient(circle at 30% 40%, #2a4d37 0%, #1f3d2b 45%, #0b1510 100%)",
          color: "#f6f5f2",
        }}
      >
        <img src={markSrc} width={220} height={220} alt="" style={{ borderRadius: 48 }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, letterSpacing: 22, fontWeight: 600 }}>DRISHYA</div>
          <div style={{ width: 120, height: 3, background: "#b68d4c", margin: "28px 0" }} />
          <div style={{ fontSize: 34, lineHeight: 1.35, color: "#d1cfc7", maxWidth: 680 }}>
            Districts, destinations and traveler stories of Sudurpaschim, Nepal
          </div>
        </div>
      </div>
    ),
    size,
  );
}
