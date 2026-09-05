# Resolve webhook signature verification errors - Stripe Docs

- URL: https://docs.stripe.com/webhooks/signature
- Fetched: 2026-08-14
- Source type: official vendor documentation (Stripe)
- Component: Stripe webhook intake (`+server.ts` route handling `/webhooks/stripe`)

## Content

- Verification requires three parameters to `constructEvent()` (or the language-equivalent verifier): the RAW request body string exactly as sent, the `Stripe-Signature` header value, and the endpoint's signing secret (`whsec_...`).
- The endpoint secret is PER-ENDPOINT, not per-account: a secret from a Dashboard-managed endpoint must not be used to verify events forwarded by the Stripe CLI (`stripe listen`) or vice versa - each surfaces its own distinct `whsec_` value. Test mode and live mode also have separate secrets, and staging/production endpoints have separate secrets from each other.
- The request body passed to the verifier must be the EXACT UTF-8 byte string Stripe sent, with no reordering, re-encoding, whitespace normalization, or JSON re-serialization - "Some frameworks might edit the request body by doing things like adding or removing whitespace, reordering the key-value pairs, converting the string to JSON, or changing the encoding. All of these cases lead to a failed signature verification." This means any framework-level body parser that runs before the webhook route (a global JSON body-parser middleware, for example) will break verification if it consumes/mutates the body before the raw bytes reach the verifier.
- For Express specifically, official guidance: `express.json()` (or any global body parser) must be registered AFTER the webhook route, not before, or it will parse the body before the signature check ever sees the raw bytes.
- Signature header structure (documented in the companion Hooksbase source, consistent with Stripe's own format description): `Stripe-Signature: t=<timestamp>,v1=<hmac>`. `t` is a Unix timestamp, `v1` is HMAC-SHA256 of `"{timestamp}.{raw_body}"` keyed with the endpoint secret.
