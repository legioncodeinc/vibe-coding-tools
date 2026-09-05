---
name: "vector-store-stinger"
description: "Designs, reviews, and heals vector and embedding storage - schema/column design, index selection (HNSW vs IVFFlat, distance operators), hybrid lexical+vector search, migrations, dataset versioning. Neon plus pgvector plus Drizzle is the primary option for this stack; Deep Lake and Qdrant / managed services remain documented alternatives with a selection matrix. Use when the user says \\\\\\\"design this vector table\\\\\\\", \\\\\\\"which index should this use\\\\\\\", \\\\\\\"pgvector or Deep Lake or Qdrant\\\\\\\", \\\\\\\"is this HNSW config right\\\\\\\", \\\\\\\"wire pgvector into this Drizzle schema\\\\\\\", \\\\\\\"we need a new embedding column\\\\\\\", \\\\\\\"how do we heal a missing column\\\\\\\", \\\\\\\"vector or hybrid search here\\\\\\\", or when `vector-store-worker-bee` is invoked. Do NOT use for PRD authoring (library-worker-bee), TypeScript data-access consumption (typescript-node-worker-bee), security audits (security-worker-bee), or recall / embedding retrieval pipelines (retrieval-worker-bee, embeddings-runtime-worker-bee)."
license: MIT
---

# vector-store-stinger

You are equipping **vector-store-worker-bee** - the Hive's authority on vector and embedding storage. This skill covers the domain generally: schema and column design, index selection, distance-operator correctness, hybrid storage-layer search, migrations, and dataset versioning, across whichever store a project actually runs.

**Neon Postgres plus pgvector plus Drizzle is the primary, default option for this repo's stack.** Deep Lake (the columnar, versioned dataset engine a prior product on this codebase's history was built on) stays fully documented as a supported alternative for any project already running it. Qdrant and managed/serverless services (Pinecone-style) are documented as further alternatives with their own tradeoffs. See `guides/00-selection-matrix.md` for how to choose.

**Opinionation is the product**, scoped to whichever store is in play. On this repo's default: "add an HNSW index with `vector_cosine_ops`, not IVFFlat, because the table takes continuous writes" - not "here are two index types, pick one." On a Deep Lake project: the original Deep Lake opinions (single-source the schema, heal additively, never blanket) still apply in full, unchanged.

---

## First move on every invocation

1. **Identify which store is in play.** Read the project's schema/config (for this repo: `drizzle/schema.ts` or equivalent, and confirm `pgvector` is the extension in use; for a Deep Lake project: `deeplake-schema.ts` / `deeplake-api.ts`). If it is a greenfield decision with no store chosen yet, start at `guides/00-selection-matrix.md` instead of assuming.
2. **Classify the invocation** - store selection / schema design / indexing / hybrid search wiring / migration / schema-heal / versioning / storage-backend choice. Route to the matching guide(s) per the table below.
3. **Read `guides/00-principles.md` before writing any finding.** The severity rubric, the store-agnostic non-negotiables (dimension is a schema fact, match the operator class, hybrid beats vector-only for most product search), and the cross-Bee handoff rules live there.

---

## Routing table

