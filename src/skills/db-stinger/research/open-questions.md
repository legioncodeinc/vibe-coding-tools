# Open Questions: db-stinger

Tracked unknowns surfaced during the forge. Refresh on each Stinger iteration.

## For the user / orchestrator

1. **Should db-worker-bee actively review SQLite schemas (Turso, embedded)?** Currently in scope only at the platform-choice layer. If users start running Turso for primary data, the schema-design guide may need a SQLite section. Flag for v2.
2. **MySQL: re-confirm scope.** Currently handled only at the PlanetScale platform-choice layer. If users adopt PlanetScale heavily, db-worker-bee may need a "MySQL adjacent" appendix to `01-schema-design.md`.
3. **CockroachDB-specific schema review.** CockroachDB is Postgres-wire compatible but not feature-equivalent (interleaved tables removed in v22, some constraint differences). If users run CockroachDB Serverless, a dedicated note in `08-serverless-platforms.md` may need expanding.

## For future research refresh

1. **`pgroll` at v1.0**: currently 0.13+. Track the GA release; capability matrix may grow.
2. **`pgvector` quantization**: half-precision and binary quantization mentioned in 0.8 release; production benchmarks at scale needed.
3. **Postgres 18**: expected late 2026. Watch for direct I/O, async I/O changes that may affect autovacuum guidance.
4. **Drizzle migration tooling maturity**: `drizzle-kit` advancing fast; revisit ORM comparison annually.

## Resolved during this forge

- ~~MySQL deep ownership?~~ → No. Platform-choice layer only.
- ~~Should db-worker-bee author DDL directly?~~ → Yes for greenfield; brownfield is propose-and-verify.
- ~~Where do TimescaleDB patterns live?~~ → Special-purpose guide for patterns; serverless platforms guide for the platform choice.
