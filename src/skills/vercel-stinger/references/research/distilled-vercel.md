# Distilled research: Vercel for SvelteKit (Svelte 5) + Neon Postgres

Research window: single sweep, 2026-08-14. Stack context: SvelteKit (Svelte 5), Neon Postgres, Vercel hosting. Every claim below cites its raw source in `raw/`. Where the archive is thin or a source conflicts with itself, that is flagged explicitly rather than smoothed over.

## 1. Adapter and deployment model

| Fact | Detail | Source |
|---|---|---|
| Default adapter | `adapter-auto` ships by default, silently installs `@sveltejs/adapter-vercel` at build time when it detects Vercel | `[raw/vercel--sveltekit--adapter-vercel-config.md]` |
| Recommended adapter | Install `@sveltejs/adapter-vercel` explicitly - pins version, speeds CI, unlocks per-route config that `adapter-auto` cannot pass through | `[raw/vercel--sveltekit--adapter-vercel-config.md]` |
| Config file constraint | `svelte.config.js` cannot be TypeScript | `[raw/vercel--sveltekit--adapter-vercel-config.md]` |
| Per-route override | Export `config` from `+server.js`/`+page(.server).js`/`+layout(.server).js`; layout config cascades unless a child overrides it | `[raw/vercel--sveltekit--adapter-vercel-config.md]` |
| Runtime options | `'edge'`, `'nodejs20.x'`, `'nodejs22.x'`; default follows the Node version set on the Vercel dashboard | `[raw/vercel--sveltekit--adapter-vercel-config.md]` |
| Serverless-only config | `memory` (128-3008 MB, default 1024), `maxDuration`, `isr` | `[raw/vercel--sveltekit--adapter-vercel-config.md]` |
| Edge-only config | `external` (esbuild externals) | `[raw/vercel--sveltekit--adapter-vercel-config.md]` |
| Multi-region serverless | Requires Enterprise plan; Edge functions can multi-region on any plan (`regions: 'all'`) | `[raw/vercel--sveltekit--adapter-vercel-config.md]` |
| Build Output API | `.vercel/output/` is what `adapter-vercel` actually emits; `config.json` version 3 carries `routes`, `images`, `crons`, `services` | `[raw/vercel--project-configuration--vercel-json-and-build-output-api.md]` |

**Conflict/drift flag**: Vercel's own Edge Runtime doc (last updated 2026-08-03) now recommends **migrating from Edge to Node.js** for "improved performance and reliability," and Next.js 16.3 dropped `runtime = 'edge'` support for routes entirely. This directly contradicts older "Edge by default for speed" guidance still common in tutorials and blog posts. This skill defaults new SvelteKit routes to **Node.js runtime** unless a route has a specific low-latency, no-Node-API requirement, and treats "Edge first" advice from training data or older posts as stale. `[raw/vercel--functions--runtimes-node-edge.md]`

## 2. Runtimes: Node.js vs Edge

| Dimension | Node.js | Edge |
|---|---|---|
| API compatibility | Full Node.js APIs | Subset of Node + browser APIs; no filesystem; `require()` disallowed; no `eval`/dynamic code |
| Streaming | Yes, default | Yes, but must start responding within 25s, can stream to 300s total |
| `waitUntil` background work | Yes (`@vercel/functions`) | Yes |
| Failover | `functionFailoverRegions` in `vercel.json` | Automatic redundancy built in |
| Vercel's current recommendation | **Preferred** | Migrate away where possible |

Source: `[raw/vercel--functions--runtimes-node-edge.md]`

## 3. Caching: ISR, header precedence, Data Cache

Three `Cache-Control`-family headers, strict precedence: **`Vercel-CDN-Cache-Control`** (Vercel-only, highest, stripped before client) > **`CDN-Cache-Control`** (cross-CDN, always overrides plain `Cache-Control`) > **`Cache-Control`** (standard, lowest of the three, `s-maxage` stripped before the browser sees it). Default header when nothing is set: `public, max-age=0, must-revalidate` (no caching). `[raw/vercel--caching--isr-data-cache-cache-control.md]`

