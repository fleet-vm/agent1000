"use client";

import { useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { agentMeta } from "@/data/agents";
import { matchAgents } from "@/lib/match";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TextField } from "@/components/ui/TextField";
import {
  postTaskRequest,
  SALES_EMAIL,
  taskMailtoHref,
  type TaskRequest,
} from "@/lib/taskRequest";

export function RequestBody() {
  const id = useId();
  const searchParams = useSearchParams();
  const task = (searchParams.get("q") ?? "").trim();

  const matches = useMemo(() => matchAgents(task, 3), [task]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<"posted" | "mailto" | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  function close() {
    setOpen(false);
    (triggerRef.current ?? doneRef.current)?.focus();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);

    const data = new FormData(e.currentTarget);
    const request: TaskRequest = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      task: String(data.get("task") ?? ""),
      // What the matcher actually put in front of them. Sent because the reply
      // depends on it, and they cannot be asked afterwards what they saw.
      matches: matches.map((a) => a.name).join(", "),
      address: String(data.get("address") ?? ""),
    };

    const posted = await postTaskRequest(request);
    if (!posted) {
      // Navigating to a mailto: does not unload the page, so the confirmation
      // still renders behind the compose window.
      window.location.href = taskMailtoHref(request);
    }
    setOutcome(posted ? "posted" : "mailto");
    setBusy(false);
  }

  /* Shared between the modal and the page, so dismissing the modal never loses
     the "not sent until you send it" caveat the mailto path depends on. */
  const confirmation =
    outcome === "posted" ? (
      <p className="text-body text-ink">
        Your request is with {SALES_EMAIL}. Someone will reply to the address
        you gave.
      </p>
    ) : (
      <>
        <p className="text-body text-ink">
          Your mail client should have opened with the request ready to send to{" "}
          {SALES_EMAIL}. It is not sent until you send it.
        </p>
        <p className="mt-2 text-ui text-muted">
          If nothing opened, mail{" "}
          <a
            href={`mailto:${SALES_EMAIL}`}
            className="text-signal hover:underline"
          >
            {SALES_EMAIL}
          </a>{" "}
          and describe the work.
        </p>
      </>
    );

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

        {outcome ? (
          <div ref={doneRef} tabIndex={-1} className="mt-3 focus:outline-none">
            {confirmation}
          </div>
        ) : (
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            className="mt-3 rounded-sm bg-signal px-3.5 py-2 text-ui text-surface transition-opacity duration-150 hover:opacity-90"
          >
            Have someone contact me
          </button>
        )}

        <Modal
          open={open}
          onClose={close}
          title={
            outcome
              ? outcome === "posted"
                ? "Request received"
                : "Request ready to send"
              : "Have someone contact me"
          }
        >
          {outcome ? (
            <>
              {confirmation}
              <button
                type="button"
                onClick={close}
                className="mt-4 rounded-sm border border-rule bg-surface px-3 py-1.5 text-ui text-ink transition-colors duration-150 hover:border-signal"
              >
                Close
              </button>
            </>
          ) : (
            <form className="flex flex-col gap-3" onSubmit={onSubmit}>
              {/* Honeypot. Hidden from sight, from the tab order and from
                assistive technology. Named `address` because `company` and
                `fax` are the demo and reseller forms' honeypots -- one name per
                form, so a bot that learns one has not learned the others. */}
              <div aria-hidden="true" className="hidden">
                <label htmlFor={`${id}-address`}>Address</label>
                <input
                  id={`${id}-address`}
                  name="address"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="req-name" className="text-ui text-muted">
                  Your name
                </label>
                <TextField
                  id="req-name"
                  name="name"
                  required
                  className="mt-1"
                />
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
                  disabled={busy}
                  className="rounded-sm bg-signal px-3.5 py-2 text-ui text-surface transition-opacity duration-150 hover:opacity-90 disabled:opacity-50"
                >
                  {busy ? "Sending…" : "Have someone contact me"}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="text-ui text-muted transition-colors duration-150 hover:text-signal"
                >
                  Cancel
                </button>
              </div>

              <p className="text-meta text-muted">
                Goes to {SALES_EMAIL}, with the agents shown above. Used to
                answer you and nothing else.
              </p>
            </form>
          )}
        </Modal>
      </section>
    </div>
  );
}
