# How to Choose an Embedding Model: Evaluation & Tradeoffs - Qdrant
- URL: https://qdrant.tech/articles/how-to-choose-an-embedding-model/
- Fetched: 2026-08-14
- Source type: blog
- Source date: 2025-07-15 (Qdrant engineering blog, Kacper Łukawski)
- Component: embeddings-runtime (general model-selection rubric: throughput/latency/cost tradeoffs, local vs hosted framing)

## Summary

A vendor-neutral (Qdrant-authored but not pgvector/Deep Lake specific) framework for choosing an embedding model: evaluate on your own data, not a leaderboard, and weigh throughput/latency/cost as first-class production constraints alongside retrieval quality.

## Core argument: leaderboards are not your evaluation

Public benchmarks like MTEB help narrow the field but "will rarely be representative of your domain-specific data." The article's central recommendation is to build a small, domain-specific ground-truth dataset (a few hundred, even a few dozen, query-to-relevant-document pairs is enough to start) and measure `precision@k`, `MRR`, or `NDCG` on your own corpus before trusting a benchmark score.

## Tokenizer/language fit is easy to overlook

Embedding models are trained on specific languages, and their tokenizer only understands tokens it was trained on; unseen characters become `UNK` tokens, which can make semantically opposite sentences with unsupported characters look like near-duplicates in the vector space. Practical check: run the tokenizer alone (no model) on representative text and inspect the output tokens, or perturb a suspected-unsupported token and see whether the resulting embedding moves as expected.

## Checklist beyond raw retrieval quality

- **Sequence length** - check your typical document length against the model's max input; open-weight models document this on the Hugging Face model card, commercial providers should be asked directly.
- **Model size** - larger models need more memory; some only run effectively on GPU, others run fine on CPU.
- **Optimization support** - not every model supports every optimization; Matryoshka truncation and binary quantization both require specific model training characteristics (see the Voyage flexible-dimensions source for what that support looks like in practice).

## Throughput, latency, cost as production constraints

Three operational axes, explicitly distinguished from retrieval quality:

1. **Throughput** (embeddings/sec) - larger models have lower throughput; can bottleneck bulk ingestion or high-traffic periods.
2. **Latency** (time to one embedding) - matters for interactive use (search-as-you-type, chat); quantized versions of larger models can meaningfully cut latency.
3. **Cost** - infrastructure cost (CPU/GPU/memory) for self-hosted, or per-token/per-request cost for API-based. Self-hosting can mean higher upfront cost but lower marginal cost than a SaaS model at volume; the crossover point depends on sustained utilization, not sticker price.

Illustrative comparison table from the article (representative shape, not this repo's numbers):

| Model class | Precision@10 | Inference time | Memory | Cost model | Multilingual |
|---|---|---|---|---|---|
| Expensive proprietary SaaS | 0.92 | API-dependent | N/A | $0.25/M tokens | Undocumented |
| Cheaper proprietary multilingual | 0.89 | API-dependent | N/A | $0.01/M tokens | Yes, 94 languages |
| Open-source, GPU required | 0.88 | 120ms | 15GB | Self-hosted | English only |
| Open-source, CPU-capable | 0.85 | 30ms | 120MB | Self-hosted | English only |

The framing: a model that is 1% more precise but 10x slower and 10x more resource-hungry is usually not worth it; match the model to the actual latency/throughput budget of the product surface (a news-recommendation batch job prioritizes throughput, a live search box prioritizes latency, an LLM-backed chatbot may prioritize cost since retrieval isn't the slow part of that pipeline anyway).

## On local vs hosted specifically

Running the embedding model close to (or inside) the search infrastructure removes network latency and the bandwidth cost of moving vectors over the network, but self-hosting has its own expertise/ops cost. The article frames this as a genuine tradeoff rather than a default answer either way: teams that don't want infrastructure management lean toward API-based hosted models even at a quality/cost premium; teams with budget constraints or an existing ops function lean self-hosted.

## Non-finality of the decision

The article explicitly notes the embedding-model choice is not permanent: named-vector support in a vector store lets a team run multiple models side by side and migrate, and overall retrieval quality is a property of the whole pipeline (hybrid search, reranking) more than of the embedding model alone.
