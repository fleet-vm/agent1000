import {
  agents as ALL,
  CATEGORY_LABEL,
  CHANNEL_LABEL,
  CADENCE_LABEL,
  APPROVAL_LABEL,
  INSTITUTION_LABEL,
  INSTITUTION_NOTE,
  INSTITUTION_TIERS,
  INSTITUTION_VALUES,
  type Agent,
  type AgentApproval,
  type AgentCadence,
  type AgentCategory,
  type AgentChannel,
  type AgentInstitution,
  type AgentStatus,
} from "@/data/agents";
import { STATUS_LABEL } from "@/components/ui/StatusBadge";

/**
 * Filter state, and the pure functions over it.
 *
 * All of this is deliberately free of React and of the router: the whole filter
 * state lives in the URL, so a filtered view is linkable and the back button
 * steps through filter changes the way a reader expects.
 */

export type Filters = {
  q: string;
  institutions: AgentInstitution[];
  categories: AgentCategory[];
  channels: AgentChannel[];
  statuses: AgentStatus[];
  cadence: AgentCadence | "any";
  approval: AgentApproval | "any";
};

export const EMPTY_FILTERS: Filters = {
  q: "",
  institutions: [],
  categories: [],
  channels: [],
  statuses: [],
  cadence: "any",
  approval: "any",
};

const CATEGORY_VALUES = Object.keys(CATEGORY_LABEL) as AgentCategory[];
const CHANNEL_VALUES = Object.keys(CHANNEL_LABEL) as AgentChannel[];
const STATUS_VALUES = Object.keys(STATUS_LABEL) as AgentStatus[];

function parseList<T extends string>(raw: string | null, allowed: T[]): T[] {
  if (!raw) return [];
  return raw.split(",").filter((v): v is T => (allowed as string[]).includes(v));
}

export function parseFilters(sp: URLSearchParams): Filters {
  const cadence = sp.get("cadence");
  const approval = sp.get("approval");

  return {
    q: sp.get("q") ?? "",
    institutions: parseList(sp.get("inst"), INSTITUTION_VALUES),
    categories: parseList(sp.get("cat"), CATEGORY_VALUES),
    channels: parseList(sp.get("ch"), CHANNEL_VALUES),
    statuses: parseList(sp.get("st"), STATUS_VALUES),
    cadence:
      cadence === "scheduled" || cadence === "on-request" ? cadence : "any",
    approval:
      approval === "per-action" || approval === "standing" ? approval : "any",
  };
}

/** Only non-default values are written, so a clean view has a clean URL. */
export function toSearchString(f: Filters): string {
  const sp = new URLSearchParams();
  if (f.q.trim()) sp.set("q", f.q.trim());
  if (f.institutions.length) sp.set("inst", f.institutions.join(","));
  if (f.categories.length) sp.set("cat", f.categories.join(","));
  if (f.channels.length) sp.set("ch", f.channels.join(","));
  if (f.statuses.length) sp.set("st", f.statuses.join(","));
  if (f.cadence !== "any") sp.set("cadence", f.cadence);
  if (f.approval !== "any") sp.set("approval", f.approval);
  return sp.toString();
}

export function isDefault(f: Filters): boolean {
  return toSearchString(f) === "";
}

type Group =
  | "q"
  | "institutions"
  | "categories"
  | "channels"
  | "statuses"
  | "cadence"
  | "approval";

function matchesText(agent: Agent, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return [
    agent.name,
    agent.summary,
    CATEGORY_LABEL[agent.category],
    // So that typing "municipality" or "SETA" reaches the agents that serve
    // them, without the reader having to find the facet first.
    agent.institutions.map((i) => INSTITUTION_LABEL[i]).join(" "),
    agent.connectsTo.join(" "),
  ]
    .join(" ")
    .toLowerCase()
    .includes(needle);
}

/**
 * Applies the filters, optionally ignoring one group.
 *
 * `except` is what makes the sidebar counts behave: a facet's count is taken
 * against every other group but its own, so ticking "Security and patching"
 * does not drive "Publishing and content" to zero and strand the reader inside
 * a single category.
 */
export function applyFilters(f: Filters, except?: Group): Agent[] {
  return ALL.filter((agent) => {
    if (except !== "q" && !matchesText(agent, f.q)) return false;
    // Ticking two institution types asks "either of these", the same OR the
    // other multi-select facets use: a shared services outfit serving both a
    // district and its locals should see the union, not the intersection.
    if (
      except !== "institutions" &&
      f.institutions.length &&
      !f.institutions.some((i) => agent.institutions.includes(i))
    )
      return false;
    if (
      except !== "categories" &&
      f.categories.length &&
      !f.categories.includes(agent.category)
    )
      return false;
    if (
      except !== "channels" &&
      f.channels.length &&
      !f.channels.some((c) => agent.channels.includes(c))
    )
      return false;
    if (
      except !== "statuses" &&
      f.statuses.length &&
      !f.statuses.includes(agent.status)
    )
      return false;
    if (
      except !== "cadence" &&
      f.cadence !== "any" &&
      agent.cadence !== f.cadence
    )
      return false;
    if (
      except !== "approval" &&
      f.approval !== "any" &&
      agent.approval !== f.approval
    )
      return false;
    return true;
  });
}

