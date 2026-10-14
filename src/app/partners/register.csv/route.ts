import {
  formatMonth,
  isPending,
  partnerAgents,
  partnersByName,
  ROLE_LABEL,
  type Partner,
} from "@/data/partners";

/**
 * The register as a spreadsheet, for a procurement file.
 *
 * Only entries with a certificate number are written. On the page an
 * incomplete entry sits under a line saying it is not an appointment; in a
 * downloaded file that line is gone, and a row with a name and no number would
 * read as certified to whoever opens it months later. Agents are resolved
 * against the catalogue for the same reason the card does it.
 *
 * Built once, like the sitemap: under `output: 'export'` this becomes a static
 * `/partners/register.csv`.
 */
export const dynamic = "force-static";

const COLUMNS: [string, (p: Partner) => string | undefined][] = [
  ["Company", (p) => p.name.trim()],
  ["Roles", (p) => p.roles.map((r) => ROLE_LABEL[r]).join("; ")],
  ["Certificate", (p) => p.certificate],
  ["Certified since", (p) => p.certifiedSince && formatMonth(p.certifiedSince)],
  ["Valid to", (p) => p.certifiedUntil && formatMonth(p.certifiedUntil)],
  ["Certified on", (p) => partnerAgents(p).map((a) => a.name).join("; ")],
  ["Province", (p) => p.coverage],
  ["Town", (p) => p.town],
  ["Focus", (p) => p.focus],
  ["Contact", (p) => p.contactName],
  ["Email", (p) => p.email],
  ["Phone", (p) => p.phone],
  ["Website", (p) => p.website],
];

/** RFC 4180 quoting, plus a guard so a cell can never run as a formula. */
function cell(value: string | undefined): string {
  let text = value ?? "";
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function GET() {
  const rows = [
    COLUMNS.map(([heading]) => heading),
    ...partnersByName
      .filter((p) => !isPending(p))
      .map((p) => COLUMNS.map(([, read]) => read(p))),
  ];
  const csv = rows.map((row) => row.map(cell).join(",")).join("\r\n");

  // The byte-order mark is what makes Excel read the file as UTF-8.
  return new Response(`﻿${csv}\r\n`, {
    headers: { "Content-Type": "text/csv; charset=utf-8" },
  });
}
