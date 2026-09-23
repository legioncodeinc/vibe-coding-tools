# gohighlevel-wasp-drone

## Domain
This Drone owns any code or config calling GoHighLevel's API surface: OAuth 2.0 vs Private Integration Token selection, the Contacts/Opportunities/Pipelines/Calendars/Conversations resources, both webhook directions (signed outbound events, unauthenticated inbound triggers), the workflows API, rate-limit and reliability posture (no idempotency-key mechanism, so retriable writes route through `/contacts/upsert`), and Marketplace app creation and distribution.

## Paired Stinger
`gohighlevel-stinger` in the optional `highlevel` pack - auth and token scoping, contacts and custom fields, opportunities and pipelines, webhook handling both directions, the lead-intake integration pattern, rate limits, Marketplace apps, and troubleshooting. Confirm the pack is installed before dispatch.

## Trigger phrases
- "integrate GoHighLevel"
- "wire up a GHL webhook"
- "push leads into GoHighLevel"
- "set up a GoHighLevel Marketplace app"
- "GHL contact upsert"
- "GoHighLevel OAuth"
- "should this be a Private Integration Token or OAuth"

## Do NOT route when
- The ask is HighLevel AI Studio, AI Studio (Vibe), Content AI, Ask AI, Funnel & Website AI, Blog Post AI, Email AI, or WordPress AI page creation: that's highlevel-ai-studio-wasp-drone.
- The ask is general OAuth 2.0 protocol design or provider selection unrelated to GoHighLevel: that's auth-wasp-drone.
- The ask is generic HTTP/REST semantics (status codes, caching headers, CORS) not tied to a specific GHL endpoint's documented behavior: that's http-rest-fundamentals-wasp-drone.
- The ask is a security audit of secret storage, key rotation policy, or PII handling on an integration this Drone already built: that's security-wasp-drone.
- The ask is database schema for a local contacts/leads mirror table: that's db-wasp-drone, this Drone only specifies the fields.
- The downstream payment rail is Stripe once a GHL Payments webhook event has been received: that's payments-wasp-drone territory from that point on.

## Inputs the Drone needs
- Whether the integration is internal single-account (Private Integration Token) or a distributable Marketplace app (OAuth 2.0)
- Agency vs Location token scope for the target resource endpoint
- Which resource surface is in play: contacts, opportunities/pipelines, calendars, or conversations
- Whether the webhook direction is inbound (trigger URL, treat as a bearer secret) or outbound (signed, verify `X-GHL-Signature`)

## Outputs
- OAuth flow or Private Integration Token setup code
- Contact/opportunity upsert logic with dedupe and field-mapping design
- Verified webhook handlers and, when relevant, a Marketplace app distribution plan

## Commonly sequenced with
- highlevel-ai-studio-wasp-drone: handles the user-facing AI Studio or content-builder workflow before an API or webhook handoff is needed
- auth-wasp-drone: handles general OAuth provider selection and session storage unrelated to GoHighLevel specifically
- security-wasp-drone: audits secret storage and PII handling once this Drone's integration is built
- db-wasp-drone: designs the schema for any local mirror of GHL contact or lead data this Drone specifies fields for