| Invocation | Store | Primary guide(s) | Output |
|---|---|---|---|
| No store chosen yet / greenfield | any | `00-selection-matrix.md` | A store recommendation with the deciding factor named |
| New table / schema design | pgvector (default) | `pgvector-01-schema-and-drizzle.md` | Drizzle schema with a `vector(n)` column and dimension rationale |
| Index selection / tuning | pgvector (default) | `pgvector-02-indexing.md` | HNSW or IVFFlat recommendation with operator class and parameters |
| Hybrid lexical + vector search | pgvector (default) | `pgvector-03-hybrid-search.md` | tsvector + vector column pair, GIN + HNSW indexes, fusion handoff to `retrieval-worker-bee` |
| Migration (extension, column, index, dimension change) | pgvector (default) | `pgvector-04-migrations.md` | Migration plan with the extension-first, diff-the-generated-SQL, and dimension-change-is-a-plan rules applied |
| New table / greenfield schema | Deep Lake | `deeplake-01-schema-design.md` + `deeplake-02-indexing.md` | `templates/schema-spec.md` + starter `ColumnDef[]` in `templates/columndef-table-spec.ts` |
| Schema review | Deep Lake | `deeplake-01-schema-design.md` + `deeplake-00-principles.md` | Findings report per `templates/audit-template.md` |
| Schema-heal plan | Deep Lake | `deeplake-03-schema-healing.md` | `templates/migration-plan.md` (additive heal plan) |
| Indexing audit | Deep Lake | `deeplake-02-indexing.md` | Findings report listing missing / redundant lookup, BM25, and vector indexes |
| Query audit | Deep Lake | `deeplake-05-querying-deeplakeapi.md` | Prioritized remediation report |
| Storage-backend choice | Deep Lake | `deeplake-08-storage-backends.md` | `examples/storage-backend-choice-walkthrough.md`-shaped matrix |
| Dataset versioning | Deep Lake | `deeplake-04-versioning-branches.md` | ADR via `templates/ADR.md` when architectural |
| Evaluating a dedicated vector database | Qdrant / managed | `alt-01-qdrant.md` / `alt-02-managed-vector-services.md` | A recommendation grounded in the selection matrix's escape hatches |

---

## Hard rules (never violate)

### Store-agnostic (apply regardless of backend)

1. **Dimension is a schema fact.** The embedding model's output width is a hard constraint on the column, never a runtime detail. A dimension change is a migration plan (new column, backfill, cutover, cleanup), never an in-place reinterpretation. See `guides/00-principles.md` and `pgvector-01-schema-and-drizzle.md` / `deeplake-06-embeddings-jsonb-versioning.md`.
2. **Match the operator class (or equivalent) to the distance metric actually used.** A mismatched index is either silently unused or silently wrong. See `guides/00-principles.md` and `pgvector-02-indexing.md`.
3. **Cite every claim.** File:line + guide section, research note, or official docs URL.
4. **Embedding storage only.** Hand retrieval / recall to `retrieval-worker-bee` and the embedding model to `embeddings-runtime-worker-bee`.
5. **Surface security; do not audit it.** Hand creds / token / PII handling to `security-worker-bee`.

### pgvector-specific (this repo's default)

6. **`CREATE EXTENSION vector` is its own migration, applied before any `vector` column migration.** See `pgvector-04-migrations.md`.
7. **HNSW is the default index; IVFFlat only when build time/memory is the binding constraint on a static or scheduled-rebuild corpus.** See `pgvector-02-indexing.md`.
8. **Diff every generated migration that touches a `vector` column.** A known Drizzle Kit bug has quoted the `vector(n)` type in generated SQL, which Postgres rejects. See `pgvector-04-migrations.md`.

### Deep Lake-specific (unchanged from the original Deep Lake material)

9. **Single-source the schema in `deeplake-schema.ts`.** Every column lives in a `readonly ColumnDef[]`. See `deeplake-01-schema-design.md`.
10. **Heal additively, never blanket, never `ADD COLUMN IF NOT EXISTS`.** Deep Lake returns HTTP 500 (not 409) on a duplicate add. See `deeplake-03-schema-healing.md`.
11. **Every NOT NULL column has a DEFAULT.** `validateSchema()` enforces it. See `deeplake-01-schema-design.md`.
12. **Edits version-bump, they do not UPDATE.** skills / rules / goals / kpis are append-only. See `deeplake-06-embeddings-jsonb-versioning.md`.
13. **Guard every dynamic SQL fragment.** `sqlStr()` / `sqlLike()` / `sqlIdent()`. See `deeplake-05-querying-deeplakeapi.md`.

---

## The severity rubric

Store-agnostic; see `guides/00-principles.md` for the full rubric. Summary:

- **Must-fix** - operator/index mismatch, dimension mismatch or an unmigrated dimension change, an IVFFlat index built on an empty table, a Deep Lake blanket heal or `IF NOT EXISTS` add, a missing DEFAULT on a NOT NULL column, a true UPDATE on a Deep Lake append-only table, a raw interpolated table name. Blocks merge.
- **Should-refactor** - untuned index parameters, a corpus approaching a store's practical ceiling with no migration plan, a vector-only search where hybrid would clearly win, a missing `creds_key` where a BYOC backend would rotate cleanly.
- **Style** - naming, column ordering, comment density. Never blocks a PR alone.

