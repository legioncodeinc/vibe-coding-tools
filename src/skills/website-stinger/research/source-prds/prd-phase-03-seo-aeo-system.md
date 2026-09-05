# Phase 3: SEO & AEO System

> **Site Template Guide**: PRD Phase 3 of 12

---

## Phase Overview

### Goals

Build a framework-aware SEO + AEO (Answer Engine Optimization) foundation. `generateSEO()` helper returns typed metadata consumed by `<svelte:head>`. Schema.org JSON-LD builders produce Article, Organization, BreadcrumbList, FAQPage, WebSite structures. Sitemap and robots.txt are SvelteKit `+server.ts` route handlers that pull published content slugs from Payload (or static data in fallback mode).

This phase delegates implementation to `seo-aeo-worker-bee` (SvelteKit track). See `seo-aeo-stinger/guides/sveltekit/` for full implementation guides.

### Scope

**In scope:**
- `src/lib/seo/generateSEO.ts`: typed metadata helper (`PUBLIC_*` env prefix)
- `src/lib/seo/schema.ts`: JSON-LD builders (Article, Organization, BreadcrumbList, FAQPage, WebSite, LocalBusiness)
- `src/routes/sitemap.xml/+server.ts`: dynamic sitemap (static pages + Payload slugs)
- `src/routes/robots.txt/+server.ts`: AI-inclusive robots policy
- `<svelte:head>` patterns in `+page.svelte` files for all public routes

**Out of scope:**
- Marketing copy, keyword research, editorial content
- OG image generation (optional, tracked separately)
- Google Search Console verification (ops task)

### Dependencies

- Phase 1: `apps/web/` monorepo structure
- Phase 7 (Payload mode): `posts` collection must exist to populate sitemap dynamically

---

## User Stories

### Story 1: Search Crawler: Full Metadata on Every Public Page

> As a **Search Crawler**, I want every public page to have accurate `<title>`, `<meta description>`, `<link rel="canonical">`, and Open Graph tags so that pages are indexed and previewed correctly.

**Acceptance criteria:**
- Every public route's `+page.svelte` has `<svelte:head>` with: `<title>`, `<meta name="description">`, `<link rel="canonical">`, OG tags, Twitter Card tags
- Canonical URL is absolute (`https://...`) not relative
- `generateSEO()` used consistently; no ad-hoc meta strings scattered across routes

### Story 2: AI Assistant: Structured Schema on Article Pages

> As an **AI Assistant** scraping the site for citations, I want Article schema.org JSON-LD on every blog post so that the content can be attributed to its author and publication date.

**Acceptance criteria:**
- `/blog/[slug]` pages include `<script type="application/ld+json">` with Article schema
- Article schema contains: `headline`, `description`, `datePublished`, `dateModified`, `author` (Person with `sameAs`), `publisher` (Organization), `image`
- Passes Google Rich Results Test

### Story 3: Search Crawler: Dynamic Sitemap

> As a **Search Crawler**, I want `/sitemap.xml` to return all public routes including all published blog post slugs so that new content is discovered promptly.

**Acceptance criteria:**
- `/sitemap.xml` returns well-formed XML
- Includes static marketing pages and all published Payload posts (Payload mode) or all `blogPosts` entries (TypeScript-as-CMS fallback)
- Includes `<lastmod>`, `<changefreq>`, `<priority>` for each URL
- Excludes draft posts

### Story 4: AI Crawler: Inclusive robots.txt

> As an **AI Crawler** (GPTBot, ClaudeBot, PerplexityBot), I want `/robots.txt` to allow access so that the site's content is included in AI knowledge bases and can be cited by AI assistants.

**Acceptance criteria:**
- `/robots.txt` allows all user agents by default
- Explicitly allows: `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Googlebot-Extended`
- Disallows: `/admin/`, `/api/`
- Includes `Sitemap:` line pointing to `/sitemap.xml`

---

## Technical Specification

### generateSEO.ts

See `seo-aeo-stinger/templates/sveltekit/generateSEO.ts` (also at `website-stinger/templates/generateSEO.svelte.ts`).

Key design decisions:
- Uses `PUBLIC_SITE_URL` and `PUBLIC_SITE_NAME` (`PUBLIC_*` prefix is SvelteKit's convention for browser-safe env vars)
- Returns a typed `SEOData` object consumed by `<svelte:head>` in `+page.svelte`
- Supports `noindex` flag for admin, staging, and intentionally excluded pages

### schema.ts

See `seo-aeo-stinger/templates/sveltekit/schema.ts` for the full utility library.

Schema types implemented:
- `buildOrganizationSchema()`: site-wide Organization
- `buildArticleSchema()`: blog posts (required: title, description, url, publishedAt, authorName)
- `buildBreadcrumbSchema()`: all multi-level routes
- `buildFAQSchema()`: FAQ sections (improves AI Overview extraction)
- `buildLocalBusinessSchema()`: for sites with a physical address
- `buildWebSiteSchema()`: homepage (Sitelinks search box eligible)

### sitemap.xml/+server.ts

```ts
// Payload mode: fetches from Payload REST API
const res = await fetch(`${PAYLOAD_API_URL}/api/posts?where[status][equals]=published&fields=slug,updatedAt&limit=1000`);

// TypeScript-as-CMS fallback: imports from data file
import { blogPosts } from '$lib/content/blog';
```

### robots.txt/+server.ts

See `seo-aeo-stinger/templates/sveltekit/robots-server.ts`.

---

## Schema.org Type Decisions

| Page type | Schema.org type | Rationale |
|---|---|---|
| Homepage | `WebSite` + `Organization` | Sitelinks search box eligibility |
| Blog listing | `CollectionPage` | Crawlable collection structure |
| Blog post | `Article` + `BreadcrumbList` + `Person` | AI citation, E-E-A-T authorship |
| Contact / About | `Organization` or `LocalBusiness` | Depends on whether physical address exists |
| FAQ section | `FAQPage` | Featured snippet eligibility (People Also Ask) |

The retired `SportsActivityLocation` schema type from the original NST Sports codebase has been removed. Industry-specific schema types are not included in this template.

---

## Risks and Open Questions

- **R-1:** Sitemap generation fails silently if Payload is not running during SSR build. The `+server.ts` should catch Payload fetch errors and fall back to static routes only, logging a warning.
- **R-2:** `PUBLIC_SITE_URL` must be set in the Vercel environment. An empty value produces invalid canonical and sitemap URLs. Validate at build time.
- **Q-1:** Should Article schema `author.sameAs` link to a Payload Users collection page, a LinkedIn URL, or both? For generic templates, use a configurable array from `SiteSettings` Global.
- **Q-2:** Does the `WebSite` schema's `SearchAction` potentialAction actually produce a sitelinks search box for smaller sites? Keep it but do not promise it. Google's threshold for showing this is not publicly documented.
