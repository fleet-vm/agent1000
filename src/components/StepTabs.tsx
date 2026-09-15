"use client";

import { useCallback, useEffect, useId, useState, useSyncExternalStore } from "react";
import { Search } from "lucide-react";
import { holdFor, ICONS, Pending, Turn } from "@/components/ThreadDemos";
import { officeThreads, type Step, type Thread } from "@/data/threads";
import { cn } from "@/lib/cn";

/**
 * The product frame and the four tabs under it.
 *
 * This is the section that has to do the explaining, because "AI agent" means
 * nothing on its own and everything a reader already assumes about it is
 * either too small (a chatbot) or too large (software that acts on the
 * institution without asking). The four tabs say what the arc actually is,
 * and `Approve` sits third on purpose, between the work and the repetition,
 * because that is where it sits in the product.
 *
 * The frame holds the four desks. The sidebar picks the desk; the tabs pick
 * the step; the frame shows that desk's thread at that step, a few turns at a
 * time. They are the same recordings that play in full further down the page,
 * rendered with the same turn components, so the picture here and the demos
 * below can never drift apart.
 *
 * Every switch, of desk or of step, replays that slice a turn at a time at
 * the same pace as the demos. The tabs advance on their own, once through,
 * each one waiting for its playback to finish and then resting a beat, and
 * stop the moment the reader touches anything. Under `prefers-reduced-motion`
 * a slice lands whole and the tabs do not advance at all.
 */

/** How long a finished slice rests before the next tab takes over. */
const REST_MS = 2400;

type StepId = "ask" | "connect" | "approve" | "repeat";

const TABS: { id: StepId; title: string; body: string }[] = [
  {
    id: "ask",
    title: "Ask",
    body: "Say what you need done, in the words you would use with a colleague. No forms, no scripting, no new system to learn.",
  },
  {
    id: "connect",
    title: "Connect",
    body: "The agent works inside the systems the institution already runs: the payroll portal, the mailbox, the CMS, the document store.",
  },
  {
    id: "approve",
    title: "Approve",
    body: "Every binding action stops and waits for a named official. Nothing is captured, sent, published or changed on its own.",
  },
  {
    id: "repeat",
    title: "Repeat",
    body: "Say “do this every Monday” and the one-off becomes standing work. The approval step comes with it.",
  },
];

/** The desks in the frame, in the order they appear below. */
const desks: Thread[] = officeThreads;

const isAgentSide = (step: Step) => step.type !== "user";

/**
 * Which turns of a thread belong to which step. Derived from the shape of the
 * recording rather than written per thread, so a new desk in `threads.ts`
 * slots in without anyone maintaining index ranges here.
 *
 *   ask      the opening request and the agent's reply, up to the first
 *            system it reaches for
 *   connect  from that first connection to the approval gate, or to the
 *            first automation if the desk never binds anything
 *   approve  the gate, the decision, and what follows it, up to the next
 *            request
 *   repeat   the first "do this every time" and everything after it
 *
 * A step with no turns is a fact about the desk (the morning brief binds
 * nothing; correspondence has no standing version yet), and the frame says so
 * rather than showing an empty panel.
 */
function windows(steps: Step[]): Record<StepId, [number, number]> {
  const n = steps.length;
  const firstConnect = steps.findIndex((s) => s.type === "connect" || s.type === "work");
  const gate = steps.findIndex((s) => s.type === "gate");
  const repeat = steps.findIndex((s, i) => s.type === "user" && steps[i + 1]?.type === "auto");
  const afterGate = gate >= 0 ? steps.findIndex((s, i) => i > gate && s.type === "user") : -1;

  const askEnd = firstConnect >= 0 ? firstConnect : n;
  const connectEnd = gate >= 0 ? gate : repeat >= 0 ? repeat : n;
  const approveEnd = afterGate >= 0 ? afterGate : n;

  return {
    ask: [0, askEnd],
    connect: [askEnd, connectEnd],
    approve: gate >= 0 ? [gate, approveEnd] : [0, 0],
    repeat: repeat >= 0 ? [repeat, n] : [0, 0],
  };
}

