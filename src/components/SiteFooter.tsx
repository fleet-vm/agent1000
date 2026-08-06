import Link from "next/link";

/**
 * One hairline row. The entity name must match the CIPC registration exactly
 * before this goes public -- see the README.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex w-full max-w-[1120px] items-center gap-4 px-6 py-3 text-meta text-muted">
        <span>Agent1000</span>
        <span className="tabular">2026</span>
        <Link href="/legal" className="ml-auto hover:text-signal">
          Legal
        </Link>
      </div>
    </footer>
  );
}
