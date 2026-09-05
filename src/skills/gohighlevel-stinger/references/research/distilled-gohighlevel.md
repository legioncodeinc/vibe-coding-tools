# Distilled: GoHighLevel API (v2/v3, OAuth, Private Integrations, webhooks, workflows)

Dense reference distilled from `raw/`. Every claim ends with a citation to its raw file. Where sources conflict, both readings are stated with the preferred one flagged. Where research is thin, that is stated plainly rather than smoothed over.

## 1. Versioning: what v3 actually is right now

| Claim | Reading |
|---|---|
| v3 is a real, shipped generation of endpoints with "a more consistent endpoint architecture" and a dedicated version switcher | Per a vendor blog dated 2026-06-13 [raw/ghl--versioning--v3-announcement-and-resource-catalog.md] |
| v3 is **not yet available**; it is "the next API milestone" | Per HighLevel's own Support Portal article, last modified 2026-06-19 (six days later) [raw/ghl--versioning--v3-status-and-rate-limits-official.md] |

**Conflict, unresolved by this research pass.** The official support article is both more authoritative and more recent, so this distillation treats v3 as **rolling out / partially available**, not fully generally available: some accounts and endpoints may see it in the version switcher while HighLevel's own canonical FAQ still says "not yet." **Action for any integration: check your own developer portal's version switcher before writing code against a v3-only shape; do not assume v3 parity with the resource catalog below.** [raw/ghl--versioning--v3-status-and-rate-limits-official.md, raw/ghl--versioning--v3-announcement-and-resource-catalog.md]

- Base URL for all API calls, v2 and v3 alike: `https://services.leadconnectorhq.com` [raw/ghl--versioning--v3-announcement-and-resource-catalog.md, raw/ghl--auth--oauth2-authorization-code-flow-official.md]
- Every request needs a `Version` header. Date-based versions (e.g. `Version: 2021-07-28`) select the v2 schema; `Version: v3` selects the v3 schema where it exists [raw/ghl--versioning--v3-announcement-and-resource-catalog.md, raw/ghl--calendars-conversations--endpoints-overview.md]
- v3 is explicitly promised to be non-breaking for existing integrations: "your existing date-based API configurations remain fully functional, completely accessible, and fully documented" [raw/ghl--versioning--v3-announcement-and-resource-catalog.md]
- v1 API reached end-of-support 2025-12-31: no new API keys, no patches, no support, existing integrations "continue to function... without a safety net" [raw/ghl--versioning--v3-status-and-rate-limits-official.md, raw/ghl--auth--v1-to-v2-migration-official-blog.md]
- Legacy Stoplight documentation is being retired in favor of `https://marketplace.gohighlevel.com/docs/` [raw/ghl--versioning--v3-status-and-rate-limits-official.md]

## 2. Authentication: OAuth 2.0 vs Private Integration Token (PIT)

### Decision rule (official)

| Use case | Method |
|---|---|
| Internal tools & automations (Make, n8n, Zapier, custom scripts) touching one account | **Private Integration Token (PIT)** |
| Public or Marketplace apps installed across many sub-accounts | **OAuth 2.0** |

[raw/ghl--auth--v1-to-v2-migration-official-blog.md]

"Using PITs for public apps" is explicitly named as a migration mistake: PITs are strictly internal-use; if other accounts must install and authorize the integration, OAuth 2.0 is required [raw/ghl--auth--v1-to-v2-migration-official-blog.md].

### OAuth 2.0 authorization code flow

