import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StepTabs } from "@/components/StepTabs";
import { TaskInput } from "@/components/TaskInput";
import { ThreadDemos } from "@/components/ThreadDemos";
import { ControlBand } from "@/components/ControlBand";
import { AgentCard } from "@/components/agents/AgentCard";
import { PostCard } from "@/components/blog/PostCard";
import { ButtonLink } from "@/components/ui/Button";
import { OrganizationJsonLd } from "@/components/JsonLd";
import { agents, INSTITUTION_LABEL, type AgentInstitution } from "@/data/agents";
import { postsByDate } from "@/data/posts";
import { officeThreads } from "@/data/threads";

/**
 * The front page: a centred hero, the product frame with its four tabs, and
 * then alternating bands -- the catalogue, the recorded desks, the governance
 * beat, the blog, one closing ask.
 *
 * The demos here are the desks -- leave, the morning brief, a reply, a project
 * status -- because a reader meets their own working week in those before they
 * meet a catalogue. The agents in the catalogue get their own threads on
 * `/use-cases`, where someone who is already interested goes next.
 */

/**
 * The catalogue grid on the front page. Six, so the grid is full; the badge
 * on each card says honestly which of them exist today.
 */
const SHOWN = ["vulnwatch", "contentdesk", "recordsdesk", "reportpack", "sitewatch", "minutedesk"];

/** The kinds of institution the site is written for, as a quiet strip. */
const AUDIENCE: AgentInstitution[] = [
  "national-department",
  "provincial-department",
  "national-entity",
  "metro",
  "local-municipality",
  "higher-education",
  "seta",
];

function Band({
  tone = "paper",
  children,
  className = "",
}: {
  tone?: "paper" | "surface";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`${tone === "surface" ? "bg-surface" : "bg-paper"} border-t border-rule ${className}`}
    >
      <div className="mx-auto w-full max-w-[1120px] px-6 py-16 sm:py-20">{children}</div>
    </section>
  );
}

