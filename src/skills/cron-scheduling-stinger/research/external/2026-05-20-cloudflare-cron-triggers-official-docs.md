---
source_url: https://developers.cloudflare.com/workers/configuration/cron-triggers/
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: cloudflare-cron
stinger: cron-scheduling-stinger
---

# Cloudflare Workers Cron Triggers - Official Documentation

## Summary

Cloudflare Cron Triggers map cron expressions to Workers via a `scheduled()` handler. They run on UTC time on underutilized machines across Cloudflare's global network. The `wrangler.toml` or `wrangler.jsonc` configuration is the canonical way to manage triggers. Cloudflare supports Quartz scheduler-like cron extensions (L, W, # characters for last, weekday, and nth-weekday syntax). Changes to Cron Triggers can take up to 15 minutes to propagate.

## Key quotations / statistics

- "Cron Triggers execute on UTC time."
- "Cron Triggers can also be combined with Workflows to trigger multi-step, long-running tasks."
- "Changes such as adding a new Cron Trigger, updating an old Cron Trigger, or deleting a Cron Trigger may take several minutes (up to 15 minutes) to propagate to the Cloudflare global network."
- "Workers scheduled by Cron Triggers will run on underutilized machines to make the best use of Cloudflare's capacity and route traffic efficiently."
- Cron Events: "stores the 100 most recent invocations of the Cron scheduled event."
- "It can take up to 30 minutes before events are displayed in Past Cron Events when creating a new Worker or changing a Worker's name."

## wrangler.toml configuration format

```toml
[triggers]
crons = [ "*/3 * * * *", "0 15 1 * *", "59 23 LW * *" ]
```

Or in `wrangler.jsonc`:

```jsonc
{
  "triggers": {
    "crons": [
      "*/3 * * * *",      // At every 3rd minute
      "0 15 1 * *",       // At 15:00 (UTC) on first day of the month
      "59 23 LW * *"      // At 23:59 (UTC) on the last weekday of the month
    ]
  }
}
```

Per-environment configuration is also supported:

```toml
[env.dev.triggers]
crons = [ "0 * * * *" ]
```

## Supported cron expression fields and special characters

| Field | Values | Special Characters |
|-------|--------|-------------------|
| Minute | 0-59 | `* , - /` |
| Hours | 0-23 | `* , - /` |
| Days of Month | 1-31 | `* , - / L W` |
| Months | 1-12 or JAN-DEC (case-insensitive) | `* , - /` |
| Weekdays | 1-7 (1=Sunday) or SUN-SAT (case-insensitive) | `* , - / L #` |

**Important:** Weekdays use 1=Sunday convention, unlike POSIX (0=Sunday). Use 3-letter abbreviations to avoid ambiguity.

## Scheduled handler implementation

```typescript
export default {
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    // Job logic here
    // controller.scheduledTime contains the scheduled fire time
    // controller.cron contains the matched cron expression
    ctx.waitUntil(someAsyncOperation());
  }
};
```

## Local testing

```bash
# Trigger the scheduled handler locally
curl "http://localhost:8787/cdn-cgi/handler/scheduled"

# With a specific cron pattern
curl "http://localhost:8787/cdn-cgi/handler/scheduled?cron=*+*+*+*+*"

# With a specific scheduled time override
curl "http://localhost:8787/cdn-cgi/handler/scheduled?cron=*+*+*+*+*&time=1745856238"
```

## Observability

Past Cron Events (last 100) are visible in the Cloudflare dashboard under Worker > Settings > Trigger Events. Workers Logs provides longer retention and filtering. GraphQL Analytics API is available for programmatic access.

## Limits reference

Cloudflare publishes limits at https://developers.cloudflare.com/workers/platform/limits/ - the minimum Cron Trigger interval is effectively 1 minute (due to minimum cron resolution of `* * * * *`).

CPU time limit for Workers: **10 milliseconds on the Free plan** (50ms on paid plans). This is CPU time, not wall time. For operations exceeding this, use Workers + Workflows (Durable Objects-backed durable execution).

## Annotations for stinger-forge

- Primary source for `guides/01-platform-limits.md` Cloudflare section
- The Quartz extension characters (L, W, #) differentiate Cloudflare from Vercel; `guides/00-cron-expression-syntax.md` should have a platform comparison table noting this
- The "Workflows" integration (Durable Objects) is the recommended pattern for long-running cron-triggered tasks - this belongs in the "when cron runs too long" callout in `guides/01-platform-limits.md`
- 15-minute propagation delay is a deployment gotcha to surface explicitly
- Green Compute (renewable-energy-only execution) is a production option to mention briefly
