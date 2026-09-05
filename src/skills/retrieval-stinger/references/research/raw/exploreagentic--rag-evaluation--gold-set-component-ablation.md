# RAG Evaluation: Measuring Retrieval Quality Before You Ship (Explore Agentic)
- URL: https://www.exploreagentic.ai/insights/enterprise-rag-evaluation/
- Fetched: 2026-08-14
- Source type: blog
- Component: retrieval (gold-set sizing/composition, component-ablation methodology, CI gating discipline for a retrieval pipeline)

## Summary

A 2026 practitioner guide aimed at architects/platform engineers who own a production RAG retrieval pipeline. Its distinct contribution over the AISuffer source archived alongside it is depth on two things this Stinger's evaluation guide needs concretely: (1) gold-set sizing and composition (including hard negatives), and (2) component ablation methodology, how to isolate which piece of a multi-stage retrieval pipeline (chunker, embedder, hybrid fusion, reranker) is actually responsible for a recall/precision number.

## Why retrieval, not generation, is usually the actual bottleneck

"Most RAG failures are retrieval failures... it hallucinated because the right chunk was never in the context window." Four concrete reasons retrieval is hard, useful as symptom-diagnosis language: vocabulary mismatch (dense embeddings trained on web-scale text smear domain-specific jargon your corpus uses), chunking that destroys context (a fixed splitter cutting a table in half or orphaning a heading from its body), the long tail (aggregate accuracy hides that the multi-hop/ambiguous/adversarial queries, the ones that matter, vanish into an averaged score), and silent failure (a retrieval miss produces a fluent, confident, wrong answer with no stack trace, which is exactly why it has to be measured rather than eyeballed).

## Retrieval metrics table (consistent with, and slightly more operational than, the AISuffer source)

| Metric | What it measures | When to use it |
|---|---|---|
| Recall@k | Of all relevant chunks, what fraction landed in the top k | North star, tune k to the context budget, optimize recall there first |
| Precision@k | Of the top k, what fraction are actually relevant | When distractor chunks degrade the generator or inflate token cost |
| Hit rate (recall@k, ≥1 hit) | Did at least one relevant chunk make top k | Single-fact QA where one good chunk is enough |
| MRR | Reciprocal rank of the first relevant hit, averaged | First good result matters most |
| nDCG@k | Graded relevance with position discounting | Relevance isn't binary; ordering inside top-k matters |

Explicit rule: "Recall@k gates everything. If the relevant chunk is not in the top k, every downstream metric is moot." This orders the whole evaluation program: tune k to the actual context budget, then optimize recall at that k before touching anything else (ranking, reranking, generation prompt).

## Building a gold-standard evaluation set (the concrete numbers)

Three required components, worth quoting directly since they set concrete targets this Stinger's guide can cite:

1. **Real queries**, pulled from production logs/support tickets/search history, not brainstormed or exclusively LLM-generated. Synthetic (LLM-generated from the documents) queries are acceptable for bootstrapping volume but are "systematically easier than real ones because they were written by reading the answer."
2. **Labeled relevant chunks**, a human (ideally domain expert) labels relevant chunks per query, at a relevance grade if nDCG is wanted. Sizing guidance: "A focused 150-300 query set with careful labels beats 5,000 sloppy ones," stratified across single-fact, multi-hop, comparative, and ambiguous query types, breadth of query type matters more than raw count.
3. **Hard negatives**, chunks deliberately topically close but wrong (right product/wrong region, right clause/prior version, right entity/different fiscal year). Explicit purpose: they're what "separate a re-ranker that works from one that just reshuffles obviously-relevant results", a test set without hard negatives flatters every component, including a reranker that isn't actually adding anything.

Operational discipline: report per-stratum scores, never just a global average (the average hides exactly the multi-hop collapse that matters most); version the gold set like code so a metric movement is only interpretable against a fixed, versioned test set; budget to refresh a slice of the gold set quarterly from real production queries so the set doesn't calcify.

## Component ablation: isolating which piece of the pipeline to fix

A retrieval pipeline is itself a pipeline, chunker, embedding model, vector index, optional sparse/hybrid layer, optional reranker. "End-to-end recall tells you the pipeline's score, not which component to fix." Ablation methodology: hold the gold set and every other component fixed, change exactly one component, re-measure.

| Component | The question ablation answers |
|---|---|
| Chunking strategy | Does recall@k change when table/heading splitting stops? Called out as "usually the highest-leverage, most-overlooked knob." |
| Embedding model | Does a domain-tuned or larger model lift recall on hard queries? (Use MTEB to shortlist candidates, the gold set to actually choose.) |
| Hybrid search | Does adding lexical (BM25/full-text) alongside dense retrieval recover the exact-term/rare-entity queries dense retrieval smears? |
| Reranker | Does a cross-encoder over the top-N lift precision@k and MRR *without* dropping recall? |

Two rules that make ablation results trustworthy rather than confounded: change one variable at a time (changing chunker and embedding model together teaches you nothing about either individually); ablate in pipeline order, recall-affecting components first (chunking, embedding, hybrid fusion), ranking-only components last (reranker). The stated reason to ablate reranking last: "A re-ranker measured on a low-recall candidate pool looks useless... fix the pool before you grade the sort", a reranker literally cannot recover documents that never made the candidate pool, so testing it before recall is solid produces a misleading "reranking doesn't help" conclusion that is actually a masked recall problem.

## CI gating and drift monitoring

The offline gold-set suite is meant to run in CI on every change touching the retrieval pipeline (new embedding model, chunker config, prompt edit, index rebuild): compute recall@k/precision@k/MRR/nDCG against the pinned gold set, compute faithfulness/relevance with a pinned judge model, fail the build on a per-stratum regression beyond tolerance ("a drop on multi-hop queries hidden behind a flat overall score is the one you most need to catch"), and report the per-stratum scorecard as a build artifact. In production, drift is tracked separately from code changes: data drift (new documents/shifting query distribution, handled by re-running offline eval on a schedule and feeding fresh production queries into the gold set) and model drift (an upstream embedding or judge model gets silently upgraded, pin versions where the provider allows it, alarm on score movement where it doesn't).

## Why this matters for retrieval-stinger

This is the missing operational layer for retrieval-stinger's generalized evaluation guide: the Deep-Lake-specific `deeplake-08-recall-quality-eval.md` already teaches "fixed query set, before/after, posture recorded" for a single-pipeline system with one recall mode to tune. A Postgres hybrid pipeline has multiple swappable components (chunker, embedding model, full-text arm, RRF fusion, optional reranker), and this source's ablation discipline, one variable at a time, in pipeline order, reranker last because it cannot fix a recall problem, is the concrete procedure for deciding which of those components to change when a golden-query-set number is bad. The hard-negative requirement is also new relative to what this Stinger's existing eval material covers, and directly relevant to validating whether a reranker (postgres-04-reranking.md) is earning its latency cost or just reshuffling already-obvious results.
