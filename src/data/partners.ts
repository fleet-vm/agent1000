/**
 * The register of appointed partners.
 *
 * This page exists for one reason: an institution about to hand a company
 * access to its systems needs a way to check that the company is who it says it
 * is. The register is that check. Everything else on the page is in service of
 * it.
 *
 * Three rules govern what may be written here, and they are hard:
 *
 *  1. Nobody is listed who has not signed a reseller agreement. A directory
 *     that includes applicants is worse than no directory, because the whole
 *     value of it is that being on it means something.
 *  2. No client institution is ever named -- the same rule as the agent
 *     catalogue. A partner's line says what work they do, not who for.
 *  3. A partner is only ever certified on agents that exist. Certifying anyone
 *     on a `development` agent would put a claim on this page that the agent
 *     catalogue contradicts two clicks away.
 *
 * Everything below is placeholder data. See PARTNERS_ARE_PLACEHOLDER.
 */

import { getAgent, type Agent } from "@/data/agents";
import { COVERAGE } from "@/lib/resellerApplication";

/**
 * Flip to `false` in the same commit that replaces the entries below with real
 * appointed partners.
 *
 * While it is `true` the page carries a visible notice and is served
 * `noindex`, so a search engine never gets the chance to index invented
 * companies as certified ones, and nobody who lands on the page mistakes an
 * example for an appointment. It is one boolean rather than a comment because
 * a comment does not stop a deploy.
 */
export const PARTNERS_ARE_PLACEHOLDER: boolean = true;

/**
 * What a partner is appointed to do. A company can be both, and several are:
 * the roles answer different questions for a buyer -- who holds the contract,
 * and who touches the systems.
 */
export type PartnerRole = "reseller" | "integrator";

export const ROLE_LABEL: Record<PartnerRole, string> = {
  reseller: "Reseller",
  integrator: "Integrator",
};

export const ROLE_NOTE: Record<PartnerRole, string> = {
  reseller:
    "Sells and holds the agreement. Your contract is with them, and they carry first-line support.",
  integrator:
    "Connects agents to your systems. Works to your change control, alongside your own IT.",
};

/** Where a partner operates. Same list the application form uses. */
export type PartnerCoverage = (typeof COVERAGE)[number];

/**
 * An entry in the register.
 *
 * Most fields are optional, and that is deliberate: a company usually reaches
 * us as a name, a website and a person, and the rest -- territory, the agents
 * it is appointed on, a certificate number -- is settled later. An optional
 * field lets a half-known company be recorded honestly instead of completed by
 * guesswork, and the card simply leaves out what it does not have.
 *
 * `assertRegisterIsComplete` below is what stops a half-known entry reaching a
 * live register.
 */
export type Partner = {
  slug: string;
  name: string;
  roles: PartnerRole[];
  /** Printed on the certificate. What an institution quotes when it checks. */
  certificate?: string;
  /** `YYYY-MM`. When the current appointment started. */
  certifiedSince?: string;
  /** `YYYY-MM`. When it lapses unless renewed. */
  certifiedUntil?: string;
  coverage?: PartnerCoverage;
  town?: string;
  /** Agent slugs this partner is certified on. Rule 3 above applies. */
  agents: string[];
  /** One line, plain language: the work they do. Never who they do it for. */
  focus?: string;
  /** Optional: a company that has not given us one is recorded without it. */
  website?: string;
  email: string;
  /** The named person at the partner. Optional: some partners give a desk. */
  contactName?: string;
  /** As dialled locally, digits only -- `formatPhone` sets it out. */
  phone?: string;
};

/**
 * Placeholder entries.
 *
 * The companies, certificate numbers and contact details are invented, and the
 * domains are all under `example.com`, which is reserved and can never resolve
 * to a real business. Replace the array wholesale -- do not edit names in place
 * and leave a certificate number behind.
 */
