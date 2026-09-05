# Cron Job Specification

Use this template to specify a new scheduled job before implementation. Fill in every field; leave none as placeholder. Incomplete specs produce incorrect implementations.

---

## Job identity

**Job name:** <!-- e.g., `daily-session-cleanup`: lowercase, hyphens, descriptive verb + noun -->
**Owner:** <!-- team or person responsible for this job -->
**Created:** <!-- YYYY-MM-DD -->

---

## Schedule

**Cron expression:** <!-- e.g., `0 2 * * *` -->
**Plain-English translation:** <!-- e.g., "Every day at 02:00 UTC" -->
**Platform:** <!-- Vercel Cron / Cloudflare Workers / GitHub Actions / pg_cron / BullMQ / POSIX cron -->
**Timezone:** <!-- UTC (preferred) or IANA timezone if local-time semantics required. Justify if non-UTC. -->

---

## What the job does

**Purpose (one sentence):** <!-- What problem does this job solve? -->
**Expected duration (typical):** <!-- e.g., "< 5 seconds" -->
**Expected duration (max):** <!-- e.g., "30 seconds" -->
**Platform execution limit:** <!-- e.g., "Vercel Pro: 60s"; must exceed expected max duration -->

---

## Inputs

**Data sources accessed:** <!-- e.g., PostgreSQL sessions table, Stripe API -->
**Environment variables required:**
- `VAR_NAME`: purpose

---

## Idempotency

**Is the handler idempotent?** <!-- Yes / No / Needs work -->
**Idempotency mechanism:**
<!-- One of:
  - Idempotency key table: `job_run_id = "{job-name}-{YYYY-MM-DD}"`
  - `onConflictDoNothing` on insert with unique constraint
  - Redis SETNX with fencing token (multi-region)
  - Postgres advisory lock (single-region, no PgBouncer in transaction mode)
  - Other: describe
-->

---

## Distributed deployment

**Number of replicas / regions:** <!-- e.g., "1" or "3-region active-active" -->
**Leader-election or lock mechanism:** <!-- N/A for single-instance; or describe lock strategy -->

---

## Failure handling

**Retry on failure:** <!-- Yes (N attempts, exponential backoff) / No (at-most-once platform) -->
**Dead-letter / exhausted-retry action:** <!-- e.g., "Write to `job_errors` table + Slack alert" -->
**Decoupled from work?** <!-- Yes (triggers queue) / No (does work inline); required if max duration > platform limit -->

---

## Monitoring

**Heartbeat check URL:** <!-- e.g., `https://hc-ping.com/<uuid>`: REQUIRED for business-critical jobs -->
**Monitoring platform:** <!-- Healthchecks.io / Cronitor / Self-hosted table / None (justify) -->
**Grace time configured:** <!-- e.g., "15 minutes" -->
**Alert channel:** <!-- e.g., "Slack #oncall, email: ops@example.com" -->

---

## Risk assessment

**Criticality:** <!-- Business-critical / High / Medium / Low -->
**Risk score:** <!-- See guides/06-audit-and-inventory.md scoring rubric -->
**Known risks:**
<!--
  - [ ] No heartbeat monitoring
  - [ ] Non-idempotent handler
  - [ ] Distributed without leader lock
  - [ ] Non-UTC timezone without DST protection
  - [ ] Platform reliability issues (GitHub Actions drift)
  - [ ] Max duration close to platform limit
-->

---

## Review sign-off

- [ ] Cron expression reviewed (plain-English translation verified)
- [ ] Idempotency confirmed (can run twice safely)
- [ ] Monitoring configured (missed-run alert within 1x schedule period for critical)
- [ ] Platform limits verified (max duration < platform limit)
- [ ] DST risk acknowledged (UTC or IANA timezone with DST tested)
