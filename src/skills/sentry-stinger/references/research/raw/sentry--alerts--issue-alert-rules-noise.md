# Sentry issue alerts: WHEN/IF/THEN model, best practices, and alert-fatigue mitigation

- URL: https://docs.sentry.io/product/monitors-and-alerts/alerts/ ; https://blog.sentry.io/top-3-issue-alert-tips-to-stop-noisy-notifications/ ; https://blog.sentry.io/cancel-the-issue-noise/ ; https://www.sentry.help/en/articles/13964027-what-does-the-throttling-option-do-in-alerts ; https://www.sentry.help/en/articles/15007504-monitors-alerts-guide-and-faq
- Fetched: 2026-08-14
- Source type: Official docs (docs.sentry.io) + official blog (blog.sentry.io, dated 2022-10-20 and 2024-08-14 - flagged as older than the 12-month window, included because the underlying alert-rule mechanics are evergreen product behavior, not time-sensitive facts) + official help center
- Component: Alerting

## Content

### Dating flag

The two blog posts cited here are dated 2022-10-20 and 2024-08-14 respectively - both older than this research's 6-12 month preferred window. They are included because (a) the current official docs page (`docs.sentry.io/product/monitors-and-alerts/alerts/`, undated/evergreen) independently confirms the same WHEN/IF/THEN structure and best-practices framing, and (b) no more recent official post specifically superseding this alert-tuning guidance was found. Treat the ML Priority Alerts feature specifics (below) as a point-in-time claim from the 2024 post rather than confirmed-current.

### Core model: triggers, filters, actions

- **Trigger** ("WHEN" in the newer Monitors terminology): an issue-state-based event that must occur for the alert to run - e.g. issue created, issue resolved, issue escalates, resolved issue becomes unresolved again. Multiple triggers in one alert run under `ANY` (any one firing runs the alert).
- **Filter** ("IF"): a condition that must additionally be true - e.g. issue assigned to a specific team, at a certain severity. Multiple filters group under `ANY` or `ALL`.
- **Action** ("THEN"): what happens when triggers+filters match - chat notification (Slack, Teams, Discord), email, on-call tool (PagerDuty, Opsgenie), issue tracker (Jira, Azure DevOps, Linear), webhook, or another integration-platform action.

Newer terminology split (per the help-center FAQ): a **Monitor** defines *what to track* and *when to create an issue*; an **Alert** defines *who gets notified* when that issue is created. One Alert can be wired to many Monitors, so notification routing is configured once and reused. Existing legacy alert rules migrated automatically into this Monitors model; if seeing more notification volume than expected post-migration, filter with an if/then condition like "issue type is not equal to metric monitor" to separate metric-monitor noise from issue-alert noise.

### Official best-practices list (current docs page)

- Use filters to narrow down to issues that are actually critical for the team.
- Select only the triggers that matter per action - e.g., create a Jira ticket on every new issue, but only ping Slack for a certain severity. Different actions can have different urgency thresholds within the same overall alerting setup.
- Design routing around how the team actually triages: per-project/per-service channels vs. one catch-all team channel.

### Tip 1 - define "new" deliberately (from the noisy-notifications post)

Default "alert me on every new issue" is often too broad. Define "new" using **event count and/or affected-user thresholds** on first occurrence, not just "issue was created" - e.g. only alert once an issue crosses N events or M affected users, not on the very first single occurrence.

### Tip 2 - route unassigned-issue noise deliberately

Without an explicit rule, Sentry notifies **all project members** for unassigned issues, which doesn't scale past a small team. Two fixes: (a) add an IF condition "issue is assigned to no one" and route THEN to a dedicated triage channel instead of the whole team, or (b) in **Project Settings > Issue Owners**, toggle off the "notify all project members for unassigned issues" default outright.

### Tip 3 - filter by severity level or exception type

Sentry auto-assigns levels to events (`fatal`, `error`, `warning`, `info`, `debug`, `sample`). An IF condition like "event's level is equal to fatal" is one of the most effective single levers for cutting to only high-priority notifications. If level-based filtering is too blunt (e.g., a `ReadTimeout` exception is `fatal` but not actually actionable), filter out specific exception types instead of relaxing the level filter.

### Throttling

The Throttling option on an alert sets a **minimum time between repeat triggers for the same issue** - once an alert fires for an issue, it won't fire again for that same issue until the throttle window elapses, even if the underlying condition keeps being true. Useful specifically for a sudden burst of events on one issue in a short window, so one notification doesn't become dozens. Note: if the *same* alert conditions trigger multiple *different* issues simultaneously, all of those still notify - throttling is scoped per-issue, not global.

### ML Priority Alerts (2024 blog post, treat as point-in-time / plan-gated)

Described as a Business-plan, early-adopter feature that uses a machine-learning classifier (built on top of Sentry's "AI Grouping" issue-grouping feature) to distinguish actionable from non-actionable/low-priority issues, and an updated default alert rule that filters on this priority classification. Sentry's own claimed result: an average 35% reduction in alert volume for adopters. Also introduced alongside: **Escalating Issues detection**, which alerts specifically when a significant volume spike is detected on an issue, so minor issues that later escalate still get caught even if initially filtered as low-priority.

### Net guidance for a Ship Gate-relevant SvelteKit/Vercel app

Combining the above into a concrete default recommendation (synthesis, not a direct quote): start with a small number of alert rules scoped narrowly - e.g., one rule for `level:fatal` new issues routed to a paging channel, one rule for `is:unassigned` routed to a triage channel, both with throttling set to a sane window (minutes, not seconds) - rather than the default "notify on every new issue to everyone" behavior most projects start with. Expand filters/rules only as specific noise patterns are observed, rather than pre-building an elaborate rule set speculatively.
