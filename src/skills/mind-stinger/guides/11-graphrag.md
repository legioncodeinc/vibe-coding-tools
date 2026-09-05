# 11: GraphRAG

> **Alternative stack, Qdrant-adjacent.** The graph entities and relationships here already live in Postgres; only the semantic-retrieval half of GraphRAG assumes the Qdrant path. See `guides/00-selection-and-defaults.md` for this repo's default.

`GraphEntity` / `GraphRelationship` Postgres models, `graph-retriever.ts`, `findRelevantEntities()`, `traverseGraph()`, RRF fusion via `rrf.ts`. **Feature-flag gated.** Built but not active by default.

> **Doc reference:** `library/knowledge/private/ai/graphrag-knowledge-graph.md` is canonical.

---

## 1. Why GraphRAG

Pure vector RAG flattens structure. Vector search excels at "find memories similar to what the user is asking about now." It fails at relational queries that require multi-hop reasoning across sessions.

**Example:**

> Member: "I'm struggling to stay consistent with my follow-up calls."

- **Vector RAG retrieves:** sessions where "inconsistent follow-up calls" appeared.
- **Skilled coach would do:** recall that this member had the same struggle 4 months ago, tried an accountability structure that worked for 6 weeks, then fell off. Coach can say: "We've been here before. The accountability partner structure worked. What happened to it?"
- **Why vector RAG misses this:** the connection between current struggle, historical technique, and outcome is a *relationship chain* across multiple sessions, not semantic similarity within any single session.

GraphRAG stores these relationships explicitly and enables traversal.

---

## 2. The hybrid retrieval pipeline

```
Standard path:
  User query → Vector search → Top-K passages → LLM response

GraphRAG path (when feature flag active):
  User query → Vector search → Top-20 candidates
               ↓
               findRelevantEntities()  [Postgres full-text search]
               ↓
               traverseGraph()  [recursive CTE, 2 hops]
               ↓
               reciprocalRankFusion(vectorResults, graphResults, k=60)
               ↓
               rerank(query, top-20 fused, topN=5)  [Cohere rerank-v3.5]
               ↓
               LLM response (richer relational context)
```

---

## 3. Entity types

Extracted from coaching session **summaries** (NOT raw transcripts) by `graph-extraction-worker.ts`:

| Entity Type | Example |
|---|---|
| `PROBLEM` | "Inconsistent follow-up with referral partners" |
| `TECHNIQUE` | "Weekly accountability call with partner every Monday" |
| `INSIGHT` | "Realized pricing was the real blocker, not positioning" |
| `COMMITMENT` | "Reduce client list to 10 focused relationships by March" |
| `OUTCOME` | "Booked 5 discovery calls in a week for the first time" |
| `BREAKTHROUGH` | "Stopped apologizing for price and closed 3 premium clients" |
| `GOAL` | "Generate $50K in new revenue by end of Q2" |
| `CONTEXT` | "Business slowed during school year: seasonal pattern" |

---

## 4. Relationship types

```prisma
model GraphRelationship {
  relType         String   // APPLIES_TO | RESOLVES | LEADS_TO | BUILDS_ON |
                           // SIMILAR_TO | TRIGGERED_BY | CONTRADICTS | ACHIEVES
  weight          Float    @default(1.0)
  fromEntityId    String
  toEntityId      String
  sourceSessionId String?
}
```

---

## 5. Storage: Postgres, not a graph DB

```prisma
model GraphEntity {
  id              String    @id @default(cuid())
  tenantId        String    @map("tenant_id")
  userId          String    @map("user_id")
  entityType      String    @map("entity_type")
  text            String
  sessionId       String?   @map("session_id")
  sessionDate     DateTime? @map("session_date")
  occurrenceCount Int       @default(1) @map("occurrence_count")

  outbound GraphRelationship[] @relation("graphEntitySource")
  inbound  GraphRelationship[] @relation("graphEntityTarget")

  @@unique([tenantId, userId, entityType, text])
  @@index([tenantId, userId])
}

model GraphRelationship {
  id              String   @id @default(cuid())
  tenantId        String   @map("tenant_id")
  fromEntityId    String   @map("from_entity_id")
  toEntityId      String   @map("to_entity_id")
  relType         String   @map("rel_type")
  weight          Float    @default(1.0)
  sourceSessionId String?

  @@unique([fromEntityId, toEntityId, relType])
  @@index([tenantId, fromEntityId])
  @@index([tenantId, toEntityId])
}
```

**Why Postgres, not Neo4j:** The coaching graph is sparse (hundreds of nodes per user, not millions). Postgres `WITH RECURSIVE` CTE handles 2-3 hop traversals efficiently. No new infrastructure.

---

## 6. Retrieval: three stages

### Stage 1: `findRelevantEntities()` (Postgres full-text search)

