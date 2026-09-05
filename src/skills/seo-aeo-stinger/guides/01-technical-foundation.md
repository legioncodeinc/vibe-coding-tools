# 01. Technical foundation

Routing, sitemap, robots.txt, canonicals, trailing slash. Read this guide before touching any route.

## Rendering strategy per route

Every route inherits three booleans from `+page.ts`/`+layout.ts`: `prerender`, `ssr`, `csr`. Set them deliberately per route, never leave them to default silently.

```ts
// src/routes/blog/[slug]/+page.ts
export const prerender = true;
export const ssr = true;
export const csr = true;
```

Rules, in priority order:

1. `ssr = false` is banned on any indexable route. It ships an empty HTML shell and is the single most common cause of thin/unindexed SvelteKit pages. [raw/seo-aeo--sveltekit-metadata--rendering-config-seo-architecture.md]
2. Prefer `prerender = true` for anything that does not vary per request (marketing pages, blog posts once published). Prerendered pages are served straight from the CDN edge with no compute, which is also the cheapest way to hit an LCP budget. [raw/seo-aeo--sveltekit-metadata--rendering-config-seo-architecture.md]
3. For CMS-driven dynamic routes, export an `entries()` function so the prerenderer can enumerate every slug -- without it, dynamic routes with no static file to infer paths from silently fail to prerender. [raw/seo-aeo--sveltekit-metadata--rendering-config-seo-architecture.md]
4. If content must update without a full redeploy, use Vercel ISR instead of full SSR. See `05-core-web-vitals-on-vercel.md`.

## Sitemap

Sitemap is an endpoint, not a static file. This is the framework-endorsed pattern, not a convention this skill invented:

```ts
// src/routes/sitemap.xml/+server.ts
import type { RequestHandler } from './$types';
import { PUBLIC_SITE_URL } from '$env/static/public';

const staticRoutes = ['/', '/about', '/contact', '/services'];

export const GET: RequestHandler = async ({ fetch }) => {
  const postsRes = await fetch(
    `${PUBLIC_PAYLOAD_API_URL}/api/posts?where[_status][equals]=published&fields=slug,updatedAt&limit=1000`
  );
  const { docs: posts } = await postsRes.json();

  const staticEntries = staticRoutes.map(
    (path) => `<url><loc>${PUBLIC_SITE_URL}${path}</loc></url>`
  );
  const postEntries = posts.map(
    (post: { slug: string; updatedAt: string }) =>
      `<url><loc>${PUBLIC_SITE_URL}/blog/${post.slug}</loc><lastmod>${post.updatedAt}</lastmod></url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...postEntries].join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=0, s-maxage=3600',
    },
  });
};
```

[raw/seo-aeo--sveltekit-metadata--svelte-dev-seo-docs.md], [raw/seo-aeo--sitemap--super-sitemap-github.md]

Notes:
- Keep the `.xml` extension on the route path so the correct content type ships even if the endpoint is later prerendered to a static file.
- In TypeScript-as-CMS fallback mode (no Payload), import slugs directly from `$lib/content/blog` instead of fetching the REST API.
- For sites approaching the 50,000-URL sitemap-protocol cap, use the community library `super-sitemap` (`npm i super-sitemap`), which handles sitemap-index pagination automatically. [raw/seo-aeo--sitemap--super-sitemap-github.md]
- Always add a `Sitemap:` line to `robots.txt` pointing at this endpoint.

## robots.txt

Also an endpoint, so it can vary by environment and stay in sync with the sitemap URL:

```ts
// src/routes/robots.txt/+server.ts
import type { RequestHandler } from './$types';
import { PUBLIC_SITE_URL } from '$env/static/public';

const AI_CRAWLERS = [
  'GPTBot', 'ChatGPT-User', 'OAI-SearchBot',
  'anthropic-ai', 'ClaudeBot',
  'PerplexityBot',
  'Google-Extended',
  'Amazonbot',
];

