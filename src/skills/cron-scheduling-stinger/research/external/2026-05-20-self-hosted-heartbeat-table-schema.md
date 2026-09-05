---
source_url: https://dev.to/cronmonitor/handling-timezone-issues-in-cron-jobs-2025-guide-52ii
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: monitoring-self-hosted
stinger: cron-scheduling-stinger
---

# Self-Hosted Cron Monitoring: Heartbeat Table Schema and Missed-Run Alerting

## Summary

For teams that cannot use external monitoring services (compliance, air-gap, cost constraints), a self-hosted heartbeat table in Postgres provides the core "did the cron run?" observability loop. The pattern stores execution records with start/end timestamps and a status enum, then uses a lightweight alerting query or scheduled check to detect missing runs. This source synthesizes patterns from practitioner blogs, database design discussions, and the Healthchecks.io approach, adapted for a self-hosted Postgres stack.

## Key quotations / statistics

- Industry pattern: "Store execution timestamps in UTC for debugging. Never store just the cron expression; include timezone information."
- From Cronitor docs: "A job that exits in 50ms when it normally takes 10 minutes has likely failed silently without throwing an exception."
- Common oversight: "Many teams only alert on job errors, not on missing jobs - a cron that silently stops running causes the same damage as one that fails."

## Canonical heartbeat table schema

```sql
-- Core job registry (one row per scheduled job)
CREATE TABLE scheduled_jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL UNIQUE,
  description     TEXT,
  cron_expression TEXT NOT NULL,          -- e.g., "0 2 * * *"
  timezone        TEXT NOT NULL DEFAULT 'UTC',  -- IANA timezone
  expected_duration_seconds INT,          -- For "exits too fast" detection
  max_duration_seconds      INT,          -- For "hung job" detection
  enabled         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Execution run history (one row per execution attempt)
CREATE TABLE job_runs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name        TEXT NOT NULL REFERENCES scheduled_jobs(name),
  scheduled_at    TIMESTAMPTZ NOT NULL,    -- When it was supposed to fire (UTC)
  started_at      TIMESTAMPTZ,            -- When it actually started
  finished_at     TIMESTAMPTZ,            -- When it completed/failed
  status          TEXT NOT NULL DEFAULT 'pending',  -- pending|running|success|failed|timed_out
  exit_code       INT,
  error_message   TEXT,
  duration_ms     INT GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (finished_at - started_at)) * 1000
  ) STORED,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  
  -- Idempotency: prevent double-recording the same scheduled execution
  UNIQUE (job_name, scheduled_at)
);

CREATE INDEX job_runs_job_name_started_at ON job_runs (job_name, started_at DESC);
CREATE INDEX job_runs_status ON job_runs (status) WHERE status IN ('running', 'pending');
```

## Inserting a run record (Node.js / Drizzle pattern)

```typescript
// At job start
const scheduledAt = getExpectedFireTime(); // The cron's scheduled time, not Date.now()

const [run] = await db.insert(jobRuns).values({
  jobName: 'daily-email-digest',
  scheduledAt,
  startedAt: new Date(),
  status: 'running',
}).onConflictDoNothing().returning();

if (!run) {
  // Already started (duplicate invocation) - skip
  return;
}

// At job completion
await db.update(jobRuns)
  .set({ status: 'success', finishedAt: new Date() })
  .where(eq(jobRuns.id, run.id));
```

## Missed-run detection query

```sql
-- Detect jobs that should have run but didn't (check on a schedule, e.g., every 5 minutes)
-- This query finds jobs where the last successful run is more than 1 period ago
WITH job_last_run AS (
  SELECT
    sj.name,
    sj.cron_expression,
    MAX(jr.scheduled_at) AS last_successful_run
  FROM scheduled_jobs sj
  LEFT JOIN job_runs jr ON jr.job_name = sj.name AND jr.status = 'success'
  WHERE sj.enabled = TRUE
  GROUP BY sj.name, sj.cron_expression
),
expected_next AS (
  SELECT
    name,
    last_successful_run,
    -- Calculate expected interval using cron expression
    -- (Simplified: assumes no more than 2x the expected period has elapsed)
    CASE
      WHEN last_successful_run IS NULL THEN TRUE  -- Never ran
      WHEN NOW() - last_successful_run > INTERVAL '25 hours' THEN TRUE  -- Daily job missed
      ELSE FALSE
    END AS is_missing
  FROM job_last_run
)
SELECT * FROM expected_next WHERE is_missing = TRUE;
```

## SLO for missed-run alerting

Industry recommendation: alert within one schedule period:
- **Daily jobs:** alert if no success within 25 hours (5% buffer for execution delay)
- **Hourly jobs:** alert if no success within 65 minutes
- **Every 5 minutes:** alert if no success within 7 minutes
- **Business-critical:** alert immediately (zero tolerance); requires end-to-end heartbeat with Healthchecks.io or Cronitor

## Run-history retention

```sql
-- Prune runs older than 90 days (recommended retention for audit)
DELETE FROM job_runs
WHERE created_at < NOW() - INTERVAL '90 days'
  AND status IN ('success');  -- Keep failed runs longer for forensics
```

## Annotations for stinger-forge

- Primary source for `guides/05-observability-monitoring.md` self-hosted section
- The schema above should be included verbatim in the guide (it's the canonical heartbeat table shape)
- The SLO table (1 schedule period + 5-10% buffer) is a rule of thumb to encode in the guide
- The `UNIQUE (job_name, scheduled_at)` constraint ties into the idempotency pattern from `guides/02-distributed-cron-correctness.md`
- Missed-run query is a starting point; teams should adapt for their specific cron expression parsing library
