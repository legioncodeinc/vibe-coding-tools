# Embedding API Networking: Vector Dimensions, Batch Endpoints, and Bandwidth
- URL: https://speedtesthq.com/guides/ai/embedding-api-networking
- Fetched: 2026-08-14
- Source type: blog
- Source date: 2026-05-29
- Component: embeddings-runtime (batching guidance, dimension/bandwidth tradeoffs, embedding vs LLM latency profile)

## Summary

A networking-focused breakdown of why embedding API calls behave differently from LLM completion calls, with concrete guidance on batch sizing and the storage/bandwidth cost of dimension choice.

## Embeddings vs LLM completions: a different optimization target

Embedding calls are small, latency is dominated by network round-trip rather than inference (no autoregressive decode: input goes through the model once, output is a fixed-size float array), and the whole exchange typically completes in 50-400ms versus 1-10s for a short LLM completion. This means the optimization patterns that matter for completions (streaming, prompt caching) are largely irrelevant to embeddings; what matters instead is batching, dimension choice, and quantization.

| Operation | Server compute | Typical end-to-end |
|---|---|---|
| Single embedding | 10-50ms | 50-200ms |
| Batch of 100 embeddings | 50-200ms | 100-400ms |
| LLM completion (short) | 500ms-5s | 1-10s |

## Batching is close to mandatory

Per-input HTTP/TLS/parsing overhead is amortized across a batched request. Illustrative numbers for embedding 1000 documents:

- 1 input/request: 1000 HTTP requests, network-overhead dominated.
- 50 inputs/request: 20 HTTP requests, inference-time dominated.
- 500 inputs/request: 2 HTTP requests, server-batching gains have mostly saturated.

Rule of thumb: for background/bulk indexing, batch as large as the API's stated limit allows; for interactive search where exactly one query needs exactly one embedding, batching doesn't apply (there is nothing to batch).

## Dimension choice drives storage and bandwidth, not just quality

| Dimension | float32 size (per vector) | float16 size | int8 size | 1M docs at float32 |
|---|---|---|---|---|
| 384 | 1.5 KB | 768 B | 384 B | 1.5 GB |
| 768 | 3 KB | 1.5 KB | 768 B | 3 GB |
| 1024 | 4 KB | 2 KB | 1 KB | 4 GB |
| 1536 | 6 KB | 3 KB | 1.5 KB | 6 GB |
| 3072 | 12 KB | 6 KB | 3 KB | 12 GB |

At high volume the network cost of moving embeddings can exceed the actual inference cost: embedding 100M documents at 1536 dimensions in float32 alone moves roughly 600GB of vector data. Rough sizing guidance by corpus size: under 100K documents, dimension choice barely matters for storage/latency; 1M-10M documents, consider 768 or 1024 dimensions to keep storage and ANN index size in check; over 100M documents, quantization (binary or scalar) plus reduced dimensions become necessary because storage cost dominates.

Matryoshka-trained models are called out specifically as the way to have this both ways: train/embed once at full width, store the full vector, and query at a lower width later with no re-embedding cost (matches the mechanics in the Voyage flexible-dimensions source).

## Caching, restated

"Embeddings are deterministic - the same input always produces the same vector," making client-side hash-and-lookup caching straightforward. For high-volume pipelines processing largely-duplicate or slowly-changing content, cache hit rates of 70-95% are described as normal, with direct proportional cost savings.

## Canonical request/response shape

```
POST /v1/embeddings
{ "model": "embedding-model-v1", "input": ["text 1", "text 2"], "encoding_format": "float" }

Response:
{ "data": [{"index": 0, "embedding": [...]}, {"index": 1, "embedding": [...]}], "usage": {"prompt_tokens": 42, "total_tokens": 42} }
```
