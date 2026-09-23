# Environment variable checklist: SvelteKit + Neon on Vercel

Grounded in `research/distilled-vercel.md` §4, §11.

## Audit before every ship

```bash
vercel env ls production
vercel env ls preview
vercel env ls development
```

Compare the three outputs side by side. A variable present in production but missing in preview (or vice versa) is the most common cause of "works in preview, breaks in prod" reports. Do this every time a new env var is added, not just at project setup.

## Standard variable table for this stack

| Variable | Environments | Sensitive? | Source | Notes |
|---|---|---|---|---|
| `DATABASE_URL` | Production, Preview, Development | Yes | Neon integration (auto) or manual | Pooled connection, use for app runtime queries |
| `DATABASE_URL_UNPOOLED` | Production, Development | Yes | Neon integration (auto) | Direct connection, use for migration tooling only |
| `NEON_AUTH_BASE_URL` / `VITE_NEON_AUTH_URL` | Production, Preview | No (URL, not secret) | Neon Managed Better Auth (if enabled) | Only present if Managed Better Auth is on |
| Any third-party API key | Production, Preview (scope per branch if needed) | Yes, use `--sensitive` | Manual | `--sensitive` only applies to Production/Preview, not Development |
| Public/client-exposed config | Production, Preview, Development | No | Manual | Prefix per SvelteKit convention (`PUBLIC_*`) so it's safe to expose to the client bundle |

## Adding a variable correctly

```bash
vercel env add DATABASE_URL production
vercel env add DATABASE_URL preview
vercel env add API_SECRET production --sensitive
vercel env add DATABASE_URL preview feature-branch   # branch-specific override
```

## Local verification

```bash
vercel pull --environment=production
vercel pull --environment=preview --git-branch=feature-branch
```

Check the actual `.vercel/.env.<environment>.local` file written - don't assume it silently merged into `.env.local`.

## Rollback trap

Instant Rollback does **not** rebuild environment variables (distilled §12). If you changed an env var in project settings after the deployment you're rolling back to was built, the rollback restores the OLD env state, not your current settings. Confirm this is expected before confirming a rollback during an incident.

## Turborepo monorepo addendum

If this stack sits in a Turborepo monorepo, declare every env var that affects build output in `turbo.json`'s `env` (task-scoped) or `globalEnv` (all tasks) keys. An undeclared env var can produce a stale cache hit that ships one environment's config into another (distilled §14).
