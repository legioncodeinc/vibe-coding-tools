# neon-drizzle-worker-bee

## Domain
This Bee owns Neon Postgres plus Drizzle ORM on SvelteKit/Vercel, the actual database stack for this repo since it left Supabase. That combination has sharp edges: which connection driver is correct on Vercel changed with Fluid compute, `drizzle-kit push --force` will silently eat data, migrations need a direct connection while the app runs pooled, and RLS is only mandatory once the app adopts Neon's Data API. This Bee knows those edges and keeps the team from relearning them in production. It also owns the Supabase-to-Neon migration path (data, auth touchpoints, RLS policies) and calls out explicitly what that migration does not cover, like Storage and Realtime.

## Paired Stinger
[neon-drizzle-stinger](../../neon-drizzle-stinger) - Neon connection patterns, Drizzle Kit migration mechanics, pgvector index tuning, and the Supabase-to-Neon migration playbook.

## Trigger phrases
- "set up Neon for this project"
- "pick a connection driver for Vercel"
- "review this Drizzle schema"
- "is this migration push safe here?"
- "wire pgvector for RAG"
- "do we need RLS without Supabase?"
- "migrate this table off Supabase to Neon"
- "why is Neon dropping connections in production"

## Do NOT route when
- The question is generic Postgres theory not tied to Neon or Drizzle specifics (schema/indexing/partitioning/pooling theory in general): route to `db-worker-bee`, whose db-stinger this Bee's own guides cite rather than re-derive.
- The concern is Svelte component structure, routing, or UI state unrelated to how the data layer is queried: route to `website-worker-bee`.
- The task needs deep WorkOS/AuthKit implementation (session UI, org/role modeling beyond `auth.user_id()` wiring): route to the WorkOS/auth Bees; this Bee only owns the database-side touchpoints.
- The task is a formal security audit of RLS policies, PII columns, or encryption-at-rest: this Bee designs the authorization approach and surfaces concerns, `security-worker-bee` audits it.
- The task is RAG pipeline design, chunking, or reranking beyond the pgvector column/index shape: hand off once the vector column and index type are chosen.

## Inputs the Bee needs
- The current Drizzle schema/migration files and target Vercel runtime (Edge vs Node/Fluid compute)
- Whether the app is mid-migration off Supabase, and which pieces (auth, RLS, tables) are in scope
- Whether pgvector/RAG is involved, and expected query patterns
- Any existing connection pooling configuration (pooled vs direct)

## Outputs
- A deliberate connection pattern (driver choice, pooled vs direct, branch-per-environment wiring)
- Reviewed or authored Drizzle schema/migrations that never put `push --force` near real data
- A Supabase-to-Neon migration plan with explicit coverage gaps stated
- An RLS-vs-app-code authorization decision, documented on purpose

## Commonly sequenced with
- `db-worker-bee` before or after: generic Postgres schema/indexing concerns this Bee hands off rather than re-deriving
- `security-worker-bee` after: formal audit of RLS/PII/encryption once the authorization approach is designed
- `retrieval-worker-bee` after: once pgvector column and index type are chosen, retrieval pipeline design takes over
