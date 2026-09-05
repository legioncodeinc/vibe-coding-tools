# Receive Stripe events in your webhook endpoint

- URL: https://docs.stripe.com/webhooks
- Fetched: 2026-08-14
- Source type: official docs
- Component: Webhooks, canonical contract

## Facts

- Four-step canonical setup: (1) create a webhook endpoint handler that receives POST event data, (2) test locally with the Stripe CLI, (3) create a new event destination for the endpoint, (4) secure the endpoint.
- Two ways to verify a request came from Stripe: IP allowlisting (Stripe publishes a fixed list of sending IPs) and signature verification (the `Stripe-Signature` header, HMAC-SHA256). Stripe's own recommendation is signature verification via the official library's `constructEvent()`, manual verification only as a fallback.
- `constructEvent(requestBody, signature, endpointSecret)` needs three things: the raw request body string, the `Stripe-Signature` header value, and the endpoint's `whsec_*` secret. Framework middleware that parses the body to JSON before your handler runs breaks this. Stripe's own docs flag this exact Express gotcha: `express.json()` must be registered *after* the webhook route, not before, or the raw bytes are gone by the time you try to verify.
- Each webhook endpoint has its own unique signing secret; test-mode and live-mode keys on the same endpoint have different secrets; multiple endpoints each need their own secret.
- Manual verification steps (documented for when you can't use the SDK): split the `Stripe-Signature` header on `,` to get `t=<timestamp>` and one or more `v1=<hex signature>` pairs (ignore anything not `v1`, which guards against downgrade attacks); build `signed_payload = "{timestamp}.{raw_json_body}"`; compute HMAC-SHA256 of that string using the endpoint secret as key; compare to the received signature; separately check the timestamp is within your tolerance window to block replay attacks.
- Replay protection: because the timestamp is part of the signed payload, an attacker can't alter it without invalidating the signature, so a valid signature with a too-old timestamp is a genuine replay, not a forgery.
- Setting `STRIPE_WEBHOOK_SECRET` from the Stripe CLI's `stripe listen` output for local dev, and from Dashboard → Developers/Workbench → Webhooks for production, are two *different* secrets, never cross-verify CLI-forwarded events against a Dashboard-registered endpoint's secret or vice versa.
