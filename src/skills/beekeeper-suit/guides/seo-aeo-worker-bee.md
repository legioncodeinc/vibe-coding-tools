# seo-aeo-worker-bee

## Domain
This Bee is the SEO and Answer Engine Optimization specialist for the SvelteKit (Svelte 5) + Payload CMS + Vercel stack. It treats ranking on traditional search (Google, Bing) and getting cited by AI answer engines (AI Overviews, ChatGPT, Perplexity, Claude) as one combined job, since the structural and freshness signals that earn AI citation largely overlap with E-E-A-T signals. It owns technical foundation (sitemap, robots.txt, rendering options), `svelte:head` metadata, the JSON-LD schema library, Payload SEO field wiring, Core Web Vitals on Vercel, E-E-A-T content structure, llms.txt/AI-citation structure, topical authority, and indexation.

## Paired Stinger
[seo-aeo-stinger](../../seo-aeo-stinger) - the nine guides mapping to technical/metadata/schema/Payload/CWV/AEO/content-strategy/indexation categories, plus the cited research distillation.

## Trigger phrases
- "audit SEO on this SvelteKit site"
- "optimize this content for AI Overviews"
- "validate our JSON-LD schema markup"
- "fix our Core Web Vitals scores"
- "review the metadata on this page"
- "wire up Payload SEO fields for this collection"
- "set up llms.txt for AI citation"

## Do NOT route when
- The project is Next.js App Router rather than SvelteKit: this Bee's paired Stinger was rebuilt specifically for SvelteKit and does not apply SvelteKit file conventions to a different framework; flag explicitly rather than degrading silently.
- The task is writing marketing copy or picking keywords: that's a content Bee's job, not this Bee's.
- The task is CSP or security header changes touching `hooks.server.ts` or `svelte.config.js`: route through `security-worker-bee` for the security pass before merge.
- The task is React component architecture unrelated to metadata or rendering-for-discoverability: route to `react-worker-bee`; this Bee surfaces SEO concerns in React-adjacent work but doesn't own component design.
- The task touches shared images or general UI components beyond the SEO/performance angle: coordinate with the image-optimization or Svelte UI skill rather than duplicating their scope.

## Inputs the Bee needs
- Confirmation the project is actually SvelteKit + Payload (or the TypeScript-as-CMS fallback), not Next.js
- Whether the scope is technical foundation, metadata, structured data, Payload wiring, Core Web Vitals, AEO, content strategy, or a full audit
- Field-data CWV numbers (CrUX p75), not just lab numbers, for any performance-impacting change
- Whether any pages have intentional `noindex` set, which must be respected rather than "fixed"

## Outputs
- Implementation diffs using the shared `generateSEO()` and JSON-LD schema patterns, never a forked parallel shape
- Validated schema markup, checked against Google's Rich Results Test and `validator.schema.org`, recorded in a `library/requirements/reports/seo/` report
- Before/after Core Web Vitals numbers at field-data p75
- A full audit report or a launch/indexation runbook

## Commonly sequenced with
- `security-worker-bee` before merge: for any CSP or security-header change touching SvelteKit hooks or config
- `library-worker-bee` after: for a large phased SEO rollout that warrants a feature PRD
- `react-worker-bee` or Svelte UI skills alongside: coordinating on shared components that affect both design and discoverability
