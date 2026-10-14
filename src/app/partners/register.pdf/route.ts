import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage } from "pdf-lib";
import {
  formatMonth,
  formatPhone,
  isPending,
  partnerAgents,
  partnersByName,
  ROLE_LABEL,
  type Partner,
} from "@/data/partners";
import { SALES_EMAIL } from "@/lib/demoRequest";
import { url } from "@/lib/site";

/**
 * The register as a PDF, for a procurement file or a printout.
 *
 * Same rule as the CSV: only entries with a certificate number are written,
 * because the page's "this entry is not an appointment" line does not travel
 * with the file. Unlike the CSV, a PDF is read by a person, so it carries the
 * two sentences that make the list useful -- not listed means not certified,
 * and how to check a number -- and the date it was issued, so a stale copy
 * says it is stale.
 *
 * Built once at build time; under `output: 'export'` this becomes a static
 * `/partners/register.pdf`. The standard PDF fonts are used so nothing has to
 * be embedded or fetched.
 */
export const dynamic = "force-static";

// Tokens from globals.css, so the printout matches the page.
const INK = rgb(0x12 / 255, 0x12 / 255, 0x15 / 255);
const MUTED = rgb(0x5c / 255, 0x5c / 255, 0x66 / 255);
const RULE = rgb(0xe4 / 255, 0xe4 / 255, 0xe4 / 255);

// A4 portrait, in points.
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 56;
const TERM_W = 92;
const TEXT_W = PAGE_W - MARGIN * 2;

/**
 * The standard fonts only encode WinAnsi. Accents are folded to their base
 * letter and anything else unencodable becomes `?`, rather than failing the
 * build over one character in a company name.
 */
function winAnsi(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\x20-\x7e\xa0-\xff–—‘’“”•]/g, "?");
}

function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of winAnsi(text).split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (line && font.widthOfTextAtSize(next, size) > width) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function issuedOn(date: Date): string {
  const iso = date.toISOString().slice(0, 10);
  return `${Number(iso.slice(8))} ${formatMonth(iso.slice(0, 7))}`;
}

function rows(p: Partner): [string, string][] {
  const valid = [
    p.certifiedSince && `from ${formatMonth(p.certifiedSince)}`,
    p.certifiedUntil && `to ${formatMonth(p.certifiedUntil)}`,
  ]
    .filter(Boolean)
    .join(" ");
  const contact = [
    p.contactName,
    p.email,
    p.phone && formatPhone(p.phone),
    p.website?.replace(/^https?:\/\//, ""),
  ]
    .filter(Boolean)
    .join("  •  ");

  return [
    ["Certificate", p.certificate ?? ""],
    ["Valid", valid],
    ["Certified on", partnerAgents(p).map((a) => a.name).join(", ")],
    ["Contact", contact],
  ].filter(([, value]) => value) as [string, string][];
}

export async function GET() {
  const doc = await PDFDocument.create();
  doc.setTitle("Agent1000 certified resellers and integrators");
  doc.setAuthor("Agent1000");

  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const mono = await doc.embedFont(StandardFonts.Courier);

  const certified = partnersByName.filter((p) => !isPending(p));
  const issued = issuedOn(new Date());

  let page: PDFPage = doc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;

  function newPage() {
    page = doc.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - MARGIN;
  }

  function text(
    value: string,
    { x = MARGIN, size = 10, font = regular, color = INK, width = TEXT_W, leading = 1.4 } = {},
  ) {
    for (const line of wrap(value, font, size, width)) {
      page.drawText(line, { x, y: y - size, size, font, color });
      y -= size * leading;
    }
  }

  function rule() {
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_W - MARGIN, y },
      thickness: 0.5,
      color: RULE,
    });
  }

  // Heading and the two sentences that make the list worth having.
  text("Agent1000", { size: 9, font: bold, color: MUTED });
  y -= 6;
  text("Certified resellers and integrators", { size: 20, font: bold, leading: 1.2 });
  y -= 4;
  text(`Issued ${issued}  •  ${certified.length} ${certified.length === 1 ? "company" : "companies"}`, {
    size: 9,
    color: MUTED,
  });
  y -= 12;
  text(
    "If a company is not on this list, it is not certified. Being introduced by someone, holding a proposal on our letterhead, or quoting work we have done is not certification.",
  );
  y -= 4;
  text(
    `Quote a certificate number to ${SALES_EMAIL} and we will confirm in writing that it is current and what it covers. This copy reflects the register on the date above; the current register is at ${url("/partners")}.`,
    { size: 9, color: MUTED },
  );
  y -= 14;

  for (const partner of certified) {
    const body = rows(partner);
    const focus = partner.focus ? wrap(partner.focus, regular, 9, TEXT_W).length : 0;
    // Rough height so an entry is never split across a page break.
    const height = 70 + focus * 13 + body.length * 16;
    if (y - height < MARGIN) newPage();

    rule();
    y -= 12;

    const roles = partner.roles.map((r) => ROLE_LABEL[r]).join(" • ").toUpperCase();
    const top = y;
    text(partner.name.trim(), { size: 12, font: bold, width: TEXT_W - 140 });
    if (roles) {
      const w = regular.widthOfTextAtSize(roles, 7.5);
      page.drawText(roles, { x: PAGE_W - MARGIN - w, y: top - 10, size: 7.5, font: regular, color: MUTED });
    }

    const where = [partner.town, partner.coverage].filter(Boolean).join(" • ");
    if (where) text(where, { size: 9, color: MUTED });
    if (partner.focus) text(partner.focus, { size: 9, color: MUTED });
    y -= 6;

    for (const [label, value] of body) {
      const rowTop = y;
      page.drawText(label.toUpperCase(), { x: MARGIN, y: y - 8, size: 7, font: regular, color: MUTED });
      text(value, {
        x: MARGIN + TERM_W,
        size: 9,
        font: label === "Certificate" ? mono : regular,
        width: TEXT_W - TERM_W,
      });
      y = Math.min(y, rowTop - 13) - 3;
    }
    y -= 10;
  }

  // Page numbers last, once the count is known.
  const pages = doc.getPages();
  pages.forEach((p, i) => {
    const label = `Agent1000 certified partners  •  issued ${issued}  •  page ${i + 1} of ${pages.length}`;
    p.drawText(label, { x: MARGIN, y: MARGIN / 2, size: 7.5, font: regular, color: MUTED });
  });

  const bytes = await doc.save();
  return new Response(bytes as BodyInit, {
    headers: { "Content-Type": "application/pdf" },
  });
}
