import type { AgentStatus } from "@/data/agents";
import { cn } from "@/lib/cn";

/**
 * Status badges are load-bearing: they are how a reader tells what is running
 * from what is not. One colour pairing per status, used identically wherever a
 * status appears. `development` is the only badge with no fill -- an outline
 * cannot be mistaken for something live.
 */
export const STATUS_LABEL: Record<AgentStatus, string> = {
  production: "Live in production",
  pilot: "In pilot",
  available: "Available to deploy",
  development: "In development",
};

const STATUS_CLASS: Record<AgentStatus, string> = {
  production: "bg-live-bg text-live-fg",
  pilot: "bg-pilot-bg text-pilot-fg",
  available: "bg-ready-bg text-ready-fg",
  development: "border border-rule text-ready-fg",
};

export function StatusBadge({
  status,
  className,
}: {
  status: AgentStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-[3px] text-micro leading-none whitespace-nowrap",
        STATUS_CLASS[status],
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
