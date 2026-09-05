# GoHighLevel Contacts API: Create and Update Recipes (RocketLauncher)

- URL: https://rocketlauncher.ai/api/contacts-create-update-recipes
- Fetched: 2026-08-14
- Source type: Vendor/consultancy blog (secondary), dated 2026-05-28
- Component: contacts - create, update, upsert-by-lookup pattern, error codes

## Key facts

- Base URL confirmed again: `https://services.leadconnectorhq.com`. Every request needs `Authorization: Bearer <token>`, `Content-Type: application/json`, `Version: 2021-07-28`.
- "Every request needs an Authorization header with a Bearer token... The Location-Id header is required for all contact endpoints." (Note: in most worked examples on this and other sites, `locationId` travels in the JSON body rather than a header -- treat header-vs-body placement as endpoint-specific and verify per call.)

## Create contact

```bash
curl -X POST https://services.leadconnectorhq.com/contacts \
  -H "Authorization: Bearer <GHL_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -H "Version: 2021-07-28" \
  -d '{
    "locationId": "YOUR_LOCATION_ID",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "+14155550101",
    "tags": ["lead", "webinar-signup"],
    "customFields": [{ "id": "CUSTOM_FIELD_ID", "value": "Acme Corp" }]
  }'
```

Response `201 Created`: `{ "contact": { "id": "abc123xyz", "locationId": "...", ..., "dateAdded": "...", "dateUpdated": "..." } }`.

## Update contact

- `PUT /contacts/{contactId}` -- "You only need to send the fields you want to change; unset fields keep their current values." But: **"To add a tag without removing existing ones, read the contact first, merge the tag arrays, then PUT the merged array. The API replaces the whole tags array on update."**

## Upsert pattern (this source's claim)

- "GoHighLevel does not have a native upsert endpoint. The standard pattern is: search for the contact by email, then create it if missing or update it if found." Worked example searches `GET /contacts/search?locationId=...&email=...`, then branches to `PUT /contacts/{id}` or `POST /contacts`.
- FAQ: "Does GoHighLevel have a native upsert endpoint? No. As of 2026, the API does not have a single upsert call."

## Error codes (as documented by this source)

- `401 Unauthorized`: token missing/expired or lacks `contacts.write` scope.
- `422 Unprocessable Entity`: payload missing both email and phone, or a custom field ID does not exist in the location.
- `429 Too Many Requests`: rate limit hit; use the `Retry-After` header for backoff.
- `404 Not Found` on PUT: `contactId` does not belong to the location identified by the token.
- "Duplicate contacts: if you call POST twice with the same email, GoHighLevel may create two contacts. Always run the lookup-then-upsert pattern for external syncs."

## Notes for the distillation

**This source's central claim -- "no native upsert endpoint exists" -- directly conflicts with multiple other sources in this archive** that document a live `POST /contacts/upsert` endpoint (see `ghl--contacts--openapi-upsert-schema.md`, which reproduces the OpenAPI `UpsertContactsResponse` schema, and the smartmarketingarchitect.com GHL-MCP documentation, which states: "Upsert (create or update): `POST /contacts/upsert` Matches on email or phone."). The likely explanation: `POST /contacts/upsert` is a real v2 endpoint that this particular blog post's author either wasn't aware of or considered non-standard; it is documented directly in HighLevel's own OpenAPI spec. **Prefer `POST /contacts/upsert` as the primary integration pattern** and treat the manual search-then-branch pattern in this file as a fallback for anyone who cannot confirm the upsert endpoint is live on their API version. State both readings in the distillation.
