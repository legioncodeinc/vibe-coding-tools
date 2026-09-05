# Private Integration Tokens (PIT) for Sandbox Accounts | HighLevel API

- URL: https://marketplace.gohighlevel.com/docs/oauth/SandboxPIT/
- Fetched: 2026-08-14
- Source type: Official (HighLevel Developer Marketplace docs, tagged "Version: v3" in-page)
- Component: auth, sandbox/testing - PIT behavior in Sandbox accounts

## Key facts

- "A Private Integration Token (PIT) is a scoped authentication token that provides secure server-to-server access to HighLevel APIs. PITs let you build custom integrations without running an OAuth user-consent flow."
- Key characteristics: "Scoped permissions... Static token behavior: PITs act like a fixed OAuth2 access token. They do not auto-refresh. If you need a new token, you must rotate or regenerate it manually... API version: PITs work with API v2.0 (supported/modern API surface)... Context support: PITs are available for both agency and sub-account (location) contexts."
- "Previously, Sandbox (App Test) Accounts did not support PIT creation. This has changed: Sandbox accounts can now generate PITs... Sandbox PITs behave like production PITs in authentication and usage."

## Sandbox-specific rate limits (differ from production)

- "Sandbox PITs have reduced API limits for development/testing: 25 requests per 10 seconds, 10,000 requests per day. Limits apply at the account (location) level. Limits do not multiply if you generate multiple PITs. Production PITs use the standard API limits based on the paid HighLevel plan."
- Environment comparison table:
  | Category | Sandbox PITs | Production PITs |
  |---|---|---|
  | Intended usage | Temporary, test-only | Real systems and production workloads |
  | API limits | Reduced (25/10s, 10k/day) | Standard production limits (100/10s, 200k/day per app+resource) |
  | Lifetime | Sandbox account may exist up to 6 months | Persistent unless rotated/expired |
  | Stability | No uptime/persistence guarantees | Stable production support |

## Lifecycle

- "Sandbox data (including PITs) is temporary and may be: Reset, Purged, Deactivated after 6 months, Deactivated earlier under Fair Use review."
- Usage: `Authorization: Bearer <YOUR_PRIVATE_INTEGRATION_TOKEN>` against `https://services.leadconnectorhq.com/locations/{LOCATION_ID}` with header `Version: 2021-07-28`.

## Notes for the distillation

This is the authoritative source for Sandbox rate limits (25 req/10s, 10,000/day) -- a quarter of production's burst limit and 5% of the daily limit. Any integration testing plan must budget for this or it will hit 429s during development well before production traffic would. Sandbox accounts expire after 6 months and are explicitly "not meant for production workflows or real customer data" -- do not build a permanent integration against a Sandbox PIT.
