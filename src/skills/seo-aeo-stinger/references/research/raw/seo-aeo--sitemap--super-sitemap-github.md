# jasongitmail/super-sitemap - GitHub

- URL: https://github.com/jasongitmail/super-sitemap
- Fetched: 2026-08-14
- Source type: community
- Component: sitemap

## Notes

Community library for SvelteKit sitemap generation, mounted the same way as the hand-rolled endpoint pattern: `/src/routes/sitemap.xml/+server.js`.

```ts
// /src/routes/sitemap.xml/+server.ts
import * as sitemap from 'super-sitemap';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  return await sitemap.response({
    origin: 'https://example.com',
  });
};
```

Always include the `.xml` extension on the sitemap route name (e.g. `sitemap.xml`) -- this ensures the correct `application/xml` content type is sent even if the sitemap is prerendered to a static file.

For sites with dynamic slugs, pass a `paramValues` map so the library can expand `[[page]]` or `[slug]` routes; it also supports paginated sitemap indexes: when total URLs exceeds `maxPerPage` (defaults to 50,000, per the sitemap protocol), `sitemap.xml` returns a sitemap index instead of a flat list. Route pattern for pagination: `/src/routes/sitemap[[page]].xml/+server.ts`.

Complementary manual pattern (from other SvelteKit docs/blogs, confirms the same endpoint convention): combine hardcoded static routes with dynamic entries fetched from a CMS/API inside the `GET` handler, join them into a `<urlset>` XML string, and set `Content-Type: application/xml` plus a `Cache-Control` header (e.g. `max-age=0, s-maxage=3600`) so the sitemap is edge-cached but revalidated. Also add `export const prerender = true` to the endpoint if the sitemap can be built once per deploy rather than computed per-request. Always reference the sitemap URL from `robots.txt` via a `Sitemap:` directive so any crawler (not just Google) can discover it.
