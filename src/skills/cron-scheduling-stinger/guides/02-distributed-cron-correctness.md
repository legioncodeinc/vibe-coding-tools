# Guide 02: Distributed Cron Correctness

*Cited by: `examples/distributed-duplicate-prevention.md`*
*Research sources: `research/external/2026-05-20-distributed-cron-exactly-once-patterns.md`*

---

## The problem: split-brain scheduling

When your application runs on more than one replica, container, or region, every instance may independently fire the same cron job at the same scheduled time. The result is **split-brain scheduling**: the same job runs N times concurrently, once per replica.

This is not hypothetical. It happens in:

- Vercel Functions with multiple edge regions (each region can invoke the cron endpoint independently if DNS or load balancer routes to multiple regions)
- Docker Compose / Kubernetes with multiple replicas of a worker process
- Any Node.js app where you register a `setInterval`/cron library in `main()` and scale horizontally

**Ask the user about their deployment topology first.** A single-container deployment and a 3-region active-active cluster need different solutions.

---

## Pattern 1: Postgres advisory lock (recommended for Postgres-backed apps)

No additional infrastructure needed. Uses PostgreSQL's session-level advisory locks.

```typescript
import { db } from "@/lib/db"; // your Drizzle or Prisma client

export async function runWithAdvisoryLock(jobKey: number, fn: () => Promise<void>) {
  const result = await db.execute(
    sql`SELECT pg_try_advisory_lock(${jobKey}) AS acquired`
  );
  const acquired = result.rows[0]?.acquired;
  if (!acquired) {
    console.log(`Job ${jobKey}: another instance holds the lock, skipping.`);
    return;
  }
  try {
    await fn();
  } finally {
    await db.execute(sql`SELECT pg_advisory_unlock(${jobKey})`);
  }
}

// Usage in a Vercel Cron API route:
export async function GET(request: Request) {
  await runWithAdvisoryLock(42001, async () => {
    await cleanupExpiredSessions();
  });
}
```

**Lock key convention:** use a stable integer derived from the job name (e.g., `crc32("daily-cleanup")`). Document the mapping in your codebase.

**Warning:** Advisory locks are session-scoped. If you use a connection pooler (PgBouncer in transaction mode), advisory locks will not work correctly: the lock is released when the connection returns to the pool. Use Prisma's `$executeRaw` directly against Postgres (not via PgBouncer) for advisory lock calls, or switch to the Redis pattern below.

---

## Pattern 2: Redis SETNX leader lock (recommended for multi-region)

Requires Redis (Upstash, Redis Cloud, self-hosted). The lock TTL must exceed the maximum expected job runtime.

```typescript
import { redis } from "@/lib/redis"; // ioredis or Upstash Redis client

const LOCK_TTL_SECONDS = 300; // 5 minutes — must exceed max job runtime

export async function runWithRedisLock(lockKey: string, fn: () => Promise<void>) {
  const fencingToken = `${Date.now()}-${Math.random()}`;
  const acquired = await redis.set(lockKey, fencingToken, "NX", "EX", LOCK_TTL_SECONDS);
  if (!acquired) {
    console.log(`Lock ${lockKey}: already held by another instance, skipping.`);
    return;
  }
  try {
    await fn();
  } finally {
    // Only release if we still hold the lock (fencing token check)
    const luaScript = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    await redis.eval(luaScript, 1, lockKey, fencingToken);
  }
}
```

**Critical: always use a fencing token.** The release script uses Lua atomicity to verify the token before deleting, preventing a late-finishing instance from releasing a lock it no longer holds.

**Lock TTL rule:** `TTL > (max_job_runtime * 1.5)`. If the job can run for 2 minutes, set TTL to 3+ minutes. If the job exceeds its TTL, the lock expires and another instance may run concurrently; this is a safety valve, not normal behavior. Alert if jobs approach TTL.

---

## Pattern 3: Idempotency keys (platform-level safety net)

Leader election prevents concurrent execution. Idempotency keys make concurrent execution safe even if prevention fails. Use both together for maximum correctness.

```typescript
// In the job handler, before doing any work:
const jobRunId = `daily-cleanup-${formatDate(new Date(), "yyyy-MM-dd")}`;

const existing = await db.query.jobRuns.findFirst({
  where: eq(jobRuns.jobRunId, jobRunId),
});
if (existing) {
  console.log(`Job ${jobRunId} already ran (status: ${existing.status}), skipping.`);
  return;
}

// Insert a "started" record atomically
await db.insert(jobRuns).values({ jobRunId, status: "running", startedAt: new Date() })
  .onConflictDoNothing(); // second instance hits this, gets 0 rows inserted, should also skip

// ... do work ...

await db.update(jobRuns).set({ status: "completed", completedAt: new Date() })
  .where(eq(jobRuns.jobRunId, jobRunId));
```

**Table schema:**

```sql
CREATE TABLE job_runs (
  job_run_id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'running',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  error TEXT
);
```

This table also serves as the run-history log for observability. See `guides/05-observability-monitoring.md`.

---

## Choosing the right pattern

| Situation | Recommended pattern |
|---|---|
| Single-region, Postgres available, no PgBouncer in transaction mode | Postgres advisory lock |
| Multi-region, Redis available | Redis SETNX with fencing token |
| At-least-once platform (Vercel, GitHub Actions) with no Redis | Idempotency key table only |
| Maximum correctness (business-critical) | Redis lock + idempotency key |

---

## At-most-once vs at-least-once

| Guarantee | Pattern | Risk |
|---|---|---|
| At-most-once | Leader lock | A job may be skipped if the leader crashes mid-run |
| At-least-once | Retry + idempotency | A job may run twice; idempotency prevents double-effects |
| Exactly-once | Leader lock + idempotency key | Correct model for critical jobs |

**Vercel and GitHub Actions are at-most-once platforms** (no retry on failure). If a job fails, it does not run again until the next scheduled time. For critical jobs on these platforms, use an external retry mechanism (a queue, or a Healthchecks.io alert that triggers a manual re-run).

---

*Next: `guides/03-timezone-dst-safety.md`*
