# Metadata helper pattern (Svelte 5 / SvelteKit)

This is the canonical `generateSEO()` pattern for this stack, matching `website-stinger/templates/generateSEO.svelte.ts` exactly so Phase 3 of a `website-stinger` build and any standalone `seo-aeo-stinger` invocation produce the same shape. Do not invent a different metadata object shape for a project already using `website-stinger` -- extend this one.

Grounding: `<svelte:head>` semantics [raw/seo-aeo--sveltekit-metadata--svelte-head-docs.md]; `load`-to-`svelte:head` pipeline and canonical normalization [raw/seo-aeo--sveltekit-metadata--rendering-config-seo-architecture.md]; SvelteKit's `PUBLIC_*` env convention (not `NEXT_PUBLIC_*`).

## The helper

```ts
// src/lib/seo/generateSEO.ts
import { PUBLIC_SITE_URL, PUBLIC_SITE_NAME } from '$env/static/public';

export interface SEOProps {
  title: string;
  description: string;
  /** URL path ('/blog/my-post') or full URL. Resolved against PUBLIC_SITE_URL if a path. */
  url?: string;
  type?: 'website' | 'article';
  image?: string; // absolute URL; defaults to /og-default.png
  imageAlt?: string;
  publishedTime?: string;  // ISO 8601, article type only
  modifiedTime?: string;   // ISO 8601, article type only
  author?: string;
  noindex?: boolean;
}

export interface SEOData {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogType: string;
  ogImage: string;
  ogImageAlt: string;
  twitterCard: 'summary_large_image' | 'summary';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex: boolean;
}

const DEFAULT_OG_IMAGE = `${PUBLIC_SITE_URL}/og-default.png`;

export function generateSEO(props: SEOProps): SEOData {
  const {
    title, description, url = '/', type = 'website',
    image = DEFAULT_OG_IMAGE, imageAlt, publishedTime, modifiedTime, author,
    noindex = false,
  } = props;

  const fullTitle = title.includes(PUBLIC_SITE_NAME) ? title : `${title} | ${PUBLIC_SITE_NAME}`;
  const canonical = url.startsWith('http') ? url : `${PUBLIC_SITE_URL}${url}`;

  return {
    title: fullTitle,
    description,
    canonical,
    ogTitle: fullTitle,
    ogDescription: description,
    ogUrl: canonical,
    ogType: type,
    ogImage: image,
    ogImageAlt: imageAlt ?? title,
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: description,
    twitterImage: image,
    publishedTime,
    modifiedTime,
    author,
    noindex,
  };
}
```

## Canonical normalization (strip tracking params)

Per [raw/seo-aeo--sveltekit-metadata--rendering-config-seo-architecture.md], a load function is the right place to strip `utm_*`/`ref`/pagination noise before building the canonical, so every tracked variant of a URL collapses to one self-referencing canonical:

```ts
// src/routes/+layout.server.ts (or a per-route +page.server.ts)
export function normalizeCanonical(requestUrl: URL, sitePath: string): string {
  // sitePath is the clean path with no query string; build canonical from it, not requestUrl directly.
  return `${sitePath}`;
}
```

Never derive the canonical from `window.location` inside a `.svelte` component -- resolve it server-side in `load` (either `+page.server.ts` or `+page.ts`, both run server-side on first request) and pass it as data. Client-only computation means the crawler-visible first response has no canonical at all.

## Wiring into a route

```ts
// +page.ts
import type { PageLoad } from './$types';
import { generateSEO } from '$lib/seo/generateSEO';

export const load: PageLoad = ({ url }) => {
  return {
    seo: generateSEO({
      title: 'Blog',
      description: 'Our latest articles',
      url: url.pathname,
    }),
  };
};
```

```svelte
<!-- +page.svelte -->
<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.seo.title}</title>
  <meta name="description" content={data.seo.description} />
  <link rel="canonical" href={data.seo.canonical} />
  <meta property="og:title" content={data.seo.ogTitle} />
  <meta property="og:description" content={data.seo.ogDescription} />
  <meta property="og:url" content={data.seo.ogUrl} />
  <meta property="og:type" content={data.seo.ogType} />
  <meta property="og:image" content={data.seo.ogImage} />
  <meta property="og:image:alt" content={data.seo.ogImageAlt} />
  <meta name="twitter:card" content={data.seo.twitterCard} />
  <meta name="twitter:title" content={data.seo.twitterTitle} />
  <meta name="twitter:description" content={data.seo.twitterDescription} />
  <meta name="twitter:image" content={data.seo.twitterImage} />
  {#if data.seo.publishedTime}
    <meta property="article:published_time" content={data.seo.publishedTime} />
  {/if}
  {#if data.seo.modifiedTime}
    <meta property="article:modified_time" content={data.seo.modifiedTime} />
  {/if}
  {#if data.seo.noindex}
    <meta name="robots" content="noindex, nofollow" />
  {/if}
</svelte:head>
```

## Payload-sourced pages

When metadata comes from Payload's `@payloadcms/plugin-seo` `meta` group [raw/seo-aeo--payload-cms--seo-plugin.md], map it into `generateSEO()` inputs rather than bypassing the helper:

```ts
// +page.server.ts for a Payload-backed route
export const load: PageServerLoad = async ({ fetch, params }) => {
  const res = await fetch(`${PAYLOAD_API_URL}/api/posts?where[slug][equals]=${params.slug}&where[_status][equals]=published`);
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

## noindex discipline

Pages with `noindex: true` set intentionally (staging, preview, thank-you pages, internal tools) are sacred -- never silently "fix" a noindex without explicit user confirmation, since it may be deliberate. Flag ambiguous noindex/canonical/robots cases as a question rather than auto-correcting.
