---
name: newsletter-platform-stinger
description: Newsletter-as-channel specialist for product builders — Beehiiv, ConvertKit (Kit), Loops, Substack, Resend Audiences, Ghost, the embedded-newsletter-page pattern, deliverability vs platform tradeoffs, and monetization options (ad network, paid subscriptions, sponsorships, referrals). Use when the user says "which newsletter platform should I use", "set up Beehiiv", "embed a newsletter signup", "migrate from Substack to Beehiiv", "how do I monetize my newsletter", "Loops vs Kit for my SaaS", "self-hosted newsletter deliverability", or when `newsletter-platform-worker-bee` is invoked. Do NOT use for transactional email sending infrastructure (route to `resend` tooling), SPF/DKIM/DMARC DNS setup at the infrastructure level (route to `devops-worker-bee`), Stripe subscription billing for custom paid tiers (route to `payments-worker-bee`), or SEO content strategy (route to `seo-aeo-worker-bee`).
---

# newsletter-platform-stinger

The newsletter channel playbook for product builders and founders who want to build an audience alongside a SaaS or content product. This skill encodes the platform selection decision tree, the embedded-signup integration cookbook, deliverability fundamentals per platform, the monetization option map, and the migration checklist.

Read `guides/00-platform-selection.md` first on every invocation — it anchors every subsequent recommendation to the user's specific subscriber count, revenue goal, and technical context.

---

## Quick-reference: use case to platform

| Use case | Best platform |
|---|---|
| Newsletter-first, monetization via ads + paid subs | Beehiiv (Scale $49/mo) |
| SaaS product — unified transactional + marketing email | Loops ($49/mo, free to 1K) |
| Creator with digital products (courses, ebooks) | Kit (Creator $39/mo) |
| Content creator wanting full platform ownership | Substack (free, 10% paid fee) |
| Self-hosted + content site combo | Ghost Pro or Ghost self-hosted |
| Already using Resend, small list, no platform needed | Resend Audiences |

See `guides/00-platform-selection.md` for the full decision matrix with subscriber count thresholds and pricing.

---

## Critical directives (from Command Brief)

- **Always name the concrete reason for a platform recommendation.** "Beehiiv is better" with no context is noise. Name the specific feature (ad network, API depth, referral program) tied to the user's goal.
- **Distinguish newsletter platform from transactional email.** Marketing lists and transactional sends share no infrastructure; conflating them creates compliance and deliverability problems.
- **Scope to the user's subscriber-count stage.** Optimal platforms differ significantly at 500 vs 50,000 subscribers; recommendations that ignore current scale mislead.
- **Do not recommend self-hosted deliverability paths without naming the operational cost.** Listmonk and Postal require active domain reputation management — a real ongoing burden.
- **Defer Stripe billing integration to `payments-worker-bee`.** Platform-native paid tiers are in scope; custom Stripe-on-top billing is not.

---

## Platform summary (2026)

### Beehiiv
Best-in-class for newsletter operators who want to monetize from the audience directly. Native Ad Network, Boosts, paid subscriptions at 0% fee, referral program. The only platform with a marketplace of 30,000+ publishers for cross-promotion. Requires Scale plan ($49/mo) for monetization features; free plan limited to 2,500 subscribers.

- Median time to first dollar: 66 days (2026 platform data; see `research/external/2026-05-20-beehiiv-ad-network-monetization-2026.md`)
- $19M in paid subscription revenue paid to creators in 2025 (138% YoY)
- Ad Network eligibility: 1,000+ active subscribers, 20%+ open rate

### Kit (ConvertKit)
Best for creators who sell digital products (courses, ebooks) and need deep automation sequences. 100+ native integrations (Shopify, WooCommerce, Thinkific). Underwent ~35% price increase in September/October 2025. Creator plan: $39/mo (1K subs). Takes 0.6% transaction fee on paid subscriptions.

- Pick Kit when: you need Shopify, WooCommerce, or Thinkific native integration; your revenue comes from courses not newsletters.
- Avoid Kit when: your primary revenue is ad/sponsorship; your list is >5K (Beehiiv is cheaper).

### Loops
Best for SaaS companies that want one platform for transactional + marketing email. API-first, TypeScript SDK, event-triggered automations. No landing pages, no referral program, no ad network — purely a product-email platform.

- At 5K contacts: Loops $49/mo vs Kit $89/mo vs (Resend $20 + ConvertKit $79) = $99/mo (see `research/external/2026-05-20-loops-saas-email-platform-2026.md`)
- Use Loops when the question is "how do I email users based on their behavior in my product."
- Do NOT use Loops as a newsletter-growth platform.

