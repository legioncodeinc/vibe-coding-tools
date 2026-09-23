# Guide 3: Environment variables and secrets

Grounded in `references/research/distilled-vercel.md` §4, `references/env-var-checklist.md`.

## When to walk this guide

Setting up a new project's env vars, adding a new secret, or diagnosing "works in one environment, breaks in another."

## The three (or more) environments

Production, Preview, Development are the defaults. Pro/Enterprise teams can add Custom Environments (`staging`, `QA`) via `vercel target list`. Every variable is scoped to one or more of these explicitly when created - there's no implicit "applies everywhere" default.

## Preview scoping

Preview variables can apply to all non-production branches, or to one specific branch. A branch-specific value overrides the general preview value for that variable name only - you don't replicate every preview variable per branch, only the ones that need to differ (e.g. pointing a feature branch at a different Neon preview database, though the Neon integration usually handles that automatically - see Guide 7).

## Sensitive variables

`vercel env add API_SECRET production --sensitive` hides the value in the dashboard permanently after creation and behaves identically at runtime. Catch: `--sensitive` variables are **only available in Production and Preview**, not Development. If a sensitive var is missing locally, this is why - pull it via `vercel env pull` rather than trying to read it from the dashboard.

## The audit habit

Run this before every ship, not just at initial setup:

```bash
vercel env ls production
vercel env ls preview
vercel env ls development
```

Compare outputs. A variable present in two environments but missing in the third is the single most common cause of "preview works, prod doesn't" reports per Vercel's own docs.

## Local verification

```bash
vercel pull --environment=production
vercel pull --environment=preview --git-branch=feature-branch
```

Writes to `.vercel/.env.<environment>.local`. Check the actual file, don't assume it merged into `.env.local`.

## Running commands with injected env without writing a file

```bash
vercel env run -e preview -- npm test
vercel env run -e production -- npm run build
```

Useful for CI steps that shouldn't leave env files on disk.

## Rollback interaction - read before an incident

Instant Rollback does not rebuild environment variables. If env vars were changed in project settings after the deployment being rolled back to was built, the rollback restores the OLD env state. Don't assume a rollback picks up current settings.

## Full field table and Neon-specific vars

See `references/env-var-checklist.md`.
