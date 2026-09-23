# tawk-to-api-wasp-drone

## Domain
This Drone owns every call against the tawk.to REST API v1.1.0 (`https://api.tawk.to/v1`): choosing API key Basic Auth versus OAuth2, the Property/Widgets/Members/Chats/Tickets/Tabs resource groups, both webhook directions, Metrics and Contacts reads, and the Knowledge-Base content-block model plus the markdown-to-KB publishing workflow (host images on Cloudflare R2 or DigitalOcean Spaces, then reference by URL).

Every endpoint is a dotted, RPC-style `POST` call with a JSON body; there are no GET/PUT/DELETE verbs. Article bodies are never raw markdown or HTML: they are an ordered array of typed content blocks that must validate against the documented schema before a write succeeds.

## Paired Stinger
[tawk-to-api-stinger](../../tawk-to-api-stinger) - the full endpoint reference, Knowledge-Base content-block schemas, and the markdown-to-KB publishing workflow.

## Trigger phrases
- "integrate tawk.to"
- "call the tawk.to API"
- "create a tawk.to KB article"
- "sync markdown into tawk.to KB"
- "set up a tawk.to webhook"
- "tawk.to OAuth2"

## Do NOT route when
- The task is choosing a live-chat or help-center platform and tawk.to has not already been decided: route to `live-chat-support-wasp-drone` or `knowledge-base-help-center-wasp-drone`.
- The task is generic OAuth2 protocol design with no tawk.to-specific constraint: route to `auth-wasp-drone`.
- The task is generic HTTP/REST correctness review not tied to a documented tawk.to endpoint: route to `http-rest-fundamentals-wasp-drone`.
- The task is auditing credential storage or PII handling in an already-built integration: route to `security-wasp-drone`.
- The task is a required shape not covered by this Drone's skill files or https://docs.tawk.to: say so explicitly rather than guessing a field name or scope.

## Inputs the Drone needs
- Whether the integration is a simple server-to-server script (API key) or acts on behalf of a user (OAuth2)
- The `propertyId`, and for Knowledge-Base work the `siteId`, the target call needs
- Which resource group is in play: Property, Widgets, Members, Chats, Tickets, Tabs, Knowledge-Base, Webhook, Metrics, or Contacts
- For Knowledge-Base work: the source markdown and image locations, and whether an R2 or Spaces bucket is already provisioned
- The OAuth2 scope the target method needs, confirmed against the endpoint reference before the first call

## Outputs
- Auth setup code, either a Basic Auth header or an OAuth2 flow, matched to the integration's distribution shape
- Validated content-block JSON for a `knowledge-base.article.create` or `.update` call
- A markdown-to-KB sync script uploading images to R2 or Spaces and mapping markdown elements to content blocks
- A verified webhook handler for the requested direction

## Commonly sequenced with
- `live-chat-support-wasp-drone`: decides whether tawk.to is the right chat platform before this Drone's API work begins
- `security-wasp-drone`: audits credential storage once an integration is built
- `auth-wasp-drone`: handles broader OAuth2 provider selection unrelated to tawk.to specifically
- `knowledge-base-help-center-wasp-drone`: handles KB platform selection when tawk.to is not already the chosen platform

Every KB article is created as `status: "draft"` first, verified in the dashboard, then flipped to `published` via a follow-up update call.
