# Postgres 05 - Chunking strategy for retrieval

How source documents get split into retrievable units before embedding and indexing. This is upstream of every other guide in this section - a bad chunk boundary caps the recall ceiling no fusion or reranking step can fix.

> Ground truth: `references/research/raw/arxiv--chunking-strategies--systematic-analysis-reliable-qa-2026.md` (fresh 2026 benchmark archived by this Stinger), cross-referenced with `.claude/skills/mind-stinger/research/2026-04-25-vectara-naacl-2025-chunking.md` and `.claude/skills/mind-stinger/references/vectara-naacl-2025-chunking-finding.md` (the Vectara NAACL 2025 finding, already load-bearing elsewhere in this Hive). Synthesis: `references/research/distilled-retrieval.md`.

---

## The citation-backed recommendation

Two independent, methodologically different 2026 benchmarks agree: **structural chunking (sentence-boundary-respecting, or fixed-size recursive splitting) matches or beats semantic (embedding-similarity-boundary) chunking as the general default.** This is not a guess or a vendor claim - it's the finding, twice:

- **Vectara NAACL 2025** (retrieval-only benchmark, three realistic tasks, multiple embedders): fixed-size recursive character splitting matched or beat semantic chunking consistently.
- **arXiv 2601.14123** (end-to-end benchmark: SPLADE sparse retrieval + generator, with abstention tracking): sentence chunking statistically tied semantic chunking up to ~5k tokens of retrieved context, and both beat plain fixed-size token chunking. Semantic chunking's edge over sentence chunking only appeared past ~5k tokens.

The practical default for this repo's stack: **default to sentence-boundary-respecting chunking** (never split mid-sentence); fixed-size recursive splitting is an acceptable, slightly weaker default when a simpler splitter is preferred. Reach for semantic (embedding-similarity) chunking specifically for very large or highly discursive documents, or when a corpus-specific eval (`postgres-06-recall-quality-eval.md`) shows a real lift - never adopt it by default on the strength of a vendor claim alone.

## Overlap: skip it unless you can prove it helps

The freshly-archived arXiv paper found overlap provided **no measurable benefit** in a sentence-aware, sparse-retrieval setup (|ΔBERTScore| ≤ 0.004, exact-match deltas ≤ 0.001), while costing real, computable overhead: for overlap ratio `v`, chunk count inflates by a factor of `1/(1-v)` - a 20% overlap means 1.25x more chunks, which is 1.25x the embedding calls at ingest, 1.25x the index storage, and duplicate near-identical results competing for the same top-k slots at query time.

**Default to 0% overlap.** Add overlap only when a specific, measured case shows a fact straddling chunk boundaries and getting lost - and even then, prefer fixing the boundary (structural or semantic splitting so the boundary lands somewhere a fact doesn't straddle) over blanket overlap as the first fix.

## The "context cliff": more retrieved context is not always better

Retrieval-answer quality in the arXiv study rose from small to moderate retrieved-context budgets, then measurably declined past roughly 2.5k tokens - not because retrieval itself got worse, but because excess retrieved context dilutes the signal a generator has to work with. The exact cliff point is generator-model-dependent and needs re-tuning per model, but a plateau-or-decline point with excessive context is described as a general RAG phenomenon, not an artifact of one setup. This is a separate knob from chunk size: even with well-chunked, well-ranked results, handing the generator too many fused/reranked rows can hurt. Cap the number of rows passed downstream and measure the cutoff on your own eval set rather than assuming "more context is strictly safer."

## Goal-driven sizing

The same study found context budget has different optimal points depending on the goal: semantic/faithfulness quality peaked at small, focused contexts (~500 tokens); exact-match/factual-recall quality peaked at larger contexts (~2.5k tokens), because larger budgets increase the odds a scattered fact is present somewhere in what's retrieved. If the product's failure mode is "the answer is vague/unfaithful," lean smaller and more focused; if the failure mode is "the answer misses a specific fact," lean larger, accepting the added noise cost.

## Chunk size as a starting point, not a target to defend

The old, still-reasonable rule of thumb (roughly 256-512 tokens, sentence-respecting) is a defensible starting point, not a number to defend against evidence. The two benchmarks above both converge on chunk sizes in a similar range (the arXiv study's own practical default is 150-300 tokens), but neither treats size as more important than the *method*: getting sentence/structural boundaries right and skipping needless overlap matter more than landing on an exact token count.

## What to check on a chunking-strategy finding

1. **Are chunks splitting mid-sentence?** A splitter that cuts sentences or tables in half is a should-refactor at minimum, a must-fix if it's visibly degrading answers.
2. **Is overlap present without a measured justification?** Unjustified overlap is a should-refactor (cost with no proven benefit) per the archived 2026 finding - same severity discipline `mind-stinger` already applies to the Vectara finding.
3. **Is semantic chunking in use as the default**, rather than reserved for large-context or highly-discursive corpora with a measured lift? Unjustified semantic chunking is a should-refactor ("revert unless eval'd"), escalating to must-fix if it shipped to production without an eval.
4. **Is the downstream context budget capped and measured**, or is "pass everything fused/reranked to the generator" the unexamined default? An uncapped context budget past the point of measured benefit is a should-refactor.
5. **Was any chunking change measured on a labeled query set before/after?** See `postgres-06-recall-quality-eval.md` - chunking changes are exactly the kind of high-leverage, easy-to-get-wrong change that needs a snapshot.