export type FacetOption<T extends string> = {
  value: T;
  label: string;
  count: number;
  hint?: string;
};

/**
 * Institution facets, kept in their tiers. Thirteen flat checkboxes is a wall;
 * grouped under National / Provincial / Local government / Education, a reader
 * finds their own institution without reading the whole list.
 */
export function institutionFacetGroups(
  f: Filters,
): Array<{ label: string; options: FacetOption<AgentInstitution>[] }> {
  const pool = applyFilters(f, "institutions");
  return INSTITUTION_TIERS.map((tier) => ({
    label: tier.label,
    options: tier.values.map((value) => ({
      value,
      label: INSTITUTION_LABEL[value],
      hint: INSTITUTION_NOTE[value],
      count: pool.filter((a) => a.institutions.includes(value)).length,
    })),
  }));
}

export function categoryFacets(f: Filters): FacetOption<AgentCategory>[] {
  const pool = applyFilters(f, "categories");
  return CATEGORY_VALUES.map((value) => ({
    value,
    label: CATEGORY_LABEL[value],
    count: pool.filter((a) => a.category === value).length,
  }));
}

export function channelFacets(f: Filters): FacetOption<AgentChannel>[] {
  const pool = applyFilters(f, "channels");
  return CHANNEL_VALUES.map((value) => ({
    value,
    label: CHANNEL_LABEL[value],
    count: pool.filter((a) => a.channels.includes(value)).length,
  }));
}

export function statusFacets(f: Filters): FacetOption<AgentStatus>[] {
  const pool = applyFilters(f, "statuses");
  return STATUS_VALUES.map((value) => ({
    value,
    label: STATUS_LABEL[value],
    count: pool.filter((a) => a.status === value).length,
  }));
}

export const CADENCE_OPTIONS = [
  { value: "any", label: "Runs — any" },
  { value: "scheduled", label: CADENCE_LABEL.scheduled },
  { value: "on-request", label: CADENCE_LABEL["on-request"] },
] as const;

export const APPROVAL_OPTIONS = [
  { value: "any", label: "Approval — any" },
  { value: "per-action", label: APPROVAL_LABEL["per-action"] },
  { value: "standing", label: APPROVAL_LABEL.standing },
] as const;

/** One chip per active filter, in sidebar order. */
export function activeChips(
  f: Filters,
): Array<{ key: string; label: string; clear: (f: Filters) => Filters }> {
  const chips: Array<{
    key: string;
    label: string;
    clear: (f: Filters) => Filters;
  }> = [];

  if (f.q.trim()) {
    chips.push({
      key: "q",
      label: `“${f.q.trim()}”`,
      clear: (cur) => ({ ...cur, q: "" }),
    });
  }
  for (const value of f.institutions) {
    chips.push({
      key: `inst:${value}`,
      label: INSTITUTION_LABEL[value],
      clear: (cur) => ({
        ...cur,
        institutions: cur.institutions.filter((v) => v !== value),
      }),
    });
  }
  for (const value of f.categories) {
    chips.push({
      key: `cat:${value}`,
      label: CATEGORY_LABEL[value],
      clear: (cur) => ({
        ...cur,
        categories: cur.categories.filter((v) => v !== value),
      }),
    });
  }
  for (const value of f.channels) {
    chips.push({
      key: `ch:${value}`,
      label: CHANNEL_LABEL[value],
      clear: (cur) => ({
        ...cur,
        channels: cur.channels.filter((v) => v !== value),
      }),
    });
  }
  if (f.cadence !== "any") {
    chips.push({
      key: "cadence",
      label: CADENCE_LABEL[f.cadence],
      clear: (cur) => ({ ...cur, cadence: "any" }),
    });
  }
  if (f.approval !== "any") {
    chips.push({
      key: "approval",
      label: APPROVAL_LABEL[f.approval],
      clear: (cur) => ({ ...cur, approval: "any" }),
    });
  }
  for (const value of f.statuses) {
    chips.push({
      key: `st:${value}`,
      label: STATUS_LABEL[value],
      clear: (cur) => ({
        ...cur,
        statuses: cur.statuses.filter((v) => v !== value),
      }),
    });
  }

  return chips;
}