const EMPTY: Record<StepId, string> = {
  ask: "",
  connect: "",
  approve:
    "Nothing on this desk binds anything, so nothing stops. A brief is read, not acted on.",
  repeat:
    "This desk works on request. Say “do this every time” and it becomes standing work, approval step included.",
};

/**
 * One slice of a thread, revealed a turn at a time. Mounted fresh (keyed) on
 * every desk or step change, so it always starts from nothing.
 */
function Playback({
  thread,
  from,
  to,
  instant,
  onDone,
}: {
  thread: Thread;
  from: number;
  to: number;
  instant: boolean;
  onDone: () => void;
}) {
  const turns = thread.steps.slice(from, to);
  // The first turn lands at once: an empty frame for a second reads as broken.
  const [shown, setShown] = useState(instant ? turns.length : Math.min(1, turns.length));
  const done = shown >= turns.length;

  useEffect(() => {
    if (done) return;
    const hold = instant ? 0 : holdFor(turns[shown]);
    const timer = window.setTimeout(() => setShown((n) => n + 1), hold);
    return () => window.clearTimeout(timer);
  }, [done, instant, shown, turns]);

  useEffect(() => {
    if (done) onDone();
  }, [done, onDone]);

  const pending = done ? null : turns[shown];

  return (
    <>
      {turns.slice(0, shown).map((step, i) => {
        const absolute = from + i;
        const lead =
          isAgentSide(step) && (i === 0 || !isAgentSide(thread.steps[absolute - 1]));
        return <Turn key={absolute} step={step} thread={thread} lead={lead} />;
      })}
      {pending && <Pending step={pending} />}
    </>
  );
}

const REDUCE = "(prefers-reduced-motion: reduce)";

function subscribeReduce(notify: () => void) {
  const query = window.matchMedia(REDUCE);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}

/** The reader's motion preference, live. False on the server. */
function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(REDUCE).matches,
    () => false,
  );
}

/** A step the desk does not have. Counts as played the moment it shows. */
function EmptySlice({ text, onDone }: { text: string; onDone: () => void }) {
  useEffect(() => onDone(), [onDone]);
  return <p className="anim-step max-w-[48ch] text-ui leading-6 text-muted">{text}</p>;
}

/** The full length of a slice's playback plus its rest: the fill duration. */
function playbackLength(steps: Step[], from: number, to: number): number {
  return steps.slice(from, to).reduce((sum, step) => sum + holdFor(step), 0) + REST_MS;
}

