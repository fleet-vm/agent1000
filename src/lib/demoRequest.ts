/**
 * Demo requests, and the one awkward fact about them: this site is a static
 * export (`output: 'export'`), so there is no route handler and nothing here
 * can send an email itself. Delivery to sales has to happen somewhere else.
 *
 * Two paths, in order of preference:
 *
 *  1. `NEXT_PUBLIC_FORM_ENDPOINT` is set to an external form service that
 *     forwards to SALES_EMAIL. The request posts in the background and the
 *     visitor never leaves the page. This is what should be configured before
 *     launch -- see the README.
 *  2. Nothing is configured, or the post fails. The request falls back to a
 *     prefilled `mailto:`, which opens the visitor's own mail client. It works
 *     with no infrastructure at all, but it sends from their address, not
 *     through us, and it does nothing on a machine with no mail client.
 *
 * The distinction is not cosmetic: the UI must never say "sent" when all that
 * happened is that a compose window opened.
 */

export const SALES_EMAIL = "sales@agent1000.co.za";

/**
 * Inlined at build time, so a change here needs a rebuild rather than a
 * restart. Empty string means "not configured", which is the launch blocker.
 */
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";

export type DemoRequest = {
  agentName: string;
  agentSlug: string;
  name: string;
  email: string;
  institution: string;
  institutionType: string; // the label, not the slug -- this is read by a person
  phone: string;
  message: string;
};

export function demoSubject(r: DemoRequest): string {
  return `Demo request — ${r.agentName}`;
}

/** Plain text, because it is read in an inbox and nowhere else. */
export function demoBody(r: DemoRequest): string {
  const lines = [
    `Agent: ${r.agentName} (/agents/${r.agentSlug})`,
    "",
    `Name: ${r.name}`,
    `Work email: ${r.email}`,
  ];
  if (r.phone.trim()) lines.push(`Phone: ${r.phone.trim()}`);
  if (r.institution.trim()) lines.push(`Institution: ${r.institution.trim()}`);
  if (r.institutionType) lines.push(`Kind of institution: ${r.institutionType}`);
  if (r.message.trim()) {
    lines.push("", "Notes:", r.message.trim());
  }
  return lines.join("\n");
}

export function mailtoHref(r: DemoRequest): string {
  const query = new URLSearchParams({
    subject: demoSubject(r),
    body: demoBody(r),
  });
  // URLSearchParams encodes spaces as '+', which mail clients render literally
  // in the subject line rather than as spaces.
  return `mailto:${SALES_EMAIL}?${query.toString().replace(/\+/g, "%20")}`;
}

/**
 * Posts to the configured endpoint. Resolves true only on a response the
 * service accepted; anything else -- no endpoint, network failure, 4xx -- is
 * false, and the caller falls back to `mailto:`.
 */
export async function postDemoRequest(r: DemoRequest): Promise<boolean> {
  if (!FORM_ENDPOINT) return false;
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        // `_replyto` and `_subject` are the convention Formspree, Web3Forms and
        // FormSubmit all understand, so the endpoint can be swapped without
        // touching this file. The full set is sent flat as well, for services
        // that just dump every field into the mail body.
        _replyto: r.email,
        _subject: demoSubject(r),
        to: SALES_EMAIL,
        agent: r.agentName,
        agentSlug: r.agentSlug,
        name: r.name,
        email: r.email,
        phone: r.phone,
        institution: r.institution,
        institutionType: r.institutionType,
        message: r.message,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
