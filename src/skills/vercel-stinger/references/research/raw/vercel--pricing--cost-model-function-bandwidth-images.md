# Vercel cost model: plans, metered resources, overage rates, runaway-bill patterns

- URL: https://vercel.com/docs/pricing ; https://vercel.com/pricing ; https://vercel.com/docs/limits ; https://www.promptstoproduct.com/vercel-pricing-explained
- Fetched: 2026-08-14
- Source type: Official Vercel docs (pricing, limits) + independent analysis piece (promptstoproduct.com, dated 2026-04-22, cross-check only, not authoritative)
- Component: Pricing / cost governance

## Content

### Plan shape

Hobby (free), Pro ($20/user/month + usage), Enterprise (custom). Pro bundles $20 of included usage credit, advanced spend management, faster builds/no queue, cold-start prevention.

### Metered resources and Pro overage rates (official, from `/docs/limits`)

| Resource | Price | Included (Pro) |
|---|---|---|
| Fast Data Transfer | regional pricing | first 1 TB |
| Function Invocations | $0.60 per 1,000,000 | N/A (all metered) |
| Fast Origin Transfer | regional pricing | N/A |
| Active CPU | from $0.128/hour | N/A |
| Edge Requests | regional pricing | first 10,000,000 |
| Provisioned Memory | from $0.0106/GB-hr | N/A |
| Build CPU Minutes | from $0.0035/CPU-minute | N/A |
| Edge Request CPU Duration | regional pricing | 1 hour |
| Global Config Reads | $3.00 per 1,000,000 | N/A |
| Global Config Writes | $10 per ... (partial in source) | N/A |
| Web Analytics Events | $0.03 (unit truncated in source; verify in dashboard before quoting a rate) | N/A |
| Image Optimization Transformations | $0.05 per 1,000 | N/A |
| Image Optimization Cache Reads | $0.40 per 1,000,000 | N/A |
| Image Optimization Cache Writes | $4.00 per 1,000,000 | N/A |

Image Optimization full tier table (from `/docs/pricing`):

| Image Usage | Hobby included | On-demand rate |
|---|---|---|
| Transformations | 5K/month | $0.05-$0.0812 per 1K |
| Cache reads | 300K/month | $0.40-$0.64 per 1M |
| Cache writes | 100K/month | $4.00-$6.40 per 1M |

### Function duration limits (non-Fluid-compute legacy default/max - verify current project's Fluid status before applying)

| Plan | Default | Maximum |
|---|---|---|
| Hobby | 10s | 60s |
| Pro | 15s | 300s (5 min) |
| Enterprise | 15s | 900s (15 min) |

### Spend Limit (the actual guardrail)

Vercel Pro dashboard setting: cap monthly spend with a hard limit - Vercel pauses services rather than overbill past the configured cap. This is the platform's own answer to "runaway bill" risk and is presented as the single most load-bearing config change for cost control.

### Independent cross-check: where solo/small teams actually get stung (promptstoproduct.com, 2026-04-22 - treat as directional, not authoritative pricing)

1. **Image Optimization runaway**: billed per *source image transformed*, not per request. A marketing-heavy app (blog posts, dynamic OG images) can burn through the included quota fast - a single dynamic OG-image route can generate thousands of new source transforms per week. Mitigation offered: pre-generate OG images at build time or use a separate CDN, and skip `next/image`-equivalent optimization for static hero art that doesn't need per-request variants.
2. **Function execution time on heavy SSR**: billed by GB-hours of active compute; a route that streams a long LLM response while holding a DB connection open costs disproportionately more per request than a typical API route. AI-feature-heavy apps see compute costs outpace bandwidth costs.
3. **Bandwidth from media-heavy sites**: 1TB Pro allowance sounds large until autoplay video or unoptimized media is served on every page load; overage is $0.40/GB regional.

### Rough competitor comparison cited by the independent piece (verify current figures before quoting externally)

Vercel Pro ($20/seat, 1TB bandwidth incl., $0.40/GB overage, 1M invocations) vs Cloudflare Pages ($5 Workers Paid, unlimited bandwidth, 10M invocations) vs Netlify Pro ($19, 1TB bandwidth, $0.55/GB overage, 2M invocations).
