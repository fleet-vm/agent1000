import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThreadDemos } from "@/components/ThreadDemos";
import { ControlBand } from "@/components/ControlBand";
import { catalogueThreads } from "@/data/threads";
import { OG_IMAGE } from "@/lib/site";

const DESCRIPTION =
  "Worked examples of Agent1000 agents doing real institutional tasks — patching a portal, publishing a statement, filing registry mail, assembling a monthly pack, watching the public sites. Every binding action waits for a named official.";

export const metadata: Metadata = {
  title: "Use cases",
  description: DESCRIPTION,
  alternates: { canonical: "/use-cases" },
  openGraph: {
    type: "website",
    url: "/use-cases",
    title: "Use cases — Agent1000",
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

/**
 * A thread for each agent in the catalogue.
 *
 * `/` carries the desks -- the work anyone in an institution recognises. This
 * page carries the agents themselves, because someone who has read the
 * catalogue wants to see the thing described on the detail page actually
 * happen, and a summary line cannot show an approval gate stopping a job.
 *
 * Every thread links back to its agent, so the demo and the page that says
 * what the agent connects to and who signs off are never more than one click
 * apart.
 */
export default function UseCasesPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1 px-6 py-12">
        <div className="mx-auto w-full max-w-[640px]">
          <h1 className="font-display text-head font-semibold tracking-tight text-ink">Use cases</h1>
          <p className="mt-4 text-meta text-muted">
            Looking for the everyday desks — leave, the morning brief, a reply,
            a project status?{" "}
            <Link
              href="/"
              className="text-signal transition-colors duration-150 hover:underline"
            >
              Those are on the front page
            </Link>
            .
          </p>

          <div className="mt-8 border-t border-rule pt-8">
            <ThreadDemos threads={catalogueThreads.slice(0, 2)} />
          </div>

          <div className="mt-10">
            <ControlBand />
          </div>

          <div className="mt-10">
            <ThreadDemos threads={catalogueThreads.slice(2)} from={3} />
          </div>

          <p className="mt-8 border-t border-rule pt-4 text-meta text-muted">
            <Link
              href="/agents"
              className="text-signal transition-colors duration-150 hover:underline"
            >
              Browse every agent
            </Link>{" "}
            — what each one connects to, and who approves what.
          </p>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
