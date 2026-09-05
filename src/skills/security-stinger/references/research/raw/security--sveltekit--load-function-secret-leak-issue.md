# Secrets exposed in server-only `load` fetch dependencies - sveltejs/kit#9803 (fixed by #9945)

- URL: https://github.com/sveltejs/kit/issues/9803 ; https://github.com/sveltejs/kit/pull/9945
- Fetched: 2026-08-14
- Source type: official framework issue tracker / merged security fix
- Component: SvelteKit `load` functions (`+page.server.ts`, `+layout.server.ts`)

## The bug (historical, now fixed by default - but the underlying pattern still matters for the class of bug)

- A developer stored a secret `API_KEY` in `.env`, then in `+layout.server.ts` called `fetch()` against an external URL with the API key as a query parameter, assuming server-only `load` code never reaches the client.
- SvelteKit tracked the exact URLs passed to `fetch()` inside server `load` functions as invalidation dependencies, and serialized those dependency URLs into the boot script embedded in the server-rendered HTML - meaning the full URL, including the secret in the query string, was shipped to and visible in every browser's page source.
- Reporter: "Open the browser dev tools and view source. At the bottom in a `script` tag, you'll find that your secret `API_KEY` is exposed to the client." This is true even though the code never returned the secret from `load` and never rendered it - simply calling `fetch()` on the URL was enough to leak it.
- Maintainer framing of the fix options considered: (1) stop tracking implicit dependencies from serialized data entirely (breaking), (2) don't track dependencies for external URLs, (3) strip query params before tracking, (4) hash the URL for the dependency key. Team chose the strictest: stop implicit dependency tracking for server-load `fetch` calls entirely.

## The fix

- PR #9945 ("security: Stop automatically adding URLs from server-side `load` `fetch` calls to dependencies") is a breaking security change: server `load` functions no longer implicitly depend on URLs passed to `fetch`, closing the leak by default.
- Escape hatch for teams that understand the risk and want the old caching behavior: `config.kit.dangerZone.trackServerFetchesPotentiallyExposingSecrets = true`. The name itself is the warning - enabling it reopens this exact vulnerability class.

## Why this belongs in a SvelteKit-specific audit checklist

- This demonstrates that "the code only runs on the server" is not sufficient reasoning for secret safety in SvelteKit - framework-level serialization behavior (dependency tracking, `data-sveltekit-*` hydration payloads, the boot script) can carry values from server `load` functions into the client bundle even when the developer never explicitly returned them.
- Audit implication: grep every `+page.server.ts` / `+layout.server.ts` for `fetch(` calls that embed a secret in a URL (query string or path segment) rather than an `Authorization` header, and confirm the project is not running with `dangerZone.trackServerFetchesPotentiallyExposingSecrets` enabled.
