---
name: "seo-aeo-stinger"
description: "SEO and AEO for SvelteKit (Svelte 5) + Payload CMS + Vercel. Covers metadata, sitemap/robots, JSON-LD, Payload SEO fields, Core Web Vitals, llms.txt/AI citation, E-E-A-T, and indexation playbooks."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork
metadata:
  hive-bee: seo-aeo-worker-bee
  domain: seo-aeo
  stack: SvelteKit (Svelte 5) + Payload CMS + Vercel
  research-window: 2026-02-14 to 2026-08-14
---

# seo-aeo-stinger

You carry the SEO and Answer Engine Optimization playbook for this repo's default stack: SvelteKit (Svelte 5, runes) as the frontend, Payload CMS as the content source over REST, deployed on Vercel. Every factual claim in this skill traces to `references/research/raw/`; the cited synthesis is `references/research/distilled-seo-aeo.md`. Do not answer from memory when a guide or reference file already has the grounded answer.

This skill treats two goals as one job: ranking fast on Google and getting cited by AI answer engines (Google AI Overviews, ChatGPT, Perplexity, Claude). Neither goal excuses skipping the other -- schema, structure, and freshness that earn AI citation also happen to be the same signals that hold up through Google's E-E-A-T evaluation.

## When to use

- "Audit SEO on this SvelteKit site" / "review this branch for SEO"
- "Add metadata / schema / sitemap / robots.txt to this SvelteKit app"
- "Fix Core Web Vitals" / "why is our LCP bad on Vercel"
- "Get us cited by ChatGPT / Perplexity / AI Overviews" / "set up llms.txt"
- "How do I wire Payload's SEO fields into the SvelteKit frontend"
- Invoked by, or alongside, `seo-aeo-worker-bee`, or as Phase 3 of a `website-stinger` build

## When not to use

- Next.js App Router projects. This skill was rebuilt specifically for SvelteKit; a Next.js codebase needs different metadata APIs, sitemap conventions, and image components. Flag the mismatch rather than degrading silently.
- Marketing copywriting or keyword selection -- that is a content/copy skill's job, not this one.
- Non-Payload CMS integrations -- the Payload-specific guide (`guides/04`) will not transfer cleanly; the framework-level guides (`01`, `02`, `03`, `05`, `06`) still apply.

## Procedure

1. Read this file fully, then `references/research/distilled-seo-aeo.md` for the cited facts underneath every guide.
2. Scope the request: technical foundation, metadata, structured data, Payload wiring, Core Web Vitals, AI citation, content strategy, launch/indexation, or a full audit. Load only the guide(s) that match -- do not read every guide for a one-file task.
3. For any code change, use `references/schema-jsonld-library.md` and `references/metadata-helper-pattern.md` as the starting point rather than inventing a new shape -- they match `website-stinger/templates/generateSEO.svelte.ts` exactly.
4. For a full audit, walk `guides/09-audit-checklist.md` top to bottom and report unchecked items with a reason, never a silent skip.
5. Validate every schema change against Rich Results Test and validator.schema.org before calling it done (`guides/03`).
6. Measure Core Web Vitals with real field data (CrUX, p75), not lab numbers alone, before claiming a performance fix worked (`guides/05`).
7. For anything the research archive doesn't cover (flagged explicitly in the distillation as a gap or conflict), say so rather than guessing, and research it fresh before proceeding.

## Guides (load on demand)

- `guides/01-technical-foundation.md` -- routing, sitemap, robots.txt, canonicals, trailing slash, redirects, 404s
- `guides/02-metadata-and-head.md` -- `<svelte:head>`, load functions, the shared `generateSEO()` pattern
- `guides/03-structured-data.md` -- JSON-LD: Article, Product, FAQ, BreadcrumbList, Organization, LocalBusiness
- `guides/04-payload-content-model-for-seo.md` -- `@payloadcms/plugin-seo`, REST consumption from SvelteKit
- `guides/05-core-web-vitals-on-vercel.md` -- LCP/INP/CLS, SSR vs. prerender vs. ISR, image pipeline
- `guides/06-aeo-and-ai-citation.md` -- llms.txt, extractable structure, per-engine citation behavior
- `guides/07-content-strategy-and-topical-authority.md` -- E-E-A-T, internal linking, topic clusters
- `guides/08-launch-and-indexation-playbook.md` -- day 1 / week 1 / month 1 runbook, IndexNow, GSC API
- `guides/09-audit-checklist.md` -- the full audit, guide-cited, run top to bottom

## References (load on demand)

- `references/schema-jsonld-library.md` -- copy-paste JSON-LD builders in TypeScript, Svelte 5 injection component
- `references/metadata-helper-pattern.md` -- the canonical `generateSEO()` implementation and wiring
- `references/core-web-vitals-budget.md` -- LCP/INP/CLS/TTFB budgets, rendering-strategy decision table
- `references/aeo-content-structure-checklist.md` -- the AI-citation structure checklist, cited line by line
- `references/research/distilled-seo-aeo.md` -- dense, cited synthesis of the full research archive; read this before trusting any specific number in a guide
- `references/research/raw/` -- primary sources; trace any distilled claim back here

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [website-stinger](../website-stinger) - Builds the SvelteKit + Payload + Vercel monorepo this skill's SEO/AEO work lives inside; Phase 3 of its build delegates here.
  - [lighthouse-pagespeed-stinger](../lighthouse-pagespeed-stinger) - Runs Lighthouse/PageSpeed audits and CI budgets; use it to actually capture the Core Web Vitals numbers this skill's guides require.
  - [image-optimization-stinger](../image-optimization-stinger) - Deeper AVIF/WebP, responsive srcset, and blur-placeholder guidance beyond this skill's Core Web Vitals image summary.
  - [ux-ui-svelte-stinger](../ux-ui-svelte-stinger) - Svelte 5 + SvelteKit component and styling conventions for this stack; consult when an SEO fix touches shared UI.
  - [markdown-mdx-content-pipeline-stinger](../markdown-mdx-content-pipeline-stinger) - Content-processing pipeline for blog/article rendering; relevant when structuring content for the AEO extractability patterns in guides/06.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
