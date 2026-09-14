"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Check,
  ChevronRight,
  ClipboardList,
  FileText,
  FolderClosed,
  LoaderCircle,
  Mail,
  Plug,
  Repeat2,
  Shield,
  ShieldCheck,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import type { Step, Thread, ThreadIcon } from "@/data/threads";

/**
 * The recorded threads, played a turn at a time as you reach them.
 *
 * A turn is either the person's or the agent's, and the two never look alike.
 * The person speaks in a tinted bubble on the right; the agent answers in a
 * left column under its own name, and everything the agent does -- reaching
 * for a system, working, asking for approval -- stays inside that column. The
 * old version put both sides in the same paragraph style, and you could not
 * tell who was talking.
 *
 * Nothing here is interactive except the work traces. There is no play button:
 * a control whose only job is to restart an advertisement is chrome.
 *
 * COLOUR, and it is a rule, not a preference: inside a thread, colour marks
 * the human and nothing else.
 *
 *   amber (pilot)  work has stopped and is waiting for a named person
 *   green (live)   a named person decided, and it is now done
 *
 * Everything else -- the person's own bubble, the agent's prose, the systems
 * it connected to, the traces, the briefs, the automations -- is ink and grey.
 * An earlier pass had green doing four jobs at once (the user bubble, the
 * `Connected` flag, the approval, the automation card), which is the same as
 * having no colour system at all: if the approval gate is the only thing on
 * the page a reader has to look at, it has to be the only thing wearing a
 * colour. Position, shape and weight separate everything else.
 */

const ICONS: Record<ThreadIcon, LucideIcon> = {
  people: UserCheck,
  assistant: ClipboardList,
  mail: Mail,
  projects: BarChart3,
  security: Shield,
  publishing: FileText,
  documents: FolderClosed,
  data: BarChart3,
};

/* ------------------------------------------------------------------ pacing

   One thread plays at a time, and it is the one the reader is looking at.

   Each card watching only itself is what made every demo start talking at once
   the moment the section scrolled into view: four conversations racing each
   other, none of them where the reader's eye was, and all of them over by the
   time anyone arrived. So the cards are pooled here, at module scope rather
   than per list -- the front page breaks its demos into two lists around a
   band of copy, and two lists each electing their own winner is the same bug
   again.

   The measure is distance from a reading line a third of the way down the
   viewport, not how many pixels of a card are on screen. Pixels sound
   reasonable and are not: a thread that has not started is only its header,
   so it can never out-measure a thread that has already grown to a full
   transcript -- including the one directly above it that just finished. Every
   card stays collapsed, waiting for a turn that arithmetic will not give it.
   Distance does not care how tall a card is.

   A thread that loses focus does not reset. It holds on its last turn and
   carries on when the reader comes back to it. A thread that has finished
   stands down, so the baton can pass while it is still on screen. */

const cards = new Map<string, HTMLElement>();
const finished = new Set<string>();
const subscribers = new Set<() => void>();
let activeId: string | null = null;
let pendingElection = 0;
let listening = false;

/** Where in the viewport a reader is assumed to be looking. */
const READING_LINE = 0.35;

function distanceFromReadingLine(card: HTMLElement) {
  const rect = card.getBoundingClientRect();
  const viewport = window.innerHeight;

  if (rect.bottom <= 0 || rect.top >= viewport) return Infinity;

  const line = viewport * READING_LINE;
  if (rect.top > line) return rect.top - line;
  if (rect.bottom < line) return line - rect.bottom;
  return 0; // the card straddles the line: this is what is being read
}

function runElection() {
  pendingElection = 0;

  let winner: string | null = null;
  let shortest = Infinity;

  for (const [id, card] of cards) {
    if (finished.has(id)) continue;
    const distance = distanceFromReadingLine(card);
    // Strictly nearer, so a tie leaves the baton where it is.
    if (distance < shortest) {
      winner = id;
      shortest = distance;
    }
  }

  if (winner === activeId) return;
  activeId = winner;
  for (const notify of subscribers) notify();
}

/**
 * Elections are held once a frame and never inside the handler that called
 * for one. Publishing straight from a scroll or layout callback puts a state
 * change into React's commit-layout-commit path, and cards close in height
 * then trade the lead every frame -- each trade re-rendering every card, which
 * changes layout, which trades the lead again. A frame's delay ends it.
 */
function elect() {
  if (pendingElection) return;
  pendingElection = requestAnimationFrame(runElection);
}

function register(id: string, card: HTMLElement) {
  cards.set(id, card);

  if (!listening) {
    listening = true;
    window.addEventListener("scroll", elect, { passive: true });
    window.addEventListener("resize", elect);
  }

  elect();
}

function unregister(id: string) {
  cards.delete(id);
  finished.delete(id);

  if (cards.size === 0 && listening) {
    listening = false;
    window.removeEventListener("scroll", elect);
    window.removeEventListener("resize", elect);
  }

  elect();
}

