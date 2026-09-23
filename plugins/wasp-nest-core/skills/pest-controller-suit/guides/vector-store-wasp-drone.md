# vector-store-wasp-drone

## Domain
This Drone owns vector and embedding storage generally: schema and column design, index selection (HNSW vs IVFFlat, distance operators), hybrid lexical+vector search at the storage layer, migrations, and dataset versioning. Neon Postgres plus pgvector plus Drizzle is the primary option for this repo's stack; Deep Lake (the columnar, versioned dataset engine a prior product on this codebase's history was built on) stays fully documented as a supported alternative, and Qdrant / managed services round out the selection matrix.

## Paired Stinger
[vector-store-stinger](../../vector-store-stinger) - the selection matrix, the pgvector schema/indexing/hybrid-search/migration guides, the original Deep Lake guides (unchanged), and the Qdrant/managed-service alternative guides.

## Trigger phrases
- "design this vector table"
- "which index should this vector column use"
- "pgvector or Deep Lake or Qdrant"
- "is this HNSW config right"
- "wire pgvector into this Drizzle schema"
- "we need a new embedding column"
- "how do we heal a missing column"
- "vector or hybrid search here"

## Do NOT route when
- The ask is a PRD describing the data model from product intent: that's library-wasp-drone, this Drone implements after the PRD lands.
- The ask is TypeScript data-access consumption at query call sites: that's typescript-node-wasp-drone, this Drone flags read-amplification risk at the query level and hands off.
- The ask is a security audit of creds, tenant isolation, or PII columns: that's security-wasp-drone, this Drone designs the storage shape.
- The ask is recall tuning, chunking, or reranking beyond picking the column/collection shape and search operator: retrieval-wasp-drone owns recall tuning, embeddings-runtime-wasp-drone owns the embedding model itself.

## Inputs the Drone needs
- The project's schema/config: for this repo, the Drizzle schema and confirmation `pgvector` is enabled; for a Deep Lake project, `deeplake-schema.ts` and `deeplake-api.ts`
- The relevant healing, indexing, or query code path in question
- Whether the table takes continuous writes (favors HNSW) or is static/scheduled-rebuild (IVFFlat becomes viable)
- Whether a store has already been chosen, or this is a greenfield selection decision

## Outputs
- Store recommendation (pgvector / Deep Lake / Qdrant / managed) with the deciding factor named, when the store is not yet chosen
- New table/column spec (Drizzle `vector()` column, or Deep Lake `ColumnDef`) or a migration/schema-heal plan
- Indexing recommendation (HNSW/IVFFlat with operator class, or Deep Lake lookup/BM25/vector/hybrid) with rationale

## Commonly sequenced with
- embeddings-runtime-wasp-drone: this Drone picks the column/collection shape, embeddings-runtime-wasp-drone owns the model generating the vectors
- retrieval-wasp-drone: hands off recall tuning and fusion weighting once the search operator and column shape are set
- neon-drizzle-wasp-drone: owns Neon connection/branching and the Drizzle migration runner itself, beyond the vector column
- typescript-node-wasp-drone: consumes the query patterns this Drone designs
