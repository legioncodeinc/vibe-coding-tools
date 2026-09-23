# 08. Troubleshooting

Symptom-first index. Every entry cites the raw source backing the diagnosis.

## "401 Unauthorized" on a call that used to work

- Access token expired (~24h lifetime, confirmed `expires_in: 86399`) -- refresh it [raw/ghl--auth--agency-vs-location-access-tokens.md].
- Using an Agency (`Company`) token against a Location-scoped endpoint -- exchange it via `POST /oauth/locationToken` first [raw/ghl--auth--oauth2-authorization-code-flow-official.md].
- Token lacks the required scope for that endpoint -- check `references/endpoint-reference.md` for the scope column.
- PIT was rotated/regenerated in the UI and the old value is still deployed -- PITs do not auto-refresh, so a rotation is a hard cutover [raw/ghl--auth--private-integration-tokens-official.md].

## "404 Not Found" on a contact/record that definitely exists

- `contactId`/`locationId` mismatch: the record belongs to a different sub-account than the one your token is scoped to [raw/ghl--contacts--create-update-upsert-recipes.md].

## "422 Unprocessable Entity" on contact create/update

- Neither `email` nor `phone` is present in the payload -- at least one is required [raw/ghl--contacts--create-update-upsert-recipes.md].
- A `customFields[].id` doesn't exist in the target location -- IDs are per-location, not global; re-fetch `GET /locations/:locationId/customFields` [raw/ghl--custom-fields-values--field-and-value-types.md].

## Duplicate contacts appearing from the same integration

- You're calling raw `POST /contacts` on every sync run instead of `POST /contacts/upsert` -- switch to upsert, which matches on email then phone [raw/ghl--contacts--create-update-upsert-recipes.md, raw/ghl--contacts--openapi-upsert-schema.md].
- A retried request (network blip, timeout) re-created the contact because there is no idempotency-key mechanism on this API -- this is a documented gap, not a bug on your end; design retries to hit `/contacts/upsert` specifically [raw/ghl--contacts--create-update-upsert-recipes.md -- GAP].

## Tag update wiped out existing tags

- `PUT /contacts/{contactId}` replaces the entire `tags` array. Read-merge-write, don't write a partial array [raw/ghl--contacts--create-update-upsert-recipes.md].

## `GET /opportunities/search` returns empty even though the pipeline has opportunities

- This endpoint uniquely uses **snake_case** query params (`location_id`, `pipeline_id`) instead of the camelCase used everywhere else in the API -- check your query string casing [raw/ghl--opportunities--pipelines-and-crud-endpoints.md].

## Webhook signature verification fails intermittently

- You're verifying a re-serialized JSON object instead of the exact raw request bytes -- re-serialization can reorder keys and break the signature. Verify against the raw body [raw/ghl--webhooks--integration-guide-and-signature-verification.md].
- You're only checking `X-WH-Signature` (legacy RSA) -- prefer `X-GHL-Signature` (Ed25519) when present; the legacy header is deprecated 2026-09-01 [raw/ghl--webhooks--integration-guide-and-signature-verification.md].
- You're using a stale copy of the public key -- HighLevel rotates it occasionally with email/Slack notice; pull the current key rather than hard-coding it [raw/ghl--webhooks--integration-guide-and-signature-verification.md].

## Inbound webhook trigger isn't firing the workflow

- Payload isn't valid JSON, or isn't POST/GET/PUT -- those are the only supported combinations [raw/ghl--webhooks--inbound-trigger-workflow-setup.md].
- Payload keys contain spaces -- use CamelCase or snake_case single-string keys.
- Missing email/phone while the workflow includes a Find/Create Contact step -- that step requires one or the other. Remove the step if you need a truly contactless workflow [raw/ghl--webhooks--inbound-trigger-workflow-setup.md].
- Payload shape changed since setup -- re-select the Mapping Reference inside the trigger configuration; mapping is bound to the sample captured at setup time, not inferred per request [raw/ghl--webhooks--inbound-trigger-workflow-setup.md].
- The trigger URL was rotated (deleted and recreated after a suspected leak) and the sender still has the old URL -- there is no rotation API, only delete-and-recreate, which requires updating every sender manually [raw/ghl--webhooks--inbound-trigger-workflow-setup.md].

## Agency-level Private Integration Token can't tell me if my app is installed on a location

- Known trap: `oauth.readonly` is not assignable to an Agency PIT, and `GET /oauth/installedLocations` is scoped to an app's own OAuth context, not a generic Agency PIT. There is no PIT-compatible substitute documented anywhere in this research -- this check must go through the app's OAuth token [raw/ghl--auth--scopes-reference-official.md].

## 429 Too Many Requests during development/testing

- You're testing against a Sandbox PIT, whose limits (25 req/10s, 10,000/day) are far below production (100/10s, 200,000/day) -- this is expected Sandbox behavior, not a bug [raw/ghl--auth--sandbox-private-integration-tokens.md].
- Honor `Retry-After` and add jitter to your backoff [raw/ghl--sdk--official-typescript-sdk-and-error-handling.md].

## Endpoint or field looks different than documented here

- You may be looking at v3 behavior while this research is grounded mostly in v2 (`Version: 2021-07-28`), or vice versa. **v3's general-availability status is itself disputed between an official support article and a vendor announcement in this research's own archive** -- check the version switcher in your own developer portal and re-verify the specific endpoint before trusting either source blindly [raw/ghl--versioning--v3-status-and-rate-limits-official.md, raw/ghl--versioning--v3-announcement-and-resource-catalog.md].

## v1 endpoint suddenly stopped working / can't get a new API key

- Expected. V1 reached end-of-support 2025-12-31: no new keys issued, no fixes, no support. Migrate to v2 (PIT or OAuth per `guides/01-auth-and-tokens.md`) [raw/ghl--versioning--v3-status-and-rate-limits-official.md, raw/ghl--auth--v1-to-v2-migration-official-blog.md].
