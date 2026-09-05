---
name: "gohighlevel-stinger"
description: "GoHighLevel API authority - OAuth vs Private Integration Tokens, contacts/opportunities/calendars, inbound/outbound webhooks, rate limits, Marketplace apps. Use for GoHighLevel/HighLevel integration."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-bee: gohighlevel-worker-bee
  domain: gohighlevel-api
  pair-bee: gohighlevel-worker-bee
---

# GoHighLevel Stinger

## Purpose

GoHighLevel (also branded HighLevel) exposes its whole platform through a REST API served from `services.leadconnectorhq.com`, authenticated either by OAuth 2.0 (Marketplace apps) or Private Integration Tokens (internal tools), and versioned by a `Version` header. This stinger is the grounded reference for building or auditing any integration against that API: auth token selection, contacts/opportunities/pipelines/calendars/conversations, inbound and outbound webhooks, the (narrow) workflows API surface, rate limits, and Marketplace app creation and distribution. Every factual claim in this stinger traces to a downloaded primary source in `references/research/raw/`.

## When to use

- Building a new integration that creates, reads, or syncs GoHighLevel contacts, opportunities, pipelines, calendars, appointments, or conversations
- Choosing between OAuth 2.0 and a Private Integration Token for a given integration
- Wiring inbound lead capture from an external site/form into a GHL sub-account, or outbound webhook handling from GHL into your system
- Building or auditing a GoHighLevel Marketplace app (creation, distribution model, scopes, sandbox testing)
- Debugging a GoHighLevel API error, a webhook signature failure, a rate-limit issue, or a duplicate-contact problem
- Migrating a legacy GoHighLevel v1 API key integration to v2

## When not to use

- HighLevel AI Studio, AI Studio (Vibe), Content AI, Ask AI, Funnel & Website AI, Blog Post AI, Email AI, or WordPress AI page creation -- route to `highlevel-ai-studio-stinger`
- General OAuth 2.0 protocol questions unrelated to GoHighLevel specifically -- route to `auth-stinger`
- Generic HTTP/REST semantics questions (status codes, idempotency in the abstract, CORS) -- route to `http-rest-fundamentals-stinger`
- Payment processing itself once a GHL Payments/Invoices webhook fires -- that event's downstream handling is generic webhook engineering; use `payments-stinger` for Stripe-specific work if the location's payment rail is Stripe under the hood
- Security review of an already-built integration's secret handling -- route to `security-stinger`

## Procedure

1. **Classify the task.** Auth setup, a specific resource integration (contacts/opportunities/calendars/conversations), webhook work (inbound trigger vs outbound signed webhook), a Marketplace app, or troubleshooting. Use the table below to jump to the right guide.
2. **Pick the auth method before writing any code.** Internal single-account tool -> Private Integration Token. Distributable Marketplace app -> OAuth 2.0. See `guides/01-auth-and-tokens.md` and `references/auth-decision-matrix.md`. Never guess this -- using a PIT where OAuth is required (or vice versa) is a documented migration mistake.
3. **Resolve the correct token scope (Agency vs Location) before calling a resource endpoint.** Most CRM writes need a Location-level token; an Agency-level token must be exchanged via `/oauth/locationToken` first. See `guides/01-auth-and-tokens.md`.
4. **Work the resource guide.** `guides/02-contacts-and-custom-fields.md` for contacts/custom fields/custom values, `guides/03-opportunities-and-pipelines.md` for the sales pipeline, `guides/04-webhooks-inbound-and-outbound.md` for both webhook directions, `guides/05-lead-intake-integration-pattern.md` for the common "external form -> GHL" pattern end to end.
5. **Check rate limits and reliability posture before load-testing or launching.** `guides/06-rate-limits-and-reliability.md` -- production and Sandbox limits differ by 4-20x; there is no documented idempotency-key mechanism, so route retriable writes through `/contacts/upsert`.
6. **For Marketplace apps specifically**, walk `guides/07-marketplace-apps.md` -- three distribution-model fields are irreversible once set; get them right the first time.
7. **When something breaks**, start at `guides/08-troubleshooting.md` -- it is a symptom-first index citing the exact raw source behind each diagnosis.
8. **Pull copy-paste request shapes** from `references/request-examples.md` (curl + TypeScript fetch) and `references/endpoint-reference.md` (full endpoint/scope tables) rather than re-deriving them from memory.
9. **Before trusting any fact about API v3 specifically**, read the note in `references/research/distilled-gohighlevel.md` §1 -- this research's own official and vendor sources disagree on whether v3 is generally available. Verify against your own developer portal's version switcher.

## References map

- `references/endpoint-reference.md` -- load when you need the full endpoint/method/scope table for auth, contacts, custom fields, opportunities, calendars, conversations, users/locations, or workflows
- `references/auth-decision-matrix.md` -- load when choosing OAuth vs Private Integration Token, or resolving Agency vs Location token scope
- `references/webhook-payload-examples.md` -- load when implementing outbound webhook signature verification (Ed25519 `X-GHL-Signature` current, RSA `X-WH-Signature` deprecated 2026-09-01) or an inbound webhook trigger payload
- `references/field-mapping-worksheet.md` -- load when mapping an external system's lead/contact fields onto GHL contact fields, custom fields, tags, and attribution
- `references/request-examples.md` -- load when you need a ready-to-adapt curl or TypeScript `fetch` call for token exchange, contact upsert, opportunity creation, sending a message, or workflow enrollment
- `references/research/distilled-gohighlevel.md` -- load when a domain claim needs verification or a source conflict needs resolving; every line cites its raw file
- `references/research/raw/` -- load when tracing a distilled claim back to its primary source (20 archived sources, official docs preferred over vendor/community)
- `guides/01-auth-and-tokens.md` through `guides/08-troubleshooting.md` -- load the matching guide per the Procedure section above

## Related bees and stingers

- [gohighlevel-worker-bee](../../agents/gohighlevel-worker-bee.md) - the paired agent; delegate to it for hands-on GoHighLevel integration work rather than running this stinger inline for anything beyond a quick lookup
- [highlevel-ai-studio-stinger](../highlevel-ai-studio-stinger) - HighLevel AI Studio, Vibe sites, user-facing AI content and page builders, publishing, and product selection
- [auth-stinger](../auth-stinger) - general OAuth 2.0/provider selection, session storage, and RBAC patterns not specific to GoHighLevel
- [http-rest-fundamentals-stinger](../http-rest-fundamentals-stinger) - generic HTTP method safety/idempotency, status codes, and header correctness
- [payments-stinger](../payments-stinger) - Stripe-specific webhook verification and subscription lifecycle, useful as a comparison pattern when a GHL location's payment rail is Stripe
- [security-stinger](../security-stinger) - security audit pass for secret handling, token storage, and webhook signature verification correctness

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [highlevel-ai-studio-stinger](../highlevel-ai-studio-stinger) - HighLevel AI Studio, Vibe sites, content and page builders, and publishing workflows.
  - [auth-stinger](../auth-stinger) - General OAuth 2.0, provider selection, session storage, and RBAC patterns not specific to GoHighLevel.
  - [http-rest-fundamentals-stinger](../http-rest-fundamentals-stinger) - Generic HTTP/REST method safety, idempotency, status codes, and header correctness.
  - [payments-stinger](../payments-stinger) - Stripe-specific webhook verification and subscription lifecycle patterns, useful for comparison.
  - [security-stinger](../security-stinger) - Security audit pass for secret handling and token storage.
  - [beekeeper-suit](../beekeeper-suit) - Roster and routing for the Hive; consult before dispatching this work elsewhere.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
