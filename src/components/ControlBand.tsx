import { KeyRound, ShieldCheck, UserCheck } from "lucide-react";

/**
 * The band that breaks the demo list in two.
 *
 * Four demo cards stacked with nothing between them is a list, and a list is
 * read by skimming the first one and scrolling past the rest. This is the beat
 * in the middle -- and it is deliberately the objection beat, not another
 * feature beat, because the reader here is an official who will have to defend
 * the decision to let software touch a payroll system.
 */
const POINTS = [
  {
    icon: KeyRound,
    title: "It signs in as itself",
    body: "Its own account, its own permissions, in the systems you already run. You can see what it touched and take the account away in an afternoon.",
  },
  {
    icon: ShieldCheck,
    title: "It stops before it binds",
    body: "Capturing leave, sending a letter, publishing a page. The agent prepares; a named official decides. That order is not configurable.",
  },
  {
    icon: UserCheck,
    title: "The record names a person",
    body: "Every approval is logged against the official who gave it, not the agent. When someone asks who authorised this, there is an answer.",
  },
];

export function ControlBand() {
  return (
    <section aria-labelledby="control-heading">
      <p className="eyebrow">Governance</p>
      <h2
        id="control-heading"
        className="mt-2 max-w-[24ch] font-display text-head font-semibold tracking-tight text-ink"
      >
        What an official is actually agreeing to
      </h2>
      <p className="mt-3 max-w-[52ch] text-lede text-muted">
        The part that has to survive an audit, not a demo.
      </p>

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {POINTS.map((point) => (
          <li key={point.title} className="rounded-lg border border-rule bg-surface p-6">
            <point.icon aria-hidden="true" strokeWidth={1.5} className="size-5 text-signal" />
            <p className="mt-4 font-display text-[21px] leading-snug font-semibold text-ink">
              {point.title}
            </p>
            <p className="mt-2 text-ui leading-[22px] text-muted">{point.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
