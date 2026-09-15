/**
 * Demo requests, and the one awkward fact about them: this site is a static
 * export (`output: 'export'`), so there is no route handler and nothing here
 * can send an email itself. Delivery to sales has to happen somewhere else.
 *
 * Two paths, in order of preference:
 *
 *  1. `NEXT_PUBLIC_FORM_ENDPOINT` is set to the demo request Worker in
 *     `worker/`, which forwards to SALES_EMAIL. The request posts in the
 *     background and the visitor never leaves the page. This is what should be
 *     configured before launch -- see `worker/README.md`.
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
  /**
   * Honeypot. Rendered hidden and never filled in by a person, so anything in
   * it means a bot. The Worker drops those silently -- see `worker/src/index.ts`.
   */
  company: string;
};

export function demoSubject(r: DemoRequest): string {
  return `Demo request: ${r.agentName}`;
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
      // The field names the Worker validates. The destination address is not
      // sent: it lives in the Worker's config, so a forged post cannot redirect
      // a submission somewhere else.
      body: JSON.stringify({
        // The Worker handles more than one kind of submission; this is what
        // tells the two apart.
        kind: "demo",
        agent: r.agentName,
        agentSlug: r.agentSlug,
        name: r.name,
        email: r.email,
        phone: r.phone,
        institution: r.institution,
        institutionType: r.institutionType,
        message: r.message,
        company: r.company,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
