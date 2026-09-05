# Research Plan: website-stinger

Updated: 2026-05-21 (SvelteKit + Payload conversion pass)

---

## Overview

The website-stinger's source PRDs are reverse-engineered from a production SvelteKit + Payload + Supabase + Vercel codebase. Secondary sources are consulted for freshness on specific topics.

**Note:** Payload CMS deep research lives in a separate dedicated stinger: `.claude/skills/website-stinger/research/`. The research plan here covers SvelteKit-specific and multi-framework concerns only.

---

## Primary sources (source PRDs)

All 12 source PRDs in `source-prds/` are the authoritative load-bearing source for every guide claim. See `research/README.md` for the PRD-to-guide mapping.

---

## Secondary sources

| Source | URL | Guides informed |
|---|---|---|
| SvelteKit docs | https://svelte.dev/docs/kit | 01, 02, 03, 04, 05, 06 |
| SvelteKit SEO guide | https://svelte.dev/docs/kit/seo | 03 |
| SvelteKit page options | https://svelte.dev/docs/kit/page-options | 02, 09 |
| SvelteKit load functions | https://svelte.dev/docs/kit/load | 02, 03, 05, 09 |
| Svelte 5 runes | https://svelte.dev/docs/svelte/what-are-runes | 01-12 |
| @sveltejs/enhanced-img | https://svelte.dev/docs/kit/images | 02 |
| Supabase SvelteKit guide | https://supabase.com/docs/guides/auth/server-side/sveltekit | 05, 06 |
| sveltekit-superforms | https://superforms.rocks | 08 |
| mode-watcher | https://mode-watcher.vercel.app | 12 |
| shadcn-svelte | https://shadcn-svelte.com | 07, 08, 11, 12 |
| **sv-animations (Svelte Magic UI)** | https://sv-animations.vercel.app/magic/docs/components/animated-beam | 12 |
| **Aceternity UI Svelte** | https://aceternity.sveltekit.io/components | 12 |
| **animation-svelte** | https://animation-svelte.vercel.app/ | 12 |
| Payload CMS docs | https://payloadcms.com/docs | 07, 09: deep research in website-stinger/research/ |
| @payloadcms/db-postgres | https://payloadcms.com/docs/database/postgres | 05, 07 |
| Vercel Analytics SvelteKit | https://vercel.com/docs/analytics/package | 04 |
| web-vitals npm package | https://github.com/GoogleChrome/web-vitals | 04 |
| @fontsource | https://fontsource.org | 02, 12 |

---

## Quarterly refresh queries

Run via EXA before the next 90-day review:

1. `sveltekit 5 best practices production 2026`
2. `sveltekit supabase auth ssr 2026`
3. `payload cms sveltekit REST interop 2026`
4. `sv-animations svelte magic ui 2026`
5. `shadcn-svelte tailwind v4 2026`
6. `vercel analytics sveltekit 2026`

---

## Open questions (deferred to future refresh)

- Q-1: Does sveltekit-superforms work correctly with Svelte 5 runes? Check https://superforms.rocks for Svelte 5 compatibility notes.
- Q-2: `@sveltejs/enhanced-img`: does it support Cloudflare R2 or Supabase Storage remote URLs for transformation? (Affects Phase 9 image handling in Payload mode.)
- Q-3: `motion-sv` (used by sv-animations): is it a stable replacement for Framer Motion for Svelte 5? Check GitHub for production readiness.
