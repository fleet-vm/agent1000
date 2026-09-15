import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Legal",
  description: "Company details for Agent1000, registered in South Africa.",
  alternates: { canonical: "/legal" },
};

/**
 * The only page added for legal reasons, and it stays a stub until the
 * registration details and the operator's actual terms are settled. Do not grow
 * this into an About page.
 */
export default function LegalPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-[640px] px-6 py-12">
          <h1 className="font-display text-head font-semibold tracking-tight text-ink">Legal</h1>
          <p className="mt-4 text-lede text-muted">
            Agent1000 is registered in South Africa.
          </p>
          <p className="mt-3 text-body text-muted">
            Company registration number, registered address, terms of use and
            privacy notice to be added before this site goes public.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
