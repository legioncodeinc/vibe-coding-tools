# Edge Case: One-Page Lead-Gen Site: PrismCalc (Tax Strategy Consultancy)

This example demonstrates the **TypeScript-as-CMS fallback** for a site that opts out of Payload. Phases 7 (Payload Admin), 9 (blog), and 10 (webhooks) are skipped.

Brief: "One-page lead-capture website for a tax strategy consultancy. No blog, no content management, no admin panel needed. The site owner updates copy by editing source code. Primary CTA: 'Book a free consultation'. White-label look."

---

## Inputs round output

| Input | Value |
|---|---|
| Site name | PrismCalc |
| Audience | Small business owners and high-net-worth individuals |
| Primary CTA | Book a free consultation |
| **CMS mode** | **TypeScript-as-CMS fallback: NO Payload, no blog** |
| Brand primary | hsl(195 85% 40%): ocean blue |
| Accent | hsl(40 90% 55%): gold |
| Display font | Default Inter Variable |
| Body font | Default Inter Variable |
| Vercel (web) | Create new project |
| Vercel (cms) | N/A: fallback mode |
| Supabase ref | Create new project |
| Payload URL | N/A |
| GA4 | G-XXXXXXXXXXXX |
| Dark mode | light only |

Phase opt-outs declared:
- Phase 7 (Payload Admin): skip: no CMS admin required
- Phase 9 (Blog): skip: no blog content planned
- Phase 10 (Webhooks): skip: lead notifications via Supabase email trigger

---

## Phase 1: Monorepo (web only)

```bash
mkdir prismcalc && cd prismcalc && git init
# pnpm-workspace.yaml created
pnpm create svelte@latest apps/web  # SvelteKit skeleton, TypeScript
npx supabase init
# apps/cms: SKIPPED — fallback mode
```

Commit: `feat(phase-1): pnpm monorepo + apps/web SvelteKit (TypeScript-as-CMS fallback) — prd-phase-01 §Monorepo Setup`

Build Report Phase 1: **pass**
Build Report Phase 7 (Payload Admin): **skip**: TypeScript-as-CMS fallback selected; no admin panel required.

---

## Phase 2: Performance & Security

Standard SvelteKit setup as in happy path. No domain-specific hostnames in config.

Commit: `feat(phase-2): adapter-vercel + enhanced-img + security headers — prd-phase-02 §Performance`

Build Report Phase 2: **pass**: Lighthouse Performance 97 (single page, minimal JS).

---

## Phase 5: Supabase

Minimal schema: `profiles`, `leads`, `app_settings`. No `webhook_endpoints` (Phase 10 skipped). No `payload` schema.

```sql
-- Migration: only business tables, no Payload namespace
-- profiles, leads, app_settings
-- RLS applied to all
```

Lead notification: Email sent via Supabase Auth email trigger + a simple Edge Function that sends via Resend:

```ts
// supabase/functions/notify-lead-email/index.ts
// Sends email to site owner when a new lead is inserted via Supabase trigger
```

Commit: `feat(phase-5): Supabase schema + RLS (no Payload namespace) — prd-phase-05 §Schema`

Build Report Phase 5: **pass**: anon lead insert 201; no Payload schema present.

---

## Phase 6: Auth

Minimal: Supabase Auth for site owner only (to access a simple leads view at `/admin`).

No Payload Auth (no Payload). No Edge Function needed for user management (single-owner site).

Commit: `feat(phase-6): Supabase Auth (single admin) + /admin route guard — prd-phase-06 §Auth`

Build Report Phase 6: **pass**: unauthenticated `/admin` → redirect to `/login`.

---

## Phase 7: Payload Admin

Build Report Phase 7: **skip**: TypeScript-as-CMS fallback selected. No Payload; no admin SPA. Copy changes require a code deploy.

---

## Phase 3: SEO

Single-page site SEO is simpler. No dynamic sitemap needed (all routes are static).

