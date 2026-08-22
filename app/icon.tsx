import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// 32px is what browsers actually rasterize in a tab; Google's guidance asks
// for a multiple of 48 for search results, which `apple-icon` covers.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const playfair = await readFile(
    join(process.cwd(), "assets/fonts/PlayfairDisplay-Italic-700.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // Obsidian page canvas, so the mark reads as an extension of the site.
          background: "#05080d",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Playfair",
            fontStyle: "italic",
            fontSize: 28,
            color: "#ffffff",
            // The italic serif leans right; nudge back so the glyph sits
            // optically centred rather than metrically centred.
            transform: "translate(0, -1px)",
          }}
        >
          S
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Playfair", data: playfair, style: "italic", weight: 700 }],
    },
  );
}
