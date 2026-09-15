import Link from "next/link";
import { agentMeta, type Agent } from "@/data/agents";
import { AgentIcon } from "@/components/AgentIcon";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <li>
      <Link
        href={`/agents/${agent.slug}`}
        className="flex h-full flex-col rounded-lg border border-rule bg-surface p-5 transition-colors duration-150 hover:border-muted"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="flex size-9 items-center justify-center rounded-lg border border-rule bg-paper">
            <AgentIcon category={agent.category} className="size-4 text-ink" />
          </span>
          <StatusBadge status={agent.status} />
        </div>

        <span className="mt-4 font-display text-[21px] leading-snug font-semibold text-ink">
          {agent.name}
        </span>

        <p className="mt-1.5 text-ui text-muted">{agent.summary}</p>

        <p className="mt-auto pt-4 text-meta text-muted">{agentMeta(agent)}</p>
      </Link>
    </li>
  );
}
