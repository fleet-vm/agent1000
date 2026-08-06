"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: {
  /** Visually hidden: the "any" option carries the label in the closed state. */
  label: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (next: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <label className="sr-only" htmlFor={`select-${label}`}>
        {label}
      </label>
      <select
        id={`select-${label}`}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={cn(
          "w-full appearance-none rounded-sm border border-rule bg-surface",
          "py-1.5 pl-2.5 pr-7 text-ui text-ink",
          "transition-colors duration-150 hover:border-muted focus:border-signal",
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-muted"
      />
    </div>
  );
}
