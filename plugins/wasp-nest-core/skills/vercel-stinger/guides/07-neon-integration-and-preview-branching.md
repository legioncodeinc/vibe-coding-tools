# Guide 7: Neon integration and preview branching

Grounded in `references/research/distilled-vercel.md` §11, `references/research/raw/vercel--neon--integration-guide.md`.

## When to walk this guide

Wiring a Neon Postgres database into a Vercel project, or deciding which of the three connection paths to use.

## Pick one path deliberately

| | Vercel-Managed | Neon-Managed | Manual |
|---|---|---|---|
| Billing | Through Vercel | Through Neon | Through Neon |
| Preview branching | Yes | Yes | No |
| Branch cleanup | Tied to Vercel deployment retention (can lag months) | Tied to Git branch deletion (predictable) | N/A |

Vercel-Managed and Neon-Managed cannot coexist in the same project. Each Neon project maps to exactly one Vercel project.

**Default recommendation for this stack**: if the team already has a Neon account, use **Neon-Managed**. Its cleanup is tied to Git branch deletion, which is predictable and matches how preview environments actually get torn down in a normal PR workflow - the Vercel-Managed path's cleanup can lag behind by months since it's tied to Vercel's own deployment retention policy, which quietly accumulates orphaned preview branches.

## Setup (Neon-Managed)

1. Vercel Marketplace → Connectable Accounts → Neon → "Link Existing Neon Account."
2. Select the Vercel project(s) allowed to use the integration.
3. Enable "Automatically delete obsolete Neon branches" - cleans up on Git branch deletion. Cleanup runs on the next preview deployment after the branch is gone, not instantly.
4. If the app uses Neon's Managed Better Auth, confirm it's enabled on the production branch so `NEON_AUTH_BASE_URL`/`VITE_NEON_AUTH_URL` get set automatically and preview branches get independent auth data.

## Environment variables set by the integration

- `DATABASE_URL` - pooled connection. Use for app runtime queries.
- `DATABASE_URL_UNPOOLED` - direct connection. Use for migration tooling or any client that can't work through a connection pooler (some migration frameworks require a direct connection).
- Legacy `POSTGRES_URL`/`PG*` vars - set for backward compatibility, prefer the modern names for new code.

Preview variables are injected **dynamically per deployment** - each preview deployment automatically gets its own isolated `preview/<branch>` Neon branch via a webhook the integration receives from Vercel, not a shared preview database across all branches.

## Legacy "Vercel Postgres" note

If the codebase or its dependencies still reference `@vercel/postgres`, know that "Vercel Postgres" as a distinct product no longer exists post the Q4 2024-Q1 2025 transition - it is Neon under the hood. `@vercel/postgres` still works but is unmaintained. For new code, use `@neondatabase/serverless` directly; for a minimal-diff migration of existing `@vercel/postgres` call sites, `@neondatabase/vercel-postgres-compat` is the drop-in replacement.

## Common mistakes

- Running both Vercel-Managed and Neon-Managed integrations on the same project (they're mutually exclusive).
- Using `DATABASE_URL_UNPOOLED` for normal app queries - reserve it for migrations/tools that specifically need a direct connection.
- Assuming preview branches share one database - they don't, each gets its own isolated Neon branch per deployment.
- Writing new code against `@vercel/postgres` when `@neondatabase/serverless` is the actively-developed option.
