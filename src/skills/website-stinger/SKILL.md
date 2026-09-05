---
name: "website-stinger"
description: "Builds production-grade SvelteKit (Svelte 5) + Payload CMS + Supabase websites end-to-end from a brief, applying a 12-phase playbook. Default CMS mode is Payload 3.x (self-hosted Next.js on Vercel, consumed via REST from SvelteKit). Fallback CMS mode is TypeScript-as-CMS for one-page lead-gen sites that skip Payload. Trigger on phrases like \\\\\\\"build a website\\\\\\\", \\\\\\\"scaffold a SvelteKit site\\\\\\\", \\\\\\\"spin up a marketing site\\\\\\\", \\\\\\\"build me a lead-gen site\\\\\\\", \\\\\\\"ship a website from scratch\\\\\\\", \\\\\\\"create a SvelteKit + Supabase site\\\\\\\", or whenever the paired `website-worker-bee` Bee is invoked. Do not trigger for one-off page tweaks, copy edits, or deploy-only tasks."
---

# Website Stinger

Equips `website-worker-bee` to take a brief and produce a working **SvelteKit (Svelte 5) + Payload CMS + Supabase** monorepo in roughly 45 minutes. The default architecture is:

- `apps/web`: SvelteKit 5 public site (Vercel)
- `apps/cms`: Next.js + Payload 3.x admin + REST API (separate Vercel project)
- Supabase Postgres: dual purpose: Payload's content store (in `payload` schema) + business data (in `public` schema)

The TypeScript-as-CMS fallback (no Payload, no `apps/cms`) is available for one-page lead-gen sites where blog/content management is not required.

This skill is **predominantly autonomous** by design. The Bee batches clarifying questions at the start, then executes phase by phase with smoke checks and commits.

---

## When to use

- "Build me a marketing site for a B2B product."
- "Scaffold a SvelteKit + Supabase site with a blog."
- "Spin up a one-page lead-capture site."
- "Take this brand kit and ship a site by EOD."

Do not invoke for: one-page copy tweaks, Lighthouse audits on existing sites, deploy-only requests, or pure design exploration.

---

## CMS mode selection

The inputs round (Step 2) asks: **"Does this site need a managed CMS admin panel with blog/content management?"**

| Answer | Mode | Phases affected |
|---|---|---|
| Yes (default) | **Payload mode**: scaffold `apps/cms`, use Payload Collections for blog/pages, Phase 7 = Payload Admin | Phases 1 (three-app monorepo), 7 (Payload Admin), 9 (Payload blog) |
| No (fallback) | **TypeScript-as-CMS**: no `apps/cms`, blog posts are TypeScript data objects, no admin SPA | Phase 7 skipped, Phase 9 uses static TypeScript data |

Document the choice in the Build Report (Inputs section) and in the Phase 1 commit message.

---

## Procedure

1. **Read `guides/00-principles.md` first.** It encodes the architectural commitments that downstream phases depend on.
2. **Collect inputs in one batched round.** Use `templates/inputs-checklist.md`. Include the CMS-mode question. Surface architectural consequences of any phase opt-out before scaffolding.
3. **Initialize the Build Report.** Copy `templates/build-report.md` into the target repo as `build-report.md` and fill the Inputs section.
4. **Execute phases in canonical order:** `1 → 2 → 5 → 6 → 7 → 3 → 4 → 8 → 9 → 10 → 12 → 11`. For each phase: read `guides/0N-<topic>.md`, glance at the source PRD in `research/source-prds/`, apply the changes, run the smoke check, update the Build Report row, commit with `feat(phase-N): <name>`.
5. **Skip honestly.** When the brief opts out of a phase, mark it `skip` with a one-line rationale. Never silently downgrade.
6. **Walk Risks and Open Questions** from the source PRDs into the Build Report's Next steps section.
7. **Final pass.** Read the Build Report end to end. Anything that reads as "I forgot why I did that" gets the PRD citation now, not later.