export default function Home() {
  const shown = SHOWN.map((slug) => agents.find((a) => a.slug === slug)!);
  const latestPosts = postsByDate.slice(0, 3);

  return (
    <>
      <OrganizationJsonLd />
      <SiteHeader />

      <main className="flex-1">
        {/* ------------------------------------------------------- hero */}
        <div className="mx-auto w-full max-w-[1120px] px-6 pt-16 pb-12 sm:pt-24">
          <div className="mx-auto flex max-w-[800px] flex-col items-center text-center">
            <Link
              href="/agents?st=production"
              className="anim-rise inline-flex flex-wrap items-center justify-center gap-x-2 text-ui text-ink transition-colors duration-150 hover:text-signal"
            >
              <span className="eyebrow hidden sm:inline">Live</span>
              <span aria-hidden="true" className="hidden text-muted sm:inline">
                ·
              </span>
              VulnWatch and ContentDesk are in production
              <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-3.5" />
            </Link>

            <h1 className="anim-rise delay-1 mt-6 font-display text-display font-semibold tracking-tight text-ink">
              Agents that do the work.{" "}
              <br className="hidden sm:block" />
              Officials who <span className="text-signal">approve it</span>.
            </h1>

            <p className="anim-rise delay-2 mt-6 max-w-[58ch] text-lede text-muted">
              A supervised AI workforce for South African public institutions.
              Agents take the repetitive operational work — leave, correspondence,
              patching, publishing — and a named official approves every binding
              action.
            </p>

            <div className="anim-rise delay-3 mt-8 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/request" size="lg">
                Request a demo
              </ButtonLink>
              <ButtonLink href="/agents" tone="secondary" size="lg">
                Browse the agents
              </ButtonLink>
            </div>

            <p className="anim-rise delay-4 mt-5 text-meta text-muted">
              Built for PFMA and MFMA institutions · Every approval logged against a named person
            </p>
          </div>

          {/* The one place on the site where anything is typed. */}
          <div className="anim-rise delay-5 mx-auto mt-12 max-w-[640px]">
            <TaskInput />
            <p className="mt-2 text-center text-meta text-muted">
              Describe the work, and see which agent comes closest.
            </p>
          </div>
        </div>

        {/* ------------------------------------------------ the frame */}
        <div className="mx-auto w-full max-w-[1120px] px-6 pb-16 sm:pb-20">
          <StepTabs />
        </div>

        {/* --------------------------------------------- the audience */}
        <section aria-label="Who it is for" className="border-t border-rule bg-surface">
          <div className="mx-auto w-full max-w-[1120px] px-6 py-8">
            <p className="text-center text-micro font-medium tracking-[0.14em] text-muted uppercase">
              Built for the institutions the PFMA and the MFMA already name
            </p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {AUDIENCE.map((kind) => (
                <li key={kind} className="text-ui text-muted-ink">
                  {INSTITUTION_LABEL[kind]}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------------------- the catalogue */}
        <Band>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">The catalogue</p>
              <h2 className="mt-2 max-w-[22ch] font-display text-head font-semibold tracking-tight text-ink">
                An agent for every desk that does the same thing every week.
              </h2>
              <p className="mt-3 max-w-[52ch] text-lede text-muted">
                Each one connects to the systems the institution already runs and
                stops at the same place: the moment something becomes binding.
              </p>
            </div>
            <Link
              href="/agents"
              className="inline-flex shrink-0 items-center gap-1.5 text-ui font-medium text-signal transition-colors duration-150 hover:underline"
            >
              See every agent
              <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
            </Link>
          </div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((agent) => (
              <AgentCard key={agent.slug} agent={agent} />
            ))}
          </ul>
        </Band>

        {/* ------------------------------------------------ the desks */}
        <Band tone="surface">
          <div className="mx-auto max-w-[760px]">
            <p className="eyebrow">See agents at work</p>
            <h2
              id="demos-heading"
              className="mt-2 font-display text-head font-semibold tracking-tight text-ink"
            >
              Four desks, one Monday morning.
            </h2>
            <p className="mt-3 max-w-[52ch] text-lede text-muted">
              Every thread below starts with somebody asking for something in
              plain English. Watch where each one stops — that pause is a named
              official, and it is the whole product.
            </p>

            <div className="mt-10">
              <ThreadDemos threads={officeThreads.slice(0, 2)} />
            </div>
          </div>
        </Band>

        <Band>
          <ControlBand />
        </Band>

        <Band tone="surface">
          <div className="mx-auto max-w-[760px]">
            <ThreadDemos threads={officeThreads.slice(2)} from={3} />

            <p className="mt-10 border-t border-rule pt-6 text-ui text-muted">
              <Link
                href="/use-cases"
                className="font-medium text-signal transition-colors duration-150 hover:underline"
              >
                Five more, one per agent in the catalogue
              </Link>{" "}
              — patching a portal, publishing a statement, filing registry mail,
              assembling a monthly pack, watching the public sites.
            </p>
          </div>
        </Band>

        {/* -------------------------------------------------- the blog */}
        {latestPosts.length > 0 && (
          <Band>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">From the blog</p>
                <h2 className="mt-2 font-display text-head font-semibold tracking-tight text-ink">
                  Notes from the work
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex shrink-0 items-center gap-1.5 text-ui font-medium text-signal transition-colors duration-150 hover:underline"
              >
                All posts
                <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
              </Link>
            </div>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </ul>
          </Band>
        )}

        {/* ------------------------------------------------- the ask */}
        <Band tone="surface">
          <div className="mx-auto flex max-w-[640px] flex-col items-center text-center">
            <h2 className="font-display text-head font-semibold tracking-tight text-ink sm:text-[40px]">
              Give an agent its first task.
            </h2>
            <p className="mt-3 max-w-[48ch] text-lede text-muted">
              Tell us the work that eats a morning every week. We will show you
              which agent takes it, and exactly where it stops for you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/request" size="lg">
                Request a demo
              </ButtonLink>
              <ButtonLink href="/resellers" tone="secondary" size="lg">
                Become a reseller
              </ButtonLink>
            </div>
          </div>
        </Band>
      </main>

      <SiteFooter />
    </>
  );
}
