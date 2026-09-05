# Stripe Webhooks End-to-End: Signature Verification, Idempotency, Replay, Dead-Letter - Appycodes

- URL: https://appycodes.dev/blog/stripe-webhooks-end-to-end-2026/
- Fetched: 2026-08-14
- Source type: vendor-independent engineering blog, published 2026-05-16
- Component: Stripe webhook intake, replay protection, idempotency

## Guarantee 1 - Signature verification is the trust boundary

- "The webhook must verify the `Stripe-Signature` header before doing anything else. Without this, anyone who guesses your endpoint URL can post forged events and trigger the same side effects (account upgrades, refund issuing) that your real handler does." This frames webhook signature verification as an authorization control, not just an integrity check - an unverified endpoint is equivalent to an unauthenticated privileged API.
- Body must reach `stripe.webhooks.constructEvent` before any JSON parser touches it (matches the raw-body requirement in the official Stripe doc). Example Express route: `express.raw({ type: 'application/json' })` on the webhook route specifically, reject with 400 if the signature header is missing or verification throws.
- Acknowledge fast, process async: Stripe's delivery timeout is described as roughly 10 seconds in this source (the official Stripe number is quoted elsewhere as up to 30s depending on integration path) - if inline processing exceeds the timeout, Stripe retries and the handler will receive and must correctly handle a duplicate.

## Guarantee 2 - Idempotency

- Stripe retries webhook deliveries with exponential backoff for up to a 3-day window if it does not receive a 2xx response; a handler must be able to receive the same `event.id` many times over that window and produce the same end state every time it's processed.
- Concrete pattern: insert `event.id` into a `processed_webhooks` table with a UNIQUE constraint on `event_id` BEFORE doing any side-effecting work. If the insert fails with a unique-violation (Postgres error code `23505`), the event was already processed - skip. This is the same idempotency-key pattern Stripe itself uses on the outbound API side.
- Two-phase pattern shown: phase 1 inserts the dedupe row (fails fast if duplicate); phase 2 runs the actual handler inside a DB transaction and updates the row's status to `done` or `failed` with an attempt counter and last error, so partial failures are distinguishable from full success and are safe to retry.

## Guarantee 3/4 - Replay and dead-letter

- Recommends building an internal admin replay endpoint that pages through Stripe's Events API for a given time window and re-enqueues each event through the SAME idempotent handler path (deleting the corresponding `processed_webhooks` row first to allow reprocessing) - this covers recovery from a bug in the handler logic itself, which is a distinct failure mode from delivery failure.
- Checklist distilled from the article: raw body is bytes when the verifier sees it; the webhook secret is per-environment and rotates without a code redeploy; a 200 is returned before processing begins (processing happens off the request path); the idempotency table has a primary-key/unique constraint on `event_id`; every handler re-fetches the authoritative resource from Stripe's API rather than trusting fields directly off the webhook payload (defense against a payload that is stale by the time it's processed, and against overly trusting client-controllable-looking fields); a replay admin endpoint exists and is rate-limited; delivery failures are monitored/alerted, not just logged.
