# Vercel caching: ISR, Data Cache, Cache-Control header precedence, cache status

- URL: https://vercel.com/docs/incremental-static-regeneration ; https://vercel.com/docs/caching/cache-control-headers ; https://vercel.com/docs/caching/runtime-cache/data-cache ; https://vercel.com/docs/caching/cache-status
- Fetched: 2026-08-14
- Source type: Official Vercel docs
- Component: Caching / ISR / Data Cache / Cache-Control

## Content

### ISR model

ISR follows the stale-while-revalidate pattern: visitors get a fast cached response while Vercel regenerates the page in the background on a time interval or on-demand API call. Vercel manages `Cache-Control` headers automatically for ISR routes - "zero configuration overhead." Key properties:
- **Durable storage**: ISR cache lives alongside the function's region and persists content for **31 days**, or until revalidated. Scoped per deployment; each deployment gets its own cache.
- **Request collapsing**: concurrent requests to the same uncached path collapse into a single function invocation per region.
- **Globally consistent purging**: revalidated content purges/updates across all regions within **300ms**; HTML and data payloads purge atomically.
- Next.js, SvelteKit, Nuxt, Astro, and Gatsby all declare cacheable routes at build time so Vercel knows cacheability ahead of the first request - this is what unlocks request collapsing, durable storage, fast global purge, instant rollbacks, and path grouping. Plain `Cache-Control` headers alone don't give Vercel this foreknowledge.
- On revalidation failure, Vercel preserves stale content and retries with a 30-second TTL.
- ISR cache region = the project's default Function region (configurable in Settings; affects pricing/latency).

### Cache-Control header precedence (three headers, three scopes)

1. **`Vercel-CDN-Cache-Control`** - Vercel-exclusive, highest priority, controls only Vercel's own cache. Stripped before reaching the client.
2. **`CDN-Cache-Control`** - second priority, always overrides `Cache-Control` for CDN behavior (works across Vercel and other CDNs).
3. **`Cache-Control`** - standard web header, lowest priority of the three; if neither of the above is set, this is what Vercel's cache uses, then forwards toward the client (its `s-maxage` portion is stripped before hitting the browser).

Default header if nothing is set: `cache-control: public, max-age=0, must-revalidate` (both CDN and browser told not to cache).

### `stale-while-revalidate`

Serves from CDN cache while regenerating in the background. Example: `Cache-Control: s-maxage=1, stale-while-revalidate=59` - serve cached for 1s, then serve stale + revalidate async on subsequent requests. Vercel's proxy consumes and strips `stale-while-revalidate` before the response reaches the client (prevents content-flash after new deploys). For synchronous revalidation, add `pragma: no-cache`; the response reports `x-vercel-cache: REVALIDATED`.

### Data Cache (Next.js App Router-specific)

Auto-enabled for Next.js App Router deployments on Vercel; caches segment-level `fetch` data alongside ISR. Time-based and on-demand (via `res.revalidate`, `revalidateTag`, `revalidatePath`) revalidation. Cache is NOT updated at build time - invalidation triggers a runtime update on the next request. This is Next.js-specific; SvelteKit does not have an equivalent named "Data Cache," but Vercel's general Runtime Cache (fetch/DB/computed-value caching inside functions) works framework-agnostically alongside any of the above caching layers.

Cache-layer decision table (framework-agnostic reasoning):
| Scenario | Cache layer |
|---|---|
| Entirely static pages | ISR |
| Mixed static + dynamic page | Data cache (Next.js) / Runtime Cache (general) + ISR |
| Data fetched during function execution | Data cache / Runtime Cache |
| Complete HTTP responses (images, fonts) | CDN cache |

### `x-vercel-cache` status values

`HIT` (served from cache), `MISS` (not cached, generated fresh and stored if cacheable), `BYPASS` (cache skipped deliberately), `STALE` (served an existing-but-stale response, refreshed in background - this is the stale-while-revalidate path), `PRERENDER` (served from build-time static storage), `REVALIDATED` (cached entry had been explicitly deleted, e.g. via `dangerouslyDeleteByTag()` or a dashboard purge, so Vercel regenerated in the foreground and the request pays full generation latency - no stale fallback available).
