import { Suspense } from "react";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RequestBody } from "@/components/request/RequestBody";

export const metadata: Metadata = {
  title: "Describe the work — Agent1000",
  description:
    "Describe a task and see which Agent1000 agents come closest to covering it.",
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
