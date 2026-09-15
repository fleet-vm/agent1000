import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PostCard } from "@/components/blog/PostCard";
import { postsByDate } from "@/data/posts";
import { OG_IMAGE } from "@/lib/site";

const DESCRIPTION =
  "Product notes, field notes and governance: what it takes to run supervised AI agents inside a South African public institution.";

export const metadata: Metadata = {
  title: "Blog",
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "Blog | Agent1000",
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

/**
 * The index. Newest post first and larger; the rest in a grid. Posts come
 * from `src/data/posts.ts`; there is nothing to configure here.
 */
export default function BlogPage() {
  const [latest, ...rest] = postsByDate;

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1120px] px-6 pt-14 pb-16 sm:pt-20">
          <div className="max-w-[640px]">
            <h1 className="font-display text-title font-semibold tracking-tight text-ink">
              Blog
            </h1>
            <p className="mt-4 text-lede text-muted">{DESCRIPTION}</p>
          </div>

          {latest ? (
            <>
              <section aria-labelledby="latest-heading" className="mt-14">
                <p className="eyebrow">Featured</p>
                <h2
                  id="latest-heading"
                  className="mt-2 font-display text-head font-semibold tracking-tight text-ink"
                >
                  Latest post
                </h2>
                <ul className="mt-6 grid">
                  <PostCard post={latest} featured />
                </ul>
              </section>

              {rest.length > 0 && (
                <section aria-labelledby="all-heading" className="mt-14">
                  <h2
                    id="all-heading"
                    className="font-display text-head font-semibold tracking-tight text-ink"
                  >
                    All posts
                  </h2>
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((post) => (
                      <PostCard key={post.slug} post={post} />
                    ))}
                  </ul>
                </section>
              )}
            </>
          ) : (
            <p className="mt-14 text-body text-muted">Nothing published yet.</p>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
