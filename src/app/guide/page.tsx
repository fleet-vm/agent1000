import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StatusBadge, STATUS_LABEL } from "@/components/ui/StatusBadge";
import {
  agents,
  APPROVAL_LABEL,
  CADENCE_LABEL,
  CHANNEL_LABEL,
  INSTITUTION_LABEL,
  INSTITUTION_NOTE,
  INSTITUTION_TIERS,
  type Agent,
  type AgentApproval,
  type AgentCadence,
  type AgentChannel,
  type AgentStatus,
} from "@/data/agents";
import { ROLE_LABEL, ROLE_NOTE, type PartnerRole } from "@/data/partners";
import { OG_IMAGE } from "@/lib/site";

const DESCRIPTION =
  "How Agent1000 works in a South African public institution: the agents, how a task runs, the systems they connect to, who approves what, and how to check a partner before you let one in.";

export const metadata: Metadata = {
  title: "Guide",
  description: DESCRIPTION,
  alternates: { canonical: "/guide" },
  openGraph: {
    type: "website",
    url: "/guide",
    title: "Guide | Agent1000",
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

/**
 * The guide: one long page that explains the product end to end, for the
 * official who has to understand it before they can defend it -- an IT
 * manager, a CFO's office, a registry, a bid committee secretary.
 *
 * It describes only what the rest of the site already says. Every agent list,
 * channel, connection and status on it is read from `src/data/agents.ts`, so
 * the guide cannot claim an agent does something its catalogue page does not,
 * and an agent added to the catalogue appears here without anyone editing
 * prose. The same content rules apply: no client named, no metrics, and an
 * agent `in development` is never written as though it runs.
 */

const TOC: { group: string; items: { id: string; label: string }[] }[] = [
  {
    group: "Overview",
    items: [
      { id: "overview", label: "What Agent1000 is" },
      { id: "agents", label: "Agents" },
      { id: "how-a-task-runs", label: "How a task runs" },
      { id: "channels", label: "Channels" },
      { id: "connections", label: "Connections" },
      { id: "approvals", label: "Approvals" },
      { id: "standing-work", label: "Standing work" },
    ],
  },
  {
    group: "Governance",
    items: [
      { id: "accounts", label: "The agent's own account" },
      { id: "binding-actions", label: "Binding actions" },
      { id: "the-record", label: "The approval record" },
    ],
  },
  {
    group: "Institutions",
    items: [{ id: "institutions", label: "Who it is for" }],
  },
  {
    group: "Partners",
    items: [
      { id: "partner-roles", label: "Resellers and integrators" },
      { id: "checking-a-partner", label: "Checking a partner" },
    ],
  },
  {
    group: "Getting started",
    items: [{ id: "getting-started", label: "Your first task" }],
  },
];

const STATUS_NOTE: Record<AgentStatus, string> = {
  production: "Running in institutions today.",
  pilot: "Running with a first institution, under close watch.",
  available: "Built and ready to connect to your systems.",
  development: "On the roadmap. Described in the future tense until it runs.",
};

const CHANNEL_NOTE: Record<AgentChannel, string> = {
  email:
    "Write to the agent the way you would write to a colleague. Previews, reports and approval requests come back to your inbox.",
  whatsapp:
    "Ask and approve from a phone. Useful for the official who signs off between meetings, not at a desk.",
  console:
    "A web view of the agent's work: what it has prepared, what is waiting for whom, and what it has done.",
};

const APPROVAL_NOTE: Record<AgentApproval, string> = {
  "per-action":
    "Every piece of work stops for a named person before it takes effect: each page, each filing, each reply.",
  standing:
    "A responsible official approves the job once \u2014 scan and report, watch and report, assemble the pack. Anything that changes a system still waits for a person.",
};

const CADENCE_NOTE: Record<AgentCadence, string> = {
  scheduled: "Runs at a set time \u2014 every weekday morning, the first working day of the month.",
  "on-request": "Runs when someone asks: an email arrives, a request comes in.",
};

const ROLES: PartnerRole[] = ["reseller", "integrator"];

function agentsWhere(test: (agent: Agent) => boolean) {
  return agents.filter(test);
}

/** Every system the catalogue connects to, with the agents that use it. */
function connections() {
  const map = new Map<string, Agent[]>();
  for (const agent of agents) {
    for (const system of agent.connectsTo) {
      map.set(system, [...(map.get(system) ?? []), agent]);
    }
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b, "en-ZA"));
}

/* ----------------------------------------------------------- building blocks */

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24 border-t border-rule pt-10">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2
        id={`${id}-heading`}
        className="mt-2 font-display text-[28px] leading-tight font-semibold tracking-tight text-ink"
      >
        {title}
      </h2>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-body text-ink">{children}</p>;
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-2 text-ui font-semibold text-ink">{children}</h3>;
}

