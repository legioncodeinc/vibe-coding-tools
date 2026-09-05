# Scopes | HighLevel API (official) + supporting GitHub issue on Agency PIT scope gaps

- URL: https://marketplace.gohighlevel.com/docs/Authorization/Scopes/
- Secondary URL: https://github.com/GoHighLevel/highlevel-api-docs/issues/226
- Fetched: 2026-08-14
- Source type: Official docs (scopes table) + official maintainer comment on a documentation bug report (2026-01-07)
- Component: auth - OAuth/PIT scope catalog and access-level gotchas

## Key facts

- The official Scopes page renders as a table: `Scope | API Endpoints | Webhook Events | Access Type`, e.g. `oauth.readonly -> GET /oauth/installedLocations -> (no webhook) -> Agency`. Access Type is either `Agency` or `Sub-Account`, meaning some scopes are only assignable/usable at one level.
- Common scope families seen across this research set: `contacts.readonly` / `contacts.write`, `opportunities.readonly` / `opportunities.write`, `calendars.readonly` / `calendars.write`, `conversations.readonly`, `conversations/message.readonly` / `conversations/message.write`, `locations.readonly` / `locations.write`, `companies.readonly` / `companies.write`, `users.readonly` / `users.write`, `oauth.readonly`, `saas/location.read` / `saas/location.write`, `snapshots.readonly` / `snapshots.write`.
- Agency-level Private Integration Token scope list observed directly from the HighLevel UI (per the GitHub issue reporter): `companies.readonly, locations.write, locations.readonly, saas/company.read, saas/company.write, saas/location.read, saas/location.write, snapshots.readonly, snapshots.write, users.readonly, users.write, custom-menu-link.readonly, custom-menu-link.write, marketplace-installer-details.readonly, twilioaccount.read, phonenumbers.read, numberpools.read, documents_contracts/list.readonly, documents_contracts/sendLink.write, documents_contracts_template/sendLink.write, documents_contracts_template/list.readonly`. Notably **`oauth.readonly` is not in this list.**

## The gotcha: Agency PIT cannot check app-install state

- HighLevel maintainer response to the bug report: "1. `oauth.readonly` is not a valid/assignable scope for an Agency-level Private Integration Token (PIT), which is why you don't see it in the scope editor options. 2. The `/oauth/installedLocations` endpoint is not intended to be used with Agency-level PITs to check installation state. Installation visibility is tied to the app's installation context and is surfaced to the app via its app token, not via a generic agency PIT. 3. The docs previously implied `oauth.readonly` + PIT could be used here -- that was misleading. We've corrected the documentation... So the right behavior is: 1. If you need to know whether your app is installed in a location, that check should be done using the app token / app context (not an agency PIT). 2. We're not adding `oauth.readonly` to the Agency PIT scope list."

## Notes for the distillation

This is a documented, first-party-confirmed scoping trap: `GET /oauth/installedLocations` looks like a generic "list my installed locations" call, but it is scoped to an **app's own OAuth token context**, not to a general-purpose Agency PIT, even though `oauth.readonly` sounds like it should cover it. Anyone building a Private-Integration-only tool (no marketplace app) cannot use this endpoint to enumerate install state -- there is no PIT-compatible substitute documented in this research set. Flag as a known gap.