- HighLevel v2 uses the standard Authorization Code Grant [raw/ghl--auth--oauth2-authorization-code-flow-official.md, raw/ghl--auth--token-lifetimes-and-flow-variants.md]
- Two flow variants: **Public Marketplace Apps** get a HighLevel-hosted install/discovery UI; **Private Marketplace Apps** (unreviewed, unlisted) must build and host their own authorization-URL redirect [raw/ghl--auth--token-lifetimes-and-flow-variants.md]
- PKCE is supported and recommended for public clients (browser-based/mobile) [raw/ghl--auth--oauth2-authorization-code-flow-official.md]
- Token exchange: `POST https://services.leadconnectorhq.com/oauth/token` with `client_id`, `client_secret`, `grant_type=authorization_code`, `code`, `user_type` (`Company` or `Location`) [raw/ghl--auth--agency-vs-location-access-tokens.md]
- **Access token lifetime: confirmed `expires_in: 86399` seconds (~24 hours) from an official worked example's response body** -- this closes a gap left by a community blog's unconfirmed "valid for a day" claim [raw/ghl--auth--agency-vs-location-access-tokens.md, raw/ghl--auth--token-lifetimes-and-flow-variants.md]
- Refresh token: per a community source (not independently confirmed by an official page in this archive), "valid for a year or until they are used once, whichever comes first" -- using it invalidates the old refresh token and issues a new one that must replace the stored one. **Treat exact refresh-token TTL as an unconfirmed claim; always read `expires_in` from the live response rather than hard-coding a number.** [raw/ghl--auth--token-lifetimes-and-flow-variants.md -- GAP]

### Two access-token "user types"

| userType | Scope of access | Example use |
|---|---|---|
| `Company` (Agency) | Agency + all its sub-accounts (indirectly) | Create Sub-Account API |
| `Location` (Sub-account) | Single sub-account only | Create Contact API |

An Agency-level token can mint a Location-level token via `POST /oauth/locationToken` (or `/oauth/location-token` per the endpoint-specific doc), passing `companyId` + `locationId` [raw/ghl--auth--oauth2-authorization-code-flow-official.md]. Most day-to-day CRM endpoints (contacts, opportunities, calendars) require a Location-level token even if the app installed at the agency level [raw/ghl--auth--oauth2-authorization-code-flow-official.md].

### Private Integration Token (PIT)

| Property | Detail |
|---|---|
| Generation | UI only ("Settings > Private Integrations"), never programmatic [raw/ghl--auth--private-integration-tokens-official.md] |
| Refresh behavior | Static/fixed; does **not** auto-refresh; must be manually rotated/regenerated [raw/ghl--auth--private-integration-tokens-official.md] |
| Scope | Same scope catalog as OAuth, selected at creation, editable later [raw/ghl--auth--private-integration-tokens-official.md] |
| Count limit | **Up to 5 PITs per level** (5 at Agency level + 5 at each Location level) [raw/ghl--auth--private-integration-tokens-official.md] |
| Header | `Authorization: Bearer <token>` -- the literal word "Bearer" is required [raw/ghl--auth--private-integration-tokens-official.md] |
| API version support | v2.0 surface [raw/ghl--auth--sandbox-private-integration-tokens.md] |
| Default admin | Agency admins by default; customizable per user via Settings > Team > Roles & Permissions [raw/ghl--auth--private-integration-tokens-official.md] |

Sandbox accounts can now generate PITs (previously could not) [raw/ghl--auth--sandbox-private-integration-tokens.md] -- see §7.

### Scopes: the Agency-PIT / `oauth.readonly` trap

`oauth.readonly` and `GET /oauth/installedLocations` look like the way to check "is my app installed on this location" from an Agency PIT. **They are not.** HighLevel's own maintainers confirmed: `oauth.readonly` is not assignable to an Agency-level PIT, and `/oauth/installedLocations` is scoped to an app's own OAuth token context, not a generic PIT. There is no PIT-compatible substitute documented anywhere in this research set -- install-state checks require the app's own OAuth token/context. [raw/ghl--auth--scopes-reference-official.md]

## 3. Core resources: endpoint shape and scopes

