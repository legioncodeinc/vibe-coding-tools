# Bifrost semantic caching
- URL: https://github.com/maximhq/bifrost (docs/features/semantic-caching.mdx at tag transports/v1.6.11)
- Fetched: 2026-09-04
- Source type: official repo docs

## Two lookup paths

- "Direct (hash) matching - deterministic, exact-match replay. The request is normalized and hashed; an identical request is served instantly. No embeddings required."
- "Semantic (similarity) matching - embedding-based lookup that serves a cached answer when a new request is close enough to a previous one, even if the wording differs."

"Both paths can run together (direct first, semantic on miss), or you can run direct-only with no embedding provider at all."

## Notes

- In the Web UI the feature is labeled "Local Cache" (Settings -> Caching). "Semantic caching" refers to the embedding-based mode; "direct" mode is the embedding-free path. Same plugin: `semantic_cache`.
- Benefits per doc: cost reduction, sub-millisecond cache reads, two modes, streaming support ("streamed responses are cached and replayed chunk-by-chunk").
- Vector store backends live in `framework/vectorstore/` (Weaviate, Qdrant, Redis, Pinecone per AGENTS.md).
