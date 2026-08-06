/**
 * The form endpoint. Two kinds of submission arrive here, told apart by `kind`
 * in the body: a demo request from an agent page, and a reseller application
 * from /resellers.
 *
 * The site itself is a static export with no server, so this Worker is the only
 * thing between the browser and the inbox. It exists rather than a hosted form
 * service because the payload is personal information about named officials at
 * South African public institutions, and about the directors of companies
 * applying to resell: keeping it inside infrastructure Agent1000 controls means
 * there is no third-party operator to name, contract with, or explain under
 * POPIA.
 *
 * It holds nothing. There is no database, no KV, no log of submissions -- the
 * request is validated, forwarded, and forgotten. Data that is never stored
 * cannot be breached, and it keeps the retention answer short.
 *
 * A consequence worth stating plainly: because nothing is stored, this Worker
 * cannot track the state of a reseller application. It delivers the
 * application; the vetting and the approval that follow happen wherever that
 * process lives, which is not here. See README.md.
 *
 * Deploy with `npx wrangler deploy` from this directory.
 */

export type Env = {
  /** Resend API key. `wrangler secret put RESEND_API_KEY` -- never in wrangler.toml. */
  RESEND_API_KEY: string;
  /** Where demo requests land, e.g. sales@agent1000.co.za */
  SALES_TO: string;
  /** Where reseller applications land. Falls back to SALES_TO when unset. */
  PARTNERS_TO?: string;
  /** Verified sender on the sending domain, e.g. "Agent1000 <noreply@agent1000.co.za>" */
  MAIL_FROM: string;
  /** Comma-separated origins allowed to post here. No wildcard. */
  ALLOWED_ORIGINS: string;
};

/** A request larger than this is not a person filling in a dozen fields. */
const MAX_BODY_BYTES = 16 * 1024;

/**
 * Deliberately loose on the local part and strict about the rest. The job here
 * is not to decide what a valid address is -- only to reject anything that
 * could carry a newline into a header, or that is obviously not an address.
 */
