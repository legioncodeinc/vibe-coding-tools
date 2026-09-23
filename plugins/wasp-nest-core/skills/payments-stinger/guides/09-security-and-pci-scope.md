# 09, Security and PCI scope

Source: [raw/stripe--pci--compliance-scope.md], [raw/stripe--idempotency--api-requests.md], [raw/stripe--sveltekit--stripe-integration-tutorial.md], [raw/stripe--webhooks--receive-and-verify.md].

## PCI scope by integration type, the fact that justifies this skill's default

| Integration | SAQ tier | Why |
|---|---|---|
| Hosted Checkout | SAQ A | Card fields render in an iframe served from Stripe's domain |
| Elements (Payment Element, Address Element, etc.) | **SAQ A, same as hosted** | Same reasoning: card fields are iframes Stripe serves, regardless of how much of the surrounding page you control |
| Stripe.js v2 legacy pattern (card data entered into a form you host, tokenized via JS but not inside an Element iframe) | SAQ A-EP, heavier | Your own domain hosts the actual input fields |

This is the fact that makes "default to custom Elements instead of hosted Checkout" a safe recommendation: building your own checkout markup around the Payment Element does not increase PCI burden. The only way to actually increase PCI scope is to stop using Elements/Stripe.js and write raw `<input>` fields for card numbers yourself, never do that; it is out of scope for this skill entirely [raw/stripe--pci--compliance-scope.md].

## What never touches your server

Card numbers, CVCs, and full card details never reach your backend, your logs, or even your own JavaScript execution context, Stripe.js tokenizes inside its own iframe. Your server only ever sees a `client_secret`, a `payment_method` ID, or a `customer` ID, never raw card data.

## Secret keys never leave the server

- `STRIPE_SECRET_KEY` (`sk_*`) and `STRIPE_WEBHOOK_SECRET` (`whsec_*`) live only in `$env/static/private`-backed server code, conventionally `src/lib/server/stripe.ts`. SvelteKit blocks importing anything under `src/lib/server/` into client bundles at the module-resolution level, a framework-enforced guard, not just a naming convention [raw/stripe--sveltekit--stripe-integration-tutorial.md].
- Only the publishable key (`pk_*`) is safe client-side, exposed via a `PUBLIC_`-prefixed env var. Full checklist: `references/env-var-checklist.md`.
- Never appear in: client bundles, committed env files, logs (even debug logs), CI artifacts, screenshots, Slack messages.

## Always load Stripe.js from js.stripe.com

Never bundle or self-host a copy of Stripe.js. This is both a PCI requirement and how Stripe ships security patches to the tokenization layer without requiring your redeploy [raw/stripe--pci--compliance-scope.md].

## Content Security Policy

Elements will not render without these allowed:

| Directive | Value |
|---|---|
| `frame-src`, `script-src` | `https://js.stripe.com` |
| `connect-src` | `https://api.stripe.com` |
| `img-src` | `https://*.stripe.com` |

If the Address Element uses your own Google Maps API key, also allow `https://maps.googleapis.com` in `connect-src` and `script-src` [raw/stripe--pci--compliance-scope.md].

## Idempotency keys (also a correctness-under-retry security property)

Any server-side `POST` that could be retried under a timeout, creating a Customer, Subscription, Refund, or confirming a PaymentIntent, needs an `Idempotency-Key`. Stripe caches the first response for the key and replays it verbatim on retry [raw/stripe--idempotency--api-requests.md]. See `guides/10-production-failure-modes.md` for what breaks without this.

## Webhook signature verification is the perimeter

Every inbound webhook must pass `stripe.webhooks.constructEvent()` against the raw body before any processing. Without this, an attacker who discovers your webhook URL can POST fabricated `checkout.session.completed` events and provision access for free. See `guides/06-webhooks-and-provisioning.md` for the full contract [raw/stripe--webhooks--receive-and-verify.md].

## Never trust client input for money-relevant values

Amounts, prices, plan choices, and entitlements come from Stripe events or server-fetched objects by ID, never from a query string, hidden form field, POST body, or `localStorage`. A redirect handler that reads `?amount=` from the URL and provisions based on it is a Must-fix finding, not a style nit.

## Customer Portal / subscription-management access control

When creating a Billing Portal session, always derive `customer` from the authenticated server-side session, never from a client-supplied parameter. A route that reads `customer` from the request instead of the auth session lets any logged-in user open another customer's billing portal by guessing or enumerating IDs.

## Scope this skill does not audit

Secret rotation policy, RBAC on internal tooling, and broader PII handling are flagged, not audited, by this skill, hand those to the security review pass in the Ship Gate (see `SKILL.md`).
