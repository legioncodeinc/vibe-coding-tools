# Research Summary: newsletter-platform-stinger

## Depth Tier Consumed
**normal** (10 queries executed, 15 source files written)

## Time Window Covered
**November 2025 - May 2026** (6 months)

Most sources are dated 2026 (March-May 2026). Several key sources date from late 2025 (November-December 2025). One migration checklist source is April 2026. All sources are within the 6-month recency window except where noted.

## Files Written

| Subfolder | Count |
|---|---|
| `external/` | 15 source files |
| Root (`research-plan.md`, `index.md`, `research-summary.md`) | 3 meta files |
| **Total** | **18 files** |

---

## The 5 Most Influential Sources

### 1. `2026-05-20-beehiiv-vs-kit-comparison-2026.md`
**URL**: stackcrisp.com/blog/beehiiv-vs-kit-convertkit-2026 (April 2026)
**Why it matters**: Only source that ran a real 4-month A/B test between Beehiiv and Kit with the same content. Revenue data is empirical, not speculative: Beehiiv generated 17x more net revenue ($2,412 vs $138). Provides the specific pricing crossover point (1,000 subscribers = Kit is cheaper below, Beehiiv decisively cheaper above). Central to `guides/00-platform-selection.md` and `guides/03-monetization.md`.

### 2. `2026-05-20-beehiiv-ad-network-monetization-2026.md`
**URL**: beehiiv.com/blog/beehiiv-the-state-of-newsletters-2026 (January 2026)
**Why it matters**: Official Beehiiv data for the platform's monetization story. Contains the ground-truth numbers: $19M in paid subscription revenue (138% YoY), $1M+/month ad network payouts, 30,000+ publishers in recommendation network, 66-day median to first dollar, active advertisers (Notion, Google, Netflix). This is the primary source for `guides/03-monetization.md`.

### 3. `2026-05-20-substack-to-beehiiv-migration-checklist.md`
**URL**: newsletter.supply/blog/substack-to-beehiiv-migration-checklist (April 2026)
**Why it matters**: Only source that provides a complete, ordered migration checklist with the gotchas that cause failed migrations (Stripe paid subscriber transfer order, Substack Safari zip issue, domain warmup timing, dual-send week anti-pattern). Foundation for `guides/04-migration.md`.

### 4. `2026-05-20-loops-saas-email-platform-2026.md`
**URL**: trybuildpilot.com/454-loops-email-review-2026 (March 2026)
**Why it matters**: Answers the Command Brief's open question about Loops' 2026 feature parity. Confirms: Loops is excellent for SaaS lifecycle email (transactional + marketing unified, event-based automation), but is NOT a newsletter-growth platform (no referrals, no ad network, no landing pages). Resolves the "Beehiiv vs Loops for SaaS" decision clearly.

### 5. `2026-05-20-newsletter-signup-nextjs-loops.md`
**URL**: getcraftly.dev/blog/email-marketing-loops-so-nextjs-template-setup (April 2026)
**Why it matters**: Only source with production-ready Next.js App Router code for newsletter signup integration. Provides the complete Route Handler pattern with Edge runtime, input validation, idempotent contact creation (409/already-subscribed handling), React form component, and domain verification steps. Template for `guides/01-embedded-signup.md`.

---

## Open Questions Surviving Research

1. **Beehiiv API segment-level writes**: The Command Brief asked: "Has Beehiiv launched a developer API v2 that supports segment-level API writes?" Research confirms API v2 exists and supports subscription-level writes, but **segment-level API writes were not confirmed**. Needs direct verification at developers.beehiiv.com.

2. **Beehiiv's exact ad network commission rate**: Research confirms Beehiiv takes a commission on Ad Network revenue but does not cite the exact percentage. Sources say "check current rate on beehiiv.com." This number changes as the network grows. stinger-forge should pull from current docs.

3. **Ghost Pro pricing discrepancy**: Sources show Ghost Starter at both $9/month and $18/month. This may reflect a recent price change. Verify at ghost.org/pricing before publishing the platform selection guide.

4. **Kit's September 2025 price increase**: Multiple sources confirm Kit raised prices ~35% in September/October 2025 ("up to 4x for some users"). Current Kit Creator plan pricing cited as $29/month (1K subs) in some sources and $39/month in others. Needs current verification at kit.com.

5. **Loops double opt-in support**: Research shows Loops handles welcome email sequences but doesn't specifically document a double opt-in confirmation email flow (where the user must click a link to confirm). This matters for GDPR compliance. Needs verification at loops.so/docs.

---

## Sources stinger-forge Should Re-fetch for Deeper Context

1. **https://developers.beehiiv.com/api-reference/subscriptions/index** - the full subscriptions API reference, particularly for the `POST` endpoint (create subscription) parameters - needed for the embedded signup integration guide. The research captured the `GET` endpoint well but not the full `POST` schema.

2. **https://loops.so/docs** - the official Loops API documentation for the contacts API. The research captured a practitioner's implementation but not the official endpoint schema. Needed to verify double opt-in support and rate limits.

3. **https://resend.com/docs/dashboard/audiences/introduction** - re-read the Broadcasts section specifically; research captured Contacts/Audiences well but didn't fully explore the Broadcasts sending flow and template system.

4. **https://ghost.org/pricing** - current pricing page to resolve the $9 vs $18 discrepancy and confirm current tier names.

---

## Research Coverage Assessment

| Guide | Coverage | Confidence |
|---|---|---|
| `guides/00-platform-selection.md` | Complete | High |
| `guides/01-embedded-signup.md` | Partial (Loops + Beehiiv embed documented; Beehiiv API + Resend need integration code) | Medium |
| `guides/02-deliverability.md` | Good (managed SaaS vs self-hosted covered; domain auth basics present) | High |
| `guides/03-monetization.md` | Excellent (ad network, paid subs, boosts, direct sponsorships all covered with numbers) | High |
| `guides/04-migration.md` | Good (Substack → Beehiiv detailed; Kit → Beehiiv mentioned but not detailed) | Medium-High |
