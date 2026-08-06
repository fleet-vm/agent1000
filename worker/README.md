# Form endpoint

A single Cloudflare Worker. It takes the three forms on the site, validates
them, and forwards each to an inbox. Nothing else.

| `kind` | From | Goes to |
|---|---|---|
| `demo` (default) | "Request a demo" on an agent page | `SALES_TO` |
| `task` | "Have someone contact me" on `/request` | `SALES_TO` |
| `reseller` | The application on `/resellers` | `PARTNERS_TO`, or `SALES_TO` if unset |

`task` is its own kind rather than a demo request with a blank agent: it carries
a described task and the agents the matcher put in front of the sender, and "no
close match" is a different reply to "three agents nearly cover this".

It exists instead of a hosted form service because the payload is personal
information about named officials at public institutions. Keeping it inside
infrastructure Agent1000 controls means there is no third-party operator to
contract with or disclose under POPIA.

**It stores nothing.** No database, no KV, no submission log. The request is
validated, forwarded, and forgotten. Data that is never stored cannot be
breached, and it keeps the retention answer short.

## What you need before deploying

1. **A Cloudflare account.** Free tier is enough — this is well inside the
   100,000 requests/day limit.
2. **A Resend account and a verified sending domain.** Resend needs
   `agent1000.co.za` verified with SPF and DKIM records before it will send as
   `noreply@agent1000.co.za`. Any provider works — swapping means changing the
   one `fetch` call at the bottom of `src/index.ts` — but the *domain
   verification* step is unavoidable with any of them. Mail sent from an
   unverified domain lands in spam, which for a sales inbox is the same as not
   sending it.

## Deploy

```bash
cd worker
npm install
npx wrangler login                        # opens a browser, one time
npx wrangler secret put RESEND_API_KEY    # paste the key; never goes in git
npx wrangler deploy
```

`deploy` prints the Worker URL, e.g.
`https://agent1000-demo-request.<subdomain>.workers.dev`.

## Then wire the site to it

In the site root (not here), put that URL in `.env.local`:

```
NEXT_PUBLIC_FORM_ENDPOINT=https://agent1000-demo-request.<subdomain>.workers.dev
```

and add the site's own origin to `ALLOWED_ORIGINS` in `wrangler.toml`, then
`npx wrangler deploy` again. Both steps are needed: without the endpoint the
form falls back to `mailto:`, and without the origin the Worker returns 403.

`NEXT_PUBLIC_*` is inlined at **build** time, so the site needs a rebuild after
setting it — a dev server restart is not enough.

## Configuration

| Name | Where | What |
|---|---|---|
| `RESEND_API_KEY` | `wrangler secret put` | Resend API key. Never in `wrangler.toml`. |
| `SALES_TO` | `wrangler.toml` `[vars]` | Where demo requests land. |
| `PARTNERS_TO` | `wrangler.toml` `[vars]` | Where reseller applications land. Optional; falls back to `SALES_TO`. |
| `MAIL_FROM` | `wrangler.toml` `[vars]` | Verified sender on the sending domain. |
| `ALLOWED_ORIGINS` | `wrangler.toml` `[vars]` | Comma-separated origins allowed to post. No wildcard — this is what stops another site posting through the endpoint in a visitor's name. |

`reply_to` is set to the requester's address, so sales can reply directly.

## What protects it

- **Origin allowlist.** A request from an origin not on the list gets 403, and
  the CORS header is never reflected back.
- **Honeypots.** A field no human sees: `company` on the demo form, `address` on
  the task form, `fax` on the reseller form. One name per form, so a bot that
  learns one has not learned the others — and `company` could not be reused
  anyway, being a real required field on an application. Filled in, the Worker
  answers `200 {ok:true}` and sends nothing, so a bot learns nothing from the
  response.
- **Size and length caps.** 8 KB body, per-field limits, newlines stripped from
  single-line fields.
- **Plain text mail.** Nothing typed by a visitor is ever interpreted as markup.

Not yet in place, in rough order of when it will matter:

- **Rate limiting.** The honeypot stops naive bots; it does not stop anyone who
  looks at the form once. Cloudflare's rate limiting rules on the Worker route
  are the fix, and are configured in the dashboard rather than in code.
- **Turnstile.** Worth adding if the honeypot starts leaking through. It needs a
  site key and a widget in the form, so it is a change on both sides.

## What this Worker deliberately does not do

It delivers a reseller application. It does not vet one, and it cannot track
one, because it stores nothing — there is no record of who applied, what stage
they are at, or who approved them. That is the right trade for a public form
endpoint, but it means **the vetting and approval process has to live
somewhere else**: a CRM, a shared partners mailbox worked as a queue, or a small
internal tool. Until it does, an application is an email in an inbox and the
state of it is whatever someone remembers.

Two things to decide before the programme is real:

- **Where an application's state lives** once it arrives, and who owns moving it
  along.
- **Whether approved resellers get listed publicly.** If they do, that is a page
  on this site fed by a data file, and it needs a removal process for when an
  appointment ends — a stale reseller listing is worse than no listing.

## Local development

```bash
npx wrangler dev          # http://localhost:8787
```

Then point `NEXT_PUBLIC_FORM_ENDPOINT=http://localhost:8787` at it and rebuild
the site. `wrangler dev` uses the real Resend key once it is set as a secret, so
mail actually sends — use a test address in `SALES_TO` while working on it.
