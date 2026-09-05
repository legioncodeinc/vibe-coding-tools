---
source_url: https://cronitor.io/docs/cron-job-monitoring
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: monitoring-cronitor
stinger: cron-scheduling-stinger
---

# Cronitor Job Monitoring - Official Documentation

## Summary

Cronitor provides comprehensive job monitoring using a three-event state machine (run/complete/fail). Unlike Healthchecks.io's simpler dead-man's-switch model, Cronitor adds tolerance/grace-period configuration to reduce alert fatigue, performance assertions (min/max duration), environment separation (staging vs production), and native platform integrations that auto-discover existing jobs. The API-first design supports programmatic monitor creation and management.

## Key quotations / statistics

- Three event types: "Run Event (job starts), Complete Event (completes successfully), Fail Event (job fails/exits with error code)"
- "Make your monitoring more flexible and reduce false alerts by configuring how forgiving Cronitor should be."
- Tolerance types: "Failure Tolerance (allow consecutive failures before alerting), Schedule Tolerance (allow missed scheduled runs before alerting), Grace Period (allow jobs to start late without triggering alerts), Alert Surge Protection (automatically pause alerts after consecutive notifications)"
- Performance assertions: "Monitor job duration and set performance thresholds to catch performance regressions"

## Three-event state machine

```bash
# 1. Signal job start
curl "https://cronitor.link/p/API_KEY/job-slug?state=run"

# 2. Signal successful completion
curl "https://cronitor.link/p/API_KEY/job-slug?state=complete"

# 3. Signal explicit failure
curl "https://cronitor.link/p/API_KEY/job-slug?state=fail"
```

## Programmatic monitor creation

```bash
curl -X PUT "https://cronitor.io/api/monitors" \
  -u API_KEY: \
  -H "Content-Type: application/json" \
  -d '{
    "key": "daily-backup",
    "type": "job",
    "schedule": "7 0 * * *",
    "timezone": "UTC",
    "failure_tolerance": 2,
    "schedule_tolerance": 1,
    "grace_seconds": 300,
    "assertions": [
      "metric.duration < 30 minutes",
      "metric.duration > 5 seconds"
    ],
    "notify": ["on-call-team"]
  }'
```

## Tolerance configuration to reduce false alerts

- **`failure_tolerance: 2`** - Only alert after 2 consecutive failures (useful for flaky network-dependent jobs)
- **`schedule_tolerance: 1`** - Allow 1 missed run before alerting (useful for GitHub Actions drift scenarios)
- **`grace_seconds: 300`** - Allow jobs to start up to 5 minutes late
- **`consecutive_alert_threshold: 10`** - Pause alerts after 10 consecutive notifications (prevents notification storms)

## Performance assertions

```bash
# Catch jobs that hang
"assertions": ["metric.duration < 30 minutes"]

# Catch jobs that exit too quickly (likely silent failure)
"assertions": ["metric.duration > 5 seconds"]
```

This is uniquely valuable: a job that exits in 50ms when it normally takes 10 minutes has likely failed silently without throwing an exception.

## Environment separation

```bash
# Production environment
curl "https://cronitor.link/p/API_KEY/job-name?state=complete&env=production"

# Staging environment (different data, shared monitor configuration)
curl "https://cronitor.link/p/API_KEY/job-name?state=complete&env=staging"

# Multi-region
curl "https://cronitor.link/p/API_KEY/job-name?state=complete&env=us-west-2"
```

## Comparison: Cronitor vs Healthchecks.io

| Feature | Healthchecks.io | Cronitor |
|---------|----------------|---------|
| Core model | Dead man's switch | 3-state machine (run/complete/fail) |
| Grace periods | Yes | Yes + tolerance configs |
| Performance assertions | No | Yes (min/max duration) |
| Environment separation | No | Yes |
| Auto-discovery | No | Yes (Linux, K8s, GitHub Actions, Airflow) |
| Self-hosting | Yes (open source) | No |
| Free tier | Yes (20 checks) | Yes (5 monitors) |
| Alert integrations | Email, Slack, PagerDuty, webhooks | Same + Teams, OpsGenie, Splunk On-Call |

## Annotations for stinger-forge

- Complements the Healthchecks.io source for `guides/05-observability-monitoring.md`
- The comparison table above should appear in the monitoring guide
- The "minimum duration assertion" pattern (jobs that exit too fast) is a unique value-add not available in Healthchecks.io
- The tolerance configuration pattern reduces alert fatigue, important when monitoring GitHub Actions (known for drift)
- Auto-discovery integrations (Linux, K8s, GitHub Actions) are worth a callout for teams with existing cron infrastructure
