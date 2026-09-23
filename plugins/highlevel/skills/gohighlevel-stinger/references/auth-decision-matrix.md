# Auth decision matrix: OAuth 2.0 vs Private Integration Token

Grounding: [raw/ghl--auth--v1-to-v2-migration-official-blog.md], [raw/ghl--auth--private-integration-tokens-official.md], [raw/ghl--auth--oauth2-authorization-code-flow-official.md], [raw/ghl--auth--sandbox-private-integration-tokens.md].

## Pick one

| Situation | Use |
|---|---|
| Internal tool, script, or dashboard touching one agency or one sub-account you control | **Private Integration Token (PIT)** |
| Distributable Marketplace app installed by other agencies/sub-accounts you don't control | **OAuth 2.0** |
| Zapier/Make/n8n-style automation glue for your own account | **PIT** |
| SaaS product that provisions a HighLevel connection per customer | **OAuth 2.0** |
| One-off migration or data-export script | **PIT** (rotate/delete after use) |
| App needs to react to install/uninstall events across many accounts | **OAuth 2.0** (needs `AppInstall`/`AppUninstall` webhooks + agency token) |

Official rule of thumb, verbatim: "Using PITs for public apps: Private Integration Tokens are strictly for internal use. If other accounts need to install and authorize your app, you must use OAuth 2.0." [raw/ghl--auth--v1-to-v2-migration-official-blog.md]

## Side-by-side

| Property | OAuth 2.0 | Private Integration Token |
|---|---|---|
| Generation | Programmatic, via authorization-code exchange | Manual, via HighLevel UI only |
| Refresh | Automatic via refresh token (rotates on use) | **Never auto-refreshes** -- static until manually rotated |
| Lifetime | Access token ~24h (`expires_in: 86399` confirmed) [raw/ghl--auth--agency-vs-location-access-tokens.md] | No expiry; valid until revoked/rotated |
| Multi-account reach | Yes -- one app, many installs, per-install tokens | No -- one token, one account (agency or one location) |
| Token count limit | n/a (one token pair per install) | **5 per level** (5 agency + 5 per location) [raw/ghl--auth--private-integration-tokens-official.md] |
| Scopes | Requested at install, user consents | Selected at creation in the UI, editable later |
| Header | `Authorization: Bearer <access_token>` | `Authorization: Bearer <PIT>` |
| Marketplace listing required | Yes, for distribution beyond your own account | No |
| Sandbox support | Full OAuth flow testable in Sandbox | PIT creation now supported in Sandbox, at reduced rate limits (25/10s, 10k/day) [raw/ghl--auth--sandbox-private-integration-tokens.md] |

## Token type resolution inside OAuth (once you've chosen OAuth)

| `userType` on token response | Scope | Use for |
|---|---|---|
| `Company` | Agency + indirect access to its sub-accounts | Agency-level endpoints, e.g. Create Sub-Account |
| `Location` | One sub-account | Almost all CRM endpoints: contacts, opportunities, calendars, conversations |

If your app only receives an agency-level (`Company`) token after install, exchange it for a location token via `POST /oauth/locationToken` before calling most CRM endpoints. [raw/ghl--auth--oauth2-authorization-code-flow-official.md]

## Known trap either way

`oauth.readonly` + an Agency PIT cannot be used to check whether your app is installed on a given location -- that check must go through the app's own OAuth token/context, not a generic Agency PIT, per HighLevel's own maintainers. [raw/ghl--auth--scopes-reference-official.md]

## Migration note (from v1 keys or a legacy setup)

1. Audit which v1 endpoints/credentials/webhooks are in use.
2. Pick PIT or OAuth per the table above.
3. Replace legacy keys, update authorization headers.
4. Migrate feature-by-feature, not all at once.
5. Scope precisely -- do not carry over broad v1-style blanket access.
6. Test end-to-end in Sandbox before flipping production traffic.

[raw/ghl--auth--v1-to-v2-migration-official-blog.md]
