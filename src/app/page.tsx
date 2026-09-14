import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import { TaskInput } from "@/components/TaskInput";
import { AgentTiles } from "@/components/AgentTiles";
import { HowItWorks } from "@/components/HowItWorks";
import { ThreadDemos } from "@/components/ThreadDemos";
import { ControlBand } from "@/components/ControlBand";
import { SiteFooter } from "@/components/SiteFooter";
import { OrganizationJsonLd } from "@/components/JsonLd";
import { officeThreads } from "@/data/threads";

/**
 * The hero, the four steps, and the demos.
 *
 * Everything shares one 640px measure and one optical left edge on desktop, so
 * the page reads as a single object rather than five centred things of
 * different widths.
 *
 * The demos here are the desks -- leave, the morning brief, a reply, a project
 * status -- because a reader meets their own working week in those before they
 * meet a catalogue. The agents in the catalogue get their own threads on
 * `/use-cases`, where someone who is already interested goes next.
 */
export default function Home() {
  return (
    <>
      <OrganizationJsonLd />

      <main className="flex flex-1 justify-center px-6 py-16">
        <div className="w-full max-w-[640px] text-center sm:text-left">
          <Wordmark
            as="h1"
            className="anim-rise text-[clamp(44px,9vw,96px)] text-ink"
          />

          <div
            aria-hidden="true"
            className="anim-rule delay-1 mt-6 h-px bg-rule"
          />

          <p className="anim-rise delay-2 mt-6 text-body text-ink">
            Give an agent a repetitive task in your institution, and an official
            approves what it does.
          </p>

          <div className="anim-rise delay-3 mt-8">
            <TaskInput />
          </div>

          <div className="anim-rise delay-4 mt-12">
            <AgentTiles />
          </div>

          <div className="mt-16 text-left">
            <HowItWorks />
          </div>

          <section
            aria-labelledby="demos-heading"
            className="mt-16 border-t border-rule pt-8 text-left"
          >
            <h2 id="demos-heading" className="text-head font-medium text-ink">
              See agents at work
            </h2>
            <p className="mt-1 text-meta text-muted">
              Four desks, one Monday morning.
            </p>
            <p className="mt-3 max-w-[52ch] text-ui leading-6 text-muted-ink">
              Every thread below starts with somebody asking for something in
              plain English. Watch where each one stops — that pause is a named
              official, and it is the whole product.
            </p>

            <div className="mt-6">
              <ThreadDemos threads={officeThreads.slice(0, 2)} />
            </div>

            <div className="mt-10">
              <ControlBand />
            </div>

            <div className="mt-10">
              <ThreadDemos threads={officeThreads.slice(2)} from={3} />
            </div>

            <p className="mt-6 text-ui text-muted-ink">
              <Link
                href="/use-cases"
                className="text-signal transition-colors duration-150 hover:underline"
              >
                Five more, one per agent in the catalogue
              </Link>{" "}
              — patching a portal, publishing a statement, filing registry mail,
              assembling a monthly pack, watching the public sites.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
