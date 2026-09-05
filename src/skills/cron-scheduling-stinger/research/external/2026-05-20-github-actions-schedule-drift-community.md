---
source_url: https://github.com/actions/runner/issues/2977
retrieved_on: 2026-05-20
source_type: community
authority: community
relevance: high
topic: github-actions-drift
stinger: cron-scheduling-stinger
---

# GitHub Actions Scheduled Workflow Drift - Community Reports and Workarounds

## Summary

GitHub Actions `schedule:` workflows suffer from consistent, well-documented execution drift. This is a community-compiled summary drawing from GitHub Issues tracker (actions/runner#2977, github/docs#3059), a community Grafana dashboard project (lowlydba/cron-drift), and a January 2026 bug report about complete scheduling failures. The consensus is that `schedule:` should not be used for production tasks requiring timing guarantees.

## Key quotations / statistics

- From actions/runner issue #2977: "Consistent Cronjob execution drift for workflows using GitHub-hosted runner" - documented drift of 10-22 minutes
- From github/docs issue #3059: GitHub acknowledges "currently delays in 'schedule' actions start time"
- From cron-drift Grafana project: patterns show significant drift at the 23:45-00:05 UTC window and at the top of every hour
- January 2026 incident (actions/runner#4210): scheduled workflows failing to trigger at all on both GitHub-hosted and self-hosted runners across Windows, macOS, Ubuntu platforms

## Documented drift patterns

- **Typical delay:** 3-10 minutes past the scheduled cron time
- **P99 delay:** 22+ minutes in documented cases
- **Worst case:** Up to 60 minutes or complete non-execution
- **Pattern:** Drift clusters at the start of every hour (GitHub's peak scheduling time) and late night UTC windows
- **January 2026:** Periods where `schedule:` workflows simply did not trigger at all

## GitHub's official guidance

GitHub's documentation warns: "High load times include the start of every hour. If the load is sufficiently high enough, some queued jobs may be dropped. To decrease the chance of delay, schedule your workflow to run at a different time of the hour."

Practical implication: Schedule at `:07`, `:23`, or `:47` instead of `:00`, `:15`, `:30`, `:45`.

## Workaround patterns

**Pattern 1: Dual trigger (schedule + workflow_dispatch)**
```yaml
on:
  schedule:
    - cron: '7 3 * * *'   # Off-peak, off-hour timing
  workflow_dispatch:        # Manual re-run fallback
    inputs:
      reason:
        description: 'Reason for manual trigger'
        default: 'Scheduled job did not fire'
```

**Pattern 2: Heartbeat monitoring to detect drift**
```yaml
steps:
  - name: Run job
    run: ./run-job.sh
  - name: Ping Healthchecks.io
    if: success()
    run: curl -fsS --retry 3 ${{ secrets.HEALTHCHECKS_URL }}
```

**Pattern 3: External trigger for reliability**
Use Vercel Cron, Cloudflare Cron Triggers, or Healthchecks.io's built-in cron-to-webhook feature to trigger GitHub Actions externally via the `workflow_dispatch` API endpoint. This sidesteps GitHub's scheduler entirely.

## Observability: lowlydba/cron-drift

The `cron-drift` project provides a Grafana dashboard for measuring actual workflow execution drift in real time:
- Tracks delays vs scheduled time
- Shows hourly/daily patterns
- Surfaces long-tail delays (P95, P99)
- Useful for SLO dashboards when GitHub Actions scheduling is non-negotiable

## Annotations for stinger-forge

- This source and the official GitHub docs source together define the full picture for `guides/01-platform-limits.md`'s GitHub Actions section
- The drift problem is the key reason `guides/05-observability-monitoring.md` should prescribe Healthchecks.io even for GitHub Actions workflows
- The dual-trigger pattern (schedule + workflow_dispatch) belongs in `examples/github-actions-drift-mitigation.md`
- The external trigger pattern (Cloudflare/Vercel triggering GitHub via API) is worth a callout box as a "migration path when drift is unacceptable"
