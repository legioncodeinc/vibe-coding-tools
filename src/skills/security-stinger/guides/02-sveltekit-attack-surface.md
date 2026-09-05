# 02. SvelteKit attack surface

Grounded in [references/research/distilled-security.md §2](../references/research/distilled-security.md).

## Form actions and CSRF

SvelteKit checks the `origin` header on `POST`/`PUT`/`PATCH`/`DELETE` form submissions in production by default (`kit.csrf.checkOrigin`, being superseded by `kit.csrf.trustedOrigins`). Leave this at the framework default. Only add a specific origin to `trustedOrigins` when there is a real, named reason (a payment gateway or auth provider redirecting back with a form POST) - never set it to `['*']`, which disables the protection for every origin. [raw/security--sveltekit--csrf-and-csp-configuration.md]

Known framework limitation, not a misconfiguration: a request with no `Origin` header at all (some hardened browsers, Tor) is rejected regardless of `trustedOrigins` content, and there is currently no supported way around this short of the deprecated `checkOrigin: false`. If this repo needs to accept such requests for a specific reason, that decision needs to be made explicitly and documented, not discovered as a bug later. [raw/security--sveltekit--csrf-and-csp-configuration.md]

CSRF checks only apply in production - do not mistake a working local-dev form submission for evidence the protection is active.

## `+server.ts` endpoint authorization

Every `+server.ts` route handler must independently authorize its own request. There is no framework mechanism that lets a layout's authorization "cover" a sibling or child endpoint - `hooks.server.ts` is the only universal chokepoint (see below). When auditing, open every `+server.ts` in the diff and confirm it checks `event.locals.user` (or equivalent) itself, even if a `+page.server.ts` two directories up already does.

## Load function data leakage to the client

Two distinct leak classes, both grounded in real SvelteKit history:

1. **Secrets embedded in a server `load` `fetch()` URL.** SvelteKit used to track the exact URL passed to server-side `fetch()` calls as an invalidation dependency and serialize it into the client boot script - meaning a secret in a query string leaked to every browser even though it was never returned from `load`. This was fixed by default in SvelteKit; confirm `config.kit.dangerZone.trackServerFetchesPotentiallyExposingSecrets` is NOT set to `true` anywhere in this repo, because enabling it reopens exactly this leak. [raw/security--sveltekit--load-function-secret-leak-issue.md]
2. **Authorization treated as "layout caching."** `+layout.server.ts` `load` is a caching mechanism for the browser, not middleware - SvelteKit's client router decides what actually re-fetches on navigation, and a cached layout `load` will NOT re-run just because a client-side navigation happened. A multi-year, still-open SvelteKit maintainer/community discussion confirms the concrete bypass: sign in, load a protected page (layout authz runs, gets cached), delete the session cookie via devtools without refreshing, then navigate to a sibling page under the same layout - the now-signed-out user sees protected data because the layout's authorization check was skipped by the client router's caching. [raw/security--sveltekit--authz-chokepoint-layout-load-discussion.md]

## `$env/static/private` vs `$env/dynamic/public` mistakes

SvelteKit's public/private + static/dynamic matrix is a hard boundary at the module level: `$env/static/private` and `$env/dynamic/private` cannot be imported into any module reachable from the client, and `$lib/server/**` imports fail the build if pulled into client-reachable code - even transitively, even if the client code only uses a non-secret export from that module. But the boundary only protects what it's told to protect: a secret assigned a `PUBLIC_`-prefixed variable name is, by design, statically baked into the client bundle at build time via dead-code elimination. There is no runtime check that catches "this PUBLIC_ variable looks like a secret" - that is a code-review-time judgment call this skill exists to make. [raw/security--sveltekit--server-only-modules-env-leak.md]

Also note: illegal-import detection for server-only modules is DISABLED under `process.env.TEST === 'true'`, so a test suite passing is not evidence this boundary holds in a real build.

## `hooks.server.ts` as the authorization chokepoint

`hooks.server.ts`'s `handle` function is the only place guaranteed to run on every server request, independent of client-side caching or router state. The SvelteKit community's converged pattern, after years of discussing (and rejecting) a dedicated `+auth.server.js`/guard-file mechanism, is to centralize authorization here using route groups:

```ts
export const handle = (async ({ event, resolve }) => {
  const user = await getUserFromCookieOrHeader(event);
  if (event.route.id?.includes('/(protected)/') && !user) throw error(401);
  return resolve(event);
}) satisfies Handle;
```

Audit implication: if this repo's authorization logic lives primarily in layout `load` functions rather than `hooks.server.ts`, that is a High finding regardless of whether a bypass has been demonstrated - the architectural pattern itself is the vulnerability, per the SvelteKit maintainers' own framing ("as a fundamental rule, authorization has to happen on each request to the server before data is loaded and returned"). [raw/security--sveltekit--authz-chokepoint-layout-load-discussion.md]

## SSR XSS via `{@html}`

Svelte's own docs are blunt: "escape the passed string or only populate it with values that are under your control... Never render unsanitized content." Because this renders during SSR, malicious content in an `{@html}` block executes in the initial HTML response - before hydration, before any client-side JS runs, and it's visible to non-browser fetchers too. Every `{@html}` usage in the codebase must trace back to either a sanitizer call (DOMPurify or equivalent) immediately before render, or content that never contains any user- or third-party-influenced substring. [raw/security--sveltekit--at-html-xss-docs.md]

## Cookie flags and session fixation

See [references/severity-rubric.md](../references/severity-rubric.md) and [OWASP Session Management Cheat Sheet source](../references/research/raw/security--owasp--session-management-cookie-flags-fixation.md) for the full attribute-by-attribute rubric (`Secure`, `HttpOnly`, `SameSite`, `__Host-` prefix, narrow `Domain`/`Path`, non-persistent expiry). The core rule for this stack: only accept a session identifier via a cookie, never a URL parameter or hidden form field, and regenerate the session on login to prevent fixation.

## CSP nonce/hash strategy

`kit.csp.mode: 'auto'` uses nonces for SSR-rendered pages and hashes for prerendered pages (SvelteKit forbids nonces on prerendered pages as insecure, since a static file's nonce is not actually single-use). Confirm the deployed CSP `directives` avoid `unsafe-inline`/`unsafe-eval` without a documented reason, and that Svelte transition-generated inline `<style>` tags are accounted for (either `style-src` left unspecified, or `unsafe-inline` explicitly and knowingly allowed for styles only). [raw/security--sveltekit--csrf-and-csp-configuration.md]
