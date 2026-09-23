# 02. AuthKit integration in SvelteKit

## Package name - verify before installing

Two sources both present themselves as the official SvelteKit SDK: `@workos-inc/authkit-sveltekit` (per the current workos.com/docs CLI installer table) and `@workos/authkit-sveltekit` (per the `workos/authkit-sveltekit` GitHub repo README). This is an open conflict in the research - see `research/distilled-workos.md` §5 for the full comparison. **Check npm directly for the current live package before scaffolding.** Everything below defaults to `@workos-inc/authkit-sveltekit` per the CLI installer table, but the API shape (`configureAuthKit`, `authKitHandle`, `authKit.withAuth`, etc.) is identical across both sources [raw/workos--authkit--sveltekit-sdk.md].

## Dashboard setup (do this before writing code)

1. WorkOS Dashboard > Applications > your app > **Redirects** tab: add a redirect URI, e.g. `http://localhost:5173/callback` for local dev [raw/workos--authkit--nodejs-quickstart-sessions.md].
2. Same tab: set the **Initiate login URL / Sign-in endpoint** to your app's sign-in route, e.g. `http://localhost:5173/sign-in`. Without this, WorkOS-initiated flows (dashboard impersonation, IdP-initiated SSO) fail because the SDK enforces PKCE/CSRF `state` verification on every callback and there's no app-side step to set that state up first [raw/workos--authkit--sveltekit-sdk.md].
3. Configure a **Sign-out URI** or users will see an error on logout [raw/workos--authkit--nodejs-quickstart-sessions.md].

## Install and wire

```bash
npm install @workos-inc/authkit-sveltekit
```

See `references/hooks-server-session-pattern.md` for the complete, copy-pasteable set of files: `app.d.ts`, `hooks.server.ts`, `callback/+server.ts`, `sign-in/+server.ts`, a POST-only `logout` form action, and both a protected `+page.server.ts` load function and a protected API `+server.ts` handler.

## Required environment variables

`WORKOS_CLIENT_ID`, `WORKOS_API_KEY`, `WORKOS_REDIRECT_URI`, `WORKOS_COOKIE_PASSWORD` (32+ chars, generate with `openssl rand -base64 24`) [raw/workos--authkit--sveltekit-sdk.md]. Full checklist with staging/production split: `references/env-var-checklist.md`.

## The one rule that will bite you if skipped

`authKit.withAuth()` is for routes that render a top-level HTML document only. Wrapping a JSON `+server.ts` API endpoint with it sets PKCE verifier cookies on XHR responses that can never complete the OAuth redirect - and with per-flow cookie naming in `authkit-session` 0.5.0+, those orphaned cookies can accumulate into an HTTP 431 (headers too large) error under concurrent load [raw/workos--authkit--sveltekit-sdk.md]. For API routes, read `event.locals.auth` directly instead (populated by the `handle` hook) - shown in `references/hooks-server-session-pattern.md`.

## Vercel-specific note

Prefer `$env/dynamic/private` over `$env/static/private` in `hooks.server.ts` so the same build can run against different WorkOS environments (e.g. Vercel preview deployments pointed at WorkOS staging, production deployments pointed at WorkOS production) without a rebuild [raw/workos--authkit--sveltekit-sdk.md]. Platform-agnostic runtime claims (Node.js, Cloudflare Workers, Vercel Edge) appear in the archived example repo's marketing copy but were not independently confirmed against the primary SDK README - verify Node vs. Edge runtime compatibility against whichever package you resolve in the conflict above before deploying to a Vercel Edge Function (see `research/distilled-workos.md` gap 3).

## Next

`03-sessions-and-jwt-verification.md` covers what happens after the cookie is set: authenticate, refresh, and when you'd ever need raw JWT verification instead of the SDK's session helpers.
