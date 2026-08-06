"use client";

import { useId, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/TextField";
import {
  BBBEE_LEVELS,
  COVERAGE,
  postResellerApplication,
  resellerMailtoHref,
  SALES_EMAIL,
  type ResellerApplication,
} from "@/lib/resellerApplication";

/**
 * The application form, opened in a modal from the page that explains what
 * vetting means.
 *
 * Keeping it behind a button is not only consistency with the demo request: the
 * page has a job to do before the form does. An applicant should read what they
 * are applying for -- and that it is an application, not an appointment --
 * before they start filling in registration numbers.
 *
 * The copy carries that same job throughout. Nothing here may read as though
 * submitting it appoints anyone. It is an application, it is vetted, and the
 * appointment is a signed agreement that happens elsewhere.
 */

const FIELD =
  "mt-1 w-full rounded-sm border border-rule bg-surface px-2.5 py-1.5 text-ui text-ink transition-colors duration-150 hover:border-muted focus:border-signal";

function Field({
  label,
  hint,
  optional,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  optional?: boolean;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-ui text-muted">
        {label} {optional && <span className="text-meta">(optional)</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-meta text-muted">{hint}</p>}
    </div>
  );
}

export function ResellerForm() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<"posted" | "mailto" | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  function close() {
    setOpen(false);
    // Once the application is in, the trigger is gone -- replaced by the
    // confirmation -- so focus lands there rather than at the top of the page.
    (triggerRef.current ?? doneRef.current)?.focus();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);

    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "");
    const application: ResellerApplication = {
      company: get("company"),
      registrationNumber: get("registrationNumber"),
      contactName: get("contactName"),
      email: get("email"),
      phone: get("phone"),
      website: get("website"),
      coverage: get("coverage"),
      bbbeeLevel: get("bbbeeLevel"),
      csdNumber: get("csdNumber"),
      experience: get("experience"),
      interest: get("interest"),
      fax: get("fax"),
    };

    const posted = await postResellerApplication(application);
    if (!posted) {
      // Navigating to a mailto: does not unload the page, so the confirmation
      // still renders behind the compose window.
      window.location.href = resellerMailtoHref(application);
    }
    setOutcome(posted ? "posted" : "mailto");
    setBusy(false);
  }

  /* Shared between the modal and the page: closing the modal after submitting
     must not lose the "does not appoint you" caveat, which is the whole point
     of the wording. */
  const confirmation = (
    <>
      {outcome === "posted" ? (
        <p className="text-body text-ink">
          It is with the partner team. Someone will come back to you at the
          address you gave once it has been through vetting.
        </p>
      ) : (
        <>
          <p className="text-body text-ink">
            Your mail client should have opened with the application ready to
            send to {SALES_EMAIL}. It is not sent until you send it.
          </p>
          <p className="mt-2 text-ui text-muted">
            If nothing opened, mail{" "}
            <a
              href={`mailto:${SALES_EMAIL}`}
              className="text-signal hover:underline"
            >
              {SALES_EMAIL}
            </a>{" "}
            with the same details.
          </p>
        </>
      )}
      <p className="mt-3 text-ui text-muted">
        Submitting this does not appoint you as a reseller. Nothing is agreed
        until vetting is complete and an agreement is signed.
      </p>
    </>
  );

  const title = outcome
    ? outcome === "posted"
      ? "Application received"
      : "Application ready to send"
    : "Reseller application";

  return (
    <div>
      {outcome ? (
        <div
          ref={doneRef}
          tabIndex={-1}
          className="rounded-lg border border-rule bg-surface px-5 py-4 focus:outline-none"
        >
          <h2 className="text-card font-medium text-ink">{title}</h2>
          <div className="mt-2">{confirmation}</div>
        </div>
      ) : (
        <>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-sm bg-signal px-3.5 py-2 text-ui text-surface transition-opacity duration-150 hover:opacity-90"
          >
            Apply to resell
          </button>
          <p className="mt-2 text-ui text-muted">
            It asks for your CIPC registration number, so have it to hand.
          </p>
        </>
      )}

      <Modal open={open} onClose={close} title={title} size="wide">
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
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      {/* Honeypot. Hidden from sight, from the tab order and from assistive
          technology, so only a bot filling every field it finds will touch it.
          Named `fax` because `company` is a real field on this form. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor={`${id}-fax`}>Fax</label>
        <input
          id={`${id}-fax`}
          name="fax"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <fieldset className="flex flex-col gap-3 border-0 p-0">
        <legend className="mb-1 text-micro tracking-[0.06em] text-muted uppercase">
          The company
        </legend>

        <Field label="Registered company name" htmlFor={`${id}-company`}>
          <TextField
            id={`${id}-company`}
            name="company"
            autoComplete="organization"
            required
            className="mt-1"
          />
        </Field>

        <Field
          label="Company registration number"
          hint="As it appears at CIPC, e.g. 2019/123456/07."
          htmlFor={`${id}-reg`}
        >
          <TextField
            id={`${id}-reg`}
            name="registrationNumber"
            required
            className="mt-1"
          />
        </Field>

        <Field label="Website" optional htmlFor={`${id}-website`}>
          <TextField
            id={`${id}-website`}
            name="website"
            type="url"
            inputMode="url"
            placeholder="https://"
            autoComplete="url"
            className="mt-1"
          />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-3 border-0 p-0">
        <legend className="mb-1 text-micro tracking-[0.06em] text-muted uppercase">
          Who we talk to
        </legend>

        <Field label="Contact person" htmlFor={`${id}-contact`}>
          <TextField
            id={`${id}-contact`}
            name="contactName"
            autoComplete="name"
            required
            className="mt-1"
          />
        </Field>

        <Field label="Work email" htmlFor={`${id}-email`}>
          <TextField
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1"
          />
        </Field>

        <Field label="Phone" htmlFor={`${id}-phone`}>
          <TextField
            id={`${id}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            className="mt-1"
          />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-3 border-0 p-0">
        <legend className="mb-1 text-micro tracking-[0.06em] text-muted uppercase">
          What we vet on
        </legend>

        <Field label="Where you operate" htmlFor={`${id}-coverage`}>
          <select
            id={`${id}-coverage`}
            name="coverage"
            defaultValue="National"
            className={FIELD}
          >
            {COVERAGE.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="B-BBEE level"
          optional
          hint="Self-declared here. The certificate is checked at vetting, not uploaded now."
          htmlFor={`${id}-bbbee`}
        >
          <select
            id={`${id}-bbbee`}
            name="bbbeeLevel"
            defaultValue=""
            className={FIELD}
          >
            <option value="">Select one</option>
            {BBBEE_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="CSD supplier number"
          optional
          hint="Central Supplier Database. Not required to apply, but an institution will ask for it before it can buy."
          htmlFor={`${id}-csd`}
        >
          <TextField id={`${id}-csd`} name="csdNumber" className="mt-1" />
        </Field>

        <Field
          label="Public-sector experience"
          hint="Which kinds of institution you already supply, and what you supply them. Do not name institutions that would not want to be named."
          htmlFor={`${id}-experience`}
        >
          <textarea
            id={`${id}-experience`}
            name="experience"
            rows={4}
            required
            className={FIELD}
          />
        </Field>

        <Field
          label="Which agents you want to carry, and why you"
          optional
          htmlFor={`${id}-interest`}
        >
          <textarea
            id={`${id}-interest`}
            name="interest"
            rows={3}
            className={FIELD}
          />
        </Field>
      </fieldset>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={busy}
                className="rounded-sm bg-signal px-3.5 py-2 text-ui text-surface transition-opacity duration-150 hover:opacity-90 disabled:opacity-50"
              >
                {busy ? "Sending…" : "Submit application"}
              </button>
              <button
                type="button"
                onClick={close}
                className="text-ui text-muted transition-colors duration-150 hover:text-signal"
              >
                Cancel
              </button>
              <p className="ml-auto text-meta text-muted">
                An application, not an appointment.
              </p>
            </div>

            <p className="text-meta text-muted">
              Goes to {SALES_EMAIL}. Used to vet this application and nothing
              else. We never ask for banking details or ID numbers on this form
              — if something claiming to be us does, it is not us.
            </p>
          </form>
        )}
      </Modal>
    </div>
  );
}
