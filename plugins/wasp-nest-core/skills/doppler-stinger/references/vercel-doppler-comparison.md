# Doppler vs. raw Vercel environment variables

Grounded in [raw/doppler--vercel--integration-and-marketplace.md], [raw/doppler--audit--access-logs-and-activity-logs.md], [raw/doppler--rotation--secrets-rotation-engine.md], [raw/doppler--project-config--workplace-structure-naming.md], [raw/doppler--comparison--env-files-vs-secrets-manager.md]. See `references/research/distilled-doppler.md` §10 for the narrative version.

| Capability | Vercel env vars alone | Doppler (synced to Vercel) |
| --- | --- | --- |
| Multi-environment sync | Native per-project Development/Preview/Production buckets, Vercel-only | Same three buckets, PLUS the same secret fans out to every other synced destination (GitHub Actions, AWS, GCP, local dev) from one source of truth [raw/doppler--vercel--integration-and-marketplace.md] |
| Cross-project secret referencing | Not a Vercel-native concept - copy-paste between projects | `${project.config.SECRET_NAME}` references, paid plans [raw/doppler--project-config--workplace-structure-naming.md] |
| Audit log (who changed a value) | Vercel dashboard shows current values to authorized users; no first-party per-secret change/access log surfaced in this research | Activity Logs (who changed what) + Config Logs (rollback-capable commit-style history) [raw/doppler--audit--access-logs-and-activity-logs.md] |
| Access log (who read a value) | Not found in this research as a Vercel-native capability | Per-secret Access Log: actor, method, first/most-recent read time [raw/doppler--audit--access-logs-and-activity-logs.md] |
| Rotation | No native rotation engine | Two-secret-strategy rotation (issuer/updater), Team/Enterprise plan, propagates through the same Vercel sync automatically on rotation [raw/doppler--rotation--secrets-rotation-engine.md] |
| Environment-level access control | Vercel project-level roles (who can open Settings > Environment Variables) | Doppler Workplace + Project roles, Custom Roles, and group composition for asymmetric per-environment access (write on `dev`, read-only on `stg`, no-visibility on `prd`) [raw/doppler--access-control--permissions-and-custom-roles.md in distillation §8] |
| Dashboard vs. CLI | Vercel dashboard + Vercel CLI, scoped to Vercel-hosted values only | Doppler dashboard + CLI, scoped to every synced destination, not just Vercel [raw/doppler--vercel--integration-and-marketplace.md] |
| Local development | Vercel CLI can pull env vars locally for a linked project | Doppler CLI (`doppler run --`) works identically for local dev, CI, and production, and isn't tied to Vercel as a hosting choice [raw/doppler--cli--install-and-local-dev-workflow.md] |
| Sensitive (write-only) values | Vercel's own "Sensitive" variable type, unreadable after set | Doppler defaults new Vercel syncs to Sensitive; older syncs need a manual delete+recreate to upgrade [raw/doppler--vercel--integration-and-marketplace.md] |

## Reserved variable names that cannot be synced through Doppler into Vercel

`AWS_REGION`, `AWS_DEFAULT_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_KEY`, `AWS_SECRET_ACCESS_KEY`, `AWS_EXECUTION_ENV`, `AWS_LAMBDA_LOG_GROUP_NAME`, `AWS_LAMBDA_LOG_STREAM_NAME`, `AWS_LAMBDA_FUNCTION_NAME`, `AWS_LAMBDA_FUNCTION_MEMORY_SIZE`, `AWS_LAMBDA_FUNCTION_VERSION`, `AWS_SESSION_TOKEN`, `NOW_REGION`, `TZ`, `LAMBDA_TASK_ROOT`, `LAMBDA_RUNTIME_DIR` [raw/doppler--vercel--integration-and-marketplace.md].

## When Doppler earns its place over Vercel env vars alone

This is this skill's synthesis of the sourced facts above, not a direct Doppler quote - stated as a judgment call:

- The app's secrets need to reach more than Vercel: a GitHub Actions CI job, a local script, a worker process, a separate service - one source of truth beats N independently-managed copies.
- Any credential needs a rotation story (database password, third-party API key with a known-compromise blast radius).
- A per-secret access audit trail is a real requirement (compliance, incident response, "who touched the production DB credential last month").
- Access control needs to be finer than "can this person open the Vercel project settings page" - e.g. write access to `dev` without any visibility into `prd` secret values.

## When raw Vercel env vars alone remain legitimate

A single-service SvelteKit app deployed only to Vercel, with no CI job that needs secrets, no compliance requirement for an access audit trail, and no rotation need for its handful of API keys - Vercel's own Sensitive environment variables are a real, simpler, one-less-vendor choice. Don't reach for Doppler by default; reach for it when one of the bullets above is actually true for this project.