ISR: durable cache persists 31 days per deployment, request-collapsing on cache-miss stampedes, global purge within 300ms of revalidation, works because frameworks (SvelteKit included) declare cacheable routes at **build time** - this is what plain `Cache-Control` headers alone cannot give Vercel (no advance knowledge of cacheability). `[raw/vercel--caching--isr-data-cache-cache-control.md]`

`x-vercel-cache` values: `HIT`, `MISS`, `BYPASS`, `STALE` (serving stale + background refresh - the SWR path), `PRERENDER` (build-time static), `REVALIDATED` (cache entry was explicitly deleted, so this request pays full foreground generation latency with no stale fallback). `[raw/vercel--caching--isr-data-cache-cache-control.md]`

**Gap flagged**: "Data Cache" as a named product is documented as Next.js App Router-specific (segment-level `fetch` caching). SvelteKit does not get this named feature; it gets the framework-agnostic Runtime Cache for in-function data caching plus ISR for route-level caching. Do not tell a SvelteKit user to configure "Data Cache" as if it's a SvelteKit primitive - it isn't one. `[raw/vercel--caching--isr-data-cache-cache-control.md]`

## 4. Environment variables and secrets

Three standard environments (Production, Preview, Development) plus Custom Environments on Pro/Enterprise. Preview variables can be global-preview or single-branch-scoped; branch-scoped values override the general preview value for that name only. `--sensitive` flag hides a var's value in the dashboard after creation but **only applies to Production and Preview**, not Development. `[raw/vercel--environment-variables--per-environment-management.md]`

Canonical audit sequence before shipping: `vercel env ls production` / `preview` / `development` - the docs flag mismatched vars across environments as "a common cause of deployment failures where a preview works but production doesn't, or vice versa." `[raw/vercel--environment-variables--per-environment-management.md]`

## 5. Cron jobs

| Plan | Jobs/project | Min interval | Precision |
|---|---|---|---|
| Hobby | 100 | Once/day | ±59 min |
| Pro | 100 | Once/minute | Per-minute |
| Enterprise | 100 | Once/minute | Per-minute |

Hobby cron expressions requesting more than daily **fail at deploy time**, not silently. No alternative cron syntax (`MON`, `JAN`, etc.); timezone always UTC; can't set both day-of-month and day-of-week. Duration limits match standard Function `maxDuration` limits - split long jobs into units rather than fighting the ceiling. `[raw/vercel--cron-jobs--config-limits-pricing.md]`

## 6. Image optimization: the SvelteKit gap

**Explicit gap in Vercel's own product**: unlike Next.js (`next/image`) and Nuxt (`@nuxt/image`), SvelteKit has no first-class Image component wired into Vercel's optimization pipeline. Vercel's official quickstart has SvelteKit users hand-write a `srcset`-building helper function against `/_vercel/image?url=...&w=...&q=...`. `[raw/vercel--image-optimization--sveltekit-enhanced-img.md]`

Two real options, not a false binary - pick per image source:
- **Vercel on-demand optimization** (the hand-rolled `optimize()` helper) - for dynamic/CMS/DB-driven image URLs.
- **`@sveltejs/enhanced-img`** (Vite build plugin, host-independent) - for images present on disk at build time; auto width/height, format conversion, EXIF stripping, cached in `node_modules/.cache/imagetools`.

Both can coexist in the same app for different image sources. `[raw/vercel--image-optimization--sveltekit-enhanced-img.md]`

Billing is per **source image transformed**, not per request - this is the mechanism behind the image-optimization cost-runaway pattern described in §9. `[raw/vercel--image-optimization--sveltekit-enhanced-img.md]` `[raw/vercel--pricing--cost-model-function-bandwidth-images.md]`

## 7. Routing Middleware (formerly "Edge Middleware")

