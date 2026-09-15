import {
  ChartColumn,
  FileText,
  FolderClosed,
  LifeBuoy,
  Scale,
  Shield,
  type LucideIcon,
} from "lucide-react";
import type { AgentCategory } from "@/data/agents";

/** One icon per category, and icons appear nowhere else except the cards. */
const ICONS: Record<AgentCategory, LucideIcon> = {
  security: Shield,
  publishing: FileText,
  documents: FolderClosed,
  data: ChartColumn,
  servicedesk: LifeBuoy,
  compliance: Scale,
};

export function AgentIcon({
  category,
  className,
}: {
  category: AgentCategory;
  className?: string;
}) {
  const Icon = ICONS[category];
  return <Icon aria-hidden="true" strokeWidth={1.5} className={className} />;
}
