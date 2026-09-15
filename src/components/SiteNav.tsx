"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Wordmark } from "@/components/Wordmark";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * The tabs. One row, in the order a first-time reader needs them: what the
 * agents are, what they look like working, who resells and certifies them,
 * and what we have written.
 *
 * The active tab is underlined in ink, not coloured -- the accent green is
 * reserved for things the reader can act on, and "where you already are" is
 * not one of them.
 */
const TABS = [
  { href: "/agents", label: "Agents" },
  { href: "/use-cases", label: "Use cases" },
  { href: "/partners", label: "Partners" },
  { href: "/resellers", label: "Resellers" },
  { href: "/blog", label: "Blog" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Escape closes the sheet; so does choosing a tab in it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-paper/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1120px] items-center gap-4 px-6">
        <Link href="/" className="inline-block py-3.5">
          <Wordmark className="text-[19px] text-ink" />
        </Link>

        <nav aria-label="Primary" className="hidden md:flex md:flex-1 md:justify-center">
          <ul className="flex items-center gap-1">
            {TABS.map((tab) => {
              const active = isActive(pathname, tab.href);
              return (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex items-center px-3 py-4 text-ui font-medium transition-colors duration-150",
                      active ? "text-ink" : "text-muted hover:text-ink",
                    )}
                  >
                    {tab.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-3 -bottom-px h-0.5 rounded-full transition-opacity duration-150",
                        active ? "bg-ink opacity-100" : "opacity-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <ButtonLink href="/request" tone="primary">
            Request a demo
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-menu"
          className="ml-auto inline-flex size-9 items-center justify-center rounded-sm text-ink md:hidden"
        >
          {open ? (
            <X aria-hidden="true" strokeWidth={1.75} className="size-5" />
          ) : (
            <Menu aria-hidden="true" strokeWidth={1.75} className="size-5" />
          )}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      <div
        id="site-menu"
        hidden={!open}
        className="border-t border-rule bg-paper md:hidden"
      >
        <nav aria-label="Primary" className="mx-auto w-full max-w-[1120px] px-6 py-3">
          <ul className="flex flex-col">
            {TABS.map((tab) => {
              const active = isActive(pathname, tab.href);
              return (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block py-2.5 text-body font-medium",
                      active ? "text-ink" : "text-muted",
                    )}
                  >
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ButtonLink href="/request" tone="primary" size="lg" className="mt-3 w-full">
            Request a demo
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
