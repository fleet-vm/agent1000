"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * A facet row: checkbox, label, and the count it would return.
 *
 * A facet that would return nothing renders dimmed and disabled rather than
 * disappearing. A sidebar that reorders itself under the cursor is disorienting,
 * and the zero is information -- it says the combination is empty, not that the
 * option does not exist.
 */
export function Checkbox({
  label,
  hint,
  count,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  /** What the label covers, e.g. a schedule reference. Surfaced on hover. */
  hint?: string;
  count?: number;
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label
      title={hint}
      className={cn(
        "group flex items-center gap-2 py-1 text-ui select-none",
        disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer",
      )}
    >
      <span className="relative flex size-[15px] shrink-0 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className={cn(
            "peer size-[15px] appearance-none rounded-[3px] border border-rule bg-surface",
            "transition-colors duration-150",
            "checked:border-signal checked:bg-signal",
            !disabled && "group-hover:border-muted checked:group-hover:border-signal",
          )}
        />
        <Check
          aria-hidden="true"
          strokeWidth={3}
          className="pointer-events-none absolute size-[11px] text-surface opacity-0 peer-checked:opacity-100"
        />
      </span>

      <span className={cn("flex-1", checked ? "text-ink" : "text-muted")}>
        {label}
        {hint && <span className="sr-only"> — {hint}</span>}
      </span>

      {count !== undefined && (
        <span className="tabular text-meta text-muted">{count}</span>
      )}
    </label>
  );
}