### Substack
Zero-cost entry (10% fee on paid subscriptions). Best brand recognition for content creators. Weakest API access; no ad network; limited customization. Most users migrate off Substack as they grow.

### Ghost
Self-hosted ($0) or Ghost Pro (Starter ~$9-18/mo, verify at ghost.org/pricing). Best when you want newsletter + content site in one self-hosted package. Technical overhead is real; email deliverability on self-hosted requires active management.

### Resend Audiences
Built on top of Resend's transactional email infrastructure. Best if already using Resend for transactional sends and want a simple managed-list layer. No monetization features, no growth tools, no landing pages. Appropriate for early-stage products with <1K subscribers who want zero platform overhead.

---

## Embedded signup — the three canonical patterns

See `guides/01-embedded-signup.md` for full code. High-level patterns:

1. **API route handler** (Next.js App Router, Edge runtime) — POST to platform API from a server-side route. Recommended; avoids CORS, keeps API key server-side. Works for Loops, Beehiiv, Resend Audiences.
2. **Iframe embed** — Beehiiv's native embeddable subscribe form. Drop one line of HTML; no backend needed. Fastest for Beehiiv; limited styling control.
3. **Platform-hosted landing page** — Link to a Beehiiv or Kit hosted page. Zero code; no customization.

The API route handler pattern is the correct default for any product that wants source attribution tracking (knowing which page/button drove the signup).

---

## Monetization paths (newsletter operators on Beehiiv)

Four revenue streams, in order of effort:

1. **Ad Network** — passive; approve offers from Beehiiv's real-time marketplace. CPM $15-$50 depending on niche. Requires 1K subs, 20%+ open rate. (Data: `research/external/2026-05-20-beehiiv-ad-network-monetization-2026.md`)
2. **Boosts** — earn $1-$3 per subscriber you send to other newsletters. Zero writing required.
3. **Paid subscriptions** — platform-native; 0% transaction fee on Beehiiv Scale. Gate archive posts or Discord access.
4. **Direct sponsorships** — self-sold, highest CPM (3-5x Ad Network rates). Requires a media kit. Benchmarks: 5K subs = $500-$1,500/placement; 10K subs = $1,000-$3,000/placement.

See `guides/03-monetization.md` for the revenue stack walkthrough and templates.

---

## Migration: Substack to Beehiiv (condensed checklist)

Full guide in `guides/04-migration.md`. Critical ordering:

1. Set up Beehiiv, verify sending domain **before** importing list.
2. Export Substack CSV (keep the zip intact; Safari auto-unzips).
3. Import free subscribers. Tag with `substack-migration-YYYY`.
4. For paid subscribers: create matching tiers in Beehiiv, copy Stripe customers, **pause Substack billing** before cutover to avoid double billing.
5. Send one final Substack broadcast announcing the migration and new sender domain.
6. Cut over domain and sending on the **same day** — do not run dual-send week (creates confusion).
7. Warm up: send at reduced frequency for first 2 weeks.

---

## Deliverability fundamentals

See `guides/02-deliverability.md` for full detail. The short version:

- **Managed SaaS (Beehiiv, Loops, Kit, Substack)**: domain authentication is partially handled by the platform. You must verify your custom sending domain (DKIM, SPF, DMARC) — this is a one-time DNS setup per platform. The platform's shared IP pool manages the rest.
- **Self-hosted (Ghost, Listmonk, Postal)**: you own the full deliverability stack — your sending domain, IP reputation, bounce handling, and compliance. This is a full-time concern; budget 2-4 hours/week minimum for maintenance.
- **Resend Audiences**: inherits Resend's transactional delivery infrastructure. Best deliverability out of the box for small lists.

Route infrastructure-level DNS work (SPF/DKIM/DMARC records) to `devops-worker-bee` or the `resend` stinger.

---

## Guides in this folder

- `guides/00-platform-selection.md` — full decision matrix, pricing table, subscriber-count thresholds, 2026 data
- `guides/01-embedded-signup.md` — Next.js App Router signup integration for Loops, Beehiiv, and Resend Audiences
- `guides/02-deliverability.md` — managed SaaS vs self-hosted, domain auth per platform, spam rate management
- `guides/03-monetization.md` — four revenue streams, CPM benchmarks, direct sponsorship deck starter
- `guides/04-migration.md` — Substack → Beehiiv migration checklist, Stripe subscriber transfer, domain warmup

---

*Forged by stinger-forge from `ai-tools/command-briefs/newsletter-platform-worker-bee-command-brief.md` and `research/`. Part of the Legion AI Tools Factory.*
