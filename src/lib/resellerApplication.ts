/**
 * Reseller applications. Same two delivery paths as a demo request -- the
 * Worker in `worker/` when `NEXT_PUBLIC_FORM_ENDPOINT` is set, a prefilled
 * `mailto:` otherwise -- see `src/lib/demoRequest.ts` for why.
 *
 * What is deliberately NOT asked for here: banking details, directors' ID
 * numbers, and tax clearance or B-BBEE certificates as attachments. Those are
 * requested after vetting, over a channel that is not a public form on a static
 * site. A form that asks a stranger for banking details is indistinguishable
 * from one that is phishing for them.
 */

import { FORM_ENDPOINT, SALES_EMAIL } from "@/lib/demoRequest";

export { FORM_ENDPOINT, SALES_EMAIL };

/** Where a reseller operates. National first: it is the common answer. */
export const COVERAGE = [
  "National",
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
] as const;

/** Codes 55 of 2022, as a supplier would already report it. */
export const BBBEE_LEVELS = [
  "Level 1",
  "Level 2",
  "Level 3",
  "Level 4",
  "Level 5",
  "Level 6",
  "Level 7",
  "Level 8",
  "Non-compliant",
  "Exempted micro enterprise",
] as const;

export type ResellerApplication = {
  company: string;
  registrationNumber: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  coverage: string;
  bbbeeLevel: string;
  csdNumber: string;
  experience: string;
  interest: string;
  /** Honeypot. See `worker/src/index.ts`. */
  fax: string;
};

export const RESELLER_SUBJECT = "Reseller application";

/** Plain text, because it is read in an inbox and nowhere else. */
export function resellerBody(r: ResellerApplication): string {
  const lines = [
    `Company: ${r.company}`,
    `Registration number: ${r.registrationNumber}`,
    "",
    `Contact: ${r.contactName}`,
    `Work email: ${r.email}`,
    `Phone: ${r.phone}`,
  ];
  if (r.website.trim()) lines.push(`Website: ${r.website.trim()}`);
  lines.push("", `Operates in: ${r.coverage}`);
  if (r.bbbeeLevel) lines.push(`B-BBEE: ${r.bbbeeLevel}`);
  if (r.csdNumber.trim()) lines.push(`CSD supplier number: ${r.csdNumber.trim()}`);
  if (r.experience.trim()) {
    lines.push("", "Public-sector experience:", r.experience.trim());
  }
  if (r.interest.trim()) {
    lines.push("", "Agents they want to carry:", r.interest.trim());
  }
  return lines.join("\n");
}

export function resellerMailtoHref(r: ResellerApplication): string {
  const query = new URLSearchParams({
    subject: RESELLER_SUBJECT,
    body: resellerBody(r),
  });
  // URLSearchParams encodes spaces as '+', which mail clients render literally
  // in the subject line rather than as spaces.
  return `mailto:${SALES_EMAIL}?${query.toString().replace(/\+/g, "%20")}`;
}

/** Resolves true only on a response the Worker accepted. See postDemoRequest. */
export async function postResellerApplication(
  r: ResellerApplication,
): Promise<boolean> {
  if (!FORM_ENDPOINT) return false;
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ kind: "reseller", ...r }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
