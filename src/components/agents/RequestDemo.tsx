"use client";

import { useId, useRef, useState } from "react";
import { INSTITUTION_LABEL, INSTITUTION_VALUES, type Agent } from "@/data/agents";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/TextField";
import {
  mailtoHref,
  postDemoRequest,
  SALES_EMAIL,
  type DemoRequest,
} from "@/lib/demoRequest";

/**
 * The last thing on an agent page: a reader who has got this far knows what the
 * agent does, what it connects to and what they would be approving, so this is
 * the first honest moment to ask for a demo.
 *
 * The form opens in a modal rather than in place. A form sitting open under
 * every agent reads as lead capture; a button reads as an offer, and opening
 * over the page keeps the agent's detail visible underneath.
 */

const FIELD =
  "mt-1 w-full rounded-sm border border-rule bg-surface px-2.5 py-1.5 text-ui text-ink transition-colors duration-150 hover:border-muted focus:border-signal";

type Outcome = "posted" | "mailto";

export function RequestDemo({ agent }: { agent: Agent }) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  function close() {
    setOpen(false);
    // Once a request is in, the trigger is gone -- it has been replaced by the
    // confirmation -- so focus lands on the section that replaced it rather
    // than falling back to the top of the document.
    (triggerRef.current ?? sectionRef.current)?.focus();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);

    const data = new FormData(e.currentTarget);
    const request: DemoRequest = {
      agentName: agent.name,
      agentSlug: agent.slug,
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      institution: String(data.get("institution") ?? ""),
      institutionType: String(data.get("institutionType") ?? ""),
      phone: String(data.get("phone") ?? ""),
      message: String(data.get("message") ?? ""),
      company: String(data.get("company") ?? ""),
    };

    const posted = await postDemoRequest(request);
    if (!posted) {
      // Navigating to a mailto: does not unload the page, so the confirmation
      // still renders behind the compose window.
      window.location.href = mailtoHref(request);
    }
    setOutcome(posted ? "posted" : "mailto");
    setBusy(false);
  }

  /* The confirmation is shared: it replaces the form inside the modal, and it
     replaces the button on the page once the modal is dismissed, so closing
     the modal never loses the "not sent until you send it" caveat. */
  const confirmation =
    outcome === "posted" ? (
      <p className="text-body text-ink">
        Your request is with {SALES_EMAIL}. Someone will reply to the address you
        gave.
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
          and mention {agent.name}.
        </p>
      </>
    );

  return (
    <section
      ref={sectionRef}
      tabIndex={-1}
      className="border-t border-rule pt-4 focus:outline-none"
    >
      {outcome ? (
        <>
          <h2 className="text-micro tracking-[0.06em] text-muted uppercase">
            Demo requested
          </h2>
          <div className="mt-2">{confirmation}</div>
        </>
      ) : (
        <>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-sm bg-signal px-3.5 py-2 text-ui text-surface transition-opacity duration-150 hover:opacity-90"
          >
            Request a demo
          </button>
          <p className="mt-2 text-ui text-muted">
            See {agent.name} run against your own systems, with nothing changed
            until you approve it.
          </p>
        </>
      )}

      <Modal
        open={open}
        onClose={close}
        title={outcome ? "Demo requested" : `Request a demo: ${agent.name}`}
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
                assistive technology, so only a bot filling every field it
                finds will touch it. The Worker drops anything that arrives
                with it set. Not `type="hidden"`: bots skip those. */}
            <div aria-hidden="true" className="hidden">
              <label htmlFor={`${id}-company`}>Company</label>
              <input
                id={`${id}-company`}
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor={`${id}-name`} className="text-ui text-muted">
                Your name
              </label>
              <TextField
                id={`${id}-name`}
                name="name"
                autoComplete="name"
                required
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor={`${id}-email`} className="text-ui text-muted">
                Work email
              </label>
              <TextField
                id={`${id}-email`}
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor={`${id}-phone`} className="text-ui text-muted">
                Phone <span className="text-meta">(optional)</span>
              </label>
              <TextField
                id={`${id}-phone`}
                name="phone"
                type="tel"
                autoComplete="tel"
                className="mt-1"
              />
            </div>

            <div>
              <label
                htmlFor={`${id}-institution`}
                className="text-ui text-muted"
              >
                Your institution
              </label>
              <TextField
                id={`${id}-institution`}
                name="institution"
                autoComplete="organization"
                required
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor={`${id}-type`} className="text-ui text-muted">
                Kind of institution
              </label>
              {/* The same classes the facet sidebar uses, so a reader picks
                  from a list they have already seen on /agents. */}
              <select
                id={`${id}-type`}
                name="institutionType"
                defaultValue={
                  agent.institutions.length === 1
                    ? INSTITUTION_LABEL[agent.institutions[0]]
                    : ""
                }
                className={FIELD}
              >
                <option value="">Select one</option>
                {INSTITUTION_VALUES.map((value) => (
                  <option key={value} value={INSTITUTION_LABEL[value]}>
                    {INSTITUTION_LABEL[value]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={`${id}-message`} className="text-ui text-muted">
                Anything we should know{" "}
                <span className="text-meta">(optional)</span>
              </label>
              <textarea
                id={`${id}-message`}
                name="message"
                rows={3}
                placeholder="The systems it would connect to, or who needs to be in the room."
                className={FIELD}
              />
            </div>

            <div className="mt-1 flex items-center gap-4">
              <button
                type="submit"
                disabled={busy}
                className="rounded-sm bg-signal px-3.5 py-2 text-ui text-surface transition-opacity duration-150 hover:opacity-90 disabled:opacity-50"
              >
                {busy ? "Sending…" : "Send to sales"}
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
              Goes to {SALES_EMAIL}. Used to answer you about {agent.name},
              nothing else.
            </p>
          </form>
        )}
      </Modal>
    </section>
  );
}
