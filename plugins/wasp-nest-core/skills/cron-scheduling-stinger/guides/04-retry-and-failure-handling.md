# Guide 04: Retry and Failure Handling

*Research sources: `research/external/2026-05-20-distributed-cron-exactly-once-patterns.md`, `research/external/2026-05-20-vercel-cron-jobs-official-docs.md`*

---

## Platform retry behavior

Most cron platforms do NOT automatically retry failed jobs:

| Platform | Automatic retry | Notes |
|---|---|---|
| Vercel Cron | No | Job fails silently; no retry until next schedule |
| Cloudflare Cron Triggers | No | Same |
| GitHub Actions `schedule:` | No | Workflow run fails; no re-trigger |
| pg_cron | No | Job records an error in `cron.job_run_details`; does not retry |
| BullMQ repeatable | Yes (configurable) | Set `attempts` and `backoff` on the underlying job |

**BullMQ is the only platform with built-in retry support.** For all others, you must implement retry inside the handler or via an external queue.

---

## Idempotency first

**Before adding retry logic, verify the handler is idempotent.** Running a non-idempotent handler twice with the same inputs causes data corruption (duplicate records, double-charged payments, duplicate emails).

### Making a handler idempotent

```typescript
// Pattern: check-before-act with a unique constraint
async function sendDailyDigest(date: string) {
  // 1. Check if already sent for this date
  const alreadySent = await db.query.digestSends.findFirst({
    where: and(eq(digestSends.digestDate, date), eq(digestSends.status, "sent")),
  });
  if (alreadySent) {
    console.log(`Digest for ${date} already sent. Skipping.`);
    return;
  }

  // 2. Reserve the send slot atomically
  await db.insert(digestSends).values({ digestDate: date, status: "pending" })
    .onConflictDoNothing();

  // 3. Do the work
  await emailService.sendDigest(date);

  // 4. Mark complete
  await db.update(digestSends).set({ status: "sent", sentAt: new Date() })
    .where(eq(digestSends.digestDate, date));
}
```

---

## Retry pattern for platforms without built-in retry

For Vercel Cron, Cloudflare Workers, and GitHub Actions, implement retry inside the handler using exponential backoff with jitter:

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 1000,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === maxAttempts) break;
      const jitter = Math.random() * baseDelayMs;
      const delay = baseDelayMs * 2 ** (attempt - 1) + jitter;
      console.warn(`Attempt ${attempt} failed, retrying in ${Math.round(delay)}ms`, err);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

// Usage in a cron handler:
export async function GET(request: Request) {
  await withRetry(() => processNewSubscribers(), 3, 1000);
  return new Response("OK");
}
```

**Jitter is mandatory.** Without jitter, all retries across multiple replicas fire at the same time and create a thundering-herd against downstream services.

---

## Dead-letter / exhausted-retry handling

When all retries are exhausted, the job must produce an observable signal. Options:

### Option 1: Alert via Healthchecks.io (recommended)

Don't ping the heartbeat URL on failure. Healthchecks.io will detect the missed ping and alert. See `guides/05-observability-monitoring.md`.

### Option 2: Write to an error log table

```typescript
await db.insert(jobErrors).values({
  jobName: "daily-cleanup",
  scheduledAt: new Date(),
  error: err.message,
  stackTrace: err.stack,
});
```

Then alert on the error table with a separate monitoring query.

### Option 3: Push to a dead-letter queue

For BullMQ:

```typescript
const queue = new Queue("cron-jobs", {
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnFail: false,  // keep failed jobs for inspection
  },
});
```

Failed jobs accumulate in the `failed` set and can be retried manually or via a dead-letter consumer.

---

## Decoupling trigger from work (long-running jobs)

If a cron job's work exceeds the platform's execution limit, decouple the trigger from the execution:

```typescript
// Vercel Cron handler: just enqueue, return fast
export async function GET(request: Request) {
  // Validate CRON_SECRET
  // Enqueue the actual work
  await queue.add("heavy-report", { scheduledAt: new Date().toISOString() });
  return new Response("Queued", { status: 202 });
}
// The queue worker does the heavy lifting without a time limit
```

This pattern is mandatory on Vercel Hobby (10s limit) for any job that takes longer than a few seconds.

---

*Next: `guides/05-observability-monitoring.md`*
