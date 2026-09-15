import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";

/**
 * Three short columns and a hairline row. The entity name must match the CIPC
 * registration exactly before this goes public -- see the README.
 */
const COLUMNS = [
  {
    heading: "Product",
    links: [
      { href: "/agents", label: "Agents" },
      { href: "/use-cases", label: "Use cases" },
      { href: "/request", label: "Request a demo" },
    ],
  },
  {
    heading: "Partners",
    links: [
      { href: "/partners", label: "Certified partners" },
      { href: "/resellers", label: "Become a reseller" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/blog", label: "Blog" },
      /* Hidden for now. The page is still built and still reachable at
         /legal -- only the link is out. Restore this before the site is
         public: /legal is where the registration number and registered
         address go, and an ECTA s43 notice has to be findable from the
         site, not just present on it. */
      // { href: "/legal", label: "Legal" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-surface">
      <div className="mx-auto w-full max-w-[1120px] px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-block">
              <Wordmark className="text-[19px] text-ink" />
            </Link>
            <p className="mt-3 max-w-[30ch] text-meta text-muted">
              A supervised AI workforce for South African public institutions.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <p className="text-micro font-medium tracking-[0.12em] text-muted uppercase">
                {column.heading}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-ui text-ink transition-colors duration-150 hover:text-signal"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-rule pt-5 text-meta text-muted">
          <span>Agent1000</span>
          <span className="tabular">2026</span>
          <span className="ml-auto">Built in South Africa</span>
        </div>
      </div>
    </footer>
  );
}