/** Played out. Hand the baton on, even while still on screen. */
function retire(id: string) {
  finished.add(id);
  elect();
}

function subscribe(notify: () => void) {
  subscribers.add(notify);
  return () => {
    subscribers.delete(notify);
  };
}

/** Everything the agent does shares one column and one avatar gutter. */
type AgentSideStep = Exclude<Step, { type: "user" }>;

const isAgentSide = (step: Step): step is AgentSideStep => step.type !== "user";

function Turn({ step, thread, lead }: { step: Step; thread: Thread; lead: boolean }) {
  if (step.type === "user") {
    return (
      <div className="anim-step flex flex-col items-end pl-10">
        <p className="max-w-[85%] rounded-lg rounded-br-sm bg-ready-bg px-3.5 py-2.5 text-ui leading-6 text-ink">
          {step.text}
        </p>
        <p className="mt-1.5 text-micro text-muted-ink">You · {step.time}</p>
      </div>
    );
  }

  const Icon = ICONS[thread.icon];

  return (
    <div className="anim-step flex gap-3">
      {/* The gutter is always reserved, so grouped agent turns stay in one
          column instead of stepping left when the avatar is dropped. */}
      <span className="w-7 shrink-0">
        {lead && (
          <span className="flex size-7 items-center justify-center rounded-lg border border-rule bg-paper">
            <Icon aria-hidden="true" strokeWidth={1.5} className="size-3.5 text-ink" />
          </span>
        )}
      </span>

      <div className="min-w-0 flex-1 pr-6 sm:pr-8">
        {lead && <p className="mb-1.5 text-micro font-medium text-muted-ink">{thread.name}</p>}
        <AgentStep step={step} />
      </div>
    </div>
  );
}

