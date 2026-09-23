# 01. Auth and tokens

## Pick your auth method first

Internal tool touching one account: Private Integration Token (PIT). Distributable app installed by other agencies/sub-accounts: OAuth 2.0. This is not a style preference -- using a PIT for a public distribution is explicitly called out as a migration mistake in HighLevel's own guidance [raw/ghl--auth--v1-to-v2-migration-official-blog.md]. Full decision table: `references/auth-decision-matrix.md`.

## OAuth 2.0 flow

1. Register an app in the Developer Portal (start Private while building; switch to Public when ready) [raw/ghl--marketplace--app-creation-and-distribution-model.md].
2. Configure scopes, redirect URL, and distribution settings. Distribution fields (target user, who can install, bulk-installable) are **irreversible once set** -- decide deliberately [raw/ghl--marketplace--app-creation-and-distribution-model.md].
3. Redirect the user to the authorization URL with your `client_id`, requested `scope`, and `redirect_uri`. Public apps get a HighLevel-hosted install UI; Private apps must build this redirect themselves [raw/ghl--auth--token-lifetimes-and-flow-variants.md].
4. Receive the authorization code at your redirect URI.
5. Exchange it: `POST /oauth/token` with `client_id`, `client_secret`, `grant_type=authorization_code`, `code`. See `references/request-examples.md` §1.
6. Persist `access_token`, `refresh_token`, `expires_in`, `userType`, and either `locationId` or `companyId`.
7. Use PKCE (`code_challenge`/`code_challenge_method=S256`) for public/browser/mobile clients [raw/ghl--auth--oauth2-authorization-code-flow-official.md].

## Token lifetimes

- Access token: confirmed `expires_in: 86399` seconds (~24 hours) from an official worked example [raw/ghl--auth--agency-vs-location-access-tokens.md]. Do not hard-code this -- read `expires_in` from the live response.
- Refresh token: a community source claims "valid for a year or until used once, whichever comes first," with a new refresh token issued on every use that must replace the stored one. This figure is **not confirmed by an official page in this archive** -- treat it as directional [raw/ghl--auth--token-lifetimes-and-flow-variants.md -- GAP].
- Refresh proactively before expiry, or reactively on a `401`, per the pattern the official SDK itself uses [raw/ghl--sdk--official-typescript-sdk-and-error-handling.md].

## Agency vs Location tokens

Two `userType` values come back on every token response: `Company` (agency-wide, indirect access to sub-accounts) and `Location` (one sub-account). Most CRM endpoints -- contacts, opportunities, calendars, conversations -- need a `Location` token. If your app only holds a `Company` token after install, exchange it per sub-account via `POST /oauth/locationToken` before calling those endpoints. See `references/request-examples.md` §2 [raw/ghl--auth--oauth2-authorization-code-flow-official.md].

For the "[NEW and RECOMMENDED]" bulk-install-by-agency-user distribution path, this exchange must run for every installed location, and again for every new location an `AppInstall` webhook reports [raw/ghl--marketplace--app-creation-and-distribution-model.md].

## Private Integration Tokens (PIT)

- Generate only from the HighLevel UI (Settings > Private Integrations). No programmatic creation exists [raw/ghl--auth--private-integration-tokens-official.md].
- Static: does not auto-refresh. Rotate manually on a schedule (a community source suggests every 90 days as a sensible default -- not an official requirement, treat as a practice recommendation).
- Cap: 5 per level (5 agency-level + 5 per location-level) [raw/ghl--auth--private-integration-tokens-official.md].
- Header: `Authorization: Bearer <PIT>` -- the word "Bearer" is required.
- Sandbox accounts can now generate PITs, at reduced rate limits (25 req/10s, 10,000/day) -- see `guides/06-rate-limits-and-reliability.md` [raw/ghl--auth--sandbox-private-integration-tokens.md].

## Scopes

Request the minimum your integration actually uses -- over-scoping slows Marketplace review and looks worse on the install consent screen [raw/ghl--marketplace--app-creation-and-distribution-model.md]. Full scope catalog reference: `references/endpoint-reference.md` and [raw/ghl--auth--scopes-reference-official.md].

**Known trap**: `oauth.readonly` is not assignable to an Agency-level PIT, and `GET /oauth/installedLocations` is not usable from a generic Agency PIT to check install state -- that check must go through the app's own OAuth context. There is no PIT-compatible workaround documented anywhere in this research [raw/ghl--auth--scopes-reference-official.md].

## Storing tokens

Do not store tokens in memory only in a production process -- they will be lost on restart. Use a durable store (the official SDK ships a MongoDB session storage adapter and a `SessionStorage` base class for custom backends) [raw/ghl--sdk--official-typescript-sdk-and-error-handling.md]. Never log a PIT or an access/refresh token in plaintext; never commit one to source control.

## v1 API keys

Dead end. End-of-support since 2025-12-31: no new keys issued, no patches, no support. Existing v1 integrations "continue to function... without a safety net" -- migrate before that net matters [raw/ghl--versioning--v3-status-and-rate-limits-official.md, raw/ghl--auth--v1-to-v2-migration-official-blog.md].
