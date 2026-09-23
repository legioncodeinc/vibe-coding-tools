# Example: GitHub Actions Schedule Drift Mitigation

*Demonstrates: guides/00-cron-expression-syntax.md, guides/01-platform-limits.md, guides/05-observability-monitoring.md*

---

## Scenario

A GitHub Actions workflow generates a weekly stale-issue report every Monday at 9 AM UTC. The team has observed drift of 15-25 minutes. They want: a manual re-run trigger, drift detection, and a Healthchecks.io alert if the job doesn't start within 30 minutes of the scheduled time.

---

## `.github/workflows/weekly-stale-report.yml`

```yaml
name: Weekly Stale Issue Report

on:
  # Primary: scheduled trigger (5-minute minimum, UTC, drift expected under load)
  schedule:
    - cron: "0 9 * * 1"   # Every Monday at 09:00 UTC
  # Fallback: manual trigger for when schedule drifts or misses entirely
  workflow_dispatch:
    inputs:
      dry_run:
        description: "Set to 'true' to preview without sending report"
        required: false
        default: "false"

jobs:
  stale-report:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      # Signal start to Healthchecks.io
      - name: Ping Healthchecks.io — start
        run: curl -fsS -m 10 --retry 5 "${{ secrets.HEALTHCHECK_STALE_REPORT_URL }}/start" || true

      - name: Generate stale issue report
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          REPORT_EMAIL: ${{ secrets.REPORT_EMAIL }}
          DRY_RUN: ${{ github.event.inputs.dry_run || 'false' }}
        run: node scripts/generate-stale-report.js

      # Signal success or failure to Healthchecks.io
      - name: Ping Healthchecks.io — success
        if: success()
        run: curl -fsS -m 10 --retry 5 "${{ secrets.HEALTHCHECK_STALE_REPORT_URL }}" || true

      - name: Ping Healthchecks.io — fail
        if: failure()
        run: curl -fsS -m 10 --retry 5 "${{ secrets.HEALTHCHECK_STALE_REPORT_URL }}/fail" || true
```

---

## Healthchecks.io configuration for this workflow

| Setting | Value |
|---|---|
| Schedule | `0 9 * * 1` |
| Timezone | UTC |
| Grace time | 30 minutes (accounts for up to 30-minute drift) |
| Alert on | Missed (no ping within 90 min of scheduled time) |

The `|| true` on the curl commands ensures a Healthchecks.io network failure does not fail the workflow.

---

## Key patterns demonstrated

- `workflow_dispatch` fallback so the job can be manually triggered after a missed run (`guides/01-platform-limits.md`)
- Healthchecks.io start/success/fail signals with `|| true` guard (`guides/05-observability-monitoring.md`)
- Plain-English comment on the cron expression (`guides/00-cron-expression-syntax.md`)
- `timeout-minutes` guard to prevent runaway jobs
- `--retry 5` on curl for transient Healthchecks.io availability

---

## Note on GitHub Actions schedule drift

GitHub Actions `schedule:` drift of 15-40 minutes is documented community behavior (see `research/external/2026-05-20-github-actions-schedule-drift-community.md`). This example mitigates drift by:
1. Setting Healthchecks.io grace time to 30 minutes (miss alert fires 90 min after schedule).
2. Adding `workflow_dispatch` so a missed run can be manually re-triggered.

For time-critical jobs (SLA under 30 minutes), do not use GitHub Actions `schedule:`. Use Vercel Cron or Cloudflare Workers instead.
