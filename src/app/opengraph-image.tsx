import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

/**
 * The share card, generated at build time.
 *
 * It is the site's own palette and the wordmark's own construction -- the
 * numerals set smaller and lifted, in mono, against the sans word -- rather
 * than a screenshot or a stock graphic. What a link preview shows is the first
 * thing most people will see of this site, and it should look like the site.
 *
 * Set in the default sans rather than Inter: `next/font/google` resolves
 * Inter at build for the pages, but ImageResponse needs the raw font bytes,
 * and shipping a .ttf into the repo for one image is not worth it yet. If the
 * wordmark's exact face starts to matter on social, that is the change --
 * commit `Inter-SemiBold.ttf` and pass it in `fonts`.
 */

export const alt =
  "Agent1000 — a supervised AI workforce for South African public institutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Same requirement as the sitemap and robots routes under `output: 'export'`.
export const dynamic = "force-static";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#f5f5f4", // --color-paper
          color: "#121215", // --color-ink
          padding: "96px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <span style={{ fontSize: 116, fontWeight: 600, letterSpacing: "-0.03em" }}>Agent</span>
          {/* The numeral lift, as on the wordmark itself. */}
          <span
            style={{
              fontSize: 58,
              letterSpacing: "0.18em",
              marginTop: 14,
              marginLeft: 10,
              color: "#3d6e3d", // --color-signal
            }}
          >
            1000
          </span>
        </div>

        <div
          style={{
            width: "100%",
            height: 1,
            background: "#e4e4e4", // --color-rule
            marginTop: 40,
            marginBottom: 40,
          }}
        />

        <div style={{ display: "flex", fontSize: 38, lineHeight: 1.35 }}>
          Agents that do the work. Officials who approve it.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 26,
            color: "#5c5c66", // --color-muted
          }}
        >
          {SITE_NAME} · South Africa
        </div>
      </div>
    ),
    size,
  );
}
