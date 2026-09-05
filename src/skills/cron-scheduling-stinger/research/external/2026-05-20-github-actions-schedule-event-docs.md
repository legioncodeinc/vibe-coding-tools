---
source_url: https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#schedule
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: github-actions-schedule
stinger: cron-scheduling-stinger
---

# GitHub Actions `schedule` Event - Official Documentation

## Summary

GitHub Actions supports scheduled workflows via the `schedule:` event using POSIX cron syntax. Minimum interval is every 5 minutes. Since a recent update, GitHub now supports IANA timezone strings for timezone-aware scheduling (new feature - previously UTC only). Scheduled workflows only run on the default branch. Key reliability issue: scheduled events can be delayed or dropped during high load periods; GitHub explicitly warns against using `schedule:` for time-critical production tasks. Workflows in public repositories are auto-disabled after 60 days of no repository activity.

## Key quotations / statistics

- "The shortest interval you can run scheduled workflows is once every 5 minutes."
- "By default, scheduled workflows run in UTC. You can optionally specify a timezone using an IANA timezone string for timezone-aware scheduling."
- "The `schedule` event can be delayed during periods of high loads of GitHub Actions workflow runs. High load times include the start of every hour. If the load is sufficiently high enough, some queued jobs may be dropped. To decrease the chance of delay, schedule your workflow to run at a different time of the hour."
- "Scheduled workflows will only run on the default branch."
- "In a public repository, scheduled workflows are automatically disabled when no repository activity has occurred in 60 days."
- DST behavior: "For schedules that set `timezone` to a time zone that observes daylight saving time (DST), during DST spring-forward transitions, scheduled workflows in skipped hours advance to the next valid time. For example, a 2:30 AM schedule advances to 3:00 AM."

## Basic syntax

```yaml
on:
  schedule:
    - cron: '30 5 * * 1-5'   # 5:30 UTC Monday-Friday
```

## Timezone-aware scheduling (IANA timezone support)

```yaml
on:
  schedule:
    - cron: '0 9 * * *'
      timezone: 'America/New_York'  # 9:00 AM Eastern Time
```

## Multiple schedules (accessing which schedule triggered)

```yaml
on:
  schedule:
    - cron: '30 5 * * 1,3'    # 5:30 UTC Monday/Wednesday
    - cron: '30 5,17 * * 2,4'  # 5:30 and 17:30 UTC Tuesday/Thursday

jobs:
  test_schedule:
    runs-on: ubuntu-latest
    steps:
      - name: Not on Monday or Wednesday
        if: github.event.schedule != '30 5 * * 1,3'
        run: echo "This step will be skipped on Mon/Wed"
```

## Cron expression special characters

| Character | Meaning | Example |
|-----------|---------|---------|
| `*` | Any value | `* * * * *` every minute |
| `,` | Value list separator | `1,3,5` = 1, 3, and 5 |
| `-` | Range of values | `1-5` = 1 through 5 |
| `/` | Step values | `20/15` = every 15 min from minute 20 |

## Known reliability issues (drift)

From community research and GitHub's own documentation, scheduled workflows have a well-documented drift problem:

- Typical delays: 3-10 minutes past scheduled time
- Under heavy load: delays of 22+ minutes, sometimes up to 1 hour
- Extreme cases: workflows may not trigger at all
- January 2026 incident: multiple users reported both GitHub-hosted and self-hosted runners failing to execute scheduled workflows entirely

GitHub explicitly warns: "If the load is sufficiently high enough, some queued jobs may be dropped."

## Auto-disabling in public repositories

Scheduled workflows are **automatically disabled** in public repositories after 60 days of no repository activity. This is a silent gotcha - jobs appear configured but silently stop running.

## Annotations for stinger-forge

- Primary source for `guides/01-platform-limits.md` GitHub Actions section
- The reliability/drift issue is critical; the guide must recommend `workflow_dispatch` as a fallback trigger for manual re-runs
- The new IANA timezone support is significant (previously UTC-only); update any docs that say "UTC only"
- DST handling (advance to next valid time on spring-forward) is now documented behavior
- 60-day auto-disable is a common production gotcha; `guides/06-audit-and-inventory.md` should flag this
- The `cron-drift` Grafana project (https://github.com/lowlydba/cron-drift) is a companion monitoring resource