/** The guide's tip: the thing a reader would otherwise learn the hard way. */
function Note({ children }: { children: React.ReactNode }) {
  return (
    <aside className="rounded-lg border border-rule bg-accent-soft px-5 py-4 text-ui text-ink">
      <span className="font-semibold">Note. </span>
      {children}
    </aside>
  );
}

/** A request as somebody would actually type it. Taken from the recorded threads. */
function Ask({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-l-2 border-signal pl-4 text-body text-ink italic">
      &ldquo;{children}&rdquo;
    </blockquote>
  );
}

function AgentLinks({ list }: { list: Agent[] }) {
  return (
    <>
      {list.map((agent, i) => (
        <span key={agent.slug}>
          {i > 0 && ", "}
          <Link
            href={`/agents/${agent.slug}`}
            className="text-signal transition-colors duration-150 hover:underline"
          >
            {agent.name}
          </Link>
        </span>
      ))}
    </>
  );
}

function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-rule bg-surface">
      <table className="w-full min-w-[480px] text-left text-ui">
        <thead>
          <tr className="border-b border-rule">
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                className="px-4 py-3 text-micro font-medium tracking-[0.06em] text-muted uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_tr+tr]:border-t [&_tr+tr]:border-rule">
          {children}
        </tbody>
      </table>
    </div>
  );
}