export const GET: RequestHandler = () => {
  const rules = AI_CRAWLERS.map((agent) => `User-agent: ${agent}\nAllow: /`).join('\n\n');

  const body = `${rules}

User-agent: *
Allow: /

Sitemap: ${PUBLIC_SITE_URL}/sitemap.xml
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
```

[raw/seo-aeo--robots--ai-crawlers-2026-yatna.md]

Ten AI crawlers matter for 2026 visibility: `GPTBot`, `ChatGPT-User`, `ClaudeBot`, `anthropic-ai`, `PerplexityBot`, `CCBot`, `Google-Extended`, `Amazonbot`, `meta-externalagent`, `Bytespider`. Training crawlers (`GPTBot`, `anthropic-ai`, `CCBot`) are separate from live-retrieval/browse crawlers (`ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, `OAI-SearchBot`) -- each can be allowed or blocked independently. The highest-priority default for a new marketing/content site is allowing the browse/search crawlers; blocking training crawlers is a legitimate, separate policy choice, not a prerequisite. [raw/seo-aeo--robots--ai-crawlers-2026-yatna.md]

Specific user-agent rules take precedence over the `*` wildcard.

## Canonical URLs

Resolve canonicals server-side, inside a `load` function, and strip tracking/pagination noise before building the URL. Never compute a canonical from `window.location` inside a `.svelte` component -- that is client-only and the crawler-visible first response ships without one. [raw/seo-aeo--sveltekit-metadata--rendering-config-seo-architecture.md]

See `references/metadata-helper-pattern.md` for the full `generateSEO()` implementation that produces `canonical` alongside every other metadata field.

## Trailing slash

SvelteKit strips trailing slashes by default (`trailingSlash = 'never'`): a request for `/foo/` redirects to `/foo`. Search engines treat `/foo` and `/foo/` as distinct URLs, so pick one policy and set it explicitly at the root layout:

```ts
// src/routes/+layout.ts
export const trailingSlash = 'never'; // or 'always' -- pick one, apply site-wide
```

Do not use `'ignore'` -- it accepts both forms and reintroduces the duplicate-URL problem the setting exists to prevent. [raw/seo-aeo--technical--sveltekit-routing-errors-trailingslash-docs.md]

Known edge case: a confirmed SvelteKit bug can strip a configured `'always'` trailing slash during client-side hydration if the nearest `+error.svelte` boundary sits below the layer where `trailingSlash` is set, occasionally causing a redirect loop. Set `trailingSlash` at or above the layer containing any `+error.svelte`, or define it in the root layout if the app has no route-level error boundaries. [raw/seo-aeo--technical--sveltekit-routing-errors-trailingslash-docs.md]

## 404 handling

A bare `+error.svelte` nested under an unmatched deep path never renders on its own -- SvelteKit's router fails to match any route at all for a path with no matching segment, so only the root `+error.svelte` renders. To get a scoped 404 for a route subtree, add a `[...path]` catch-all route and explicitly throw:

```ts
// src/routes/blog/[...path]/+page.server.ts
import { error } from '@sveltejs/kit';

export function load() {
  error(404, 'Not found');
}
```

[raw/seo-aeo--technical--sveltekit-routing-errors-trailingslash-docs.md]

## 301/308 redirects

```ts
import { redirect } from '@sveltejs/kit';

export function load({ params }) {
  redirect(308, `/blog/${newSlug}`); // 308 = permanent, keeps method, transfers SEO value
}
```

`308 Permanent Redirect` is the correct status for canonical URL migrations -- functionally equivalent to a classic 301 for search-engine purposes, and it keeps the request method (unlike 301/302 historically). `307` is for temporary redirects; `303` is for post-form-submission redirects (forces a GET). [raw/seo-aeo--technical--sveltekit-routing-errors-trailingslash-docs.md]

Caution: a `redirect()` thrown inside a universal `load` function running client-side (e.g. during a client-side navigation, not the initial server-rendered request) does not send a real HTTP status code -- it performs an internal `goto(..., { replaceState: true })`-equivalent navigation. When auditing redirects for SEO, verify the status against the server-rendered first-load response (`curl -I`), not client-side behavior. [raw/seo-aeo--technical--sveltekit-routing-errors-trailingslash-docs.md]

## Hreflang (gap flag)

No SvelteKit-specific hreflang source was archived for this skill; the target `website-stinger` stack brief does not specify multi-locale requirements by default. If a project needs `hreflang`, emit `<link rel="alternate" hreflang="...">` tags from the same metadata pipeline used for canonical, following the general hreflang spec, and treat locale-routing conventions (e.g. `[[locale]]` route params, `paraglide-sveltekit`) as project-specific research to do at that time -- do not assume a specific SvelteKit i18n library without checking current docs.
