# Vercel integration and sync

Grounded in `references/research/distilled-doppler.md` §6, citing [raw/doppler--vercel--integration-and-marketplace.md].

## Setup, once per Vercel environment

Vercel has three environments - Development, Preview, Production - and **each needs its own separate Doppler integration sync**. There is no single sync that covers all three.

1. In the Doppler project: **Integrations** > **Vercel** > **Authorize** (OAuth to Vercel and back).
2. **Setup Integration**: choose Team, Vercel project, Vercel environment, and the Doppler config to sync from that environment.
3. Repeat via **New Integration** for the remaining Vercel environments.

Recommended mapping for this stack: Doppler `dev` -> Vercel Development (if Vercel Development is actually used - many teams skip it in favor of local dev entirely), Doppler `stg` -> Vercel Preview, Doppler `prd` -> Vercel Production.

## Reserved variable names

A short list of AWS/Lambda-runtime-internal names cannot be synced through Doppler into Vercel (`AWS_REGION`, `TZ`, `LAMBDA_TASK_ROOT`, etc.) - full list in `references/vercel-doppler-comparison.md`. If a Doppler config happens to define one of these (unlikely, but check if a sync silently fails to carry a variable), rename it before it will sync.

## Sensitive vs. Encrypted variable type

Vercel recommends all secrets be stored as **Sensitive** (unreadable back via Vercel's own dashboard/API once set). Doppler defaults new syncs to Sensitive. If an existing sync predates Vercel's Sensitive-variable support, it's still on the older Encrypted type and needs a manual delete-and-recreate (choosing "Delete all secrets in Vercel" on the old sync, then Sensitive on the new one) to upgrade - see the step-by-step in `references/research/raw/doppler--vercel--integration-and-marketplace.md`. Note a delete/recreate can trigger a Vercel redeploy if the project auto-deploys on env var change - do this deliberately, not mid-incident.

## Common failure: name collision with a manually-added Vercel variable

If a sync errors with "Another Environment Variable with the same Name and Environment exists in your project," a variable with that name was added directly in Vercel's dashboard (no Doppler logo next to it) rather than through the sync. Remove the manually-added one in Vercel; Doppler will not silently overwrite it.

## What this buys over Vercel's native env var store alone

Cross-project secret referencing, environment-scoped webhook-triggered redeploys on variable change, and Doppler's own audit/rollback layer (Activity Logs, Config Logs, Access Logs) applied on top of values that still ultimately land as ordinary Vercel env vars at runtime - the app code doesn't change at all, `process.env.DATABASE_URL` still just works. Full comparison table, including when raw Vercel env vars alone remain the simpler and legitimate choice: `references/vercel-doppler-comparison.md`.

## Where to go next

- Local dev workflow that this sync complements: `guides/02-cli-and-local-dev-workflow.md`
- Full Doppler-vs-Vercel-alone comparison: `references/vercel-doppler-comparison.md`
