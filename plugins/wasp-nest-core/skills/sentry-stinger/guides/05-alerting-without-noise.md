# 05. Alerting without noise

## The model: trigger + filter + action

- **Trigger** (WHEN): an issue-state event - created, resolved, escalates, resolved-issue-reopens. Multiple triggers in one alert run under `ANY`.
- **Filter** (IF): a condition narrowing which matching issues actually fire the alert - severity, assignment, team. Group multiple filters under `ANY` or `ALL`.
- **Action** (THEN): Slack/Teams/Discord, email, PagerDuty/Opsgenie, Jira/Linear/Azure DevOps ticket, webhook.

Newer terminology: a **Monitor** defines what to track and when to create an issue; an **Alert** defines who gets notified when that issue is created. One Alert can serve many Monitors - configure routing once, reuse it [raw/sentry--alerts--issue-alert-rules-noise.md].

## Default out-of-the-box behavior is too loud - don't leave it as-is

Sentry's default is "notify on every new issue," and unassigned issues notify **all project members** unless configured otherwise. Both of these need deliberate tuning before an alert channel becomes trustworthy rather than something the team learns to ignore [raw/sentry--alerts--issue-alert-rules-noise.md].

## Three concrete levers, in priority order

1. **Define "new" by threshold, not by first occurrence.** Alert once an issue crosses N events or M affected users, not on the very first single occurrence - a single occurrence of a rare edge case is not the same signal as a fast-climbing issue.
2. **Route unassigned-issue noise deliberately.** Add an IF condition "issue is assigned to no one" and route THEN to a dedicated triage channel, or disable the "notify all project members for unassigned issues" default under Project Settings > Issue Owners entirely.
3. **Filter by severity or exception type.** `level:fatal` is one of the highest-signal single filters available. If that's too blunt (some `fatal`-level exceptions genuinely aren't actionable, e.g. transient `ReadTimeout`), filter out the specific exception type rather than loosening the level filter for everything.

[raw/sentry--alerts--issue-alert-rules-noise.md]

## Throttling - per-issue, not global

The Throttling option sets a minimum re-trigger interval **for the same issue**. It stops one bursting issue from spamming repeatedly, but does not suppress simultaneous alerts from *different* issues that all match the same rule at the same time - don't rely on it as a global rate limiter [raw/sentry--alerts--issue-alert-rules-noise.md].

## Recommended starting shape for a new project

Two narrow rules beat one broad one:

- `level:fatal` AND newly-created (event/user threshold set) -> paging channel (Slack/PagerDuty), throttled to a minute-scale window.
- `is:unassigned` -> triage channel, so the whole team isn't pinged for something nobody's picked up yet.

Expand filters and add rules only as specific observed noise patterns justify it - don't pre-build an elaborate rule taxonomy speculatively before the project has real alert traffic to tune against [raw/sentry--alerts--issue-alert-rules-noise.md].

## ML Priority Alerts - treat as directional, not guaranteed-available

An ML-classifier-driven default alert rule and Escalating Issues detection exist per a 2024 Sentry blog post, claimed to average a 35% alert-volume reduction for adopters, gated to a Business-tier plan at time of writing. This was not re-confirmed against current pricing/feature availability in this research - mention it as a possibility worth checking in the Sentry dashboard directly, not as a feature to assume is active or included in the current plan [raw/sentry--alerts--issue-alert-rules-noise.md].

## Next

`06-cost-control-and-triage.md` covers the two remaining topics that tie everything above together: keeping the event bill under control, and correctly triaging handled vs. unhandled errors so alerts fire on the right things.