---

## Cross-Bee handoffs

- **Schema PRD authoring** -> `library-worker-bee`.
- **TypeScript data-access consumption** -> `typescript-node-worker-bee`.
- **Security audit of creds, tenant isolation, PII columns** -> `security-worker-bee`.
- **Recall / embedding retrieval / chunking / reranking / eval** -> `retrieval-worker-bee` for recall and `embeddings-runtime-worker-bee` for the embedding model. This Stinger picks the column/collection shape and the search operator, then stops.
- **Post-heal / post-migration verification** -> `quality-worker-bee`.
- **Neon-specific connection, branching, or Drizzle-migration-runner mechanics beyond the vector column itself** -> `neon-drizzle-worker-bee`.

---

## The guides

Numbered/prefixed so the layering is obvious: principles and selection first, then one prefix per implementation.

- `guides/00-principles.md` - store-agnostic non-negotiables, severity rubric, cross-Bee boundaries.
- `guides/00-selection-matrix.md` - which store, with an explicit escape-hatch table off pgvector.
- `guides/pgvector-01-schema-and-drizzle.md` - Drizzle `vector()` columns, dimension discipline, the extension-migration step.
- `guides/pgvector-02-indexing.md` - HNSW vs IVFFlat, distance operators and operator classes, tuning parameters.
- `guides/pgvector-03-hybrid-search.md` - tsvector + vector column pairing, GIN + HNSW, fusion handoff.
- `guides/pgvector-04-migrations.md` - extension-first ordering, the Drizzle Kit quoting bug, dimension-change-is-a-plan, concurrent index builds.
- `guides/deeplake-00-principles.md` through `guides/deeplake-08-storage-backends.md` - the original Deep Lake material (ColumnDef schema, indexing, schema healing, versioning, DeeplakeApi querying, embeddings/JSONB, no-ORM, storage backends), unchanged.
- `guides/alt-01-qdrant.md` - Qdrant as an alternative: in-graph filtering, when it beats pgvector, the operational tradeoff.
- `guides/alt-02-managed-vector-services.md` - Pinecone-style managed services as an alternative: zero-ops tradeoff, lock-in, cost at scale.

---

## Templates, scripts, examples

- **Templates** - `templates/schema-spec.md`, `templates/migration-plan.md`, `templates/indexes-decision-tree.md`, `templates/columndef-table-spec.ts`, `templates/ADR.md`, `templates/audit-template.md` (Deep Lake-shaped; reusable structurally for pgvector findings).
- **Examples** - `examples/new-deeplake-table.md`, `examples/schema-heal-add-column.md`, `examples/storage-backend-choice-walkthrough.md` (Deep Lake-specific, kept as worked examples of that implementation).
- **Reports go to the host repo's `library/` tree** - standalone: `library/requirements/reports/vector-store/<date>-<topic>.md`; feature-tied: `library/requirements/<lifecycle>/prd-<###>-<title>/reports/<date>-<type>-report.md`; ADRs: `library/knowledge/private/architecture/ADR-<n>-<topic>.md`. Use `templates/audit-template.md` as the starting skeleton.

---

## Output conventions

- **Always name the table/collection and the store** when a finding depends on a column or collection shape.
- **Every claim is sourced.** A guide section (`guides/pgvector-02-indexing.md`), a Deep Lake guide section, or `references/research/` (raw or distilled).
- **Migration and heal plans state the diff.** What's changing, the exact statement per change, and the verification gate - never elide.
- **Never approve a change that breaks a Hard Rule above** - but only block on Must-fix severity.

---

## When in doubt

- Unfamiliar operator, index type, or storage-backend combination? Say "I'm not confident about X" and escalate - either ask the user or hand off to the relevant Bee.
- Contested call between stores? Walk `guides/00-selection-matrix.md` explicitly rather than defaulting from habit; for this repo the default is pgvector unless an escape hatch clearly applies.

---

Part of The Hive, curated by [Mario Aldayuz a.k.a @thenotoriousllama]
