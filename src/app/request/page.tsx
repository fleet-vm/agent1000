import { Suspense } from "react";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RequestBody } from "@/components/request/RequestBody";
import { OG_IMAGE } from "@/lib/site";

const DESCRIPTION =
  "Describe a task in your institution and see which Agent1000 agents come closest to covering it.";

export const metadata: Metadata = {
  title: "Describe the work",
  description: DESCRIPTION,
  // The page renders from `?q=`, so there is one URL per task anyone has ever
  // typed. All of them are the same page with different input; the canonical
  // says so, and robots.txt keeps a crawler from walking the set to find out.
  alternates: { canonical: "/request" },
  openGraph: {
    type: "website",
    url: "/request",
    title: "Describe the work — Agent1000",
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RequestPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="mx-auto w-full max-w-[640px] px-6 py-8">
              <p className="text-ui text-muted">Reading the task.</p>
            </div>
          }
        >
          <RequestBody />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
