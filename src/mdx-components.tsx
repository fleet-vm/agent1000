import type { MDXComponents } from "mdx/types";
import Link from "next/link";

/**
 * How a blog post's markdown renders. Required by `@next/mdx`; every element a
 * post can produce is styled here and nowhere else, so a post never carries
 * its own classes.
 *
 * The measure and the vertical rhythm come from `.prose-a1k` in globals.css.
 * Headings inside a post start at `##` -- the post's title is the page's h1.
 */
const components = {
  h2: ({ children }) => (
    <h2 className="font-display text-[26px] leading-tight font-semibold tracking-tight text-ink mt-12">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-display text-[21px] leading-snug font-semibold text-ink mt-8">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="text-[17px] leading-[1.7] text-ink">{children}</p>,
  a: ({ href = "", children }) => {
    const external = /^https?:\/\//.test(href);
    const className =
      "text-signal underline decoration-signal/40 underline-offset-[3px] transition-colors duration-150 hover:decoration-signal";
    return external ? (
      <a href={href} className={className} rel="noopener noreferrer">
        {children}
      </a>
    ) : (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  },
  ul: ({ children }) => (
    <ul className="flex list-disc flex-col gap-2 pl-6 text-[17px] leading-[1.7] text-ink marker:text-muted">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="tabular flex list-decimal flex-col gap-2 pl-6 text-[17px] leading-[1.7] text-ink marker:text-muted">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-signal pl-5 font-display text-[21px] leading-relaxed text-ink italic [&>p]:font-display [&>p]:text-[21px] [&>p]:leading-relaxed">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-rule" />,
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  code: ({ children }) => (
    <code className="rounded-sm bg-ready-bg px-1.5 py-0.5 font-mono text-[0.9em] text-ink">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-lg border border-rule bg-surface p-4 font-mono text-meta leading-relaxed text-ink [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-meta">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-ui">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-rule py-2 pr-4 text-left text-micro font-medium tracking-[0.08em] text-muted uppercase">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="border-b border-rule py-2 pr-4 align-top text-ink">{children}</td>,
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={props.alt ?? ""}
      className="w-full rounded-lg border border-rule"
      loading="lazy"
    />
  ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
