---
source_url: https://vercel.com/changelog/cron-jobs-now-support-100-per-project-on-every-plan
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: vercel-cron
stinger: cron-scheduling-stinger
---

# Vercel Cron Jobs: January 2026 Plan Limit Update

## Summary

In January 2026, Vercel updated its cron job limits to allow 100 cron jobs per project on ALL plans (Hobby, Pro, Enterprise), removing the previous per-team limits. This is a significant change for teams previously constrained by the old limits. The key remaining restriction is that Hobby plans are still limited to once-per-day execution frequency (a fundamental constraint, not just a quantity limit).

## Key quotations / statistics

- "Cron jobs now support 100 per project on every plan" (Vercel changelog, January 2026)
- Before this update: Hobby = 2 per team, Pro = 40 per team, Enterprise = 100 per team (all with 20 per project max)
- After this update: All plans = 100 per project, no per-team cap

## Pre-update vs post-update limits

| Metric | Before (pre-Jan 2026) | After (Jan 2026+) |
|--------|----------------------|-------------------|
| Per-project limit | 20 | **100** |
| Hobby per-team | 2 | Removed |
| Pro per-team | 40 | Removed |
| Enterprise per-team | 100 | Removed |
| Hobby frequency | Daily only | Daily only (unchanged) |
| Pro frequency | Per-minute | Per-minute (unchanged) |

## Sub-hourly on Hobby: the workaround question

The Hobby plan restriction (once-per-day) is a business tier limit, not a technical one. For projects needing sub-hourly cron on a Hobby budget:

**Option 1: Cloudflare Workers free tier**
- Cloudflare's free plan allows Cron Triggers down to 1-minute intervals
- A Cloudflare Worker can trigger a Vercel API route via HTTP fetch
- CPU limit on free tier: 10ms - but this is enough for a simple HTTP fetch to kick off a Vercel Function

```typescript
// Cloudflare Worker as sub-hourly trigger for Vercel
export default {
  async scheduled(controller, env) {
    // Trigger Vercel function every 5 minutes
    await fetch('https://your-app.vercel.app/api/cron-handler', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.CRON_SECRET}`,
      },
    });
  }
};
```

**Option 2: Upgrade to Pro**
- At $20/month, Pro enables per-minute cron scheduling
- Appropriate when the sub-hourly job is business-critical

**Option 3: Self-hosted POSIX cron or pg_cron**
- Host the job scheduler yourself (VPS cron, pg_cron, BullMQ repeatable)
- Trigger the business logic via an API call

## Annotations for stinger-forge

- This supplement to the Vercel official docs is critical for `guides/01-platform-limits.md`
- The Cloudflare-as-trigger-for-Vercel workaround directly answers the open question from the Command Brief: "What is the canonical recommendation when a Vercel Hobby user needs sub-hourly cron?"
- Recommendation should be: use Cloudflare Workers free tier as a Hobby sub-hourly trigger
- The pre/post January 2026 table is important - docs from 2024 and early 2025 will show the old limits
