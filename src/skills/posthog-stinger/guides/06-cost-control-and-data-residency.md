# 06. Cost control and data residency

## EU vs US cloud - decide this before writing any code

| | US Cloud (default) | EU Cloud |
| --- | --- | --- |
| Hosting | USA (AWS) | Frankfurt, Germany (AWS) |
| IP capture default | On (must manually disable) | **Off by default for every new project** |
| GDPR posture | Requires manual anonymization of EU-user data via realtime transformations | PostHog's own recommended path for "robust GDPR compliance," no extra anonymization step needed |

[raw/posthog--data-residency--eu-us-gdpr.md]

**Practical rule (synthesized from the research, flagged as inference rather than a direct PostHog quote)**: for any app with a meaningful EU user base where GDPR is a live legal concern, default to EU Cloud endpoints (`eu.i.posthog.com`/`eu-assets.i.posthog.com`, `ui_host: https://eu.posthog.com`) from day one - retrofitting the region later means migrating an existing project. Otherwise, US Cloud (PostHog's own default) is fine [raw/posthog--data-residency--eu-us-gdpr.md]. Region choice must stay consistent across every endpoint the integration touches - see `references/env-var-checklist.md`.

Right-to-be-forgotten mechanics: person/group/project/org deletion is available via UI and API; **event deletion specifically is asynchronous** (processed during non-peak hours since ClickHouse deletion is expensive) - avoid reusing a just-deleted `distinct_id` for a new user until deletion is confirmed complete via the deletion-status API, or use the "Reset deleted person" tool if reuse can't be avoided [raw/posthog--data-residency--eu-us-gdpr.md]. The managed reverse proxy is explicitly NOT HIPAA-compliant regardless of any org-level BAA, since it introduces Cloudflare as an additional subprocessor - self-host the proxy instead if HIPAA applies [raw/posthog--data-residency--eu-us-gdpr.md, raw/posthog--reverse-proxy--vercel-and-managed.md].

## Cost control - the levers, in the order PostHog's own docs present them

1. **Prefer anonymous events over identified where the identification doesn't add analytical value.** Identified events cost up to 4x more than anonymous ones. This is the single highest-leverage lever and ties directly into the identify guidance in `guides/02-events-and-identify-alias.md` - don't identify a user just because you can; identify when person properties/cohorts/targeting actually need it [raw/posthog--cost-control--billing-sampling-estimation.md, raw/posthog--identify--alias-identity-resolution.md].
2. **Configure or disable autocapture** - allow/ignore lists, or a full `autocapture: false`, when autocapture volume outweighs its value. See `guides/02-events-and-identify-alias.md`.
3. **Call `identify()` once per session** - it's idempotent by design (no duplicate `$identify` fires on repeat calls with the same data), but still worth not calling redundantly.
4. **Call `group()` once per session, client-side only** - repeated calls generate duplicate `$groupidentify` events; a documented SQL query can find where an existing implementation is generating duplicates.
5. **Disable pageview/pageleave autocapture and capture manually** where only specific pages matter - explicit tradeoff: this can break features that depend on automatic pageview/pageleave events, e.g. bounce rate.
6. **Be aware of the group-analytics billing-scope gotcha** (see `guides/05-group-analytics-and-reverse-proxy.md`) before enabling it.

[raw/posthog--cost-control--billing-sampling-estimation.md]

## Event ingestion filtering - a separate, server-side lever

Distinct from client-side autocapture allow/ignorelists: ingestion filtering drops events server-side, by metadata, before transformations run - described as "the most efficient way to exclude unwanted events" precisely because it runs earliest in the pipeline. Use cases: dropping bot/internal-tool traffic, filtering test/staging traffic by `distinct_id`, cutting high-volume low-value events for cost, or temporarily filtering known-buggy client data during a fix rollout. A dry-run mode shows "would be dropped" counts before committing to a live filter [raw/posthog--cost-control--billing-sampling-estimation.md].

## Sampling - state the gap plainly, do not invent a feature

No PostHog-native statistical sampling mechanism (e.g. a `sample_rate` config that captures only a random percentage of a given event type) was found anywhere in this research pass. Every volume-reduction lever PostHog documents is allow/ignorelist-based or metadata-filter-based, not probabilistic sampling. **Do not tell a user PostHog has a native sampling feature** - if genuine statistical sampling is required, that would need to be implemented in application code before the `capture()` call (e.g. only calling `capture()` for a random subset of a high-volume event type), which is a manual pattern, not a documented PostHog SDK option [raw/posthog--cost-control--billing-sampling-estimation.md].

## Billing limits are a hard stop with permanent data loss - not a soft throttle

Setting a per-product billing limit means PostHog stops ingesting once the dollar limit is hit for that billing period: "your additional data is lost forever" past the limit, not queued or delayed. Alert emails fire automatically at 80% and 100% of both the billing limit and the free-tier allotment. Confirmed explicitly in PostHog's billing FAQ: events and replays ARE dropped once a billing limit is reached [raw/posthog--cost-control--billing-sampling-estimation.md]. Treat a billing limit as a last-resort safety net against a runaway bill, not a routine cost-management tool - the levers above should be the first line of defense.

## Estimating cost before/while adopting PostHog

Most accurate: sign up free, use the product for a week (captures both weekday and weekend patterns), read the projected volume off the Organization Billing page. Rougher estimate: multiply known MAU count by PostHog's published "events per MAU" benchmark table for a comparable product category (varies hugely by category and by whether autocapture is on) [raw/posthog--cost-control--billing-sampling-estimation.md]. Feature-flag request volume is a separate billing dimension from events - local evaluation polling counts as 10 requests per poll cycle (not per individual flag checked), so a single always-on server polling every 30s alone works out to roughly 864,000 flag requests/month; multiply by the number of running server instances/pollers for the real total [raw/posthog--cost-control--billing-sampling-estimation.md, raw/posthog--feature-flags--local-evaluation-bootstrapping.md].
