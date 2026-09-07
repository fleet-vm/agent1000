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

export type Partner = {
  slug: string;
  name: string;
  roles: PartnerRole[];
  /** Printed on the certificate. What an institution quotes when it checks. */
  certificate: string;
  /** `YYYY-MM`. When the current appointment started. */
  certifiedSince: string;
  /** `YYYY-MM`. When it lapses unless renewed. */
  certifiedUntil: string;
  coverage: PartnerCoverage;
  town: string;
  /** Agent slugs this partner is certified on. Rule 3 above applies. */
  agents: string[];
  /** One line, plain language: the work they do. Never who they do it for. */
  focus: string;
  website: string;
  email: string;
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
  {
    slug: "aloe-ridge-technologies",
    name: "Aloe Ridge Technologies",
    roles: ["integrator"],
    certificate: "A1K-2025-0104",
    certifiedSince: "2025-04",
    certifiedUntil: "2027-04",
    coverage: "Western Cape",
    town: "Cape Town",
    agents: ["vulnwatch", "sitewatch"],
    focus:
      "Application security and hosting work for institutions that build their own software.",
    website: "https://aloeridge.example.com",
    email: "partners@aloeridge.example.com",
  },
  {
    slug: "highveld-public-systems",
    name: "Highveld Public Systems",
    roles: ["reseller", "integrator"],
    certificate: "A1K-2025-0101",
    certifiedSince: "2025-02",
    certifiedUntil: "2027-02",
    coverage: "Gauteng",
    town: "Pretoria",
    agents: ["vulnwatch", "contentdesk", "recordsdesk", "reportpack"],
    focus:
      "Long-running support contracts with national departments and their entities.",
    website: "https://highveldsystems.example.com",
    email: "hello@highveldsystems.example.com",
  },
  {
    slug: "kopano-systems-group",
    name: "Kopano Systems Group",
    roles: ["reseller"],
    certificate: "A1K-2025-0107",
    certifiedSince: "2025-06",
    certifiedUntil: "2027-06",
    coverage: "Free State",
    town: "Bloemfontein",
    agents: ["contentdesk", "reportpack"],
    focus:
      "Reporting and records work for local municipalities and municipal entities.",
    website: "https://kopanosystems.example.com",
    email: "info@kopanosystems.example.com",
  },
  {
    slug: "northfields-data-works",
    name: "Northfields Data Works",
    roles: ["integrator"],
    certificate: "A1K-2026-0112",
    certifiedSince: "2026-01",
    certifiedUntil: "2028-01",
    coverage: "North West",
    town: "Potchefstroom",
    agents: ["reportpack"],
    focus:
      "Data extraction and reporting pipelines, mostly in higher education.",
    website: "https://northfieldsdata.example.com",
    email: "contact@northfieldsdata.example.com",
  },
  {
    slug: "ntsika-digital",
    name: "Ntsika Digital",
    roles: ["reseller", "integrator"],
    certificate: "A1K-2025-0105",
    certifiedSince: "2025-05",
    certifiedUntil: "2027-05",
    coverage: "KwaZulu-Natal",
    town: "Durban",
    agents: ["contentdesk", "recordsdesk", "sitewatch"],
    focus:
      "Website and records systems for metros and the entities they own.",
    website: "https://ntsikadigital.example.com",
    email: "partners@ntsikadigital.example.com",
  },
  {
    slug: "sandstone-integration",
    name: "Sandstone Integration",
    roles: ["integrator"],
    certificate: "A1K-2026-0114",
    certifiedSince: "2026-03",
    certifiedUntil: "2028-03",
    coverage: "Limpopo",
    town: "Polokwane",
    agents: ["recordsdesk"],
    focus:
      "Document and records migrations for provincial departments.",
    website: "https://sandstoneintegration.example.com",
    email: "hello@sandstoneintegration.example.com",
  },
  {
    slug: "meridian-public-sector",
    name: "Meridian Public Sector Solutions",
    roles: ["reseller"],
    certificate: "A1K-2025-0109",
    certifiedSince: "2025-09",
    certifiedUntil: "2027-09",
    coverage: "Gauteng",
    town: "Johannesburg",
    agents: ["vulnwatch", "contentdesk", "reportpack", "sitewatch"],
    focus:
      "Supply and support for schedule 2 and 3 entities on transversal contracts.",
    website: "https://meridianpublic.example.com",
    email: "sales@meridianpublic.example.com",
  },
  {
    slug: "zwelethu-technology-partners",
    name: "Zwelethu Technology Partners",
    roles: ["reseller", "integrator"],
    certificate: "A1K-2026-0111",
    certifiedSince: "2026-01",
    certifiedUntil: "2028-01",
    coverage: "Eastern Cape",
    town: "Gqeberha",
    agents: ["contentdesk", "recordsdesk"],
    focus:
      "Service desk and publishing work for district and local municipalities.",
    website: "https://zwelethutech.example.com",
    email: "info@zwelethutech.example.com",
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
 * Provinces with nobody appointed in them.
 *
 * Said out loud because the alternative is worse: an institution in a province
 * with no partner should learn that here, not from a company that turns up
 * claiming the territory. A partner covering "National" clears every province.
 */
export function uncoveredProvinces(): string[] {
  if (partners.some((p) => p.coverage === "National")) return [];

  const covered = new Set(partners.map((p) => p.coverage));
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

/** `2026-03` to `March 2026`. Fixed table, so a build machine's locale cannot move it. */
export function formatMonth(value: string): string {
  const [year, month] = value.split("-");
  const name = MONTHS[Number(month) - 1];
  return name ? `${name} ${year}` : year;
}
