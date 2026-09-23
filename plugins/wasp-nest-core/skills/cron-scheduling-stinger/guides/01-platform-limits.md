# Guide 01: Platform Limits

*Cited by: `examples/vercel-cron-happy-path.md`, `examples/github-actions-drift-mitigation.md`*
*Research sources: `research/external/2026-05-20-vercel-cron-jobs-official-docs.md`, `research/external/2026-05-20-cloudflare-cron-triggers-official-docs.md`, `research/external/2026-05-20-github-actions-schedule-event-docs.md`, `research/external/2026-05-20-github-actions-schedule-drift-community.md`*

---

## Vercel Cron

### Configuration (`vercel.json`)

```json
{
  "crons": [
    { "path": "/api/cron/daily-report", "schedule": "0 6 * * *" },
    { "path": "/api/cron/hourly-sync",  "schedule": "0 * * * *" }
  ]
}
```

Each entry invokes a Vercel Function (API route) via an authenticated GET request with an `Authorization: Bearer $CRON_SECRET` header.

### Plan-tier limits (as of January 2026)

| Limit | Hobby | Pro | Enterprise |
|---|---|---|---|
| Max cron jobs per project | 100 | 100 | 100 |
| Minimum frequency | Once per day | Once per hour | Once per minute |
| Max function duration | 10s | 60s (`maxDuration: 60`) | 300s |
| Retry on failure | **None** | **None** | **None** |

> **Critical:** Vercel does NOT retry failed cron invocations. You must implement retry logic inside the job handler or use an external queue to absorb failures. See `guides/04-retry-and-failure-handling.md`.

### Security: CRON_SECRET

Always validate the `CRON_SECRET` header before running any work:

```typescript
// app/api/cron/daily-report/route.ts
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  // ... job work ...
}
```

Set `CRON_SECRET` in Vercel's environment variables. Never skip this check: Vercel's cron endpoint is publicly addressable.

### Sub-hourly workaround for Hobby users

Vercel Hobby is limited to once-per-day minimum frequency. For sub-hourly requirements on a Hobby plan:

1. Use **Cloudflare Workers free tier** (1-minute minimum) to invoke a Vercel URL on a sub-hourly schedule.
2. Alternatively, upgrade to Vercel Pro (minimum: once per hour) or use pg_cron/BullMQ inside your own infrastructure.

---

## Cloudflare Workers Cron Triggers

### Configuration (`wrangler.toml`)

```toml
name = "my-worker"

[triggers]
crons = ["*/5 * * * *", "0 */2 * * *"]
```

Invokes the Worker's `scheduled()` handler:

```typescript
export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(doWork(env));
  },
};
```

### Limits

| Limit | Free | Workers Paid |
|---|---|---|
| Minimum interval | 1 minute | 1 minute |
| CPU time per invocation | 10 ms | 50 ms (standard), higher with Unbound/Workflows |
| Max cron triggers | 3 per Worker | Unlimited |
| Retry on failure | No built-in retry | No built-in retry |

> **Open question (from research):** For CPU-intensive scheduled work on the paid tier, Cloudflare Workflows (Durable Objects) provides much higher CPU limits but requires a different programming model. Verify your CPU budget against the Cloudflare limits page before committing.

### Using `ctx.waitUntil` correctly

The `scheduled()` handler must return quickly. Pass long-running work to `ctx.waitUntil()` so the Worker runtime keeps the isolate alive:

```typescript
ctx.waitUntil(heavyTask(env));
```

---

## GitHub Actions `schedule:`

### Configuration

```yaml
on:
  schedule:
    - cron: "0 6 * * 1-5"
  workflow_dispatch:   # ALWAYS add this — see examples/github-actions-drift-mitigation.md
```

### Limits and known issues (2026)

| Limit | Value |
|---|---|
| Minimum interval | 5 minutes |
| Timezone | UTC by default; IANA timezone support added early 2026 |
| Auto-disable | After 60 days of inactivity on public repos |
| Drift | Observed up to 22+ minutes under load; January 2026 incident documented |
| Reliability | **Not suitable for time-critical jobs** |

> **GitHub Actions `schedule:` is the least reliable platform cron option.** Use it only for best-effort tasks (report generation, stale-issue cleanup, cache warming). Always add a `workflow_dispatch:` trigger so the job can be manually retried, and pair with Healthchecks.io to detect missed runs. See `examples/github-actions-drift-mitigation.md`.

### IANA timezone support (early 2026)

```yaml
on:
  schedule:
    - cron: "0 9 * * 1-5"
      timezone: "America/New_York"
```

> **Open question (from research):** Fall-back DST handling (second occurrence of 1:30 AM) is undocumented for IANA-timezone schedules. Test explicitly against DST transitions before using timezone-aware GitHub Actions schedules for business-critical jobs.

---

## Database-native schedulers (alternatives section)

### pg_cron (PostgreSQL)

```sql
SELECT cron.schedule('nightly-cleanup', '0 2 * * *', $$DELETE FROM sessions WHERE expired_at < now()$$);
```

- Runs inside PostgreSQL: no external scheduler needed.
- Timezone: UTC by default; configure with `cron.timezone` GUC.
- Suitable for database maintenance tasks (vacuuming, archival, cleanup).
- Does not handle distributed deployments (pg_cron runs once per database instance).

### BullMQ repeatable jobs (Node.js / Redis)

```typescript
await queue.add("report", data, {
  repeat: { pattern: "0 6 * * *", tz: "America/Chicago" },
  jobId: "report-unique",  // prevents duplicate registration
});
```

- Redis-backed; survives application restarts.
- Timezone support via `tz` option.
- Deduplication by `jobId` prevents duplicate job registration on application restart.
- Minimum interval: determined by Redis poll interval (default 1s).

---

## Platform selection summary

| Need | Best choice |
|---|---|
| Next.js on Vercel, hourly or less | Vercel Cron |
| Next.js on Vercel, sub-hourly (Hobby) | Cloudflare Workers free tier |
| Cloudflare Workers-first stack | Cloudflare Cron Triggers |
| Best-effort GitHub repo maintenance | GitHub Actions `schedule:` |
| PostgreSQL-native database jobs | pg_cron |
| Node.js app with Redis | BullMQ repeatable |

---

*Next: `guides/02-distributed-cron-correctness.md`*
