# Phase 7: Payload Admin Architecture

> **Site Template Guide**: PRD Phase 7 of 12
> *Replaces the retired prd-phase-07-admin-spa-architecture.md (Vite SPA)*

---

## Phase Overview

### Goals

Configure Payload 3.x's built-in React admin panel as the content management interface. Define Collections (Posts, Pages, Media, Users) and Globals (SiteSettings). Wire the Postgres adapter against Supabase. Set CORS to allow the SvelteKit frontend. Generate `payload-types.ts`.

This phase applies **only in Payload CMS mode**. For TypeScript-as-CMS fallback mode, this phase is skipped entirely.

For full Payload implementation details, invoke `website-worker-bee` (Payload is owned by website-stinger; no separate Payload Bee exists) which reads from `website-stinger/`.

### Scope

**In scope:**
- `apps/cms/payload.config.ts`: adapter, CORS, collections, globals, secret
- Collections: Posts, Pages, Media, Users
- Globals: SiteSettings
- `payload generate:types` → `payload-types.ts`
- CORS and CSRF configuration for SvelteKit origin
- Payload `schemaName: 'payload'` for namespace isolation

**Out of scope:**
- Custom React field components (add on demand)
- Payload plugins (form-builder, etc., optional add-ons)
- Payload Live Preview setup (advanced, see `website-stinger/guides/05-live-preview.md`)
- Payload deployment and environment variables (Phase 7 is local/staging; prod deploy is separate)

### Dependencies

- Phase 1: `apps/cms/` scaffold with Payload installed
- Phase 5: Supabase Postgres available; `PAYLOAD_DATABASE_URI` contains full connection string

---

## User Stories

### Story 1: Content Editor: Access Payload Admin

> As a **Content Editor**, I want to log into the Payload admin panel and create, edit, and publish blog posts so that I can manage content without modifying code.

**Acceptance criteria:**
- Payload admin accessible at `http://localhost:3000/admin` (dev) or `https://cms.domain.com/admin` (prod)
- Editor can create a draft post, preview it, and publish it
- Published post visible via GET `/api/posts?where[status][equals]=published`
- Draft post NOT visible in the above query

### Story 2: Developer: CORS Allows SvelteKit Frontend

> As a **Developer**, I want `apps/web` to fetch Payload's REST API without CORS errors so that the blog listing and post pages load correctly.

**Acceptance criteria:**
- `payload.config.ts` has `cors: [process.env.PUBLIC_SITE_URL, 'http://localhost:5173']`
- `OPTIONS /api/posts` from `http://localhost:5173` returns 200 with correct CORS headers
- No CORS errors in browser console when `apps/web` fetches from Payload

### Story 3: Developer: Type-Safe Payload Consumption

> As a **Developer**, I want `payload-types.ts` generated so that TypeScript enforces the shape of Payload API responses in `apps/web`.

**Acceptance criteria:**
- `pnpm payload generate:types` in `apps/cms` produces `src/payload-types.ts`
- `payload-types.ts` accessible from `apps/web` via tsconfig path alias or shared package
- Payload REST response shapes are typed in `+page.server.ts` load functions

---

## Collection Definitions

### Posts (blog)

Key fields: `title`, `slug` (unique), `excerpt`, `content` (Lexical rich text), `heroImage` (Media relation), `author` (Users relation), `status` (draft/published), `publishedAt`, `meta` (group: description, image).

Access control: read = public; create/update = authenticated user; delete = admin role.

Versions: drafts with autosave enabled.

### Pages (Blocks-based)

Key fields: `title`, `slug` (unique), `layout` (Blocks field with HeroBlock, TextBlock, CTABlock, TestimonialsBlock, FAQBlock), `meta` (group: description, image).

The `layout` Blocks field is the core of Payload's page-builder capability. Each Block type maps 1:1 to a SvelteKit component:

| Block slug | SvelteKit component |
|---|---|
| `hero` | `src/lib/blocks/HeroBlock.svelte` |
| `rich-text` | `src/lib/blocks/TextBlock.svelte` |
| `cta` | `src/lib/blocks/CTABlock.svelte` |
| `testimonials` | `src/lib/blocks/TestimonialsBlock.svelte` |
| `faq` | `src/lib/blocks/FAQBlock.svelte` |

### Media

Uploadable: `image/*`, `video/*`, `application/pdf`. Generates thumbnail, card, and hero image sizes via Sharp. `alt` text field required.

### Users (Payload auth)

Fields: `email` (built-in), `name`, `role` (admin/editor). Payload JWT-based auth is separate from Supabase Auth.

---

## SiteSettings Global

Fields: `siteName`, `tagline`, `logo` (Media relation), `socialLinks` (array: platform + URL).

Readable via: `GET /api/globals/site-settings`

---

## payload.config.ts Baseline

See `website-stinger/guides/07-admin-payload.md` for the full config example.

Critical settings:
- `db: postgresAdapter({ pool: { connectionString }, schemaName: 'payload' })`
- `cors: [process.env.PUBLIC_SITE_URL, 'http://localhost:5173']`
- `csrf: [process.env.PUBLIC_SITE_URL]`
- `secret: process.env.PAYLOAD_SECRET`

---

## Risks and Open Questions

- **R-1:** CORS misconfiguration is the most common Payload production bug. CORS must include the exact origin including protocol (`https://` not just `domain.com`). Test `OPTIONS /api/posts` from the SvelteKit origin before calling Phase 7 done.
- **R-2:** Lexical rich text produces a JSON object, not HTML. SvelteKit cannot render Lexical JSON natively. Solutions: (a) Payload `afterChange` hook stores rendered HTML in a separate field; (b) use `@payloadcms/richtext-lexical/html-converter` in a Payload API route; (c) community package `payload-lexical-svelte`. Choose before Phase 9.
- **Q-1:** Should Payload users and Supabase users be linked (same email, same person)? For most sites, they are separate: Payload users are internal CMS editors (typically 2 to 5 people), Supabase users are end-users. Define the boundary explicitly.
- **Q-2:** How should `payload-types.ts` be shared between `apps/cms` and `apps/web`? Options: (a) pnpm workspace `packages/payload-types/` package; (b) tsconfig path alias pointing to the generated file in `apps/cms`; (c) copy via a build step. Option (a) is the most robust.
