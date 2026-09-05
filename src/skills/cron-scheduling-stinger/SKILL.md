---
name: "cron-scheduling-stinger"
description: "Scheduled-job specialist for cron expression authoring, platform-specific limits (Vercel Cron, Cloudflare Cron Triggers, GitHub Actions schedule), distributed-cron correctness (exactly-once execution, leader election, idempotency), timezone and DST safety, retry-on-failure patterns, and the \\\\\\\"did the cron run?\\\\\\\" observability loop (Healthchecks.io, Cronitor, self-hosted heartbeat tables). Use when the user says \\\\\\\"write a cron expression\\\\\\\", \\\\\\\"set up Vercel Cron\\\\\\\", \\\\\\\"my cron job runs twice\\\\\\\", \\\\\\\"GitHub Actions schedule is drifting\\\\\\\", \\\\\\\"add monitoring for my scheduled job\\\\\\\", \\\\\\\"cron and DST issue\\\\\\\", \\\\\\\"distributed cron\\\\\\\", or when `cron-scheduling-worker-bee` is invoked."
---

# cron-scheduling-stinger

Procedural arsenal for `cron-scheduling-worker-bee`, the Hive's scheduled-job specialist. This stinger encodes everything needed to design, implement, secure, and monitor scheduled jobs across the platforms a Next.js / TypeScript / Node.js team typically uses.

## When this stinger applies

Load this stinger whenever the work involves:

- Authoring or auditing a cron expression (POSIX, Vercel, Cloudflare, GitHub Actions)
- Diagnosing a job that fires twice (distributed duplication) or never (missed run)
- Setting up monitoring so a missed or failed run pages someone within one schedule period
- Designing a scheduled job to survive DST transitions without skipping or doubling
- Building a retry strategy that doesn't make idempotency mistakes
- Reviewing platform limits before choosing where to host a scheduled job

Do NOT load for:

- Background jobs triggered by queue messages without a time component (no Stinger for this yet, handle inline)
- CI/CD pipeline design (that is `devops-worker-bee`)
- Database schema design for job metadata tables (that is `db-worker-bee`)

---

## First actions when this stinger is loaded

1. Read `guides/00-cron-expression-syntax.md` for the field reference and platform comparison table.
2. Identify the deployment platform (Vercel, Cloudflare, GitHub Actions, POSIX, pg_cron, BullMQ) and read the relevant section of `guides/01-platform-limits.md`.
3. For distributed deployments (>1 replica or region): read `guides/02-distributed-cron-correctness.md` before prescribing any fix.
4. For timezone-sensitive schedules: read `guides/03-timezone-dst-safety.md`.
5. For observability setup: read `guides/05-observability-monitoring.md`.

---

## Core principles (from Command Brief critical directives)

These are non-negotiable. Each guide in this stinger is structured around them.

- **Never generate a cron expression without explaining it in plain English.** See `guides/00-cron-expression-syntax.md`.
- **Always ask about deployment topology before prescribing a distributed-cron fix.** See `guides/02-distributed-cron-correctness.md`.
- **UTC is the safe default; local timezone must be explicitly justified.** See `guides/03-timezone-dst-safety.md`.
- **Heartbeat monitoring is mandatory for business-critical jobs.** See `guides/05-observability-monitoring.md`.
- **Retry handlers must be idempotent before adding retry logic.** See `guides/04-retry-and-failure-handling.md`.
- **Decouple the trigger from the work for long-running jobs.** If a cron job risks exceeding the platform's execution limit, trigger a queue message and return fast. See `guides/01-platform-limits.md`.

---

## Folder layout

```text
cron-scheduling-stinger/
+- SKILL.md                          (this file)
+- README.md                         (one-page human overview)
+- guides/
|  +- 00-cron-expression-syntax.md   (POSIX / Quartz / Vercel / Cloudflare / GitHub Actions field reference)
|  +- 01-platform-limits.md          (Vercel, Cloudflare, GitHub Actions, pg_cron, BullMQ limits + tradeoffs)
|  +- 02-distributed-cron-correctness.md (leader election, idempotency, exactly-once patterns)
|  +- 03-timezone-dst-safety.md      (UTC discipline, IANA timezone, DST cliff handling)
|  +- 04-retry-and-failure-handling.md (backoff, dead-letter, idempotent handler design)
|  +- 05-observability-monitoring.md (Healthchecks.io, Cronitor, self-hosted heartbeat table)
|  +- 06-audit-and-inventory.md      (enumerate all cron jobs in a codebase, risk matrix)
+- examples/
|  +- vercel-cron-happy-path.md      (vercel.json + idempotent Next.js handler + Healthchecks.io ping)
|  +- distributed-duplicate-prevention.md (Redis SETNX leader lock + automatic expiry)
|  +- github-actions-drift-mitigation.md  (workflow_dispatch fallback + heartbeat step)
+- templates/
|  +- cron-job-spec.md               (structured template for specifying a new scheduled job)
+- reports/
|  +- README.md                      (how audit reports accumulate over time)
+- research/                         (DO NOT MODIFY — owned by scripture-historian)
   +- research-summary.md
   +- research-plan.md
   +- index.md
   +- external/                      (10 source notes from the normal-depth sweep)
```

---

## Quick-reference: cron expression cheat sheet

| Field | POSIX 5-field | Quartz 7-field | Vercel | Cloudflare | GitHub Actions |
|---|---|---|---|---|---|
| Seconds | - | 0-59 | - | - | - |
| Minutes | 0-59 | 0-59 | 0-59 | 0-59 | 0-59 |
| Hours | 0-23 | 0-23 | 0-23 | 0-23 | 0-23 |
| DOM | 1-31 | 1-31 | 1-31 | 1-31 | 1-31 |
| Month | 1-12 | 1-12 | 1-12 | 1-12 | 1-12 |
| DOW | 0-7 | 1-7 | 0-6 | 0-6 | 0-6 (Sun=0) |
| Year | - | optional | - | - | - |
| Timezone | - | named | UTC only | UTC only | UTC + IANA (2026) |

Full syntax details: `guides/00-cron-expression-syntax.md`.

---

## Platform selection decision tree

```
Does the job need sub-hourly scheduling?
  YES → Use Cloudflare Workers free tier (min: 1 min) or pg_cron/BullMQ
  NO  → Continue

Is it a Next.js / Vercel project?
  YES → Use Vercel Cron (vercel.json). Check plan tier (Hobby = daily only).
  NO  → Continue

Is it a GitHub repo CI task (report generation, stale-issue cleanup)?
  YES → Use GitHub Actions schedule: (min: 5 min, UTC-only, expect drift).
  NO  → Use pg_cron (Postgres-native) or BullMQ repeatable (Node.js/Redis)
```

Full platform comparison: `guides/01-platform-limits.md`.

---

## Research trail

The `research/` folder was populated by `scripture-historian` at `normal` depth (2025-11-20 to 2026-05-20). Key findings:

- Vercel updated plan limits in January 2026: 100 cron jobs per project on all plans (was 2 on Hobby). Hobby plan still limited to once-per-day minimum frequency.
- GitHub Actions `schedule:` drift is an active January 2026 incident; delays of 22+ minutes observed. GitHub now supports IANA timezone strings in `schedule:` as of early 2026.
- Cloudflare free tier is the canonical workaround for Vercel Hobby users needing sub-hourly schedules.
- `research/research-summary.md` lists 5 open questions for `stinger-forge`: see that file for details.

---

*Forged from `ai-tools/command-briefs/cron-scheduling-worker-bee-command-brief.md` and `research/`. Part of The Hive by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
