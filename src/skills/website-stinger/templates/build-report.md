# Build Report: {{site-name}}

**Brief:** {{one-line summary of the brief: primary CTA, audience, stack}}
**Repo:** {{absolute path or git URL}}
**CMS mode:** {{Payload / TypeScript-as-CMS fallback}}
**Started:** {{YYYY-MM-DD HH:MM}}
**Completed:** {{YYYY-MM-DD HH:MM}}
**Built by:** website-worker-bee (Cursor IDE Bee)
**Source playbook:** `.claude/skills/website-stinger/`

---

## Inputs

| Input | Value |
|---|---|
| Site name | {{}} |
| Audience | {{}} |
| Primary CTA | {{}} |
| CMS mode | {{Payload / TypeScript-as-CMS fallback}} |
| Brand primary color | {{H S% L%}} |
| Brand accent color | {{H S% L%}} |
| Display font | {{}} |
| Body font | {{}} |
| Vercel project (web) | {{linked / not provided}} |
| Vercel project (cms) | {{linked / not provided / N/A: fallback mode}} |
| Supabase project ref | {{xxx / not provided}} |
| Payload site URL | {{https://cms.example.com / N/A: fallback mode}} |
| GA4 measurement ID | {{G-XXXX / not provided}} |
| Optional: Microsoft Clarity | {{id / skipped}} |
| Optional: Facebook Pixel | {{id / skipped}} |
| Phase opt-outs declared | {{list / none}} |

---

## Phase results

### Phase 1: Monorepo & Deployment Architecture

| AC | Status | Evidence | PRD section |
|---|---|---|---|
| AC-1.1 `apps/web` pnpm dev → :5173 | pass / fail / skip | {{evidence}} | prd-phase-01 §Monorepo Setup |
| AC-1.2 `apps/cms` pnpm dev → :3000/admin (Payload mode) | | | prd-phase-01 §CMS App |
| AC-1.3 pnpm workspace runs both apps | | | prd-phase-01 §Workspace |
| AC-1.4 `apps/web/vercel.json` framework: sveltekit | | | prd-phase-01 §Vercel |
| AC-1.5 `supabase/` directory initialized | | | prd-phase-01 §Supabase Init |

### Phase 2: SvelteKit Performance & Security

| AC | Status | Evidence | PRD section |
|---|---|---|---|
| AC-2.1 `adapter-vercel` with `nodejs22.x` | | | prd-phase-02 §Adapter |
| AC-2.2 `@sveltejs/enhanced-img` in vite.config.ts | | | prd-phase-02 §Image Optimization |
| AC-2.3 Fonts self-hosted via fontsource (no Google Fonts request) | | | prd-phase-02 §Fonts |
| AC-2.4 Security headers in `hooks.server.ts` (X-Frame-Options, X-Content-Type-Options, CSP) | | | prd-phase-02 §Security Headers |
| AC-2.5 `pnpm build` succeeds, no TS errors | | | prd-phase-02 §Build |

### Phase 5: Supabase Backend Foundation

| AC | Status | Evidence | PRD section |
|---|---|---|---|
| AC-5.1 `hooks.server.ts` creates `event.locals.supabase` | | | prd-phase-05 §Client Setup |
| AC-5.2 `database.ts` generated (not hand-edited) | | | prd-phase-05 §Generated Types |
| AC-5.3 `profiles`, `leads`, `app_settings` tables created via migration | | | prd-phase-05 §Schema |
| AC-5.4 RLS enabled on all public schema tables | | | prd-phase-05 §RLS |
| AC-5.5 Anon lead insert → 201 (curl test) | | | prd-phase-05 §Lead Insert |
| AC-5.6 Payload schema created in Supabase (Payload mode only) | | | prd-phase-05 §Dual Namespace |

### Phase 6: Authentication & User Management

| AC | Status | Evidence | PRD section |
|---|---|---|---|
| AC-6.1 `/login` form action signs in via Supabase Auth | | | prd-phase-06 §Login |
| AC-6.2 `/dashboard` returns 303 redirect without session | | | prd-phase-06 §Route Guard |
| AC-6.3 Non-admin visiting `/admin` redirected to `/` | | | prd-phase-06 §RBAC |
| AC-6.4 `admin-users` Edge Function deployed | | | prd-phase-06 §Edge Function |
| AC-6.5 Password reset uses `PUBLIC_SITE_URL` (not hardcoded domain) | | | prd-phase-06 §Reset |

### Phase 7: Payload Admin Setup

| AC | Status | Evidence | PRD section |
|---|---|---|---|
| AC-7.1 Payload admin accessible at `apps/cms` URL | | | prd-phase-07 §Admin Panel |
| AC-7.2 Posts, Pages, Media, Users collections visible in admin | | | prd-phase-07 §Collections |
| AC-7.3 CORS configured: SvelteKit origin returns 200 on OPTIONS | | | prd-phase-07 §CORS |
| AC-7.4 `payload-types.ts` generated and importable from `apps/web` | | | prd-phase-07 §Types |
| AC-7.5 Draft posts excluded from public REST API | | | prd-phase-07 §Drafts |

*For TypeScript-as-CMS fallback mode: this phase is `skip — Payload not selected, no admin SPA required`.*

### Phase 3: SEO & AEO System

| AC | Status | Evidence | PRD section |
|---|---|---|---|
| AC-3.1 `generateSEO()` used in all public route load functions | | | prd-phase-03 §Metadata |
| AC-3.2 `/sitemap.xml` returns valid XML | | | prd-phase-03 §Sitemap |
| AC-3.3 `/robots.txt` allows AI crawlers | | | prd-phase-03 §Robots |
| AC-3.4 Article schema injected on `/blog/[slug]` | | | prd-phase-03 §Schema |
| AC-3.5 Rich Results Test passes for Article schema | | | prd-phase-03 §Validation |

### Phase 4: Analytics & Tracking Stack

| AC | Status | Evidence | PRD section |
|---|---|---|---|
| AC-4.1 `@vercel/analytics` tracks page views | | | prd-phase-04 §Vercel Analytics |
| AC-4.2 `@vercel/speed-insights` wired | | | prd-phase-04 §Speed Insights |
| AC-4.3 GA4 `page_view` fires on navigation (GA4 DebugView) | | | prd-phase-04 §GA4 |
| AC-4.4 GA4 not in SSR HTML (browser guard) | | | prd-phase-04 §SSR Guard |
| AC-4.5 Web Vitals → `/api/web-vitals` returns 204 | | | prd-phase-04 §Web Vitals |
| AC-4.6 UTM attribution captured and cleared on conversion | | | prd-phase-04 §Attribution |

### Phase 8: Lead Capture & Contact Forms

| AC | Status | Evidence | PRD section |
|---|---|---|---|
| AC-8.1 Two-step form validates before advancing | | | prd-phase-08 §Form Steps |
| AC-8.2 Submission inserts row in `public.leads` | | | prd-phase-08 §Insert |
| AC-8.3 Attribution fields populated from localStorage | | | prd-phase-08 §Attribution |
| AC-8.4 Exit-intent popup fires on mouse-leave (desktop) | | | prd-phase-08 §Popup |
| AC-8.5 GA4 `generate_lead` fires on success | | | prd-phase-08 §Event |

### Phase 9: Blog & Content Management

| AC | Status | Evidence | PRD section |
|---|---|---|---|
| AC-9.1 `/blog` lists published posts | | | prd-phase-09 §Listing |
| AC-9.2 `/blog/[slug]` renders post content | | | prd-phase-09 §Detail |
| AC-9.3 Blog post pages prerendered via `entries()` | | | prd-phase-09 §Prerender |
| AC-9.4 Article schema injected in `<svelte:head>` | | | prd-phase-09 §SEO |
| AC-9.5 Draft posts excluded from public site (Payload mode) | | | prd-phase-09 §Drafts |

### Phase 10: Webhook & Outbound Integration

| AC | Status | Evidence | PRD section |
|---|---|---|---|
| AC-10.1 `webhook_endpoints` + `webhook_deliveries` tables exist | | | prd-phase-10 §Schema |
| AC-10.2 `notify-webhook` Edge Function deployed | | | prd-phase-10 §Edge Function |
| AC-10.3 Signature header `X-Webhook-Signature` present | | | prd-phase-10 §HMAC |
| AC-10.4 Lead captured → delivery record created | | | prd-phase-10 §Trigger |
| AC-10.5 User-Agent configurable via `app_settings` | | | prd-phase-10 §User-Agent |

### Phase 12: Visual Design System

| AC | Status | Evidence | PRD section |
|---|---|---|---|
| AC-12.1 CSS tokens as custom properties in `app.css` | | | prd-phase-12 §Tokens |
| AC-12.2 `.dark` token overrides working (no component conditionals) | | | prd-phase-12 §Dark Mode |
| AC-12.3 `prefers-reduced-motion` zeroes transitions | | | prd-phase-12 §Motion |
| AC-12.4 Fluid type scale via `clamp()` | | | prd-phase-12 §Typography |
| AC-12.5 At least one Svelte animation library component used | | | prd-phase-12 §Animation |
| AC-12.6 Lighthouse Performance ≥ 90 after animations | | | prd-phase-12 §Performance |

### Phase 11: Landing Page CRO

| AC | Status | Evidence | PRD section |
|---|---|---|---|
| AC-11.1 Hero: headline + subheadline + CTA + social proof above fold | | | prd-phase-11 §Hero |
| AC-11.2 Mobile sticky CTA at ≤768px | | | prd-phase-11 §Mobile |
| AC-11.3 A/B flag infrastructure wired | | | prd-phase-11 §A/B Testing |
| AC-11.4 Lighthouse Performance ≥ 90 | | | prd-phase-11 §Performance |

---

## Overall status

| Phase | Status |
|---|---|
| 1 Monorepo | {{pass / fail / skip}} |
| 2 Performance | |
| 5 Supabase | |
| 6 Auth | |
| 7 Payload Admin | |
| 3 SEO | |
| 4 Analytics | |
| 8 Lead Capture | |
| 9 Blog | |
| 10 Webhooks | |
| 12 Visual Design | |
| 11 CRO | |

**Overall:** {{Green (all pass) / Yellow (some skips, no fails) / Red (any fails)}}

---

## Next steps / Risks

*(Walk every source PRD for R-N: and Q-N: tags. Surface applicable ones here.)*

- R-?: {{description}}: prd-phase-XX §Section
- Q-?: {{description}}: prd-phase-XX §Section

---

## Downstream Bees recommended

- `seo-aeo-worker-bee` (SvelteKit track): post-build SEO audit and schema validation
- `security-worker-bee`: CSP header tightening review
- `db-worker-bee`: schema indexing and query audit
- `quality-worker-bee`: implementation-vs-PRD verification pass
