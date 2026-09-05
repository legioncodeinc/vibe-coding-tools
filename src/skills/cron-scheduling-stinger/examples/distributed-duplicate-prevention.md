# Example: Distributed Duplicate Prevention

*Demonstrates: guides/02-distributed-cron-correctness.md*

---

## Scenario

A Node.js application runs on 3 replicas. Each replica registers the same cron job via `node-cron`. Without a leader lock, all 3 replicas fire the job concurrently every hour. We need exactly-once execution.

---

## Solution: Redis SETNX leader lock + idempotency key

```typescript
import { createClient } from "redis";
import cron from "node-cron";

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

const LOCK_KEY = "cron:hourly-report:lock";
const LOCK_TTL = 300; // 5 minutes — must exceed max job runtime

async function acquireLock(lockKey: string, ttlSeconds: number): Promise<string | null> {
  const token = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const result = await redis.set(lockKey, token, { NX: true, EX: ttlSeconds });
  return result === "OK" ? token : null;
}

async function releaseLock(lockKey: string, token: string): Promise<void> {
  // Atomic check-and-delete with Lua
  const luaScript = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;
  await redis.eval(luaScript, { keys: [lockKey], arguments: [token] });
}

async function runHourlyReport() {
  // Leader lock: only one replica proceeds
  const token = await acquireLock(LOCK_KEY, LOCK_TTL);
  if (!token) {
    console.log("Hourly report: another replica is running, skipping.");
    return;
  }

  try {
    // Idempotency key: safety net if two replicas raced past the lock
    const runId = `hourly-report-${new Date().toISOString().slice(0, 13)}`; // e.g. "2026-05-20T14"
    const alreadyRan = await db.query.jobRuns.findFirst({
      where: (r, { eq }) => eq(r.jobRunId, runId),
    });
    if (alreadyRan) {
      console.log(`Report for ${runId} already generated.`);
      return;
    }
    await db.insert(jobRuns).values({ jobRunId: runId, status: "running" }).onConflictDoNothing();

    // Do the work
    await generateHourlyReport();

    await db.update(jobRuns).set({ status: "completed", completedAt: new Date() })
      .where((r, { eq }) => eq(r.jobRunId, runId));

  } finally {
    await releaseLock(LOCK_KEY, token);
  }
}

// Schedule: every hour at :00
cron.schedule("0 * * * *", () => {
  runHourlyReport().catch((err) => console.error("Hourly report error:", err));
});
```

---

## Key patterns demonstrated

- `SETNX` with fencing token (prevents stale lock deletion by slow late-finishers)
- Lua atomic check-and-delete (avoids race between token check and delete)
- Idempotency key as a second safety layer
- TTL set to 5 minutes (conservative for a job expected to run in under 2 minutes)
- Error swallowing in the `cron.schedule` callback so one failed run doesn't crash the process

---

## For Postgres advisory lock variant

See `guides/02-distributed-cron-correctness.md` Pattern 1 for the `pg_try_advisory_lock` version, which requires no Redis infrastructure.
