# Microsoft GraphRAG: Pattern + Qdrant/Neo4j Implementations

**Source:** Microsoft GraphRAG paper: https://arxiv.org/abs/2404.16130; Microsoft GraphRAG repo: https://github.com/microsoft/graphrag; Qdrant + Neo4j case studies.
**Retrieved:** 2026-04-25
**Status:** Informational + reference for `guides/11-graphrag.md` and `references/generic-graph-db-choice.md`.
**Numbers tag:** vendor-directional on lift percentages (case studies cite 20-25% lift on regulated verticals); the pattern itself is benchmarked by the Microsoft paper.

---

## TL;DR

GraphRAG augments vector RAG with knowledge-graph traversal. Pattern:

1. Extract entities and relationships from the corpus (Microsoft uses LLM-driven extraction; the deploying product uses summary-based extraction).
2. Build a graph (nodes = entities, edges = relationships).
3. At query time: vector retrieval finds relevant chunks → entity extraction → graph traversal → fuse with RRF → rerank.

---

## the deploying product's interpretation

the deploying product's GraphRAG extracts entities from coaching session SUMMARIES (not raw transcripts) for cleanliness. Entity types: `PROBLEM`, `TECHNIQUE`, `INSIGHT`, `COMMITMENT`, `OUTCOME`, `BREAKTHROUGH`, `GOAL`, `CONTEXT`. Relationship types: `APPLIES_TO`, `RESOLVES`, `LEADS_TO`, `BUILDS_ON`, `SIMILAR_TO`, `TRIGGERED_BY`, `CONTRADICTS`, `ACHIEVES`.

Storage: Postgres (`GraphEntity`, `GraphRelationship` Prisma models). Traversal: recursive CTE with cycle detection, max-depth 2.

The Postgres-native choice differs from the Qdrant + Neo4j pattern but achieves the same retrieval shape. The graph is sparse (hundreds of nodes per user, not millions); recursive CTE handles 2-hop traversal comfortably.

See `guides/11-graphrag.md §5`.

---

## Qdrant + Neo4j (`QdrantNeo4jRetriever`): the alternative pattern

```python
# Pseudocode — typical pattern from Qdrant + Neo4j docs
candidates = qdrant.search(query_vector, limit=20)
entity_ids = extract_entities_from(candidates)
graph_results = neo4j.run("""
  MATCH (e)-[*1..2]-(neighbor)
  WHERE e.id IN $entity_ids
  RETURN neighbor
""", entity_ids=entity_ids)
fused = reciprocal_rank_fusion(candidates, graph_results, k=60)
top = cohere.rerank(query, fused[:20], top_n=5)
```

Same shape. Different graph DB.

---

## When GraphRAG wins (per the paper + the deploying product's lens)

GraphRAG's measured lifts apply to:

- **Regulated verticals** (medical, legal, finance) where entities + relationships are the unit of meaning.
- **Long-running enterprise QA** where multi-hop reasoning across documents matters.
- **Long-term coaching relationships** (the deploying product's case) where cross-session pattern recognition is needed.

It does NOT win on:

- Short-context Q&A.
- Single-document retrieval.
- Corpora where entities + relationships are sparse.

See `guides/11-graphrag.md §9`.

---

## Why the deploying product uses Postgres, not Neo4j

- **Sparse graph at coaching scale**: Postgres recursive CTE handles 2-3 hops at hundreds of nodes per user.
- **No new infrastructure**: Postgres already in the stack.
- **Transactional consistency**: entity + relationship inserts in one transaction with the source session.
- **Gated feature**: adding ops surface for a flag-gated feature is wasteful.

If the deploying product's graph density grows (thousands of nodes per user, deep traversal queries common), Neo4j becomes the substitution candidate. See `references/generic-graph-db-choice.md`.

---

## Implications

- GraphRAG enabled platform-wide without an eval pass is **must-fix**.
- Entity extraction running on raw transcripts (not summaries) is **must-fix**.
- Adding Neo4j to the stack without substitution policy compliance is **must-fix**.
- See `guides/11-graphrag.md §9`, `references/generic-graph-db-choice.md`.
