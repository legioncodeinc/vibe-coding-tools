# SvelteKit SEO Configuration - SEO Architecture

- URL: https://www.seo-architecture.com/framework-seo-configuration/sveltekit-seo-configuration/
- Fetched: 2026-08-14
- Source type: community
- Component: sveltekit-metadata

## Notes

SvelteKit gives per-route control over whether a page is prerendered to static HTML, server-rendered on demand, or shipped as a client-only shell -- that single choice determines what a crawler actually sees.

Requirements assumed: SvelteKit 2+ with Svelte 4 or 5 (page-option semantics stable from v2); an adapter (`@sveltejs/adapter-vercel` etc.); a CMS endpoint returning slugs/titles/descriptions/body over REST or GraphQL; `PUBLIC_SITE_URL` set to a protocol-prefixed absolute domain in every build environment (never relative); curl and a headless browser available in CI to validate prerendered output.

Flow: SvelteKit Route -> `+page.ts` options (prerender/ssr decision) -> `load()` SEO data -> `svelte:head` (canonical + meta) -> Adapter Output HTML to crawler.

Every route inherits three booleans, exported from `+page.ts` (or `+layout.ts` for a subtree):

```ts
// src/routes/blog/[slug]/+page.ts
export const prerender = true;   // emit static HTML at build time
export const ssr = true;         // render on the server (never false for indexable content)
export const csr = true;         // keep client hydration for interactivity
```

Setting `ssr = false` ships an empty shell and is the single most common cause of thin indexed pages in SvelteKit. Leave `ssr` on for anything a crawler must read. Use `prerender = true` for content that does not change per request.

### Server load returning SEO data

```ts
// src/routes/blog/[slug]/+page.server.ts
import type { PageServerLoad } from './$types';
import { PUBLIC_SITE_URL } from '$env/static/public';
import { getCmsEntry } from '$lib/cms';

export const load: PageServerLoad = async ({ params }) => {
  const entry = await getCmsEntry(params.slug);
  return {
    title: entry.title,
    description: entry.description,
    canonical: `${PUBLIC_SITE_URL}/blog/${params.slug}`,
  };
};
```

Using `+page.server.ts` keeps the CMS token and URL resolver server-side; returned data is serialized into the HTML and rehydrated, present for crawlers that don't execute JavaScript.

### svelte:head binding

```svelte
<!-- src/routes/blog/[slug]/+page.svelte -->
<script lang="ts">
  export let data;
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content={data.description} />
  <link rel="canonical" href={data.canonical} />
</svelte:head>
```

### Prerendering dynamic routes

The `entries` export lets you prerender dynamic routes by enumerating params to build -- essential for CMS-driven pages with no static file to infer paths from.

### Troubleshooting table

| Symptom | Root cause | Fix |
| --- | --- | --- |
| Page body empty in view-source | `export const ssr = false` on the route or layout | Remove the override or set `ssr = true` for indexable routes |
| Dynamic route not prerendered | No `entries()` export | Add an `entries` generator returning every slug from the CMS |
| Canonical tag missing in production | Canonical built from `window.location` in a component | Resolve the absolute URL in `+page.server.ts` and bind it in `svelte:head` |
| Trailing-slash duplicate URLs indexed | `trailingSlash` policy differs between adapter and links | Set `export const trailingSlash = 'never'` and keep internal links consistent |
| High crawler TTFB on dynamic routes | Origin SSR far from the crawler | Switch to an edge adapter or prerender the route if content allows |

For dynamic SSR routes, an edge adapter (`adapter-cloudflare`) runs closest to the crawler for fastest TTFB. For static-capable content, prerendering is faster still (served from CDN with no compute).