function AgentStep({ step }: { step: AgentSideStep }) {
  if (step.type === "agent") {
    return <p className="text-ui leading-6 text-ink">{step.text}</p>;
  }

  if (step.type === "connect") {
    return (
      <p className="flex items-center gap-2 rounded-lg border border-rule bg-paper px-3 py-2 text-meta">
        <Plug aria-hidden="true" strokeWidth={1.5} className="size-3.5 shrink-0 text-muted" />
        <span className="min-w-0 text-ink">{step.system}</span>
        <span className="ml-auto shrink-0 text-muted">Connected</span>
      </p>
    );
  }

  if (step.type === "work") {
    return (
      <details className="group text-meta">
        <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-muted-ink marker:content-none">
          <ChevronRight
            aria-hidden="true"
            strokeWidth={1.5}
            className="size-3.5 transition-transform duration-150 group-open:rotate-90"
          />
          Worked for {step.took}
        </summary>
        <ul className="mt-2 ml-[7px] flex flex-col gap-1.5 border-l border-rule pl-4">
          {step.trace.map((line) => (
            <li key={line} className="leading-5 text-muted-ink">
              {line}
            </li>
          ))}
        </ul>
      </details>
    );
  }

  if (step.type === "card") {
    return (
      <div className="rounded-lg border border-rule bg-paper p-3.5">
        <p className="text-ui font-medium text-ink">{step.title}</p>
        <dl className="mt-3 flex flex-col gap-3">
          {step.sections.map((section) => (
            <div key={section.heading}>
              <dt className="text-micro tracking-[0.06em] text-muted uppercase">
                {section.heading}
              </dt>
              <dd className="mt-1 flex flex-col gap-1">
                {section.lines.map((line) => (
                  <span key={line} className="text-meta leading-5 text-ink">
                    {line}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  if (step.type === "gate") {
    return (
      <div className="rounded-lg border border-pilot-fg/35 bg-pilot-bg p-3.5">
        <p className="flex items-center gap-2 text-ui font-medium text-pilot-fg">
          <ShieldCheck aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0" />
          {step.title}
        </p>
        <p className="mt-2 whitespace-pre-line text-meta leading-5 text-ink">{step.body}</p>
        {/* Presentational. These are a picture of the approval a real official
            gets, not controls -- a focusable button that does nothing is worse
            than no button. */}
        <div aria-hidden="true" className="mt-3 flex flex-wrap gap-2 text-meta">
          <span className="rounded-sm bg-live-fg px-2.5 py-1 text-white">Approve</span>
          <span className="rounded-sm border border-rule bg-surface px-2.5 py-1 text-ink">Edit</span>
          <span className="rounded-sm border border-rule bg-surface px-2.5 py-1 text-ink">Decline</span>
        </div>
      </div>
    );
  }

  if (step.type === "approved") {
    return (
      <p className="flex items-center gap-2 text-meta text-live-fg">
        <Check aria-hidden="true" strokeWidth={2} className="size-3.5 shrink-0" />
        {step.text}
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-rule bg-ready-bg p-3.5">
      <p className="text-micro tracking-[0.06em] text-muted uppercase">Created automation</p>
      <p className="mt-1.5 flex items-center gap-2 text-ui font-medium text-ink">
        <Repeat2 aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0 text-ink" />
        {step.title}
      </p>
      <p className="mt-1.5 text-meta leading-5 text-ink">{step.body}</p>
    </div>
  );
}

function DemoThread({ thread, number }: { thread: Thread; number: number }) {
  const Icon = ICONS[thread.icon];
  const [shown, setShown] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedRef = useRef(false);
  const done = shown >= thread.steps.length;

  const [active, setActive] = useState(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => subscribe(() => setActive(activeId === thread.id)), [thread.id]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const id = thread.id;
    register(id, card);
    return () => unregister(id);
  }, [thread.id]);

  useEffect(() => {
    if (done) retire(thread.id);
  }, [done, thread.id]);

  /* A step that reads as work holds the thread longer than one that does not.
     Anyone who has asked for less motion gets the whole thread at once. */
  useEffect(() => {
    if (!active || done) return;

    const next = thread.steps[shown];
    const hold = reducedRef.current
      ? 0
      : next.type === "work"
        ? 2200
        : next.type === "user"
          ? 1100
          : next.type === "card"
            ? 1800
            : 1500;

    const timer = window.setTimeout(() => setShown((n) => n + 1), hold);
    return () => window.clearTimeout(timer);
  }, [active, done, shown, thread.steps]);

  const pending = active && !done ? thread.steps[shown] : null;

  return (
    <div ref={cardRef} className="overflow-hidden rounded-lg border border-rule bg-surface">
      <div className="border-b border-rule px-4 py-3.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex size-7 items-center justify-center rounded-lg border border-rule bg-paper">
            <Icon aria-hidden="true" strokeWidth={1.5} className="size-3.5 text-ink" />
          </span>

          {thread.slug ? (
            <Link
              href={`/agents/${thread.slug}`}
              className="text-ui font-medium text-ink transition-colors duration-150 hover:text-signal"
            >
              {thread.name}
            </Link>
          ) : (
            <p className="text-ui font-medium text-ink">{thread.name}</p>
          )}

          <p className="text-meta text-muted">{thread.tools}</p>
          <span className="tabular ml-auto text-meta text-muted">
            {String(number).padStart(2, "0")}
          </span>
        </div>

        {/* The outcome, before a single turn has played. A reader who never
            watches the thread should still know what they would be buying. */}
        <p className="mt-2.5 text-card leading-6 text-ink">{thread.value}</p>
        <p className="mt-1 text-meta text-muted">{thread.title}</p>
      </div>

      {/* No fixed height and no inner scrollbar. A box that scrolls inside a
          page that also scrolls steals the wheel from whoever is just reading
          past it, and it hides the end of the thread -- which is the automation,
          the part worth seeing. The card grows instead. */}
      <div
        role="log"
        aria-live="off"
        aria-label={`${thread.name} example thread: ${thread.title}`}
        /* A thread that has not reached the reader yet collapses to nothing,
           rather than sitting under its header as an empty strip. */
        className={shown === 0 ? "" : "flex flex-col gap-5 px-4 py-4"}
      >
        {thread.steps.slice(0, shown).map((step, index) => (
          <Turn
            key={`${thread.id}-${index}`}
            step={step}
            thread={thread}
            lead={isAgentSide(step) && (index === 0 || !isAgentSide(thread.steps[index - 1]))}
          />
        ))}

        {pending?.type === "work" && (
          <p className="anim-step flex items-center gap-2 pl-10 text-meta text-muted-ink">
            <LoaderCircle aria-hidden="true" strokeWidth={1.5} className="size-3.5 shrink-0" />
            <span>
              Working
              <span aria-hidden="true" className="anim-dot ml-0.5 inline-block">
                …
              </span>
            </span>
          </p>
        )}

        {pending !== null && pending.type !== "work" && isAgentSide(pending) && (
          <p aria-hidden="true" className="anim-dot flex gap-1 pl-10">
            <span className="size-1.5 rounded-full bg-muted" />
            <span className="size-1.5 rounded-full bg-muted" />
            <span className="size-1.5 rounded-full bg-muted" />
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * `from` keeps the numbering continuous when the list is broken in two by a
 * band of copy -- the demos are 01 to 04 whether or not something sits between
 * the second and the third.
 */
export function ThreadDemos({ threads, from = 1 }: { threads: Thread[]; from?: number }) {
  return (
    <ul className="flex flex-col gap-12">
      {threads.map((thread, index) => (
        <li key={thread.id}>
          <DemoThread thread={thread} number={from + index} />

          {/* The beat after the thread. Deliberately not a card: the page
              should alternate between something to watch and something to
              read, or it is a list again. */}
          <div className="mt-5 flex gap-3.5">
            <span aria-hidden="true" className="mt-2.5 h-px w-5 shrink-0 bg-rule" />
            <div className="min-w-0">
              <p className="text-card leading-6 font-medium text-ink">
                {thread.takeaway.title}
              </p>
              <p className="mt-1.5 max-w-[56ch] text-meta leading-5 text-muted-ink">
                {thread.takeaway.body}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