export function StepTabs() {
  const baseId = useId();
  const [deskIndex, setDeskIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const reduced = useReducedMotion();
  // Set by the playback when its last turn has landed; cleared on every
  // switch, because the new slice has not played yet.
  const [played, setPlayed] = useState(false);

  const thread = desks[deskIndex];
  const active = TABS[index];
  const [from, to] = windows(thread.steps)[active.id];
  const empty = to <= from;
  const automations = thread.steps.filter((s) => s.type === "auto");

  // Once through, then rest on the last tab. A frame that loops forever is a
  // distraction next to copy that is trying to be read.
  const running = auto && !reduced && index < TABS.length - 1;

  // The next tab takes over only once this slice has finished playing and
  // rested a beat. A slice with no turns rests for the same beat.
  useEffect(() => {
    if (!running || !played) return;
    const timer = window.setTimeout(() => {
      setPlayed(false);
      setIndex((i) => i + 1);
    }, REST_MS);
    return () => window.clearTimeout(timer);
  }, [running, played]);

  const onDone = useCallback(() => setPlayed(true), []);
  const fillMs = playbackLength(thread.steps, from, to);

  function selectStep(i: number) {
    setAuto(false);
    setPlayed(false);
    setIndex(i);
  }

  function selectDesk(i: number) {
    setAuto(false);
    setPlayed(false);
    setDeskIndex(i);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      selectStep((index + 1) % TABS.length);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      selectStep((index - 1 + TABS.length) % TABS.length);
    }
  }

  const deskList = (
    <ul className="flex gap-1 md:flex-col md:gap-0.5">
      {desks.map((desk, i) => {
        const Icon = ICONS[desk.icon];
        const selected = i === deskIndex;
        return (
          <li key={desk.id} className="shrink-0">
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => selectDesk(i)}
              className={cn(
                "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-meta whitespace-nowrap transition-colors duration-150",
                selected
                  ? "bg-surface text-ink shadow-[0_0_0_1px_var(--color-rule)] md:shadow-none"
                  : "text-muted hover:text-ink",
              )}
            >
              <Icon aria-hidden="true" strokeWidth={1.5} className="size-3.5 shrink-0" />
              {desk.name}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <section aria-labelledby="how-heading">
      <h2 id="how-heading" className="sr-only">
        How an agent works
      </h2>

      {/* ------------------------------------------------------- the frame */}
      <div className="overflow-hidden rounded-xl border border-rule bg-surface shadow-[0_1px_2px_rgba(18,18,21,0.04),0_12px_40px_-24px_rgba(18,18,21,0.25)]">
        <div className="grid md:grid-cols-[220px_1fr]">
          <aside className="hidden border-r border-rule bg-paper px-3 py-4 md:block">
            <p className="px-2 text-micro font-medium tracking-[0.12em] text-muted uppercase">
              Desks
            </p>
            <nav aria-label="Desks" className="mt-2">
              {deskList}
            </nav>

            <p className="mt-6 px-2 text-micro font-medium tracking-[0.12em] text-muted uppercase">
              Standing work
            </p>
            <ul className="mt-2 flex flex-col gap-0.5 text-meta text-muted">
              {automations.length === 0 && <li className="px-2 py-1.5">None yet</li>}
              {automations.map((step) =>
                step.type === "auto" ? (
                  <li
                    key={step.title}
                    className={cn("px-2 py-1.5", active.id === "repeat" && "text-ink")}
                  >
                    {step.title}
                  </li>
                ) : null,
              )}
            </ul>
          </aside>

          <div className="min-h-[380px] min-w-0 md:min-h-[420px]">
            {/* Small screens have no sidebar, so the desks sit in a row. */}
            <nav
              aria-label="Desks"
              className="overflow-x-auto border-b border-rule bg-paper px-3 py-2 md:hidden"
            >
              {deskList}
            </nav>

            <div className="flex items-center gap-3 border-b border-rule px-4 py-3">
              <p className="text-ui font-medium text-ink">{thread.title}</p>
              <p className="hidden text-meta text-muted sm:block">{thread.tools}</p>
              <span className="ml-auto flex items-center gap-1.5 rounded-sm border border-rule px-2 py-1 text-micro text-muted">
                <Search aria-hidden="true" strokeWidth={1.5} className="size-3" />
                Threads
              </span>
            </div>

            {/* Keyed on desk and tab so the turns re-enter each time either
                changes. */}
            <div
              key={`${thread.id}-${active.id}`}
              role="tabpanel"
              id={`${baseId}-panel`}
              aria-labelledby={`${baseId}-tab-${index}`}
              className="flex flex-col gap-5 px-4 py-5 sm:px-6"
            >
              {empty ? (
                <EmptySlice text={EMPTY[active.id]} onDone={onDone} />
              ) : (
                <Playback
                  thread={thread}
                  from={from}
                  to={to}
                  instant={reduced}
                  onDone={onDone}
                />
              )}
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
              onClick={() => selectStep(i)}
              className="group relative flex flex-col items-start border-t border-rule px-1 pt-3 pb-4 text-left"
            >
              {/* The rule: grey underneath; green, and filling across for
                  the length of the hold, when this is the tab in view. */}
              {selected && (
                <span
                  aria-hidden="true"
                  key={running ? "running" : "held"}
                  className={cn("absolute inset-x-0 -top-px h-0.5 bg-signal", running && "anim-fill")}
                  style={running ? { animationDuration: `${fillMs}ms` } : undefined}
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
