# Source PRDs: website-stinger

This folder contains the canonical 12-phase site template guide as individual PRD files. These are the primary load-bearing source for every claim in `guides/`. Do not edit these files without also updating the corresponding guide.

These files are mirrored from `site-template-guide/` at the repository root. Keep them in sync.

## Tech stack covered

**Public site (`apps/web`):** SvelteKit (Svelte 5), Tailwind v4, shadcn-svelte, @supabase/ssr, @vercel/analytics, sveltekit-superforms, svelte/transition, mode-watcher

**CMS (`apps/cms`):** Payload 3.x (Next.js host), @payloadcms/db-postgres, Lexical rich text

**Backend:** Supabase (PostgreSQL, Auth, Edge Functions, Storage), dual Postgres namespace, RLS

**Infrastructure:** Vercel (two separate projects: apps/web + apps/cms), pnpm workspaces

## PRD index

| Phase | File | Status |
|---|---|---|
| 1 | prd-phase-01-monorepo-architecture.md | Current (SvelteKit + Payload) |
| 2 | prd-phase-02-sveltekit-performance-security.md | Current (SvelteKit) |
| 3 | prd-phase-03-seo-aeo-system.md | Current (SvelteKit + Payload) |
| 4 | prd-phase-04-analytics-tracking-stack.md | Current (SvelteKit) |
| 5 | prd-phase-05-supabase-backend-foundation.md | Current (dual namespace) |
| 6 | prd-phase-06-authentication-user-management.md | Current (Supabase Auth + Payload Auth split) |
| 7 | prd-phase-07-payload-admin.md | Current (Payload 3.x, replaces retired Vite SPA) |
| 8 | prd-phase-08-lead-capture-contact-forms.md | Current (superforms + Zod) |
| 9 | prd-phase-09-blog-content-management.md | Current (Payload-default + TypeScript-as-CMS fallback) |
| 10 | prd-phase-10-webhook-integration-system.md | Current (Payload afterChange hooks) |
| 11 | prd-phase-11-landing-page-conversion-optimization.md | Current (Svelte components) |
| 12 | prd-phase-12-visually-stunning-design.md | Current (Tailwind v4, mode-watcher, Svelte animation libraries) |

## Retired PRDs (deleted)

- `prd-phase-02-nextjs-performance-security.md`: replaced by `prd-phase-02-sveltekit-performance-security.md`
- `prd-phase-07-admin-spa-architecture.md`: replaced by `prd-phase-07-payload-admin.md` (Vite SPA retired; Payload admin panel used instead)
