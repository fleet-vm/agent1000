import type { MetadataRoute } from "next";
import { agents } from "@/data/agents";
import { PARTNERS_ARE_PLACEHOLDER } from "@/data/partners";
import { url } from "@/lib/site";

/**
 * The sitemap, generated from the same seed file the site is.
 *
 * Adding an agent to `src/data/agents.ts` puts it in here automatically. That
 * is the point: a hand-maintained sitemap drifts from the routes within a
 * release or two, and a sitemap listing URLs that 404 is worse than none.
 *
 * `lastModified` is the build time. The honest alternative would be a per-page
 * date, but nothing in the catalogue carries one, and inventing per-URL dates
 * that do not track real edits is how a sitemap teaches a crawler to distrust
 * its own dates.
 */
/**
 * `sitemap.ts` compiles to a Route Handler, and under `output: 'export'` a
 * handler has to say it is static or the build refuses to collect it. There is
 * nothing request-dependent here, so this is a formality -- but a required one.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: url("/"),
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: url("/agents"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: url("/use-cases"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...agents.map((agent) => ({
      url: url(`/agents/${agent.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      // The detail pages are the substance of the site -- they carry what each
      // agent connects to and what a person approves -- so they outrank the
      // form pages.
      priority: 0.8,
    })),
    {
      url: url("/resellers"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // The register is only advertised once it holds real appointments. While
    // it is placeholder the page is served `noindex`, and a sitemap entry for
    // a noindex URL is a contradiction a crawler is entitled to distrust.
    ...(PARTNERS_ARE_PLACEHOLDER
      ? []
      : [
          {
            url: url("/partners"),
            lastModified,
            changeFrequency: "monthly" as const,
            priority: 0.7,
          },
        ]),
    {
      url: url("/request"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: url("/legal"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.1,
    },
  ];
}
