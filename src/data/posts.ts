/**
 * The blog register. One entry per post; the body lives in
 * `src/content/blog/<slug>.mdx` and is imported by slug.
 *
 * To publish a post:
 *
 *  1. Write `src/content/blog/<slug>.mdx`. Plain markdown; start headings at
 *     `##` because the title below becomes the page's h1.
 *  2. Add an entry here. Newest first is not required -- the list is sorted
 *     by `date` -- but keep `slug` identical to the file name, because the
 *     page imports the file by it and a mismatch is a build error.
 *  3. `npm run build`. The sitemap, the index and the post's own route all
 *     derive from this array.
 *
 * The three content rules in `agents.ts` apply here in full: no client
 * institution is ever named, no metrics, and nothing in development is
 * written as though it were running.
 */

export type PostTag = "Product" | "Field notes" | "Governance" | "Company";

export type Post = {
  /** Matches the MDX file name under `src/content/blog/`. */
  slug: string;
  title: string;
  /** One sentence. The card, the meta description and the share text. */
  description: string;
  /** ISO date, `YYYY-MM-DD`. Rendered in en-ZA and used as `datePublished`. */
  date: string;
  author: string;
  tag: PostTag;
  /** Roughly how long it takes to read, in minutes. Shown on the card. */
  readingMinutes: number;
};

export const posts: Post[] = [
  {
    slug: "why-every-agent-stops-for-a-person",
    title: "Why every agent stops for a person",
    description:
      "The approval gate is not a safety feature bolted onto the product. It is the product, and here is how we think about where it sits.",
    date: "2026-09-15",
    author: "Agent1000",
    tag: "Governance",
    readingMinutes: 4,
  },
];

/** Newest first. */
export const postsByDate = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

const dateFormat = new Intl.DateTimeFormat("en-ZA", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  return dateFormat.format(new Date(`${iso}T00:00:00Z`));
}
