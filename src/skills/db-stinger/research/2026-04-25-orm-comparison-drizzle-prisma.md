# ORM Comparison: Drizzle vs Prisma vs Raw SQL

**Sources:**
- https://orm.drizzle.team/docs/overview
- https://www.prisma.io/docs/orm
- https://kysely.dev/
- WebSearch: "Drizzle vs Prisma vs Kysely 2026 production comparison"
- https://orm.drizzle.team/docs/migrations
- https://www.prisma.io/docs/orm/prisma-migrate

**Retrieved:** 2026-04-25

## Summary

There is no universal "best ORM". The right pick is workload-shaped: how SQL-fluent is the team, how complex is the schema, what's the migration story, and what's the bundle / runtime budget.

## The three options

### Drizzle ORM

**Strengths:**
- TypeScript-native; types flow from schema to query without codegen.
- SQL-fluent: query builder reads like SQL.
- Tiny bundle; works in edge runtimes, Cloudflare Workers, Bun, Deno.
- Migrations via `drizzle-kit`: generates SQL diffs from schema; can also run `pgroll`-style migrations manually.
- Full Postgres feature coverage including `jsonb`, arrays, ranges, custom types.

**Weaknesses:**
- Smaller community than Prisma; fewer plug-and-play patterns.
- Migration tooling is younger: diff-based, not declarative-state-based.
- No generated client: types come from inference.

**When it wins:** SQL-fluent team, edge / serverless runtime, full Postgres feature usage, type-safety without codegen friction.

### Prisma ORM

**Strengths:**
- Industry-leading DX: generated client is autocomplete-perfect.
- Strong migration tooling: `prisma migrate dev` / `deploy` with shadow database for diffs.
- Visual schema (Prisma Studio); ecosystem of plugins.
- Good for complex relational reads (`include` / `select`).

**Weaknesses:**
- Codegen step in build; clients are heavy in serverless runtimes.
- Postgres-specific features (advanced `jsonb` querying, `EXCLUDE`, full range type support) are weaker; team often falls to `$queryRaw`.
- Connection pooling is tricky: needs `pgbouncer=true` flag in connection string AND specific PgBouncer mode.
- Historical N+1 risks resolved in v5+ but still a footgun on large `include` graphs.

**When it wins:** team that wants ergonomics over SQL fluency, large schema with many relations, willing to pay for generated client weight.

### Raw SQL (with Postgres clients like `pg` or `postgres-js`, optionally Kysely as type-safe SQL builder)

**Strengths:**
- Zero abstraction tax; full Postgres feature access.
- Easiest migration: SQL is SQL.
- Tiny bundle, fastest cold start.
- Kysely adds compile-time type safety to raw SQL without becoming an ORM.

**Weaknesses:**
- Manual mapping; team must be SQL-fluent.
- Migrations are plain SQL files: `pgroll` complements well.
- No generated client; types are hand-written or inferred via Kysely.

**When it wins:** SQL-native team, small / focused schema, edge runtime, microservice with one or two tables.

## Decision table

| Concern | Drizzle | Prisma | Raw SQL / Kysely |
|---|---|---|---|
| Type safety | Inferred (excellent) | Generated client (excellent) | Kysely: compile-time SQL types |
| Bundle size | Tiny | Heavy (generated client) | Tiny |
| Edge / serverless cold start | Excellent | Acceptable with care | Excellent |
| Postgres feature coverage | Full | Partial (advanced features fall to raw) | Full |
| Migration tooling | `drizzle-kit` (good, young) | `prisma migrate` (mature) | Plain SQL + `pgroll` |
| N+1 ergonomics | Manual joins (good) | `include` (footgun on large graphs) | Manual joins |
| Team SQL fluency required | Medium | Low | High |

## N+1 risk patterns (cross-cuts react-worker-bee)

The most common N+1 in any ORM is "`include` looks innocent in the query, but each row fans out to its own SELECT". db-worker-bee's responsibility is to **flag the risk in the schema/query layer** and hand off to `react-worker-bee` for the data-layer remediation (RSC vs route loader vs TanStack Query batching).

Common shapes:
- `users.findMany({ include: { posts: { include: { comments: true } } } })`: Prisma loads posts in one query but comments per post if not careful.
- `for (const user of users) { const posts = await db.select(...).where(eq(posts.userId, user.id)); }`: classic in-loop fetch.

The fix is always either (a) one bigger SQL with a join, (b) a batched IN-list, or (c) a `dataloader`-style coalesce.

## Relevance to this stinger

Spine of `guides/07-orm-choice.md`. Drives hard rule #7 (ORM choice is a workload question).
