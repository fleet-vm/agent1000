"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { agentMeta } from "@/data/agents";
import { matchAgents } from "@/lib/match";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TextField } from "@/components/ui/TextField";

export function RequestBody() {
  const searchParams = useSearchParams();
  const task = (searchParams.get("q") ?? "").trim();

  const matches = useMemo(() => matchAgents(task, 3), [task]);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  function close() {
    setOpen(false);
    (triggerRef.current ?? doneRef.current)?.focus();
  }

  return (
    <div className="mx-auto w-full max-w-[640px] px-6 py-8">
      {task ? (
        <>
          <h1 className="text-micro tracking-[0.06em] text-muted uppercase">
            The work you described
          </h1>
          <p className="mt-2 text-body text-ink">{task}</p>
        </>
      ) : (
        <>
          <h1 className="text-head text-ink">Describe the work</h1>
          <p className="mt-1 text-ui text-muted">
            Tell us the task and we will say which agent covers it, or whether
            one has to be built.
          </p>
        </>
      )}

      {task && (
        <section className="mt-8 border-t border-rule pt-4">
          <h2 className="text-micro tracking-[0.06em] text-muted uppercase">
            {matches.length > 0 ? "Closest agents" : "No close match"}
          </h2>

          {matches.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2">
              {matches.map((agent) => (
                <li key={agent.slug}>
                  <Link
                    href={`/agents/${agent.slug}`}
                    className="block rounded-lg border border-rule bg-surface px-4 py-3.5 transition-colors duration-150 hover:border-signal"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-card font-medium text-ink">
                        {agent.name}
                      </span>
                      <StatusBadge status={agent.status} />
                    </div>
                    <p className="mt-1.5 text-ui text-muted">{agent.summary}</p>
                    <p className="mt-2 text-meta text-muted">
                      {agentMeta(agent)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-body text-ink">
              Nothing in the catalogue covers this yet.{" "}
              <Link href="/agents" className="text-signal hover:underline">
                See all agents
              </Link>
              .
            </p>
          )}
        </section>
      )}

      <section className="mt-8 border-t border-rule pt-4">
        <h2 className="text-micro tracking-[0.06em] text-muted uppercase">
          Have someone contact me
        </h2>

        {sent ? (
          <div ref={doneRef} tabIndex={-1} className="mt-3 focus:outline-none">
            <p className="text-body text-ink">
              Nothing was sent. This form is not connected yet — see the README
              for the address it will post to.
            </p>
          </div>
        ) : (
          <>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen(true)}
              className="mt-3 rounded-sm bg-signal px-3.5 py-2 text-ui text-surface transition-opacity duration-150 hover:opacity-90"
            >
              Have someone contact me
            </button>
          </>
        )}

        <Modal
          open={open}
          onClose={close}
          title={sent ? "Not sent" : "Have someone contact me"}
        >
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: this is the one form still not wired to the Worker in
              // `worker/`. It needs a `kind` of its own there -- the payload is
              // a described task, not a demo request against a named agent --
              // and until it has one, submitting must keep saying plainly that
              // nothing was sent.
              setSent(true);
              close();
            }}
          >
            <div>
              <label htmlFor="req-name" className="text-ui text-muted">
                Your name
              </label>
              <TextField id="req-name" name="name" required className="mt-1" />
            </div>

            <div>
              <label htmlFor="req-email" className="text-ui text-muted">
                Work email
              </label>
              <TextField
                id="req-email"
                name="email"
                type="email"
                required
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="req-task" className="text-ui text-muted">
                The work
              </label>
              <textarea
                id="req-task"
                name="task"
                rows={3}
                defaultValue={task}
                className="mt-1 w-full rounded-sm border border-rule bg-surface px-2.5 py-1.5 text-ui text-ink transition-colors duration-150 hover:border-muted focus:border-signal"
              />
            </div>

            <div className="mt-1 flex items-center gap-4">
              <button
                type="submit"
                className="rounded-sm bg-signal px-3.5 py-2 text-ui text-surface transition-opacity duration-150 hover:opacity-90"
              >
                Have someone contact me
              </button>
              <button
                type="button"
                onClick={close}
                className="text-ui text-muted transition-colors duration-150 hover:text-signal"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      </section>
    </div>
  );
}
