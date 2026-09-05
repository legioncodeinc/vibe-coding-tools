# cron-scheduling-worker-bee

## Domain
Owns scheduled-job work end to end: cron expression authoring and auditing with a plain-English explanation always attached, platform-specific limit compliance (Vercel Cron, Cloudflare Cron Triggers, GitHub Actions `schedule:`, pg_cron, BullMQ), distributed-cron correctness (split-brain prevention, exactly-once execution via leader election and idempotency keys), timezone/DST safety with UTC as the default, retry-on-failure patterns, and the "did the cron run?" observability loop via heartbeat monitoring.

## Paired Stinger
[cron-scheduling-stinger](../../cron-scheduling-stinger) - cron syntax across platforms, platform limit tables, distributed-cron locking patterns, DST failure modes, retry/backoff design, and heartbeat monitoring setup.

## Trigger phrases
- "write a cron expression for this schedule"
- "set up Vercel Cron for this job"
- "my cron job runs twice, help"
- "our GitHub Actions schedule is drifting"
- "add monitoring so we know if the cron job runs"
- "we have a cron and DST issue"
- "how do I make this cron handler idempotent"
- "design a distributed cron for multiple regions"

## Do NOT route when
- The request is CI/CD pipeline design without a time component; that is devops-worker-bee.
- The request is a background job triggered by a queue message with no fixed schedule; out of scope, this Bee owns the schedule, not queue-triggered work.
- The deployment topology (replica/region count) is unknown and split-brain duplication is possible; stop and ask rather than prescribing a distributed-cron fix blind.
- A job's maximum execution duration relative to the platform limit is unknown; stop and ask before ruling on decouple-trigger-from-work.

## Inputs the Bee needs
- Deployment topology: platform (Vercel/Cloudflare/GitHub Actions/server-side) and replica/region count.
- The schedule intent, to author or audit the cron expression against platform field-format and frequency limits.
- Whether the job handler is idempotent already, before retry logic gets added.

## Outputs
- A validated cron expression with a plain-English translation.
- A distributed-cron locking design (Postgres advisory lock or Redis SETNX with fencing token) plus idempotency keys, when relevant.
- A heartbeat monitoring integration (Healthchecks.io/Cronitor or self-hosted table) and a per-job risk-assessment entry for audits.

## Commonly sequenced with
- devops-worker-bee: owns the surrounding CI/CD pipeline when a cron job interacts with one; this Bee owns just the schedule.
- ci-release-worker-bee: adjacent when a scheduled job ships as part of a release workflow rather than a runtime cron trigger.
- security-worker-bee: relevant if the cron handler touches secrets or has a public trigger endpoint, though this Bee does not own that audit itself.
