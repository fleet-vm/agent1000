import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  agents,
  getAgent,
  APPROVAL_LABEL,
  CADENCE_LABEL,
  CATEGORY_LABEL,
  CHANNEL_LABEL,
  INSTITUTION_LABEL,
  INSTITUTION_NOTE,
  INSTITUTION_TIERS,
  type Agent,
  type AgentApproval,
  type AgentCategory,
  type AgentCadence,
  type AgentChannel,
} from "@/data/agents";
import { ROLE_LABEL, ROLE_NOTE, type PartnerRole } from "@/data/partners";
import { OG_IMAGE } from "@/lib/site";

const DESCRIPTION =
  "How Agent1000 works in a South African public institution: leave, travel claims, submissions and the other workflows it takes on, what can start a task, who signs off, and how to check a partner before you let one in.";

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
 * Its examples are the administrative workflows the public service runs --
 * leave, travel claims, submissions, contract instructions, the monthly budget
 * report -- written in the forms and systems officials already know. The
 * catalogue tables (agents, channels, approvals, cadence) are read from
 * `src/data/agents.ts`, so they cannot drift from the agent pages. The same
 * content rules apply: no client named, no metrics, and an
 * agent `in development` is never written as though it runs.
 */

const TOC: { group: string; items: { id: string; label: string }[] }[] = [
  {
    group: "Overview",
    items: [
      { id: "overview", label: "What Agent1000 is" },
      { id: "agents", label: "Agents" },
      { id: "workflows", label: "Workflows" },
      { id: "how-a-task-runs", label: "How a task runs" },
      { id: "channels", label: "Channels" },
      { id: "automations", label: "Automations" },
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

/**
 * The administrative workflows a public institution runs every week, with the
 * agent's part and the sign-off chain as the public service already has it.
 * Written in the terms of the forms and systems officials use -- Persal, BAS,
 * the VA26A, the Z1 -- and never naming the institution they were built with.
 */
const WORKFLOWS: {
  area: string;
  items: { name: string; slug?: string; agent: string; signs: string }[];
}[] = [
  {
    area: "Human resources",
    items: [
      {
        name: "Leave application",
        slug: "leavedesk",
        agent: "Checks the application against the leave determination and the balance on Persal, asks for the missing certificate, and routes it.",
        signs: "Line manager, then an HR practitioner for the head of department. Captured on Persal only after both.",
      },
      {
        name: "Profile change request",
        agent: "Takes the change and its evidence, and sends it to the right reviewer for that field.",
        signs: "The line manager or HR, depending on the field.",
      },
    ],
  },
  {
    area: "Finance",
    items: [
      {
        name: "Travel claim",
        slug: "claimsdesk",
        agent: "Builds the claim from the approved VA26A trip, applies the rates in force, light-checks each receipt, and pre-reviews it for Finance.",
        signs: "The claimant signs, Finance verifies, the supervisor approves. Then Persal capture and the BAS form.",
      },
      {
        name: "Kilometre claim",
        slug: "claimsdesk",
        agent: "Checks the month\u2019s trip log against the map estimate and flags private travel.",
        signs: "The claimant signs, Finance verifies, the supervisor approves.",
      },
      {
        name: "Budget confirmation certificate",
        slug: "budgetdesk",
        agent: "Derives the segment codes and checks the available balance before the request goes anywhere.",
        signs: "Responsibility manager, then the budget office, then the state accountant issues it.",
      },
      {
        name: "Monthly budget vs spending",
        slug: "budgetdesk",
        agent: "Loads the month\u2019s expenditure extract, raises the exceptions, and asks each programme manager for their variance reasons.",
        signs: "Programme managers explain their lines; the responsible manager signs off the report.",
      },
    ],
  },
  {
    area: "Legal and contracts",
    items: [
      {
        name: "Contract drafting instruction",
        slug: "contractdesk",
        agent: "Checks the instruction is complete and the signatory sits within the delegation of authority, and tracks each stage against its turnaround.",
        signs: "Legal services manager, then the head of legal services. Signed by the delegated official.",
      },
    ],
  },
  {
    area: "Executive office",
    items: [
      {
        name: "Submission to the Minister or DG",
        slug: "submissiondesk",
        agent: "Routes the submission to its reviewers and approvers, counts the due date in working days, and chases whoever holds it.",
        signs: "Each reviewer and approver in the chain, in order. The signed PDF is the record.",
      },
      {
        name: "Parliamentary question or memo",
        slug: "submissiondesk",
        agent: "Assigns it, keeps the reply moving through review, and tells everyone when it is answered.",
        signs: "The reviewers and approvers named for that question.",
      },
    ],
  },
  {
    area: "Planning and reporting",
    items: [
      {
        name: "Quarterly performance report",
        slug: "plandesk",
        agent: "Collects each milestone\u2019s status and evidence from the programmes, and flags what is missing before the deadline.",
        signs: "Programme managers, then the strategy unit.",
      },
    ],
  },
];

/** What can start an agent's work without someone asking. */
const AUTOMATIONS: { name: string; how: string; examples: string[] }[] = [
  {
    name: "Schedule",
    how: "Runs at times you choose: every weekday morning, every Monday, the first working day of the month.",
    examples: [
      "Remind claimants of approved trips with no claim, before the 30-day deadline",
      "Load the month\u2019s expenditure extract and start the budget report",
    ],
  },
  {
    name: "Deadlines",
    how: "Counts due dates in working days, skipping weekends and public holidays, and acts when one is close or passed.",
    examples: [
      "Chase whoever is holding a submission past its due date",
      "Flag a contract stage that has run past its turnaround",
    ],
  },
  {
    name: "Email",
    how: "Runs when mail arrives in a mailbox the agent watches, such as an HR, finance or registry mailbox.",
    examples: [
      "A leave application with the medical certificate attached",
      "Receipts forwarded for a travel claim",
    ],
  },
  {
    name: "Email replies",
    how: "Reply to the agent\u2019s own emails to answer a query, add a missing document or ask a follow-up.",
    examples: [
      "Send the receipt Finance asked for in a rework query",
      "Answer a line manager\u2019s question on a leave application",
    ],
  },
  {
    name: "WhatsApp",
    how: "Talk to an agent\u2019s threads from a phone: ask, check what is waiting, and send a document from where you are.",
    examples: ["Check a leave balance", "Photograph a receipt for a claim"],
  },
  {
    name: "Web console",
    how: "Start a task, and see what the agent has prepared and what is waiting on whom.",
    examples: [
      "HR takes the next application from the pool",
      "Finance opens the verification queue with the pre-review findings",
    ],
  },
  {
    name: "Status changes",
    how: "Runs when a request moves on: approved, sent back for rework, or captured.",
    examples: [
      "Tell the applicant the moment leave is captured on Persal",
      "Send an approved claim to the payment queue",
    ],
  },
];

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

/** A numbered sequence: the order is part of what is being said. */
function Steps({ steps }: { steps: { title: string; body: React.ReactNode }[] }) {
  return (
    <ol className="flex flex-col gap-4">
      {steps.map((step, i) => (
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
  // Areas in catalogue order, skipping any with no agent in them yet.
  const categories = (Object.keys(CATEGORY_LABEL) as AgentCategory[]).filter((c) =>
    agents.some((a) => a.category === c),
  );
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
                  science councils and SETAs. It takes the administrative work every
                  institution runs on &mdash; leave applications, travel claims,
                  submissions to the DG, contract instructions, the monthly
                  budget report &mdash; and does it inside the systems the
                  institution already runs, from Persal to the registry mailbox.
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
                  Each agent takes one workflow &mdash; leave, claims, submissions,
                  the budget, contracts, performance reporting &mdash; or one
                  standing job such as patching or publishing, and is named for
                  it. Its page in the{" "}
                  <Link href="/agents" className="text-signal hover:underline">
                    catalogue
                  </Link>{" "}
                  says what it connects to, how you reach it, and exactly what a
                  person approves.
                </P>
                <Table head={["Agent", "What it does"]}>
                  {categories.flatMap((category) => [
                    <tr key={category} className="bg-paper">
                      <td
                        colSpan={2}
                        className="text-micro font-medium tracking-[0.06em] text-muted uppercase"
                      >
                        {CATEGORY_LABEL[category]}
                      </td>
                    </tr>,
                    ...agentsWhere((a) => a.category === category).map((agent) => (
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
                    </tr>
                    )),
                  ])}
                </Table>
                <Note>
                  If the work you have in mind is not in the table, describe it on
                  the{" "}
                  <Link href="/request" className="text-signal hover:underline">
                    request page
                  </Link>
                  . It shows which agent comes closest, and we would rather hear
                  about the gap than have you force the work into the wrong agent.
                </Note>

                <H3>Setting up an agent</H3>
                <P>
                  An agent is set up for your institution, not downloaded. Before
                  it does any work, three things are settled with you:
                </P>
                <Steps
                  steps={[
                    {
                      title: "The work",
                      body: "Which workflow it takes on, and on what rules: the leave determination, the travel rates and limits in force, the turnaround for each stage.",
                    },
                    {
                      title: "The approvers",
                      body: "The chain as your institution runs it: line manager and HR for leave; Finance and the supervisor for claims; the delegated official for a contract. The agent sends every binding action to them, and to no one else.",
                    },
                    {
                      title: "The access",
                      body: "Its own account in each system it needs \u2014 Persal, the document store, the mailbox \u2014 with the permissions that job requires and nothing more.",
                    },
                  ]}
                />

                <H3>Threads</H3>
                <P>
                  Each piece of work is a thread: one conversation that holds the
                  request, what the agent did, what it is waiting for and who it
                  is waiting on. Start a new thread for each task rather than
                  running unrelated work through one long conversation.
                </P>
                <P>
                  Keeping the work apart keeps the record readable. A leave
                  application, a travel claim and a submission to the DG each
                  have their own thread, so when someone later asks how a claim
                  came to be paid, the trip, the receipts, Finance&rsquo;s
                  findings and the supervisor&rsquo;s approval are in one place.
                  A claim sent back for rework stays in the same thread, under
                  the same reference, so the second round can be read against
                  the first.
                </P>

                <H3>Memory</H3>
                <P>
                  An agent learns from its work across all of its threads: the
                  conversations, and the documents and attachments it handled.
                  What it learns in one thread helps in the next &mdash; which
                  supervisor signs for which unit, the receipts Finance has
                  queried before, the format your DG expects a submission in
                  &mdash; and it can look back at earlier threads when it needs
                  more context.
                </P>
                <P>
                  Memory builds in the background, so there is nothing to manage
                  day to day. It stays with the agent it belongs to; one
                  agent&rsquo;s memory is not shared with another. And it never
                  stands in for an approval: an agent that has seen a
                  hundred clean claims from the same official still sends the
                  hundred-and-first to Finance.
                </P>

                <H3>Sharing an agent</H3>
                <P>
                  An agent starts with the officials named when it is set up, and
                  more can be added as the work needs them. Everyone working
                  with an agent sees its threads, so a colleague can pick up a
                  task where someone else left it, and a manager can see what is
                  waiting and on whom.
                </P>
                <P>
                  That is how the work is already split. A capturer can prepare
                  a claim for an official who then signs it themselves. A
                  supervisor going on leave can delegate their approvals for a
                  week; the delegate signs &ldquo;on behalf of&rdquo;, and the
                  record says so.
                </P>
                <P>
                  Sharing an agent does not share its approvals. Only the
                  officials named as approvers can sign off its work, and every
                  approval is still recorded against the person who gave it.
                </P>

                <Note>
                  Think of each agent as a boundary for access. It does one job,
                  with one account and one set of permissions. Work that needs
                  different access, a different approver or a different level of
                  sensitivity belongs to a different agent, not a wider one.
                </Note>
              </Section>

              <Section id="workflows" title="Workflows">
                <P>
                  These are the workflows an institution runs every week, and
                  where an agent fits in each. In every one, the agent does the
                  checking, the routing and the chasing. The signatures stay
                  with the officials who hold them today.
                </P>
                <Table head={["Workflow", "What the agent does", "Who signs off"]}>
                  {WORKFLOWS.flatMap((group) => [
                    <tr key={group.area} className="bg-paper">
                      <td
                        colSpan={3}
                        className="text-micro font-medium tracking-[0.06em] text-muted uppercase"
                      >
                        {group.area}
                      </td>
                    </tr>,
                    ...group.items.map((item) => (
                      <tr key={item.name}>
                        <td>
                          <span className="block font-medium text-ink">{item.name}</span>
                          <AgentLinks
                            list={[item.slug].flatMap((slug) => {
                              const agent = slug ? getAgent(slug) : undefined;
                              return agent ? [agent] : [];
                            })}
                          />
                        </td>
                        <td className="text-muted-ink">{item.agent}</td>
                        <td className="text-muted-ink">{item.signs}</td>
                      </tr>
                    )),
                  ])}
                </Table>
                <Note>
                  An agent applies your rules; it does not decide them. Rates,
                  limits, turnaround times and delegation thresholds are set by
                  your institution, and when one changes the agent works to the
                  new one from the date it takes effect.
                </Note>
              </Section>

              <Section id="how-a-task-runs" title="How a task runs">
                <P>Every task follows the same four steps, in the same order.</P>
                <Steps
                  steps={[
                    {
                      title: "Ask",
                      body: "Say what you need done, in the words you would use with a colleague. No forms, no scripting, no new system to learn.",
                    },
                    {
                      title: "Connect",
                      body: "The agent works inside the systems the institution already runs: Persal, the mailbox, the document store, the finance system.",
                    },
                    {
                      title: "Approve",
                      body: "Every binding action stops and waits for a named official. The agent says what it wants to do, and to whom it has sent it for a decision.",
                    },
                    {
                      title: "Repeat",
                      body: "Say “do this every Monday” and the one-off becomes standing work. The approval step comes with it.",
                    },
                  ]}
                />
                <H3>What an ask looks like</H3>
                <Ask>Process the leave request from employee 4471, 5 days annual leave, 22 to 26 September.</Ask>
                <Ask>Start my travel claim for the Polokwane trip.</Ask>
                <Ask>Where is the submission on the bursary policy, and who is holding it?</Ask>
                <P>
                  You can watch a leave request run, approval gate and all, on the{" "}
                  <Link href="/" className="text-signal hover:underline">
                    front page
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

              <Section id="automations" title="Automations">
                <P>
                  An automation is a task that starts on its own: at a set time,
                  or when something arrives or changes. You set one up by saying
                  it in the thread, in plain language.
                </P>
                <Ask>Remind me a week before any claim deadline.</Ask>
                <H3>Types of automations</H3>
                <Table head={["Automation", "How it works", "For example"]}>
                  {AUTOMATIONS.map((automation) => (
                    <tr key={automation.name}>
                      <td className="font-medium whitespace-nowrap text-ink">{automation.name}</td>
                      <td className="text-muted-ink">{automation.how}</td>
                      <td>
                        <ul className="flex flex-col gap-1">
                          {automation.examples.map((example) => (
                            <li key={example} className="text-muted-ink">
                              {example}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </Table>
                <Note>
                  An automation starts work; it never approves it. Every binding
                  step in an automated task still stops for a named official,
                  exactly as it would if someone had asked for it by hand.
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
                <Ask>Do this for every leave request that comes in.</Ask>
                <Ask>Start the budget report on the first working day of every month.</Ask>
                <P>
                  The approval step is part of the task, so it is part of the
                  standing work too. Every leave request still goes to the line
                  manager, and the monthly report still goes to the responsible
                  manager; neither is ever approved or submitted for them.
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
                  capturing leave on Persal, verifying or paying a claim,
                  approving a submission, issuing a budget certificate, sending
                  a letter, publishing a page. The agent prepares it; a named
                  official decides. That order is not configurable.
                </P>
                <P>
                  When an agent is unsure &mdash; a receipt in someone else&rsquo;s
                  name, a sick note that does not cover the first day &mdash; it
                  stops and says so rather than guessing.
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
                <Steps
                  steps={[
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
                      body: "Name the officials who will sign off: line managers and HR practitioners, finance officers and supervisors, the responsible manager.",
                    },
                    {
                      title: "Connect and start",
                      body: "The agent gets its own account in your systems, connected by your IT or a certified integrator. Its first task waits for its first approval.",
                    },
                  ]}
                />
              </Section>
            </div>
          </article>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
