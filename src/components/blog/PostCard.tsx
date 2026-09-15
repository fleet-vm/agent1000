import Link from "next/link";
import { formatDate, type Post } from "@/data/posts";
import { cn } from "@/lib/cn";

/**
 * A post on the index. The date leads, small and tracked, because a blog's
 * cards are scanned by recency before they are read by title. `featured` is
 * the newest post, set larger and first.
 */
export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <li className={cn(featured && "sm:col-span-2 lg:col-span-3")}>
      <Link
        href={`/blog/${post.slug}`}
        className={cn(
          "group flex h-full flex-col rounded-lg border border-rule bg-surface transition-colors duration-150 hover:border-muted",
          featured ? "p-6 sm:p-8" : "p-5",
        )}
      >
        <p className="flex items-center gap-2 text-micro font-medium tracking-[0.1em] text-muted uppercase">
          <time dateTime={post.date} className="tabular">
            {formatDate(post.date)}
          </time>
          <span aria-hidden="true">·</span>
          <span className="text-signal">{post.tag}</span>
        </p>

        <h3
          className={cn(
            "font-display font-semibold tracking-tight text-ink transition-colors duration-150 group-hover:text-signal",
            featured
              ? "mt-4 max-w-[22ch] text-[32px] leading-[1.1] sm:text-[40px]"
              : "mt-3 text-[22px] leading-snug",
          )}
        >
          {post.title}
        </h3>

        <p
          className={cn(
            "text-muted",
            featured ? "mt-4 max-w-[58ch] text-lede" : "mt-2 text-ui",
          )}
        >
          {post.description}
        </p>

        <p className="mt-auto pt-5 text-meta text-muted">
          {post.author} · {post.readingMinutes} min read
        </p>
      </Link>
    </li>
  );
}
