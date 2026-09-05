---
source_url: https://vercel.com/docs/cron-jobs
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: vercel-cron
stinger: cron-scheduling-stinger
---

# Vercel Cron Jobs - Official Documentation

## Summary

Vercel supports cron jobs for Vercel Functions, configured via `vercel.json` or the Build Output API. Cron jobs trigger HTTP GET requests to a project's production deployment URL. The platform uses standard 5-field POSIX cron syntax, UTC timezone only. As of January 2026, all plans support 100 cron jobs per project; the key tier distinction is that Hobby plans are limited to once-per-day execution, while Pro and Enterprise support per-minute scheduling.

## Key quotations / statistics

- "Vercel supports cron jobs for Vercel Functions. Cron jobs can be added through `vercel.json` or the Build Output API."
- "The timezone is always UTC" (cron expression limitations section)
- "Cron jobs on Vercel do not support alternative expressions like `MON`, `SUN`, `JAN`, or `DEC`"
- "You cannot configure both day of the month and day of the week at the same time. When one has a value, the other must be `*`"
- "Vercel will not retry an invocation if a cron job fails."
- "Hobby users have two cron job restrictions. First, cron jobs can only run once per day. Second, Vercel may invoke these cron jobs at any point within the specified hour to help distribute load across all accounts."
- "For all other teams, cron jobs will be invoked within the minute specified."
- "Vercel's event-driven system can occasionally deliver the same cron event more than once."

## Plan limits (updated January 2026)

| Feature | Hobby | Pro | Enterprise |
|---------|-------|-----|------------|
| Cron jobs per project | 100 | 100 | 100 |
| Minimum interval | Once per day | Once per minute | Once per minute |
| Scheduling precision | Hourly window (may fire any time in the hour) | Per-minute window | Per-minute window |

Previously (before Jan 2026), Hobby had 2 cron jobs per team and Pro had 40. All caps were removed in a January 2026 update.

## vercel.json schema

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 5 * * *"
    }
  ]
}
```

## Security: CRON_SECRET

Vercel recommends adding a `CRON_SECRET` environment variable (random string, 16+ chars). Vercel sends it as `Authorization: Bearer <CRON_SECRET>` on every invocation. The handler should verify:

```ts
export function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  // ... job logic
}
```

## Concurrency and idempotency (critical section)

Vercel explicitly states:

> "If your cron job runs longer than the interval between invocations, Vercel can trigger a second instance while the first is still running. This can lead to race conditions, duplicate processing, or data corruption."

Recommended mitigations: Redis distributed locks, reducing execution time, setting `maxDuration`, or increasing the interval.

On idempotency: "Design your operations to be idempotent so they produce the same result even when executed multiple times. Use unique IDs to track which events you've already processed."

"Use both locks (to prevent concurrent runs) and idempotency (to handle duplicate events safely) together for the most reliable cron jobs."

## Other gotchas

- Cron jobs do NOT follow redirects (3xx response = job complete)
- No retry on failure; errors must be caught in logs
- Concurrency: no built-in lock; must implement via Redis or reduce execution time
- User agent on cron invocations: `vercel-cron/1.0`
- Rollback does NOT update cron jobs; they continue to run as before until manually disabled

## Annotations for stinger-forge

- This source is the authoritative foundation for `guides/01-platform-limits.md` (Vercel section)
- The idempotency section feeds directly into `guides/02-distributed-cron-correctness.md` and `examples/vercel-cron-happy-path.md`
- CRON_SECRET pattern belongs in a security callout in `guides/01-platform-limits.md`
- The "no retry" policy is critical: it means the job handler must absorb errors OR Healthchecks.io must detect the failure
- Contradicts naive assumption that "Hobby = free = cron works"; it is severely limited to 1/day
