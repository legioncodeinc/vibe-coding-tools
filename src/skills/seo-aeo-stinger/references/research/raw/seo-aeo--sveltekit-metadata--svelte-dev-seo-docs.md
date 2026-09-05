# SEO - SvelteKit Docs

- URL: https://svelte.dev/docs/kit/seo
- Fetched: 2026-08-14
- Source type: official-docs
- Component: sveltekit-metadata

## Notes

Every page should have well-written and unique `<title>` and `<meta name="description">` elements inside `<svelte:head>`. Guidance on writing descriptive titles and descriptions is in Google's Lighthouse SEO audits documentation.

A common pattern: return SEO-related `data` from page `load` functions, then use it (as `page.data`) in a `<svelte:head>` in the root layout.

### Sitemaps

Sitemaps help search engines prioritize pages, particularly for large sites. Create one dynamically using an endpoint at `src/routes/sitemap.xml/+server.ts`:

```ts
export async function GET(): Promise<Response> {
	return new Response(
		`<?xml version="1.0" encoding="UTF-8" ?>
		<urlset
			xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
			xmlns:xhtml="http://www.w3.org/1999/xhtml"
			xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
			xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
			xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
			xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
		>
			<!-- <url> elements go here -->
		</urlset>`.trim(),
		{
			headers: {
				'Content-Type': 'application/xml'
			}
		}
	);
}
```

This is the canonical, framework-endorsed sitemap pattern: an endpoint file (`+server.ts`), not a static file, returning `Content-Type: application/xml`.