| Resource | Base path | Key scopes | Notes |
|---|---|---|---|
| Contacts | `/contacts/` | `contacts.readonly` / `contacts.write` | Create `POST /contacts`; update `PUT /contacts/{id}` (full-field replace on `tags` -- read-merge-write for additive tagging); **upsert `POST /contacts/upsert` exists** (see conflict below) [raw/ghl--contacts--create-update-upsert-recipes.md, raw/ghl--contacts--openapi-upsert-schema.md] |
| Custom Fields (on contacts) | value shape `{id, value}` inside `customFields[]` | n/a (part of contacts.write) | Always keyed by field **ID**, never name/key, across every source in this archive [raw/ghl--contacts--openapi-upsert-schema.md] |
| Custom Fields (definitions) | `/custom-fields/` (v2), `/locations/:locationId/customFields` | n/a | New custom-field *creation* via the Custom Fields API "only supports Custom Objects and Company (Business) today" [raw/ghl--custom-fields-values--field-and-value-types.md] |
| Custom Values | reusable static placeholders | n/a | Distinct from Custom Fields: fields are per-record data, values are reusable constants (e.g. company phone in a footer) [raw/ghl--custom-fields-values--field-and-value-types.md] |
| Opportunities | `/opportunities/` | `opportunities.readonly` / `opportunities.write` | `GET /opportunities/pipelines` must be called first to resolve `pipelineId`+`stageId`; `GET /opportunities/search` uniquely uses snake_case query params (`location_id`, `pipeline_id`) unlike the rest of the API [raw/ghl--opportunities--pipelines-and-crud-endpoints.md] |
| Pipelines | `/opportunities/pipelines` | `opportunities.readonly` | Returns `pipelines[]` each with `stages[]` (`id`, `name`, `position`) [raw/ghl--opportunities--pipelines-and-crud-endpoints.md] |
| Calendars/Appointments | `/calendars/` | `calendars.readonly` / `calendars.write` | Separate availability-schedule endpoint (`GET /calendars/schedules/event-calendar/:calendarId`) vs appointment CRUD (create/update/get appointment) [raw/ghl--calendars-conversations--endpoints-overview.md] |
| Conversations/Messages | `/conversations/` | `conversations.readonly`, `conversations/message.readonly`, `conversations/message.write` | `POST /conversations/messages` sends across channels: `SMS`, `RCS`, `Email`, `WhatsApp`, `IG`, `FB`, `Custom`, `Live_Chat`, `TIKTOK` (v2 shape). A third-party MCP tool catalog claims a v3 shape additionally requires `subType`+`status` -- **unconfirmed against an official v3 page in this archive; treat as a gap** [raw/ghl--calendars-conversations--endpoints-overview.md -- GAP] |
| Tags | `/locations/:locationId/tags/:tagId` (update) | part of `contacts.write`/`locations.write` family | Contact-level tags are a full-array replace on `PUT`, same caveat as custom fields |
| Users | `/users/` | `users.readonly` / `users.write` | Manage users, roles, permissions [raw/ghl--marketplace--app-creation-and-distribution-model.md, raw/ghl--auth--scopes-reference-official.md] |
| Locations (sub-accounts) | `/locations/` | `locations.readonly` / `locations.write` | Create Sub-Account "only available on Agency Pro ($497) plan" per the endpoint doc's own note (community mirror) |
| Workflows | `/workflows/` + `/contacts/:contactId/workflow/:workflowId` | `contacts.write` for enrollment | **No API exists anywhere in this research to author/edit workflow logic** -- only list workflows and add/remove a contact from an existing one [raw/ghl--workflows--add-contact-to-workflow-endpoint.md, raw/ghl--versioning--v3-announcement-and-resource-catalog.md] |

### Contacts upsert: a direct source conflict

- A 2026-05-28 vendor blog states flatly: "GoHighLevel does not have a native upsert endpoint... As of 2026, the API does not have a single upsert call" and recommends a manual search-then-branch pattern [raw/ghl--contacts--create-update-upsert-recipes.md]
- HighLevel's own published OpenAPI spec (mirrored on GitHub) defines `UpsertContactInput` and `UpsertContactsResponse` (with a `new: boolean` flag) for `POST /contacts/upsert`, matching on email/phone, with an additional `create_new_if_duplicate_allowed` override flag [raw/ghl--contacts--openapi-upsert-schema.md]
- **Preferred reading: the upsert endpoint is real and documented in the schema; the blog's claim is either stale or the author was unaware of it.** Use `POST /contacts/upsert` as the primary integration pattern. Keep the manual search-then-branch pattern as a fallback if `/contacts/upsert` is unavailable on a given API version, and always verify live against your own account before shipping either pattern to production.

## 4. Webhooks

