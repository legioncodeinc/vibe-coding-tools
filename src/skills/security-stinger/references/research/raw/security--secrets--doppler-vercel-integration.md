# Vercel - Doppler Docs / Environment variables - Vercel Docs

- URL: https://docs.doppler.com/docs/vercel ; https://vercel.com/docs/environment-variables
- Fetched: 2026-08-14
- Source type: official vendor documentation (Doppler, Vercel)
- Component: secrets management pipeline (Doppler -> Vercel env vars)

## Doppler -> Vercel sync

- Doppler syncs secrets to Vercel via a per-environment integration: Vercel has three environments (Development, Preview, Production) and Doppler requires a SEPARATE integration/config mapping for each one - a config synced to "Production" does not automatically apply to "Preview," so a missing Preview integration is a common way for preview deployments to silently run against stale or wrong secrets (or fail closed, which is safer but still an audit-worthy gap).
- A fixed list of environment variable names is reserved for the Vercel runtime and CANNOT be used in Doppler-synced configs (e.g. `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`, `TZ`, `LAMBDA_TASK_ROOT`, `LAMBDA_RUNTIME_DIR`, and several other `AWS_*`/`NOW_*` names) - attempting to sync a secret under one of these names will not work as expected.
- Vercel recommends storing all secrets as "Sensitive" environment variables (as opposed to legacy "Encrypted"); Sensitive variables CANNOT be read back via the Vercel dashboard or API once set, only overwritten/rotated. Doppler defaults new syncs to Sensitive, but syncs created before Vercel shipped Sensitive-variable support may still use the older Encrypted setting and must be manually deleted (including "Delete all secrets in Vercel") and recreated to upgrade.

## Vercel environment variables generally

- Environment variables are encrypted at rest and visible to any user with access to the Vercel project (i.e., "encrypted at rest" is not the same as "hidden from teammates" - project-level access control is the actual confidentiality boundary for non-Sensitive vars).
- Scoping: variables can be set at team level (available to all projects) or project level. Each variable can be applied to Production, Preview (optionally scoped to specific branches), Development, or custom environments independently - a variable is not automatically shared across environments.
- Total environment variable size cap is 64 KB per deployment across all variables combined (5 KB per single variable specifically for Edge Functions/Middleware on the `edge` runtime) - relevant when a large signing key, certificate, or JWKS blob is stored directly as an env var rather than fetched at runtime.
- Local development variables live in `.env.local` (or are pulled with `vercel env pull` / handled automatically by `vercel dev`) - these are gitignored by Vercel's default project template but not by the platform itself; a developer must not commit `.env.local` regardless of the source of truth being Doppler.
- Integration-provided environment variables (e.g., the Doppler sync) are visibly labeled with their source integration in Vercel's project settings, which is a useful audit signal to confirm Doppler is actually the source of truth rather than a manually-pasted duplicate.
