"use client";

import { X } from "lucide-react";

/** An active filter, above the results. Clicking it removes that one filter. */
export function Chip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 rounded-sm border border-rule bg-surface py-1 pl-2.5 pr-2 text-meta text-ink transition-colors duration-150 hover:border-signal hover:text-signal"
    >
      {label}
      <X aria-hidden="true" className="size-3" />
      <span className="sr-only">Remove filter</span>
    </button>
  );
}
