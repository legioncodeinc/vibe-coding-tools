# Reconstructing context: late chunking versus contextual retrieval

- **Title:** Reconstructing Context: Evaluating Advanced Chunking Strategies for
  Retrieval-Augmented Generation
- **URL:** https://arxiv.org/html/2504.19754v1
- **Fetched:** 2026-08-17
- **Source type:** academic (arXiv preprint)

## Research questions

1. How does late chunking compare with early chunking for retrieval effectiveness?
2. How does contextual retrieval with rank fusion compare with traditional early chunking?

## Methods compared

**Late chunking.** Embed the whole document at token level first, then segment the resulting
embeddings and mean-pool, so full document context is present before the split happens.

**Contextual retrieval.** Prepend an LLM-generated summary to each chunk that situates it in
the wider document, then combine dense embeddings with BM25 sparse embeddings by rank fusion
weighted 4 to 1 in favor of dense, then rerank with a cross-encoder.

## Results

- Contextual retrieval, fixed-window chunks with rank fusion, Jina-V3: NDCG at 5 of 0.317,
  against 0.312 without fusion. Small.
- The reranking step is described as crucial to realize the potential and get consistent
  improvement.
- Late chunking generally beat early chunking but inconsistently across datasets and models.
  On NFCorpus with BGE-M3, early chunking was better.
- Tradeoff stated: contextual retrieval preserves semantic coherence more effectively but
  costs more compute; late chunking is more efficient but sacrifices relevance and
  completeness.
- Dynamic segmentation improved results but took 2 to 4 times longer to process.

## The transferable finding, and its limit

The mechanism that helps is **giving each chunk the context it needs to stand alone**. Both
winning methods are ways of injecting document-level context back into a fragment that lost
it when it was split.

The limit worth stating honestly: the measured gains are small and inconsistent, and the
study is about automated chunking of existing prose, not about how a human should write a
document. It supports the general principle that a self-contained section retrieves better
than a fragment that depends on a distant antecedent. It does not license the confident
"write like this and RAG will work" claims common in vendor advice.