See `guides/13-build-report.md` for the report-authoring discipline.

---

## Critical directives

- **Always read this SKILL.md and `guides/00-principles.md` before any file write.** Architectural commitments are load-bearing.
- **Never deploy secrets, run destructive SQL on shared Supabase projects, or trigger production builds without explicit user confirmation.**
- **Cite the phase number and the specific PRD section in every commit message and Build Report row.**
- **When a phase's acceptance criterion cannot be met, mark it Skip with a rationale, never fudge.**
- **Honor the canonical reading order (`1 → 2 → 5 → 6 → 7 → 3 → 4 → 8 → 9 → 10 → 12 → 11`).**
- **Never overwrite a non-empty target directory without confirmation.**
- **Surface every Risk (R-N) and Open Question (Q-N) from the source PRDs** in the Build Report's Next steps.

Full rationale lives in `guides/00-principles.md`.

---

## Guides

- `guides/00-principles.md`: scope, architectural commitments, CMS-mode toggle, canonical phase order, critical directives
- `guides/01-monorepo.md`: Phase 1: pnpm workspaces + apps/web (SvelteKit) + apps/cms (Payload) + Vercel
- `guides/02-performance-security.md`: Phase 2: svelte.config.js, @sveltejs/enhanced-img, hooks.server.ts headers, fontsource
- `guides/03-seo-aeo.md`: Phase 3: delegates to seo-aeo-worker-bee (SvelteKit track); sitemap coordination with Payload
- `guides/04-analytics.md`: Phase 4: @vercel/analytics, GA4, Web Vitals in +layout.svelte, attribution store
- `guides/05-supabase.md`: Phase 5: schema, RLS, dual Postgres namespace, hooks.server.ts client, generated types
- `guides/06-auth.md`: Phase 6: Supabase Auth (end-users) + Payload Auth (CMS editors), hooks.server.ts route guard
- `guides/07-admin-payload.md`: Phase 7: Payload admin setup, Collections, Globals, CORS, role/access config
- `guides/08-lead-capture.md`: Phase 8: SvelteKit form actions, superforms + Zod, attribution, Supabase insert
- `guides/09-blog.md`: Phase 9: Payload-default (Collections + Blocks) or TypeScript-as-CMS fallback
- `guides/10-webhooks.md`: Phase 10: +server.ts event endpoints + Payload afterChange hooks + HMAC retry
- `guides/11-cro.md`: Phase 11: hero structure, form mechanics, mobile, A/B scaffold (Svelte component patterns)
- `guides/12-visual-design.md`: Phase 12: tokens, Tailwind v4, shadcn-svelte, svelte/transition, mode-watcher, Svelte animation libraries
- `guides/13-build-report.md`: Build Report authoring discipline

## Examples

- `examples/example-happy-path-full-build.md`: full 12/12 build with Payload CMS (ClearDeck B2B legal-tech)
- `examples/example-edge-case-skip-blog.md`: one-page SvelteKit lead-gen site (TypeScript-as-CMS fallback, no Payload)

## Templates

- `templates/build-report.md`: the deliverable shape this skill produces
- `templates/inputs-checklist.md`: pre-scaffold input gathering (includes CMS-mode question)
- `templates/generateSEO.svelte.ts`: SvelteKit +page.ts metadata helper (PUBLIC_* env)
- `templates/design-tokens.css`: Phase 12 CSS custom property token block stub
- `templates/app-settings-seed.sql`: initial app_settings rows
- `templates/rls-policy-skeleton.sql`: Phase 5 RLS baseline + Payload schema isolation comment

## Research

- `research/research-plan.md`: source list, PRD-to-guide mapping, SvelteKit + Payload + animation sources
- `research/README.md`: index and pointer to website-stinger/research/ for Payload-specific deep research
- `research/source-prds/`: the canonical 12-phase guide bundled as source PRDs

---

*Paired Bee: `../../agents/website-worker-bee.md`*
