# HighLevel Public API v3 Is Now Available (BrewedOps)

- URL: https://brewedops.com/blog/highlevel-public-api-v3
- Fetched: 2026-08-14
- Source type: Vendor/consultancy blog (secondary, dated 2026-06-13)
- Component: versioning, base URL, resource catalog, auth summary, rate limits

## Key facts

- Claims: "HighLevel has officially released v3 of its Public APIs, announced by co-founder Shaun Clark. v3 builds on the existing API versioning foundation with a more consistent endpoint architecture, better performance, and advanced capabilities for complex workflows, while your existing integrations keep running exactly as they do today."
- "Is v3 backward compatible? Yes. HighLevel emphasizes zero disruption to live apps: your existing date-based API configurations remain fully functional, completely accessible, and fully documented."
- "Going forward, all new feature endpoints and non-breaking API enhancements will be added exclusively to the v3 framework as it expands core coverage."

## Base URL and auth (matches official docs elsewhere)

- "The Public API is served from services.leadconnectorhq.com and expects a Version header on every request."
- "OAuth 2.0 (marketplace apps): the standard for apps distributed through the HighLevel Marketplace across many sub-accounts... Private Integration Token (PIT): a scoped token for a single agency or sub-account... send it as a Bearer token with no OAuth round-trip... Version header: pass the API version (for example Version: 2021-07-28 on date-based endpoints)."

## Resource catalog (30+ groups), base paths

CRM: Contacts `/contacts/`, Companies `/companies/`, Businesses `/businesses/`, Objects (Custom Objects) `/objects/`, Associations `/associations/`, Custom Fields V2 `/custom-fields/`.
Messaging: Conversations `/conversations/`, Emails `/emails/`, LC Email `/email-isv/`, Campaigns `/campaigns/`.
Scheduling/sales: Calendars `/calendars/`, Opportunities `/opportunities/`.
Commerce: Payments `/payments/`, Products `/products/`, Invoices `/invoices/`, Store `/store/`.
Marketing/content: Funnels `/funnels/`, Forms `/forms/`, Surveys `/surveys/`, Social Planner `/social-media-posting/`, Blogs `/blogs/`, Trigger Links `/links/`, Media Library `/medias/`, Courses `/courses/`.
Automation/agency/platform: Workflows `/workflows/` ("List workflows and add or remove contacts from them" -- no workflow-authoring endpoints), Sub-Accounts (Locations) `/locations/`, Users `/users/`, SaaS `/saas-api/`, Snapshots `/snapshots/`, Custom Menus `/custom-menus/`, Marketplace `/marketplace/` and `/oauth/`.

## Rate limits and pagination (as summarized by this secondary source)

- "HighLevel enforces both a burst limit and a daily limit per app and resource, so build in retry-with-backoff and cache reads you do not need in real time. Some endpoints also have their own pagination quirks (for example, paginate payment transactions by offset, not skip), so verify that returned record IDs actually change between pages instead of assuming a call succeeded."

## Notes for the distillation

**Direct conflict**: this post (2026-06-13) says v3 "is now available" and is generally accessible via a version-switcher dropdown. The official HighLevel Support Portal article (`ghl--versioning--v3-status-and-rate-limits-official.md`, last modified 2026-06-19, six days *later*) says plainly "v3 available now? Not yet." Because the official support article is both more authoritative and more recent, prefer its reading in the distillation: treat v3 as **rolling out / partially available**, confirm the version switcher in your own developer portal before relying on any v3-only endpoint, and do not assume parity with this blog's resource catalog. The `/workflows/` scope described here ("list workflows, add/remove contacts") matches what the official docs show for v2 as well -- there is no evidence in any source of a workflow-authoring (create/edit workflow logic) endpoint at any API version.