```ts
// src/routes/sitemap.xml/+server.ts — static only
const pages = [
  { url: '/', priority: 1.0 },
  { url: '/contact', priority: 0.8 },
];
```

Commit: `feat(phase-3): SvelteKit SEO (static sitemap, robots, meta) — prd-phase-03 §SEO`

Build Report Phase 3: **pass**: all 3 static pages have full `<svelte:head>` metadata.

---

## Phase 4: Analytics

Same as happy path. `@vercel/analytics`, GA4, Web Vitals, UTM attribution.

Commit: `feat(phase-4): analytics stack — prd-phase-04 §Analytics`

Build Report Phase 4: **pass**

---

## Phase 8: Lead Capture

Same as happy path. Single-page site = lead form is the primary CTA. Exit-intent popup enabled.

Because Phase 10 is skipped, lead notifications go via the Supabase `notify-lead-email` Edge Function instead:

```ts
// After Supabase insert in actions.submit:
await fetch(`${SUPABASE_URL}/functions/v1/notify-lead-email`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  body: JSON.stringify({ leadId: data.id }),
});
```

Commit: `feat(phase-8): two-step lead form + email notification (no webhook) — prd-phase-08 §Lead Capture`

Build Report Phase 8: **pass**: lead insert + email received at site owner address.

---

## Phase 9: Blog

Build Report Phase 9: **skip**: no blog planned at launch. TypeScript-as-CMS data file stub created at `src/lib/content/blog.ts` for future use if needed.

---

## Phase 10: Webhooks

Build Report Phase 10: **skip**: lead notification handled by Supabase email trigger (Phase 8). No outbound webhook integrations needed.

---

## Phase 12: Visual Design

Minimal animations (no Animated Beam: too complex for a consultancy one-pager):

- CSS tokens with gold/blue brand palette
- `mode-watcher` omitted (light only)
- `shadcn-svelte` Button, Card, Form, Input
- `svelte/transition` `fade` on hero section entrance
- Fluid type scale

Commit: `feat(phase-12): token design system + minimal transitions (light only) — prd-phase-12 §Visual`

Build Report Phase 12: **pass**: Lighthouse Performance 99 (minimal JS, no dark mode overhead).

---

## Phase 11: CRO

- Hero: "Stop Overpaying Taxes" + "Tax strategy for businesses and high-net-worth individuals" + "Book a free consultation" CTA + "Saved clients $X on average" proof
- Mobile sticky CTA visible
- No A/B testing scaffold (out of scope for single owner)

Commit: `feat(phase-11): CRO hero + mobile sticky CTA — prd-phase-11 §CRO`

Build Report Phase 11: **pass**

---

## Build Report summary

| Phase | Status |
|---|---|
| 1 Monorepo | pass |
| 2 Performance | pass |
| 5 Supabase | pass |
| 6 Auth | pass |
| **7 Payload Admin** | **skip: TypeScript-as-CMS fallback; no admin panel** |
| 3 SEO | pass |
| 4 Analytics | pass |
| 8 Lead Capture | pass |
| **9 Blog** | **skip: no blog planned at launch** |
| **10 Webhooks** | **skip: lead notification via Supabase email trigger** |
| 12 Visual Design | pass |
| 11 CRO | pass |

**Overall: Yellow (9 pass, 3 skip, 0 fail)**

## Risks surfaced

- R-1: TypeScript-as-CMS fallback means any copy change requires a code deploy. If PrismCalc later decides they need a blog or non-developer content editing, Phase 7/9 must be revisited with a full Payload migration (see `website-stinger/guides/08-migration-from-typescript-cms.md`).
- Q-1: Supabase email trigger reliability varies by plan. Monitor delivery rates; upgrade to Resend/SendGrid for transactional email if lead volume grows.

## Downstream Bees recommended

- `seo-aeo-worker-bee`: post-build SEO audit for the static pages
- `quality-worker-bee`: verify the 9 completed phases match PRD acceptance criteria
