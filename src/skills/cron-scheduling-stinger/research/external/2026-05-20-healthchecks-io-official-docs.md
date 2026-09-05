---
source_url: https://healthchecks.io/docs/
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: monitoring-healthchecks
stinger: cron-scheduling-stinger
---

# Healthchecks.io - Official Documentation

## Summary

Healthchecks.io is a dead man's switch service for cron jobs and periodic processes. It listens for HTTP "pings" from monitored jobs and alerts when pings stop arriving on schedule. Each monitored job gets a unique ping URL; the service tracks state transitions (New/Up/Late/Down/Paused) and supports grace time configuration to absorb minor execution delays. The service is open source and self-hostable. The key concept: Healthchecks.io is passive - it doesn't run the job, it waits for the job to prove it ran.

## Key quotations / statistics

- "Healthchecks.io listens for HTTP requests ('pings') from your cron jobs and scheduled tasks. It keeps silent as long as pings arrive on time. It raises an alert as soon as a ping does not arrive on time."
- "Healthchecks.io works as a dead man's switch for processes that need to run continuously or on a regular, known schedule."
- "When a check is considered late depends on whether the check uses a simple or cron schedule, and whether or not you are tracking job durations using the 'start' events."

## Check states

| State | Meaning |
|-------|---------|
| New | Check created, no pings received yet |
| Up | Last "success" signal arrived on time |
| Late | Success signal is due but not yet arrived (within Grace Time) |
| Down | Grace Time has elapsed without a success signal - ALERTS FIRE |
| Paused | Monitoring manually suspended |

## Ping URL formats

```bash
# UUID-based (auto-assigned)
https://hc-ping.com/<check-uuid>

# Slug-based (human-readable, supports auto-provisioning)
https://hc-ping.com/<ping-key>/<slug>

# Signal types
https://hc-ping.com/<uuid>          # success (default)
https://hc-ping.com/<uuid>/start    # job started
https://hc-ping.com/<uuid>/fail     # explicit failure signal
https://hc-ping.com/<uuid>/<exit-code>  # exit code (0 = success, nonzero = fail)
```

## Integration pattern (shell)

```bash
#!/bin/bash
# Minimal: ping on success
./run-job.sh && curl -fsS --retry 3 https://hc-ping.com/<uuid>

# Better: signal start and success/failure
curl -fsS --retry 3 https://hc-ping.com/<uuid>/start
./run-job.sh
if [ $? -eq 0 ]; then
  curl -fsS --retry 3 https://hc-ping.com/<uuid>
else
  curl -fsS --retry 3 https://hc-ping.com/<uuid>/fail
fi
```

## Integration pattern (Node.js / TypeScript)

```typescript
async function runMonitoredJob(pingUrl: string, jobFn: () => Promise<void>) {
  try {
    // Signal start
    await fetch(`${pingUrl}/start`);
    
    await jobFn();
    
    // Signal success
    await fetch(pingUrl);
  } catch (err) {
    // Signal failure
    await fetch(`${pingUrl}/fail`);
    throw err;
  }
}

// Usage
await runMonitoredJob(process.env.HEALTHCHECKS_URL!, async () => {
  await processQueuedEmails();
});
```

## Grace Time behavior

For cron schedules (`10 * * * *`), the check enters "late" state at exactly `13:10` and transitions to "down" at `13:10 + Grace Time`. Grace time accounts for minor execution delay variance.

If using `/start` signals: grace time also sets the maximum allowed duration between start and success. A job that hangs indefinitely will trigger an alert after grace time elapses from the `/start` ping.

## Self-hosting

Healthchecks.io is open source (MIT license): https://github.com/healthchecks/healthchecks

Self-hosting eliminates data privacy concerns and removes dependency on external service availability.

## Annotations for stinger-forge

- Primary source for `guides/05-observability-monitoring.md` Healthchecks.io section
- The `/start` signal pattern (for measuring execution duration) belongs as a recommended best practice in the guide
- The Node.js integration pattern above is the foundation for the `examples/vercel-cron-happy-path.md` monitoring step
- Self-hosting option should be called out as a "privacy/compliance" alternative
- Grace time calculation tip: set grace time to at least 2x the typical jitter in job execution time
