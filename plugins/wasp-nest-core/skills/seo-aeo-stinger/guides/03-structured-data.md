# 03. Structured data

JSON-LD in SvelteKit: Article, Product, FAQ, BreadcrumbList, Organization, LocalBusiness, and what Google actually rewards for each.

## What schema does and does not do

Google has confirmed, repeatedly, that structured data carries no direct ranking boost (John Mueller, 2018 and April 2025: "Structured data won't make your site rank better... There's no generic ranking boost for SD usage"). It makes a page eligible for a rich-result display (stars, price, breadcrumb trail, FAQ dropdown) and can lift click-through rate on the position already held -- that is the entire direct SEO mechanism. Google documents required properties for roughly 30 of schema.org's 800+ types; only those feed a visible rich-result feature. [raw/seo-aeo--structured-data--google-confirms-no-ranking-boost-sej.md]

For AI citation (GEO/AEO) specifically, schema matters far more: it was the single strongest content-level predictor of citation in the largest study archived for this skill (odds ratio 1.31 across 100,411 citation events), and FAQ/Article/HowTo schema correlates with 73% higher selection in Google AI Overviews. Ship schema for the AI-citation payoff even on pages where Google's own rich-result eligibility is narrow or restricted. [raw/seo-aeo--geo-aeo--ai-citations-research-machinerelations.md]

The one hard rule that applies to both audiences: schema must match what a human reader can see on the page. Marking up a rating, FAQ, or fact that isn't visibly present risks a structured-data spam manual action (rich results revoked, organic ranking untouched) -- and, separately, is not required or specially rewarded by AI Overviews per Google's own AI-features guidance. [raw/seo-aeo--structured-data--google-confirms-no-ranking-boost-sej.md]

## Injection pattern

SvelteKit does not auto-merge layout-level and page-level JSON-LD -- compose it explicitly. Site-wide schema (Organization, WebSite) lives in the root layout; page-specific schema (Article, Product, FAQPage, BreadcrumbList) is added per route and merged. [raw/seo-aeo--structured-data--jsonld-sveltekit-dallas-lu.md]

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

Use a real `<script>` element and limit `{@html}` to the serialized JSON text, not the surrounding tag -- this keeps the Svelte compiler aware of the element boundary. [raw/seo-aeo--structured-data--jsonld-sveltekit-dallas-lu.md]

Full builder library (Article, BreadcrumbList, FAQPage, Product, Organization, LocalBusiness) with copy-paste TypeScript: `references/schema-jsonld-library.md`.

## Type-per-page map

| Page type | Schema | Why |
| --- | --- | --- |
| Homepage | `Organization` + `WebSite` | Feeds the Knowledge Panel for branded searches; high leverage, trivial cost. |
| Blog post | `Article` + `BreadcrumbList` + nested `Person` (author) | Article family enables Top Stories/Discover eligibility where relevant; author `Person` feeds E-E-A-T signals (see `guides/07`). |
| FAQ section (any page) | `FAQPage`, only where a real, visible Q&A exists | Google restricted the visual FAQ rich result to a narrow set of sites in 2023, but FAQ schema still shows a measured 28-40% higher AI-citation probability -- ship it for AI citation value regardless of Google's rich-result restriction. |
| Product/commerce page | `Product` + nested `Offer` + optional `AggregateRating` | Drives Product rich results (price/availability/stars) for shopping queries; high impact on mobile. |
| Contact/location page | `LocalBusiness` if a physical address exists, else `Organization` | LocalBusiness feeds NAP consistency signals used in both classic local SEO and E-E-A-T trust evaluation. |

## Validation is not optional

Run every new or changed JSON-LD block through Google's Rich Results Test (https://search.google.com/test/rich-results) and https://validator.schema.org before merge. This is the second gate of the Ship Gate quality pass -- invalid schema is worse than no schema, because it can trigger indexation warnings without providing any of the rich-result or AI-citation benefit. Record validation output in the relevant `library/requirements/reports/seo/` report.