Current official name is **Routing Middleware**; runs before the request hits cache or function, on Node.js, Bun, or Edge (Edge is still the default runtime for this feature specifically, even though plain Functions now steer toward Node.js). File: `middleware.ts` at project root, `export default function middleware(request: Request)`, `export const config = { matcher: [...], runtime: 'nodejs' }`. Requires the "Routing Middleware" permission on the account. Do not conflate with SvelteKit's own `hooks.server.ts` `handle` - that's a framework-level request hook inside the SvelteKit server function; Routing Middleware is a separate, earlier, pre-cache Vercel primitive that a SvelteKit app can additionally opt into. `[raw/vercel--routing-middleware--edge-middleware.md]`

## 8. Firewall: WAF and rate limiting

Dashboard custom rules (natural-language or step-by-step) take effect immediately on Publish, no redeploy. Rate-limit counters are **per-region** - a global limit needs awareness that traffic split across regions can collectively exceed a single-region cap. Fixed Window algorithm on all plans; Token Bucket is Enterprise-only. Hobby: 1 rate-limit rule (of 3 total custom firewall rules). Pro: 40 rules. `[raw/vercel--firewall--waf-rate-limiting.md]`

`@vercel/firewall`'s `checkRateLimit()` requires a dashboard-created Rate Limit ID first. Default bucket key is client IP; passing a custom `rateLimitKey` **replaces** IP bucketing, it doesn't add to it - explicit warning in the docs against accidentally making a rule "effectively global" by keying on a constant value. `[raw/vercel--firewall--waf-rate-limiting.md]`

## 9. Cost model and runaway-bill prevention

Official metered resources (Pro overage rates): Function Invocations $0.60/1M, Active CPU from $0.128/hr, Provisioned Memory from $0.0106/GB-hr, Build CPU Minutes from $0.0035/min, Image Transformations $0.05/1K, Image Cache Reads $0.40/1M, Image Cache Writes $4.00/1M, Fast Data Transfer/Edge Requests at regional pricing. `[raw/vercel--pricing--cost-model-function-bandwidth-images.md]`

The single load-bearing guardrail is the dashboard **Spend Limit** (Pro) - Vercel pauses service at the cap instead of overbilling. This is the platform's own primary answer to cost risk, not a third-party trick. `[raw/vercel--pricing--cost-model-function-bandwidth-images.md]`

Independent cross-check (promptstoproduct.com, 2026-04-22, **not an official source, treat directionally**) names three common overage patterns worth watching for in code review: image-optimization runaway from dynamic OG-image routes, long-running SSR/streaming functions billed by GB-hours, and bandwidth from unoptimized media on media-heavy pages. `[raw/vercel--pricing--cost-model-function-bandwidth-images.md]`

## 10. vercel.json / Build Output API

Full property surface: `buildCommand`, `bunVersion`, `cleanUrls`, `crons`, `devCommand`, `fluid`, `framework`, `functions`, `headers`, `ignoreCommand`, `images`, `installCommand`, `outputDirectory`, `redirects`, `bulkRedirectsPath`, `regions`, `functionFailoverRegions`, `rewrites`, `routes`, `trailingSlash`. `vercel.ts` is a programmatic alternative with the same property surface, runs at build time; only one config file is used per project (not both). Prefer `headers`/`redirects`/`rewrites` over the lower-level `routes` unless `routes`'s extra power is actually needed - the docs frame this explicitly as a tradeoff, not a default. `[raw/vercel--project-configuration--vercel-json-and-build-output-api.md]`

## 11. Neon integration

Three connection paths - Vercel-Managed, Neon-Managed, Manual - are mutually exclusive between the two managed options (cannot coexist in one project); each Neon project maps to exactly one Vercel project. `[raw/vercel--neon--integration-guide.md]`

| | Vercel-Managed | Neon-Managed | Manual |
|---|---|---|---|
| Billing | Vercel | Neon | Neon |
| Preview branching | Yes | Yes | No |
| Branch cleanup trigger | Vercel deployment retention (can lag months) | Git branch deletion (predictable) | N/A |

