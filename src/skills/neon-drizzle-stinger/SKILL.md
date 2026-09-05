---
name: "neon-drizzle-stinger"
description: "Neon Postgres and Drizzle ORM on SvelteKit/Vercel: connections, schema, migrations, branching, query patterns, pgvector, RLS, and migrating off Supabase. Use for any Neon or Drizzle task."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork. Neon Postgres, Drizzle ORM 0.4x+, Drizzle Kit, SvelteKit (Svelte 5), Vercel.
metadata:
  hive-bee: neon-drizzle-worker-bee
  domain: database
  research-window: 2026-08-14
---

# Neon Drizzle Stinger

You are equipping **neon-drizzle-worker-bee** for a stack migrating off Supabase onto Neon Postgres with Drizzle ORM, on SvelteKit (Svelte 5) deployed to Vercel. Migration guidance carries equal weight with greenfield guidance here, this skill assumes an existing Supabase app as often as it assumes a blank slate.

Every fact in this skill traces to `references/research/raw/`, fetched 2026-08-14. Where the research is thin or conflicting, the distillation says so plainly. Do not extend a claim past what its citation supports.

## When to use this skill

- Choosing or wiring a Neon connection string, driver, or pooling strategy, especially "which driver on Vercel"
- Designing a Drizzle schema, relations, or an index strategy against Neon
- Running or reviewing a Drizzle Kit migration (`generate`/`migrate`/`push`), or setting up Neon's branch-per-PR CI workflow
- Building RAG/AI features with `pgvector` on Neon
- Deciding whether Row Level Security is needed, or enforcing authorization in SvelteKit server code instead
- Migrating an existing Supabase app's database, auth, and RLS policies to Neon, Drizzle, and WorkOS
- Diagnosing a connection-cap error, an unexpected Neon bill, or a cold-start latency complaint

## When not to use this skill

- Generic Postgres schema/indexing/partitioning theory not specific to Neon or Drizzle, that's [db-stinger](../db-stinger), which this skill's migration guide (03) explicitly defers to for expand-backfill-contract mechanics
- WorkOS/AuthKit implementation depth beyond the database-migration touchpoints in guide 06, that's [workos-stinger](../workos-stinger) and [auth-stinger](../auth-stinger)
- Svelte component architecture, routing, or UI concerns unrelated to the data layer, that's [website-stinger](../website-stinger)
- Security audit of RLS/PII/encryption-at-rest as a formal review, that's [security-stinger](../security-stinger); this skill designs the authorization approach, that skill audits it

## Procedure

1. **Classify the task**: greenfield Neon+Drizzle setup, ongoing schema/migration work, a Supabase-to-Neon migration, or a performance/cost investigation. Each routes to a different guide below.
2. **Read the inputs first**: existing `schema.ts`/`relations.ts`, `drizzle.config.ts`, the SvelteKit db client module, `package.json` for Drizzle/Neon package versions, and (for a migration) the Supabase project's current schema and RLS policies. Never assume the stack's shape, read it.
3. **Pick the connection pattern before writing any code.** Walk `guides/01-connection-and-drivers.md` and `references/connection-pattern-decision-matrix.md`, pooled vs direct, and which driver on which runtime, are two separate decisions and the most common source of a wrong answer here.
4. **For schema and relations**, walk `guides/02-schema-design-with-drizzle.md` and start from `references/schema-example.ts`.
5. **For any migration**, walk `guides/03-migrations-and-branching.md`. Never approve `drizzle-kit push` (especially `--force`) against a database holding real data, that is a Ship Gate finding, not a style note.
6. **For queries**, walk `guides/04-query-patterns.md`.
7. **For SvelteKit/Vercel wiring**, walk `guides/05-sveltekit-vercel-integration.md` and `references/sveltekit-db-singleton.md`, the database client is server-only code, always.
8. **For a Supabase migration**, walk `guides/06-supabase-migration.md` and `references/supabase-to-neon-translation-table.md` in full before touching production data. Flag explicitly to the user that Storage and Realtime have no Neon-native replacement, do not let that gap go unstated.
9. **For authorization**, walk `guides/07-authorization-without-rls.md` before assuming RLS is required, it is only mandatory if the app adopts Neon's Data API for client-side queries.
10. **For cost, limits, or a production connection failure**, walk `guides/08-performance-and-cost.md`.

## References map

- `references/research/distilled-neon-drizzle.md`, load when a claim needs its citation traced, or a conflict/gap needs checking before you state something as fact
- `references/research/raw/`, load when verifying a specific distilled claim against its primary source
- `references/schema-example.ts`, load when scaffolding a new table set
- `references/migration-workflow-commands.md`, load when running or explaining any `drizzle-kit` command
- `references/connection-pattern-decision-matrix.md`, load when choosing a driver/pooling strategy for a specific route
- `references/sveltekit-db-singleton.md`, load when placing or reviewing the db client module in a SvelteKit app
- `references/supabase-to-neon-translation-table.md`, load when planning or executing a Supabase-to-Neon cutover

## Related bees and stingers

- [db-worker-bee](../../agents/db-worker-bee.md) - Postgres-first architecture engineer; hand off generic schema/indexing/partitioning/pooling theory not specific to Neon or Drizzle.
- [db-stinger](../db-stinger) - Provider-agnostic Postgres architecture: expand-backfill-contract mechanics, lock classes, indexing decision trees. This skill's migration guide cites it directly rather than re-deriving locking theory.
- [website-stinger](../website-stinger) - SvelteKit/Svelte 5 application concerns beyond the data layer: routing, components, UI state.
- [workos-stinger](../workos-stinger) - Deeper WorkOS/AuthKit implementation guidance beyond the database-migration touchpoints covered in guide 06.
- [security-stinger](../security-stinger) - Formal audit of RLS policies, PII handling, and encryption-at-rest; this skill designs the authorization approach, that skill audits it.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [db-stinger](../db-stinger) - Provider-agnostic Postgres architecture and migration-safety mechanics this skill builds on.
  - [website-stinger](../website-stinger) - SvelteKit/Svelte 5 application-layer guidance beyond the data layer.
  - [workos-stinger](../workos-stinger) - WorkOS/AuthKit implementation depth for the auth-replacement side of a Supabase migration.
  - [auth-stinger](../auth-stinger) - Broader authentication patterns beyond this stack's specific WorkOS integration.
  - [security-stinger](../security-stinger) - Security audit pass for RLS, PII, and encryption-at-rest.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
