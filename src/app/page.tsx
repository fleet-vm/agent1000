import { Wordmark } from "@/components/Wordmark";
import { TaskInput } from "@/components/TaskInput";
import { AgentTiles } from "@/components/AgentTiles";
import { SiteFooter } from "@/components/SiteFooter";
import { OrganizationJsonLd } from "@/components/JsonLd";

/**
 * The hero, and the whole of `/`.
 *
 * Nothing sits below the fold. Everything shares one 640px measure and one
 * optical left edge on desktop, so the column reads as a single object rather
 * than four centred things of different widths.
 */
export default function Home() {
  return (
    <>
      <OrganizationJsonLd />

      <main className="flex flex-1 items-center justify-center px-6 py-16">
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
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
