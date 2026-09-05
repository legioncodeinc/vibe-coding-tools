# workos/sveltekit-authkit-example (README) - GitHub

- URL: https://github.com/workos/sveltekit-authkit-example ; https://github.com/workos/authkit-sveltekit/
- Fetched: 2026-08-14
- Source type: official vendor reference implementation (WorkOS)
- Component: WorkOS AuthKit + SvelteKit session cookie (sealed session) configuration

## Setup and required env vars

```
WORKOS_CLIENT_ID="client_..."
WORKOS_API_KEY="sk_test_..."
WORKOS_COOKIE_PASSWORD="<your password>"   # >= 32 chars, encrypts the session cookie
WORKOS_REDIRECT_URI="http://localhost:5173/callback"
```
`WORKOS_COOKIE_PASSWORD` is described as "the private key used to encrypt the session cookie" - this is what makes the session a SEALED session (encrypted client-side-opaque blob) rather than a bare token; it must be at least 32 characters, generated with a CSPRNG (`openssl rand -base64 24` is the documented generation command), and must NEVER ship as a public/client-exposed env var (it belongs in `$env/static/private`, never `PUBLIC_`-prefixed).

## Cookie configuration surface

| Env var | Default | Description |
|---|---|---|
| `WORKOS_COOKIE_MAX_AGE` | `34560000` (400 days) | Max age of the session cookie in seconds |
| `WORKOS_COOKIE_DOMAIN` | none | Restricts the cookie to a domain; empty means current domain only |
| `WORKOS_COOKIE_NAME` | `'workos_session'` | Cookie name |
| `WORKOS_COOKIE_SAMESITE` | `'lax'` | `'lax'`, `'strict'`, or `'none'` |

- Explicit warning on `SameSite=none`: "Setting `WORKOS_COOKIE_SAMESITE='none'` allows cookies to be sent in cross-origin contexts (like iframes), but reduces protection against CSRF attacks. This setting forces cookies to be secure (HTTPS only) and should only be used when absolutely necessary for your application architecture." - i.e. only relax from the `lax` default for a specific, understood cross-origin embedding requirement, and know that doing so trades away CSRF protection that `SameSite=lax`/`strict` otherwise provides.
- `WORKOS_COOKIE_DOMAIN` is specifically for sharing a WorkOS session across multiple subdomains/apps - and the doc notes `WORKOS_COOKIE_PASSWORD` would then need to be identical across every app sharing the domain, which widens the blast radius of that single secret if any one app leaks it.
- Wiring into `hooks.server.ts`:
```ts
import { configureAuthKit, authKitHandle } from '@workos/authkit-sveltekit';
import { WORKOS_CLIENT_ID, WORKOS_API_KEY, WORKOS_REDIRECT_URI, WORKOS_COOKIE_PASSWORD } from '$env/static/private';

configureAuthKit({ clientId: WORKOS_CLIENT_ID, apiKey: WORKOS_API_KEY, redirectUri: WORKOS_REDIRECT_URI, cookiePassword: WORKOS_COOKIE_PASSWORD });
export const handle = authKitHandle();
```
This confirms `hooks.server.ts` is the documented, vendor-recommended integration point for WorkOS session handling in SvelteKit - consistent with the framework-level guidance that `handle` is the correct authorization chokepoint (see the separate SvelteKit authz-chokepoint source).

## Package naming caveat

Two different npm scopes both present themselves as the SvelteKit AuthKit SDK: `@workos-inc/authkit-sveltekit` and `@workos/authkit-sveltekit`. Verify the actual published package on npm directly before installing/pinning, rather than assuming a single canonical name.
