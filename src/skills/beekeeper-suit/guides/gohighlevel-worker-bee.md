# gohighlevel-worker-bee

## Domain
This Bee owns any code or config calling GoHighLevel's API surface: OAuth 2.0 vs Private Integration Token selection, the Contacts/Opportunities/Pipelines/Calendars/Conversations resources, both webhook directions (signed outbound events, unauthenticated inbound triggers), the workflows API, rate-limit and reliability posture (no idempotency-key mechanism, so retriable writes route through `/contacts/upsert`), and Marketplace app creation and distribution.

## Paired Stinger
[gohighlevel-stinger](../../gohighlevel-stinger) - auth and token scoping, contacts and custom fields, opportunities and pipelines, webhook handling both directions, the lead-intake integration pattern, rate limits, Marketplace apps, and troubleshooting.

## Trigger phrases
- "integrate GoHighLevel"
- "wire up a GHL webhook"
- "push leads into GoHighLevel"
- "set up a GoHighLevel Marketplace app"
- "GHL contact upsert"
- "GoHighLevel OAuth"
- "should this be a Private Integration Token or OAuth"

## Do NOT route when
- The ask is HighLevel AI Studio, AI Studio (Vibe), Content AI, Ask AI, Funnel & Website AI, Blog Post AI, Email AI, or WordPress AI page creation: that's highlevel-ai-studio-worker-bee.
- The ask is general OAuth 2.0 protocol design or provider selection unrelated to GoHighLevel: that's auth-worker-bee.
- The ask is generic HTTP/REST semantics (status codes, caching headers, CORS) not tied to a specific GHL endpoint's documented behavior: that's http-rest-fundamentals-worker-bee.
- The ask is a security audit of secret storage, key rotation policy, or PII handling on an integration this Bee already built: that's security-worker-bee.
- The ask is database schema for a local contacts/leads mirror table: that's db-worker-bee, this Bee only specifies the fields.
- The downstream payment rail is Stripe once a GHL Payments webhook event has been received: that's payments-worker-bee territory from that point on.

## Inputs the Bee needs
- Whether the integration is internal single-account (Private Integration Token) or a distributable Marketplace app (OAuth 2.0)
- Agency vs Location token scope for the target resource endpoint
- Which resource surface is in play: contacts, opportunities/pipelines, calendars, or conversations
- Whether the webhook direction is inbound (trigger URL, treat as a bearer secret) or outbound (signed, verify `X-GHL-Signature`)

## Outputs
- OAuth flow or Private Integration Token setup code
- Contact/opportunity upsert logic with dedupe and field-mapping design
- Verified webhook handlers and, when relevant, a Marketplace app distribution plan

## Commonly sequenced with
- highlevel-ai-studio-worker-bee: handles the user-facing AI Studio or content-builder workflow before an API or webhook handoff is needed
- auth-worker-bee: handles general OAuth provider selection and session storage unrelated to GoHighLevel specifically
- security-worker-bee: audits secret storage and PII handling once this Bee's integration is built
- db-worker-bee: designs the schema for any local mirror of GHL contact or lead data this Bee specifies fields for
