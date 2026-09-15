import {
  agents,
  CATEGORY_LABEL,
  INSTITUTION_LABEL,
  type Agent,
} from "@/data/agents";
import type { Post } from "@/data/posts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, url } from "@/lib/site";

/**
 * Structured data.
 *
 * Every claim here restates something already visible on the page. Nothing is
 * added because a rich result wants it -- no ratings, no review counts, no
 * prices, no employee numbers. Two reasons, and the second is the load-bearing
 * one: Google penalises structured data that contradicts the page, and the
 * site's own rule is that it publishes no metrics and names no client.
 *
 * In particular there is no `aggregateRating` and no `offers`. Both would be
 * invented, and both are exactly what a search console manual action is for.
 */

function Script({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // The content is ours and JSON.stringify escapes the payload; the only
      // sequence that can break out of a script element is "</", which cannot
      // survive stringification of these values.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Home page: who the organisation is, and what the site is. */
export function OrganizationJsonLd() {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: SITE_NAME,
            url: SITE_URL,
            description: SITE_DESCRIPTION,
            // The market, stated once and truthfully. This is the single most
            // useful signal on the page for a search that is regional.
            areaServed: {
              "@type": "Country",
              name: "South Africa",
            },
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "sales",
              email: "sales@agent1000.co.za",
              areaServed: "ZA",
              availableLanguage: "en",
            },
          },
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: SITE_URL,
            name: SITE_NAME,
            description: SITE_DESCRIPTION,
            publisher: { "@id": `${SITE_URL}/#organization` },
            inLanguage: "en-ZA",
          },
        ],
      }}
    />
  );
}

/** The directory: the catalogue as an ordered list, in the order it renders. */
export function AgentListJsonLd() {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Agent1000 agents",
        itemListOrder: "https://schema.org/ItemListUnordered",
        numberOfItems: agents.length,
        itemListElement: agents.map((agent, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: url(`/agents/${agent.slug}`),
          name: agent.name,
        })),
      }}
    />
  );
}

/**
 * An agent detail page, plus its breadcrumb.
 *
 * `SoftwareApplication` rather than `Product`: a Product without an offer or a
 * rating is an incomplete Product, and the offer is not ours to invent. There
 * is no pricing on this site by choice.
 */
export function AgentJsonLd({ agent }: { agent: Agent }) {
  const page = url(`/agents/${agent.slug}`);

  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "SoftwareApplication",
            "@id": `${page}#software`,
            name: agent.name,
            url: page,
            description: agent.summary,
            applicationCategory: "BusinessApplication",
            applicationSubCategory: CATEGORY_LABEL[agent.category],
            operatingSystem: "Web-based",
            provider: { "@id": `${SITE_URL}/#organization` },
            // Restates the "Who it is for" section verbatim.
            audience: agent.institutions.map((institution) => ({
              "@type": "Audience",
              audienceType: INSTITUTION_LABEL[institution],
            })),
          },
          {
            "@type": "BreadcrumbList",
            "@id": `${page}#breadcrumb`,
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Agent1000",
                item: SITE_URL,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Agents",
                item: url("/agents"),
              },
              {
                "@type": "ListItem",
                position: 3,
                name: agent.name,
                item: page,
              },
            ],
          },
        ],
      }}
    />
  );
}

/** A blog post. Dates and names restate what the page shows; nothing more. */
export function BlogPostingJsonLd({ post }: { post: Post }) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${url(`/blog/${post.slug}`)}#post`,
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        inLanguage: "en-ZA",
        url: url(`/blog/${post.slug}`),
        author: { "@type": "Organization", name: post.author },
        publisher: { "@id": `${SITE_URL}/#organization` },
        isPartOf: { "@type": "Blog", "@id": `${url("/blog")}#blog`, name: `${SITE_NAME} blog` },
      }}
    />
  );
}
