/**
 * The agent catalogue. This file is the site's only data source; there is no
 * backend, no database and no API.
 *
 * Three content rules govern everything written here, and they are hard:
 *
 *  1. No client institution is ever named. Not in copy, not in an alt
 *     attribute, not in a slug. "A national department" is the most specific a
 *     reference may be. This is a live confidentiality obligation.
 *  2. No metrics. No findings counts, package counts, uptime figures or client
 *     numbers anywhere on the public site.
 *  3. A `development` agent must never read as though it is running. Every
 *     agent that is not yet built is written in the future tense, so the copy
 *     and the status badge cannot contradict each other.
 *
 * VulnWatch and ContentDesk are real and in production. Everything else is the
 * roadmap, labelled honestly.
 */

export type AgentCategory =
  | "security"
  | "publishing"
  | "documents"
  | "data"
  | "servicedesk"
  | "compliance";

export type AgentChannel = "whatsapp" | "email" | "console";
export type AgentCadence = "scheduled" | "on-request";
export type AgentApproval = "per-action" | "standing";
export type AgentStatus = "production" | "pilot" | "available" | "development";

/**
 * The kind of public institution an agent is for, following the statutory
 * classes a South African institution already knows itself by -- PFMA
 * schedules, the MFMA, Chapter 9. A reader should recognise their own
 * institution in this list without having to translate.
 *
 * This is a class, never an instance: naming a type is allowed, naming a
 * client is not (see rule 1 above).
 */
export type AgentInstitution =
  | "national-department"
  | "provincial-department"
  | "national-entity"
  | "provincial-entity"
  | "government-business-enterprise"
  | "constitutional-institution"
  | "metro"
  | "district-municipality"
  | "local-municipality"
  | "municipal-entity"
  | "higher-education"
  | "science-council"
  | "seta";

export type Agent = {
  slug: string;
  name: string;
  category: AgentCategory;
  summary: string; // one line, plain language, what it does for a person
  institutions: AgentInstitution[]; // where the work this agent does exists
  channels: AgentChannel[];
  cadence: AgentCadence;
  approval: AgentApproval;
  status: AgentStatus;
  connectsTo: string[]; // e.g. 'Code repositories', 'Website CMS'
  approves: string; // what a human signs off, in one sentence
};

export const CATEGORY_LABEL: Record<AgentCategory, string> = {
  security: "Security and patching",
  publishing: "Publishing and content",
  documents: "Documents and records",
  data: "Data and reporting",
  servicedesk: "Service desk",
  compliance: "Compliance",
};

export const INSTITUTION_LABEL: Record<AgentInstitution, string> = {
  "national-department": "National department",
  "provincial-department": "Provincial department",
  "national-entity": "National public entity",
  "provincial-entity": "Provincial public entity",
  "government-business-enterprise": "Government business enterprise",
  "constitutional-institution": "Constitutional institution",
  metro: "Metropolitan municipality",
  "district-municipality": "District municipality",
  "local-municipality": "Local municipality",
  "municipal-entity": "Municipal entity",
  "higher-education": "Higher education institution",
  "science-council": "Science council",
  seta: "SETA",
};

/**
 * What each class covers, in the terms the sector uses. Shown as the hover
 * title on the facet: a reader who is unsure whether "national public entity"
 * means them gets the schedule reference without leaving the page.
 */
export const INSTITUTION_NOTE: Record<AgentInstitution, string> = {
  "national-department": "The 30-odd national departments",
  "provincial-department": "Provincial equivalents across the nine provinces",
  "national-entity": "PFMA Schedule 3A and 3B",
  "provincial-entity": "PFMA Schedule 3C and 3D",
  "government-business-enterprise": "PFMA Schedule 2 — the major SOEs",
  "constitutional-institution": "Chapter 9 bodies and legislatures",
  metro: "The eight metros",
  "district-municipality": "The 44 districts",
  "local-municipality": "The 205 locals",
  "municipal-entity": "MFMA-governed entities owned by municipalities",
  "higher-education": "Universities and TVET colleges",
  "science-council": "CSIR, HSRC, MRC and the rest",
  seta: "The 21 sector education and training authorities",
};

/**
 * Sidebar grouping. Thirteen checkboxes in one undifferentiated column is a
 * wall; under four familiar headings it is a list a reader can find themselves
 * in at a glance. Order is the order of the type above.
 */
export const INSTITUTION_TIERS: Array<{
  label: string;
  values: AgentInstitution[];
}> = [
  {
    label: "National",
    values: [
      "national-department",
      "national-entity",
      "government-business-enterprise",
      "constitutional-institution",
    ],
  },
  {
    label: "Provincial",
    values: ["provincial-department", "provincial-entity"],
  },
  {
    label: "Local government",
    values: [
      "metro",
      "district-municipality",
      "local-municipality",
      "municipal-entity",
    ],
  },
  {
    label: "Education, science and skills",
    values: ["higher-education", "science-council", "seta"],
  },
];

/** Every class, in declaration order -- the flat list the filters work over. */
export const INSTITUTION_VALUES = INSTITUTION_TIERS.flatMap((t) => t.values);

export const CHANNEL_LABEL: Record<AgentChannel, string> = {
  whatsapp: "WhatsApp",
  email: "Email",
  console: "Web console",
};

export const CADENCE_LABEL: Record<AgentCadence, string> = {
  scheduled: "On a schedule",
  "on-request": "On request",
};

export const APPROVAL_LABEL: Record<AgentApproval, string> = {
  "per-action": "Every action approved",
  standing: "Approve once, then runs",
};

/**
 * A shorthand for the agents whose work exists in every class of institution.
 * Most of it does: every institution has a website, a registry, a reporting
 * cycle, a bid committee and a set of regulations it answers to. `institutions`
 * is listed explicitly per agent only where a workflow genuinely is not
 * universal, and the narrowing is a claim about the work, not about who may buy.
 */
