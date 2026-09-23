# Guide 03: Timezone and DST Safety

*Research sources: `research/external/2026-05-20-cron-timezone-dst-production-patterns.md`*

---

## The UTC-first rule

**All cron schedules should be expressed in UTC unless the user explicitly requires local-time semantics.**

Local-time semantics are needed when the job's meaning is tied to a business day or a human time (e.g., "send morning digest at 8 AM for users in New York"). In that case, use the IANA timezone explicitly and acknowledge the DST risk.

UTC avoids all DST complications. When in doubt, ask: "Does this job need to fire at a specific wall-clock time for a specific timezone, or is 'every 24 hours' good enough?" The latter is safe as UTC.

---

## The two DST failure modes

### Spring-forward: the skipped job

When clocks move forward 1 hour (e.g., `2:00 AM → 3:00 AM`), any cron expression that would have fired during the skipped hour simply does not fire.

**Example:** `30 2 * * *` (2:30 AM) in `America/New_York` does not fire on spring-forward night. The clock jumps from 1:59 to 3:00 and 2:30 never exists.

**Platform behavior:** GitHub Actions (with the new IANA timezone support) advances to the next valid occurrence per RFC 5545. Other platforms vary.

### Fall-back: the doubled job

When clocks move back 1 hour (e.g., `2:00 AM → 1:00 AM`), there are two 1:30 AM instants. A cron job at `30 1 * * *` may fire twice.

**Platform behavior:** Undocumented for most platforms including GitHub Actions. Treat as a risk unless tested explicitly.

---

## Defense patterns

### 1. UTC-first (eliminates the problem entirely)

```
# This fires at 07:00 UTC every day — no DST risk
0 7 * * *
```

If users are in New York (UTC-5 / UTC-4 DST), this fires at 2 AM or 3 AM depending on DST. If that variation is acceptable (a background cleanup, not a "morning report"), UTC is the right choice.

### 2. UTC offset with known DST range (manual)

If you know the timezone and want consistent local-time behavior, schedule two jobs: one for standard time offset and one for DST offset, with date-range guards in the handler logic. Cumbersome but portable.

### 3. IANA timezone (platform-native, where supported)

```yaml
# GitHub Actions (early 2026)
on:
  schedule:
    - cron: "0 8 * * 1-5"
      timezone: "America/New_York"
```

```typescript
// BullMQ
await queue.add("morning-digest", {}, {
  repeat: { pattern: "0 8 * * 1-5", tz: "America/New_York" },
});
```

> **Open question:** GitHub Actions `schedule:` + IANA timezone fall-back handling (second 1:30 AM occurrence) is undocumented. Test explicitly against DST transitions: simulate by setting the host clock to 1:59 AM the night of fall-back.

### 4. Idempotency key with scheduled_date (prevents double-firing on fall-back)

```typescript
// Use calendar date, not exact timestamp, as the idempotency scope
const jobRunId = `morning-digest-${formatDate(new Date(), "yyyy-MM-dd", { timeZone: "America/New_York" })}`;
```

A unique constraint on `job_run_id` in the `job_runs` table prevents the second fall-back invocation from running. See `guides/02-distributed-cron-correctness.md` for the full idempotency-key pattern.

---

## Testing DST transitions

### Unit testing (timezone simulation)

Use `@date-fns/tz` or `luxon` to compute next-fire times across DST boundaries:

```typescript
import { getNextCronExpressionDate } from "cron-parser";
import { zonedTimeToUtc } from "@date-fns/tz";

// Test spring-forward: last fire = 1:59 AM, next should be 3:00 AM or later
const springForwardDate = new Date("2026-03-08T06:59:00.000Z"); // 1:59 AM ET
const next = cronParser.parseExpression("30 2 * * *", {
  currentDate: springForwardDate,
  tz: "America/New_York",
}).next().toDate();

// Assert: next is NOT 2:30 AM (that doesn't exist), it is 2:30 AM the next day
```

### Integration testing

For platform-level DST testing, set the environment `TZ=America/New_York` and advance the system clock using `libfaketime` (Linux) or `date -s` in CI. Run the scheduler through the transition and verify single execution.

---

## Timezone summary table

| Platform | Timezone support | DST handling |
|---|---|---|
| Vercel Cron | UTC only | N/A |
| Cloudflare Cron Triggers | UTC only | N/A |
| GitHub Actions `schedule:` | UTC default; IANA timezone added early 2026 | Spring-forward: advance to next; Fall-back: undocumented |
| pg_cron | UTC default; configurable via `cron.timezone` GUC | Follows Postgres IANA database |
| BullMQ repeatable | IANA via `tz` option | Handled by `node-cron` / `cron-parser`; fall-back behavior: run once (configurable) |

---

*Next: `guides/04-retry-and-failure-handling.md`*
