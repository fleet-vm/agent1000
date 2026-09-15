import { Suspense } from "react";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AgentsDirectory } from "@/components/agents/AgentsDirectory";
import { AgentListJsonLd } from "@/components/JsonLd";
import { OG_IMAGE } from "@/lib/site";

const DESCRIPTION =
  "Every Agent1000 agent for South African public institutions: what each one does, how it is reached, and what a person approves. Filter by institution type, from national department to local municipality.";

export const metadata: Metadata = {
  title: "Agents",
  description: DESCRIPTION,
  // Filter state lives in the query string, so every combination of facets is
  // its own URL. The canonical folds them back into one indexable page.
  alternates: { canonical: "/agents" },
  openGraph: {
    type: "website",
    url: "/agents",
    title: "Agents | Agent1000",
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

/**
 * Filter state lives in the URL, which means `useSearchParams` — so the
 * directory is client-rendered inside a Suspense boundary while the page shell
 * around it still prerenders into the static export.
 */
export default function AgentsPage() {
  return (
    <>
      <AgentListJsonLd />
      <SiteHeader />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="mx-auto w-full max-w-[1120px] px-6 py-12">
              <h1 className="font-display text-head font-semibold tracking-tight text-ink">Agents</h1>
              <p className="mt-1 text-ui text-muted">Loading the catalogue.</p>
            </div>
          }
        >
          <AgentsDirectory />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
