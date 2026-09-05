# website-worker-bee

## Domain
Builds production-grade SvelteKit (Svelte 5) + Payload CMS + Supabase websites end-to-end from a brief, applying a 12-phase site-template playbook: monorepo architecture, performance/security, SEO/AEO, analytics, Supabase backend with RLS, auth/RBAC, Payload admin, lead capture, blog, webhooks, conversion-rate optimization, and visual design tokens. Default CMS mode is Payload 3.x; a TypeScript-as-CMS fallback exists for simple one-page lead-gen sites. It is autonomous within a build but never picks brand identity, writes marketing copy, or deploys to production without explicit confirmation.

## Paired Stinger
[website-stinger](../../website-stinger) - the 12-phase guides in canonical execution order, the CMS-mode toggle, worked examples for full builds and the fallback path, and the Build Report authoring discipline.

## Trigger phrases
- "build a website for this brief"
- "scaffold a SvelteKit site"
- "spin up a marketing/lead-gen site"
- "ship a website from scratch"
- "create a SvelteKit + Supabase site"
- "here's the brief and brand inputs, build the repo"

## Do NOT route when
- The ask is a one-off page tweak or copy edit on an existing site: this Bee is not invoked for incremental changes, not a handoff to a peer.
- The ask is a Lighthouse audit on an existing site rather than a new build: not this Bee's invocation case.
- The ask is a deploy-only request with no scaffolding work: not this Bee's invocation case.
- The ask is SEO/AEO implementation depth: this Bee delegates Phase 3 to seo-aeo-worker-bee rather than doing it itself.
- The ask is detailed Supabase schema/indexing design or advanced Payload Collections/Blocks configuration: handed off mid-build to db-worker-bee and website-worker-bee respectively.

## Inputs the Bee needs
- A brief plus brand inputs, batched clarifying answers including the CMS-mode question (managed Payload admin vs. TypeScript-as-CMS fallback).
- Target stack confirmation (SvelteKit + Payload + Supabase + Vercel) or documented deviation.
- Explicit user confirmation before any production deploy, destructive SQL, or secret handling.

## Outputs
- A working monorepo (`apps/web`, optionally `apps/cms`) with Vercel deployment wired.
- A filled Build Report tracking each of the 12 phases pass/fail/skip with committed history (`feat(phase-N): <name>`).
- Surfaced Risks and Open Questions from the source PRDs in the Build Report's Next steps.

## Commonly sequenced with
- seo-aeo-worker-bee: for Phase 3, delegated on the SvelteKit track.
- db-worker-bee: for Phase 5 detailed Supabase schema, indexing, and migration patterns.
- website-worker-bee: for Phase 7/9 advanced Payload configuration and Lexical rendering.
- security-worker-bee: for Phase 2/10 CSP tightening and HMAC implementation review.
