# Guide 00: Platform Selection Decision Matrix

*Derived from: `research/external/2026-05-20-beehiiv-vs-kit-comparison-2026.md`, `research/external/2026-05-20-loops-saas-email-platform-2026.md`, `research/external/2026-05-20-newsletter-platform-full-comparison-2026.md`, `research/external/2026-05-20-beehiiv-vs-substack-vs-ghost.md`*

The single most important guide in this stinger. Read this first. Every recommendation flows from the answers to three questions:

1. **What is your primary audience-building goal?** (media-style newsletter vs product-led email vs creator brand)
2. **What is your primary monetization vector?** (ads/sponsorships, paid subscriptions, digital products, or none — it's a top-of-funnel acquisition channel)
3. **What is your current subscriber count and target scale?**

---

## Step 1: Classify the use case

### Use case A: Newsletter-first, monetize the audience directly
You are building a standalone newsletter or audience as a business. Revenue will come from advertising, paid subscriptions, sponsorships, or referrals — not from a separate product sale.

**→ Recommend Beehiiv (Scale plan, $49/mo)**

Why: Only platform with a native ad network, boost earnings ($1-$3/referred subscriber), and a 30,000+ recommendation network. Paid subscriptions at 0% transaction fee. Median 66 days to first dollar. See `research/external/2026-05-20-beehiiv-ad-network-monetization-2026.md`.

Beehiiv is cheaper than Kit at every scale point above 1,000 subscribers:
- 5K subscribers: Beehiiv $49/mo vs Kit $89/mo
- 100K subscribers: Beehiiv $329/mo vs Kit $679/mo

### Use case B: SaaS product — unify transactional + marketing email
You are building a SaaS product and want one platform for welcome emails, drip campaigns, trial conversion sequences, and product update newsletters. You do not need a newsletter "growth" platform.

**→ Recommend Loops ($49/mo, free to 1K contacts)**

Why: Loops unifies transactional (welcome, password reset, receipts) and marketing (newsletter, drip, re-engagement) in one API-first platform with event-based automation. Replacing a Resend + ConvertKit combo saves $50/mo at 5K contacts and eliminates dual contact-list management. See `research/external/2026-05-20-loops-saas-email-platform-2026.md`.

Loops is NOT a newsletter-growth platform: no referrals, no ad network, no landing pages. If the user needs subscriber acquisition tools, Loops is wrong.

### Use case C: Creator with digital products (courses, ebooks, coaching)
You earn revenue primarily from selling digital products and want email to drive those sales. You need Shopify, Thinkific, or WooCommerce native integration.

**→ Recommend Kit (Creator plan, $39/mo for 1K subs)**

Why: 100+ native integrations (Shopify, WooCommerce, Thinkific, Calendly, Typeform). Built for creator commerce funnels. NOTE: Kit had a ~35% price increase in September/October 2025. Current pricing at kit.com should be verified. Kit charges a 0.6% transaction fee on paid subscriptions vs Beehiiv's 0%.

### Use case D: Content creator wanting zero-cost entry + brand recognition
You want to start writing immediately, do not have an existing audience, and want to test whether paid subscriptions work before committing to a platform.

**→ Recommend Substack (free until you monetize, then 10% fee)**

Why: Zero upfront cost, strong network effect for discovery, built-in paid subscription mechanics. Trade-offs: weakest API, limited customization, 10% fee erodes revenue at scale, migration to a better platform becomes necessary at ~$1K MRR.

### Use case E: Self-hosted + content site in one package
You want to own your data and infrastructure, run both a content publication and a newsletter, and are willing to manage hosting.

**→ Recommend Ghost (self-hosted free, or Ghost Pro)**

Why: Full content CMS + newsletter in one. RSS, newsletter, memberships, analytics in one app. Ghost Pro Starter costs ~$9-18/mo (verify at ghost.org/pricing — pricing discrepancy in research; see open question below). Self-hosted requires a VPS, email SMTP setup, and active maintenance.

**WARNING**: Self-hosted deliverability requires active domain reputation management. Budget 2-4 hours/week for maintenance, or use Ghost Pro which handles email through their infrastructure.

### Use case F: Already on Resend, early-stage product, <1K subscribers
You already use Resend for transactional email, have a small list, and want a simple managed-list layer without platform overhead.

**→ Recommend Resend Audiences**

Why: Zero additional setup if Resend is already in the stack. Contacts API, broadcast sending, unsubscribe management. No landing pages, no monetization, no growth tools. Appropriate for 0-1K subscribers; migrate to Loops or Beehiiv when you hit 1K.

---

## Pricing comparison table (2026)

| Platform | Free Plan | Entry Paid | At 5K subs | At 100K subs | Paid Sub Fee |
|---|---|---|---|---|---|
| Beehiiv | 2,500 subs | $49/mo (Scale) | $49/mo | $329/mo | 0% |
| Kit | 10K subs (limited) | $39/mo (1K) | $89/mo | $679/mo | 0.6% |
| Loops | 1K contacts | $49/mo (5K) | $49/mo | $299/mo | N/A |
| Substack | Yes | Free (10% fee) | Free | Free | 10% |
| Ghost Pro | No | ~$9-18/mo* | ~$39/mo* | ~$199/mo* | 0%** |
| Resend Audiences | Yes | $20/mo | $80/mo | Custom | N/A |

*Ghost Pro pricing: verify at ghost.org/pricing — research found conflicting values ($9 vs $18 for Starter).
**Ghost uses Stripe for payments; payment processing fees apply.

---

## Decision shortcut: subscriber count thresholds

- **0-500 subscribers**: Beehiiv free, Loops free, or Resend Audiences. No reason to pay yet.
- **500-1,000 subscribers**: Beehiiv free is capped at 2,500; stay free. Loops free capped at 1,000 — upgrade to $49 Loops if SaaS-use-case.
- **1,000-5,000 subscribers**: The inflection point. Beehiiv Scale ($49) unlocks monetization. Kit Creator ($39-89) for creator commerce.
- **5,000+ subscribers**: Beehiiv is cheaper than Kit by $40+/mo. Switch Kit users to Beehiiv unless Kit integrations are load-bearing.
- **50,000+ subscribers**: All platforms are comparable in cost (under $1K/mo). Platform-specific monetization features matter more than price.

---

## Open questions (from research)

> TODO: Ghost Pro pricing discrepancy — Starter listed as both $9/mo and $18/mo in research sources. Verify at ghost.org/pricing before quoting.
> TODO: Kit current pricing post-September 2025 price increase — sources diverge on Creator plan ($29 vs $39 for 1K subs). Verify at kit.com.

---

## Examples

See `examples/platform-recommendation-saas.md` and `examples/platform-recommendation-newsletter-first.md` for worked recommendations in each use case.
