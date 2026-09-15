# Agent1000 — marketing site, agent directory and blog

Three public surfaces: a landing page, a faceted directory of agents, and a blog.

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
| `src/app/globals.css` | The design tokens. One accent, eight type sizes, two typefaces, one motion sequence. |
| `src/components/Wordmark.tsx` | The wordmark lockup and the derivation of its numeral lift. |
| `src/components/SiteNav.tsx` | The tabs. Active tab from the pathname; the small-screen sheet. |
| `src/components/StepTabs.tsx` | The product frame on `/` and the four tabs under it — Ask, Connect, Approve, Repeat. Replays the leave-request thread from `threads.ts`. |
| **`src/data/posts.ts`** | **The blog register.** One entry per post; the body is the MDX file with the same slug under `src/content/blog/`. |
| `src/mdx-components.tsx` | How a post's markdown renders. Every element is styled here, so a post carries no classes of its own. |
| `src/lib/demoRequest.ts` | The demo request payload, and the `mailto:` fallback for when no endpoint is configured. |
| `src/lib/taskRequest.ts` | The same, for "have someone contact me" on `/request`. |
| `src/lib/resellerApplication.ts` | The same, for reseller applications. Notes what is deliberately not asked for. |
| `src/data/partners.ts` | The register of appointed partners behind `/partners`, and the `PARTNERS_ARE_PLACEHOLDER` flag that keeps it out of the index until it holds real ones. |
| `src/lib/site.ts` | The one place the site knows its own origin. Canonicals, Open Graph, sitemap and robots all read it. |
| `src/app/sitemap.ts`, `src/app/robots.ts` | Generated from the seed file, so adding an agent adds its URL. |
| `src/components/JsonLd.tsx` | Structured data. Every claim restates something visible on the page — no ratings, no prices, no invented counts. |
| [`worker/`](worker/README.md) | The one piece of backend: a Cloudflare Worker that forwards both forms to an inbox. Deployed separately from the site. |

Routes: `/`, `/agents`, `/agents/[slug]`, `/use-cases`, `/blog`, `/blog/[slug]`,
`/request`, `/resellers`, `/partners`, `/legal`.
That is the whole site. It is meant to stay that size — no About, no Careers,
no Pricing.

The site itself stays a static export. `worker/` is a separate deploy target and
the only server-side code in the repo; it exists because a static site cannot
send mail, and because the alternative — a hosted form service — would put
personal information about named public-sector officials in a third party's
hands. It stores nothing.

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

## Writing a blog post

1. Write `src/content/blog/<slug>.mdx`. Plain markdown, GFM tables included.
   Start headings at `##` — the title in the register becomes the page's h1.
   Relative links (`/use-cases`) go through `next/link`; absolute ones open as
   plain anchors.
2. Add an entry to `src/data/posts.ts` with the same `slug`. The index, the
   post's route, the front-page teaser and the sitemap all derive from it. A
   slug that is in the register but has no file is a build error, which is the
   point.
3. `npm run build`.

The content rules above apply to posts in full. The one post shipped,
`why-every-agent-stops-for-a-person`, is a starter — it doubles as a formatting
reference — and can be replaced or deleted (remove both the file and the entry).

## Design notes

The system takes its cues from editorial product sites: a soft grey ground with
white surfaces on it, a serif for headings and a humanist sans for everything
else, one green doing one job, and a page that alternates between something to
look at and something to read.

- **One accent, one job.** The green marks what you can act on — the primary
  button, links, eyebrow labels, and the phrase in the headline that carries
  the proposition — and nothing else. It comes in two values: `--signal`
  (#3d6e3d) wherever green is text, because the fill green does not clear AA
  at small sizes on the grey ground; `--accent` (#4e814e) for button fills,
  darkening to `--signal` on hover. The status tokens mark what state an agent
  is in. Every pairing clears WCAG AA.
- **Two typefaces, two jobs.** Newsreader (serif, 500–600) carries every
  heading and is the only place the site raises its voice. Inter carries
  everything read as interface. Plex Mono survives for the wordmark numerals
  and tabular counts.
- **The wordmark is the one place boldness is spent.** `Agent` in Inter,
  `1000` in Plex Mono, tracked wide and hung from the cap line rather than the
  baseline. The lift is derived from the two faces' cap heights (0.727em and
  0.698em), not eyeballed — see the comment in `Wordmark.tsx` before changing
  the size.
- **Bands, not a column.** The front page alternates grey and white full-width
  bands, each holding one idea, so it reads as a sequence rather than a list.
  Inner pages keep a single measure.
- **One motion sequence,** on `/` only, ~320ms, plus the product frame stepping
  through its four tabs once and the recorded threads playing as you reach
  them. After that nothing moves except focus and hover.
  `prefers-reduced-motion` kills all of it.
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
| `NEXT_PUBLIC_FORM_ENDPOINT` | `.env.local`, read in `src/lib/demoRequest.ts` | The deployed URL of the Worker in [`worker/`](worker/README.md), which forwards to `sales@agent1000.co.za`. **Unset, the "Request a demo" form falls back to opening the visitor's mail client** — which sends from their address and does nothing on a machine with no mail client. Deploy the Worker and set this before launch. |
| Sending domain | Resend dashboard | `agent1000.co.za` needs SPF and DKIM verified before the Worker can send as `noreply@agent1000.co.za`. Unverified, the mail lands in spam — which for a sales inbox is the same as not sending it. |
| Reseller vetting process | Not in this repo | `/resellers` collects applications and says plainly that vetting comes before appointment. **Nothing here vets or tracks one** — the Worker stores nothing. Where an application's state lives, and who moves it along, is undecided. See [`worker/README.md`](worker/README.md). |
| Certified partner register | `src/data/partners.ts` | **Every entry is invented.** The page carries a visible notice, is served `noindex` and is left out of `sitemap.xml` while `PARTNERS_ARE_PLACEHOLDER` is `true`. Replace the array with the companies that have actually signed, then flip the flag in the same commit. Nobody goes on the register who has not signed an agreement — the whole value of the page is that being on it means something. |
| Reseller commercial terms | `src/app/resellers/page.tsx` | The page describes the process and says nothing about margin, tiers, exclusivity or territory, because those are not settled. Add them there once they are — an applicant will ask on the first call regardless. |
| `NEXT_PUBLIC_SITE_URL` | `.env.local`, read in `src/lib/site.ts` | Defaults to `https://agent1000.co.za` — **confirm that is the live domain.** Canonicals, Open Graph URLs, `sitemap.xml` and `robots.txt` all resolve against it, and a wrong value is silent: canonicals pointing at a domain that is not live tell Google to index nothing. Set it explicitly on any staging deploy. |
| Favicon | `src/app/favicon.ico` | Still the create-next-app default. |
| Search Console | — | Submit `/sitemap.xml` to Google Search Console and Bing Webmaster Tools once the domain is live. Nothing in the repo can do this step. |
| Name clearance | — | Whether **Agent1000** has been cleared at CIPC and WIPO before it goes on a public site under a wordmark. |

`/legal` is a stub. It exists only so the footer has somewhere to point, and it
needs the registration number, registered address, terms of use and privacy
notice before the site is public.