const EVERY_INSTITUTION = INSTITUTION_VALUES;

export const agents: Agent[] = [
  {
    slug: "vulnwatch",
    name: "VulnWatch",
    category: "security",
    summary:
      "Checks the software behind an institution's custom applications every day and reports what needs patching, most urgent first.",
    // Needs an institution that commissions custom software of its own; the
    // smaller municipalities largely run bought-in systems.
    institutions: [
      "national-department",
      "national-entity",
      "government-business-enterprise",
      "constitutional-institution",
      "provincial-department",
      "provincial-entity",
      "metro",
      "municipal-entity",
      "higher-education",
      "science-council",
      "seta",
    ],
    channels: ["email", "whatsapp"],
    cadence: "scheduled",
    approval: "standing",
    status: "production",
    connectsTo: ["Code repositories", "Dependency registries"],
    approves:
      "Standing approval to scan and report; an administrator approves each change before anything is patched.",
  },
  {
    slug: "contentdesk",
    name: "ContentDesk",
    category: "publishing",
    summary:
      "Turns an emailed request into a web page, and holds it until the officer who asked for it approves the preview.",
    institutions: EVERY_INSTITUTION,
    channels: ["email", "whatsapp"],
    cadence: "on-request",
    approval: "per-action",
    status: "production",
    connectsTo: ["Website CMS"],
    approves:
      "The requesting officer approves the preview; nothing goes live until they reply.",
  },
  {
    slug: "recordsdesk",
    name: "RecordsDesk",
    category: "documents",
    summary:
      "Files incoming correspondence against the right case record and tells the registry clerk what it filed.",
    institutions: EVERY_INSTITUTION,
    channels: ["email", "console"],
    cadence: "on-request",
    approval: "per-action",
    status: "available",
    connectsTo: ["Document management system", "Shared mailboxes"],
    approves:
      "A registry clerk confirms the case record before anything is filed against it.",
  },
  {
    slug: "reportpack",
    name: "ReportPack",
    category: "data",
    summary:
      "Assembles the same monthly reporting pack from the same sources each month and sends it to the responsible manager to sign off.",
    institutions: EVERY_INSTITUTION,
    channels: ["email", "console"],
    cadence: "scheduled",
    approval: "standing",
    status: "available",
    connectsTo: ["Reporting database", "Spreadsheet templates"],
    approves:
      "The responsible manager signs off the pack; the agent assembles it and never submits it.",
  },
  {
    slug: "sitewatch",
    name: "SiteWatch",
    category: "security",
    summary:
      "Watches an institution's public websites for downtime, expiring certificates and changed pages, and says which one broke.",
    institutions: EVERY_INSTITUTION,
    channels: ["email", "whatsapp"],
    cadence: "scheduled",
    approval: "standing",
    status: "available",
    connectsTo: ["Public websites", "Certificate authorities"],
    approves:
      "Standing approval to watch and report; an administrator approves any change to a site.",
  },
  {
    slug: "tendercheck",
    name: "TenderCheck",
    category: "compliance",
    summary:
      "Will check a tender pack for missing mandatory documents before it reaches the bid committee.",
    institutions: EVERY_INSTITUTION,
    channels: ["email", "console"],
    cadence: "on-request",
    approval: "per-action",
    status: "development",
    connectsTo: ["Document management system", "Supply chain mailbox"],
    approves:
      "A supply chain officer will review every flag before it is put to a bidder.",
  },
  {
    slug: "desktriage",
    name: "DeskTriage",
    category: "servicedesk",
    summary:
      "Will read incoming service desk mail, sort it by what it is about, and draft the first reply for an agent to send.",
    // Assumes a standing desk carrying public or learner volume; the smaller
    // oversight bodies and councils handle correspondence by hand.
    institutions: [
      "national-department",
      "national-entity",
      "government-business-enterprise",
      "provincial-department",
      "provincial-entity",
      "metro",
      "district-municipality",
      "local-municipality",
      "municipal-entity",
      "higher-education",
      "seta",
    ],
    channels: ["whatsapp", "email", "console"],
    cadence: "on-request",
    approval: "per-action",
    status: "development",
    connectsTo: ["Service desk system", "Shared mailboxes"],
    approves:
      "A service desk agent will send every reply; the agent will draft and never send.",
  },
  {
    slug: "policywatch",
    name: "PolicyWatch",
    category: "compliance",
    summary:
      "Will track changes to the regulations an institution reports against and tell the compliance officer what changed.",
    institutions: EVERY_INSTITUTION,
    channels: ["email"],
    cadence: "scheduled",
    approval: "standing",
    status: "development",
    connectsTo: ["Government gazette feeds"],
    approves:
      "The compliance officer will decide what action a change requires.",
  },
  {
    slug: "minutedesk",
    name: "MinuteDesk",
    category: "documents",
    summary:
      "Will turn a meeting recording into minutes in the institution's own format, for the secretariat to correct and circulate.",
    institutions: EVERY_INSTITUTION,
    channels: ["email", "console"],
    cadence: "on-request",
    approval: "per-action",
    status: "development",
    connectsTo: ["Meeting recordings", "Document templates"],
    approves:
      "The secretariat will approve the minutes before they are circulated.",
  },
];

export function getAgent(slug: string): Agent | undefined {
  return agents.find((a) => a.slug === slug);
}

/** The metadata line under an agent name, used identically on both surfaces. */
export function agentMeta(agent: Agent): string {
  return [
    CATEGORY_LABEL[agent.category],
    agent.channels.map((c) => CHANNEL_LABEL[c]).join(", "),
    APPROVAL_LABEL[agent.approval],
  ].join(" · ");
}
