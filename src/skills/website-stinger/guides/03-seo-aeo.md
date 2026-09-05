# 03: SEO & AEO System

Source PRD: `research/source-prds/prd-phase-03-seo-aeo-system.md`

---

## Delegation

Phase 3 delegates to `seo-aeo-worker-bee` (SvelteKit track). Read `seo-aeo-stinger/SKILL.md` and load `guides/sveltekit/` for all implementation details.

This guide records the website-stinger-specific scope: which routes need SEO, how the sitemap data source coordinates with Payload CMS, and the build report AC for this phase.

---

## SEO surface in this project

| Route pattern | SEO type | Data source |
|---|---|---|
| `/` (homepage) | Static, high-priority | Hardcoded / `app_settings` |
| `/blog` | Dynamic listing | Payload Posts collection via REST |
| `/blog/[slug]` | Per-post Article schema | Payload Post document |
| `/about`, `/contact`, `/services` | Static marketing | Hardcoded |
| `/sitemap.xml` | Sitemap | Static routes + Payload slugs |
| `/robots.txt` | AI-inclusive robots | Static |

---

## Key files to create (SvelteKit track)

- `apps/web/src/lib/seo/generateSEO.ts`: metadata helper (see `seo-aeo-stinger/templates/sveltekit/generateSEO.ts`)
- `apps/web/src/lib/seo/schema.ts`: JSON-LD builders (see `seo-aeo-stinger/templates/sveltekit/schema.ts`)
- `apps/web/src/routes/sitemap.xml/+server.ts`: dynamic sitemap (see `seo-aeo-stinger/templates/sveltekit/sitemap-server.ts`)
- `apps/web/src/routes/robots.txt/+server.ts`: robots (see `seo-aeo-stinger/templates/sveltekit/robots-server.ts`)

---

## Sitemap data source coordination

In Payload mode, the sitemap fetches published post slugs from the Payload REST API:

```ts
// In sitemap-server.ts
const postsRes = await fetch(
  `${PAYLOAD_API_URL}/api/posts?where[status][equals]=published&fields=slug,updatedAt&limit=1000`
);
const { docs: posts } = await postsRes.json();
```

In TypeScript-as-CMS fallback mode, import slugs directly from the data file:

```ts
import { blogPosts } from '$lib/content/blog';
const postPages = blogPosts.map((post) => ({ url: `/blog/${post.slug}`, ... }));
```

---

## Schema.org types used

| Page type | Schema type |
|---|---|
| Homepage | `WebSite` + `Organization` |
| Blog listing | `CollectionPage` |
| Blog post | `Article` + `BreadcrumbList` + `Person` (author) |
| Contact page | `LocalBusiness` (if physical address) or `Organization` |
| FAQ section | `FAQPage` |

---

## Handoff to seo-aeo-worker-bee

When invoking from a Phase 3 build:

> "Run seo-aeo-worker-bee Phase 3 on `apps/web`. Framework: SvelteKit. Use guides/sveltekit/ track. Create: sitemap, robots, generateSEO.ts, schema.ts, <svelte:head> patterns for blog routes."

---

## Phase acceptance criteria

| ID | Criterion |
|---|---|
| 3.1 | `generateSEO()` used in all public routes' `+page.ts` load functions |
| 3.2 | `/sitemap.xml` returns valid XML including all published Payload posts (Payload mode) or static data (fallback) |
| 3.3 | `/robots.txt` allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot) |
| 3.4 | Article schema injected via `<svelte:head>` on `/blog/[slug]` |
| 3.5 | Google Rich Results Test passes for Article schema on at least one post |
| 3.6 | All public pages have `<title>`, `<meta description>`, `<link rel="canonical">` |
| 3.7 | OG image URL is absolute (`https://...`) on all shared pages |
