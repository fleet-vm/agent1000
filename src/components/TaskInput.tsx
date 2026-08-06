"use client";

import { useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORY_LABEL } from "@/data/agents";
import { matchAgents } from "@/lib/match";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";

/**
 * The task input, and the one place on the site where anything is typed.
 *
 * Submitting goes to /request. Typing offers at most three agents from the
 * catalogue, as a combobox: arrow keys move through them, Enter opens the
 * highlighted one, Enter with nothing highlighted submits the description, and
 * Escape closes the list without losing what was typed.
 */
export function TaskInput({ autoFocus = false }: { autoFocus?: boolean }) {
  const router = useRouter();
  const listId = useId();
  const optionId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const suggestions = useMemo(() => matchAgents(query, 3), [query]);
  const showList = open && suggestions.length > 0;

  function submit(value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    router.push(`/request?q=${encodeURIComponent(trimmed)}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
      return;
    }
    if (!showList) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      router.push(`/agents/${suggestions[active].slug}`);
    }
  }

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        submit(query);
      }}
      // A click inside the list would otherwise blur the input and unmount the
      // option before the click landed.
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setOpen(false);
          setActive(-1);
        }
      }}
      className="relative"
    >
      <label htmlFor={`${listId}-input`} className="sr-only">
        Describe the work you want an agent to do
      </label>

      <TextField
        ref={inputRef}
        id={`${listId}-input`}
        tone="hero"
        autoFocus={autoFocus}
        autoComplete="off"
        placeholder="Describe the work you want an agent to do"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          showList && active >= 0 ? `${optionId}-${active}` : undefined
        }
      />

      {showList && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Matching agents"
          className="absolute z-10 mt-1 w-full overflow-hidden rounded-sm border border-rule bg-surface"
        >
          {suggestions.map((agent, i) => (
            <li key={agent.slug} role="none">
              <button
                type="button"
                id={`${optionId}-${i}`}
                role="option"
                aria-selected={i === active}
                tabIndex={-1}
                onMouseEnter={() => setActive(i)}
                onClick={() => router.push(`/agents/${agent.slug}`)}
                className={cn(
                  "flex w-full items-baseline gap-2 px-4 py-2 text-left text-ui",
                  i === active ? "bg-ready-bg" : "bg-surface",
                )}
              >
                <span className="text-ink">{agent.name}</span>
                <span className="text-meta text-muted">
                  {CATEGORY_LABEL[agent.category]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="submit" className="sr-only">
        Describe this task
      </button>
    </form>
  );
}
