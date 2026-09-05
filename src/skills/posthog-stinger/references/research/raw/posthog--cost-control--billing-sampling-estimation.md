# PostHog cost control: event volume management, sampling, and billing tools

- URL: https://posthog.com/docs/product-analytics/cutting-costs ; https://posthog.com/docs/billing/estimating-usage-costs ; https://posthog.com/docs/billing/limits-alerts ; https://posthog.com/docs/billing/common-questions ; https://posthog.com/docs/product-analytics/pricing ; https://posthog.com/docs/data/event-filtering
- Fetched: 2026-08-14
- Source type: Official docs
- Component: Billing / cost control

## Content

### Product analytics pricing shape (usage-based, tiered, per event)

| Tier | Price/event |
| --- | --- |
| First 1,000,000/mo | $0 (free tier) |
| 1-2 million | $0.0000500 |
| 2-15 million | $0.0000343 |
| 15-50 million | $0.0000295 |
| 50-100 million | $0.0000218 |
| 100-250 million | $0.0000150 |
| 250 million+ | $0.0000090 |

"Product Analytics is billed by the number of events captured... more than 90% of companies use PostHog for free." No credit card required to start.

### Why usage-based pricing (official rationale)

"The more you use PostHog, the more value you get, and the more it costs us to process and store your data." Explicitly rejects flat per-MAU pricing as not value-aligned: "Some users are very valuable... Other users hit your landing page and bounce immediately... you shouldn't need to pay the same amount for both."

### Concrete cost levers, in the order PostHog's own cutting-costs doc presents them

1. **Use anonymous events over identified where possible** - "anonymous events can be up to 4x cheaper than identified ones (due to the cost of processing them)." Only identify users when the identification actually adds analytical value (see identify raw file for the anonymous-vs-identified capability tradeoff).
2. **Configure or disable autocapture** - allow/ignore lists (`url_allowlist`, `element_allowlist`, `css_selector_ignorelist`, etc. - see autocapture raw file) to shed volume, or `autocapture: false` entirely.
3. **Call `identify()` only once per session** - redundant calls with identical data are no-ops (don't fire an extra `$identify` event); no manual dedup guard is needed, though a changed-property call still fires a `$set` event.
4. **Call `group()` only once per session on the client** - repeated calls generate duplicate `$groupidentify` events and unnecessary cost; a provided SQL snippet (query `$session_id`s with >1 `$groupidentify` in a 30-day window, grouped by `$lib`) helps find where duplicates are being generated in an existing implementation.
5. **Disable pageview/pageleave autocapture and capture manually** where only a subset of pages need tracking - `capture_pageview: false, capture_pageleave: false` in `posthog.init`, then call `posthog.capture('$pageview')`/`posthog.capture('$pageleave')` selectively. Explicit warning: disabling these can break other features that depend on them, e.g. bounce rate.
6. **Group analytics cost note** (cross-reference to group-analytics raw file): enabling the group-analytics add-on bills ALL identified events project-wide, not just group-tagged ones - a much bigger cost surface than it first appears, worth flagging before enabling.

### Event ingestion filtering (drop events before processing, not just before display)

"Event ingestion filtering lets you drop events at ingestion time based on event metadata. Filters are evaluated early in the ingestion pipeline, before transformations run, making it the most efficient way to exclude unwanted events from your data." Use cases explicitly listed: dropping bot/internal-tool traffic, filtering test/staging traffic by `distinct_id`, removing high-volume low-value events to cut cost, and temporarily filtering known-buggy client data while a fix rolls out. The filtering UI shows "Dropped" (live mode) vs "Would be dropped" (dry-run mode) approximate counts to validate a filter's match scope before going live - counts are best-effort, can be off by a small percentage.

Note: this is distinct from client-side `url_allowlist`/`css_selector_ignorelist`-style autocapture filtering - ingestion filtering happens server-side on already-sent events based on metadata, and is presented as the *most efficient* exclusion method specifically because it runs before transformations.

### Sampling - research gap, stated plainly

**No dedicated PostHog sampling feature/API was found in the fetched sources.** The cost-control docs describe volume reduction exclusively via autocapture allow/ignorelists, anonymous-vs-identified event choice, single-call-per-session discipline for `identify()`/`group()`, disabling pageview/pageleave autocapture, and post-ingestion event filtering - none of these constitute statistical sampling (i.e., capturing only a random percentage of a given event type while preserving trend accuracy via extrapolation). If a "true" sampling capability (e.g. `sample_rate` on `posthog.capture()` or a project-level sampling rule) exists in PostHog, it was not surfaced by this research pass and should not be assumed - treat any claim of a PostHog-native sampling feature as unconfirmed until a dedicated source is fetched.

### Billing limits and alerts (hard stop, not just a warning)

Billing limits are settable **per product** (Organization > Billing settings > per-product "Set billing limit"). Once the dollar limit is set and reached, "we will stop ingesting and processing your data so you are not charged over the set limit. In other words, if you exceed the billing limit you set, your additional data is lost forever." This is a hard, non-recoverable data-loss tradeoff, not a soft throttle - alert emails fire automatically to the org owner at 80% and 100% of both the billing limit and the free-tier allotment.

Confirmed via billing FAQ: "Are events or replays dropped when I reach billing limits? Yes, PostHog drops data after you go over your billing limit." Raising the limit does not retroactively recover already-dropped data within the same billing period.

### Estimating usage before/while adopting PostHog

Two official estimation paths: (1) sign up free and read the actual projected volume off the Organization Billing page after a few days (a full week recommended, to average weekday/weekend patterns) - explicitly the more accurate method; (2) estimate from known MAU counts using PostHog's own cross-customer benchmark table of "monthly events per MAU" by product category (e.g. B2B SaaS with autocapture ~87 events/MAU, B2C crypto wallet without autocapture ~162 events/MAU, B2C event booking without autocapture as low as 8 events/MAU) - explicitly caveated as approximate and highly category-dependent, autocapture-on vs off materially changes the multiplier.

Feature flag request estimation (separate billing dimension from events): frontend SDKs fire a `/flags` request on SDK init, on `identify()`, on person-property update, on `reloadFeatureFlags()`, and on `group()` creation - estimate via Network-tab request count per pageview x monthly pageviews. Backend without local evaluation: one `/flags`-equivalent request per `evaluateFlags()` call. Backend WITH local evaluation: each poll (default every 30s) counts as 10 flag requests regardless of how many individual flags are checked in between - a single always-on server polling every 30s works out to `10 * 2/min * 60 * 24 * 30 ≈ 864,000` flag requests/month, scaled by number of running server instances/pollers.

### Billable usage dashboard (diagnostic tool, not a cost-reduction lever itself)

A "PostHog billable usage" dashboard template breaks down usage by event/SDK-library/product to identify exactly what's driving the bill before deciding which cost lever above to pull.
