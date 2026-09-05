---
source_url: https://dev.to/cronmonitor/handling-timezone-issues-in-cron-jobs-2025-guide-52ii
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: timezone-dst
stinger: cron-scheduling-stinger
---

# Cron Timezone and DST: Production Patterns (2025-2026)

## Summary

Cron jobs and DST are a notorious production incident source. The two critical failure modes are: (1) spring-forward skipping - a job scheduled during the skipped hour (e.g., 2:30 AM) never runs on the day clocks spring forward; and (2) fall-back doubling - a job scheduled during the repeated hour (e.g., 1:30 AM) runs twice on the day clocks fall back. The industry consensus is UTC-first scheduling with timezone logic pushed into application code. For jobs that genuinely require local-time semantics (e.g., "every weekday at 9:00 AM New York time"), use IANA timezone strings and validate the library's DST handling.

## Key quotations / statistics

- "Schedule all cron jobs in UTC and handle timezone logic in application code. This eliminates DST ambiguity entirely."
- "Spring Forward (2 AM → 3 AM): Jobs scheduled during the skipped hour never run."
- "Fall Back (2 AM → 1 AM): Jobs scheduled during the repeated hour execute twice."
- From go-cron library issue #349 (active bug 2025): "CronJob executes twice during DST fall back (duplicate execution for same wall-clock time)"
- ISC cron behavior: "For fall-back transitions, the scheduler detects duplicate wall-clock times and skips the second occurrence to prevent double execution, aligning with RFC 5545 standards."
- From cronjob.live DST Pitfalls docs: "Schedule jobs outside 1-3 AM windows, or use noon instead."

## The two DST failure modes in detail

### Spring Forward (clocks advance, e.g., 2 AM → 3 AM)

- Any cron expression matching 2:00-2:59 is SKIPPED entirely on spring-forward day
- Example: `30 2 * * *` (2:30 AM) does not fire on spring-forward day
- **GitHub Actions behavior:** Workflows advance to the next valid time (2:30 AM → 3:00 AM)
- **Standard cron behavior:** Job is simply missed
- Impact: daily backups, end-of-night reports, database maintenance windows

### Fall Back (clocks repeat, e.g., 2 AM → 1 AM → 2 AM)

- Any cron expression matching 1:00-1:59 fires TWICE on fall-back day
- Example: `30 1 * * *` (1:30 AM) fires once in EDT, then again in EST
- Impact: billing jobs, deduplication-sensitive workflows, financial aggregations

## Safe scheduling windows

- **Always safe:** Schedule between 3 AM and 11 PM in any timezone
- **Safest:** Noon UTC (midnight is problematic, as timezone conversions can push it into DST windows)
- **Avoid:** 1 AM-3 AM in any timezone that observes DST

## Storing timezone metadata

Never store just the cron expression:

```typescript
// Bad: ambiguous timezone
interface CronJob {
  schedule: string;   // "0 9 * * 1-5"
}

// Good: explicit timezone stored alongside
interface CronJob {
  schedule: string;    // "0 9 * * 1-5"
  timezone: string;    // "America/New_York" (IANA format)
  description: string; // "Weekdays at 9 AM Eastern"
}
```

## Idempotency as DST defense

Even with UTC scheduling, job infrastructure can deliver duplicate events (Vercel explicitly warns about this). Use unique constraints on `(job_type, scheduled_at_utc)` to prevent double-processing:

```sql
CREATE TABLE job_runs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type     TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  started_at   TIMESTAMPTZ,
  finished_at  TIMESTAMPTZ,
  status       TEXT DEFAULT 'pending',
  UNIQUE (job_type, scheduled_at)  -- prevents duplicate execution
);
```

## Testing across DST transitions

```typescript
// Simulate a DST transition in Node.js tests
import { schedule } from 'node-cron';

// Test spring-forward: create a fake Date for 2026-03-08 02:30 AM ET
const springForwardTime = new Date('2026-03-08T07:30:00Z'); // 2:30 AM ET = 7:30 UTC

// Test fall-back: create a fake Date for 2026-11-01 01:30 AM ET (first occurrence)
const fallBackTime1 = new Date('2026-11-01T05:30:00Z'); // 1:30 AM EDT = 5:30 UTC
// Second occurrence (after clock falls back)
const fallBackTime2 = new Date('2026-11-01T06:30:00Z'); // 1:30 AM EST = 6:30 UTC
```

## Library-specific DST behavior

| Library/Platform | Spring-forward behavior | Fall-back behavior |
|-----------------|------------------------|-------------------|
| Standard POSIX cron | Skips the job | Runs twice |
| GitHub Actions | Advances to next valid time | Not documented |
| node-cron | Depends on OS timezone | Depends on OS timezone |
| go-cron | Advances to next valid time (RFC 5545) | Skips duplicate |
| Vercel/Cloudflare | UTC only, no DST exposure | N/A (UTC) |
| BullMQ repeatable | Uses luxon for DST handling | Documented in changelog |

## Annotations for stinger-forge

- This is the primary source for `guides/03-timezone-dst-safety.md`
- The safe/unsafe scheduling windows table belongs as a callout box
- The idempotency defense (unique constraint on scheduled_at) ties into `guides/02-distributed-cron-correctness.md`
- Library comparison table belongs in `guides/03-timezone-dst-safety.md`
- Note the GitHub Actions behavior (advances on spring-forward) - this is the only platform that explicitly documents an RFC 5545-aligned fallback
