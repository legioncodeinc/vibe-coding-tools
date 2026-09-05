# 05. Lead intake integration pattern: external site form -> GoHighLevel location

The canonical pattern for pushing a lead from an external website/form into a GHL sub-account, with correct dedupe and attribution.

## Choose your entry point

| Situation | Entry point |
|---|---|
| You control the backend receiving the form submission and want full control | Call the Contacts API directly (`POST /contacts/upsert`) |
| You want a no-code/low-code bridge (Zapier, Make, a static form host) | Inbound Webhook Trigger on a workflow |

Both converge on the same underlying contact record; pick based on where your form-handling logic already lives.

## Pattern A: direct API call

1. Collect the submission server-side (never expose a PIT to the browser).
2. Validate: require at least `email` or `phone`.
3. Set `source` explicitly (e.g. `"source": "webform-acme-landing"`) -- native UTM attribution does **not** fire for API-created contacts [raw/ghl--custom-fields-values--field-and-value-types.md].
4. Resolve any custom field IDs you need (cache the name->ID map per location -- see `guides/02-contacts-and-custom-fields.md`).
5. Call `POST /contacts/upsert` with `locationId`, standard fields, `tags`, `customFields`. See `references/request-examples.md` §3.
6. If you also need the lead in a pipeline, call `GET /opportunities/pipelines` once (cache it), then `POST /opportunities/` with the resolved `contactId`, `pipelineId`, `pipelineStageId`.
7. Optionally enroll the contact in a nurture workflow: `POST /contacts/:contactId/workflow/:workflowId`.

[raw/ghl--contacts--openapi-upsert-schema.md, raw/ghl--opportunities--pipelines-and-crud-endpoints.md, raw/ghl--workflows--add-contact-to-workflow-endpoint.md]

## Pattern B: inbound webhook trigger

1. Build a workflow in the target sub-account: Inbound Webhook Trigger -> Find/Create Contact -> whatever else (tag, add to pipeline via a workflow action, send a notification).
2. Copy the generated URL into your form handler / Zapier / Make scenario.
3. POST a flat JSON object with single-word keys (CamelCase or snake_case), including `email` or `phone`.
4. Send one real test submission, then map the received fields inside the trigger UI to contact fields and custom values.
5. Publish the workflow.

[raw/ghl--webhooks--inbound-trigger-workflow-setup.md]

Because there is no documented auth on the inbound trigger URL, treat it as a secret in your own systems even though GHL does not enforce that (see `guides/04-webhooks-inbound-and-outbound.md`).

## Dedupe / upsert semantics (applies to both patterns)

`POST /contacts/upsert` matches on email first, then phone, and returns `new: true|false` so you can branch on "was this actually a new lead." Use `create_new_if_duplicate_allowed: true` only when you deliberately want duplicate contacts (rare). The Inbound Webhook Trigger's Find/Create Contact step performs the equivalent match-or-create internally, but does not expose the same explicit override flag [raw/ghl--contacts--openapi-upsert-schema.md, raw/ghl--webhooks--inbound-trigger-workflow-setup.md].

## Attribution / source fields

Since API-created and webhook-trigger-created contacts bypass native GHL capture surfaces, they do not automatically get `attributionSource`/`lastAttributionSource` populated. Two options:

1. **Minimum viable**: always set `source` to a stable, human-readable string identifying the integration and campaign.
2. **Full attribution**: capture UTM parameters client-side on your own form, pass them through in the payload, and map them into dedicated custom fields with first-touch (write-once, IF/ELSE-guarded) and last-touch (always-overwrite) variants, mirroring how native GHL attribution itself separates first vs. latest touch.

[raw/ghl--custom-fields-values--field-and-value-types.md]

## Rate-limit budget for a launch

Production OAuth apps: 100 requests/10s and 200,000/day per app per resource. Sandbox PITs during testing: 25 requests/10s and 10,000/day. If you're load-testing a lead-intake integration before launch, do it against a Sandbox account's documented limits, not production assumptions -- see `guides/06-rate-limits-and-reliability.md` [raw/ghl--versioning--v3-status-and-rate-limits-official.md, raw/ghl--auth--sandbox-private-integration-tokens.md].

## Idempotency note

No `Idempotency-Key` header or equivalent mechanism is documented anywhere in this research. A retried `POST /contacts` (outside of `/contacts/upsert`) can create a duplicate. Prefer `/contacts/upsert` for any retriable call path specifically because it is the closest thing this API has to an idempotent write [raw/ghl--contacts--create-update-upsert-recipes.md -- GAP].
