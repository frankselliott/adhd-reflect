# Email (Resend)

All transactional and marketing email goes through [Resend](https://resend.com).
Sending domain: **adhdreflect.com** (verified in Resend). Everything routes
through a single helper: `functions/api/_lib/email.js`.

> **UK/EU Article 27 representative:** deliberately deferred while subscriber
> numbers are negligible. Revisit and appoint one when UK and Irish subscribers
> reach the hundreds.

- `sendEmail(env, { to, subject, html, text, tags, idempotencyKey, headers })`
  posts to `https://api.resend.com/emails`. Never throws; returns
  `{ ok, id, error }` and logs the Resend error body on failure. Retries once
  on 429/5xx, never on other 4xx.
- `sendBatch(env, messages)` posts to `https://api.resend.com/emails/batch` in
  chunks of 100 and fails soft per chunk.

**Resend batch limits.** The batch endpoint is **atomic**: a chunk either sends
in full or not at all, so one invalid address fails the whole chunk. Batch also
does **not** support attachments or `scheduled_at`. `send-scheduled.js` guards
against this by validating each address first and, if a chunk still fails,
retrying it as individual `sendEmail()` calls (idempotency keys intact) so the
valid recipients get through.

**Sending-domain warm-up.** `adhdreflect.com` is a new sending domain in Resend
and is subject to warm-up limits of roughly **150 sends on day one**, ramping up
from there. Keep early drip/welcome volume under that until reputation builds.

Defaults: from `ADHD Reflect <hello@adhdreflect.com>`, reply-to
`hello@adhdreflect.com`. Every send includes a text part (html-only callers get
a generated plain-text fallback; we never send html alone).

## Environment variables

| Variable | Status | Used by |
|---|---|---|
| `RESEND_API_KEY` | **Required** | every email send + Resend suppression list |
| `UNSUB_SECRET` | **Required** | HMAC signing of unsubscribe links |
| `ADMIN_KEY` | Required | cron auth for `send-scheduled`, `email-health`, `email-clear` |
| `RESEND_SEGMENT_ID` | **Required** for contact sync | segment every mirrored contact is added to |
| `SENDER_API_KEY` | **Dead** — remove it | nothing (was Sender.net) |

> Cloudflare Pages secrets are **per-environment**. A value set only for
> **Preview** is not present in **Production**. If `email-health` shows
> `RESEND_API_KEY: false` on the live site, set it in the Production scope of
> the Pages project and redeploy.

## Send sites

| File | Trigger | From | Tag | Idempotent |
|---|---|---|---|---|
| `functions/api/stripe-webhook.js` | Stripe `checkout.session.completed` | ADHD Reflect &lt;hello@adhdreflect.com&gt; | `purchase` | yes (`purchase-{session.id}`) |
| `functions/api/grow/recover.js` | POST from the recover form | ADHD Reflect &lt;hello@adhdreflect.com&gt; | `recovery` | no |
| `functions/api/subscribe.js` | POST from the pattern signup | ADHD Reflect &lt;hello@adhdreflect.com&gt; | `welcome` | no |
| `functions/api/send-scheduled.js` | Daily cron (cron-job.org) | ADHD Reflect &lt;hello@adhdreflect.com&gt; | `drip` | yes (`drip-{email}-{step}`) |

`functions/api/grow/free-access.js` sends **no** email: it returns the
`accessUrl` and `src/pages/grow/redeem.astro` redirects the browser to it.
Nothing to migrate there.

## Subscriber storage: KV vs Resend

Two stores, synced **one way, KV → Resend**:

- **KV `email:<addr>`** holds the **drip schedule** (pattern, `emailsSent`,
  `nextEmailDate`) with a **60-day TTL**. It drives `send-scheduled.js` and is
  the source of truth for the drip. It is deliberately ephemeral.
- **Resend contacts** hold the **durable list**. The `pattern` custom property
  (string, no fallback — an empty pattern is a visible bug, not silent) is set
  on each contact and every contact is added to the `RESEND_SEGMENT_ID` segment.
  Contacts persist after the KV schedule expires.

`upsertContact(env, { email, pattern, unsubscribed })` in `_lib/email.js` does
the mirroring (top-level `/contacts`, segment via
`/contacts/{id}/segments/{segment_id}`). It is best-effort: it never throws and
never blocks or fails a signup. `pattern` is written only when supplied, so an
unsubscribe toggle never blanks it.

Custom properties are **nested under `properties`** on write
(`{ email, unsubscribed, properties: { pattern } }`) — a top-level `pattern`
field is silently ignored. On read, a property comes back shaped as
`{ pattern: { value, type } }`, so read `.value`, not the bare field.

- `subscribe.js` calls it after the KV write and welcome send; the response
  gains `contactSynced: true|false` alongside `welcomeSent`.
- `unsubscribe.js` sets `unsubscribed: true` on opt-out and `false` on
  resubscribe, so Broadcasts can respect it. KV remains the drip's source of
  truth.
- `/api/backfill-contacts?key=…` (GET, `ADMIN_KEY`) mirrors every existing KV
  subscriber into Resend, cursor-paginated, idempotent, safe to run repeatedly.
  Opt-outs are written as `unsubscribed: true` rather than skipped. Returns
  `{ processed, created, updated, failed, skipped }`.

## Diagnostics

`subscribe.js` reports the real welcome-send outcome instead of a blanket
success, so a silent no-send is visible. Response shape:
`{ success, pattern, welcomeSent, reason }`, where `reason` is one of:

- `sent` — welcome delivered to Resend.
- `already_subscribed` — a schedule already existed; guard fired, nothing sent
  (this is correct, not an error).
- `unsubscribed` — the address opted out; `success:false`, nothing sent.
- `email_not_configured` — `RESEND_API_KEY` is unbound, so no POST was made.
- `send_failed` — Resend rejected the send (details logged, never returned).

The quiz surfaces a quiet line to the user when `welcomeSent` is false (except
`already_subscribed`).

Admin tools (both `GET`, `ADMIN_KEY` via `?key=`):
- `/api/email-health?key=…` — booleans for which env vars and KV bindings are
  present on **this** deployment (never their values), plus the deploy commit
  SHA/branch. Use it to confirm a Production binding in one request.
- `/api/email-clear?key=…&e=<addr>` — deletes `email:<addr>` from `SEARCH_LOGS`
  so the repeat-signup guard no longer fires and the address can be retested.
  Does not touch `unsub:<addr>`, Grow access, tokens or purchases.

## Unsubscribe

Marketing sends (`welcome` and `drip`) carry a **signed** unsubscribe link so
one recipient cannot unsubscribe another. The token is the first 16 hex chars
of `HMAC-SHA256(normalised email, UNSUB_SECRET)` (`signUnsub()` in
`_lib/email.js`, `crypto.subtle`, no node imports). Both the header and the body
link use it:

- `List-Unsubscribe` header → `https://adhdreflect.com/api/unsubscribe?e=<email>&t=<token>`
  (with `List-Unsubscribe-Post: List-Unsubscribe=One-Click`).
- Human footer link → `https://adhdreflect.com/unsubscribe?e=<email>&t=<token>`.

Transactional sends (`purchase`, `recovery`, `free-access`) carry no
unsubscribe, by design, and are never affected by an unsubscribe.

**How it works**
- `functions/api/unsubscribe.js` — `POST` handles mailbox-provider one-click
  (verify token, unsubscribe, 200 empty body). `GET` is called by the page and
  returns a JSON status; `action=resubscribe` reverses it. Invalid/missing
  token → 400 with no hint about whether the address exists.
- `src/pages/unsubscribe.astro` — the human-facing page. Reads `e`/`t`. For
  unsubscribe it shows a confirm button (with the address masked as
  `f****@domain.com`) and only calls the API on click, so link scanners that
  execute JS cannot silently unsubscribe anyone. Resubscribe (a deliberate
  click on our own page) runs on load. Shows done / already done / resubscribed
  / broken, with a one-click resubscribe link on the done states. The `POST`
  one-click path in the function stays confirmation-free for mailbox providers.
- Unsubscribing writes `unsub:<email>` to the `SEARCH_LOGS` KV namespace
  (timestamped, ~5-year TTL) and adds the address to the Resend suppression
  list as a backstop. **KV is the source of truth.** `send-scheduled.js` and
  `subscribe.js` both check `unsub:<email>` and skip.
- Resubscribing deletes the KV key and removes the Resend suppression. Signing
  up again does **not** resubscribe an opted-out address; only the resubscribe
  link does.
- Routes do not collide: the page is `/unsubscribe`, the function is
  `/api/unsubscribe`.
