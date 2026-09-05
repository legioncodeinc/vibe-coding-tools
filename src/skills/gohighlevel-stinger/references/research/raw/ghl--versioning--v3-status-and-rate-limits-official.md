# HighLevel API Documentation (support portal overview)

- URL: https://help.gohighlevel.com/support/solutions/articles/48001060529-highlevel-api-documentation
- Fetched: 2026-08-14
- Source type: Official (HighLevel Support Portal, modified 2026-06-19)
- Component: versioning, rate limits, plan tiers, v1 deprecation

## Key facts

- "HighLevel API documentation is now available at https://marketplace.gohighlevel.com/docs/. If you previously used the legacy Stoplight documentation, update your bookmarks. Stoplight documentation will be deprecated in the coming months."
- "HighLevel API documentation now supports versioned API references. Developers can use the version switcher inside the API documentation to view endpoints, schemas, parameters, and examples for a specific API version."
- On v3 status (as of this article's last modification, 2026-06-19): "Please Note: HighLevel is also working toward the next API milestone, v3, which is expected to introduce enhanced capabilities, improved performance, and new endpoints for advanced use cases. Continue checking the official API documentation for the latest available versions." The article's own FAQ states plainly: "Q. Is API v3 available now? Not yet, based on the release note. HighLevel is working on v3 as the next API milestone."
- V1 end of support: "IMPORTANT: V1 APIs has reached end-of-support as on 31-December-2025. Existing connections/integrations will continue to work, however no support or updates will be provided for V1 APIs." Also: "Going forward, the ability to generate new API keys will be removed from both Agency and Sub-account settings."
- FAQ: "Q. Does HighLevel still support API V1? No. HighLevel API V1 has reached end-of-support. While existing integrations may continue to function, no updates or technical support are provided. Developers should migrate to API V2 for ongoing support and new features."

## Rate limits (API 2.0, OAuth-based)

- "Burst limit: A maximum of 100 API requests per 10 seconds for each Marketplace app (i.e., client) per resource (i.e., Location or Company)."
- "Daily limit: 200,000 API requests per day for each Marketplace app (i.e., client) per resource (i.e., Location or Company)."
- Rate limit response headers: `X-RateLimit-Limit-Daily` (daily limit), `X-RateLimit-Daily-Remaining` (remaining today), `X-RateLimit-Interval-Milliseconds` (burst window length), `X-RateLimit-Max` (max requests in that window), `X-RateLimit-Remaining` (remaining in current window).
- Limits are per app-per-resource: if an app is installed on two sub-accounts, each sub-account gets its own 100/10s and 200,000/day allowance.

## Plan tiers

- "Starter & Unlimited: Basic API access" vs "Agency Pro: Advanced API access, including OAuth and agency-level tokens." Lower plan levels only access Location API Keys; Agency Pro unlocks Agency API Keys and the OAuth 2.0 API surface.

## Notes for the distillation

This is the single clearest first-party statement that v3 was **not yet generally available** as of the article's last edit (2026-06-19). This directly conflicts with the brewedops.com blog post (2026-06-13, four days earlier) which claims v3 "is now available." See `ghl--versioning--v3-announcement-and-resource-catalog.md` for the conflicting claim. Flag this conflict in the distillation rather than picking a side.
