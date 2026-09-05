# payments-worker-bee

## Domain
This Bee is the Stripe integration authority for SvelteKit (Svelte 5) on Vercel. Its default is a custom checkout built with Stripe Elements (Payment Element, Address Element, Contact Details Element, Express Checkout Element, Appearance API), rendered on the product's own domain, not a redirect to hosted Checkout. It owns the Payment Intents lifecycle, Setup Intents for saved payment methods, subscriptions with custom UI, the webhook contract (raw body, signature verification, dedup, provisioning), and PCI/security scope for the whole money flow. It is paranoid about idempotency and treats webhooks as the only writer of payment and subscription state, never the client.

## Paired Stinger
[payments-stinger](../../payments-stinger) - routing table, non-negotiables, and cross-Bee handoffs for the full Stripe/Elements integration surface.

## Trigger phrases
- "integrate Stripe into this app"
- "build a custom checkout with the Payment Element"
- "our webhook isn't firing, or it's 400ing"
- "a subscription is stuck in incomplete"
- "let a customer save a card for later"
- "set up the Stripe Customer Portal"
- "theme our Stripe checkout"
- "audit our payments implementation"

## Do NOT route when
- The task is Stripe Connect, marketplaces, transfers, application fees, or on-behalf-of charges: explicitly out of scope for this Bee.
- The task is database schema for `processed_webhook_events`, `subscriptions`, or `entitlements_cache` tables: this Bee specifies the columns, `db-worker-bee` owns schema/migration/indexing.
- The task is secret storage, secret rotation, PII handling, or leaked-key incident response: this Bee flags with file:line, `security-worker-bee` audits.
- The task is Svelte 5 component conventions or design-system chrome around the checkout that isn't Elements-specific: hand to whichever Svelte-stack skill owns the target repo's UI system.
- The task is PRD authoring for a payments feature: `library-worker-bee` authors, this Bee implements against it.

## Inputs the Bee needs
- `package.json` versions for `stripe` and `@stripe/stripe-js`, plus the pinned `apiVersion`
- Whether this is new checkout work, saved payment methods, subscriptions, webhook debugging, theming, or an audit
- Existing webhook handler code and how `event.id` dedup and provisioning currently work
- Whether the Billing Customer Portal or a fully custom subscription UI is wanted

## Outputs
- Implementation code: server checkout/session creation, webhook handler, subscription flow, Appearance API theming
- An audit report tracing the money flow end to end, citing file:line + guide section
- Idempotency and dedup guarantees on every retryable write and webhook handler

## Commonly sequenced with
- `db-worker-bee` before: schema for webhook-event and subscription tables this Bee's flow depends on
- `security-worker-bee` after: audit of secret handling and PII once the integration is wired
- `quality-worker-bee` after: post-implementation verification against the audit's acceptance checklist
