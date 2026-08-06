import type { MetadataRoute } from "next";
import { url } from "@/lib/site";

/**
 * Nothing on this site is private, so everything is crawlable. The one rule
 * that earns its place is the query-string disallow: `/request?q=...` renders a
 * different page for every task anyone has ever typed, which is an unbounded
 * set of thin, near-duplicate URLs. The canonical on `/request` already
 * collapses them; this stops a crawler spending its budget discovering they
 * were duplicates.
 */
/** Same static-export requirement as the sitemap route. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/request?",
    },
    sitemap: url("/sitemap.xml"),
    host: url("/"),
  };
}
