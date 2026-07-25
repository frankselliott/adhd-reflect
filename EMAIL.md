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
| `RESEND_API_KEY` | **Required** | every email send |
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

## Unsubscribe — action needed

Marketing sends (`welcome` and `drip`) set `List-Unsubscribe` /
`List-Unsubscribe-Post` headers and a body link pointing to
`https://adhdreflect.com/unsubscribe?e=<email>`. **That route does not exist
yet** — it needs to be built (a Pages Function that removes the
`email:<address>` key from the `SEARCH_LOGS` KV namespace and shows a
confirmation). Transactional sends (`purchase`, `recovery`) carry no
unsubscribe, by design.
