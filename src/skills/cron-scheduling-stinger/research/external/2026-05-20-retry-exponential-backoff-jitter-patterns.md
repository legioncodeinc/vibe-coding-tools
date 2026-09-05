---
source_url: https://knowledgelib.io/software/patterns/retry-exponential-backoff/2026
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: retry-patterns
stinger: cron-scheduling-stinger
---

# Retry with Exponential Backoff and Jitter - Production Patterns for Cron Jobs

## Summary

Exponential backoff with jitter is the standard pattern for retrying failed cron job operations to prevent thundering herd problems. The pattern adds randomized jitter to prevent synchronized retry storms when multiple workers or instances fail at the same time. For cron jobs specifically, retry logic must be combined with idempotency checks to prevent duplicate side effects when the same job fires multiple times. The industry consensus is: max 3-5 attempts, base delay 10-30 seconds, cap at 60-300 seconds, full jitter strategy.

## Key quotations / statistics

- "Exponential backoff with jitter prevents thundering herd problems when multiple clients retry failed operations simultaneously."
- Formula for full jitter: `delay = random(0, min(cap, base * 2^attempt))` 
- "Only retry transient failures (5xx errors, 429 rate limits, network timeouts). Do NOT retry permanent 4xx errors (400, 401, 403, 404)."
- "NEVER retry non-idempotent operations without an idempotency key, as this causes duplicate writes and data corruption."
- From AWS guidelines: "Always set a maximum retry count (3-5 attempts) to prevent cascading failures and resource exhaustion."

## Jitter strategies comparison

| Strategy | Formula | Use case |
|----------|---------|---------|
| Full jitter (recommended) | `random(0, min(cap, base * 2^attempt))` | Most scenarios; very low thundering herd risk |
| Equal jitter | `exp/2 + random(0, exp/2)` | When minimum wait time matters |
| Decorrelated jitter (AWS-style) | `min(cap, random(base, prev * 3))` | Stateful clients tracking previous delay |
| No jitter | `min(cap, base * 2^attempt)` | Never use in distributed systems |

## Node.js implementation for cron job handlers

```typescript
interface RetryOptions {
  maxAttempts: number;  // Recommended: 3-5
  baseDelayMs: number;  // Recommended: 10_000 (10 seconds)
  maxDelayMs: number;   // Recommended: 300_000 (5 minutes)
  retryableErrors?: (err: Error) => boolean;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const { maxAttempts, baseDelayMs, maxDelayMs, retryableErrors } = options;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isLast = attempt === maxAttempts - 1;
      
      // Check if error is retryable
      if (retryableErrors && !retryableErrors(err as Error)) {
        throw err; // Non-retryable, fail immediately
      }
      
      if (isLast) {
        throw err; // Exhausted retries
      }
      
      // Full jitter backoff
      const exponentialDelay = baseDelayMs * Math.pow(2, attempt);
      const cappedDelay = Math.min(maxDelayMs, exponentialDelay);
      const jitteredDelay = Math.random() * cappedDelay;
      
      console.error(`[retry] attempt ${attempt + 1}/${maxAttempts} failed, retrying in ${Math.round(jitteredDelay)}ms`, err);
      await sleep(jitteredDelay);
    }
  }
  throw new Error('unreachable');
}

// Usage in a cron job handler
export async function GET(request: NextRequest) {
  await withRetry(
    () => sendWeeklyDigestEmails(),
    {
      maxAttempts: 3,
      baseDelayMs: 10_000,
      maxDelayMs: 60_000,
      retryableErrors: (err) => err.message.includes('ETIMEDOUT') || err.message.includes('503'),
    }
  );
  return Response.json({ success: true });
}
```

## Idempotent handler design (required before adding retries)

Before adding retry logic, the job handler must be idempotent. Key patterns:

```typescript
// Pattern 1: Upsert instead of insert
await db.execute(sql`
  INSERT INTO email_sends (user_id, campaign_id, sent_at)
  VALUES (${userId}, ${campaignId}, NOW())
  ON CONFLICT (user_id, campaign_id) DO NOTHING
`);

// Pattern 2: Check state before acting
const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
if (user.status === 'active') {
  return; // Already activated, skip
}
await db.update(users).set({ status: 'active' }).where(eq(users.id, userId));

// Pattern 3: Idempotency key on external API call
await stripe.invoices.pay(invoiceId, {
  idempotencyKey: `pay-invoice-${invoiceId}-${scheduledAt.toISOString()}`,
});
```

## Dead-letter handling

When retries are exhausted, route to a dead-letter channel for human review:

```typescript
async function runJobWithDLQ(jobId: string, fn: () => Promise<void>) {
  try {
    await withRetry(fn, { maxAttempts: 3, baseDelayMs: 10_000, maxDelayMs: 60_000 });
  } catch (err) {
    // Route to dead-letter queue / alerting
    await alerting.send({
      channel: '#cron-failures',
      message: `Cron job ${jobId} exhausted retries: ${String(err)}`,
      severity: 'high',
    });
    
    await db.execute(sql`
      INSERT INTO job_dead_letters (job_id, error, failed_at)
      VALUES (${jobId}, ${String(err)}, NOW())
    `);
  }
}
```

## Error classification for cron jobs

| Error type | Retry? | Rationale |
|-----------|--------|-----------|
| Network timeout (ETIMEDOUT) | Yes | Transient |
| HTTP 429 (rate limited) | Yes | Wait and retry |
| HTTP 5xx (server error) | Yes | Transient server error |
| HTTP 4xx (client error) | No | Configuration problem |
| Unique constraint violation | No | Idempotency key already used |
| Out of memory | No | Infrastructure issue |
| Database connection error | Yes | Transient |

## Annotations for stinger-forge

- Primary source for `guides/04-retry-and-failure-handling.md`
- The idempotent handler patterns must come BEFORE the retry implementation in the guide (per cron-scheduling-worker-bee's directive: "verify handler is idempotent before adding retry")
- The dead-letter + alerting pattern closes the loop with `guides/05-observability-monitoring.md`
- The error classification table is a stinger-forge addition based on synthesizing all sources
