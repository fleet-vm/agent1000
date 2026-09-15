import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BlogPostingJsonLd } from "@/components/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { formatDate, getPost, posts, postsByDate } from "@/data/posts";
import { OG_IMAGE } from "@/lib/site";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

// A slug that is not in the register is a 404, not a broken import.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };

  const path = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: `${post.title} — Agent1000`,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author],
      images: [OG_IMAGE],
    },
  };
}

/**
 * One post. The body is the MDX file with the same slug; the frame around it
 * -- date, tag, title, lede, the next post -- comes from the register.
 */
export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { default: Body } = await import(`@/content/blog/${slug}.mdx`);

  const index = postsByDate.findIndex((p) => p.slug === slug);
  const next = postsByDate[index + 1] ?? postsByDate[index - 1];

  return (
    <>
      <BlogPostingJsonLd post={post} />
      <SiteHeader />

      <main className="flex-1">
        <article className="mx-auto w-full max-w-[720px] px-6 pt-12 pb-16 sm:pt-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-meta text-muted transition-colors duration-150 hover:text-signal"
          >
            <ArrowLeft aria-hidden="true" strokeWidth={1.5} className="size-3.5" />
            All posts
          </Link>

          <header className="mt-8">
            <p className="flex items-center gap-2 text-micro font-medium tracking-[0.1em] text-muted uppercase">
              <time dateTime={post.date} className="tabular">
                {formatDate(post.date)}
              </time>
              <span aria-hidden="true">·</span>
              <span className="text-signal">{post.tag}</span>
            </p>
            <h1 className="mt-4 font-display text-[36px] leading-[1.08] font-semibold tracking-tight text-ink sm:text-[48px]">
              {post.title}
            </h1>
            <p className="mt-5 text-lede text-muted">{post.description}</p>
            <p className="mt-5 border-t border-rule pt-4 text-meta text-muted">
              {post.author} · {post.readingMinutes} min read
            </p>
          </header>

          <div className="prose-a1k mt-10">
            <Body />
          </div>

          <footer className="mt-16 border-t border-rule pt-8">
            <div className="rounded-lg border border-rule bg-surface p-6 sm:p-8">
              <p className="eyebrow">Next step</p>
              <p className="mt-2 font-display text-[26px] leading-tight font-semibold tracking-tight text-ink">
                See what an agent would do with the work on your desk.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <ButtonLink href="/request">Request a demo</ButtonLink>
                <ButtonLink href="/agents" tone="secondary">
                  Browse the agents
                </ButtonLink>
              </div>
            </div>

            {next && (
              <p className="mt-6 text-ui text-muted">
                Read next:{" "}
                <Link
                  href={`/blog/${next.slug}`}
                  className="text-signal transition-colors duration-150 hover:underline"
                >
                  {next.title}
                </Link>
              </p>
            )}
          </footer>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
