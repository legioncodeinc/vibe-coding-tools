---
source_url: https://ttb.software/2026/04/26/rails-postgres-advisory-locks-cron-overlap-race-conditions/
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: distributed-cron
stinger: cron-scheduling-stinger
---

# Distributed Cron: Exactly-Once Execution Patterns (Redis SETNX, Postgres Advisory Locks)

## Summary

This source (and corroborating material from DEV Community and OneUptime) covers the three primary patterns for preventing duplicate cron execution across distributed deployments: Postgres advisory locks, Redis SETNX distributed locks, and idempotency keys at the worker level. The key conceptual distinction is "at-most-once" (skip duplicates, acceptable to miss) vs "at-least-once" (retry guaranteed, handler must be idempotent) vs "effectively-once" (at-least-once with idempotency keys preventing duplicate side effects).

## Key quotations / statistics

- From Rails/Postgres advisory locks article (April 2026): "Advisory locks are a clean solution for preventing duplicate cron execution across distributed systems. They work by acquiring a named lock on a 64-bit integer that coordinates across all database connections."
- "Advisory locks don't depend on existing database records and are cheap compared to row-level locks."
- From Kaal framework README: "Distributed cron orchestration for Ruby that guarantees exactly-once job execution across clusters using pluggable coordination backends: Redis, PostgreSQL advisory locks, MySQL named locks, SQLite, and in-memory engines."
- From DEV Community: "The fundamental principle: trade liveness (acceptable to skip a launch) for safety (never duplicate work)."
- From OneUptime (Redis scheduler, March 2026): "Redis Sorted Sets provide exactly-once dispatch. Tasks are stored in sorted sets scored by Unix timestamp. Atomic `ZPOPMIN` ensures only one worker claims each task across concurrent workers."

## Pattern 1: Postgres Advisory Locks

Best for: teams already using Postgres, where the job scheduler and DB share a connection pool.

```sql
-- Acquire a session-level advisory lock
-- Lock ID derived from job name (hash to 64-bit int)
SELECT pg_advisory_lock(hashtext('daily-email-digest'));

-- ... run job ...

-- Release (or let session end release it)
SELECT pg_advisory_unlock(hashtext('daily-email-digest'));
```

```typescript
// Node.js / Drizzle / Prisma equivalent
async function runWithAdvisoryLock(jobName: string, fn: () => Promise<void>) {
  const lockId = jobNameToInt64(jobName); // hash to bigint
  await db.execute(sql`SELECT pg_try_advisory_lock(${lockId})`);
  // pg_try_advisory_lock returns false if lock already held
  const [{ pg_try_advisory_lock: acquired }] = await db.execute(...);
  if (!acquired) {
    console.log(`[${jobName}] Lock not acquired - another instance is running`);
    return;
  }
  try {
    await fn();
  } finally {
    await db.execute(sql`SELECT pg_advisory_unlock(${lockId})`);
  }
}
```

**Warning:** Session-level advisory locks require careful handling with connection poolers like PgBouncer in transaction-pooling mode (the lock is released when the connection returns to the pool, not when the transaction ends). Use `pg_try_advisory_xact_lock` (transaction-scoped) when using PgBouncer.

## Pattern 2: Redis SETNX Distributed Lock

Best for: teams with Redis/Valkey available, multi-region deployments.

```typescript
// Redis SETNX (SET if Not eXists) pattern with TTL
async function runWithRedisLock(
  redis: Redis,
  jobName: string,
  ttlSeconds: number,
  fn: () => Promise<void>
) {
  const lockKey = `cron:lock:${jobName}`;
  const lockValue = crypto.randomUUID(); // fencing token
  
  // SET key value NX EX ttl (atomic - only sets if key doesn't exist)
  const acquired = await redis.set(lockKey, lockValue, 'NX', 'EX', ttlSeconds);
  
  if (!acquired) {
    console.log(`[${jobName}] Lock held by another instance, skipping`);
    return;
  }
  
  try {
    await fn();
  } finally {
    // Lua script for atomic check-and-delete (prevent releasing another instance's lock)
    await redis.eval(
      `if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end`,
      1, lockKey, lockValue
    );
  }
}
```

**Key insight:** The TTL on the Redis lock must be longer than the job's maximum execution time. If the job runs longer than the TTL, the lock expires and another instance can start. Set TTL to `max_expected_runtime * 1.5` as a safe buffer.

## Pattern 3: Idempotency Keys (for at-least-once systems)

When using queues or platforms that guarantee at-least-once delivery (the job WILL run, possibly more than once), make the handler idempotent:

```typescript
// Idempotency key = job_type + schedule_period
async function processWithIdempotency(jobType: string, scheduledAt: Date) {
  const idempotencyKey = `${jobType}:${Math.floor(scheduledAt.getTime() / 60000)}`; // Per-minute granularity
  
  // Upsert execution record; unique constraint prevents duplicate processing
  const { rowCount } = await db.execute(sql`
    INSERT INTO job_executions (idempotency_key, job_type, started_at, status)
    VALUES (${idempotencyKey}, ${jobType}, NOW(), 'running')
    ON CONFLICT (idempotency_key) DO NOTHING
    RETURNING id
  `);
  
  if (rowCount === 0) {
    console.log(`[${jobType}] Already executed for this period, skipping`);
    return;
  }
  
  try {
    await runActualJob();
    await db.execute(sql`
      UPDATE job_executions SET status = 'complete', finished_at = NOW()
      WHERE idempotency_key = ${idempotencyKey}
    `);
  } catch (err) {
    await db.execute(sql`
      UPDATE job_executions SET status = 'failed', error = ${String(err)}, finished_at = NOW()
      WHERE idempotency_key = ${idempotencyKey}
    `);
    throw err;
  }
}
```

## Choosing the right pattern

| Scenario | Recommended pattern |
|----------|---------------------|
| Single DB (Postgres), no Redis | Postgres advisory lock |
| Redis/Valkey available, multi-region | Redis SETNX lock |
| Platform guarantees at-least-once (SQS, BullMQ, etc.) | Idempotency keys |
| Need audit trail of every execution | Idempotency keys + job_executions table |
| Maximum safety: both patterns combined | Redis lock (prevent concurrency) + idempotency key (handle duplicates) |

## Annotations for stinger-forge

- This is the primary source for `guides/02-distributed-cron-correctness.md`
- The Redis SETNX pattern belongs in `examples/distributed-duplicate-prevention.md`
- The PgBouncer warning about session-level vs transaction-level advisory locks is critical for Postgres users
- Mention the Kaal framework (https://github.com/code-vedas/kaal) as a plug-and-play Ruby solution that handles all backends
- The combination recommendation ("use both locks AND idempotency") matches Vercel's own recommendation in their cron docs