### Outbound (HighLevel -> external system)

- 58+ event types across categories: Contact, Opportunity, Task, Appointment, Invoice, Product, Association, Location, User, and more [raw/ghl--webhooks--integration-guide-and-signature-verification.md]
- **Two signature schemes, one being retired:**

  | Header | Algorithm | Status |
  |---|---|---|
  | `X-WH-Signature` | RSA-SHA256 (PKCS#1 v1.5) | Legacy; deprecated **2026-09-01** |
  | `X-GHL-Signature` | Ed25519 | Current; sole scheme after the cutover |

  [raw/ghl--webhooks--integration-guide-and-signature-verification.md]
- Verification precedence: prefer `X-GHL-Signature` when present; fall back to `X-WH-Signature` only during the transition; reject if verification fails [raw/ghl--webhooks--integration-guide-and-signature-verification.md, raw/ghl--sdk--official-typescript-sdk-and-error-handling.md]
- **Always verify the raw request body bytes**, not a re-serialized JSON object -- re-serialization can reorder keys and break the signature [raw/ghl--webhooks--integration-guide-and-signature-verification.md]
- Recommended replay-window: reject payloads older than 5 minutes (300s), using the `timestamp`/`webhookId` fields added in the original 2025 signing rollout [raw/ghl--webhooks--integration-guide-and-signature-verification.md]
- Public keys are published on the live docs page and rotate occasionally with email/Slack notice -- do not hard-code a stale copy [raw/ghl--webhooks--integration-guide-and-signature-verification.md]
- `INSTALL`/`UNINSTALL` app-lifecycle events go only to the app's configured "Default Webhook URL," not arbitrary subscription endpoints [raw/ghl--webhooks--integration-guide-and-signature-verification.md, raw/ghl--sdk--official-typescript-sdk-and-error-handling.md]

### Inbound webhook trigger (external system -> HighLevel workflow)

- Configured as a workflow trigger; generates a unique per-trigger URL; accepts `POST`/`GET`/`PUT` with a JSON body only [raw/ghl--webhooks--inbound-trigger-workflow-setup.md]
- Premium trigger: available on paid Agency plans ($97 and up), 100 free executions per sub-account, rebilling must be enabled per existing sub-account [raw/ghl--webhooks--inbound-trigger-workflow-setup.md]
- **Email or phone is mandatory in the payload if the workflow includes a Find/Create Contact step**; the workflow can otherwise run "contactless" if that step is removed [raw/ghl--webhooks--inbound-trigger-workflow-setup.md]
- Arrays are not usable inside custom-value-driven actions even though they can be sent in the payload [raw/ghl--webhooks--inbound-trigger-workflow-setup.md]
- Field mapping is bound to the sample payload captured at setup time -- a payload shape change requires re-selecting the Mapping Reference [raw/ghl--webhooks--inbound-trigger-workflow-setup.md]
- **No documented signature or auth mechanism on inbound trigger URLs** -- the URL itself is the only secret. Compromise recovery is delete-and-recreate (breaks every existing integrator pointed at the old URL); there is no rotation API [raw/ghl--webhooks--inbound-trigger-workflow-setup.md -- GAP: no inbound-webhook authentication scheme documented anywhere in this research]

## 5. Workflows and triggers API surface

There is no workflow-authoring API. The only two documented mechanisms to connect an external system to GHL automation are: (1) the inbound webhook trigger (§4) for "I don't have a contact yet," and (2) `POST /contacts/:contactId/workflow/:workflowId` for "I already have/created a contact via the API and want to push them into an existing, manually-built workflow" [raw/ghl--workflows--add-contact-to-workflow-endpoint.md]. Both require the workflow to already exist and be built by hand in the GHL UI.

## 6. Rate limits, pagination, errors

| Environment | Burst limit | Daily limit |
|---|---|---|
| Production (OAuth apps) | 100 requests / 10s per app (client) per resource (Location or Company) | 200,000 requests / day per app per resource [raw/ghl--versioning--v3-status-and-rate-limits-official.md] |
| Sandbox PIT | 25 requests / 10s | 10,000 requests / day (per location; does not multiply with more PITs) [raw/ghl--auth--sandbox-private-integration-tokens.md] |

- Response headers for tracking usage: `X-RateLimit-Limit-Daily`, `X-RateLimit-Daily-Remaining`, `X-RateLimit-Interval-Milliseconds`, `X-RateLimit-Max`, `X-RateLimit-Remaining` [raw/ghl--versioning--v3-status-and-rate-limits-official.md]
- Limits are per app-per-resource: an app installed on two locations gets a full independent allowance for each [raw/ghl--versioning--v3-status-and-rate-limits-official.md]
- Common error codes observed across sources: `401` (bad/expired/under-scoped token), `404` (record not found or belongs to a different location than the token), `422` (missing required field -- e.g. neither email nor phone present -- or invalid custom field ID), `429` (rate limited; honor `Retry-After`) [raw/ghl--contacts--create-update-upsert-recipes.md, raw/ghl--sdk--official-typescript-sdk-and-error-handling.md]
- Pagination: cursor-style (`startAfter` timestamp cursor seen in SDK examples) for most list endpoints; **at least one resource (payment transactions, per a secondary source) paginates by offset rather than cursor** -- verify per-endpoint rather than assuming one pagination model platform-wide [raw/ghl--versioning--v3-announcement-and-resource-catalog.md -- GAP: no official page in this archive gives a single canonical pagination spec across all resources]
- Idempotency: **no documented `Idempotency-Key` header or equivalent mechanism anywhere in this research.** Retries of `POST /contacts` (outside `/contacts/upsert`) can create duplicate contacts per the vendor blog's own warning [raw/ghl--contacts--create-update-upsert-recipes.md -- GAP: no first-party idempotency mechanism found; use `/contacts/upsert` or search-then-branch to approximate idempotency at the application layer]

## 7. Marketplace apps: creation, distribution, sandbox

- App creation: Developer Portal > My Apps > Create App; start Private while building, switch to Public when ready for wider distribution [raw/ghl--marketplace--app-creation-and-distribution-model.md]
- Three irreversible-once-set distribution fields: target user (Agency vs Sub-account), who can install (Both vs Agency Only), bulk-installable (Yes/No, defaults mandatory Yes for new apps) [raw/ghl--marketplace--app-creation-and-distribution-model.md]
- The recommended, most-capable distribution path ("[NEW and RECOMMENDED]": Sub-account target, both/agency-only install, bulk Yes, agency user installs) requires the most integration work: enumerate installed sub-accounts, mint a location token per sub-account via the agency token, and listen for `AppInstall` webhooks to catch future installs [raw/ghl--marketplace--app-creation-and-distribution-model.md]
- Scopes: request the minimum needed; over-scoping slows marketplace review and increases install-time user distrust [raw/ghl--marketplace--app-creation-and-distribution-model.md]
- Sandbox accounts: isolated, rate-limited (§6), Fair-Use governed, **active up to 6 months from creation** then subject to deactivation (reactivation is a manual request) [raw/ghl--marketplace--sandbox-testing-environment.md]
- Sandbox now supports PIT creation and testing (previously did not) -- full OAuth, scopes, webhook (at "low volume"), and workflow testing is possible without a production account [raw/ghl--marketplace--sandbox-testing-environment.md, raw/ghl--auth--sandbox-private-integration-tokens.md]
- App-version testing uses a generated "Test Link" scoped to a specific Location ID, installed manually before functional testing [raw/ghl--marketplace--sandbox-testing-environment.md]

## 8. Common integration patterns

- **Lead capture from an external form into a location**: create/upsert the contact with `source` explicitly set (e.g. `"source": "public api"`), since automatic UTM/attribution capture **only fires for native GHL forms, surveys, calendars, chat widgets, and order forms** -- a contact created purely via the public API gets none of that automatically and is otherwise classified under attribution rule #11 ("Third-Party integration") if any classification applies at all [raw/ghl--custom-fields-values--field-and-value-types.md]
- **Dedupe/upsert semantics**: prefer `POST /contacts/upsert` (matches by email, then phone); fall back to search-then-branch if unavailable; `create_new_if_duplicate_allowed` can force-create even when a location normally blocks duplicates [raw/ghl--contacts--openapi-upsert-schema.md]
- **Attribution/source fields**: `contact.attributionSource.*` (first touch) and `contact.lastAttributionSource.*` (latest touch) merge fields exist and are always populated for native-capture contacts, covering UTM source/medium/campaign/content, click IDs (`gclid`, `fbclid`/`ctwa_clid`), referrer, campaign ID [raw/ghl--custom-fields-values--field-and-value-types.md]
- **Push external events into automation**: inbound webhook trigger for net-new leads without a known contact ID; `add-contact-to-workflow` once a contact is already resolved via the Contacts API [raw/ghl--workflows--add-contact-to-workflow-endpoint.md, raw/ghl--webhooks--inbound-trigger-workflow-setup.md]

## 9. Known gotchas (consolidated)

1. **v1 endpoints still work but are a dead end** -- no new keys issued since the deprecation, no patches, no support [raw/ghl--versioning--v3-status-and-rate-limits-official.md]
2. **Agency vs Location token scoping mistakes**: most CRM writes need a Location token; an Agency token must be exchanged via `/oauth/locationToken` first [raw/ghl--auth--oauth2-authorization-code-flow-official.md]
3. **`oauth.readonly` + Agency PIT cannot check app-install state** -- must use the app's own OAuth context instead [raw/ghl--auth--scopes-reference-official.md]
4. **Full-array-replace semantics on `tags` and custom-field `options`** -- read, merge, then write, or you silently drop data [raw/ghl--contacts--create-update-upsert-recipes.md, raw/ghl--custom-fields-values--field-and-value-types.md]
5. **Custom field values are always keyed by field ID, never by name** -- resolve the ID via the Custom Fields list endpoint first [raw/ghl--contacts--openapi-upsert-schema.md]
6. **`/opportunities/search` uses snake_case query params**, breaking the platform's otherwise-consistent camelCase convention [raw/ghl--opportunities--pipelines-and-crud-endpoints.md]
7. **Inbound webhook trigger URLs have no documented auth** -- treat the URL itself as a bearer secret; rotation is delete-and-recreate [raw/ghl--webhooks--inbound-trigger-workflow-setup.md]
8. **Webhook signature scheme is mid-migration** -- `X-WH-Signature` (RSA) sunsets 2026-09-01; build for `X-GHL-Signature` (Ed25519) now [raw/ghl--webhooks--integration-guide-and-signature-verification.md]
9. **Sandbox is time-boxed (6 months) and rate-limited well below production** (25/10s & 10k/day vs 100/10s & 200k/day) -- plan longer projects accordingly [raw/ghl--marketplace--sandbox-testing-environment.md, raw/ghl--auth--sandbox-private-integration-tokens.md]
10. **No native upsert claims in the wild are wrong** -- `POST /contacts/upsert` exists per the official OpenAPI schema, contradicting at least one contemporary vendor blog [raw/ghl--contacts--create-update-upsert-recipes.md, raw/ghl--contacts--openapi-upsert-schema.md]
11. **No idempotency-key mechanism documented anywhere** -- retried `POST /contacts` calls (outside `/contacts/upsert`) can create duplicates [raw/ghl--contacts--create-update-upsert-recipes.md]
12. **v3 general availability is itself disputed between sources** -- verify against your own developer portal before depending on any v3-only shape [raw/ghl--versioning--v3-status-and-rate-limits-official.md, raw/ghl--versioning--v3-announcement-and-resource-catalog.md]

## 10. Explicit research gaps (do not guess past these)

- Exact refresh-token TTL is only sourced from a community blog, not confirmed by an official page in this archive.
- Whether a v3-specific `POST /conversations/messages` payload truly requires `subType`+`status` is sourced only from third-party MCP tooling, not an official v3 doc page.
- No single official page in this archive documents pagination mechanics uniformly across all resources; at least one resource (payments) is known to differ (offset vs cursor).
- No official documentation of an idempotency-key header or equivalent was found anywhere in this research pass.
- No documented authentication/signature mechanism for **inbound** webhook trigger URLs (only outbound webhooks are signed).
