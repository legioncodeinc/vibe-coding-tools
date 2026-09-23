# 04. Payload content model for SEO

The `@payloadcms/plugin-seo` SEO fields and how a SvelteKit frontend consumes them.

## What the plugin gives you

`@payloadcms/plugin-seo` adds a `meta` field group (`title`, `description`, `image` by default) to any enabled Payload Collection or Global. Editors get an "auto-generate" button per field wired to server-side generator functions you configure, plus a live SERP-style preview with character counters in the admin panel. [raw/seo-aeo--payload-cms--seo-plugin.md]

```ts
// apps/cms payload.config.ts
import { seoPlugin } from '@payloadcms/plugin-seo';

export default buildConfig({
  plugins: [
    seoPlugin({
      collections: ['posts', 'pages'],
      globals: ['siteSettings'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `${doc.title} | Acme`,
      generateDescription: ({ doc }) => doc.excerpt,
      generateImage: ({ doc }) => doc.featuredImage,
      generateURL: ({ doc, collectionSlug }) => `https://example.com/${collectionSlug}/${doc.slug}`,
      tabbedUI: true,
    }),
  ],
});
```

[raw/seo-aeo--payload-cms--seo-plugin.md]

For a custom admin layout (e.g. an SEO tab alongside other tabs), import the individual field builders directly instead of relying on the plugin's default grouping: `MetaTitleField`, `MetaDescriptionField`, `MetaImageField`, `PreviewField`, `OverviewField` from `@payloadcms/plugin-seo/fields`. [raw/seo-aeo--payload-cms--seo-plugin.md]

Custom fields (a canonical-URL override, raw JSON-LD, an `og:title` distinct from the page title) can be injected into the `meta` group via the plugin's `fields` config function.

## There is no SvelteKit-specific adapter, and that's fine

The plugin is admin/Payload-side only. Whatever framework consumes the API, the `meta` object arrives as plain JSON on the document -- `doc.meta.title`, `doc.meta.description`, `doc.meta.image`. A SvelteKit frontend treats it exactly like any other REST-returned field; there is nothing SvelteKit-specific to install on the Payload side. [raw/seo-aeo--payload-cms--seo-plugin.md]

## Consuming it from SvelteKit

Payload's official docs explicitly list SvelteKit as a supported non-Next.js frontend, consumed via the REST API (the Local API requires an in-process Payload instance and does not fit the `apps/web` + `apps/cms` split-deployment architecture this stack uses). [raw/seo-aeo--payload-cms--rest-api-outside-nextjs-sveltekit.md]

REST query pattern: bracket-notation filters, `where[<field>][<operator>]=<value>`.

```ts
// apps/web src/routes/blog/[slug]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PAYLOAD_API_URL } from '$env/static/private';
import { generateSEO } from '$lib/seo/generateSEO';

export const load: PageServerLoad = async ({ fetch, params }) => {
  const res = await fetch(
    `${PAYLOAD_API_URL}/api/posts?where[slug][equals]=${params.slug}&where[_status][equals]=published&depth=1`
  );
  const { docs } = await res.json();
  const post = docs[0];
  if (!post) error(404, 'Not found');

  return {
    post,
    seo: generateSEO({
      title: post.meta?.title ?? post.title,
      description: post.meta?.description ?? post.excerpt,
      url: `/blog/${post.slug}`,
      type: 'article',
      image: post.meta?.image?.url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      author: post.author?.name,
    }),
  };
};
```

[raw/seo-aeo--payload-cms--rest-api-outside-nextjs-sveltekit.md], `references/metadata-helper-pattern.md`

Responses are paginated envelopes: `{ docs, totalDocs, page, hasNextPage, hasPrevPage }`. Use `limit`/`page`/`sort` query params for listing pages; never fetch an unbounded collection for a sitemap or archive page.

## Optional: the official SDK

`@payloadcms/sdk` gives a fully type-safe REST client for any framework, including a custom `fetch` hook useful for forwarding cookies (SSR auth) or a Vercel preview-protection bypass header when the CMS project has deployment protection enabled:

```ts
import { PayloadSDK } from '@payloadcms/sdk';
import type { Config } from '../payload-types';

export const sdk = new PayloadSDK<Config>({ baseURL: `${PAYLOAD_API_URL}/api` });
```

[raw/seo-aeo--payload-cms--rest-api-outside-nextjs-sveltekit.md]

## Sitemap and indexation coordination

The sitemap endpoint (`guides/01-technical-foundation.md`) fetches published slugs the same way -- `where[_status][equals]=published&fields=slug,updatedAt`. Keep the sitemap's `<lastmod>` values tied to Payload's `updatedAt`, since that field is also the honest input to any IndexNow/Search-Console recrawl-freshness check (`guides/08-launch-and-indexation-playbook.md`).

## Production validation

Multiple teams have confirmed running Payload and a Svelte frontend as two separately deployed services (no merged Node process), communicating purely over REST -- this validates the `apps/cms` (Next.js + Payload on its own Vercel project) plus `apps/web` (SvelteKit on its own Vercel project) split that `website-stinger` defaults to. [raw/seo-aeo--payload-cms--rest-api-outside-nextjs-sveltekit.md]
