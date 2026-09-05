# Example 05: Enable GraphRAG for a New Tenant

Walkthrough for the gated GraphRAG path being enabled for a single tenant cohort, with eval evidence.

> **Reference guides:** `guides/11-graphrag.md`, `guides/17-evaluation-discipline.md`, `guides/01-stack-enforcement.md`.

---

## Scenario

A flagship tenant has been on the platform for 18 months. Member feedback: "The coach asks me about goals but doesn't connect them to what I committed to last quarter." Long-term coaching relationship → cross-session pattern recognition is the gap.

This is **the canonical "when to enable GraphRAG" signal** per `guides/11-graphrag.md §9`.

---

## Step 1: Verify the signal (NOT vibes)

Before enabling, confirm the gap is measurable.

### Pull human-review feedback

`quality-worker-bee` ran 10 weeks of coaching-rubric reviews on this tenant. Findings:

| Dimension | Mean (this tenant) | Mean (platform) |
|---|---|---|
| Reflective listening | 0.72 | 0.71 |
| Reframing | 0.68 | 0.65 |
| Specificity | 0.81 | 0.62 |
| **Cross-session connection** | **0.41** | **0.43** |
| Actionability | 0.78 | 0.74 |

The "cross-session connection" dimension (added by `quality-worker-bee` for this tenant) is below 0.5: the coach isn't connecting current sessions to past commitments.

### Pull trace data

```sql
SELECT AVG(retrieval_score) AS mean_retrieval, COUNT(*) AS n
FROM "AiTrace"
WHERE tenant_id = 'clx9vy200012vu8kj0'
  AND trace_type = 'chat_turn'
  AND created_at >= NOW() - INTERVAL '30 days';
```

Mean retrieval: 0.71 (healthy). Routing accuracy: 92%. Sycophancy: 0.48.

**Conclusion:** The gap is in cross-session pattern recognition, NOT in retrieval / routing / sycophancy. **GraphRAG is the right tool.**

---

## Step 2: Verify the platform-flag-only constraint

Currently `enableGraphRAG` is in `PlatformConfig.systemPromptBlocks`: **platform-wide**. This needs to become tenant-specific to enable a cohort.

### Schema change

```diff
// api/prisma/schema.prisma

model Tenant {
  // ... existing fields
+ enableGraphRAG  Boolean  @default(false) @map("enable_graphrag")
}
```

Migration:

```bash
pnpm prisma migrate dev --name add_tenant_graphrag_flag
```

### Update `shouldUseGraphRAG()`

```diff
// lib/knowledge-context.ts

async function shouldUseGraphRAG(tenantId: string, seed: string): Promise<boolean> {
+ const tenant = await prisma.tenant.findUnique({
+   where: { id: tenantId },
+   select: { enableGraphRAG: true },
+ });
+ if (!tenant?.enableGraphRAG) {
+   // Fall through to platform default
    const config = await prisma.platformConfig.findFirst({
      select: { systemPromptBlocks: true },
    });
    const blocks = config?.systemPromptBlocks as Record<string, unknown> | null;
    if (!blocks || !(blocks as any).enableGraphRAG) return false;
+ }

  // hash-based 50% A/B (unchanged)
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 2 === 0;
}
```

### Doc update

```diff
# library/knowledge/private/ai/graphrag-knowledge-graph.md §7

-**To enable:** Set `enableGraphRAG: true` in `PlatformConfig.systemPromptBlocks`...
+**To enable per-tenant:** Set `Tenant.enableGraphRAG = true` for the target tenant.
+**To enable platform-wide:** Set `enableGraphRAG: true` in `PlatformConfig.systemPromptBlocks`.
+
+Per-tenant overrides platform-wide. Hash-based A/B (50%) applies after enablement.
```

---

## Step 3: Backfill the graph for the target tenant

GraphRAG retrieves entities from `GraphEntity` / `GraphRelationship` tables. These are populated by `graph-extraction-worker.ts` from session SUMMARIES (not raw transcripts) per `guides/11-graphrag.md §3`.

For an existing tenant with 18 months of sessions, run a one-time backfill:

