# Qdrant `strict_mode_config`: Rejecting Filters on Unindexed Fields

**Source:** Qdrant docs: https://qdrant.tech/documentation/concepts/strict-mode/
**Retrieved:** 2026-04-25
**Status:** **LOAD-BEARING.** Cited in `guides/00-principles.md §6` and `guides/08-rag-strategy.md §4`.
**Numbers tag:** benchmarked (latency impact documented in Qdrant docs).

---

## TL;DR

`strict_mode_config: { enabled: true }` rejects Qdrant queries that filter on unindexed payload fields. Without strict mode, such queries silently degrade to full-scan (50-200ms per query); with strict mode, you get an explicit error so the gap is visible.

---

## Why this matters

Qdrant's filter machinery relies on payload indexes. A filter on an unindexed field means scanning every point's payload: fine at 1K vectors, catastrophic at 1M. The performance cliff is silent: no error, just slow.

`strict_mode_config: { enabled: true }` makes the cliff visible. The query throws; the dev fixes the filter or adds the index.

---

## usage

Every collection at creation time:

```typescript
await client.createCollection(`knowledge-${tenantId}`, {
  vectors: { /* HNSW config */ },
  strict_mode_config: { enabled: true },                     // ← required
  optimizers_config:  { default_segment_number: 4 },
});
```

`COMMON_INDEXES` (in `qdrant-client.ts`) lists the eight canonical indexes (nine for `media-*`):

- `tenant_id` (keyword)
- `user_id` (keyword)
- `session_id` (keyword)
- `thread_id` (keyword)
- `agent_type` (keyword)
- `content_type` (keyword)
- `source_document_id` (keyword)
- `timestamp` (datetime)
- (media only) `media_attachment_id` (keyword)

A filter on any field NOT in the list above is rejected.

---

## The "add a new filter field" procedure

1. Add the field to indexing code (so existing points start carrying it).
2. Add it to `COMMON_INDEXES` and run `ensureCollection()` for affected collections.
3. Backfill existing vectors with the new field.
4. ONLY THEN add the filter to a query.

Skipping any step is **must-fix**.

---

## Trade-offs of `strict_mode`

- **Pro:** silent full-scans become explicit errors → operational visibility.
- **Con:** new filter fields require a migration; cannot ad-hoc filter by an arbitrary field.

For the deploying product, the trade-off is unambiguous: the cognitive layer's correctness depends on filter performance. Strict mode stays on.

---

## Implications

- Drift from `strict_mode_config: { enabled: true }` is **must-fix**.
- Adding a filter on a new field without an index first is **must-fix**.
- See `guides/09-vector-payload-schema.md §8`.
