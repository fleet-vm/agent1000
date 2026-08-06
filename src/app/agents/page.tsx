import { Suspense } from "react";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AgentsDirectory } from "@/components/agents/AgentsDirectory";

export const metadata: Metadata = {
  title: "Agents — Agent1000",
  description:
    "Every Agent1000 agent, what it connects to, and what a person approves.",
};

/**
 * Filter state lives in the URL, which means `useSearchParams` — so the
 * directory is client-rendered inside a Suspense boundary while the page shell
 * around it still prerenders into the static export.
 */
export default function AgentsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="mx-auto w-full max-w-[1120px] px-6 py-8">
              <h1 className="text-head text-ink">Agents</h1>
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
