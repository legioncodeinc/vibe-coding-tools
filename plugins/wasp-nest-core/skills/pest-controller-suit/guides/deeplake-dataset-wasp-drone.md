# deeplake-dataset-wasp-drone

## Domain
This Drone is the Deep Lake data architecture engineer for the Wasp Nestmind: the 7-table `ColumnDef` schema (memory, sessions, skills, rules, goals, kpis, codebase), `USING deeplake` DDL and `buildCreateTableSql`, `FLOAT4[768]` embeddings (nomic-embed-text-v1.5), additive schema healing, append-only version-bump writes, the indexing decision tree (lookup, BM25, vector, hybrid), DeeplakeApi querying discipline, SQL-guard hygiene, dataset versioning, and BYOC storage backend selection.

## Paired Stinger
[deeplake-dataset-stinger](../../deeplake-dataset-stinger) - the ColumnDef design guides, the additive-healing playbook, the indexing decision tree, and the storage-backend matrix this Drone applies before touching a table.

## Trigger phrases
- "design this table"
- "review this ColumnDef"
- "should this be JSONB or a column"
- "is this index right"
- "we need a new NOT NULL column on the memory table"
- "how do we heal a missing column"
- "vector or hybrid search here"
- "which storage backend"

## Do NOT route when
- The task is PRD authoring of the schema from product intent: that is `library-wasp-drone`'s job, this Drone implements after the PRD lands.
- The task is TypeScript data-access consumption at the query call site: route to `typescript-node-wasp-drone`.
- The task is a security audit of creds, `creds_key`, token handling, or PII columns: route to `security-wasp-drone`, this Drone designs the storage shape, it does not audit secrets.
- The task is recall tuning, chunking, or reranking: route to `retrieval-wasp-drone`.
- The task is the embedding model itself: route to `embeddings-runtime-wasp-drone`.

## Inputs the Drone needs
- Classification of the invocation: new table, schema review, indexing audit, schema-heal plan, query audit, versioning plan, or storage-backend choice
- `src/deeplake-schema.ts` (the `ColumnDef[]`) and `src/deeplake-api.ts`
- The relevant healing, index, or query code already in the repo
- `package.json` for the current Deep Lake and Activeloop client versions
- The deployment target, when the question is storage backend selection

## Outputs
- A `ColumnDef` schema spec with NOT NULL and DEFAULT discipline verified
- An additive migration plan for schema healing, never a blanket `ALTER TABLE`
- An indexing decision (lookup, BM25, vector, or hybrid) cited to the decision tree
- A DeeplakeApi query review with SQL guards (`sqlStr`, `sqlLike`, `sqlIdent`) applied
- An ADR when the call is architectural, or an audit report filed under the repo's library schema
- Storage-backend recommendation with the raw-creds versus `creds_key` decision stated

## Commonly sequenced with
- `library-wasp-drone` before, when the schema originates from a feature PRD
- `typescript-node-wasp-drone` after, for the data-access consumption layer
- `security-wasp-drone` when a finding touches creds or PII columns
- `retrieval-wasp-drone` and `embeddings-runtime-wasp-drone` after, for recall tuning and embedding-model choice
- `quality-wasp-drone` after, to run the verification queries this Drone writes
