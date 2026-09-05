# Sentry cost control: event quotas, SDK sample rate vs. rate limits, Spike Protection, and dynamic sampling

- URL: https://docs.sentry.io/pricing/quotas/ ; https://docs.sentry.io/pricing/quotas/spike-protection/ ; https://docs.sentry.io/pricing/quotas/manage-event-stream-guide/ ; https://www.sentry.help/en/articles/13964888-what-are-some-ways-i-can-control-the-event-volume-for-my-organisation ; https://docs.sentry.dev/organization/dynamic-sampling/
- Fetched: 2026-08-14
- Source type: Official docs (docs.sentry.io, docs.sentry.dev) + official help center
- Component: Cost control / quotas

## Content

### What counts toward quota

Sentry bills on **data volume**: events (errors, replays, spans/transactions, profiles), logs, application metrics, and attachments. Each data category has its own separate quota. When an event/log/metric/attachment is tracked, it counts against that category's quota specifically - a spike in one category (e.g. errors) does not consume another category's (e.g. replays) budget.

### Three levers to control volume, ranked by how the docs present them

| Lever | Errors | Spans | Replays | Attachments | Logs | App metrics |
| --- | --- | --- | --- | --- | --- | --- |
| Spike Protection | v | v | | v | | |
| Adjust your quota (reserved/pay-as-you-go) | v | v | v | v | v | v |
| Update SDK sample rate | v | v | | | | |

Notably: **Spike Protection does not apply to Replays**, and **SDK sample rate is not a lever for Replays, Attachments, Logs, or App metrics** at all per this table - replay volume specifically is controlled only via `replaysSessionSampleRate`/`replaysOnErrorSampleRate` (SDK-level, but not the generic "SDK sample rate" quota lever referenced here) and via reserved/pay-as-you-go quota adjustment.

### Spike Protection - what it actually does

A **spike** is a significant, temporary jump in event volume; because billing is based on monthly event count, a spike can consume an entire month's quota fast. Spike Protection establishes a **per-project spike threshold** based on baseline consumption; once volume crosses that threshold, events start getting **dropped** (not charged) rather than accepted-and-billed.

- Enabled per-project, by any org member with **Manager, Billing, or Owner-level permissions**, under `Settings > Spike Protection` (individually or via "Enable All").
- **Does not apply during trials** - trial orgs have unlimited category quotas for the trial duration regardless of Spike Protection being toggled on.
- **Notifications are off by default** (to avoid noise) - must be explicitly turned on per key project via email, Slack, or PagerDuty "Notification Actions" if desired.
- **Applies to**: errors, transactions/spans, and attachments. **Does not apply to replays** (per the table above) or logs/app-metrics.

### How the spike-detection algorithm works (documented in detail - useful for explaining unexpected drops to a team)

Threshold = the higher of two calculations:
1. **Minimum event calculation**: max of (1/10th of the Developer-plan minimum reserved volume quota for that event type) or `(3 * quota) / (720 * number_of_projects)`, with number-of-projects capped at 5. This exists so brand-new projects with no history still get meaningful protection.
2. **Usage-based calculation**: weighted average of hourly data from the past 7 days, accounting for daily/hourly seasonality (e.g. Monday 3pm weighted more by other Monday-3pm data points), multiplied by a factor of 5x the past week's standard deviation, bounded between 3x and 6x.

Thresholds **recalculate every hour** during an active spike, gradually raising the ceiling to adapt to sustained new traffic. Dropped-event contribution to the threshold **decays** - about 10% weight remains 24 hours after a spike, and it's essentially zero after 2 days - so a one-off spike doesn't permanently distort future thresholds, but a sustained new baseline eventually gets absorbed rather than continuously flagged.

**Worked example from the docs**: a project normally at 100-200 events/hour spikes to 50,000. Over 5 hours, the recalculating limit rises from ~2083 to ~9371 events/hour, and roughly 157k of the ~478k spike-period events actually get accepted (against a 500k org quota) - the rest are dropped, protecting the rest of the month's budget.

**Bursty-by-design projects** (e.g. cron/Airflow/task-runner-orchestration projects that legitimately burst high volume in short windows) may want Spike Protection turned **off** for that specific project, since the algorithm can't distinguish "malfunction spike" from "intentional burst pattern."

### Managing an active spike (recommended steps)

- Check which issues are consuming quota (org Stats page).
- Set rate limits on the DSN key(s) for the affected project(s).
- Set up Monitors watching event-count-per-project.
- If traceable to one release, add that release's version identifier to the project's inbound filters to reject further events from it.
- Set up a pay-as-you-go budget in advance so a future spike doesn't leave the org with zero visibility for the rest of the billing period.

### SDK sample rate vs. rate limiting - two different tools, don't conflate them

- **SDK sample rate** (`sampleRate` for errors, `tracesSampleRate`/`tracesSampler` for traces): evaluated **client-side**, before the event is even sent. Static - **changing it requires redeploying the app**. Also **limits visibility into the source of events**, because a fraction of real occurrences are never even transmitted, which can distort "how often is this actually happening" investigations.
- **Rate limiting** (configured server-side in Sentry, per DSN key): only drops events **once volume is already high**, acting as a ceiling rather than a constant filter - doesn't reduce visibility during normal operation, only protects during an actual surge. Sentry's own framing: a project-level rate limit "may better suit your needs" than lowering the SDK sample rate, specifically because it preserves full visibility under normal conditions.

Recommended rate-limit-setting method (from `manage-event-stream-guide`): compute a **daily max** from expected volume, then prefer a **minute-based** rate limit over daily/hourly - a minute-based limit avoids the failure mode where one random spike exhausts an entire day's or hour's allowance and leaves the project blind for the rest of that window.

### Dynamic Sampling (server-side, automatic, distinct from SDK-side sampling)

At scale, Sentry's backend automatically applies **Dynamic Sampling Priorities** to decide which spans/transactions to *retain* after ingestion - **applies only to spans and transactions, not errors**. Enabled by default; adjustable per-project under `Project Settings > Performance`. Two named priorities: prioritizing **low-volume projects** (so they aren't drowned out org-wide by high-volume ones - this one specifically cannot be disabled, it's org-wide) and prioritizing **low-volume transaction names within a project** (so rare code paths still get enough samples to be analyzable, not just the noisiest endpoint).

Important clarification on what this means for performance-metric accuracy: even when Dynamic Sampling is only *storing* a subset of spans, **the performance metrics shown are still computed from all received events**, not just the stored subset - so lowering what's retained does not silently corrupt aggregate performance numbers, only the ability to drill into every individual span.

Sentry's own stated preference: set `tracesSampleRate` as close to `1.0` as feasible and let Dynamic Sampling handle further backend-side prioritization, rather than aggressively hand-tuning the SDK-side rate down - **this must be read alongside**, not as a replacement for, the practical guidance in the tracing/sampling raw file, since billing/metering is based on **received** (sent-to-Sentry) events, not stored ones. A high `tracesSampleRate` still means high send volume and cost exposure even if Dynamic Sampling later thins out what's retained on Sentry's side.

### Quick reference: what does NOT count toward quota

Per the quotas overview table: events dropped by Spike Protection while active do not count; events blocked by inbound data filters do not count; events dropped because the SDK sample rate excluded them do not count (they were never sent); events rejected for exceeding an already-exhausted quota do not count (they're rejected, not billed).
