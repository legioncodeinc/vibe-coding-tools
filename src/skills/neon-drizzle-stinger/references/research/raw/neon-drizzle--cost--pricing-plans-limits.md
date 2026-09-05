# Neon plans, pricing, and limits - Neon Docs

- URL: https://neon.com/docs/introduction/plans; supplementary from https://neon.com/pricing and https://neon.com/blog/new-usage-based-pricing
- Fetched: 2026-08-14
- Source type: Official docs (Neon)
- Component: Cost and limits, connection caps, common production failures

## Plan overview (Free / Launch / Scale)

| Feature | Free | Launch | Scale |
|---|---|---|---|
| Price | $0/month | Pay for what you use | Pay for what you use |
| Projects | 100 | 100 | 1,000 (increasable) |
| Branches per project | 10 | 10 | 25 |
| Extra branches |, | $1.50/branch-month (prorated hourly) | $1.50/branch-month (prorated hourly) |
| Compute | 100 CU-hours/project | $0.106/CU-hour | $0.222/CU-hour |
| Autoscaling ceiling | Up to 2 CU (8 GB RAM) | Up to 16 CU (64 GB RAM) | Up to 16 CU autoscaling, or fixed sizes up to 56 CU (224 GB RAM) |
| Scale to zero | After 5 min, cannot disable | After 5 min, can disable | Configurable, 1 min to always-on |
| Storage | 0.5 GB/project | $0.35/GB-month | $0.35/GB-month |
| Instant restore |, | $0.20/GB-month | $0.20/GB-month |
| History window | 6 hours (1 GB cap) | Up to 7 days | Up to 30 days |
| Public egress | 5 GB included | 500 GB/project included, then $0.10/GB | 500 GB/project included, then $0.10/GB |
| Private networking |, |, | $0.01/GB (Scale only, AWS PrivateLink) |
| Auth (MAU) | Up to 60k | Up to 1M | Up to 1M |
| Protected branches |, | Yes | Yes |
| IP allow rules |, |, | Yes |
| Compliance |, |, | HIPAA (self-serve, BAA required), SOC 2, GDPR |
| Uptime SLA |, |, | Yes (99.95%) |

Paid plans are **fully usage-based, metered hourly, billed monthly, no monthly minimum** (rolled out August 2025 per the `new-usage-based-pricing` post, the earlier packaged-bundle pricing model was retired).

## Storage and branch limits (paid plans)

- **16 TB logical data size per branch** on paid plans; write performance degrades past that (data can still be dropped/deleted to reclaim space; a limit increase can be requested).
- **5,000 branches per project cap** on paid plans (10/25 included depending on plan); Free plan capped at 10 branches per project total.
- Instant restore is billed only on **root branches**; child branches don't add to this charge.

## What happens when limits are hit (Free plan failure modes, directly relevant to "common production failures")

| Limit hit | Behavior |
|---|---|
| CU-hours used up | Compute suspended until next billing period or upgrade; existing connections drop, new ones can't open |
| Public network transfer exhausted | Same as above, compute suspends |
| Storage above 0.5 GB | Project suspended rather than billed; writes (insert/update/delete) fail until space is freed or plan is upgraded |
| Branch count at 10 | Branch creation fails until a branch is deleted or the plan is upgraded |

None of these Free-plan limit events **delete data**, compute suspension/write-blocking is the failure mode, not data loss. Compute (CU-hours) and public network transfer **reset each monthly billing period**; storage, branch count, and project count are **continuous, point-in-time limits** (not monthly).

## Connection caps (ties to the pooling doc, cross-referenced)

- `max_client_conn` = 10,000 (PgBouncer pooled connections accepted).
- `default_pool_size` = 90% of `max_connections` (pooled connections actually forwarded to Postgres per user/database pair).
- `max_connections` (direct, unpooled) varies by compute size, e.g. 104 on a 0.25 CU compute, 419 on a 1 CU compute.
- Read replica computes have several settings **synchronized from the primary** at replica-start time: `max_connections`, `max_prepared_transactions`, `max_locks_per_transaction`, `max_wal_senders`, `max_worker_processes`, if the primary's compute size changes, associated read replicas should be restarted to stay in sync (misalignment is a documented cause of replication-lag/config-mismatch issues).

## Cost mental model (from the `new-usage-based-pricing` post and third-party breakdown)

The bill is dominated by **CU-hours** (how long compute stays awake), not by query volume, scale-to-zero is the primary lever for cost control on intermittent workloads. A 0.25 CU compute running 5 hours = 1.25 CU-hours (~$0.13 on Launch); if it then sits idle the rest of the day, those idle hours cost nothing due to scale-to-zero. An always-on production compute on Scale (compute never scaled to zero) can run **$300+/month** in compute alone at larger sizes, since Scale's $0.222/CU-hour rate applies around the clock. The Scale compute rate is roughly 2.1x the Launch rate, moving to Scale is not a volume discount, it buys a higher autoscale ceiling, configurable suspend timing, longer restore windows, and compliance/SLA, not cheaper compute.
