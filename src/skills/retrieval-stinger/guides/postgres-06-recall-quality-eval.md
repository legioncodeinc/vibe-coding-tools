# Postgres 06 - Retrieval evaluation methodology

Generalizes the "recall is measured, not vibed" principle this Stinger has always enforced (previously only written for the Deep Lake pipeline, see `deeplake-08-recall-quality-eval.md`) into a methodology for a multi-component Postgres retrieval pipeline: chunker, embedding model, full-text arm, RRF fusion, optional reranker.

> Ground truth: `references/research/raw/aisuffer--rag-evaluation--recall-precision-golden-set.md` and `references/research/raw/exploreagentic--rag-evaluation--gold-set-component-ablation.md`. Synthesis: `references/research/distilled-retrieval.md`.

---

## Split retrieval from generation before measuring anything

A bad final answer has two possible causes and you must know which: retrieval failed (the right facts never reached the model - no prompt tuning fixes this), or generation failed (the right facts were in context but the model ignored, misread, or invented past them). Retrieval evaluation is a pure information-retrieval problem: deterministic, no LLM needed, graded against labeled relevant chunks. Generation evaluation needs an LLM judge and is only meaningful once retrieval is trusted. Collapsing both into one end-to-end score is the most common evaluation mistake - it tells you the system is wrong, never which half to fix. This guide covers retrieval evaluation; generation-quality evaluation (faithfulness, answer relevancy) is downstream of it and out of this Stinger's scope.

## The metric set

| Metric | What it measures | When to reach for it |
|---|---|---|
| recall@k | Share of all relevant chunks that land in the top k | Always first - gates every other metric |
| precision@k | Share of the top k that is actually relevant | Noise/distractor chunks are degrading the generator or inflating cost |
| hit@k | Whether *any* relevant chunk lands in the top k | Coarse pass/fail signal, single-fact queries |
| MRR | Reciprocal rank of the first relevant hit, averaged | The first good result matters most (many generators weight early context more heavily) |
| nDCG@k | Graded relevance with position discounting | Relevance isn't binary and ordering inside top-k matters |

**Recall@k gates everything.** If the relevant chunk never made the top k, every downstream metric - precision, MRR, nDCG, and certainly reranking quality - is moot. Tune k to the context budget the generator will actually receive, then optimize recall at that k before touching ranking or reranking.

## Building a golden query set

Three required parts:

1. **Real queries** - pulled from production logs, support tickets, search history. Synthetic (LLM-generated from the documents) queries are acceptable for bootstrapping volume but are systematically easier than real ones, since they were written by reading the answer.
2. **Labeled relevant chunks** - a human (ideally a domain expert) marks which chunks are relevant per query, at a relevance grade if nDCG is wanted. A focused 150-300 query set with careful labels, stratified across single-fact, multi-hop, comparative, and ambiguous query types, beats a much larger unlabeled or unstratified one.
3. **Hard negatives** - chunks deliberately topically close but wrong (right entity, wrong fiscal year; right clause, prior version). These are what separate a reranker that actually helps from one that just reshuffles already-obvious results - a test set without them flatters every component, reranking especially.

Report per-stratum scores, never only a global average - the average hides exactly the multi-hop or hard-query collapse that matters most. Version the golden set like code; a metric movement is only interpretable against a fixed, versioned set.

## Component ablation

A Postgres retrieval pipeline has multiple swappable pieces - chunker, embedding model, full-text arm, RRF fusion weighting, optional reranker. End-to-end recall tells you the pipeline's score, not which component to fix. Ablate: hold the golden set and every other component fixed, change exactly one, re-measure.

**Ablate in pipeline order - recall-affecting components first, ranking-only components last:**

1. Chunking strategy (`postgres-05-chunking-strategy.md`) - usually the highest-leverage, most-overlooked knob.
2. Embedding model / dimension - handed jointly with embeddings-runtime-worker-bee.
3. Hybrid fusion weighting (`postgres-03-rrf-fusion.md`).
4. Reranking (`postgres-04-reranking.md`) - always last. A reranker measured against a low-recall candidate pool looks useless even when it's fine, because it cannot fix a recall problem - fix the pool before grading the sort.

Change one variable at a time. Changing the chunker and the embedding model together in the same measurement teaches nothing about either individually.

## Before/after discipline

Unchanged from the Deep Lake-era rule this Stinger has always enforced: snapshot the metric set before a change, make the change, snapshot again, compare. "Feels better" was never evidence and still isn't. A weighting or chunking change that lifts one metric while quietly tanking another (e.g. conceptual recall up, exact-identifier precision down) is a bad trade for a workload that leans identifier-heavy - report per-stratum, not just the aggregate, so that tradeoff is visible.

## What to check on a recall-eval finding

1. **Is there a fixed, labeled, versioned golden query set** with real (not purely synthetic) queries? Without one, there is no measurement, only a vibe.
2. **Does the set include hard negatives?** Without them, a reranker's contribution cannot be honestly assessed.
3. **Was recall@k checked first**, before precision, MRR, nDCG, or reranking quality were even considered?
4. **Was ablation done one variable at a time, in pipeline order** (recall components before reranking)?
5. **Before AND after, on the identical set?** A single snapshot proves nothing about a change.
6. **Per-stratum, not just aggregate?** An aggregate can hide a query class that regressed badly.
7. **Handed to quality-worker-bee** as audit evidence when a retrieval change ships, same close-out convention this Stinger has always used for the Deep Lake pipeline.
