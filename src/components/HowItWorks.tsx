/**
 * The four steps, above the demos.
 *
 * This is the section that has to do the explaining, because "AI agent" means
 * nothing on its own and everything a reader already assumes about it is
 * either too small (a chatbot) or too large (software that acts on the
 * institution without asking). The four steps say what the arc actually is --
 * and `Approve` sits third on purpose, between the work and the repetition,
 * because that is where it sits in the product.
 */
const STEPS = [
  {
    title: "Ask",
    body: "Say what you need done, in the words you would use with a colleague. No forms, no scripting, no new system to learn.",
  },
  {
    title: "Connect",
    body: "The agent works inside the systems the institution already runs — the payroll portal, the mailbox, the CMS, the document store.",
  },
  {
    title: "Approve",
    body: "Every binding action stops and waits for a named official. Nothing is captured, sent, published or changed on its own.",
  },
  {
    title: "Repeat",
    body: "Say “do this every Monday” and the one-off becomes standing work. The approval step comes with it.",
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="border-t border-rule pt-8">
      <h2 id="how-heading" className="text-head font-medium text-ink">
        How an agent works
      </h2>
      <p className="mt-1 text-meta text-muted">
        The same four steps, whether the task runs once or every morning.
      </p>

      <ol className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {STEPS.map((step, index) => (
          <li key={step.title}>
            <p className="flex items-baseline gap-2">
              <span className="tabular text-micro text-muted">0{index + 1}</span>
              <span className="text-card font-medium text-ink">{step.title}</span>
            </p>
            <p className="mt-1 text-meta leading-5 text-muted-ink">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
