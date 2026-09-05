# Vectara NAACL 2025: Fixed-Size Chunking Benchmark

**Source:** https://arxiv.org/abs/2410.13070 (Vectara, accepted at NAACL 2025)
**Retrieved:** 2026-04-25
**Status:** **LOAD-BEARING.** Cited in `guides/00-principles.md §8` as the hard rule for chunking strategy. Carried over verbatim from the retired mind-stinger.
**Numbers tag:** **benchmarked** (paper with code, datasets, reproduction)

---

## TL;DR

> "Fixed-size chunking consistently performs as well or better than the more computationally expensive semantic chunking methods on realistic document sets."

---

## Methods compared

1. **Fixed-size chunking**: recursive character splitting at a target chunk length.
2. **Semantic chunking (Kamradt 2024)**: split between sentences when embedding similarity drops below a threshold.
3. **Proposed semantic-cluster method**: a Vectara-proposed method.

## Datasets

Three realistic retrieval tasks, multiple embedding models. Real enterprise corpora.

## Headline result

Across the three tasks and multiple embedders, fixed-size chunking via recursive character splitting matched or beat semantic chunking. The proposed semantic-cluster method did not produce a consistent lift either.

---

## Why this matters for the deploying product

- the deploying product's `chunkText()` in `knowledge-indexer.ts` produces 500-character chunks with 20% overlap: **fixed-size recursive character splitting**. Canonical per Vectara NAACL 2025.
- Vendor blogs claiming "semantic chunking gives N% lift" are typically on synthetic corpora.
- A push to adopt semantic / contextual / late / hierarchical chunking on the deploying product requires `(a)` a use-case reason and `(b)` an eval lift on the deploying product's own corpus.

---

## Implications

- `guides/00-principles.md §8` cites this paper as the canonical example of "numbers > vendor claims".
- `references/vectara-naacl-2025-chunking-finding.md` is the demoted-into-references full version.
- Severity for unjustified semantic chunking: **should-refactor** ("revert unless eval'd"). Becomes **must-fix** if adopted in production without eval.

---

## Caveats

- It does NOT say semantic chunking *never* helps. Specific structured corpora can benefit.
- It does NOT cover **contextual retrieval** (Anthropic) or **late chunking** (Jina): separate optimizations.
- It does NOT eliminate the need for corpus-specific eval; it shifts the prior.

---

## product-specific note: 500-char chunks below Cohere's optimal window

the deploying product uses 500-char chunks (~125 tokens): below Cohere's optimal ~512-token window. This is a chunk-SIZE question, separate from chunk-METHOD. Migration to ~2000 chars (~512 tokens) is a should-refactor with measurable eval gate.
