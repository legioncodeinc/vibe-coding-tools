# Guide 4: Cron jobs and background work

Grounded in `references/research/distilled-vercel.md` §5, `references/research/raw/vercel--cron-jobs--config-limits-pricing.md`.

## When to walk this guide

Scheduling a recurring task (cleanup, digest email, cache warm, data sync) on Vercel.

## Configuration

`vercel.json`:

```json
{
  "crons": [
    { "path": "/api/cron/cleanup", "schedule": "0 3 * * *" }
  ]
}
```

Each cron entry invokes a Vercel Function at the given path. No alternative cron syntax (`MON`, `JAN`, etc.) - numeric fields only. Timezone is always UTC - convert any "run at 9am local time" requirement to UTC before writing the schedule. Cannot set both day-of-month and day-of-week simultaneously; one must stay `*`.

## Plan limits - check before promising a schedule

| Plan | Min interval | Precision |
|---|---|---|
| Hobby | Once/day | ±59 min window |
| Pro | Once/minute | Exact minute |
| Enterprise | Once/minute | Exact minute |

On Hobby, a cron expression requesting more than once/day **fails at deploy time** with an explicit error - this is a hard block, not a silent downgrade. If a task needs sub-daily scheduling and the project is on Hobby, that's a plan-upgrade conversation, not a workaround to engineer around.

Hobby also can't guarantee exact-minute firing even for once-daily jobs - `0 1 * * *` may fire anywhere in the 1:00-1:59am window. Don't promise minute-precision timing on Hobby.

## Duration

Cron-invoked functions share the same `maxDuration` limits as regular Functions (10s/60s Hobby default/max, 15s/300s Pro, 15s/900s Enterprise). For work that might exceed this, split into multiple cron-triggered units, or have the cron job kick off work via a regular HTTP call that isn't bound by the cron invocation's own duration - this is Vercel's own recommended pattern, not an unofficial workaround.

## Pricing

No separate cron product fee on any plan. Every invocation bills as a standard Function invocation + duration under normal Functions usage - budget cron cost the same way you'd budget any other Function route.

## Lifecycle

- **Update**: change the schedule in `vercel.json`, redeploy.
- **Delete**: remove the entry, redeploy.
- **Disable**: dashboard toggle - still counts toward the plan's job-count limit while disabled.

## Common mistakes

- Writing a schedule in local time instead of UTC.
- Promising a Hobby-plan project sub-daily or minute-precise cron behavior.
- Letting a cron-triggered function run long enough to approach `maxDuration` instead of splitting the work.