```typescript
findRelevantEntities(query: string, userId, tenantId, limit = 10): Promise<GraphEntityResult[]>
```

Constructs a `tsquery` from the query (whitespace-split, words > 2 chars, append `:*` for prefix matching) and uses `to_tsvector` + `to_tsquery` on `text`. Ordered by `occurrence_count DESC, ts_rank DESC`.

**Note:** Full-text search, NOT pgvector. The `GraphEntity` model has no embedding column.

### Stage 2: `traverseGraph()` (recursive CTE)

```typescript
traverseGraph(matchedEntityIds: string[], userId, tenantId, maxDepth = 2): Promise<GraphTraversalResult[]>
```

BFS up to `maxDepth` hops with cycle detection (`AND NOT (e2.id = ANY(eg.visited_path))`). Returns up to 30 entities ordered by `min_depth ASC, occurrence_count DESC`.

### Stage 3: `reciprocalRankFusion()` (RRF)

```typescript
reciprocalRankFusion(vectorResults: RankedResult[], graphResults: RankedResult[], k = 60): FusedResult[]
```

Standard RRF: `score(d) = SUM(1 / (k + rank_i(d)))`. Items in both lists get additive scoring: they're retrieved both semantically and relationally.

Caller takes top 20 and runs Cohere rerank for final selection. **Top-20 from RRF, top-5 from rerank.**

---

## 7. Feature flag: A/B by hash

```typescript
async function shouldUseGraphRAG(tenantId: string, seed: string): Promise<boolean> {
  const config = await prisma.platformConfig.findFirst({ select: { systemPromptBlocks: true }});
  const blocks = config?.systemPromptBlocks as Record<string, unknown> | null;
  if (!blocks || !(blocks as any).enableGraphRAG) return false;

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 2 === 0;  // 50% of users get GraphRAG
}
```

`seed` is `sessionId` (or `memberId` on fallback). Same user consistently gets either GraphRAG or vector-only path within a session.

**To enable:** set `enableGraphRAG: true` in `PlatformConfig.systemPromptBlocks` via SA AI Configuration.

---

## 8. `formatEntityForContext()`

```typescript
formatEntityForContext(entity: GraphTraversalResult): string {
  return `[${entity.entity_type}] ${entity.text}`;
}
```

Example: `[TECHNIQUE] Weekly accountability call with partner every Monday`

The hybrid context includes a graph annotation:

```
[retrieved passages...]

[Graph: 5 entity chains retrieved]
```

---

## 9. When to enable GraphRAG

GraphRAG adds latency (graph traversal + RRF fusion) and Postgres query cost. Enable only when measurable evidence shows it provides value:

**Enable when observability data shows:**

- Members consistently report "the coach doesn't remember what worked before."
- Routing accuracy is high but coaching quality metrics plateau.
- Cross-session pattern recognition is identified as a gap via human evaluation.

**Do NOT enable because:**

- It sounds architecturally interesting.
- The code is built and available.

Vector RAG alone (vector search + episodic memory + reranking) handles 80-90% of coaching quality needs. GraphRAG provides relational multi-hop reasoning for the remaining cases in long-term coaching relationships.

---

## 10. Enabling for a tenant cohort

The current implementation is **platform-wide** (the flag is in `PlatformConfig`). Tenant-cohort enablement requires extending the flag check to `Tenant.aiPromptConfig` or a new `TenantFeatureFlag` table.

If a contributor wants to enable GraphRAG for one tenant only, the path:

1. Update `library/knowledge/private/ai/graphrag-knowledge-graph.md` with the per-tenant gating decision.
2. Extend the schema (`Tenant.enableGraphRAG: boolean` or feature-flag table).
3. Update `shouldUseGraphRAG()` to check tenant-level flag first, then platform.
4. Run an eval pass on the tenant's golden set with GraphRAG on vs. off, adopt only if measured lift > 5% on retrieval precision or human-graded quality.
5. Hand PRD authoring to `library-worker-bee`.

See `examples/05-graphrag-enable-for-new-tenant.md`.

---

## 11. Common findings

| Finding | Severity | Reference |
|---|---|---|
| GraphRAG enabled platform-wide without an eval pass | must-fix | this guide §9 |
| Entity extraction running on raw transcripts (not summaries) | must-fix | this guide §3 |
| `findRelevantEntities()` not respecting `tenant_id`/`user_id` filter | must-fix (security) | this guide §6 |
| `traverseGraph()` exceeding `maxDepth = 2` without justification | should-refactor | this guide §6 |
| RRF `k` constant drifted from 60 | should-refactor | this guide §6 |
| Hybrid path skipping the final Cohere rerank | must-fix | this guide §6 |
| GraphRAG enablement on a tenant cohort without per-tenant flag implementation | must-fix | this guide §10 |
| Adding a graph DB (Neo4j) to the stack without doc update | must-fix | `guides/01-stack-enforcement.md §2` |
