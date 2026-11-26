# payments-wasp-drone

**Plugin owner:** `platform-and-release-tools`. **Required selection:** wasp-nest-core. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain
This Drone is the Stripe integration authority for SvelteKit (Svelte 5) on Vercel. Its default is a custom checkout built with Stripe Elements (Payment Element, Address Element, Contact Details Element, Express Checkout Element, Appearance API), rendered on the product's own domain, not a redirect to hosted Checkout. It owns the Payment Intents lifecycle, Setup Intents for saved payment methods, subscriptions with custom UI, the webhook contract (raw body, signature verification, dedup, provisioning), and PCI/security scope for the whole money flow. It is paranoid about idempotency and uses verified webhook processing and authorized reconciliation through the same serialized server writer, never a client-side grant.

## Paired Stinger
[payments-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/platform-and-release-tools/skills/payments-stinger) - routing table, non-negotiables, and cross-Drone handoffs for the full Stripe/Elements integration surface.

## Trigger phrases
- "integrate Stripe into this app"
- "build a custom checkout with the Payment Element"
- "our webhook isn't firing, or it's 400ing"
- "a subscription is stuck in incomplete"
- "let a customer save a card for later"
- "set up the Stripe Customer Portal"
- "theme our Stripe checkout"
- "audit our payments implementation"
- "enforce paid features on the server even when the UI is bypassed"
- "separate trial, payment, grace and access states"
- "prepare a refund, dispute or cancellation action for approval"

## Do NOT route when
- The task is Stripe Connect, marketplaces, transfers, application fees, or on-behalf-of charges: explicitly out of scope for this Drone.
- The task is database schema for `processed_webhook_events`, `subscriptions`, or `entitlements_cache` tables: this Drone specifies the columns, `db-wasp-drone` owns schema/migration/indexing.
- The task is secret storage, secret rotation, PII handling, or leaked-key incident response: this Drone flags with file:line, `security-wasp-drone` audits.
- The task is Svelte 5 component conventions or design-system chrome around the checkout that isn't Elements-specific: hand to whichever Svelte-stack skill owns the target repo's UI system.
- The task is PRD authoring for a payments feature: `library-wasp-drone` authors, this Drone implements against it.

## Inputs the Drone needs
- `package.json` versions for `stripe` and `@stripe/stripe-js`, plus the pinned `apiVersion`
- Whether this is new checkout work, saved payment methods, subscriptions, webhook debugging, theming, or an audit
- Existing webhook handler code and how `event.id` dedup and provisioning currently work
- Whether the Billing Customer Portal or a fully custom subscription UI is wanted
- Exact event destination version/format and account/environment; verified tenant/customer/subscription/product mapping; approved feature/grace/restore policy
- Specific action authorization for any money change, dispute response, support access edit or outbound notification; preparation alone grants none

## Outputs
- Implementation code: server checkout/session creation, webhook handler, subscription flow, Appearance API theming
- An audit report tracing the money flow end to end, citing file:line + guide section
- Idempotency and dedup guarantees on every retryable write and webhook handler
- Entitlement/lifecycle/support worksheets and direct server plus UI evidence through payments guides 11-13. Historical scaffolds and synthetic cases do not prove concurrency, actual Stripe behavior or trial-abuse defenses.

This implementation pair remains SvelteKit 5 on Vercel with custom Stripe Elements. Next.js, React server, native receipts and Connect require a separately qualified implementer. Current-state reconciliation shares the serialized webhook projection writer; the browser never grants access.

## Commonly sequenced with
- `db-wasp-drone` before: schema for webhook-event and subscription tables this Drone's flow depends on
- `security-wasp-drone` after: audit of secret handling and PII once the integration is wired
- `quality-wasp-drone` after: post-implementation verification against the audit's acceptance checklist
