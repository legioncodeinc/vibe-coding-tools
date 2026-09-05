# Happy Path: Full 12/12 Build: ClearDeck (B2B Legal-Tech)

This example walks all 12 phases for a B2B legal-tech marketing site called **ClearDeck**. CMS mode: Payload (default).

Brief: "B2B SaaS marketing site for a contract management product. Audience: legal ops and procurement teams at mid-market companies. Primary CTA: 'Start free trial'. Blog for thought leadership. Lead capture popup. Dark mode. Blog managed by non-developer content team."

---

## Inputs round output

| Input | Value |
|---|---|
| Site name | ClearDeck |
| Audience | Legal ops and procurement at mid-market companies |
| Primary CTA | Start free trial |
| CMS mode | **Payload (default)** |
| Brand primary | hsl(220 85% 55%): deep blue |
| Accent | hsl(160 70% 45%): teal |
| Display font | Cal Sans (local) |
| Body font | Inter Variable (fontsource) |
| Vercel (web) | Create new project `cleardeck-web` |
| Vercel (cms) | Create new project `cleardeck-cms` |
| Supabase ref | Create new project |
| Payload URL | https://cms.cleardeck.com |
| GA4 | G-XXXXXXXXXXXX |
| Dark mode | system preference |

---

## Phase 1: Monorepo

```bash
mkdir cleardeck && cd cleardeck && git init
# pnpm-workspace.yaml created
pnpm create svelte@latest apps/web  # SvelteKit skeleton, TypeScript, ESLint, Prettier
pnpm create payload-app@latest apps/cms  # blank, PostgreSQL, TypeScript
npx supabase init
```

Commit: `feat(phase-1): pnpm monorepo + apps/web SvelteKit + apps/cms Payload — prd-phase-01 §Monorepo Setup`

Build Report Phase 1: **pass**: both `pnpm dev` commands return 200 within 60s.

---

## Phase 2: Performance & Security

```bash
cd apps/web
pnpm add @sveltejs/adapter-vercel @sveltejs/enhanced-img @fontsource-variable/inter
pnpm add -D tailwindcss @tailwindcss/vite
```

Key edits:
- `svelte.config.js` → `adapter-vercel({ runtime: 'nodejs22.x' })`
- `vite.config.ts` → `enhancedImages()`, `tailwindcss()`
- `src/hooks.server.ts` → all 5 security headers
- `src/app.css` → `@import '@fontsource-variable/inter'`

Commit: `feat(phase-2): adapter-vercel + enhanced-img + fontsource + security headers — prd-phase-02 §Performance`

Build Report Phase 2: **pass**: Lighthouse Performance 95 on dev build, all headers in dev tools Network tab.

---

## Phase 5: Supabase Backend

```bash
supabase migration new initial_schema
# Wrote: profiles, leads, app_settings, webhook_endpoints, webhook_deliveries
supabase db push
npx supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > apps/web/src/lib/types/database.ts
```

Payload started for first time → created `payload` schema in Supabase automatically.

Commit: `feat(phase-5): Supabase schema + RLS + dual-namespace Payload — prd-phase-05 §Schema Design`

Build Report Phase 5: **pass**: anon lead insert returns 201; payload schema visible in Supabase but inaccessible via anon key.

---

## Phase 6: Auth

- SvelteKit `hooks.server.ts` extended with route guard for `/admin`
- `/login`, `/signup`, `/reset-password` form actions created
- `admin-users` Edge Function deployed
- Password reset redirect uses `PUBLIC_SITE_URL`

Commit: `feat(phase-6): Supabase Auth + RBAC hooks + admin-users edge function — prd-phase-06 §Auth`

Build Report Phase 6: **pass**: unauthenticated `/admin` → 303 redirect to `/login`.

---

## Phase 7: Payload Admin

```bash
cd apps/cms
# Defined: Posts, Pages, Media, Users collections
# Defined: SiteSettings global
pnpm payload generate:types
cp src/payload-types.ts ../packages/payload-types/index.ts
```

CORS added: `https://cleardeck.com` and `http://localhost:5173`.

`apps/web/src/lib/types/payload.ts` imports from `@payload-types`.

Commit: `feat(phase-7): Payload admin collections + CORS + payload-types.ts — prd-phase-07 §Payload Admin`

Build Report Phase 7: **pass**: `/api/posts` returns 200 from SvelteKit `+page.server.ts` fetch.

---

## Phase 3: SEO & AEO

Invoked `seo-aeo-worker-bee` with: "Run Phase 3 on `apps/web`. Framework: SvelteKit. Create: generateSEO.ts, schema.ts, sitemap +server.ts, robots +server.ts, <svelte:head> patterns for blog routes."

- `src/lib/seo/generateSEO.ts`: from template `generateSEO.svelte.ts`
- `src/lib/seo/schema.ts`: from seo-aeo-stinger template
- `src/routes/sitemap.xml/+server.ts`: fetches published post slugs from Payload
- `src/routes/robots.txt/+server.ts`: AI-inclusive policy

Commit: `feat(phase-3): SvelteKit SEO foundation (sitemap, robots, generateSEO, schema) — prd-phase-03 §SEO System`

