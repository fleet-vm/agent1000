"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { AgentCard } from "@/components/agents/AgentCard";
import { FacetPanel } from "@/components/agents/FacetPanel";
import { Chip } from "@/components/ui/Chip";
import {
  activeChips,
  applyFilters,
  EMPTY_FILTERS,
  isDefault,
  parseFilters,
  toSearchString,
  type Filters,
} from "@/lib/filters";

export function AgentsDirectory() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseFilters(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  // The debounced text commit fires outside this render, so it reads the
  // current filters through a ref rather than a stale closure. Written in an
  // effect, not during render.
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const commit = useCallback(
    (next: Filters) => {
      const qs = toSearchString(next);
      router.replace(qs ? `/agents?${qs}` : "/agents", { scroll: false });
    },
    [router],
  );

  /* ------------------------------------------------- text filter, debounced */

  const [draftQuery, setDraftQuery] = useState(filters.q);
  const committedQuery = useRef(filters.q);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Keeps the field in step when q is cleared from somewhere else -- a chip, or
  // the Clear control -- without fighting what is being typed.
  useEffect(() => {
    if (filters.q !== committedQuery.current) {
      committedQuery.current = filters.q;
      setDraftQuery(filters.q);
    }
  }, [filters.q]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onDraftQuery = useCallback(
    (q: string) => {
      setDraftQuery(q);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        committedQuery.current = q;
        commit({ ...filtersRef.current, q });
      }, 150);
    },
    [commit],
  );

  const change = useCallback(
    (next: Filters) => {
      clearTimeout(timer.current);
      // Ticking a facet cancels the pending text commit, which would otherwise
      // throw away whatever is half-typed in the search field. If the caller
      // did not deliberately change q -- a chip removal or Clear does -- carry
      // the draft through instead of reverting to what the URL last held.
      const merged =
        next.q === filters.q ? { ...next, q: draftQuery } : next;
      committedQuery.current = merged.q;
      setDraftQuery(merged.q);
      commit(merged);
    },
    [commit, draftQuery, filters.q],
  );

  const clear = useCallback(() => change(EMPTY_FILTERS), [change]);

  /* ------------------------------------------------------------ mobile sheet */

  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetCloseRef = useRef<HTMLButtonElement>(null);
  const sheetTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!sheetOpen) return;
    sheetCloseRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  /* ----------------------------------------------------------------- results */

  const results = useMemo(() => applyFilters(filters), [filters]);
  const chips = useMemo(() => activeChips(filters), [filters]);

  const panel = (
    <FacetPanel
      filters={filters}
      draftQuery={draftQuery}
      onDraftQuery={onDraftQuery}
      onChange={change}
      onClear={clear}
    />
  );

  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 py-12">
      <h1 className="font-display text-head font-semibold tracking-tight text-ink">Agents</h1>
      <p className="mt-3 text-lede text-muted">
        What each one does, how it is reached, and what a person approves.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden md:block">
          <div className="rounded-lg border border-rule bg-surface p-4">
            {panel}
          </div>
        </aside>

        <section aria-label="Results">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button
              ref={sheetTriggerRef}
              type="button"
              onClick={() => setSheetOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-sm border border-rule bg-surface px-2.5 py-1.5 text-ui text-ink md:hidden"
            >
              <SlidersHorizontal aria-hidden="true" className="size-3.5" />
              Filters
              {chips.length > 0 && (
                <span className="tabular text-meta text-muted">
                  {chips.length}
                </span>
              )}
            </button>

            {chips.map((chip) => (
              <Chip
                key={chip.key}
                label={chip.label}
                onRemove={() => change(chip.clear(filters))}
              />
            ))}

            <p
              aria-live="polite"
              className="tabular ml-auto text-meta text-muted"
            >
              {results.length} {results.length === 1 ? "agent" : "agents"}
            </p>
          </div>

          {results.length > 0 ? (
            <ul className="grid gap-4 xl:grid-cols-2">
              {results.map((agent) => (
                <AgentCard key={agent.slug} agent={agent} />
              ))}
            </ul>
          ) : (
            <div className="rounded-lg border border-rule bg-surface px-4 py-6">
              <p className="text-ui text-ink">No agents match these filters.</p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={clear}
                  className="rounded-sm border border-rule bg-surface px-2.5 py-1.5 text-ui text-ink transition-colors duration-150 hover:border-signal"
                >
                  Clear filters
                </button>
                <Link href="/request" className="text-ui text-signal hover:underline">
                  Describe the task instead
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>

      {sheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className="fixed inset-0 z-20 flex flex-col bg-paper md:hidden"
        >
          <div className="flex items-center gap-3 border-b border-rule px-6 py-3">
            <span className="text-ui font-medium text-ink">Filters</span>
            <button
              ref={sheetCloseRef}
              type="button"
              onClick={() => setSheetOpen(false)}
              className="ml-auto inline-flex items-center gap-1 text-ui text-muted"
            >
              <X aria-hidden="true" className="size-4" />
              <span className="sr-only">Close filters</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">{panel}</div>

          <div className="border-t border-rule px-6 py-3">
            <button
              type="button"
              onClick={() => {
                setSheetOpen(false);
                sheetTriggerRef.current?.focus();
              }}
              className="tabular w-full rounded-sm bg-signal px-3 py-2.5 text-ui text-surface"
            >
              Show {results.length} {results.length === 1 ? "agent" : "agents"}
            </button>
            {!isDefault(filters) && (
              <button
                type="button"
                onClick={clear}
                className="mt-2 w-full py-1 text-ui text-signal"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
