import {
  agents,
  CATEGORY_LABEL,
  type Agent,
  type AgentCategory,
} from "@/data/agents";

/**
 * Matches a typed description of work against the catalogue.
 *
 * Substring and keyword matching over the seed data. There is no model call
 * here and there is not meant to be one: the hero has to answer while someone
 * is still typing, and a wrong-but-instant suggestion is worse than none.
 */

const KEYWORDS: Record<AgentCategory, string[]> = {
  security: [
    "security",
    "secure",
    "patch",
    "patching",
    "vulnerability",
    "vulnerabilities",
    "cve",
    "update",
    "updates",
    "certificate",
    "certificates",
    "downtime",
    "website down",
    "hacked",
    "breach",
  ],
  publishing: [
    "publish",
    "publishing",
    "website",
    "web page",
    "page",
    "news",
    "media",
    "content",
    "post",
    "article",
    "notice",
    "upload",
  ],
  documents: [
    "document",
    "documents",
    "record",
    "records",
    "file",
    "filing",
    "registry",
    "correspondence",
    "letter",
    "letters",
    "minutes",
    "meeting",
    "archive",
    "scan",
  ],
  data: [
    "report",
    "reporting",
    "reports",
    "data",
    "spreadsheet",
    "dashboard",
    "statistics",
    "stats",
    "monthly",
    "quarterly",
    "figures",
  ],
  servicedesk: [
    "helpdesk",
    "help desk",
    "service desk",
    "support",
    "ticket",
    "tickets",
    "queries",
    "query",
    "enquiries",
    "triage",
    "inbox",
  ],
  compliance: [
    "compliance",
    "compliant",
    "tender",
    "tenders",
    "bid",
    "procurement",
    "supply chain",
    "policy",
    "policies",
    "regulation",
    "regulations",
    "audit",
    "legislation",
  ],
};

/**
 * Matches a token at the start of a word, so "report" still finds "reporting"
 * but "our" no longer finds "sources". Raw substring matching pulled unrelated
 * agents into the suggestions on short, common tokens.
 */
function startsWord(haystack: string, token: string): boolean {
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}`).test(haystack);
}

function score(agent: Agent, query: string, tokens: string[]): number {
  const haystack = {
    name: agent.name.toLowerCase(),
    summary: agent.summary.toLowerCase(),
    category: CATEGORY_LABEL[agent.category].toLowerCase(),
    connects: agent.connectsTo.join(" ").toLowerCase(),
  };

  let total = 0;

  // Whole-phrase keyword hits first: "service desk" should not be read as two
  // unrelated words.
  for (const keyword of KEYWORDS[agent.category]) {
    if (keyword.includes(" ") && query.includes(keyword)) total += 5;
  }

  for (const token of tokens) {
    // Names are matched loosely on purpose: the catalogue is full of compounds,
    // and "desk" should find ContentDesk.
    if (haystack.name.includes(token)) total += 6;
    if (startsWord(haystack.category, token)) total += 3;
    if (startsWord(haystack.summary, token)) total += 2;
    if (startsWord(haystack.connects, token)) total += 2;
    if (KEYWORDS[agent.category].some((k) => k === token || k.startsWith(token)))
      total += 4;
  }

  return total;
}

export function matchAgents(query: string, limit = 3): Agent[] {
  const normalised = query.trim().toLowerCase();
  if (normalised.length < 2) return [];

  const tokens = normalised
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3 || /^[a-z]{2}$/.test(t));
  if (tokens.length === 0) return [];

  return agents
    .map((agent, index) => ({
      agent,
      total: score(agent, normalised, tokens),
      index,
    }))
    .filter((r) => r.total > 0)
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      // Ties go to what is actually running, then to catalogue order.
      const aLive = a.agent.status === "production" ? 0 : 1;
      const bLive = b.agent.status === "production" ? 0 : 1;
      if (aLive !== bLive) return aLive - bLive;
      return a.index - b.index;
    })
    .slice(0, limit)
    .map((r) => r.agent);
}
