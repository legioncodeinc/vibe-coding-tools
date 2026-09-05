# Vercel cron jobs: configuration, Hobby restrictions, accuracy, pricing

- URL: https://vercel.com/docs/cron-jobs ; https://vercel.com/docs/cron-jobs/usage-and-pricing ; https://vercel.com/docs/cron-jobs/manage-cron-jobs
- Fetched: 2026-08-14
- Source type: Official Vercel docs
- Component: Cron Jobs

## Content

### Setup

Cron jobs invoke Vercel Functions and are configured through `vercel.json` (the `crons` array) or the Build Output API's `crons` config. They do **not** support alternative cron expressions like `MON`, `SUN`, `JAN`, `DEC`. You cannot set both day-of-month and day-of-week simultaneously - one must be `*` when the other has a value. Timezone is always UTC.

### Plan limits

| Plan | Cron jobs per project | Minimum interval | Scheduling precision |
|---|---|---|---|
| Hobby | 100 | Once per day | Per-hour (±59 min) |
| Pro | 100 | Once per minute | Per-minute |
| Enterprise | 100 | Once per minute | Per-minute |

### Hobby-specific restrictions

1. **Daily execution cap**: expressions that would run more than once/day (e.g. `0 * * * *` hourly, `*/30 * * * *`) **fail at deployment time** with an explicit error, not silently.
2. **Timing precision**: Hobby cannot guarantee exact-minute firing - `0 1 * * *` may fire anywhere in the 1:00-1:59am window. Pro/Enterprise fire within the specified minute (e.g. `5 8 * * *` fires between 08:05:00 and 08:05:59).

Cron jobs are included on all plans (no separate product fee), but every invocation bills as a normal Function invocation/duration under standard Functions usage and pricing - there is no separate cron-specific rate.

### Lifecycle management

- **Update**: change the expression in `vercel.json` or the function's config, redeploy.
- **Delete**: remove the config entry, redeploy.
- **Disable**: dashboard toggle - disabled jobs still count toward the plan's cron-job limit.
- **Duration limit**: identical to standard Vercel Functions `maxDuration` limits (10s Hobby default/60s max, 15s Pro default/300s max, 900s Enterprise). If a job needs more time, split it into multiple cron-triggered units or pair cron with regular HTTP calls to distribute the workload - Vercel's own recommendation, not a workaround.
