# 07. Marketplace apps

## Creating an app

1. Sign in to your Developer Account in the Marketplace, go to My Apps, click Create App [raw/ghl--marketplace--app-creation-and-distribution-model.md].
2. Start as **Private** while building and testing; switch to **Public** only when stable, secure, and review-ready [raw/ghl--marketplace--app-creation-and-distribution-model.md].
3. Configure Advanced Settings: OAuth scopes, redirect URLs, external authentication, webhooks (default webhook URL for `INSTALL`/`UNINSTALL` lifecycle events).
4. Request the minimum scopes your app actually uses -- fewer scopes means faster review and more install-time trust [raw/ghl--marketplace--app-creation-and-distribution-model.md].

## Distribution model: three irreversible decisions

| Field | Values | Once set |
|---|---|---|
| Target user | `Agency` / `Sub-account` | **Cannot be changed** |
| Who can install | `Both Agency and Sub-account` / `Agency Only` | Changeable in some legacy-compat paths, but plan as fixed |
| Bulk-installable by agencies | `Yes` / `No` | **Cannot revert to No once set to Yes**; new apps default to mandatory Yes |

For 95%+ of apps, target user should be `Sub-account` (per the official guidance's own phrasing) [raw/ghl--marketplace--app-creation-and-distribution-model.md].

## Resolving the right access token per install scenario

| Target user | Who can install | Bulk-install | Installer | Token you get | Extra work required |
|---|---|---|---|---|---|
| Agency | N/A | N/A | Agency user | `userType: Company` | None |
| Sub-account | Agency & sub-account | No | Sub-account user | `userType: Location` | None |
| Sub-account | Agency & sub-account | No | Agency user | `userType: Location` | None |
| Sub-account | Agency & sub-account | Yes | Sub-account user | `userType: Location` | None |
| Sub-account | Agency & sub-account or Agency Only | Yes | **Agency user (recommended path)** | `userType: Company`, `isBulkInstallation: true` | 1) enumerate installed locations, 2) mint a location token per location via the agency token, 3) listen for `AppInstall` webhooks and repeat step 2 for every future install |

[raw/ghl--marketplace--app-creation-and-distribution-model.md]

Build for the last row if you're shipping a real multi-tenant SaaS product on this platform -- it's the recommended, highest-reach configuration and it's also the one requiring real integration engineering (token-per-location resolution plus webhook-driven onboarding of new installs), not a toggle you get for free.

## Sandbox testing

- Sandbox accounts are isolated from production, rate-limited (25 req/10s, 10,000/day for PITs), governed by Fair Use guidelines, and **active for up to 6 months from creation** before possible deactivation (reactivation is a manual request) [raw/ghl--marketplace--sandbox-testing-environment.md].
- Sandbox now supports full PIT creation and testing, in addition to the OAuth install flow -- you do not need a production account to validate auth, scopes, core API flows, or webhooks "at low volume" [raw/ghl--marketplace--sandbox-testing-environment.md].
- To test an app version: My Apps > app > Manage > Versions > (three-dot menu) > Test Link > supply a Location ID > open the generated install link > Install > proceed with functional testing (OAuth, API calls, webhooks, custom workflow actions/triggers, custom page) [raw/ghl--marketplace--sandbox-testing-environment.md].

## Before going public

- Confirm scopes are minimal and each one maps to a real, user-visible feature.
- Confirm your webhook signature verification handles both `X-GHL-Signature` (Ed25519, current) and `X-WH-Signature` (RSA, deprecated 2026-09-01) during the transition window -- see `guides/04-webhooks-inbound-and-outbound.md`.
- Confirm your token-refresh and location-token-resolution logic has been exercised against Sandbox's lower rate limits, since production limits are more forgiving, not less.
