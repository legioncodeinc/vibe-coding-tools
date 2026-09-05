# Resolve webhook signature verification errors

- URL: https://docs.stripe.com/webhooks/signature
- Fetched: 2026-08-14
- Source type: official docs
- Component: Webhooks, raw body / signature debugging

## Facts

- The single most common cause of "Webhook signature verification failed": using the wrong endpoint secret. Dashboard-managed endpoints and `stripe listen` CLI sessions each hand out a *different* `whsec_*` value even against the same URL, mixing them up produces this exact error.
- Second most common cause (confirmed independently by the community sources below): reading the body as JSON before passing it to `constructEvent`. Stripe verifies against the exact raw bytes; any re-serialization (JSON.parse then re-stringify, or a framework auto-parsing the body) changes whitespace/key order enough to break the signature even though the data is "the same."
- Debugging checklist from the doc: confirm you're passing `requestBody` (raw string), `signature` (the `Stripe-Signature` header), and `endpointSecret` in that order to `constructEvent`; print the `endpointSecret` your code is actually using and diff it against the Dashboard/CLI value character for character.
- Framework-specific gotcha called out explicitly: with Express + `stripe-node`, `app.use(express.json())` must be registered after the webhook route's raw-body middleware, not globally before it, or the body is already parsed (and thus mutated) by the time your handler tries to verify it.