const EMAIL = /^[^\s@,;:<>"'\\]+@[^\s@,;:<>"'\\]+\.[a-z]{2,}$/i;

function corsHeaders(origin: string | null, env: Env): Record<string, string> {
  const allowed = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean);
  // Echo the origin only when it is on the list. Reflecting an arbitrary origin
  // would let any site post through this endpoint in a visitor's name.
  if (!origin || !allowed.includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(
  body: unknown,
  status: number,
  cors: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

/** Trims, collapses newlines out of single-line fields, and caps length. */
function clean(value: unknown, max: number, singleLine = true): string {
  if (typeof value !== "string") return "";
  const flattened = singleLine ? value.replace(/[\r\n]+/g, " ") : value;
  return flattened.trim().slice(0, max);
}

type Mail = { to: string; subject: string; replyTo: string; text: string };

/** Returns the mail to send, or an error message to return as 422. */
function buildDemo(body: Record<string, unknown>, env: Env): Mail | string {
  const name = clean(body.name, 120);
  const email = clean(body.email, 254);
  const phone = clean(body.phone, 40);
  const institution = clean(body.institution, 200);
  const institutionType = clean(body.institutionType, 80);
  const agent = clean(body.agent, 80);
  const agentSlug = clean(body.agentSlug, 80);
  const message = clean(body.message, 4000, false);

  if (!name || !institution) return "Name and institution are required";
  if (!EMAIL.test(email)) return "A valid work email is required";

  const lines = [
    `Agent: ${agent || "(not given)"}${agentSlug ? ` (/agents/${agentSlug})` : ""}`,
    "",
    `Name: ${name}`,
    `Work email: ${email}`,
  ];
  if (phone) lines.push(`Phone: ${phone}`);
  lines.push(`Institution: ${institution}`);
  if (institutionType) lines.push(`Kind of institution: ${institutionType}`);
  if (message) lines.push("", "Notes:", message);

  return {
    to: env.SALES_TO,
    subject: `Demo request — ${agent || "Agent1000"}`,
    replyTo: email,
    text: lines.join("\n"),
  };
}

function buildReseller(body: Record<string, unknown>, env: Env): Mail | string {
  const company = clean(body.company, 200);
  const registrationNumber = clean(body.registrationNumber, 40);
  const contactName = clean(body.contactName, 120);
  const email = clean(body.email, 254);
  const phone = clean(body.phone, 40);
  const website = clean(body.website, 200);
  const coverage = clean(body.coverage, 80);
  const bbbeeLevel = clean(body.bbbeeLevel, 40);
  const csdNumber = clean(body.csdNumber, 40);
  const experience = clean(body.experience, 4000, false);
  const interest = clean(body.interest, 2000, false);

  if (!company || !registrationNumber) {
    return "Company name and registration number are required";
  }
  if (!contactName) return "A contact person is required";
  if (!EMAIL.test(email)) return "A valid work email is required";
  if (!phone) return "A phone number is required";

  const lines = [
    `Company: ${company}`,
    `Registration number: ${registrationNumber}`,
    "",
    `Contact: ${contactName}`,
    `Work email: ${email}`,
    `Phone: ${phone}`,
  ];
  if (website) lines.push(`Website: ${website}`);
  lines.push("", `Operates in: ${coverage || "(not given)"}`);
  if (bbbeeLevel) lines.push(`B-BBEE: ${bbbeeLevel}`);
  if (csdNumber) lines.push(`CSD supplier number: ${csdNumber}`);
  if (experience) lines.push("", "Public-sector experience:", experience);
  if (interest) lines.push("", "Agents they want to carry:", interest);
  lines.push(
    "",
    "--",
    "This is an application, not an appointment. Vet before replying with",
    "anything that reads as approval.",
  );

  return {
    // Falls back to sales when no separate partners inbox is configured, so a
    // half-finished setup loses nothing.
    to: env.PARTNERS_TO || env.SALES_TO,
    subject: `Reseller application — ${company}`,
    replyTo: email,
    text: lines.join("\n"),
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const cors = corsHeaders(origin, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, cors);
    }
    // An allowed origin produced headers; an empty object means it did not.
    if (!cors["Access-Control-Allow-Origin"]) {
      return json({ error: "Origin not allowed" }, 403, {});
    }

    const declared = Number(request.headers.get("Content-Length") ?? 0);
    if (declared > MAX_BODY_BYTES) {
      return json({ error: "Payload too large" }, 413, cors);
    }

    let body: Record<string, unknown>;
    try {
      const raw = await request.text();
      if (raw.length > MAX_BODY_BYTES) {
        return json({ error: "Payload too large" }, 413, cors);
      }
      body = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return json({ error: "Malformed body" }, 400, cors);
    }

    const kind = clean(body.kind, 20) || "demo";
    if (kind !== "demo" && kind !== "reseller") {
      return json({ error: "Unknown kind" }, 400, cors);
    }

    // Honeypots: fields no human sees and no human fills in. The two forms use
    // different names of necessity -- `company` is a real, required field on a
    // reseller application -- so the check is per kind. Answer 200 so a bot has
    // nothing to learn and no reason to retry with a different shape.
    const honeypot = kind === "reseller" ? body.fax : body.company;
    if (clean(honeypot, 200)) {
      return json({ ok: true }, 200, cors);
    }

    const built =
      kind === "reseller" ? buildReseller(body, env) : buildDemo(body, env);
    if (typeof built === "string") {
      return json({ error: built }, 422, cors);
    }

    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.MAIL_FROM,
        to: [built.to],
        // So whoever picks it up can reply straight to the applicant.
        reply_to: built.replyTo,
        subject: built.subject,
        // Plain text only. Nothing the sender typed is ever interpreted as
        // markup, which removes the whole class of injection into the mail.
        text: built.text,
      }),
    });

    if (!sent.ok) {
      // The body may carry the API key context, so it is not echoed to the
      // browser. It goes to `wrangler tail` and nowhere else.
      console.error("resend failed", sent.status, await sent.text());
      return json({ error: "Could not send. Try again." }, 502, cors);
    }

    return json({ ok: true }, 200, cors);
  },
};