function TocLinks() {
  return (
    <>
      {TOC.map((group) => (
        <div key={group.group}>
          <p className="text-micro font-medium tracking-[0.12em] text-muted uppercase">
            {group.group}
          </p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {group.items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-ui text-muted-ink transition-colors duration-150 hover:text-signal"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

/* ---------------------------------------------------------------------- page */

export default function GuidePage() {
  const statuses = Object.keys(STATUS_LABEL) as AgentStatus[];
  const channels = Object.keys(CHANNEL_LABEL) as AgentChannel[];
  const approvals = Object.keys(APPROVAL_LABEL) as AgentApproval[];
  const cadences = Object.keys(CADENCE_LABEL) as AgentCadence[];

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto grid w-full max-w-[1120px] grid-cols-[minmax(0,1fr)] gap-10 px-6 py-12 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="Guide contents" className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-6">
              <TocLinks />
            </div>
          </nav>

          <article className="min-w-0 max-w-[720px]">
            <h1 className="font-display text-head font-semibold tracking-tight text-ink">Guide</h1>
            <p className="mt-3 text-lede text-muted">
              How Agent1000 works inside a South African public institution, and
              what an official is agreeing to when they let an agent in.
            </p>

            {/* Below the sidebar breakpoint the contents fold into one control
                rather than pushing the guide a screen down. */}
            <details className="mt-6 rounded-lg border border-rule bg-surface px-5 py-4 lg:hidden">
              <summary className="cursor-pointer text-ui font-medium text-ink">
                On this page
              </summary>
              <div className="mt-4 flex flex-col gap-5">
                <TocLinks />
              </div>
            </details>

            <div className="mt-10 flex flex-col gap-12">
              {/* ------------------------------------------------ overview */}
              <Section id="overview" eyebrow="Overview" title="What Agent1000 is">
                <P>
                  Agent1000 is an AI workforce for national and provincial
                  departments, public entities, municipalities, universities,
                  science councils and SETAs. Each agent takes one kind of
                  repetitive work &mdash; patching, publishing, filing, reporting,
                  watching the public sites &mdash; and does it inside the systems
                  the institution already runs.
                </P>
                <P>
                  What makes it usable in the public sector is where it stops.
                  An agent prepares; a named official decides. Nothing is
                  captured, sent, published or changed on its own, and every
                  approval is recorded against the person who gave it. That is
                  what lets the decision survive an audit, not just a demo.
                </P>
              </Section>

              <Section id="agents" title="Agents">
                <P>
                  Each agent does one job and is named for it. Its page in the{" "}
                  <Link href="/agents" className="text-signal hover:underline">
                    catalogue
                  </Link>{" "}
                  says what it connects to, how you reach it, and exactly what a
                  person approves.
                </P>
                <Table head={["Agent", "What it does", "Status"]}>
                  {agents.map((agent) => (
                    <tr key={agent.slug}>
                      <td className="font-medium whitespace-nowrap">
                        <Link
                          href={`/agents/${agent.slug}`}
                          className="text-signal transition-colors duration-150 hover:underline"
                        >
                          {agent.name}
                        </Link>
                      </td>
                      <td className="text-muted-ink">{agent.summary}</td>
                      <td>
                        <StatusBadge status={agent.status} />
                      </td>
                    </tr>
                  ))}
                </Table>
                <H3>What the status means</H3>
                <ul className="flex flex-col gap-2">
                  {statuses.map((status) => (
                    <li key={status} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <StatusBadge status={status} />
                      <span className="text-ui text-muted-ink">{STATUS_NOTE[status]}</span>
                    </li>
                  ))}
                </ul>
                <Note>
                  If the work you have in mind is not in the table, describe it on
                  the{" "}
                  <Link href="/request" className="text-signal hover:underline">
                    request page
                  </Link>
                  . It shows which agent comes closest, and we would rather hear
                  about the gap than have you force the work into the wrong agent.
                </Note>
              </Section>

              <Section id="how-a-task-runs" title="How a task runs">
                <P>Every task follows the same four steps, in the same order.</P>
                <ol className="flex flex-col gap-4">
                  {[
                    {
                      title: "Ask",
                      body: "Say what you need done, in the words you would use with a colleague. No forms, no scripting, no new system to learn.",
                    },
                    {
                      title: "Connect",
                      body: "The agent works inside the systems the institution already runs: the mailbox, the CMS, the document store, the code repositories.",
                    },
                    {
                      title: "Approve",
                      body: "Every binding action stops and waits for a named official. The agent says what it wants to do, and to whom it has sent it for a decision.",
                    },
                    {
                      title: "Repeat",
                      body: "Say “do this every Monday” and the one-off becomes standing work. The approval step comes with it.",
                    },
                  ].map((step, i) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="tabular mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-meta font-medium text-signal">
                        {i + 1}
                      </span>
                      <span>
                        <span className="text-ui font-semibold text-ink">{step.title}</span>
                        <span className="mt-0.5 block text-ui text-muted-ink">{step.body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <H3>What an ask looks like</H3>
                <Ask>What needs patching on the citizen portal this week?</Ask>
                <Ask>Publish the media statement on the new bursary round.</Ask>
                <Ask>File what came into the registry mailbox this morning.</Ask>
                <P>
                  You can watch each of these run, approval gate and all, on{" "}
                  <Link href="/use-cases" className="text-signal hover:underline">
                    Use cases
                  </Link>
                  .
                </P>
              </Section>

              <Section id="channels" title="Channels">
                <P>
                  You reach an agent through channels the institution already
                  uses. Which ones depends on the agent.
                </P>
                <Table head={["Channel", "How it is used", "Agents"]}>
                  {channels.map((channel) => (
                    <tr key={channel}>
                      <td className="font-medium whitespace-nowrap text-ink">
                        {CHANNEL_LABEL[channel]}
                      </td>
                      <td className="text-muted-ink">{CHANNEL_NOTE[channel]}</td>
                      <td>
                        <AgentLinks list={agentsWhere((a) => a.channels.includes(channel))} />
                      </td>
                    </tr>
                  ))}
                </Table>
              </Section>

              <Section id="connections" title="Connections">
                <P>
                  An agent does not bring a new system with it. It is connected to
                  the ones you already run &mdash; with its own account, under your
                  change control &mdash; and works there.
                </P>
                <Table head={["System", "Used by"]}>
                  {connections().map(([system, list]) => (
                    <tr key={system}>
                      <td className="font-medium text-ink">{system}</td>
                      <td>
                        <AgentLinks list={list} />
                      </td>
                    </tr>
                  ))}
                </Table>
                <Note>
                  Connecting an agent is integration work on your systems. It is
                  done by your own IT, or by a certified{" "}
                  <a href="#partner-roles" className="text-signal hover:underline">
                    integrator
                  </a>{" "}
                  working alongside them.
                </Note>
              </Section>

              <Section id="approvals" title="Approvals">
                <P>
                  Every agent has one of two approval modes. Neither lets an agent
                  make a binding change on its own.
                </P>
                <Table head={["Mode", "What it means", "Agents"]}>
                  {approvals.map((mode) => (
                    <tr key={mode}>
                      <td className="font-medium text-ink">{APPROVAL_LABEL[mode]}</td>
                      <td className="text-muted-ink">{APPROVAL_NOTE[mode]}</td>
                      <td>
                        <AgentLinks list={agentsWhere((a) => a.approval === mode)} />
                      </td>
                    </tr>
                  ))}
                </Table>
                <H3>Who approves what</H3>
                <ul className="flex flex-col gap-2">
                  {agents.map((agent) => (
                    <li key={agent.slug} className="text-ui text-muted-ink">
                      <span className="font-medium text-ink">{agent.name}:</span>{" "}
                      {agent.approves}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section id="standing-work" title="Standing work">
                <P>
                  Most work in an institution is not a one-off. Once a task has
                  run, one sentence turns it into standing work:
                </P>
                <Ask>Do this on the first working day of every month.</Ask>
                <Ask>Warn me the moment a certificate is inside 14 days.</Ask>
                <P>
                  The approval step is part of the task, so it is part of the
                  standing work too. A monthly pack still goes to the responsible
                  manager every month; it is never submitted for them.
                </P>
                <Table head={["Cadence", "What it means", "Agents"]}>
                  {cadences.map((cadence) => (
                    <tr key={cadence}>
                      <td className="font-medium whitespace-nowrap text-ink">
                        {CADENCE_LABEL[cadence]}
                      </td>
                      <td className="text-muted-ink">{CADENCE_NOTE[cadence]}</td>
                      <td>
                        <AgentLinks list={agentsWhere((a) => a.cadence === cadence)} />
                      </td>
                    </tr>
                  ))}
                </Table>
              </Section>

              {/* ---------------------------------------------- governance */}
              <Section id="accounts" eyebrow="Governance" title="The agent's own account">
                <P>
                  An agent signs in as itself: its own account, with its own
                  permissions, in the systems you already run. It never borrows
                  an official&rsquo;s login.
                </P>
                <P>
                  That keeps the controls you already have in charge. You decide
                  what the account may see and touch, you can see what it
                  touched, and you can take the account away in an
                  afternoon.
                </P>
              </Section>

              <Section id="binding-actions" title="Binding actions">
                <P>
                  A binding action is anything that commits the institution:
                  capturing leave, sending a letter, publishing a page, filing
                  against a case, merging a patch. The agent prepares it; a named
                  official decides. That order is not configurable.
                </P>
                <P>
                  When an agent is unsure &mdash; a letter whose reference points to one
                  case and whose sender points to another &mdash; it stops and says so
                  rather than guessing.
                </P>
              </Section>

              <Section id="the-record" title="The approval record">
                <P>
                  Every approval is logged against the official who gave it, not
                  against the agent. When the Auditor-General, an internal audit
                  committee or a manager asks who authorised a change, there is a
                  person&rsquo;s name to give them.
                </P>
              </Section>

              {/* --------------------------------------------- institutions */}
              <Section id="institutions" eyebrow="Institutions" title="Who it is for">
                <P>
                  Agent1000 is written for the institutions the PFMA and the MFMA
                  already name. The{" "}
                  <Link href="/agents" className="text-signal hover:underline">
                    catalogue
                  </Link>{" "}
                  filters by these classes, so you can see the agents whose work
                  exists in an institution like yours.
                </P>
                <Table head={["Tier", "Class", "Covers"]}>
                  {INSTITUTION_TIERS.flatMap((tier) =>
                    tier.values.map((kind, i) => (
                      <tr key={kind}>
                        <td className="font-medium whitespace-nowrap text-ink">
                          {i === 0 ? tier.label : ""}
                        </td>
                        <td className="text-ink">{INSTITUTION_LABEL[kind]}</td>
                        <td className="text-muted-ink">{INSTITUTION_NOTE[kind]}</td>
                      </tr>
                    )),
                  )}
                </Table>
                <Note>
                  We never name the institutions we work with. The furthest any
                  page on this site will go is &ldquo;a national department&rdquo;.
                  Yours will be treated the same way.
                </Note>
              </Section>

              {/* ------------------------------------------------- partners */}
              <Section id="partner-roles" eyebrow="Partners" title="Resellers and integrators">
                <P>
                  Agent1000 is sold and connected through appointed partners. A
                  partner holds one role or both, and the roles answer
                  different questions: who holds your contract, and who touches
                  your systems.
                </P>
                <Table head={["Role", "What they do"]}>
                  {ROLES.map((role) => (
                    <tr key={role}>
                      <td className="font-medium whitespace-nowrap text-ink">{ROLE_LABEL[role]}</td>
                      <td className="text-muted-ink">{ROLE_NOTE[role]}</td>
                    </tr>
                  ))}
                </Table>
                <P>
                  A company that wants to become one can{" "}
                  <Link href="/resellers" className="text-signal hover:underline">
                    apply as a reseller
                  </Link>
                  . Every applicant is vetted before they are appointed.
                </P>
              </Section>

              <Section id="checking-a-partner" title="Checking a partner">
                <P>
                  Before you give a company access to your systems on our behalf,
                  check it on the{" "}
                  <Link href="/partners" className="text-signal hover:underline">
                    partner register
                  </Link>
                  . Every appointed partner is listed there with its roles, the
                  agents it is certified on, the dates of its appointment, and a
                  certificate number you can quote back to us.
                </P>
                <ol className="flex list-decimal flex-col gap-2 pl-5 text-ui text-ink marker:text-muted">
                  <li>Ask the company for its certificate number.</li>
                  <li>Find the company on the register and compare the number.</li>
                  <li>
                    Check that it is certified on the agent it is offering, and
                    that the appointment has not lapsed.
                  </li>
                </ol>
                <Note>
                  The register is the only proof of appointment there is. A
                  company that is not on it is not a partner, whatever its
                  letterhead says. Anything claiming to be Agent1000 that asks for
                  banking details on a web form is not Agent1000.
                </Note>
              </Section>

              {/* ------------------------------------------ getting started */}
              <Section id="getting-started" eyebrow="Getting started" title="Your first task">
                <ol className="flex flex-col gap-4">
                  {[
                    {
                      title: "Describe the work",
                      body: (
                        <>
                          Pick the work that eats a morning every week and{" "}
                          <Link href="/request" className="text-signal hover:underline">
                            describe it
                          </Link>
                          . You will see which agent comes closest.
                        </>
                      ),
                    },
                    {
                      title: "See it run",
                      body: (
                        <>
                          <Link href="/request" className="text-signal hover:underline">
                            Request a demo
                          </Link>
                          . We show you the agent doing that work, and exactly
                          where it stops for an official.
                        </>
                      ),
                    },
                    {
                      title: "Decide who approves",
                      body: "Name the officials who will sign off: the requesting officer, the registry clerk, the administrator, the responsible manager.",
                    },
                    {
                      title: "Connect and start",
                      body: "The agent gets its own account in your systems, connected by your IT or a certified integrator. Its first task waits for its first approval.",
                    },
                  ].map((step, i) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="tabular mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-meta font-medium text-signal">
                        {i + 1}
                      </span>
                      <span>
                        <span className="text-ui font-semibold text-ink">{step.title}</span>
                        <span className="mt-0.5 block text-ui text-muted-ink">{step.body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </Section>
            </div>
          </article>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