For a team with an existing Neon account (the default assumption for this stack), **Neon-Managed is the recommended default**: predictable cleanup, direct Neon billing/control. Env vars set: `DATABASE_URL` (pooled - use for app runtime), `DATABASE_URL_UNPOOLED` (direct - use for migration tooling), legacy `PG*`/`POSTGRES_URL` vars. Preview deployments get an isolated `preview/<branch>` Neon branch per deployment via webhook. `[raw/vercel--neon--integration-guide.md]`

Legacy note: "Vercel Postgres" as a distinct product no longer exists - it *is* Neon since the Q4 2024-Q1 2025 transition. `@vercel/postgres` still works but is unmaintained; new projects should use `@neondatabase/serverless` directly. `[raw/vercel--neon--integration-guide.md]`

## 12. Deployments: rollback, promotion, domains

**Instant Rollback** reassigns production domains to a prior production-serving deployment without a rebuild. Explicit traps: env vars are NOT rebuilt on rollback (stays on the old build's env state); cron jobs revert to the rolled-back deployment's config too; and critically, **auto-assignment of production domains turns off after a rollback** - new pushes to the production branch silently stop going live until someone runs "Undo Rollback" or `vercel promote`. `[raw/vercel--deployments--rollback-promote-domains.md]`

Preview-to-production promotion switches the deployment to **production env vars** - preview env var values do not carry over, by design. `[raw/vercel--deployments--rollback-promote-domains.md]`

Domains: apex domains need an A record, subdomains need a CNAME, wildcards require the nameservers verification method (A/CNAME path doesn't support wildcards). `vercel domains inspect <domain>` returns the exact records for that specific project - don't hardcode the generic `76.76.21.21`/`cname.vercel-dns-0.com` values shown in examples without checking. External DNS providers (Cloudflare, Route 53) add the same records at the provider directly since `vercel dns add` only works with Vercel-managed nameservers. `[raw/vercel--deployments--rollback-promote-domains.md]`

## 13. Observability, Analytics, Speed Insights

Three distinct products, not one: **Observability** (infra insights - Functions, Middleware, ISR, Image Optimization, etc., free baseline + paid Observability Plus tier), **Speed Insights** (Core Web Vitals, tracks all environments including preview), **Web Analytics** (visitor-level, separate from performance). `[raw/vercel--observability--analytics-speed-insights.md]`

**Gap flagged**: no raw source in this pass covers the exact SvelteKit-specific npm package/import path for Speed Insights or Web Analytics (e.g. whether it's `@vercel/speed-insights/sveltekit`). Guides must instruct verifying the current package export path against live docs before scaffolding rather than guessing, mirroring the same discipline `workos-stinger` applies to its own open npm-scope question. `[raw/vercel--observability--analytics-speed-insights.md]`

## 14. Monorepo / Turborepo

Vercel auto-detects Turborepo and sets Build Command to `turbo run build` (≥1.8) or the filtered variant, Root Directory to the app's path, and Ignored Build Step to `npx turbo-ignore --fallback=HEAD^1`. `[raw/vercel--monorepos--turborepo-deploy.md]`

**Sharp edge**: Turborepo's cache hashes build inputs; env vars that affect build output but aren't declared in `turbo.json`'s `env`/`globalEnv` keys can produce a stale cache hit that ships the wrong environment's config (e.g. staging values in a production build). Declare env vars at the specific task level (`web#build`) rather than globally, for better cache hit rates. SvelteKit's expected `outputs` glob for cache correctness: `.svelte-kit/**`, `.vercel/**`. `[raw/vercel--monorepos--turborepo-deploy.md]`

## Open gaps carried forward (do not fill from training data)

1. Exact SvelteKit npm import paths for `@vercel/speed-insights` and `@vercel/analytics` - verify live before scaffolding.
2. Exact current $/unit rate for Web Analytics Events and Global Config Writes - source table was truncated mid-fetch; verify against `vercel.com/pricing` before quoting a number externally.
3. No raw source fetched specifically for Vercel Blob or Vercel KV/Edge Config as a Neon complement - out of scope for this research pass since the mandate was Neon-specific; flag if a task needs blob/KV storage guidance.
