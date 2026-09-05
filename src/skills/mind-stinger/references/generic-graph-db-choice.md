# Generic Graph DB Choice (DEMOTED: the deploying product uses Postgres-native graph)

> **Status:** Demoted reference. the deploying product's GraphRAG uses `GraphEntity` and `GraphRelationship` Prisma models in Postgres, with `traverseGraph()` implemented as a recursive CTE.

---

## Why Postgres is canonical for the deploying product's graph

1. **Sparse graph at coaching scale.** Hundreds of nodes per user, not millions. Postgres `WITH RECURSIVE` handles 2-3 hop traversals comfortably.
2. **No new infrastructure.** Same Postgres as `AiChatSession`, `AiTrace`, `KnowledgeDocument`.
3. **Transactional consistency.** Entity extraction + relationship insertion happen in one transaction with the source session.
4. **Indexed traversal.** `@@index([tenantId, fromEntityId])` and `@@index([tenantId, toEntityId])` cover the common query patterns.
5. **No graph DB vendor relationship.** One fewer vendor to manage, one fewer ops surface.
6. **GraphRAG is gated.** Even if it were a dedicated graph DB, the feature is only active behind a flag: adding ops surface that's mostly dormant is wasteful.

See `guides/11-graphrag.md §5`.

---

## The alternatives (for context)

### Neo4j

- **Pitch:** Mature graph DB. Cypher query language. Strong for complex multi-hop queries.
- **Pros vs Postgres:** Cypher is more expressive than recursive CTEs for deep / branchy traversal; visualization tooling; performance at high node/edge counts.
- **Cons vs Postgres:** New service to operate; vendor relationship; data split between Postgres and Neo4j (entity extraction in Postgres → write to Neo4j → read in Neo4j); transactional split.
- **When it'd be the right call:** Graph density grows (thousands of nodes per user, deep traversal queries common); Neo4j+Qdrant `QdrantNeo4jRetriever` is well-documented for hybrid GraphRAG.
- **The benchmark we don't have:** A vendor case study showing 20-25% lift on regulated verticals (medical/legal/finance). For the deploying product's coaching domain, that lift hasn't been measured.

### Memgraph

- **Pitch:** Cypher-compatible, in-memory; faster than Neo4j for some workloads.
- **Pros vs Postgres:** In-memory speed; Cypher.
- **Cons vs Postgres:** Newer vendor; data must fit in RAM; ops complexity.

### Amazon Neptune

- **Pitch:** Managed graph DB. Gremlin + SPARQL support.
- **Pros vs Postgres:** Zero-ops; AWS integration.
- **Cons vs Postgres:** Vendor lock-in; pricing scales aggressively; primarily relevant if already on AWS.

### TigerGraph

- **Pitch:** Distributed graph DB. Strong on deep analytics.
- **Cons vs Postgres:** Heavyweight for coaching scale; analytical-graph workload, not transactional.

### ArangoDB

- **Pitch:** Multi-model (graph + document + key-value).
- **Pros vs Postgres:** Single store for multi-model needs.
- **Cons vs Postgres:** Operational overhead; not as mature as dedicated alternatives in any single mode.

### Qdrant graph features (when released)

- **Status:** Not yet a feature. Qdrant has hinted at graph support but as of 2026-04-25, vector + payload + hybrid is the API surface.
- **If/when it ships:** Could collapse vector + graph into one store. Until then, hypothetical.

---

## When Postgres-native graph hits its ceiling

- **Node count > 1M per tenant**: recursive CTE performance degrades.
- **Traversal depth > 4 hops**: recursive CTE branches explode.
- **Complex pattern matching**: multi-direction joins where Cypher is meaningfully more expressive.

For the deploying product's current coaching graph (~80K entities + ~120K relationships per active 18-month tenant), Postgres is comfortably below the ceiling.

---

## Hybrid pattern with Qdrant + Neo4j (for context)

Microsoft's GraphRAG paper + Neo4j case studies use the `QdrantNeo4jRetriever` pattern:

1. Vector retrieval in Qdrant (top-K by semantic similarity).
2. Entity extraction from top-K (e.g., "ENTITY mentioned in chunk").
3. Graph traversal in Neo4j (`MATCH ... WHERE entity IN topK ...`).
4. RRF fusion of vector results and graph-traversal results.
5. Cohere rerank on the fused set.

the deploying product's homegrown pipeline does the same logic with Postgres in place of Neo4j. The only difference is the graph DB layer; the rest of the stack (Qdrant, RRF in `rrf.ts`, Cohere rerank) is identical.

If the deploying product ever migrates to Neo4j, the `traverseGraph()` function would be the only swap point.

---

## Migration path if Neo4j is approved

1. Standup Neo4j (Aura managed, or self-hosted).
2. Backfill: write the existing `GraphEntity` / `GraphRelationship` rows into Neo4j as nodes / relationships.
3. Implement a Neo4j-backed `traverseGraph()` alongside the Postgres-backed one.
4. A/B by tenant or by hash, same gating pattern as today.
5. Compare retrieval precision + cross-session-connection rubric scores; adopt only if measured lift > 5%.
6. Cut over; deprecate Postgres-side graph models.

Per `guides/01-stack-enforcement.md §2` substitution policy.
