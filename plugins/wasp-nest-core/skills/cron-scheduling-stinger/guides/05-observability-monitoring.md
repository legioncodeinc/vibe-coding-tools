# Guide 05: Observability and Monitoring

*Cited by: `examples/vercel-cron-happy-path.md`, `examples/github-actions-drift-mitigation.md`*
*Research sources: `research/external/2026-05-20-healthchecks-io-official-docs.md`, `research/external/2026-05-20-cronitor-monitoring-docs.md`, `research/external/2026-05-20-self-hosted-heartbeat-table.md`*

---

## The critical directive

**Heartbeat monitoring is mandatory for business-critical cron jobs.** A job that silently fails is worse than a job that doesn't run at all. Silent failures accumulate unreported until a downstream system breaks.

Alert on **missed runs**, not just on errors. An error inside the handler is recoverable; a missed run means the job never started.

---

## Healthchecks.io (recommended)

Healthchecks.io uses the **dead man's switch** model: your job pings a URL on success; if the ping doesn't arrive within the expected period plus a grace time, Healthchecks.io alerts you.

### Quick setup

1. Create a check at https://healthchecks.io with:
   - **Schedule:** matches your cron expression
   - **Grace time:** 10-30 minutes (buffer for execution delay)
   - **Alert channels:** email, Slack, PagerDuty

2. Copy the ping URL: `https://hc-ping.com/<uuid>`

3. Integrate into your job:

```typescript
const HEALTHCHECK_URL = process.env.HEALTHCHECK_URL!;

export async function GET(request: Request) {
  // Signal job start (optional but recommended for duration tracking)
  await fetch(`${HEALTHCHECK_URL}/start`).catch(() => {}); // non-blocking

  try {
    await doJobWork();
    // Signal success
    await fetch(HEALTHCHECK_URL).catch(() => {}); // non-blocking
  } catch (err) {
    // Signal failure
    await fetch(`${HEALTHCHECK_URL}/fail`).catch(() => {}); // non-blocking
    throw err;
  }
}
```

The `.catch(() => {})` prevents a Healthchecks.io network failure from breaking your job. The monitoring ping is fire-and-forget.

### Start + success + fail signals

| Signal | URL | Meaning |
|---|---|---|
| Start | `https://hc-ping.com/<uuid>/start` | Job begun; clock starts for duration measurement |
| Success | `https://hc-ping.com/<uuid>` | Job completed successfully |
| Fail | `https://hc-ping.com/<uuid>/fail` | Job failed explicitly |
| Missed | (no ping within period + grace) | Healthchecks.io triggers alert automatically |

### Free tier limits

Healthchecks.io free tier: **20 checks**. For teams with more than 20 scheduled jobs, either:
- Self-host Healthchecks.io (open source, Docker-based)
- Upgrade to the paid tier
- Use Cronitor (different pricing model: 5 monitors free, then per-monitor pricing)

---

## Cronitor

Cronitor provides monitoring plus a **cron expression editor** and **run history dashboard**.

### Integration

```typescript
import Cronitor from "@cronitorio/cronitor-node";

const cronitor = new Cronitor(process.env.CRONITOR_API_KEY!);

async function monitoredJob(jobKey: string, fn: () => Promise<void>) {
  const monitor = cronitor.wrap(jobKey, fn);
  await monitor();
}

// Usage
await monitoredJob("daily-cleanup", async () => {
  await cleanupExpiredSessions();
});
```

The SDK automatically sends start/complete/fail telemetry.

### Free tier: 5 monitors. Paid: per-monitor pricing. Better for teams wanting a visual dashboard over raw alerting.

---

## Self-hosted heartbeat table

For air-gapped environments or teams that don't want external dependencies, a heartbeat table provides run history and missed-run detection.

### Schema

```sql
CREATE TABLE cron_heartbeats (
  id BIGSERIAL PRIMARY KEY,
  job_name TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  error_message TEXT,
  duration_ms INTEGER GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (completed_at - started_at)) * 1000
  ) STORED
);

CREATE UNIQUE INDEX cron_heartbeats_job_scheduled_ux
  ON cron_heartbeats (job_name, scheduled_at);
```

The unique index on `(job_name, scheduled_at)` also serves as the idempotency key: the second invocation in a distributed scenario hits the constraint and aborts.

### Missed-run detection query

```sql
-- Jobs that should have run in the last 2 hours but haven't
SELECT
  job_name,
  scheduled_at,
  status
FROM cron_heartbeats
WHERE
  scheduled_at BETWEEN now() - INTERVAL '2 hours' AND now()
  AND status = 'running'
  AND started_at < now() - INTERVAL '30 minutes';
```

Run this query from a monitoring cron job (or a PostgreSQL pg_cron schedule) to generate alerts.

---

## Alerting SLO

Define a missed-run SLO per job:

| Job criticality | Alert within |
|---|---|
| Business-critical (billing, notifications) | 1x schedule period |
| High priority (daily reports) | 2x schedule period |
| Best-effort (cache warming) | 4x schedule period |

Configure Healthchecks.io grace time = (alert period - schedule period).

---

## What to include in every monitoring setup

For every business-critical scheduled job:

1. A Healthchecks.io (or Cronitor) check configured to the job's schedule with a grace period.
2. `/start` ping at the beginning of the handler.
3. Success ping on completion; `/fail` ping on exception.
4. A row in the `cron_heartbeats` table (if using self-hosted) or equivalent.
5. An alert channel (email minimum; Slack or PagerDuty for critical jobs).

---

*Next: `guides/06-audit-and-inventory.md`*
