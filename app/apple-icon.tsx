import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// 180 is the size iOS asks for; it also satisfies Google's "multiple of 48"
// preference for the favicon shown next to search results.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
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
          // Full bleed and square: iOS applies its own rounded mask, so a
          // radius here would be clipped twice and read as a dark halo.
          background: "#05080d",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Playfair",
            fontStyle: "italic",
            fontSize: 132,
            color: "#ffffff",
            transform: "translate(0, -5px)",
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
