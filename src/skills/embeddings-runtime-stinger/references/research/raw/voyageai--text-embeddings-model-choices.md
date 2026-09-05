# Text Embeddings - Voyage AI Docs
- URL: https://docs.voyageai.com/docs/embeddings
- Fetched: 2026-08-14
- Source type: official-docs
- Component: embeddings-runtime (Voyage AI embedding models: dimensions, context length, input_type prompts, open-weight option)

## Summary

Voyage AI's current text embedding model lineup (as of this fetch), their context lengths and dimensions, the `input_type` query/document prompt-prepending mechanism, and a Voyage open-weight model available on Hugging Face.

## Current model lineup

| Model | Context (tokens) | Embedding dimension | Notes |
|---|---|---|---|
| `voyage-4-large` | 32,000 | 1024 default; 256, 512, 2048 also supported | Best general-purpose + multilingual retrieval quality |
| `voyage-4` | 32,000 | 1024 default; 256, 512, 2048 | General-purpose + multilingual |
| `voyage-4-lite` | 32,000 | 1024 default; 256, 512, 2048 | Optimized for latency and cost |
| `voyage-code-4` | 32,000 | 1024 default; 256, 512, 2048 | Optimized for code retrieval / coding-agent use cases |
| `voyage-finance-2` | 32,000 | 1024 | Finance-domain retrieval/RAG |
| `voyage-law-2` | 16,000 | 1024 | Legal-domain retrieval/RAG |

All embeddings created within the voyage-4 series (`voyage-4-large`, `voyage-4`, `voyage-4-lite`, `voyage-code-4`) are cross-compatible (comparable in the same vector space).

## Open-weight model

`voyage-4-nano` is an open-weight embedding model Voyage publishes on Hugging Face (32,000 token context, same 1024/256/512/2048 output-dimension flexibility as the hosted voyage-4 series). This is the one Voyage model that can be run locally instead of via their hosted API, for teams that want the voyage-4 embedding space without a per-call API dependency.

## `input_type`: query vs document prompting

Optional parameter, default `None`. Values: `query` or `document`.

- When set, Voyage automatically prepends a fixed instructional prefix to the input text before embedding, tailoring the vector for retrieval:
  - Query prefix: `"Represent the query for retrieving supporting documents: "`
  - Document prefix: `"Represent the document for retrieval: "`
- Embeddings generated with and without `input_type` are technically comparable/compatible, but Voyage's own guidance is that specifying `input_type` materially improves retrieval accuracy versus leaving it unset. This is the same asymmetric-embedding pattern as Cohere's `search_query`/`search_document`.

## Request limits (Python client)

- Max 1,000 texts per `embed()` call.
- Max total tokens per call varies by model: 1M for `voyage-4-lite`/`voyage-3.5-lite`; 320K for `voyage-4`/`voyage-3.5`; 120K for `voyage-4-large`/`voyage-3-large`/`voyage-code-3`/`voyage-finance-2`/`voyage-law-2`.
- `truncation` (bool, default `True`): if `False`, an over-length input raises an error instead of being silently truncated.

## `output_dimension` and `output_dtype`

- `output_dimension` (int, default `None` = model's native default): voyage-4-large/voyage-4/voyage-4-lite/voyage-3-large/voyage-3.5/voyage-3.5-lite/voyage-code-3 all support `2048`, `1024` (default), `512`, `256` via Matryoshka truncation (see the flexible-dimensions-and-quantization source for mechanics).
- `output_dtype` (default `float`): `float`, `int8`, `uint8`, `binary`, `ubinary`, the same quantized-output pattern as Cohere's `embedding_types`.

## REST and TypeScript access

`POST https://api.voyageai.com/v1/embeddings` (Bearer auth via `VOYAGE_API_KEY`). A TypeScript client (`voyageai` npm package) exposes the same functionality as the Python client and REST endpoint.
