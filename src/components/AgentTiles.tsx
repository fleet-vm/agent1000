import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { agents } from "@/data/agents";
import { AgentIcon } from "@/components/AgentIcon";

/**
 * The tile row.
 *
 * Only agents that exist today appear here, and the row carries no caption. A
 * tile makes no claim about how much anything is used -- that would be a metric
 * and it would age badly. The last tile goes to the full directory.
 */
const TILED = ["vulnwatch", "contentdesk", "recordsdesk", "reportpack", "sitewatch"];

const tileClass =
  "flex w-[76px] flex-col items-center gap-2 rounded-lg px-2 py-3 text-center transition-colors duration-150 hover:bg-surface";

export function AgentTiles() {
  const tiles = TILED.map((slug) => agents.find((a) => a.slug === slug)!);

  return (
    <nav aria-label="Agents">
      <ul className="flex flex-wrap justify-center gap-1 sm:justify-start">
        {tiles.map((agent) => (
          <li key={agent.slug}>
            <Link href={`/agents/${agent.slug}`} className={tileClass}>
              <span className="flex size-10 items-center justify-center rounded-lg border border-rule bg-surface">
                <AgentIcon category={agent.category} className="size-[18px] text-ink" />
              </span>
              <span className="text-meta text-muted">{agent.name}</span>
            </Link>
          </li>
        ))}

        <li>
          <Link href="/agents" className={tileClass}>
            <span className="flex size-10 items-center justify-center rounded-lg border border-rule bg-surface">
              <LayoutGrid
                aria-hidden="true"
                strokeWidth={1.5}
                className="size-[18px] text-ink"
              />
            </span>
            <span className="text-meta text-muted">See all</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
