import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PartnerCard } from "@/components/partners/PartnerCard";
import {
  PARTNERS_ARE_PLACEHOLDER,
  partnersByName,
  ROLE_LABEL,
  ROLE_NOTE,
  uncoveredProvinces,
  type PartnerRole,
} from "@/data/partners";
import { SALES_EMAIL } from "@/lib/demoRequest";
import { OG_IMAGE } from "@/lib/site";

const DESCRIPTION =
  "The companies appointed to sell and integrate Agent1000 agents in South Africa. If a company is not on this list, it is not certified.";

export const metadata: Metadata = {
  title: "Certified resellers and integrators",
  description: DESCRIPTION,
  alternates: { canonical: "/partners" },
  // While the register holds example entries, the page is kept out of the
  // index. Invented companies described as certified are exactly the kind of
  // claim that should never be searchable, and a placeholder that quietly
  // ranks is worse than one nobody finds. Flipping PARTNERS_ARE_PLACEHOLDER
  // lifts this and puts the page in the sitemap.
  robots: PARTNERS_ARE_PLACEHOLDER ? { index: false, follow: true } : undefined,
  openGraph: {
    type: "website",
    url: "/partners",
    title: "Certified resellers and integrators | Agent1000",
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

/**
 * The public register of appointed partners.
 *
 * The page has one job, and it is not marketing: an institution that is about
 * to let a company into its systems needs somewhere to check that the company
 * was actually appointed. Everything is arranged around that check -- what
 * certification means, how to verify a claim, then the register itself.
 *
 * The verification section sits above the list on purpose. A reader who came
 * here because a salesperson told them to should meet the sentence that
 * matters -- not on this list means not certified -- before they meet the
 * names.
 */

const ROLES: PartnerRole[] = ["reseller", "integrator"];

const LINK =
  "underline decoration-rule underline-offset-2 transition-colors duration-150 hover:text-signal hover:decoration-signal";

const TERM =
  "text-micro tracking-[0.06em] text-muted uppercase sm:w-[92px] sm:shrink-0 sm:pt-[3px]";

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-rule pt-4">
      <h2 className="text-micro tracking-[0.06em] text-muted uppercase">
        {heading}
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

/** `a, b and c`. Used once, for the provinces with nobody in them. */
function formatList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export default function PartnersPage() {
  const uncovered = uncoveredProvinces();

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[880px] px-6 py-12">
          <h1 className="font-display text-head font-semibold tracking-tight text-ink">
            Certified resellers and integrators
          </h1>
          <p className="mt-3 text-lede text-muted">
            The companies appointed to sell and integrate Agent1000 agents.
          </p>

          {PARTNERS_ARE_PLACEHOLDER && (
            <p className="mt-5 rounded-lg border border-rule bg-surface px-4 py-3 text-ui text-ink">
              <span className="font-medium">
                These entries are examples, not appointments.
              </span>{" "}
              The register is being prepared. No company below has been
              appointed, and the names, certificate numbers and contact details
              are placeholders. Write to{" "}
              <a href={`mailto:${SALES_EMAIL}`} className={LINK}>
                {SALES_EMAIL}
              </a>{" "}
              to check any claim of certification in the meantime.
            </p>
          )}

          <div className="mt-6 flex flex-col gap-5">
            <Section heading="What certification means">
              <p className="text-body text-ink">
                A certified company has been vetted &mdash; company
                registration, tax compliance, CSD listing &mdash; has signed a
                reseller agreement with us, and has been trained on the agents
                named against it. It is appointed for those agents and no
                others.
              </p>
              <p className="mt-2 text-ui text-muted">
                It is a statement about the company, not a guarantee of any
                particular piece of work. Your contract for the work is with
                them.
              </p>
              <dl className="mt-3 flex flex-col gap-2">
                {ROLES.map((role) => (
                  <div
                    key={role}
                    className="flex flex-col gap-0.5 sm:flex-row sm:gap-3"
                  >
                    <dt className={TERM}>{ROLE_LABEL[role]}</dt>
                    <dd className="text-meta text-ink">{ROLE_NOTE[role]}</dd>
                  </div>
                ))}
              </dl>
            </Section>

            <Section heading="Check before you sign anything">
              <p className="text-body text-ink">
                If a company is not on this list, it is not certified. Being
                introduced by someone, holding a proposal on our letterhead, or
                quoting work we have done is not certification.
              </p>
              <p className="mt-2 text-ui text-muted">
                Every entry carries a certificate number. Quote it to{" "}
                <a href={`mailto:${SALES_EMAIL}`} className={LINK}>
                  {SALES_EMAIL}
                </a>{" "}
                and we will confirm in writing that it is current and what it
                covers. Nobody pays to be listed here, and nothing on this page
                asks you or a partner for banking details.
              </p>
            </Section>

            <section className="border-t border-rule pt-4">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-micro tracking-[0.06em] text-muted uppercase">
                  The register
                </h2>
                <span className="tabular text-meta text-muted">
                  {partnersByName.length}{" "}
                  {partnersByName.length === 1 ? "company" : "companies"}
                </span>
              </div>

              <ul className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                {partnersByName.map((partner) => (
                  <PartnerCard key={partner.slug} partner={partner} />
                ))}
              </ul>

              {uncovered.length > 0 && (
                <p className="mt-3 text-meta text-muted">
                  Nobody is appointed yet in {formatList(uncovered)}. An
                  institution there works with us directly, or with a partner
                  above who is willing to travel &mdash; anyone claiming the
                  territory is claiming something they do not have.
                </p>
              )}
            </section>

            <Section heading="Applying">
              <p className="text-body text-ink">
                Companies are appointed after vetting, not on request. What we
                check, and in what order, is set out on the{" "}
                <Link href="/resellers" className={LINK}>
                  reseller page
                </Link>
                , which is also where you apply.
              </p>
            </Section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
