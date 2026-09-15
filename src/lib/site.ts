/**
 * The one place the site knows its own address.
 *
 * Canonical URLs, Open Graph URLs, the sitemap and robots.txt all need an
 * absolute origin, and a static export has no request to infer one from. Get
 * this wrong and the damage is quiet: canonicals pointing at a domain that is
 * not live tell Google to index nothing.
 *
 * `NEXT_PUBLIC_SITE_URL` overrides it -- set that on a staging deploy so
 * staging never claims to be production. It is inlined at build time, so a
 * change needs a rebuild.
 */

const FALLBACK = "https://agent1000.co.za";

/** No trailing slash, so `${SITE_URL}/agents` never doubles it. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK).replace(
  /\/+$/,
  "",
);

export const SITE_NAME = "Agent1000";

export const SITE_DESCRIPTION =
  "AI Cloud Platform Workforce for South African public institutions. Agents do the repetitive operational work; a named official approves what they do.";

/** Absolute URL for a route. Sitemaps and canonicals both require one. */
export function url(path = "/"): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

/**
 * The share card produced by `src/app/opengraph-image.tsx`.
 *
 * A page that sets its own `openGraph` block replaces the inherited one
 * wholesale, image included -- so every page that customises the title has to
 * name the image again or silently ship a link preview with no picture while
 * still claiming `summary_large_image`. Referencing it from here means there is
 * one string to change, not five.
 */
export const OG_IMAGE = "/opengraph-image";
