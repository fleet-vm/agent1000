import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ResellerForm } from "@/components/resellers/ResellerForm";
import { OG_IMAGE } from "@/lib/site";

const DESCRIPTION =
  "Apply to resell Agent1000 agents to South African public institutions. Every applicant is vetted for company registration, tax compliance and CSD listing before appointment.";

export const metadata: Metadata = {
  title: "Resellers",
  description: DESCRIPTION,
  alternates: { canonical: "/resellers" },
  openGraph: {
    type: "website",
    url: "/resellers",
    title: "Resellers | Agent1000",
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

/**
 * The reseller programme, and the application that starts it.
 *
 * The page is written around one constraint: a reseller carries the Agent1000
 * name into institutions that are handing over access to their systems. Nothing
 * here may read as though filling in a form appoints anyone, because an
 * applicant who believes they are appointed will say so to a client before
 * anyone has checked a single thing about them.
 *
 * Hence the order: what the programme is, what vetting means, and only then the
 * form. Not the form first.
 */

const STEPS = [
  {
    title: "You apply",
    body: "The form below. It asks for what is needed to start checking, and nothing that could not be sent to a stranger.",
  },
  {
    title: "We check the company",
    body: "CIPC registration, tax compliance status, CSD listing, and B-BBEE where you have claimed a level. Public records, checked against what you told us.",
  },
  {
    title: "We talk",
    body: "Which agents you would carry, which institutions you already work with, and what support you would take on yourself. This is also where you ask us the hard questions.",
  },
  {
    title: "We sign, then you can sell",
    body: "A reseller agreement, in writing, covering what you may say we do and what you may not. Until it is signed, you are an applicant.",
  },
];

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

export default function ResellersPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[640px] px-6 py-12">
          <h1 className="font-display text-head font-semibold tracking-tight text-ink">Resellers</h1>
          <p className="mt-3 text-lede text-muted">
            Sell Agent1000 agents into the institutions you already serve.
          </p>

          <div className="mt-6 flex flex-col gap-5">
            <Section heading="What a reseller does">
              <p className="text-body text-ink">
                An agent runs against an institution&rsquo;s own systems and acts
                with its own approvals. A reseller introduces that, sets the
                expectations honestly, and stays in the room afterwards. It is a
                relationship business before it is a software one.
              </p>
            </Section>

            <Section heading="Every applicant is vetted">
              <p className="text-body text-ink">
                A reseller carries our name into institutions that are handing
                over access to their systems. We check who we are appointing
                before we appoint them, and we do not skip it for anyone.
              </p>
              <ol className="mt-3 flex flex-col gap-3">
                {STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="tabular mt-0.5 shrink-0 text-meta text-muted">
                      {i + 1}
                    </span>
                    <span>
                      <span className="text-ui font-medium text-ink">
                        {step.title}
                      </span>
                      <span className="mt-0.5 block text-ui text-muted">
                        {step.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </Section>

            <Section heading="Once you are appointed">
              <p className="text-body text-ink">
                Appointed companies are listed on the{" "}
                <Link
                  href="/partners"
                  className="underline decoration-rule underline-offset-2 transition-colors duration-150 hover:text-signal hover:decoration-signal"
                >
                  public register
                </Link>
                , with the agents they carry and a certificate number an
                institution can quote back to us. Being on it is the only proof
                of appointment there is, and an institution that checks will
                check there.
              </p>
            </Section>

            <Section heading="What we will not ask you for here">
              <p className="text-body text-ink">
                Banking details, directors&rsquo; ID numbers, and certificate
                uploads are not collected on this form. If any of them are needed
                after vetting, we ask over a channel we have agreed with you
                first.
              </p>
              <p className="mt-2 text-ui text-muted">
                Anything claiming to be Agent1000 that asks for banking details
                on a web form is not Agent1000.
              </p>
            </Section>

            <Section heading="Apply">
              <ResellerForm />
            </Section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
