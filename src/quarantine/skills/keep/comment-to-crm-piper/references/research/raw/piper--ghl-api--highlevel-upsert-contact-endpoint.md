# Upsert Contact (HighLevel API v2, Developer Portal)

- **Title:** Upsert Contact
- **URL:** https://marketplace.gohighlevel.com/docs/ghl/contacts/upsert-contact/index.html
- **Fetched:** 2026-08-17
- **Source type:** official-docs (HighLevel Marketplace developer documentation)

## Extracted content

**Endpoint and method**

```
POST /contacts/upsert
```

**Request body fields named in the page:** `firstName`, `lastName`, `email`, `phone`,
`tags`, `source`, `customFields`, `locationId`. The page as fetched does not render the
complete schema with types and required flags, so treat this list as observed-but-partial.

**How the upsert decides create versus update.** The API

> "will attempt to identify an existing contact based on the priority sequence specified in
> the setting"

meaning the location-level Allow Duplicate Contact configuration governs API upserts, not
a separate API rule. And, importantly:

> "When both email and phone are present and separate contacts exist for each, the API will
> update the contact that matches the first field in the configured sequence, and ignore the
> second field to prevent duplication."

**Response shape.** A 200 response exists. The fetched content does not render the response
body, so whether a boolean indicating "newly created" is returned is unconfirmed here.

**Scopes and rate limits.** Not shown in the fetched content.

## Gaps in this source

- Required OAuth scope not captured.
- Rate limits not captured.
- Whether the response distinguishes a created record from an updated one is not
  captured, which matters for producing an honest dedupe report.

## Claims this source supports

1. A native upsert exists, so tier 1 of the skill's connector ladder does not have to
   implement create-versus-update logic by hand.
2. The API honors the SAME location-level dedupe configuration the UI uses. The connector
   path and the import path therefore behave consistently.
3. The API silently picks one match when email and phone point at two different existing
   contacts. That is a real merge hazard: two records stay split, one gets updated, and
   nothing surfaces the collision. A skill must check for it before upserting rather than
   trusting the endpoint.
4. `tags` and `source` are first-class body fields, so campaign tagging and source
   attribution can be set at upsert time in one call.
