# db-worker-bee

## Domain
This Bee is the generic PostgreSQL architecture engineer for any stack in this repo that is not the Neon+Drizzle SvelteKit setup. It owns relational schema design, index selection, zero-downtime migrations (expand-backfill-contract, `pgroll`), partitioning, performance and pooling, ORM choice (Drizzle vs Prisma vs raw SQL) as a general question, and serverless DB platform choice (Supabase, Neon, Turso, PlanetScale, CockroachDB, Tiger Data) as a comparative decision rather than an implementation.

## Paired Stinger
[db-stinger](../../db-stinger) - schema design, indexing decision tree, migration lock-class tables, performance and pooling guides, plus ORM and platform comparison matrices.

## Trigger phrases
- "design this schema"
- "review this migration"
- "should this be jsonb or columns?"
- "we need a NOT NULL on a 100M-row table"
- "Drizzle or Prisma?"
- "Supabase or Neon?"
- "production query is slow, read this EXPLAIN"
- "is this index right?"

## Do NOT route when
- The project is this repo's actual stack (SvelteKit + Neon + Drizzle + Vercel): that specific combination, including driver choice, `drizzle-kit push` safety, and Neon branch-per-PR workflow, is neon-drizzle-worker-bee's territory. db-worker-bee handles generic Postgres theory that isn't Neon- or Drizzle-specific; neon-drizzle-worker-bee's own guides cite db-stinger rather than re-deriving it.
- The ask is a PRD describing the data model from product intent: that's library-worker-bee, db-worker-bee implements after the PRD lands.
- The ask is data-layer consumption in React components (TanStack Query, RSC, N+1 at the component edge): that's react-worker-bee.
- The ask is a formal security audit of RLS, PII columns, or encryption-at-rest: this Bee designs RLS hooks, security-worker-bee audits them.
- The ask is RAG retrieval, chunking, or reranking beyond picking `pgvector` and the index family: that's mind-worker-bee.

## Inputs the Bee needs
- Existing DDL or ORM schema file (`schema.prisma` / `schema.ts`) and recent migrations
- Query plans (`EXPLAIN (ANALYZE, BUFFERS)`) for performance work, not just "it's slow"
- Pooler config and `package.json` for ORM/platform versions
- Table size, since migration safety strategy depends on row count

## Outputs
- Schema spec, migration plan with lock classes, or indexing decision
- ORM or platform choice ADR
- Audit report classified must-fix / should-refactor / style

## Commonly sequenced with
- neon-drizzle-worker-bee: the sibling Bee for this repo's actual Neon+Drizzle stack; hands off when the work turns Neon- or Drizzle-specific
- security-worker-bee: audits RLS, PII, and encryption after this Bee designs the hooks
- quality-worker-bee: runs the post-migration verification queries this Bee writes
