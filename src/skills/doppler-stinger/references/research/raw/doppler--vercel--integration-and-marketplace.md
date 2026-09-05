# Vercel integration: setup, sync behavior, sensitive env vars

- URL: https://docs.doppler.com/docs/vercel ; https://www.doppler.com/integrations/vercel ; https://www.doppler.com/blog/vercel-marketplace-integration ; https://support.doppler.com/hc/en-us/articles/12963214278427-Error-syncing-secrets-to-Vercel
- Fetched: 2026-08-14
- Source type: Official docs + official blog (docs.doppler.com, doppler.com)
- Component: Vercel integration

## Content

### Prerequisite

An existing Vercel project already using environment variables for configuration.

### Authorization and setup

1. In the Doppler project, **Integrations** > **Vercel** > **Authorize** (OAuth redirect to Vercel and back).
2. Vercel has **three** environments: Development, Preview (Staging), and Production. **A separate Doppler-to-Vercel integration sync is required for each Vercel environment.**
3. On the Setup Integration page, choose: Team, Vercel project, Vercel environment, and the Doppler config to sync from. Click **Setup Integration** - secrets for that config now auto-sync to Vercel.
4. Repeat via **New Integration** for the remaining Vercel environments (e.g. Doppler `dev` -> Vercel Development, `stg`/branch -> Vercel Preview, `prd` -> Vercel Production).
5. Confirm from the Integrations page - each configured Vercel environment shows its own sync entry.

### Reserved environment variable names

These cannot be used in a Doppler config that syncs to Vercel - they're reserved for the Vercel/AWS Lambda runtime and will conflict: `AWS_REGION`, `AWS_DEFAULT_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_KEY`, `AWS_SECRET_ACCESS_KEY`, `AWS_EXECUTION_ENV`, `AWS_LAMBDA_LOG_GROUP_NAME`, `AWS_LAMBDA_LOG_STREAM_NAME`, `AWS_LAMBDA_FUNCTION_NAME`, `AWS_LAMBDA_FUNCTION_MEMORY_SIZE`, `AWS_LAMBDA_FUNCTION_VERSION`, `AWS_SESSION_TOKEN`, `NOW_REGION`, `TZ`, `LAMBDA_TASK_ROOT`, `LAMBDA_RUNTIME_DIR`.

### Sensitive vs. Encrypted Vercel env vars

Vercel recommends storing all secrets as **Sensitive** environment variables (unlike Encrypted, Sensitive values cannot be read back via the Vercel dashboard or API once set). Doppler defaults new Vercel syncs to Sensitive. Syncs created before Vercel shipped Sensitive-variable support may still be on the older Encrypted setting and must be manually recreated to upgrade:

1. Integrations page > find the Vercel connection > per sync, **Delete** (choose "Delete all secrets in Vercel" too, to avoid orphaned Encrypted vars) - note this can trigger a redeploy if the Vercel project auto-deploys on env var change.
2. Recreate the sync, selecting **Sensitive**.
3. Verify the Sensitive badge appears next to the synced variables in Vercel's dashboard.

### Known sync error: name collision

If a Vercel sync fails with "Another Environment Variable with the same Name and Environment exists in your project," it means a variable was manually added in Vercel's own dashboard with a name that also exists in the syncing Doppler config. Doppler will not silently overwrite a manually created Vercel variable. Fix: in Vercel Settings > Environment Variables, find variables WITHOUT the Doppler logo that collide with a Doppler-managed name, remove them, and the sync completes.

### What Doppler adds beyond Vercel's own env var storage (per Doppler's own marketing/integration copy - read as vendor claims, not independently verified benchmarks)

"Doppler extends Vercel's environment variable workflow by adding features such as cross-project variable referencing and automatic redeployment when variables change using environment-specific webhooks." Also claimed: Git-style activity logs, rollback support, secret referencing, webhooks on secret changes, environment-level access controls - "a centralized platform for secret management, ensuring enhanced security and reduced risk of mismanagement."