export const partners: Partner[] = [
  /**
   * The first real company. Supplied 7 September 2026.
   *
   * Everything recorded here came from them. What is missing is missing on
   * purpose -- none of it is ours to assume:
   *
   *   - roles          reseller, integrator, or both
   *   - coverage/town  which province they work, and from where
   *   - agents         which agents they are appointed on
   *   - focus          one line on the work they do
   *   - certificate    the number we issue, and the dates it runs between
   *
   * Until the certificate is filled in, `assertRegisterIsComplete` refuses to
   * build a live register containing this entry.
   */
  {
    slug: "just-corporation",
    name: "Just Corporation",
    roles: [],
    agents: [],
    website: "https://just-corporation.com",
    email: "Malesela.molepo@just-corporation.com",
    contactName: "Malesela Molepo",
    phone: "0817826517",
  },
  /**
   * Supplied 10 September 2026. Appointed as an integrator; the rest of the
   * entry is missing for the same reason as the one above -- coverage, agents,
   * focus and the certificate are ours to issue or theirs to confirm, not ours
   * to invent. No website was given.
   *
   * Registered address: 375 Aventurine Street, Zambezi Manor Lifestyle Estate,
   * Derdepoort.
   */
  {
    slug: "mokaba-freight-solutions",
    name: "Mokaba Freight Solutions",
    roles: ["integrator"],
    town: "Derdepoort",
    agents: [],
    email: "info.mokabafreight@gmail.com",
    contactName: "Itumeleng Mokaba",
    phone: "0815839649",
  },
  {
    slug: "Africanetwork",
    name: "Africanetwork ",
    roles: ["reseller", "integrator"],
    certificate: "A1K-2025-0104",
    certifiedSince: "2025-04",
    certifiedUntil: "2027-04",
    coverage: "Gauteng",
    town: "Guateng",
    agents: ["vulnwatch", "sitewatch","contentdesk"],
    focus:
      "Application security and hosting work for institutions that build their own software.",
    website: "https://africanetwork.co.za",
    email: "Katlego@africanetwork.co.za",
  },
  {
    slug: "Office-Supply",
    name: "Office Supply",
    roles: ["reseller"],
    certificate: "A1K-2025-0107",
    certifiedSince: "2025-06",
    certifiedUntil: "2027-06",
    coverage: "Gauteng",
    town: "Johannesburg",
    agents: ["contentdesk","VulnWatch", "DocAgent"],
    focus:
      "Reporting and records work for local municipalities and municipal entities.",
    website: "https://officesupply.africa",
    email: "sipho@officesupply.africa",
  },
  {
    slug: "back-loggers-offices",
    name: "Back Bloggers Office",
    roles: ["reseller"],
    certificate: "A1K-2026-0112",
    certifiedSince: "2026-01",
    certifiedUntil: "2028-01",
    coverage: "Gauteng",
    town: "Pretoria",
    agents: ["ContentDesk", "PMAgent", " VulnWatch"],
    focus:
      "Data extraction and reporting pipelines, mostly in higher education.",
    website: "https://backloggersoffices.co.za",
    email: "backloggersoffices@gmail.com",
  },
  {
    slug: "koena-ohs-consultants",
    name: "Koena OHS Consultants",
    roles: ["reseller", "integrator"],
    certificate: "A1K-2025-0105",
    certifiedSince: "2025-05",
    certifiedUntil: "2027-05",
    coverage: "KwaZulu-Natal",
    town: "Durban",
    agents: ["contentdesk","vulnwatch", "recordsdesk", "sitewatch"],
    focus:
      "Website and records systems for metros and the entities they own.",
    website: "https://ntsikadigital.example.com",
    email: "partners@ntsikadigital.example.com",
  },
];

/** Alphabetical. No ranking, no featured slot: the register is not a listing. */
export const partnersByName = [...partners].sort((a, b) =>
  a.name.localeCompare(b.name, "en-ZA"),
);

/**
 * The agents a partner is certified on, resolved against the catalogue so a
 * renamed or withdrawn agent can never leave a stale claim on this page.
 */
export function partnerAgents(partner: Partner): Agent[] {
  return partner.agents
    .map(getAgent)
    .filter((agent): agent is Agent => agent !== undefined);
}

/**
 * An entry that is not yet a certified one.
 *
 * The certificate number is the test, because it is the thing an institution
 * quotes back to us: no number, no appointment to verify.
 */
export function isPending(partner: Partner): boolean {
  return !partner.certificate;
}

/**
 * Refuses to build a live register that contains an entry we cannot stand
 * behind.
 *
 * The page tells a reader that being on the list means certified. An entry
 * with no certificate number contradicts that sentence from inside the same
 * page, so this throws at build rather than letting it ship. While
 * PARTNERS_ARE_PLACEHOLDER is true nothing on the page claims to be real and
 * the check stands down.
 */
function assertRegisterIsComplete(): void {
  if (PARTNERS_ARE_PLACEHOLDER) return;

  const pending = partners.filter(isPending).map((p) => p.name);
  if (pending.length > 0) {
    throw new Error(
      `Register is live but these entries have no certificate number: ${pending.join(", ")}. ` +
        "Complete them or remove them -- /partners tells the reader that being " +
        "listed means certified.",
    );
  }
}

assertRegisterIsComplete();

/**
 * Provinces with nobody appointed in them.
 *
 * Said out loud because the alternative is worse: an institution in a province
 * with no partner should learn that here, not from a company that turns up
 * claiming the territory. A partner covering "National" clears every province.
 */
export function uncoveredProvinces(): string[] {
  if (partners.some((p) => p.coverage === "National")) return [];

  const covered = new Set(
    partners.map((p) => p.coverage).filter((c) => c !== undefined),
  );
  return COVERAGE.filter((c) => c !== "National" && !covered.has(c));
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** `0817826517` to `081 782 6517`. Anything unexpected is left as it came. */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  return /^0\d{9}$/.test(digits)
    ? `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
    : value;
}

/** `+27817826517`. What a phone dials; the printed form is for reading. */
export function telHref(value: string): string {
  const digits = value.replace(/\D/g, "");
  return /^0\d{9}$/.test(digits) ? `tel:+27${digits.slice(1)}` : `tel:${value}`;
}

/** `2026-03` to `March 2026`. Fixed table, so a build machine's locale cannot move it. */
export function formatMonth(value: string): string {
  const [year, month] = value.split("-");
  const name = MONTHS[Number(month) - 1];
  return name ? `${name} ${year}` : year;
}
