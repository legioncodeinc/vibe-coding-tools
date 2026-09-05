# pgvector vs Pinecone vs Qdrant vs Weaviate (2026): Which We Actually Use in Production

- URL: https://www.kalviumlabs.ai/blog/vector-databases-compared-pgvector-pinecone-qdrant-weaviate/
- Fetched: 2026-08-14
- Source type: blog
- Component: vector-store (production benchmark comparison: pgvector, Pinecone, Qdrant, Weaviate)

## Summary

Production-sourced comparison (pgvector and Pinecone numbers from live systems; Qdrant/Weaviate from published benchmarks plus spot checks). Test conditions: 1536-dimensional vectors (OpenAI `text-embedding-3-small` size), 1M vector corpus unless noted, cosine distance.

## Headline numbers

- pgvector is the default for most RAG systems in this shop: runs inside Postgres, eliminates a separate managed service, handles 2M vectors without special tuning.
- Pinecone delivers sub-20ms p95 latency at 5M+ vectors but costs 3-8x more than a comparable Postgres instance at the same vector count.
- Qdrant self-hosted: ~850 QPS at p95 ~8ms on 1M vectors (Qdrant's own published benchmark, 768-dim).

## Latency/throughput at 1M vectors, 1536-dim, cosine

| Config | QPS | p95 Latency |
|---|---|---|
| pgvector HNSW (`m=16`, `ef_construction=64`) | ~220 | ~48ms |
| pgvector HNSW (4 parallel workers) | ~360 | ~58ms |
| pgvector IVFFlat (`lists=100`) | ~90 | ~70ms |
| Pinecone Serverless (us-east-1) | ~340 | ~28ms |

HNSW beats IVFFlat on query latency for online systems; the tradeoff is slower, more memory-intensive index builds (roughly 3-4x the memory of an equivalent IVFFlat index at 1M vectors in this shop's testing).

## Where pgvector breaks down

Past ~2M vectors on a single Postgres instance, index build times exceed 20 minutes and `VACUUM` starts competing with query traffic. At 5M vectors, p95 climbs to 80-140ms depending on `ef_search`, versus Pinecone staying under 30ms on pod-based deployments — that gap is what drives most of this shop's database switches at scale.

pgvector's metadata filtering happens as a **post-filter** on the ANN candidate set, not inside the HNSW graph traversal. On a 5M-vector collection with a 10% selectivity filter, a query scans roughly 500K candidates to return 50K results. Qdrant and Pinecone apply filters inside the graph traversal, which is materially faster for selective filtered queries at scale.

## Cost at scale (approximate, Supabase Postgres vs Pinecone)

| Scale | pgvector (Supabase Pro) | Pinecone Estimate |
|---|---|---|
| 500K vectors, moderate traffic | $25/month | ~$15-25/month |
| 1M vectors, moderate traffic | $25/month | ~$50-80/month |
| 5M vectors, production traffic | $60-100/month | ~$250-400/month |
| 10M vectors, production traffic | $120-200/month | ~$600+/month |

## Decision framing by engine

- **pgvector**: already on Postgres, corpus stays under ~2M vectors, vector search and relational data need to live in the same transaction, cost-conscious. Start here.
- **Pinecone**: sub-20ms p95 needed at 5M+ vectors and willing to pay the premium to avoid infrastructure; also good for fast prototyping without index tuning.
- **Qdrant**: near-Pinecone latency without the Pinecone bill, team comfortable with Docker/Kubernetes, queries have selective metadata filters on large collections (Qdrant's in-graph filtering is the standout advantage here), or production-ready hybrid dense+sparse (BM25 + semantic) search is a requirement without adding external tooling.
- **Weaviate**: multi-modal out of the box and built-in hybrid search, but a steeper schema/SDK learning curve (v3 to v4 was a breaking change) than the docs suggest.
