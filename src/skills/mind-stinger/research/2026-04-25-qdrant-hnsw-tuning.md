# Qdrant HNSW Tuning: `m: 16, ef_construct: 200`

**Source:** Qdrant docs: https://qdrant.tech/documentation/concepts/indexing/
**Retrieved:** 2026-04-25
**Status:** **LOAD-BEARING.** Cited in `guides/08-rag-strategy.md §4` as the canonical HNSW config.
**Numbers tag:** mixed: Qdrant's `m=16` recommendation is documented; `ef_construct=200` is a common production default validated by community benchmarks.

---

## TL;DR

For 1024-dim Cohere embeddings on coaching-scale corpora (~10K-100M vectors per collection), HNSW `m: 16, ef_construct: 200` is the canonical default. `on_disk: false` keeps vectors in RAM for minimum latency.

---

## Key parameters

| Parameter | Value | Effect |
|---|---|---|
| `m` | 16 | Edges per node in the HNSW graph. 16 is the standard for 1024-dim vectors; lower (4-8) saves memory at the cost of recall; higher (32+) marginally improves recall at significant memory cost. |
| `ef_construct` | 200 | Search width during index BUILD. Higher = better-quality index, paid for once. 200 is comfortable; below 100 produces noticeably lower-quality graphs. |
| `ef` (search-time) | dynamic | Search width at query time. Qdrant defaults sensibly; tune up if recall is low, down if latency matters. |
| `on_disk` | `false` | RAM-resident vectors. `true` saves RAM but adds disk I/O latency (10-50ms). |
| `default_segment_number` | 4 | Match the Qdrant node CPU count for parallel index segments. |

---

## Why these specific HNSW values

- **`m=16`:** Standard for 1024-dim per Qdrant docs. The lift from `m=32` is < 1% recall on realistic corpora; the memory cost is 2×.
- **`ef_construct=200`:** A one-time cost amortized across all queries against the index. Lower values produce graphs with lower recall ceilings.
- **`on_disk=false`:** the deploying product's per-tenant collections are < 10GB each at current scale; RAM is sufficient. When/if a single collection exceeds ~10GB, migrate that collection to `on_disk: true`.
- **`default_segment_number=4`:** Matches typical Qdrant node CPU count (4 cores). On 8-core nodes, raise to 8.

---

## Tuning levers (when retrieval precision dips)

1. Confirm `m: 16, ef_construct: 200` haven't drifted (must-fix).
2. Raise search-time `ef` to 100 (default ~64). Higher recall, slightly higher latency.
3. Verify `on_disk: false` (RAM-resident).
4. Check segment count vs CPU count.

For the deploying product's 500-char (~125-token) chunks across ~50K knowledge points + ~30K conversation points per active tenant, the canonical config is comfortably within healthy operating range.

---

## Implications

- Drift from `m: 16, ef_construct: 200` is **must-fix** unless accompanied by `library/knowledge/private/ai/rag-vector-strategy.md §4` update + measured eval pass.
- Sharding trigger (per `guides/08-rag-strategy.md §10`): single collection > ~10GB (~10M vectors × 1024 × 4 bytes).

---

## Caveats

- Qdrant's "best practices" guidance evolves; verify against current docs at deploy time.
- `m` recommendations differ for very-low-dim (< 256) and very-high-dim (> 2048) vectors. 1024-dim is in the sweet spot.
