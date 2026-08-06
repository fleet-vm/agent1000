import Link from "next/link";
import { agentMeta, type Agent } from "@/data/agents";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <li>
      <Link
        href={`/agents/${agent.slug}`}
        className="block rounded-lg border border-rule bg-surface px-4 py-3.5 transition-colors duration-150 hover:border-signal"
      >
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-card font-medium text-ink">{agent.name}</span>
          <StatusBadge status={agent.status} />
        </div>

        <p className="mt-1.5 text-ui text-muted">{agent.summary}</p>

        <p className="mt-2 text-meta text-muted">{agentMeta(agent)}</p>
      </Link>
    </li>
  );
}
