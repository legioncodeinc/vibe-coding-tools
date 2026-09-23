# Environment variable checklist

Grounded in [raw/workos--sdks--node-sdk-api-keys-environments.md], [raw/workos--authkit--sveltekit-sdk.md], [raw/workos--events--webhooks-guide.md].

## Core AuthKit / SvelteKit variables

| Variable | Required | Notes |
| --- | --- | --- |
| `WORKOS_CLIENT_ID` | Yes | `client_...` prefix. From WorkOS Dashboard > API Keys. Separate value per environment (staging vs. production) [raw/workos--sdks--node-sdk-api-keys-environments.md] |
| `WORKOS_API_KEY` | Yes (server/confidential mode) | `sk_...` prefix. Server-only secret, never expose client-side. **Production key is shown once at creation** - store it in your secrets manager immediately [raw/workos--sdks--node-sdk-api-keys-environments.md] |
| `WORKOS_REDIRECT_URI` | Yes | Must exactly match a URI registered in Dashboard > Applications > Redirects. Staging allows `http://localhost:...`; production requires `https://` [raw/workos--sdks--node-sdk-api-keys-environments.md] |
| `WORKOS_COOKIE_PASSWORD` | Yes | Minimum 32 characters, used to seal the session cookie. Generate with `openssl rand -base64 24`. Rotating this invalidates all existing sessions [raw/workos--authkit--sveltekit-sdk.md] |
| `WORKOS_WEBHOOK_SECRET` | Only if consuming webhooks | Per-webhook-endpoint secret from Dashboard > Webhooks, used by `workos.webhooks.constructEvent` [raw/workos--events--webhooks-guide.md] |

## Optional / advanced

| Variable | Notes |
| --- | --- |
| Cookie name override | SDK default is `wos-session`; only override if you have a naming collision [raw/workos--authkit--sveltekit-sdk.md] |
| Cookie domain | Only set if you need the session cookie shared across subdomains [raw/workos--authkit--sveltekit-sdk.md] |
| Cookie max age | SDK default is 400 days; align with your actual refresh-token lifetime policy rather than trusting the default blindly [raw/workos--authkit--sveltekit-sdk.md] |

## SvelteKit-specific wiring

- Prefer `$env/dynamic/private` over `$env/static/private` in `hooks.server.ts` when the same build artifact needs to run against different WorkOS environments (e.g. Vercel preview deployments pointed at staging, production deployments pointed at production) without a rebuild [raw/workos--authkit--sveltekit-sdk.md].
- Never reference any of these five variables from `$env/static/public` or `$env/dynamic/public` - all five are server-only secrets or values that gate server-only redirect/cookie behavior.

## Staging vs. production - nothing carries over automatically

Per [raw/workos--sdks--node-sdk-api-keys-environments.md]: API keys, Client IDs, organizations, connections, users, webhook endpoints/secrets, and branding are all scoped to a single WorkOS environment. When promoting staging to production, re-provision every row in this table for the production environment - do not assume any value is shared.

## Cutover checklist (staging -> production)

1. Confirm the full flow works end-to-end in staging.
2. Add billing information in the WorkOS Dashboard to unlock production.
3. Generate the production API key and store it immediately (one-time display).
4. Copy the production Client ID into your deployment's env vars (e.g. Vercel project env vars, production scope only).
5. Register production redirect URIs (`https://` required).
6. Re-create any SSO/SCIM organizations and connections needed in production - they do not migrate from staging.
7. Re-create webhook endpoints and update `WORKOS_WEBHOOK_SECRET` for the production endpoint's own secret.
8. Re-apply branding (or copy it forward from staging via the dashboard's "copy from another environment" tool) [raw/workos--authkit--branding-customization.md].
9. Test the full auth flow in production before routing real traffic.

[raw/workos--sdks--node-sdk-api-keys-environments.md]
