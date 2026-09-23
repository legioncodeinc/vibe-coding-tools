# Field-mapping worksheet: external system -> GoHighLevel contact

Use this before wiring any lead-capture or sync integration. Grounding: [raw/ghl--contacts--openapi-upsert-schema.md], [raw/ghl--custom-fields-values--field-and-value-types.md], [raw/ghl--contacts--create-update-upsert-recipes.md].

## Step 1: standard contact fields

| External field (example) | GHL field | Type | Notes |
|---|---|---|---|
| first_name | `firstName` | string | nullable |
| last_name | `lastName` | string | nullable |
| full_name | `name` | string | overrides first/last display in some contexts |
| email_address | `email` | string | used for upsert match (checked first) |
| phone_number | `phone` | string | used for upsert match (checked second); format E.164 (`+14155550101`) before sending |
| street | `address1` | string | |
| city | `city` | string | |
| state / province | `state` | string | |
| zip / postcode | `postalCode` | string | |
| company | `companyName` | string | |
| country_code | `country` | string | e.g. `US` |
| lead_source | `source` | string | **set explicitly** -- native UTM attribution does not fire for API-created contacts (see Step 3) |
| do-not-contact flag | `dnd` | boolean | |
| tag_list | `tags` | string[] | **full-array replace on update** -- read existing tags, merge, then write |

`locationId` is required on every write and is not itself a "contact field" -- it identifies the sub-account.

## Step 2: custom fields

Custom field values are never addressed by name. Resolve each field's ID once via `GET /locations/:locationId/customFields`, then send:

```json
"customFields": [
  { "id": "MgobCB14YMVKuE4Ka8p1", "value": "Acme Corp" }
]
```

| External field | GHL custom field name (example) | Resolved ID (cache this) | dataType |
|---|---|---|---|
| how_did_you_hear | "How did you hear about us" | *(fill in per account)* | SINGLE_OPTIONS |
| budget_range | "Budget Range" | *(fill in per account)* | SINGLE_OPTIONS |
| notes | "Intake Notes" | *(fill in per account)* | LARGE_TEXT |

Cache the name->ID map per location; it is not portable across sub-accounts, since each location has its own custom field IDs even if names match. [raw/ghl--custom-fields-values--field-and-value-types.md]

## Step 3: attribution / source fields

Native GHL forms, surveys, calendars, chat widgets, and order forms auto-populate `contact.attributionSource.*` (first touch) and `contact.lastAttributionSource.*` (latest touch): `sessionSource`, `url`, `campaign`, `utmSource`, `utmMedium`, `utmContent`, `referrer`, `campaignId`, `clickId`, `utmKeyword`, `utmMatchType`, `adGroupId`, `adId`.

**A contact created purely through the public Contacts API does not get this automatically.** If attribution matters downstream (reporting, revenue-source rollups), either:

1. Set `source` explicitly (e.g. `"source": "public api"` or `"source": "webform-acme-landing"`), and/or
2. Mirror the UTM parameters your form captured into dedicated custom fields (first-touch and last-touch variants, written with an IF/ELSE guard so first-touch is written once and never overwritten -- see `guides/05-lead-intake-integration-pattern.md`).

[raw/ghl--custom-fields-values--field-and-value-types.md]

## Step 4: dedupe strategy

| Strategy | When to use |
|---|---|
| `POST /contacts/upsert` (matches email, then phone) | Default. Simplest, one call, returns `new: true/false`. |
| Search-then-branch (`GET /contacts/search` -> `PUT`/`POST`) | Fallback if upsert is unavailable on your API version, or you need custom match logic beyond email/phone. |
| `create_new_if_duplicate_allowed: true` | Force-create even when the location's duplicate-contact setting would normally block it -- use deliberately, not by default. |

[raw/ghl--contacts--openapi-upsert-schema.md, raw/ghl--contacts--create-update-upsert-recipes.md]

## Step 5: validation before sending

- At least one of `email` or `phone` must be present, or the API returns `422`.
- Phone numbers should be E.164-formatted before sending.
- Every custom field `id` must exist in the target location or the write returns `422`.
- `locationId` in the request must match the location the token is scoped to, or you get `404`/`401` depending on the mismatch.
