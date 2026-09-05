# Postgres 04 - Reranking (optional post-fusion stage)

An optional cross-encoder reranking stage layered after fusion (`postgres-03-rrf-fusion.md`). This guide covers when reranking earns its cost and when it's wasted latency.

> Ground truth: `references/research/raw/cohere--rerank--model-docs-and-v3-5-announcement.md` (Cohere `rerank-v3.5`/`rerank-v4.0` as the concrete example), cross-referenced with the evaluation sources in `references/research/raw/exploreagentic--rag-evaluation--gold-set-component-ablation.md`. Synthesis: `references/research/distilled-retrieval.md`.

---

## What a reranker actually does

A reranker takes a query and a candidate list some other step already assembled, and re-sorts it by relevance. It does not retrieve - it only reorders. This is the load-bearing structural fact: **a reranker cannot recover a document that never made the candidate pool.** If the fused candidate set's recall@N is already low, running a reranker over it produces a better-ordered set of still-wrong results. Reranking is strictly a second-stage refinement on top of a recall pipeline that is already working, never a substitute for fixing recall.

## The concrete example: Cohere Rerank

`rerank-v3.5` (and the newer `rerank-v4.0-pro` / `rerank-v4.0-fast` pair) takes a query and a list of documents and returns a relevance-sorted order. Query tokens and document tokens combine into one 4096-token-per-document budget; if the combined total exceeds it, the API auto-chunks that document into multiple inferences rather than truncating or erroring - a real latency and cost variable, not a fixed per-document cost. `rerank-v4.0-fast` trades peak quality for lower latency/higher throughput; `rerank-v4.0-pro` and `rerank-v3.5` both handle semi-structured (JSON) data alongside plain text.

Reranking is one option among several cross-encoder rerank providers; the principle (second-stage-only, candidate-pool-bounded, latency and cost scale with candidate count and document length) applies regardless of which vendor or self-hosted model is chosen.

## When reranking is worth the cost

- **Recall@N is already solid, but the top of the ranked list is noisy.** This is the textbook case: RRF fusion (or vector/lexical alone) is pulling the right documents into the top-N candidate pool, but not consistently ranking the single best one first. A reranker's whole job is fixing exactly this.
- **The generator only reads a small top-k**, so getting the very best chunk into position 1-3 measurably changes the answer (many generators weight earlier context more heavily). Reranking pays for itself precisely when position matters and the fusion step alone isn't reliably nailing it.
- **Ambiguous or multi-candidate queries** where several fused results are plausible and only fine-grained semantic judgment (not just rank-position fusion) can tell them apart.

## When reranking is wasted latency

- **Recall@N is low.** Fix chunking, the embedding model, or the fusion weighting first (`postgres-05-chunking-strategy.md`, `postgres-02-pgvector-recall.md`, `postgres-03-rrf-fusion.md`). A reranker measured against a low-recall candidate pool will look useless even if the reranker itself is fine - the pool was the problem.
- **The workload is dominated by exact-identifier or single-obvious-answer queries** where fusion already puts the right result first almost every time. The reranking pass adds latency and cost for a reordering that rarely changes.
- **Candidate pools are already small and cheap to read in full** (e.g. the generator consumes the whole top-20 anyway) - reranking mainly helps when position within a consumed subset matters, not when everything fused gets read regardless of order.

## Ablation order: reranking last, always

When evaluating whether a reranker is pulling its weight, hold the query set fixed and ablate pipeline components in order: chunking and embedding model first (they set the recall ceiling), fusion weighting next, reranking last. Measure the reranker's effect on precision@k and MRR *and* confirm it does not regress recall@N (a reranker should never drop a genuinely relevant document out of the final set - it reorders, it should not discard). A reranker evaluated before the earlier stages are solid will produce a misleading "reranking doesn't help" verdict that is actually a masked recall problem upstream.

## What to check on a reranking finding

1. **Is the candidate pool's recall@N already validated as adequate** before reranking gets credit or blame for result quality? If not, the finding belongs to chunking/fusion, not reranking.
2. **Is the reranker only reordering, never silently dropping** documents the earlier stages retrieved? A reranker that truncates the pool below what the generator needs is a should-refactor at minimum.
3. **Is candidate-pool size sized to cost?** Reranking N candidates costs roughly N times a single-document call (more if documents are long enough to auto-chunk); reranking a needlessly large pool (e.g. 200 candidates when the generator only reads 10) is a should-refactor.
4. **Was the reranker's contribution measured** (precision@k, MRR, before/after, with recall@N held constant) rather than assumed? See `postgres-06-recall-quality-eval.md`.