Build Report Phase 3: **pass**: sitemap returns valid XML; Article schema passes Rich Results Test.

---

## Phase 4: Analytics

```bash
cd apps/web && pnpm add @vercel/analytics @vercel/speed-insights web-vitals
```

- `+layout.svelte`: `<Analytics />`, `<SpeedInsights />`, `<WebVitals />`, `<GoogleAnalytics />`
- `afterNavigate` page view tracking for GA4
- `src/lib/analytics/attribution.ts`: UTM first-touch capture
- `/api/web-vitals/+server.ts`: 204 endpoint

Commit: `feat(phase-4): analytics stack (Vercel, GA4, Web Vitals, UTM attribution) — prd-phase-04 §Analytics`

Build Report Phase 4: **pass**: GA4 DebugView shows page_view on navigation; Web Vitals 204.

---

## Phase 8: Lead Capture

```bash
pnpm add sveltekit-superforms zod bits-ui
```

- `src/lib/schemas/lead.ts`: step1Schema + step2Schema merged
- `src/routes/contact/+page.server.ts`: form action with Supabase insert + attribution merge
- `src/lib/components/LeadForm.svelte`: two-step with progress indicator
- `src/lib/components/LeadPopup.svelte`: exit-intent, sessionStorage dismissed flag
- `generate_lead` GA4 event on success

Commit: `feat(phase-8): two-step lead capture + exit-intent popup + UTM attribution — prd-phase-08 §Lead Forms`

Build Report Phase 8: **pass**: lead insert with `utm_source=test` → row in Supabase leads table with utm_source populated.

---

## Phase 9: Blog (Payload mode)

- `src/routes/blog/+page.server.ts`: fetches published posts from Payload REST
- `src/routes/blog/[slug]/+page.server.ts`: single post with SEO
- `src/routes/blog/[slug]/+page.ts`: `entries()` for prerendering all published slugs
- Lexical content rendered via HTML field (Payload `afterChange` hook stores `contentHtml`)

Commit: `feat(phase-9): blog routes from Payload REST + entries() prerender — prd-phase-09 §Blog`

Build Report Phase 9: **pass**: 3 test posts prerendered; Article schema valid; draft post not in sitemap.

---

## Phase 10: Webhooks

- `webhook_endpoints` + `webhook_deliveries` migrations applied
- `supabase/functions/notify-webhook/index.ts` deployed
- Lead form action triggers `lead.created` event
- Payload Posts `afterChange` hook triggers `post.published` event
- `/admin/webhooks/+page.server.ts`: delivery history page

Commit: `feat(phase-10): webhook system (HMAC, retry, Payload afterChange) — prd-phase-10 §Webhooks`

Build Report Phase 10: **pass**: delivery record created on lead submit; signature validated at webhook.site.

---

## Phase 12: Visual Design

- CSS tokens in `app.css`: all custom properties including `.dark` inversion
- `mode-watcher` dark mode toggle
- `shadcn-svelte` initialized; Button, Card, Dialog, Form, Input installed
- `svelte/transition` `fly` entrance on hero and card grid
- Animated Beam from sv-animations (integrated/overview section showing integrations)
- Fluid type scale with `clamp()`

Commit: `feat(phase-12): token design system + dark mode + sv-animations Animated Beam — prd-phase-12 §Visual Design`

Build Report Phase 12: **pass**: Lighthouse Performance 92 after animation; `.dark` class inverts all tokens without component changes.

---

## Phase 11: CRO

- Hero: outcome-focused H1 + subheadline + "Start free trial" CTA + "2,400+ legal teams" proof
- Mobile sticky CTA (≤768px, appears after 40% scroll)
- Social proof section: 3 B2B testimonials (placeholders filled by client before launch)
- A/B flag for hero CTA text (`hero_cta_copy` in `app_settings.ab_tests`)

Commit: `feat(phase-11): CRO hero structure + mobile sticky CTA + A/B scaffold — prd-phase-11 §CRO`

Build Report Phase 11: **pass**: Lighthouse Performance 92; sticky CTA visible at 375px; A/B flag reads from `app_settings`.

---

## Build Report summary

| Phase | Status |
|---|---|
| 1 Monorepo | pass |
| 2 Performance | pass |
| 5 Supabase | pass |
| 6 Auth | pass |
| 7 Payload Admin | pass |
| 3 SEO | pass |
| 4 Analytics | pass |
| 8 Lead Capture | pass |
| 9 Blog | pass |
| 10 Webhooks | pass |
| 12 Visual Design | pass |
| 11 CRO | pass |

**Overall: Green (12/12)**

## Risks surfaced

- R-1: Lexical JSON → HTML relies on Payload `afterChange` hook. If the hook fails silently, `contentHtml` will be empty. Add a Payload admin field validation that shows a warning when `contentHtml` is blank.
- Q-1: `@payloadcms/db-postgres` with Supabase pgbouncer transaction-mode pooler. Test with `?pgbouncer=true` in `PAYLOAD_DATABASE_URI` before production traffic.

## Downstream Bees recommended

- `seo-aeo-worker-bee`: production SEO audit + schema validation
- `security-worker-bee`: CSP tightening review
- `quality-worker-bee`: implementation-vs-PRD verification pass
