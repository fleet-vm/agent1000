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
    title: "It signs in as itself",
    body: "Its own account, its own permissions, in the systems you already run. You can see what it touched and take the account away in an afternoon.",
  },
  {
    title: "It stops before it binds",
    body: "Capturing leave, sending a letter, publishing a page. The agent prepares; a named official decides. That order is not configurable.",
  },
  {
    title: "The record names a person",
    body: "Every approval is logged against the official who gave it, not the agent. When someone asks who authorised this, there is an answer.",
  },
];

export function ControlBand() {
  return (
    <section aria-labelledby="control-heading" className="border-y border-rule py-8">
      <h2 id="control-heading" className="text-head font-medium text-ink">
        What an official is actually agreeing to
      </h2>
      <p className="mt-1 text-meta text-muted">
        The part that has to survive an audit, not a demo.
      </p>

      <ul className="mt-5 flex flex-col gap-4">
        {POINTS.map((point) => (
          <li key={point.title} className="sm:flex sm:gap-6">
            <p className="text-card font-medium text-ink sm:w-[180px] sm:shrink-0">
              {point.title}
            </p>
            <p className="mt-1 text-meta leading-5 text-muted-ink sm:mt-0">{point.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
