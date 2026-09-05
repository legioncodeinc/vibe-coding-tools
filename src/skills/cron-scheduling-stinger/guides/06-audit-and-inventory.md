# Guide 06: Cron Audit and Inventory

*Research sources: `research/external/2026-05-20-vercel-cron-jobs-official-docs.md`, `research/external/2026-05-20-cloudflare-cron-triggers-official-docs.md`, `research/external/2026-05-20-github-actions-schedule-event-docs.md`*

---

## Purpose

Before diagnosing any scheduling problem or recommending improvements, build an inventory of all scheduled jobs in the codebase. Unknown jobs cause audit failures and silent production incidents.

---

## Step 1: Enumerate all cron definitions

### Vercel (`vercel.json`)

```bash
# Find all vercel.json files with cron definitions
grep -r '"crons"' . --include="vercel.json" -l
```

Then read each file and extract the `path` + `schedule` for every entry.

### Cloudflare Workers (`wrangler.toml`)

```bash
grep -r '^\[triggers\]' . --include="wrangler.toml" -l -A 2
```

### GitHub Actions

```bash
grep -r 'schedule:' .github/workflows/ --include="*.yml" -l
```

Then inspect each workflow for the `cron:` value.

### pg_cron

```sql
SELECT jobname, schedule, command, active FROM cron.job ORDER BY jobname;
```

### BullMQ / cron library registrations (code search)

```bash
# Find BullMQ repeatable job registrations
grep -rn "repeat:" src/ --include="*.ts" --include="*.js"
# Find node-cron / cron library registrations
grep -rn "cron.schedule\|new CronJob\|schedule(" src/ --include="*.ts"
```

---

## Step 2: Risk assessment matrix

For each discovered job, populate this table:

| Job | Platform | Expression | Plain-English | Timezone | Has monitoring? | Has idempotency? | Distributed? | Risk |
|---|---|---|---|---|---|---|---|---|
| `daily-cleanup` | Vercel | `0 2 * * *` | Every day 2am UTC | UTC | Healthchecks.io | Yes (advisory lock) | No | Low |
| `hourly-sync` | Vercel | `0 * * * *` | Every hour | UTC | None | No | No | High |
| `report-gen` | GH Actions | `0 9 * * 1-5` | 9am UTC Mon-Fri | UTC | None | No | N/A | Medium |

**Risk scoring:**

| Factor | Score contribution |
|---|---|
| No heartbeat monitoring | +2 |
| Non-idempotent handler | +2 |
| Distributed deployment without leader lock | +3 |
| Non-UTC timezone without DST protection | +1 |
| Platform with known reliability issues (GitHub Actions) | +1 |
| Max execution duration close to platform limit | +1 |

Risk levels: Low (0-2), Medium (3-4), High (5+).

---

## Step 3: Produce the audit report

Use `templates/cron-job-spec.md` as the per-job specification template. The audit report wraps the matrix with:

1. **Executive summary:** total jobs, risk distribution, top 3 recommendations.
2. **Per-job specs:** one `cron-job-spec.md` entry per job.
3. **Action plan:** prioritized list of fixes (add monitoring, add idempotency, add leader lock, add timezone annotation).

---

## Common audit findings

| Finding | Frequency | Fix |
|---|---|---|
| No heartbeat monitoring | Very common | Add Healthchecks.io check + start/success/fail pings |
| Non-idempotent handler on at-most-once platform | Common | Add idempotency key table |
| GitHub Actions schedule without `workflow_dispatch` | Common | Add `workflow_dispatch:` trigger |
| Cron expressions undocumented (no comment) | Very common | Add plain-English comment above each expression |
| Vercel Hobby with sub-hourly fake schedule | Occasionally | Migrate to Cloudflare Workers free tier |
| Multiple replicas without leader election | Less common | Add advisory lock or Redis SETNX |

---

*Back to `SKILL.md` for the master index.*
