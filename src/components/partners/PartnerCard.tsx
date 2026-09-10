import Link from "next/link";
import {
  formatMonth,
  formatPhone,
  isPending,
  partnerAgents,
  ROLE_LABEL,
  telHref,
  type Partner,
} from "@/data/partners";

/**
 * One entry in the register.
 *
 * The card carries no colour. Status colour on this site means what state an
 * agent is in, and a second coloured object with a different meaning would
 * teach a reader that the palette does not mean anything in particular. The
 * roles are a label, so they are set as one.
 *
 * The certificate number is the load-bearing line: it is what an institution
 * quotes when it writes to check, so it is set in the tabular mono face and
 * never wraps mid-number.
 *
 * Every row is dropped when the data behind it is missing, and a card with no
 * certificate number says so in place of it. A register that pads an
 * incomplete entry out with plausible-looking detail is worth less than one
 * that shows the gap.
 */

const LINK =
  "underline decoration-rule underline-offset-2 transition-colors duration-150 hover:text-signal hover:decoration-signal";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
      <dt className="text-micro tracking-[0.06em] text-muted uppercase sm:w-[92px] sm:shrink-0 sm:pt-[3px]">
        {label}
      </dt>
      <dd className="text-meta text-ink">{children}</dd>
    </div>
  );
}

export function PartnerCard({ partner }: { partner: Partner }) {
  const agents = partnerAgents(partner);
  const where = [partner.town, partner.coverage].filter(Boolean).join(" · ");

  return (
    <li className="flex flex-col rounded-lg border border-rule bg-surface px-4 py-3.5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-card font-medium text-ink">{partner.name}</h3>
        {partner.roles.length > 0 && (
          <span className="text-micro tracking-[0.06em] text-muted-ink uppercase whitespace-nowrap">
            {partner.roles.map((role) => ROLE_LABEL[role]).join(" · ")}
          </span>
        )}
      </div>

      {where && <p className="mt-1 text-meta text-muted">{where}</p>}

      {partner.focus && <p className="mt-2 text-ui text-muted">{partner.focus}</p>}

      <dl className="mt-3 flex flex-col gap-2 border-t border-rule pt-3">
        {agents.length > 0 && (
          <Row label="Certified on">
            {agents.map((agent, i) => (
              <span key={agent.slug}>
                {i > 0 && <span className="text-muted">, </span>}
                <Link href={`/agents/${agent.slug}`} className={LINK}>
                  {agent.name}
                </Link>
              </span>
            ))}
          </Row>
        )}

        <Row label="Certificate">
          {isPending(partner) ? (
            <span className="text-muted">
              Not yet issued. This entry is incomplete and is not an
              appointment.
            </span>
          ) : (
            <>
              <span className="tabular font-mono whitespace-nowrap">
                {partner.certificate}
              </span>
              {partner.certifiedUntil && (
                <span className="text-muted">
                  {" "}
                  · valid to {formatMonth(partner.certifiedUntil)}
                </span>
              )}
            </>
          )}
        </Row>

        <Row label="Contact">
          {partner.contactName && (
            <span className="block text-ink">{partner.contactName}</span>
          )}
          {partner.website && (
            <>
              <a href={partner.website} rel="noopener nofollow" className={LINK}>
                {partner.website.replace(/^https?:\/\//, "")}
              </a>
              <span className="text-muted"> · </span>
            </>
          )}
          <a href={`mailto:${partner.email}`} className={LINK}>
            {partner.email}
          </a>
          {partner.phone && (
            <>
              <span className="text-muted"> · </span>
              <a
                href={telHref(partner.phone)}
                className={`${LINK} whitespace-nowrap`}
              >
                {formatPhone(partner.phone)}
              </a>
            </>
          )}
        </Row>
      </dl>
    </li>
  );
}
