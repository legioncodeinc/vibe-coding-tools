# Alternative: managed / serverless vector services (Pinecone-style)

Labeled alternative, not this repo's default. Reach for this guide only after the selection matrix (`00-selection-matrix.md`) points here: a team that wants vector search infrastructure owned entirely by a vendor. Sourced from `references/research/raw/devto--pgvector-vs-pinecone-vs-qdrant-when-dedicated-vector-db-worth-it.md` and `references/research/raw/kalviumlabs--vector-databases-compared-pgvector-pinecone-qdrant-weaviate-2026.md`. Pinecone is the reference example; the tradeoffs below generalize to any fully managed, closed-source, API-only vector database.

## What it is

A fully managed, closed-source vector database delivered as a cloud API. There is no server to run, no index type to pick, no HNSW parameter to tune; the workflow is upsert vectors and query. Serverless pricing tiers separate storage from compute, so cost tracks usage rather than provisioned capacity.

## Why a team reaches for it

- **Zero operational burden.** No capacity planning, no index tuning, no infrastructure to patch or scale. Genuinely valuable for a team with no dedicated database or infrastructure engineer.
- **Consistent latency at scale without tuning.** Published and third-party benchmarks put managed serverless tiers under 20-30ms p95 at 5M+ vectors, competitive with or better than an untuned self-hosted alternative, without anyone on the team touching an index parameter.
- **Fast to prototype.** No setup beyond an API key; useful for validating a feature before committing engineering time to a storage decision.

## The real costs

- **Lock-in.** Closed source, cloud-only, no self-host escape hatch. Data and metadata live in a vendor the team cannot run itself if the relationship ends.
- **Consumption-based billing that needs modeling.** Cheap at low volume, meaningfully more expensive than self-hosted or pgvector-in-Postgres at higher volumes; production benchmarking in the sources above shows a managed tier costing 3-8x a comparable Postgres instance at multi-million-vector scale.
- **A second system to keep in sync.** Vectors live outside the primary database, so every write path needs a plan for keeping the managed service and Postgres consistent (dual-write, outbox pattern, or an explicit sync job), and every incident review now spans two systems instead of one.
- **Reduced tuning control.** Some managed tiers do not expose the equivalent of `ef_search`/`m`, so a team that needs to trade recall for latency on a specific query path may not have that lever available; recall tuning may be limited to what the vendor exposes.

## When to actually reach for it on this stack

- A team or client engagement has explicitly stated "no infrastructure to manage" as a hard requirement, and the cost profile at expected scale has been modeled and accepted.
- A prototype or spike needs a working vector search surface immediately, before a storage decision is worth spending engineering time on; treat this as intentionally temporary and revisit before the prototype becomes production.
- The corpus and query volume are genuinely past what pgvector or a self-hosted Qdrant instance comfortably serves, and the team does not have (or does not want) the capacity to operate Qdrant themselves.

## Integration shape if adopted

Treat it the same as Qdrant in `alt-01-qdrant.md`: relational data, auth, and application state stay in Postgres; only the specific collection needing the managed service's characteristics moves. Document the decision in an ADR, including the cost model at projected scale and the sync strategy between Postgres and the managed service, since this is the option with the least reversibility of the three alternatives (no self-host path back if the vendor relationship or pricing changes).
