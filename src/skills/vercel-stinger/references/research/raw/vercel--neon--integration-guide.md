# Vercel + Neon Postgres integration: Vercel-Managed vs Neon-Managed vs Manual, preview branching

- URL: https://neon.com/docs/guides/vercel-overview ; https://neon.com/docs/guides/neon-managed-vercel-integration ; https://neon.com/docs/guides/vercel-postgres-transition-guide
- Fetched: 2026-08-14
- Source type: Official Neon docs
- Component: Neon integration

## Content

### Three connection paths, pick one deliberately

| Feature | Vercel-Managed | Neon-Managed | Manual |
|---|---|---|---|
| Ideal for | New users, single Vercel bill | Existing Neon account, direct Neon billing | Custom CI/CD, no integration needed |
| Neon account | Auto-created via Vercel | Pre-existing | Pre-existing |
| Billing | Through Vercel | Through Neon | Through Neon |
| Setup | Vercel Marketplace → Native Integrations → "Neon Postgres" | Vercel Marketplace → Connectable Accounts → "Neon" | Manual env vars |
| Preview branching | Yes | Yes | No |
| Managed Better Auth | Auto-provisioned on preview branches | Auto-provisioned on preview branches | Manual setup |
| Branch cleanup | Automatic, tied to Vercel deployment retention (can lag by months) | Automatic, tied to Git branch deletion | N/A |

Vercel-Managed and Neon-Managed **cannot coexist** in the same Vercel project. Each Neon project maps to exactly one Vercel project (one-to-one). If you need preview branching driven by your own CI/CD (e.g. GitHub Actions) rather than Vercel's native webhook flow, use Manual instead of either managed integration.

### Neon-Managed integration mechanics (the path for teams with an existing Neon account - the more common case for an established SvelteKit+Neon+Vercel stack)

- Install from Vercel Marketplace → Connectable Accounts → Neon → "Link Existing Neon Account."
- Sets env vars on Production and Development: `DATABASE_URL` (pooled, recommended default), `DATABASE_URL_UNPOOLED` (direct, for tools needing a non-pooled connection), plus legacy `POSTGRES_URL`/`PG*` variables for backward compatibility.
- Preview variables are injected **dynamically per deployment**, not statically set.
- On each Vercel preview deployment, the integration receives a webhook and creates a new Neon branch named `preview/<branch>` via the Neon API - an isolated DB branch per preview, not a shared database.
- "Automatically delete obsolete Neon branches" (recommended, opt-in checkbox) cleans up branches when the corresponding Git branch is deleted; cleanup runs on the next preview deployment after the Git branch is gone, not instantly.
- Managed Better Auth support: if enabled on the production branch, `NEON_AUTH_BASE_URL` / `VITE_NEON_AUTH_URL` env vars are set automatically, and auth data branches alongside the database so each preview gets independent user profiles/sessions.

### Vercel Postgres legacy note

Vercel migrated all "Vercel Postgres" stores to Neon's native integration (Q4 2024-Q1 2025) - any reference to "Vercel Postgres" as a distinct product is legacy naming; it now *is* Neon under the hood, accessible via "Open in Neon" from the Vercel Storage tab. `@vercel/postgres` SDK still works but is deprecated/unmaintained; migration paths are `@neondatabase/vercel-postgres-compat` (drop-in) or `@neondatabase/serverless` (actively developed, recommended for new projects). Drizzle, Prisma, Kysely, and existing env var names continue to work unchanged through the transition.

### Decision guidance for this stack

For a SvelteKit + Neon + Vercel app already on a real Neon account: default to **Neon-Managed**, since it keeps billing/control in Neon and its cleanup ties to Git branch lifecycle (more predictable than Vercel's deployment-retention-based cleanup on the Vercel-Managed path). Use `DATABASE_URL` (pooled) for app runtime queries; reserve `DATABASE_URL_UNPOOLED` for migration tooling or any client that can't work through a connection pooler.
