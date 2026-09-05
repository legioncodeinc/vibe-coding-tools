---
name: "payments-stinger"
description: "Stripe for SvelteKit. Defaults to custom checkout with Elements (Payment/Address/Express Checkout, Appearance API) over hosted Checkout. Covers Payment Intents, subscriptions, webhooks, PCI scope."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork. SvelteKit (Svelte 5) on Vercel, Stripe SDK 2025-09-30.clover or later.
metadata:
  hive-bee: payments-worker-bee
  domain: payments
  pair-bee: payments-worker-bee
---

# payments-stinger

You are equipping **payments-worker-bee**, the Hive's Stripe integration authority for SvelteKit (Svelte 5) products on Vercel. This skill's default is **custom checkout built with Stripe Elements** (Payment Element, Address Element, Contact Details Element, Express Checkout Element, themed via the Appearance API), not the hosted Checkout redirect. Hosted Checkout is still correct for specific tradeoffs, and this skill says exactly when, see `guides/01-choose-your-integration.md`. What this skill does not do: default a team to a page Stripe hosts when they want a checkout that looks like their own product. There is no PCI reason to make that tradeoff; see `guides/09-security-and-pci-scope.md`.

## First move on every invocation

1. **Read `guides/01-choose-your-integration.md` first.** It sets the default (Elements custom checkout) and the explicit conditions under which hosted Checkout is still the right call. Don't skip straight to implementation guides.
2. **Pin the Stripe API version and SDK.** Read `package.json` for `stripe` and `@stripe/stripe-js`, and the `apiVersion` passed to `new Stripe(...)`. Everything downstream depends on this.
3. **Classify the invocation**, new checkout build, subscription work, webhook debugging, theming pass, or audit. Route with the table below.

## Routing table

| Invocation | Primary guide(s) | Reference(s) |
|---|---|---|
| New checkout, one-time payment | `01-choose-your-integration.md`, `02-elements-setup-sveltekit.md`, `03-payment-intents-lifecycle.md` | `references/elements-mount-confirm.md`, `references/server-create-checkout-session.ts` |
| Saving a card / off-session charge | `04-saving-payment-methods.md` | `references/server-create-checkout-session.ts` |
| Subscriptions | `05-subscriptions-with-custom-ui.md` | `references/subscription-creation-flow.ts` |
| Webhook build or debugging | `06-webhooks-and-provisioning.md`, `10-production-failure-modes.md` | `references/webhook-handler-sveltekit.ts`, `scripts/verify-signature-snippet.ts` |
| Theming / brand match | `07-theming-with-appearance-api.md` | `references/appearance-theming.ts` |
| Local dev / test setup | `08-testing-and-local-development.md` | `references/test-card-table.md`, `references/env-var-checklist.md`, `scripts/replay-webhook-locally.sh` |
| Security or PCI question | `09-security-and-pci-scope.md` | n/a |
| Audit existing integration | `09-security-and-pci-scope.md`, `10-production-failure-modes.md` | `templates/audit-report-template.md`, `templates/audit-output-template.md` |

## Non-negotiables (from the research, not opinion)

- **Money is sacred.** Every finding that could double-charge, fail to provision, or fail to revoke access is a Must-fix. See `guides/10-production-failure-modes.md`.
- **Never trust the client.** Amounts, prices, plan choices, and entitlements come from Stripe events or a server-fetch by ID, never from a query string, hidden field, or POST body. See `guides/09-security-and-pci-scope.md`.
- **Webhooks are the only writer.** Client-side return-page state is a read, never a grant of access. See `guides/06-webhooks-and-provisioning.md`.
- **Idempotency-first.** Webhook handlers dedup on `event.id`; retryable outbound writes carry an `Idempotency-Key`. See `guides/06-webhooks-and-provisioning.md` and `guides/09-security-and-pci-scope.md`.
- **Raw body before signature verification, always.** `request.text()` first in a SvelteKit `+server.ts`, never `request.json()`. See `guides/06-webhooks-and-provisioning.md`.
- **Secret keys never leave the server.** `sk_*` and `whsec_*` stay in `$env/static/private`-backed server code. See `references/env-var-checklist.md`.

## Cross-Bee handoffs

- **Database schema** (`processed_webhook_events`, `subscriptions`, `entitlements_cache`) → `db-worker-bee`. This skill specifies columns; db-worker-bee designs the migration.
- **Auth / session identity feeding the Stripe `customer` ID** → `auth-worker-bee`.
- **Svelte 5 component conventions, runes idioms beyond the Elements mount pattern** → whichever Svelte-stack skill owns the target repo's UI system (check `.claude/skills/` for the current one, e.g. `ux-ui-svelte-stinger` or `shadcn-svelte-stinger`).
- **Secret rotation, PII handling, leaked-key response** → `security-worker-bee`. Surface with file:line; do not audit it yourself.

## Guides (numbered, cite every claim to `references/research/raw/`)

- `guides/01-choose-your-integration.md`
- `guides/02-elements-setup-sveltekit.md`
- `guides/03-payment-intents-lifecycle.md`
- `guides/04-saving-payment-methods.md`
- `guides/05-subscriptions-with-custom-ui.md`
- `guides/06-webhooks-and-provisioning.md`
- `guides/07-theming-with-appearance-api.md`
- `guides/08-testing-and-local-development.md`
- `guides/09-security-and-pci-scope.md`
- `guides/10-production-failure-modes.md`

## References map

- `references/research/distilled-stripe.md`, dense, cited distillation; load when a claim needs verification.
- `references/research/raw/`, 20 archived primary sources; load when tracing a distilled claim.
- `references/elements-mount-confirm.md`, Svelte 5 mount + confirm flow, both integration shapes.
- `references/server-create-checkout-session.ts`, server endpoint creating a Custom Checkout Session / PaymentIntent.
- `references/webhook-handler-sveltekit.ts`, full webhook handler with signature verification, raw body, dedup.
- `references/subscription-creation-flow.ts`, subscription create, plan switch, cancel.
- `references/appearance-theming.ts`, Appearance API theming example.
- `references/env-var-checklist.md`, SvelteKit env var split, prod checklist.
- `references/test-card-table.md`, test cards, Stripe CLI loop, test clocks.
- `templates/idempotency-table.sql`, `templates/stripe-cli-fixtures.json`, `templates/audit-report-template.md`, `templates/audit-output-template.md`, deterministic scaffolding.
- `scripts/replay-webhook-locally.sh`, `scripts/verify-signature-snippet.ts`, load/run per their own headers.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [ux-ui-svelte-stinger](../ux-ui-svelte-stinger) - Svelte 5 + SvelteKit UI enforcement and shadcn-svelte/Tailwind conventions; consult when the checkout's surrounding page chrome needs to match the product's design system.
  - [shadcn-svelte-stinger](../shadcn-svelte-stinger) - Generic shadcn-svelte library reference (CLI, component anatomy, theming) for any Svelte project adopting it around the Elements checkout.
  - [db-stinger](../db-stinger) - PostgreSQL schema, indexing, and migrations for `processed_webhook_events`, `subscriptions`, and entitlement tables this skill specifies but does not migrate.
  - [auth-stinger](../auth-stinger) - Authentication provider selection and session handling that resolves the identity behind every Stripe `customer` ID this skill creates or charges.
  - [security-stinger](../security-stinger) - Security audit pass; first gate of the Ship Gate pipeline below.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
