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
        <Link
          href="/resellers"
          className="ml-auto transition-colors duration-150 hover:text-signal"
        >
          Resellers
        </Link>
        {/* Hidden for now. The page is still built and still reachable at
            /legal -- only the link is out. Restore this before the site is
            public: /legal is where the registration number and registered
            address go, and an ECTA s43 notice has to be findable from the
            site, not just present on it. */}
        {/* <Link
          href="/legal"
          className="transition-colors duration-150 hover:text-signal"
        >
          Legal
        </Link> */}
      </div>
    </footer>
  );
}
