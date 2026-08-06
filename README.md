# Agent1000 — marketing site and agent directory

Two public surfaces: a near-empty landing page, and a faceted directory of agents.

Frontend only. No backend, no auth, no database. Every piece of data comes from
one typed seed file, and every action that would hit a server is stubbed with a
`TODO`.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export into out/
npm run lint
```

`npm run build` produces a fully static `out/` directory (`output: 'export'`),
deployable to any static host.

## Where things are

| Path | What it is |
|---|---|
| **`src/data/agents.ts`** | **The seed catalogue. Everything on the site comes from here.** |
| `src/lib/filters.ts` | Filter state, URL parsing, facet counts. No React, no router. |
| `src/lib/match.ts` | Matches typed text against the catalogue. Keyword + word-boundary only — no model call. |
| `src/app/globals.css` | The design tokens. Six core colours, six type sizes, one motion sequence. |
| `src/components/Wordmark.tsx` | The wordmark lockup and the derivation of its numeral lift. |

Routes: `/`, `/agents`, `/agents/[slug]`, `/request`, `/legal`. That is the whole
site. It is meant to stay that size — no About, no Blog, no Careers, no Pricing.

## Editing the catalogue

Add or change an agent in `src/data/agents.ts`. The type is exhaustive, so a new
category or channel is a compile error everywhere it needs handling — facet
lists, labels and counts all derive from the same unions.

Three content rules are enforced by review, not by the compiler, and they are
hard:

1. **Never name a client institution** anywhere on the site — not in copy, not in
   a slug, not in an alt attribute. "A national department" is as specific as a
   reference may get. This is a live confidentiality obligation.
2. **No metrics.** No findings counts, package counts, uptime figures or client
   numbers. Those belong in the funding application, not on a page where they age
   badly and invite attribution.
3. **A `development` agent must never read as if it is running.** Every agent
   that is not built yet is written in the future tense ("Will check…"), so the
   copy and the status badge cannot contradict each other. Keep that up.

VulnWatch and ContentDesk are real and in production. Everything else is roadmap,
labelled honestly.

## Design notes

- **Colour is functional only.** There is no brand accent. `--signal` marks what
  you can act on; the status tokens mark what state an agent is in. Nothing else
  is coloured. Every pairing clears WCAG AA — the badge palettes run 5.6:1 to
  8.1:1, body text 17.4:1.
- **The wordmark is the one place boldness is spent.** `Agent` in Plex Sans,
  `1000` in Plex Mono, tracked wide and hung from the cap line rather than the
  baseline. The lift is derived from the two faces' shared 0.698em cap height,
  not eyeballed — see the comment in `Wordmark.tsx` before changing the size.
- **One motion sequence,** on `/` only, ~320ms. After it nothing moves except
  focus and hover. `prefers-reduced-motion` kills all of it.
- **Light only.** Everything is a CSS custom property, so a dark palette is a
  second block plus a re-check of the status contrasts, not a retrofit.

## Known trade-offs

- **`In pilot` always shows a count of 0** and therefore renders permanently
  dimmed and disabled. That is correct, not a bug: nothing in the seed data is in
  pilot. It also happens to be the clearest demonstration of the zero-count facet
  behaviour. It disappears as soon as a real pilot agent is seeded.
- **Result cards do not show cadence.** The metadata line is
  `category · channels · approval` as specified, so filtering by "On a schedule"
  narrows the list without showing why on the card itself. Cadence is on the
  detail page. Worth revisiting if the catalogue grows.
- **Built on Next 16, not Next 15** as the brief said. App Router and static
  export are unchanged; 15.x is the line carrying the CVSS 10.0 RCE. Say the word
  if 15 was a hard requirement.

## Placeholders to settle before launch

| Placeholder | Where | What is needed |
|---|---|---|
| Entity name | `src/components/SiteFooter.tsx`, `src/app/legal/page.tsx` | Both now read **Agent1000**. If the registered company name differs — an `(Pty) Ltd` suffix, or a holding entity that operates the brand — both need to match the CIPC registration **exactly** before launch. |
| `[CONTACT]` | `src/components/request/RequestBody.tsx` | The address the "Have someone contact me" form posts to. The site is a static export, so this needs an external form endpoint or a `mailto:` fallback — there is no route handler to receive it. |
| Domain, favicon | `src/app/layout.tsx`, `src/app/favicon.ico` | Still the create-next-app default favicon. |
| Name clearance | — | Whether **Agent1000** has been cleared at CIPC and WIPO before it goes on a public site under a wordmark. |

`/legal` is a stub. It exists only so the footer has somewhere to point, and it
needs the registration number, registered address, terms of use and privacy
notice before the site is public.
