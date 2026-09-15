"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ClipboardList, FileText, Mail, Search, UserCheck } from "lucide-react";
import { Turn } from "@/components/ThreadDemos";
import { officeThreads, type Step, type Thread } from "@/data/threads";
import { cn } from "@/lib/cn";

/**
 * The product frame and the four tabs under it.
 *
 * This is the section that has to do the explaining, because "AI agent" means
 * nothing on its own and everything a reader already assumes about it is
 * either too small (a chatbot) or too large (software that acts on the
 * institution without asking). The four tabs say what the arc actually is --
 * and `Approve` sits third on purpose, between the work and the repetition,
 * because that is where it sits in the product.
 *
 * The frame replays one thread, the leave request, a few turns at a time. It
 * is the same recording that plays in full further down the page, rendered
 * with the same turn components, so the picture here and the demos below can
 * never drift apart.
 *
 * The tabs advance on their own, once through, and stop the moment the reader
 * touches one. Under `prefers-reduced-motion` they do not advance at all.
 */
const HOLD_MS = 5200;

type StepTab = {
  id: string;
  title: string;
  body: string;
  /** Which turns of the thread this step shows: [from, to). */
  turns: [number, number];
};

const TABS: StepTab[] = [
  {
    id: "ask",
    title: "Ask",
    body: "Say what you need done, in the words you would use with a colleague. No forms, no scripting, no new system to learn.",
    turns: [0, 2],
  },
  {
    id: "connect",
    title: "Connect",
    body: "The agent works inside the systems the institution already runs: the payroll portal, the mailbox, the CMS, the document store.",
    turns: [2, 5],
  },
  {
    id: "approve",
    title: "Approve",
    body: "Every binding action stops and waits for a named official. Nothing is captured, sent, published or changed on its own.",
    turns: [5, 7],
  },
  {
    id: "repeat",
    title: "Repeat",
    body: "Say “do this every Monday” and the one-off becomes standing work. The approval step comes with it.",
    turns: [9, 11],
  },
];

const thread: Thread = officeThreads[0];

/** The sidebar of the frame: the desks, as they would be listed in the product. */
const DESKS = [
  { name: "People Desk", icon: UserCheck },
  { name: "Executive Assistant", icon: ClipboardList },
  { name: "Correspondence", icon: Mail },
  { name: "Project Status", icon: FileText },
];

const isAgentSide = (step: Step) => step.type !== "user";

export function StepTabs() {
  const baseId = useId();
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedRef.current) setAuto(false);
  }, []);

  // Once through, then rest on the last tab. A frame that loops forever is a
  // distraction next to copy that is trying to be read.
  const running = auto && index < TABS.length - 1;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setIndex((i) => i + 1), HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [running, index]);

  const active = TABS[index];
  const [from, to] = active.turns;
  const turns = thread.steps.slice(from, to);

  function select(i: number) {
    setAuto(false);
    setIndex(i);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      select((index + 1) % TABS.length);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      select((index - 1 + TABS.length) % TABS.length);
    }
  }

  return (
    <section aria-labelledby="how-heading">
      <h2 id="how-heading" className="sr-only">
        How an agent works
      </h2>

      {/* ------------------------------------------------------- the frame */}
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${index}`}
        className="overflow-hidden rounded-xl border border-rule bg-surface shadow-[0_1px_2px_rgba(18,18,21,0.04),0_12px_40px_-24px_rgba(18,18,21,0.25)]"
      >
        <div className="grid md:grid-cols-[220px_1fr]">
          <aside
            aria-hidden="true"
            className="hidden border-r border-rule bg-paper px-3 py-4 md:block"
          >
            <p className="px-2 text-micro font-medium tracking-[0.12em] text-muted uppercase">
              Desks
            </p>
            <ul className="mt-2 flex flex-col gap-0.5">
              {DESKS.map((desk, i) => (
                <li
                  key={desk.name}
                  className={cn(
                    "flex items-center gap-2 rounded-sm px-2 py-1.5 text-meta",
                    i === 0 ? "bg-surface text-ink" : "text-muted",
                  )}
                >
                  <desk.icon aria-hidden="true" strokeWidth={1.5} className="size-3.5 shrink-0" />
                  {desk.name}
                </li>
              ))}
            </ul>

            <p className="mt-6 px-2 text-micro font-medium tracking-[0.12em] text-muted uppercase">
              Standing work
            </p>
            <ul className="mt-2 flex flex-col gap-0.5 text-meta text-muted">
              <li className="px-2 py-1.5">Daily brief · 07:00</li>
              <li className="px-2 py-1.5">Unanswered mail · 11:00, 15:00</li>
              <li className={cn("px-2 py-1.5", active.id === "repeat" && "text-ink")}>
                {active.id === "repeat" ? "Incoming leave requests · new" : ""}
              </li>
            </ul>
          </aside>

          <div className="min-h-[380px] md:min-h-[420px]">
            <div className="flex items-center gap-3 border-b border-rule px-4 py-3">
              <p className="text-ui font-medium text-ink">{thread.title}</p>
              <p className="hidden text-meta text-muted sm:block">{thread.tools}</p>
              <span className="ml-auto flex items-center gap-1.5 rounded-sm border border-rule px-2 py-1 text-micro text-muted">
                <Search aria-hidden="true" strokeWidth={1.5} className="size-3" />
                Threads
              </span>
            </div>

            {/* Keyed on the tab so the turns re-enter each time it changes. */}
            <div key={active.id} className="flex flex-col gap-5 px-4 py-5 sm:px-6">
              {turns.map((step, i) => {
                const absolute = from + i;
                const lead =
                  isAgentSide(step) &&
                  (i === 0 || !isAgentSide(thread.steps[absolute - 1]));
                return (
                  <Turn key={absolute} step={step} thread={thread} lead={lead} />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------- the tabs */}
      <div
        role="tablist"
        aria-label="How an agent works"
        onKeyDown={onKeyDown}
        className="mt-3 grid grid-cols-2 gap-x-6 md:grid-cols-4"
      >
        {TABS.map((tab, i) => {
          const selected = i === index;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(i)}
              className="group relative flex flex-col items-start border-t border-rule px-1 pt-3 pb-4 text-left"
            >
              {/* The rule: grey underneath; green, and filling across for
                  the length of the hold, when this is the tab in view. */}
              {selected && (
                <span
                  aria-hidden="true"
                  key={running ? "running" : "held"}
                  className={cn("absolute inset-x-0 -top-px h-0.5 bg-signal", running && "anim-fill")}
                  style={running ? { animationDuration: `${HOLD_MS}ms` } : undefined}
                />
              )}
              <span className="flex items-baseline gap-2">
                <span className="tabular text-micro text-muted">0{i + 1}</span>
                <span
                  className={cn(
                    "text-card font-medium transition-colors duration-150",
                    selected ? "text-ink" : "text-muted group-hover:text-ink",
                  )}
                >
                  {tab.title}
                </span>
              </span>
              <span className="mt-1.5 hidden text-meta leading-5 text-muted md:block">
                {tab.body}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
