# 02. Contacts and custom fields

## Core operations

| Operation | Endpoint | Notes |
|---|---|---|
| Create | `POST /contacts` | Needs at least `email` or `phone`, or `422` [raw/ghl--contacts--create-update-upsert-recipes.md] |
| Read | `GET /contacts/{contactId}` | |
| Update | `PUT /contacts/{contactId}` | Only send fields you want to change -- **except `tags`, which is a full-array replace** |
| Search | `GET /contacts/search` | Filter by name, email, phone, tags, custom field values, dates |
| Delete | `DELETE /contacts/{contactId}` | |
| Upsert | `POST /contacts/upsert` | Matches email then phone; see below |

## Upsert is real -- use it

HighLevel's own OpenAPI spec defines `UpsertContactInput` -> `UpsertContactsResponse` (with a `new: boolean` flag) for `POST /contacts/upsert` [raw/ghl--contacts--openapi-upsert-schema.md]. At least one 2026 vendor blog claims no upsert endpoint exists and recommends a manual search-then-branch pattern instead [raw/ghl--contacts--create-update-upsert-recipes.md]. **This distillation prefers the schema evidence: use `/contacts/upsert` as your default.** Keep search-then-branch (`GET /contacts/search` -> `PUT` or `POST`) as a fallback if you cannot confirm upsert is live on your account/API version, and always smoke-test both patterns against a Sandbox account before shipping.

`create_new_if_duplicate_allowed: true` forces a new contact even when the location's duplicate-contact setting would otherwise block it -- this overrides normal upsert matching, use it deliberately [raw/ghl--contacts--openapi-upsert-schema.md].

## Tags: full replace, not merge

`PUT /contacts/{contactId}` replaces the entire `tags` array. To add a tag without losing existing ones: read the contact, merge tag arrays client-side, then `PUT` the merged array [raw/ghl--contacts--create-update-upsert-recipes.md].

## Custom fields

- Values are always sent/read as `{ "id": "<customFieldId>", "value": "<value>" }` -- **never by field name**, in every schema and worked example across this entire research set [raw/ghl--contacts--openapi-upsert-schema.md].
- Resolve field IDs once per location via `GET /locations/:locationId/customFields`, cache the name->ID map. IDs are not portable across sub-accounts even when names match.
- `dataType` values observed: `TEXT`, `LARGE_TEXT`, `NUMERICAL`, `PHONE`, `MONETARY`, `CHECKBOX`, `SINGLE_OPTIONS`, `MULTIPLE_OPTIONS`, `RADIO`, `TEXTBOX_LIST`, and more [raw/ghl--custom-fields-values--field-and-value-types.md].
- Creating a *new* custom field definition via the Custom Fields API "only supports Custom Objects and Company (Business) today" per the official endpoint doc -- contacts/opportunities already have existing custom field support elsewhere, this limitation is specifically about creating brand-new field definitions through that particular endpoint family [raw/ghl--custom-fields-values--field-and-value-types.md].
- Updating a field's `options` array **replaces it entirely** -- include all existing options plus any new ones; removal via this endpoint is not supported [raw/ghl--custom-fields-values--field-and-value-types.md].

## Custom Fields vs Custom Values vs Custom Objects

- **Custom Fields**: per-record data on contacts/opportunities (e.g. a birthday, a budget range).
- **Custom Values**: reusable static placeholders used across templates/workflows/funnels (e.g. company phone number in an email footer). Not attached to individual records.
- **Custom Objects**: user-defined data structures beyond the built-in contact/opportunity model (e.g. subscription plans, inventory, property listings). Field keys for custom-object fields follow `custom_object.{objectKey}.{fieldKey}`.

[raw/ghl--custom-fields-values--field-and-value-types.md]

## Attribution / source

Native GHL forms, surveys, calendars, chat widgets, and order forms auto-populate `contact.attributionSource.*` and `contact.lastAttributionSource.*`. **A contact created through the public Contacts API does not get this automatically.** Set `source` explicitly on every create/upsert call, and consider mirroring UTM values into dedicated custom fields if attribution reporting matters downstream. Full walkthrough: `references/field-mapping-worksheet.md` and `guides/05-lead-intake-integration-pattern.md` [raw/ghl--custom-fields-values--field-and-value-types.md].

## Errors to expect

`401` (bad/expired/under-scoped token), `404` (contact belongs to a different location than the token), `422` (missing email+phone, or unknown custom field ID), `429` (rate limited, honor `Retry-After`) [raw/ghl--contacts--create-update-upsert-recipes.md].
