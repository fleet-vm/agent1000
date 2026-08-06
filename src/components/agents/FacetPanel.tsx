"use client";

import { Checkbox } from "@/components/ui/Checkbox";
import { Select } from "@/components/ui/Select";
import { TextField } from "@/components/ui/TextField";
import {
  APPROVAL_OPTIONS,
  CADENCE_OPTIONS,
  categoryFacets,
  channelFacets,
  institutionFacetGroups,
  isDefault,
  statusFacets,
  type FacetOption,
  type Filters,
} from "@/lib/filters";

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-1.5 text-micro tracking-[0.06em] text-muted uppercase">
      {children}
    </h3>
  );
}

function FacetGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: FacetOption<T>[];
  selected: T[];
  onToggle: (value: T, next: boolean) => void;
}) {
  return (
    <div>
      <GroupLabel>{label}</GroupLabel>
      {options.map((o) => (
        <Checkbox
          key={o.value}
          label={o.label}
          hint={o.hint}
          count={o.count}
          checked={selected.includes(o.value)}
          // Zero-result facets dim rather than disappear. A sidebar that
          // reorders itself under the cursor is disorienting, and the zero is
          // itself information.
          disabled={o.count === 0 && !selected.includes(o.value)}
          onChange={(next) => onToggle(o.value, next)}
        />
      ))}
    </div>
  );
}

/**
 * The institution facet: the first question the page asks, because it is the
 * first question a reader has. Thirteen statutory classes is a lot of column,
 * so they sit under the four tiers the sector already thinks in and each row
 * carries what it covers -- schedule references and counts -- on hover.
 */
function InstitutionGroup({
  filters,
  onToggle,
}: {
  filters: Filters;
  onToggle: (value: Filters["institutions"][number], next: boolean) => void;
}) {
  return (
    <div>
      <GroupLabel>Kind of institution</GroupLabel>
      <div className="flex flex-col gap-2.5">
        {institutionFacetGroups(filters).map((tier) => (
          <div key={tier.label}>
            <h4 className="mb-0.5 text-meta text-muted/70">{tier.label}</h4>
            {tier.options.map((o) => (
              <Checkbox
                key={o.value}
                label={o.label}
                hint={o.hint}
                count={o.count}
                checked={filters.institutions.includes(o.value)}
                disabled={
                  o.count === 0 && !filters.institutions.includes(o.value)
                }
                onChange={(next) => onToggle(o.value, next)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FacetPanel({
  filters,
  draftQuery,
  onDraftQuery,
  onChange,
  onClear,
}: {
  filters: Filters;
  draftQuery: string;
  onDraftQuery: (q: string) => void;
  onChange: (next: Filters) => void;
  onClear: () => void;
}) {
  function toggle<
    K extends "institutions" | "categories" | "channels" | "statuses",
  >(
    key: K,
  ): (value: Filters[K][number], next: boolean) => void {
    return (value, next) => {
      const current = filters[key] as Array<Filters[K][number]>;
      const updated = next
        ? [...current, value]
        : current.filter((v) => v !== value);
      onChange({ ...filters, [key]: updated } as Filters);
    };
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="mb-2.5 flex items-center gap-2">
          <span className="text-ui font-medium text-ink">Filters</span>
          <button
            type="button"
            onClick={onClear}
            disabled={isDefault(filters)}
            className="ml-auto text-meta text-signal transition-opacity duration-150 disabled:opacity-40 enabled:hover:underline"
          >
            Clear
          </button>
        </div>

        <label className="sr-only" htmlFor="agent-search">
          Search agents
        </label>
        <TextField
          id="agent-search"
          type="search"
          autoComplete="off"
          placeholder="Search agents"
          value={draftQuery}
          onChange={(e) => onDraftQuery(e.target.value)}
        />
      </div>

      <InstitutionGroup filters={filters} onToggle={toggle("institutions")} />

      <FacetGroup
        label="What it does"
        options={categoryFacets(filters)}
        selected={filters.categories}
        onToggle={toggle("categories")}
      />

      <FacetGroup
        label="How it's reached"
        options={channelFacets(filters)}
        selected={filters.channels}
        onToggle={toggle("channels")}
      />

      <div className="flex flex-col gap-2">
        <Select
          label="Runs"
          value={filters.cadence}
          options={CADENCE_OPTIONS}
          onChange={(cadence) => onChange({ ...filters, cadence })}
        />
        <Select
          label="Approval"
          value={filters.approval}
          options={APPROVAL_OPTIONS}
          onChange={(approval) => onChange({ ...filters, approval })}
        />
      </div>

      <FacetGroup
        label="Status"
        options={statusFacets(filters)}
        selected={filters.statuses}
        onToggle={toggle("statuses")}
      />
    </div>
  );
}
