# Vercel - SvelteKit Docs (adapter-vercel)

- URL: https://svelte.dev/docs/kit/adapter-vercel
- Fetched: 2026-08-14
- Source type: official-docs
- Component: core-web-vitals

## Notes

### Function config

`memory`: amount of memory available to the function, default 1024 MB, can be decreased to 128 MB or increased in 64 MB increments up to 3008 MB on Pro/Enterprise. `maxDuration`: default 10s (Hobby), 15s (Pro), 900s (Enterprise).

### Incremental Static Regeneration (ISR)

Vercel supports ISR: performance/cost advantages of prerendered content with the flexibility of dynamically rendered content. Use ISR only on routes where every visitor should see the same content (like prerendering) -- anything user-specific (session cookies) should happen client-side via JavaScript so it isn't leaked across visitors.

```ts
// +page.server.ts or route config
export const config = {
  isr: {
    expiration: 60,               // required: seconds before regeneration
    allowQuery: ['slug'],         // optional: query params that affect the cache key; others (utm tracking) are ignored
  }
};
```

`expiration` is required; other properties optional. Using ISR on a route with `export const prerender = true` has no effect since the route is already prerendered at build time. Pages that are prerendered ignore ISR configuration entirely.

ISR generated pages are cached AND persisted to durable storage; Vercel caches generated pages across every region on its global Edge Network with automatic cache shielding (cache MISS falls back to a single global bucket lookup, improving hit ratio vs. plain `Cache-Control` headers where caches expire per-region and aren't shared).

### Image Optimization (Vercel adapter config)

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';

const config = {
	kit: {
		adapter: adapter({
			images: {
				sizes: [640, 828, 1200, 1920, 3840],
				formats: ['image/avif', 'image/webp'],
				minimumCacheTTL: 300,
				domains: ['example-app.vercel.app'],
			}
		})
	}
};

export default config;
```

### Rendering strategy summary (from SvelteKit "Performance" and "Project types" docs, same domain)

Default hybrid rendering: SSR for the first page visited (best SEO + perceived performance), CSR for subsequent client-side navigations (faster, no flash) -- called a "transitional app." `adapter-static` can fully prerender a site as an SSG. Mixing prerendered, SSR, and ISR routes within one SvelteKit app is supported and, per the docs, is an advantage over purpose-built SSGs when working with very large or dynamic content sets. `adapter-vercel` and `adapter-netlify` also offer an `edge` runtime option for lower-latency SSR.
