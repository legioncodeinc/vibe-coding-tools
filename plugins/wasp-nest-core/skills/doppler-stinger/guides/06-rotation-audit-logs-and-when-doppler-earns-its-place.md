# Secret rotation, audit logs, and when Doppler earns its place over Vercel env vars alone

Grounded in `references/research/distilled-doppler.md` §7, §8, §10, citing [raw/doppler--rotation--secrets-rotation-engine.md], [raw/doppler--audit--access-logs-and-activity-logs.md], [raw/doppler--comparison--env-files-vs-secrets-manager.md].

## Rotation - Team/Enterprise plan feature

Core mechanism: the **two-secret strategy**. Every rotated secret has an active and inactive instance; only the active one is ever served. At the midpoint of each rotation interval, the roles swap and the newly-active instance's value is rotated first - so any consumer holding a credential stays valid for two full rotation intervals as long as it re-fetches at least that often. This is how rotation avoids downtime without coordinating a simultaneous cutover across every consumer [raw/doppler--rotation--secrets-rotation-engine.md].

Two rotation types: **Issuer** (new instance created, old one deleted - Doppler's own stated preference, "makes auditability easier") and **Updater** (existing instance's value updated in place - the pattern for database password rotation where the users already exist). Two delivery models: **Proxied** (AWS Lambda deployed into the customer's own account, target service never exposed to the internet) and **API** (direct calls to the target service's management API) [raw/doppler--rotation--secrets-rotation-engine.md].

**Neon-specific gap**: the research covered AWS Postgres and GCP Cloud SQL Postgres rotation in depth. No source named Neon as a supported rotation target. Verify directly against Doppler's live integrations catalog before promising automated Neon connection-string rotation on this stack - don't assume the AWS/GCP Postgres pattern applies unmodified [raw/doppler--rotation--secrets-rotation-engine.md].

Set the rotation interval to at least as long as the slowest-redeploying consumer's restart cadence, plus buffer, or that consumer risks holding an expired credential. Every rotated secret has a dedicated "managing user" credential Doppler uses to perform the rotation - use it for nothing else, per Doppler's own strong recommendation [raw/doppler--rotation--secrets-rotation-engine.md].

## Audit logs - two distinct systems, don't conflate them

| System | Answers | Gating permission |
| --- | --- | --- |
| **Access Logs** | Who READ a secret's value, and when (first/most-recent), via which actor type | `enclave_config_access_logs` [raw/doppler--audit--access-logs-and-activity-logs.md] |
| **Activity Logs / Config Logs** | Who CHANGED something, with a rollback-capable commit-style history per config | `logs` (own-visible) / `logs_audit` (workplace-wide) [raw/doppler--audit--access-logs-and-activity-logs.md] |

"Access" is defined strictly as a request that actually returned a value payload - a no-op poll (e.g. Kubernetes Operator finding nothing changed) is not logged as an access event. Activity Log forwarding to Slack/Discord/MS Teams/Generic HTTPS/AWS SQS (Enterprise) supports multiple independent destinations per type as of the April/June 2026 changelog - the mechanism for feeding an external SIEM rather than relying solely on the in-dashboard view [raw/doppler--audit--access-logs-and-activity-logs.md].

## When Doppler earns its place over Vercel env vars alone

This is this skill's synthesis of the sourced facts, stated as a judgment call, not a Doppler marketing claim:

- Secrets need to reach more than Vercel (a GitHub Actions job, a local script, a separate worker) - one source of truth beats N independently-managed copies.
- Any credential needs a real rotation story.
- A per-secret access audit trail is an actual requirement (compliance, incident response).
- Access control needs to be finer than "who can open the Vercel project settings page."

A single-service SvelteKit app on Vercel with no CI secret usage, no compliance audit requirement, and no rotation need for its handful of keys can legitimately stay on raw Vercel Sensitive environment variables - don't reach for Doppler by default. Full comparison table: `references/vercel-doppler-comparison.md`.

## Where to go next

- Full comparison table: `references/vercel-doppler-comparison.md`
- Access control mechanics feeding the audit trail: `guides/04-service-tokens-scoping-access-control.md`
