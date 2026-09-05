# Cohere Rerank: Model Docs (rerank-v3.5 / v4.0) and the Rerank 3.5 Announcement
- URL: https://docs.cohere.com/v2/docs/rerank ; https://cohere.com/blog/rerank-3pt5
- Fetched: 2026-08-14
- Source type: official-docs (model table) + blog (3.5 launch announcement)
- Component: retrieval (cross-encoder reranking as an optional post-fusion stage)

## Summary

Cohere's Rerank models take a query plus a candidate list of documents already retrieved by some first-stage search (lexical, vector, or fused) and re-sort them by relevance. This is the reference for the cross-encoder reranking model family this Stinger's `postgres-04-reranking.md` guide names, what each model variant is for, and the context-length/chunking mechanic that governs how a document gets scored.

## What Rerank does, structurally

Per the docs: "Rerank models sort text inputs by semantic relevance to a specified query. They are often used to sort search results returned from an existing search solution." This is the definition of a reranker as a *second-stage* component: it does not retrieve candidates, it only re-orders a candidate set someone else already assembled (BM25, pgvector, RRF-fused, or otherwise). A reranker with a low-recall candidate pool cannot recover documents that were never retrieved in the first place, it can only reorder what's already there.

## Current model lineup (as of the fetched docs)

| Model | What it's for |
|---|---|
| `rerank-v4.0-pro` | Multilingual, English + non-English documents and semi-structured data (JSON); best quality for complex/state-of-the-art use cases |
| `rerank-v4.0-fast` | Light variant of v4.0-pro; same multilingual + JSON support, tuned for low latency / high throughput instead of peak quality |
| `rerank-v3.5` | Documents + semi-structured (JSON) data; English and non-English (same language coverage as embed-multilingual-v3.0); 4096-token context length |
| `rerank-english-v3.0` | English-only documents + JSON; 4096-token context length |
| `rerank-multilingual-v3.0` | Non-English documents + JSON, same language set as embed-multilingual-v3.0; 4096-token context length |

Rerank 3.5 (announced December 2024) is described as delivering "improved reasoning and multilingual capabilities to search complex enterprise data with greater accuracy" relative to the prior 3.0 generation, the headline improvement is reasoning quality and multilingual coverage, not a new modality.

## The context-length / chunking mechanic

A load-bearing implementation detail from the docs: for each document in a Rerank request, the query tokens and the document tokens are combined, and *that combined total* counts against the model's per-document context limit (4096 tokens for the v3.5/v3.0 family). If query + document together exceed the limit, Cohere's API automatically chunks that document and runs it through multiple inferences rather than truncating or erroring. This means reranking is not simply "run every full document through a cross-encoder", extremely long documents get internally split by the API itself, which affects latency and cost estimation for a reranking stage on large chunks.

## Why this matters for retrieval-stinger

The retrieval-stage boundary is explicit in the product's own framing: Rerank "sort[s] search results returned from an existing search solution", it is strictly a post-fusion refinement step, never a replacement for the retrieval/fusion stage. Both this Stinger's own gap analysis (`research/gaps.md` #1, "no reranker stage") and the general RAG-evaluation literature (see the aisuffer.com and exploreagentic.ai sources archived alongside this one) agree on the same ordering rule: fix recall (chunking, embedding model, hybrid fusion) before adding a reranker, because a reranker can only reorder a candidate pool, it cannot pull in a document that never made the pool. `rerank-v3.5`'s 4096-token context and English/multilingual split are the concrete parameters a Postgres-based RRF pipeline needs when deciding candidate-pool size (how many fused rows to hand the reranker) and cost (tokens per call scale with both query and document length, and long documents silently multiply into several internal calls).
