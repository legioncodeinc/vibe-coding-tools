# A Systematic Analysis of Chunking Strategies for Reliable Question Answering (arXiv 2601.14123)
- URL: https://arxiv.org/html/2601.14123
- Fetched: 2026-08-14
- Source type: community (arXiv preprint, industrial study; not a vendor doc)
- Component: retrieval (chunking strategy: method, size, overlap, and context-budget tradeoffs, benchmarked end to end)

## Summary

Sofia Bennani and Charles Moslonka (published while at Artefact) run a systematic, end-to-end benchmark of chunking method (token/fixed-size, sentence, semantic, code), chunk size, overlap, and retrieved-context budget against Natural Questions, using a standard industrial pipeline: SPLADE sparse retrieval + a Mistral-8B-class generator instructed to answer only from context or output "NONE". This is a second, independent, fresh-2026 chunking benchmark for retrieval-stinger's own chunking guide, distinct from the Vectara NAACL 2025 paper already archived at `mind-stinger/research/2026-04-25-vectara-naacl-2025-chunking.md` (which compared fixed-size vs semantic chunking on a different set of realistic retrieval tasks and reached a compatible, fixed-size-favoring conclusion).

## Method

Four chunking methods compared at chunk sizes 50-500 tokens (step 50), overlap 0% or 20%, and retrieved-context budgets of {500, 1k, 2.5k, 5k, 10k} tokens, using a "fill-to-budget" retrieval policy (append ranked chunks until the token budget is hit) so comparisons aren't biased by fixed chunk-count limits:

- **Token**: fixed-size sliding windows, optional overlap.
- **Sentence**: respects sentence boundaries; never splits a sentence.
- **Semantic**: sentence-preserving; merges adjacent sentences while cosine similarity (all-MiniLM-L12-v2) stays above 0.5, up to the target size.
- **Code**: structure-aware (functions/classes); included for completeness, not competitive on this text-centric benchmark.

Metrics: BERTScore (semantic answer quality vs reference), Exact Match (EM), and an abstention "None Ratio" (how often the model correctly or incorrectly refuses to answer). 95% bootstrap confidence intervals over questions.

## Findings (F1-F4, verbatim conclusions)

**F1, Overlap adds cost without measurable gain.** Adding 10-20% overlap did not move BERTScore or EM outside noise (|ΔBERTScore| ≤ 0.004, EM deltas ≤ 0.001) in this sentence-aware, sparse-retrieval (SPLADE) setup. Mechanism: with sentence-respecting boundaries and a sparse retriever, boundary spillover rarely changes what's in the top-ranked content, overlap mostly creates near-duplicate chunks. Cost is not free: for overlap ratio `v`, chunk count inflates by `1/(1-v)` (20% overlap = 1.25x more chunks), which is paid in embedding/indexing time, storage, and index size. Recommendation: default to 0% overlap unless you have specific evidence your retriever benefits from boundary redundancy.

**F2, Method tier list: sentence ≈ semantic > token >> code (for text).** Sentence and semantic chunking were statistically tied up to ~5k tokens of context budget; token (fixed-size) chunking lagged both; code-aware chunking was not competitive on this text-centric task. Mechanism: sentence-preserving methods keep topical coherence and avoid mid-sentence fragmentation, which helps both retrieval precision and how well the generator can ground on what it received. Semantic chunking's edge over sentence chunking only appears at very large context budgets (>5k tokens), likely from packing more semantically-contiguous text per chunk. Recommendation: default to sentence-based chunking; reach for semantic chunking specifically for very large or highly discursive documents, not as a general-purpose upgrade.

**F3, The "context cliff": more retrieved context is not always better.** Performance rose from small to moderate context budgets, then measurably dropped past ~2.5k tokens (for sentence chunking at 0% overlap / 300-token chunks, BERTScore was flat between 500-2500 tokens, then declined ~4-5% relatively at 10k tokens). Mechanism: long-context generation can be distracted or diluted by redundant/off-topic retrieved chunks once the budget gets large, even though nothing about retrieval itself got worse. The paper is explicit that the exact cliff point is model-dependent (measured on Ministral-8B-Instruct-2410) and needs re-tuning per generator, but the existence of some plateau-or-decline point with excessive retrieved context is described as "a consistent phenomenon in RAG" generally, not an artifact of this one setup.

**F4, Goal-driven tuning: small context for semantic/faithfulness quality, larger context for exact-match/factual recall.** BERTScore (semantic quality) peaked at small, focused context budgets (~500 tokens); Exact Match peaked at larger budgets (~2.5k tokens). Abstention rate ("NONE" outputs) fell as budget grew (~30% at 500 tokens down to ~11% at 10k), because larger budgets pull in more of the disparate mentions a fact might be scattered across. Mechanism: small budgets concentrate the single most relevant evidence (good for faithfulness / not padding the model with distractors); larger budgets increase the odds the specific fact needed is present somewhere in context (good for recall/EM), at the cost of more abstention-reducing noise.

## Practical defaults table (from the paper's own conclusion)

| Choice | Default | Rationale |
|---|---|---|
| Overlap | 0% | No measurable benefit in this setup; reduces cost/complexity |
| Chunker | Sentence | Statistically ties semantic up to ~5k tokens; cheaper to compute |
| Chunk size | 150-300 tokens | Balances recall against abstention |
| Context budget (QA / exact-match tasks) | ~2.5k tokens | Avoids the context cliff; boosts EM |
| Context budget (summarization / faithfulness tasks) | ~500 tokens | Maximizes semantic faithfulness |
| When context budget > 5k | Consider semantic chunking | Slight edge over sentence chunking only at that scale |

The paper explicitly scopes its own limits: it intentionally excludes rerankers and late-interaction retrieval (e.g. ColBERT) to isolate chunking's effect on the base retriever alone, and flags that results on Natural Questions (general text, English Wikipedia) may not transfer directly to specialized domains like legal or technical documentation without separate validation.

## Why this matters for retrieval-stinger

This is a second, methodologically distinct (SPLADE sparse + generator abstention protocol, vs Vectara's retrieval-only benchmark) 2026 source reaching a compatible conclusion to the already-archived Vectara NAACL 2025 finding: plain structural chunking (sentence-respecting here, fixed-size-recursive there) matches or beats "smarter"-sounding semantic chunking as a general default, and semantic chunking's case is narrow (large context budgets, or specific corpus shapes) rather than universal. The genuinely new, independent contribution for this Stinger's guide is F1 (overlap measurably does not help with a sentence-aware sparse retriever, and has a real, computable storage/indexing cost) and F3 (the "context cliff", a documented reason to cap how many fused/reranked rows get handed to the generator, separate from and after the recall@k question this Stinger's evaluation guide already covers).
