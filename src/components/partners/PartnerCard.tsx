import Link from "next/link";
import {
  formatMonth,
  partnerAgents,
  ROLE_LABEL,
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
 */

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

  return (
    <li className="flex flex-col rounded-lg border border-rule bg-surface px-4 py-3.5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-card font-medium text-ink">{partner.name}</h3>
        <span className="text-micro tracking-[0.06em] text-muted-ink uppercase whitespace-nowrap">
          {partner.roles.map((role) => ROLE_LABEL[role]).join(" · ")}
        </span>
      </div>

      <p className="mt-1 text-meta text-muted">
        {partner.town} · {partner.coverage}
      </p>

      <p className="mt-2 text-ui text-muted">{partner.focus}</p>

      <dl className="mt-3 flex flex-col gap-2 border-t border-rule pt-3">
        <Row label="Certified on">
          {agents.map((agent, i) => (
            <span key={agent.slug}>
              {i > 0 && <span className="text-muted">, </span>}
              <Link
                href={`/agents/${agent.slug}`}
                className="underline decoration-rule underline-offset-2 transition-colors duration-150 hover:text-signal hover:decoration-signal"
              >
                {agent.name}
              </Link>
            </span>
          ))}
        </Row>

        <Row label="Certificate">
          <span className="tabular font-mono whitespace-nowrap">
            {partner.certificate}
          </span>
          <span className="text-muted">
            {" "}
            · valid to {formatMonth(partner.certifiedUntil)}
          </span>
        </Row>

        <Row label="Contact">
          <a
            href={partner.website}
            rel="noopener nofollow"
            className="underline decoration-rule underline-offset-2 transition-colors duration-150 hover:text-signal hover:decoration-signal"
          >
            {partner.website.replace(/^https?:\/\//, "")}
          </a>
          <span className="text-muted"> · </span>
          <a
            href={`mailto:${partner.email}`}
            className="underline decoration-rule underline-offset-2 transition-colors duration-150 hover:text-signal hover:decoration-signal"
          >
            {partner.email}
          </a>
        </Row>
      </dl>
    </li>
  );
}
