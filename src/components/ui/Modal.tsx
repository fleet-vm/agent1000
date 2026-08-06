"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * A modal, built on the native <dialog>.
 *
 * The element is what gives us the focus trap, the Escape key, the inert
 * background and top-layer stacking -- the last of which matters: a hand-rolled
 * overlay can be clipped by an ancestor's `overflow`, and the top layer cannot.
 * React state stays the source of truth; the first effect keeps the element in
 * step with it.
 *
 * Three things the element does not do, added here:
 *   - close on a backdrop click,
 *   - stop the page behind it scrolling,
 *   - return focus somewhere sensible when the trigger has been unmounted
 *     (a form that replaces its own button with a confirmation).
 */
export function Modal({
  open,
  title,
  onClose,
  size = "default",
  children,
}: {
  open: boolean;
  /** Names the dialog for assistive technology as well as heading it. */
  title: string;
  onClose: () => void;
  /** `wide` is for forms long enough that two-thirds of the width is labels. */
  size?: "default" | "wide";
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // showModal() on an open dialog throws, as does close() on a closed one.
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // showModal() makes the background inert but does not stop it scrolling.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      onClose={onClose} // Escape, and close() itself
      onClick={(e) => {
        // A click that lands on the dialog element rather than on the panel
        // inside it is a click on the backdrop.
        if (e.target === dialogRef.current) onClose();
      }}
      className={cn(
        "m-auto max-h-[85vh] overflow-y-auto",
        "rounded-lg border border-rule bg-surface p-0 text-ink",
        "backdrop:bg-ink/40",
        size === "wide"
          ? "w-[min(36rem,calc(100vw-2rem))]"
          : "w-[min(30rem,calc(100vw-2rem))]",
      )}
    >
      {/* Sticky so the close control stays reachable in a form long enough to
          scroll -- which is the only kind of form that ends up in a modal. */}
      <div className="sticky top-0 z-10 flex items-baseline gap-4 border-b border-rule bg-surface px-5 py-3">
        <h2 className="text-card font-medium text-ink">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto -mr-1 shrink-0 self-center text-muted transition-colors duration-150 hover:text-signal"
        >
          <X aria-hidden="true" className="size-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>

      <div className="px-5 py-4">{children}</div>
    </dialog>
  );
}