```typescript
// scripts/backfill-graph-for-tenant.ts
const sessions = await prisma.aiChatSession.findMany({
  where: {
    tenantId: 'clx9vy200012vu8kj0',
    summary:  { not: null },
  },
});

for (const session of sessions) {
  await graphExtractionWorker.process({
    sessionId: session.id,
    tenantId:  session.tenantId,
    userId:    session.userId,
    summary:   session.summary,
  });
}
```

For 18 months × ~50 active members × ~15 sessions/member = ~13,500 sessions. At ~$0.01 per extraction (Llama 3.1 8B on the summary), backfill cost ≈ $135. Acceptable.

After backfill: ~80,000 `GraphEntity` rows, ~120,000 `GraphRelationship` rows. Postgres handles this comfortably.

---

## Step 4: Run an eval pass before enablement

A/B test: half of users get GraphRAG (hash-based), half don't. Run for **2 weeks** to accumulate enough trace data.

| Metric | A (GraphRAG) | B (vector-only) | Δ |
|---|---|---|---|
| Retrieval precision | 0.78 | 0.71 | +0.07 |
| Routing accuracy | 92% | 92% | 0 |
| Cross-session connection (rubric) | 0.61 | 0.43 | **+0.18** |
| Latency P50 | 1180 ms | 920 ms | +260 ms |
| Latency P95 | 2300 ms | 1800 ms | +500 ms |
| Sycophancy | 0.46 | 0.48 | ~0 |

**Conclusion:** GraphRAG lifts cross-session connection 0.43 → 0.61 (+0.18, the gap signal). Latency cost: +260ms P50 / +500ms P95. Acceptable for this tenant.

---

## Step 5: Enable for the tenant

```sql
UPDATE "Tenant" SET enable_graphrag = true WHERE id = 'clx9vy200012vu8kj0';
```

This activates the per-tenant flag. Half of users (hash-based A/B) get GraphRAG; the other half remain on vector-only. The tenant will see ~50% lift on cross-session connection.

**Why keep the 50% A/B?** It allows continuous comparison. If GraphRAG quality drops vs. vector-only, the regression is visible immediately. Removing the A/B is a future enablement step (full rollout to 100%) once the lift is sustained.

---

## Step 6: Watch the eval signals

For 4 weeks post-enablement:

- **Retrieval precision**: confirm sustained ≥ 0.75 (above platform target).
- **Cross-session connection**: confirm sustained ≥ 0.55 (5-week running mean).
- **Latency P95**: alert if exceeds 3000ms (degradation budget).
- **Postgres load**: `traverseGraph()` is a recursive CTE; monitor query plan.

If any signal regresses, set `Tenant.enableGraphRAG = false` for rollback. The data stays; just the retrieval path reverts.

---

## Step 7: Hand off

- **`db-worker-bee`**: verify the recursive CTE in `traverseGraph()` is using indexes (`@@index([tenantId, fromEntityId])`). Watch query plan after backfill.
- **`library-worker-bee`**: author the PRD if this is a paid feature.
- **`quality-worker-bee`**: fold the cross-session-connection rubric into the standard QA suite for this tenant.

---

## Step 8: Document the enablement

`library/requirements/reports/ai/2026-04-25-graphrag-enablement-clx9vy200012vu8kj0.md`:

```
Tenant: clx9vy200012vu8kj0 (Foundry Strategy)
Date: 2026-04-25
Reason: cross-session-connection rubric mean 0.41 (gap signal)
Eval evidence: 2-week A/B showed +0.18 lift (0.43 → 0.61)
Cost: +260ms P50 latency / ~$135 one-time backfill
Schema change: Tenant.enableGraphRAG (migration 2026_0425_add_tenant_graphrag_flag)
Rollback: SET enable_graphrag = false on the tenant row
PRD: handed to library-worker-bee
Watch window: 4 weeks (until 2026-05-23)
```

---

## What this example DOESN'T do

This is **not** a generic recommendation to enable GraphRAG. Per `guides/11-graphrag.md §9`:

- Don't enable because "it sounds architecturally interesting."
- Don't enable because "the code is built and available."
- Don't enable without a measurable gap signal.

GraphRAG provides relational multi-hop reasoning for the remaining 10-20% of cases that vector RAG handles poorly. Most tenants won't need it.
