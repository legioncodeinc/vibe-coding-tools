# Research Plan: cron-scheduling-stinger

- **Depth tier:** normal
- **Time window:** 2025-11-20 back to 2026-05-20 (6 months)
- **Page budget target:** ~100 pages, distilled to 8-12 source files
- **Source breadth target:** official docs (Vercel, Cloudflare, GitHub Actions, Healthchecks.io, Cronitor), practitioner blogs, GitHub READMEs (pg_cron, BullMQ), community Q&A

## Initial queries (from `big-bang-space`)

1. "Distributed cron exactly-once execution 2026"
2. "Vercel Cron Cloudflare Cron Triggers limits 2026"
3. "Cron timezone DST production patterns 2026"
4. "Cron monitoring Healthchecks.io Cronitor 2026"
5. "GitHub Actions scheduled workflow drift 2026"

## Expansion queries (authored by scripture-historian)

### Branch from "Distributed cron exactly-once execution 2026"
- "Redis SETNX distributed lock cron job 2026"
- "Postgres advisory lock job scheduler idempotency 2026"
- "BullMQ repeatable jobs deduplication 2026"

### Branch from "Vercel Cron Cloudflare Cron Triggers limits 2026"
- "Vercel cron jobs vercel.json max duration 2026"
- "Cloudflare Workers wrangler.toml cron trigger configuration 2026"
- "sub-hourly cron Vercel free tier workaround 2026"

### Branch from "Cron timezone DST production patterns 2026"
- "IANA timezone database cron scheduler 2026"
- "UTC cron schedule daylight saving time bug 2026"
- "node-cron croner timezone handling 2026"

### Branch from "Cron monitoring Healthchecks.io Cronitor 2026"
- "healthchecks.io heartbeat ping integration 2026"
- "self-hosted cron monitoring heartbeat table schema 2026"
- "missed cron run alerting SLO 2026"

### Branch from "GitHub Actions scheduled workflow drift 2026"
- "GitHub Actions schedule reliability latency 2026"
- "workflow_dispatch scheduled fallback pattern 2026"
- "GitHub Actions cron UTC constraint workaround 2026"

## Expected source types by topic

| Topic | Expected source types |
|---|---|
| Vercel Cron platform limits | Official docs, changelog |
| Cloudflare Cron Triggers | Official docs, wrangler config examples |
| GitHub Actions schedule: | Official docs, community reports, blog posts |
| Distributed cron correctness | Practitioner blogs, GitHub READMEs, Stack Overflow |
| Timezone/DST safety | Practitioner blogs, library docs |
| Retry and failure handling | Practitioner blogs, BullMQ/pg_cron docs |
| Monitoring (Healthchecks, Cronitor) | Official docs, integration guides |

## Coverage targets per guide (for stinger-forge)

- `guides/00-cron-expression-syntax.md` -- sources covering POSIX 5-field, Quartz 7-field, platform comparison
- `guides/01-platform-limits.md` -- Vercel plan tiers, Cloudflare 1-min min, GitHub Actions 5-min min + drift
- `guides/02-distributed-cron-correctness.md` -- leader election patterns, idempotency, split-brain prevention
- `guides/03-timezone-dst-safety.md` -- UTC-first discipline, IANA DB, DST cliff handling
- `guides/04-retry-and-failure-handling.md` -- exponential backoff with jitter, dead-letter handling, idempotent handler design
- `guides/05-observability-monitoring.md` -- Healthchecks.io, Cronitor, self-hosted heartbeat table
- `guides/06-audit-and-inventory.md` -- enumerating scheduled jobs, risk assessment
