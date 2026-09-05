# 08 - Performance and cost

## Pricing model

Paid plans (Launch, Scale) are fully usage-based, metered hourly, billed monthly, with **no monthly minimum** [raw/neon-drizzle--cost--pricing-plans-limits.md]. Compute: Launch $0.106/CU-hour, Scale $0.222/CU-hour, roughly 2.1x Launch, buying a higher autoscale ceiling, configurable suspend timing, longer restore windows, and compliance/SLA, **not** a volume discount [raw/neon-drizzle--cost--pricing-plans-limits.md]. Storage: $0.35/GB-month on both paid plans [raw/neon-drizzle--cost--pricing-plans-limits.md].

**The bill is dominated by CU-hours (uptime), not query count.** Scale-to-zero is the primary cost lever for any workload that isn't 24/7, an always-on Scale-plan compute can run $300+/month in compute alone [raw/neon-drizzle--cost--pricing-plans-limits.md].

## Limits that turn into production failures

| Limit | Free plan behavior when hit |
|---|---|
| CU-hours exhausted | Compute suspended until next billing period or upgrade; existing connections drop, new ones can't open |
| Public egress exhausted | Same, compute suspends |
| Storage over 0.5 GB | Project suspended; writes (insert/update/delete) fail until space is freed or plan upgraded |
| Branch count at 10 | Branch creation fails until a branch is deleted or plan upgraded |
[raw/neon-drizzle--cost--pricing-plans-limits.md]

None of these delete data, the failure mode is suspension/write-blocking, not data loss [raw/neon-drizzle--cost--pricing-plans-limits.md]. On paid plans: 5,000 branches/project hard cap (10/25 included depending on plan, extra at $1.50/branch-month), and 16 TB logical data per branch before write performance degrades [raw/neon-drizzle--cost--pricing-plans-limits.md].

## Connection caps

- Pooled: up to 10,000 client connections via PgBouncer; `default_pool_size` = 90% of `max_connections` [raw/neon-drizzle--connections--pooling.md].
- Direct: `max_connections` scales with compute size, e.g. 104 on a 0.25 CU compute, 419 on a 1 CU compute [raw/neon-drizzle--cost--pricing-plans-limits.md].
- A common production failure: an app opening direct (unpooled) connections at request time exhausts `max_connections` well before it exhausts anything else, this is the exact failure mode connection pooling exists to prevent (guide 01). If a Vercel deployment starts throwing "too many connections" errors, check whether a route is bypassing the pooled connection string.

## Read replica config drift

Several Postgres settings (`max_connections`, `max_prepared_transactions`, `max_locks_per_transaction`, `max_wal_senders`, `max_worker_processes`) sync from the primary to a read replica **only when the replica starts**. Resizing the primary compute without restarting associated read replicas is a documented cause of configuration mismatch and replication-lag symptoms [raw/neon-drizzle--cost--pricing-plans-limits.md]. If replicas are in use, restart them after any primary resize.

## Cold-start cost vs latency tradeoff

Scale-to-zero suspends an idle compute after 5 minutes by default (configurable 1 minute-7 days on Scale; can be disabled entirely on paid plans) [raw/neon-drizzle--architecture--scale-to-zero-cold-starts.md]. Reactivation costs a few hundred milliseconds plus a cold-buffer tax on the first queries [raw/neon-drizzle--architecture--scale-to-zero-cold-starts.md]. For latency-sensitive production paths, disabling scale-to-zero (or setting a long suspend timeout) trades cost for predictable latency, this is a deliberate, per-environment decision, not a default to leave unexamined. Staging/preview branches should almost always keep scale-to-zero on; a customer-facing production API may not be able to tolerate the cold-start tax on its p99.

## CI checklist for this stack (ties to guide 03)

- [ ] Every PR touching the schema or migrations folder runs the branch-per-PR workflow (guide 03) before merge.
- [ ] `drizzle-kit generate` produces an **empty** diff after `drizzle-kit migrate` runs, a non-empty diff means the schema and migration files are out of sync, a common source of a later production incident.
- [ ] No `drizzle-kit push` (especially with `--force`) targets a branch holding real user data.
- [ ] Migration commands use `DIRECT_URL`, never `DATABASE_URL` (guide 01, guide 03).
- [ ] Production compute's scale-to-zero setting matches the latency tolerance of the workload it serves, verified explicitly, not left at the plan default.

## Load next

- `guides/01-connection-and-drivers.md`, the pooling discipline that prevents the connection-cap failure mode
- `guides/03-migrations-and-branching.md`, the CI gating this checklist extends
- [devops-stinger](../devops-stinger), broader CI/CD guidance beyond this stinger's Neon/Drizzle-specific scope
