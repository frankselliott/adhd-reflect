# Email (Resend)

All transactional and marketing email goes through [Resend](https://resend.com).
Sending domain: **adhdreflect.com** (verified in Resend). Everything routes
through a single helper: `functions/api/_lib/email.js`.

- `sendEmail(env, { to, subject, html, text, tags, idempotencyKey, headers })`
  posts to `https://api.resend.com/emails`. Never throws; returns
  `{ ok, id, error }` and logs the Resend error body on failure. Retries once
  on 429/5xx, never on other 4xx.
- `sendBatch(env, messages)` posts to `https://api.resend.com/emails/batch` in
  chunks of 100 and fails soft per chunk.

Defaults: from `ADHD Reflect <hello@adhdreflect.com>`, reply-to
`hello@adhdreflect.com`. Every send includes a text part (html-only callers get
a generated plain-text fallback; we never send html alone).

## Environment variables

| Variable | Status | Used by |
|---|---|---|
| `RESEND_API_KEY` | **Required** | every email send + Resend suppression list |
| `UNSUB_SECRET` | **Required** | HMAC signing of unsubscribe links |
| `ADMIN_KEY` | Required | cron auth for `send-scheduled` |
| `SENDER_API_KEY` | **Dead** — remove it | nothing (was Sender.net) |

## Send sites

| File | Trigger | From | Tag | Idempotent |
|---|---|---|---|---|
| `functions/api/stripe-webhook.js` | Stripe `checkout.session.completed` | ADHD Reflect &lt;hello@adhdreflect.com&gt; | `purchase` | no |
| `functions/api/grow/recover.js` | POST from the recover form | ADHD Reflect &lt;hello@adhdreflect.com&gt; | `recovery` | no |
| `functions/api/subscribe.js` | POST from the pattern signup | ADHD Reflect &lt;hello@adhdreflect.com&gt; | `welcome` | no |
| `functions/api/send-scheduled.js` | Daily cron (cron-job.org) | ADHD Reflect &lt;hello@adhdreflect.com&gt; | `drip` | yes (`drip-{email}-{step}`) |

`functions/api/grow/free-access.js` sends **no** email: it returns the
`accessUrl` and `src/pages/grow/redeem.astro` redirects the browser to it.
Nothing to migrate there.

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
- `src/pages/unsubscribe.astro` — the human-facing page. Reads `e`/`t`, calls
  the API, shows done / already done / broken, with a one-click resubscribe
  link on the done states.
- Unsubscribing writes `unsub:<email>` to the `SEARCH_LOGS` KV namespace
  (timestamped, ~5-year TTL) and adds the address to the Resend suppression
  list as a backstop. **KV is the source of truth.** `send-scheduled.js` and
  `subscribe.js` both check `unsub:<email>` and skip.
- Resubscribing deletes the KV key and removes the Resend suppression. Signing
  up again does **not** resubscribe an opted-out address; only the resubscribe
  link does.
- Routes do not collide: the page is `/unsubscribe`, the function is
  `/api/unsubscribe`.
