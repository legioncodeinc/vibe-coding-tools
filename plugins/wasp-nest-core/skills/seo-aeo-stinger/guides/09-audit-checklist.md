# 09. Audit checklist

Run this top to bottom against an existing SvelteKit + Payload + Vercel site. Each row cites the guide with the full reasoning.

## Technical foundation (guides/01)

- [ ] No indexable route has `ssr = false`.
- [ ] Static-capable routes use `prerender = true`; CMS-driven dynamic routes export `entries()`.
- [ ] `/sitemap.xml` is a `+server.ts` endpoint, returns valid XML, `Content-Type: application/xml`, includes every published Payload slug.
- [ ] `/robots.txt` is a `+server.ts` endpoint, allows the target AI crawlers, includes a `Sitemap:` directive.
- [ ] `trailingSlash` is set explicitly (never `'ignore'`) at the root layout, consistently applied.
- [ ] Canonicals are resolved server-side in `load`, never from `window.location` in a component.
- [ ] Any URL migration uses `redirect(308, ...)`, verified via `curl -I` against the server-rendered response (not just client-side behavior).
- [ ] Deep 404s under a route subtree use a `[...path]` catch-all with an explicit `error(404, ...)`, not a bare nested `+error.svelte`.

## Metadata and head (guides/02)

- [ ] Every route calls the shared `generateSEO()` helper -- no hand-written one-off meta tags.
- [ ] Every route's title/description is unique (not silently inherited from the layout default for every page).
- [ ] SEO data comes from a `load` function, never `onMount()` or `document.title`.
- [ ] `noindex` pages are intentional -- flagged for confirmation before "fixing," never silently changed.

## Structured data (guides/03)

- [ ] Homepage has `Organization` + `WebSite` schema.
- [ ] Blog posts have `Article` + `BreadcrumbList` + nested `Person` author schema.
- [ ] Any visible FAQ section has matching `FAQPage` schema.
- [ ] Product pages have `Product` + `Offer`, and `AggregateRating` only if reviews are visibly present.
- [ ] Every shipped JSON-LD block passed Rich Results Test and validator.schema.org, with results recorded in a `library/requirements/reports/seo/` report.
- [ ] No schema claims a fact that is not visibly present on the page.

## Payload content model (guides/04)

- [ ] `@payloadcms/plugin-seo` is enabled on every content-bearing collection/global.
- [ ] `generateSEO()` reads `doc.meta.title`/`doc.meta.description`/`doc.meta.image` with a sane fallback to the base content fields.
- [ ] Sitemap and any indexation automation use Payload's `updatedAt` honestly (not a stale or fabricated timestamp).

## Core Web Vitals (guides/05)

- [ ] LCP candidate image has `fetchpriority="high"`, never `loading="lazy"`.
- [ ] Build-time images use `@sveltejs/enhanced-img`; CMS-sourced images route through Vercel Image Optimization.
- [ ] No `em`/`rem` inside any `sizes` attribute.
- [ ] ISR `expiration` is set only on routes where every visitor sees identical content.
- [ ] Field-data (CrUX, p75) LCP/INP/CLS numbers exist for the homepage and top templates, not just lab data.

## AEO / AI citation (guides/06)

- [ ] robots.txt allows `ChatGPT-User`, `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot` at minimum.
- [ ] Priority pages open each H2 section with a 40-80 word self-contained answer.
- [ ] Priority pages include at least one comparison/data table where content supports it.
- [ ] Statistics are specific and cited inline to a named source.
- [ ] `/llms.txt` exists and lists genuinely high-value pages (not the entire sitemap dumped in).
- [ ] High-value pages have a real update cadence, not a cosmetic timestamp bump.

## Content strategy / E-E-A-T (guides/07)

- [ ] Author bylines use `Person` schema with `sameAs` links to verifiable profiles.
- [ ] Content uses first-person experiential language where genuine experience exists, not generic third-person summary.
- [ ] No orphaned pages -- every page has 2-3+ inbound internal links from topically related content.
- [ ] No content published that meaningfully strays from the site's core topical focus without a clear reason.
- [ ] Pillar pages link to every cluster page; every cluster page links back to its pillar with descriptive anchor text.

## Indexation (guides/08)

- [ ] IndexNow is wired to fire on publish/update (Payload `afterChange` hook or equivalent).
- [ ] Google Indexing API is not being misused for non-`JobPosting`/`BroadcastEvent` content.
- [ ] Search Console URL Inspection has been used to verify (not just assume) recrawl on recently changed high-priority URLs.
- [ ] No page shows `Discovered - currently not indexed` for more than a few days without investigation (treat as a quality/crawl-budget signal, not a resubmission problem).

## Sign-off

An audit is not done until every unchecked box above has either a fix committed or an explicit, written reason it's out of scope for this pass. Silent skips are not acceptable per the Ship Gate discipline -- see `SKILL.md`.
