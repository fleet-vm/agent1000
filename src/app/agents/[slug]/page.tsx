import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  agents,
  getAgent,
  APPROVAL_LABEL,
  CADENCE_LABEL,
  CATEGORY_LABEL,
  CHANNEL_LABEL,
  INSTITUTION_LABEL,
  INSTITUTION_VALUES,
} from "@/data/agents";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RequestDemo } from "@/components/agents/RequestDemo";
import { AgentJsonLd } from "@/components/JsonLd";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OG_IMAGE } from "@/lib/site";

export function generateStaticParams() {
  return agents.map((agent) => ({ slug: agent.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/agents/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) return { title: "Agent not found" };

  const path = `/agents/${agent.slug}`;
  // The summary is already one plain-language line and already correctly
  // tensed -- an agent still in development is written in the future tense, so
  // a search result can never claim it is running when the badge says it is
  // not. Reusing it keeps the description and the page in step by construction.
  const description = `${agent.summary} ${CATEGORY_LABEL[agent.category]} · ${CADENCE_LABEL[agent.cadence]}.`;

  return {
    title: agent.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: `${agent.name} | Agent1000`,
      description,
      images: [OG_IMAGE],
    },
  };
}

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-rule pt-4">
      <h2 className="text-micro tracking-[0.06em] text-muted uppercase">
        {heading}
      </h2>
      <div className="mt-2 text-body text-ink">{children}</div>
    </section>
  );
}

export default async function AgentPage({ params }: PageProps<"/agents/[slug]">) {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) notFound();

  return (
    <>
      <AgentJsonLd agent={agent} />
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[640px] px-6 py-12">
          <Link
            href="/agents"
            className="inline-flex items-center gap-1.5 text-ui text-muted transition-colors duration-150 hover:text-signal"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            All agents
          </Link>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <h1 className="font-display text-head font-semibold tracking-tight text-ink">{agent.name}</h1>
            <StatusBadge status={agent.status} />
          </div>

          <p className="mt-1 text-meta text-muted">
            {CATEGORY_LABEL[agent.category]} · {CADENCE_LABEL[agent.cadence]}
          </p>

          <div className="mt-6 flex flex-col gap-5">
            <Section heading="What it does">
              <p>{agent.summary}</p>
            </Section>

            <Section heading="Who it is for">
              {agent.institutions.length === INSTITUTION_VALUES.length ? (
                <p>
                  Every class of public institution, from a national department
                  to a local municipality.
                </p>
              ) : (
                <ul className="flex flex-wrap gap-x-1.5 gap-y-1">
                  {agent.institutions.map((institution, i) => (
                    <li key={institution} className="text-ui text-muted">
                      {INSTITUTION_LABEL[institution]}
                      {i < agent.institutions.length - 1 && " ·"}
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <Section heading="What it connects to">
              <ul className="flex flex-col gap-1">
                {agent.connectsTo.map((system) => (
                  <li key={system}>{system}</li>
                ))}
              </ul>
              <p className="mt-2 text-ui text-muted">
                Reached over{" "}
                {agent.channels.map((c) => CHANNEL_LABEL[c]).join(", ")}.
              </p>
            </Section>

            <Section heading="What a person approves">
              <p>{agent.approves}</p>
              <p className="mt-2 text-ui text-muted">
                {APPROVAL_LABEL[agent.approval]}.
              </p>
            </Section>

            {/* Last, deliberately: the ask comes after the reader knows what
                they would be agreeing to. */}
            <RequestDemo agent={agent} />
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
