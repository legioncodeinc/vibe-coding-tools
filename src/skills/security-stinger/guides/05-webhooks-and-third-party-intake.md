# 05. Webhooks and third-party intake

Grounded in [references/research/distilled-security.md §6-8](../references/research/distilled-security.md).

## Stripe

**Raw body verification.** The verifier (`stripe.webhooks.constructEvent`) needs the EXACT raw UTF-8 bytes Stripe sent - any body-parser that runs before the webhook route, or any framework layer that re-serializes/re-orders/re-encodes the body, breaks the signature check. In Express specifically, the documented fix is registering `express.json()` AFTER the webhook route, not before; in SvelteKit terms, this means reading `await request.text()` in the webhook's own `+server.ts` before any shared body-parsing logic touches it. [raw/security--stripe--webhook-signature-verification.md]

**Per-endpoint secrets.** `whsec_...` is per-ENDPOINT, not per-account or per-project - a secret from a Dashboard-managed endpoint is distinct from the CLI's `stripe listen` secret, and test/live and staging/production each carry their own. Verify this repo's webhook handler is reading the secret that actually matches the endpoint it's serving, per environment.

**Trust framing.** Verification is an authorization control, not just an integrity check - "anyone who guesses your endpoint URL can post forged events and trigger the same side effects (account upgrades, refund issuing) that your real handler does" without it. An unverified Stripe webhook endpoint is equivalent to an unauthenticated privileged API and is a Critical finding. [raw/security--stripe--webhooks-idempotency-replay-guide.md]

**Idempotency.** Stripe retries any non-2xx response for up to 3 days with exponential backoff, so the SAME `event.id` will arrive multiple times under normal operation, not just as an edge case. Insert `event.id` into a table with a UNIQUE constraint BEFORE any side-effecting work; treat a unique-violation as "already processed, skip." Acknowledge with 2xx fast, then process asynchronously - do not do the real work inline before responding, or a slow handler can itself trigger the duplicate-delivery path it's supposed to guard against.

**Replay.** A handler bug (not a delivery failure) needs its own recovery path - an internal admin endpoint that pages Stripe's Events API for a time window and re-enqueues through the SAME idempotent handler, after clearing the corresponding dedupe rows. This is distinct from Stripe's own delivery retries and should be rate-limited.

## GoHighLevel

**Signature verification.** Two headers exist: `X-GHL-Signature` (Ed25519, current - prefer whenever present) and `X-WH-Signature` (RSA-SHA256, legacy, deprecated 2026-09-01). After the deprecation date, only the Ed25519 header is sent - a handler still only checking the legacy header will start failing verification (or, worse, silently accept unsigned/unverifiable requests if the fallback logic treats "no legacy header" as "skip verification" rather than "reject"). Verify against the RAW payload bytes; re-serializing parsed JSON before verification invalidates the signature, the same class of mistake documented for Stripe. [raw/security--gohighlevel--webhook-signature-verification.md]

**Reliability contract shapes the error-handling design.** GHL retries any non-2xx (including timeouts) up to 12 times with exponential backoff and jitter, and its own guidance is to return 2xx even for internal processing failures, reserving non-2xx for genuine delivery/availability problems. This means idempotency and error handling must happen INSIDE the handler after deciding the HTTP response, not by using status codes to signal application-level failure back to GHL - track/alert on failures internally instead.

**Circuit breaker.** GHL evaluates each subscribed URL roughly every 3 days (only for URLs above 10,000 webhooks in that window); two consecutive sub-90%-success-rate checks pause delivery entirely until events are manually re-enabled from the marketplace dashboard. Confirm someone actually monitors the warning email - a silent pause looks identical to "no new leads" from inside the app, which is an operational risk worth flagging even though it's not itself a vulnerability.

**Duplicate handling.** Store processed `webhookId` values and check before processing, same pattern as Stripe's `event.id` dedupe.

## SSRF risk from webhook payload data

Neither Stripe's nor GoHighLevel's own documentation covers SSRF, because in both cases the webhook DESTINATION URL is developer-configured, not attacker-supplied. The SSRF risk in this integration direction lives on this app's OWN code: if any handler makes a server-side outbound fetch to a URL that originated FROM a webhook payload field (a GHL contact's "avatar URL," an "attachment URL," or similar), that fetch is a standard SSRF vector per OWASP A01:2025 (SSRF is folded into Broken Access Control for 2025) and needs the same allowlisting / no-internal-address-resolution treatment as any other user-influenced outbound request. This is a reasoned application of general SSRF principles to the shape of this integration, not a fact stated by GHL or Stripe's own docs - flag it as such if it comes up in a report. [raw/security--gohighlevel--webhook-signature-verification.md] [raw/security--owasp--top10-2025-list.md]

## Payload validation

Beyond signature verification, validate the parsed payload shape before acting on it (expected fields present, expected types) - a valid signature only proves the sender was Stripe or GoHighLevel, not that the payload matches what the handler code assumes about its structure. Malformed-but-validly-signed payloads (a legitimate but unexpected event type, a field the handler doesn't expect to be null) should fail safely rather than throwing an unhandled exception mid-transaction.
