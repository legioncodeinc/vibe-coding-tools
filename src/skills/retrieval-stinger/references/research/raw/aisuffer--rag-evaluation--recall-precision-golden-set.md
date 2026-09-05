# How to Evaluate a RAG System (AISuffer)
- URL: https://aisuffer.com/docs/rag/04-rag-evaluation/
- Fetched: 2026-08-14
- Source type: blog
- Component: retrieval (retrieval-vs-generation evaluation split, recall@k/precision@k/MRR/nDCG definitions, golden-set construction, RAGAS ecosystem, metric-to-fix mapping)

## Summary

A 2026 practitioner guide framing RAG evaluation as two separately-scored stages (retrieval, then generation) so a bad final answer can be traced to the actual failing component instead of guessed at. Used here for the general evaluation methodology (metric definitions, golden-set discipline, metric-to-fix mapping) that generalizes cleanly from this Stinger's existing Deep-Lake-specific precision/recall guide to a Postgres-based pipeline.

## The two-stage failure model

Retrieval and generation "fail independently." Retrieval failure: the right facts never reached the model, and no prompt tuning fixes that. Generation failure: the right facts were in context but the model ignored, misread, or invented past them (hallucination). "A faithful answer over the wrong context still ships a wrong answer to your user", collapsing both stages into one end-to-end score is called out as the most common evaluation mistake, because it cannot tell you which half to fix.

## Retrieval metrics table

| Metric | What it measures | When to choose it |
|---|---|---|
| recall@k | Share of all relevant docs that land in the top k | Top concern is missing facts; low recall starves the model |
| precision@k | Share of the top k that is actually relevant | The context window fills with noise the model has to wade through |
| hit@k | Whether *any* relevant doc lands in the top k | Coarse pass/fail signal per query |
| MRR | Rewards the first relevant doc ranking early | One correct chunk is enough and position matters |
| nDCG | Graded relevance with position weighting | Some docs are more relevant than others, not binary |

Two failure modes drive most retrieval problems, and they push the same downstream symptom (a bad answer) for opposite reasons: low recall@k means the model has no facts to work with; low precision@k means the model has to find signal in noise, which itself raises hallucination risk. The guide also flags that many generators weight earlier context more heavily, so MRR/nDCG (position-aware) aren't cosmetic refinements over plain recall, getting the *order* right inside the top-k measurably changes answer quality even when the same chunk would eventually appear further down.

## Generation metrics (RAGAS-family, for context/contrast)

Faithfulness (claim-level groundedness check against retrieved context, the primary hallucination metric), answer relevancy, context precision (mean precision@k across retrieved chunks, capturing ranking quality), context recall (does retrieved context cover everything needed for the reference answer, requires ground truth). The composite "ragas score" is explicitly framed as a dashboard headline only, never a diagnosis, when it drops, decompose into the four components to find which one moved.

## Building a golden set

A golden set = curated (question, reference-answer, expected-context) triples, described as the prerequisite for "measuring almost everything above", without reference answers, context recall specifically cannot be computed at all. Construction steps given: (1) collect real user questions, not synthetic/invented ones; (2) write the correct reference answer for each; (3) tag the specific chunks/documents that should be retrieved; (4) keep it small and high-quality to start, "fifty good examples beat five hundred noisy ones." The golden set is explicitly framed as a living artifact, grown continuously by annotating real production failures (a human reviews a bad answer, writes the correct one, adds it to the set), that feedback loop is what keeps evaluation honest as content and users change over time.

## Diagnosing which stage is the bottleneck

The single comparison recommended: run the golden set and read context recall and faithfulness side by side. Low context recall -> the retriever is failing and prompt changes will not help (facts aren't in the window). High context recall but low faithfulness -> retrieval did its job, the generation step is the problem. This is presented as the fastest, cheapest diagnostic because it needs no new instrumentation once both metrics exist.

## Metric-to-fix mapping (direct, actionable table from the source)

| Symptom | Fix |
|---|---|
| Low recall@k or low context recall | Fix retrieval: re-chunk to smaller atomic units, improve the embedding model, or expand k |
| Low precision@k | Tighten retrieval: add reranking, raise the similarity threshold, or filter by metadata |
| Low MRR or nDCG | Add a reranker so the best chunk lands first |
| Low faithfulness | Constrain generation: tighten the prompt against outside knowledge, or switch models |
| Low answer relevancy | Trim the prompt, ask for more direct answers (model is padding/wandering) |
| High faithfulness but wrong facts | Context-trustworthiness problem, audit the source, not the model |

## The context-trustworthiness blind spot

A fifth dimension the standard four RAGAS-style metrics assume away: faithfulness asks whether the answer matches the retrieved context, not whether that context is itself correct, "a stale, outdated, or wrong source scores as perfectly 'faithful' while being factually wrong." This is not measurable with an LLM judge over a single answer; it has to be managed as a process (source ownership, freshness tracking, lineage), which is out of scope for a retrieval-tuning guide but worth naming as a known limit of the metric set.

## Why this matters for retrieval-stinger

This source is the general-purpose version of what this Stinger's existing `deeplake-08-recall-quality-eval.md` (formerly `10-recall-quality-eval.md`) already teaches for the Hivemind/Deep-Lake pipeline specifically (fixed labeled query set, precision + recall together, before/after discipline, posture recorded alongside the numbers). The metric definitions (recall@k, precision@k, MRR, nDCG) and the golden-set construction discipline transfer directly to a Postgres-based hybrid pipeline with no stack-specific assumptions; the retrieval-vs-generation split and the metric-to-fix mapping are the piece the Deep-Lake-specific guide did not need (Hivemind's recall pipeline has no generation stage to separate from) but a Postgres retrieval pipeline feeding an LLM answer absolutely does.
