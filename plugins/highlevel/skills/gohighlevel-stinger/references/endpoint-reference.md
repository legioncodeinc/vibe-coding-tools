# Endpoint reference

Base URL for every call: `https://services.leadconnectorhq.com`. Every request needs a `Version` header (date-based, e.g. `2021-07-28`, or `v3` where confirmed live in your own developer portal). Grounding: [raw/ghl--versioning--v3-announcement-and-resource-catalog.md], [raw/ghl--versioning--v3-status-and-rate-limits-official.md].

## Auth

| Method | Endpoint | Purpose | Scope |
|---|---|---|---|
| POST | `/oauth/token` | Exchange authorization code (or refresh token) for access + refresh token | none (client credentials in body) [raw/ghl--auth--agency-vs-location-access-tokens.md] |
| POST | `/oauth/locationToken` | Exchange an Agency-level access token for a Location-level access token | requires an Agency (`Company`) token [raw/ghl--auth--oauth2-authorization-code-flow-official.md] |
| GET | `/oauth/installedLocations` | List locations where the calling app is installed | `oauth.readonly`, **app OAuth context only, not Agency PIT-compatible** [raw/ghl--auth--scopes-reference-official.md] |

## Contacts

| Method | Endpoint | Purpose | Scope |
|---|---|---|---|
| POST | `/contacts` | Create a contact | `contacts.write` [raw/ghl--contacts--create-update-upsert-recipes.md] |
| GET | `/contacts/{contactId}` | Get a contact | `contacts.readonly` |
| PUT | `/contacts/{contactId}` | Update a contact (full-array-replace on `tags`) | `contacts.write` |
| DELETE | `/contacts/{contactId}` | Delete a contact | `contacts.write` |
| GET | `/contacts/search` | Search contacts (filters incl. email, phone, tags, custom fields) | `contacts.readonly` |
| POST | `/contacts/upsert` | Create-or-update, matches by email then phone; `create_new_if_duplicate_allowed` overrides | `contacts.write` [raw/ghl--contacts--openapi-upsert-schema.md] |
| POST | `/contacts/:contactId/workflow/:workflowId` | Enroll an existing contact into an existing workflow | `contacts.write` [raw/ghl--workflows--add-contact-to-workflow-endpoint.md] |

## Custom fields / values

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/locations/:locationId/customFields` | List custom field definitions for a location [raw/ghl--custom-fields-values--field-and-value-types.md] |
| GET / PUT / DELETE | `/custom-fields/{id}` (v2) | Manage a custom field definition. Creation "only supports Custom Objects and Company (Business) today" |
| n/a (embedded) | `customFields: [{id, value}]` on any contact/opportunity write | Set field values by field **ID**, never by name |

## Opportunities / pipelines

| Method | Endpoint | Purpose | Scope |
|---|---|---|---|
| GET | `/opportunities/pipelines` | List pipelines and stages (call first to resolve IDs) | `opportunities.readonly` [raw/ghl--opportunities--pipelines-and-crud-endpoints.md] |
| GET | `/opportunities/search` | Search opportunities (**snake_case** query params: `location_id`, `pipeline_id`) | `opportunities.readonly` |
| GET | `/opportunities/{id}` | Get one opportunity | `opportunities.readonly` |
| POST | `/opportunities/` | Create an opportunity | `opportunities.write` |
| PUT | `/opportunities/{id}` | Update an opportunity | `opportunities.write` |
| PUT | `/opportunities/{id}/status` | Update opportunity status | `opportunities.write` |
| DELETE | `/opportunities/{id}` | Delete an opportunity | `opportunities.write` |

## Calendars / appointments

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/calendars/schedules/event-calendar/:calendarId` | Get availability schedule for a calendar [raw/ghl--calendars-conversations--endpoints-overview.md] |
| POST / PUT / GET | Create / Update / Get Appointment | Appointment CRUD (see calendars doc index) |
| GET | Get Calendar Events | List events on a calendar |

## Conversations / messages

| Method | Endpoint | Purpose | Scope |
|---|---|---|---|
| GET | `/conversations/search` | Search conversation threads | `conversations.readonly` [raw/ghl--calendars-conversations--endpoints-overview.md] |
| GET | `/conversations/{id}/messages` | List messages in a thread | `conversations/message.readonly` |
| POST | `/conversations/messages` | Send a message (`type`: SMS, RCS, Email, WhatsApp, IG, FB, Custom, Live_Chat, TIKTOK) | `conversations/message.write` |

## Users / locations (sub-accounts)

| Method | Endpoint | Purpose |
|---|---|---|
| GET / PUT | `/users/*` | Manage users, roles, permissions [raw/ghl--auth--scopes-reference-official.md] |
| POST | `/locations/` | Create a sub-account (Agency Pro plan only, per community mirror) [raw/ghl--auth--v1-to-v2-migration-official-blog.md] |
| GET | `/locations/{id}` | Get a sub-account |
| PUT | `/locations/:locationId/tags/:tagId` | Update a location-level tag |

## Workflows

| Method | Endpoint | Purpose | Notes |
|---|---|---|---|
| GET | `/workflows/` | List workflows | No workflow-authoring endpoint exists at any version in this research [raw/ghl--workflows--add-contact-to-workflow-endpoint.md] |
| POST | `/contacts/:contactId/workflow/:workflowId` | Add a contact to a workflow (optional `eventStartTime`) | `contacts.write` |

## Webhooks

Not a REST resource to call -- webhooks are configured in the Marketplace app listing (outbound, HighLevel-signed) or as an Inbound Webhook Trigger inside a workflow (inbound, unauthenticated URL secret). See `references/webhook-payload-examples.md` and `guides/04-webhooks-inbound-and-outbound.md`.
