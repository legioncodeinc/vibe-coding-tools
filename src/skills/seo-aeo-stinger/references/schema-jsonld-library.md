# Schema / JSON-LD snippet library (Svelte 5 / SvelteKit)

Copy-paste-ready builders and injection patterns. All schema types here are among the ~30 Google documents required-property guidance for [raw/seo-aeo--structured-data--google-confirms-no-ranking-boost-sej.md]. Schema does not move classic Google rankings directly, but it raises rich-result eligibility, click-through rate, and AI-citation selection probability -- schema markup had the strongest content-level odds ratio (1.31) for AI citation in the largest study archived [raw/seo-aeo--geo-aeo--ai-citations-research-machinerelations.md]. Always match markup to what is visibly on the page; mismatched schema risks a structured-data spam manual action.

## Injection pattern

SvelteKit does not auto-merge layout-level and page-level JSON-LD; compose it explicitly [raw/seo-aeo--structured-data--jsonld-sveltekit-dallas-lu.md]. Use a real `<script>` element inside `<svelte:head>` with `{@html}` limited to the serialized JSON text, never to the surrounding tag:

```svelte
<!-- src/lib/seo/JsonLd.svelte -->
<script lang="ts">
  let { schema }: { schema: Record<string, unknown> | Record<string, unknown>[] } = $props();

  const json = $derived(JSON.stringify(schema));
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${json}</script>`}
</svelte:head>
```

Usage on any route:

```svelte
<!-- src/routes/blog/[slug]/+page.svelte -->
<script lang="ts">
  import JsonLd from '$lib/seo/JsonLd.svelte';
  import { buildArticleSchema, buildBreadcrumbSchema } from '$lib/seo/schema';

  let { data } = $props();

  const schema = $derived([
    buildArticleSchema(data.post),
    buildBreadcrumbSchema(data.breadcrumbs),
  ]);
</script>

<JsonLd {schema} />
```

## Builder library (`src/lib/seo/schema.ts`)

```ts
// src/lib/seo/schema.ts
import { PUBLIC_SITE_URL, PUBLIC_SITE_NAME } from '$env/static/public';

interface PostForSchema {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;   // ISO 8601
  updatedAt: string;     // ISO 8601
  heroImage?: string;    // absolute URL
  author: { name: string; url?: string };
}

export function buildArticleSchema(post: PostForSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.heroImage ? [post.heroImage] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: post.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: PUBLIC_SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${PUBLIC_SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${PUBLIC_SITE_URL}/blog/${post.slug}`,
    },
  };
}

interface Crumb {
  name: string;
  path?: string; // omit on the final (current-page) crumb
}

export function buildBreadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      ...(crumb.path ? { item: `${PUBLIC_SITE_URL}${crumb.path}` } : {}),
    })),
  };
}

interface FaqItem {
  question: string;
  answer: string; // plain text or simple HTML string, must match on-page visible text
}

export function buildFaqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

interface ProductForSchema {
  name: string;
  description: string;
  images: string[]; // absolute URLs
  sku: string;
  brand: string;
  price: string;   // e.g. "899.00"
  currency: string; // e.g. "USD"
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  ratingValue?: number;
  reviewCount?: number;
}

export function buildProductSchema(product: ProductForSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brand },
    offers: {
      '@type': 'Offer',
      priceCurrency: product.currency,
      price: product.price,
      availability: `https://schema.org/${product.availability}`,
      itemCondition: 'https://schema.org/NewCondition',
    },
    ...(product.ratingValue && product.reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.ratingValue,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };
}

export function buildOrganizationSchema(opts: {
  sameAs?: string[]; // social/profile URLs for entity disambiguation
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: PUBLIC_SITE_NAME,
    url: PUBLIC_SITE_URL,
    logo: `${PUBLIC_SITE_URL}/logo.png`,
    sameAs: opts.sameAs ?? [],
  };
}

interface LocalBusinessOpts {
  name: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  telephone: string;
  priceRange?: string; // e.g. "$$"
}

export function buildLocalBusinessSchema(biz: LocalBusinessOpts) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: biz.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: biz.streetAddress,
      addressLocality: biz.addressLocality,
      addressRegion: biz.addressRegion,
      postalCode: biz.postalCode,
      addressCountry: biz.addressCountry,
    },
    telephone: biz.telephone,
    priceRange: biz.priceRange,
    url: PUBLIC_SITE_URL,
  };
}
```

## Which type per page (mapped to website-stinger's SEO surface)

| Page type | Schema type(s) | Source |
| --- | --- | --- |
| Homepage | `Organization` + `WebSite` | [raw/seo-aeo--structured-data--google-confirms-no-ranking-boost-sej.md] (Organization feeds Knowledge Panel for branded queries) |
| Blog listing | `CollectionPage` (compose manually; no builder above -- low payoff type) | website-stinger `guides/03-seo-aeo.md` |
| Blog post | `Article` + `BreadcrumbList` + `Person` (author, nested in Article) | [raw/seo-aeo--structured-data--jsonld-sveltekit-dallas-lu.md] |
| Contact / location page | `LocalBusiness` (if a physical address exists) else `Organization` | [raw/seo-aeo--structured-data--google-confirms-no-ranking-boost-sej.md] |
| FAQ section on any page | `FAQPage`, only where the Q&A is genuinely visible on the page | [raw/seo-aeo--geo-aeo--geo-tactics-playbook-attrifast.md] (FAQ schema is one of the highest-ROI GEO tactics even though Google restricted the visual FAQ rich result in 2023) |
| Product / commerce page | `Product` with nested `Offer` and optional `AggregateRating` | builder above |

## Validation discipline

Never ship unvalidated schema. Run every new/changed JSON-LD block through Google's Rich Results Test (https://search.google.com/test/rich-results) and https://validator.schema.org before merge, per the Ship Gate quality pass. Record the pass/fail in the relevant `library/requirements/reports/seo/` report.
