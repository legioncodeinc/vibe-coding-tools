# 00: Principles, Scope & Architectural Commitments

Read before any file write. This guide encodes the load-bearing decisions for every downstream phase. Deviating without understanding these commitments creates cascading rework.

---

## The stack

This Stinger builds a **SvelteKit (Svelte 5) + Payload CMS + Supabase + Vercel** website.

```
┌─────────────────────────────────────────────────────────┐
│  Visitor → apps/web (SvelteKit on Vercel)               │
│  Editor  → apps/cms Payload admin (Next.js on Vercel)   │
│  Both    → Supabase Postgres                            │
└─────────────────────────────────────────────────────────┘
```

---

## CMS mode toggle

At input time, the Bee selects one of two modes. This choice affects Phases 1, 7, and 9.

| Mode | When | Phase 1 | Phase 7 | Phase 9 |
|---|---|---|---|---|
| **Payload (default)** | Site needs blog/content management with a non-developer editor | Scaffold `apps/web` + `apps/cms` | Payload admin setup | Payload Collections + Blocks |
| **TypeScript-as-CMS (fallback)** | One-page lead-gen, no non-developer editors needed | Scaffold `apps/web` only | Skip | TypeScript data objects, no Payload |

Document the choice in the Build Report Inputs section and the Phase 1 commit message. Never switch modes mid-build without restarting from Phase 1.

---

## Architectural commitments

### 1. SvelteKit public site, Next.js CMS host

`apps/web` is SvelteKit (Svelte 5): the public-facing marketing site, blog, lead capture. `apps/cms` is Next.js + Payload: the content admin. They are separate Vercel projects deployed from the same monorepo via separate `vercel.json` files. SvelteKit cannot host Payload directly.

### 2. REST-only Payload consumption from SvelteKit

SvelteKit always consumes Payload over its REST API (`fetch('/api/posts')` in `+page.server.ts`). The Payload Local API (`payload.find()`) is only available inside the Next.js app. Never use it from SvelteKit.

### 3. Dual Postgres namespace

One Supabase project serves both apps:
- `payload` schema: owned and managed by Payload's `@payloadcms/db-postgres` adapter. RLS is NOT applied here; Payload enforces access control in its own layer.
- `public` schema: business data (leads, app_settings, analytics events). RLS is mandatory on every table.

The Payload database connection string must have `CREATESCHEMA` or `SUPERUSER` rights to create the `payload` namespace. Use a separate Supabase role for Payload if the shared `postgres` role is not acceptable.

### 4. Type-safe schema layer

Two type sources:
- `supabase gen types typescript` → generates `database.ts` consumed by `apps/web` for the `public` schema.
- `payload generate:types` → generates `payload-types.ts` consumed by `apps/web` for Payload collection shapes.

Never edit either generated file manually. Run both after every schema change.

### 5. Settings-driven configuration

All runtime-configurable settings (webhook URLs, notification preferences, feature flags, A/B test variants) are stored in the `app_settings` Supabase table with `category` + `key` namespacing. No deploys required to change configuration.

### 6. Supabase Auth for end-users, Payload Auth for CMS editors

- End-users (lead form submitters, registered customers, blog commenters if applicable): Supabase Auth + `hooks.server.ts` route guard.
- CMS editors and admins who need the Payload admin panel: Payload's built-in JWT-based auth.

Never use Payload Auth to gate SvelteKit routes. Never use Supabase Auth to gate Payload Collections.

### 7. Static-first content in TypeScript-as-CMS fallback

When Payload mode is not used: blog posts are TypeScript data objects. They are prerendered at build time via SvelteKit's `prerender = true` + `entries()` pattern. No runtime CMS API calls. Deploy to publish new content.

### 8. Token-based design system

All visual decisions (color, spacing, radius, shadow, transition duration) are CSS custom properties in `app.css`. Brand changes are single-source updates. Dark mode is a CSS token inversion via `mode-watcher`'s `.dark` class, never a component-level conditional.

### 9. Edge Functions for privileged operations

Any operation requiring service-role Supabase access (user creation, admin user management, outbound notifications) runs in a Supabase Edge Function. The SvelteKit `+page.server.ts` sends a Bearer JWT; the Edge Function verifies the caller's role.

### 10. First-touch attribution persistence

UTM parameters captured on landing are stored in `localStorage` and attached to every lead form submission. Attribution is cleared after the first successful conversion. See `guides/08-lead-capture.md`.

### 11. Multi-vendor analytics composition

Analytics providers (Vercel Analytics, Speed Insights, GA4, Web Vitals) are composed in `+layout.svelte` as sibling component imports. Core Web Vitals reported via `navigator.sendBeacon` to a SvelteKit `+server.ts` route handler.

### 12. CORS required for Payload

The SvelteKit app's origin (`PUBLIC_SITE_URL`) must be in Payload's `cors` array in `payload.config.ts`. Missing CORS is the most common Payload production bug in two-app setups.

---

## Canonical phase order

```
1 → 2 → 5 → 6 → 7 → 3 → 4 → 8 → 9 → 10 → 12 → 11
```

**Rationale for this order:**
- Phase 1 (monorepo) before all else: no app structure means no files to edit.
- Phase 2 (performance/security) before content: security headers must be present before public deployment.
- Phase 5 (Supabase) before Phase 6 (auth): auth tables depend on the schema.
- Phase 6 (auth) before Phase 7 (admin): admin access control depends on auth roles.
- Phase 7 (Payload admin) before Phase 9 (blog): blog Collections must exist in Payload before content routing in SvelteKit.
- Phase 3 (SEO) after monorepo and before analytics: SEO metadata helpers are imported by analytics components.
- Phase 12 (visual design) before Phase 11 (CRO): design tokens must exist before applying CRO patterns that reference them.

---

## Skip protocol

When a phase is explicitly skipped (user opts out or inputs don't support it):

1. Document the reason in the Build Report row as `skip: <one-line rationale>`.
2. Note any downstream phases that depend on the skipped phase and how they are affected.
3. Never silently downgrade a phase (e.g., implementing Phase 9 with TypeScript-as-CMS when Payload mode was selected). That is a disguised skip.

---

## Critical directives

- **Read this file and SKILL.md before any file write.** These commitments are load-bearing.
- **Never deploy secrets, run destructive SQL on shared Supabase projects, or trigger production builds without explicit user confirmation.**
- **Cite the phase number and the specific PRD section in every commit message and Build Report row.**
- **When a phase's acceptance criterion cannot be met, mark it Skip with a rationale, never fudge.**
- **Honor the canonical reading order.** It encodes dependencies.
- **Never overwrite a non-empty target directory without confirmation.** Diff first.
- **Surface every Risk (R-N) and Open Question (Q-N) from the source PRDs** in the Build Report's Next steps.
