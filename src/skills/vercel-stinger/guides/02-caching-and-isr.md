# Guide 2: Caching and ISR

Grounded in `references/research/distilled-vercel.md` §3, `references/research/raw/vercel--caching--isr-data-cache-cache-control.md`.

## When to walk this guide

Deciding how a route should cache, debugging stale or over-cached content, or explaining `x-vercel-cache` header values during an incident.

## Header precedence - get this right before touching anything else

Three headers, strict priority order:

1. `Vercel-CDN-Cache-Control` - Vercel-only, highest priority, stripped before the client sees it.
2. `CDN-Cache-Control` - cross-CDN, always overrides plain `Cache-Control`.
3. `Cache-Control` - standard header, lowest of the three, `s-maxage` stripped before the browser sees it.

If a caching change isn't taking effect, check whether a higher-priority header is already set somewhere (framework default, `vercel.json`, or a previous deployment) and silently winning.

## Choosing a caching strategy for a route

| Route shape | Strategy |
|---|---|
| Fully static content, rarely changes | ISR with a long `expiration` |
| Static shell + a few dynamic fields | ISR for the shell + Runtime Cache inside the function for the dynamic fetch |
| Fully dynamic, per-request | No ISR; explicit `Cache-Control` headers if any caching is wanted at all, or none |
| API route with expensive but shareable computation | `Cache-Control` with `s-maxage` + `stale-while-revalidate` |

## ISR setup

Per-route `config.isr` (see `references/svelte-config-templates.md`): `expiration` in seconds (or `false` for never-expire), `bypassToken` for cache-bypass cookies, `allowQuery` to control which query params get independently cached (omit = every unique query value cached separately, which can quietly explode cache entries for routes with many query param combinations - set `allowQuery` deliberately for those routes).

Durable ISR storage persists 31 days per deployment; revalidation purges globally within 300ms. This works because SvelteKit declares cacheable routes at build time - plain `Cache-Control` headers don't give Vercel this advance knowledge, so they don't get request-collapsing or the fast global purge.

## `stale-while-revalidate` for API routes

```
Cache-Control: s-maxage=1, stale-while-revalidate=59
```

Serves cached for 1s, then stale-while-revalidating in the background for the next 59s. Vercel's proxy consumes and strips the SWR directive before it reaches the client - this exists specifically so a fresh deploy doesn't cause old-content-flash while browser caches catch up.

## Reading `x-vercel-cache` during debugging

`HIT` / `MISS` / `BYPASS` are self-explanatory. `STALE` means the SWR path served an old-but-acceptable response while regenerating in the background - expected behavior, not a bug. `REVALIDATED` means the cache entry was explicitly deleted (via `dangerouslyDeleteByTag()`, a framework revalidate call with no lifetime, or a dashboard purge) so this specific request paid full foreground generation latency - if a route is slow right after a manual cache purge, this is why.

## Do not do this

Do not tell a SvelteKit user to configure "Data Cache" as a SvelteKit-specific feature - it's a documented Next.js App Router primitive (segment-level `fetch` caching). SvelteKit gets ISR plus the framework-agnostic Runtime Cache, not "Data Cache" by that name.
