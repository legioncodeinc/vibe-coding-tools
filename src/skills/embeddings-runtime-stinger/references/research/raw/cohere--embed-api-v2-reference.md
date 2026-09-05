# Embed API (v2) - Cohere Documentation
- URL: https://docs.cohere.com/reference/embed
- Fetched: 2026-08-14
- Source type: official-docs
- Component: embeddings-runtime (Cohere embed-v4/v3: input_type discipline, output_dimension, embedding_types/quantized outputs)

## Summary

Cohere's Embed v2 API (`POST https://api.cohere.com/v2/embed`) returns text (and optionally image) embeddings, with a required `input_type` field that changes how the model represents the input depending on its downstream use.

## `input_type` (required for embed v3 and newer)

Allowed values, each producing a differently-optimized embedding for the same text:

- `search_document` - embeddings stored in a vector database for search use cases (the corpus side).
- `search_query` - embeddings of search queries run against a vector DB to find relevant documents (the query side).
- `classification` - embeddings passed through a text classifier.
- `clustering` - embeddings run through a clustering algorithm.
- `image` - embeddings with image input (embed-v4 defaults image input to `search_document` behavior instead; Cohere recommends explicitly using `search_document` when working with embed-v4 for images).

This is the same discipline as query/document asymmetric embedding in other providers (see Voyage's `input_type=query|document`): documents and queries embedded with different `input_type` values land in a semantically compatible space, but embedding a query with `search_document` (or vice versa) degrades retrieval quality even though it does not error.

## `output_dimension` (embed-v4 and newer only)

- Integer, optional. Possible values: `256`, `512`, `1024`, `1536`. Default `1536`.
- Only available starting with `embed-v4`; older `embed-v3` models have a fixed native dimension and do not support this parameter.

## `embedding_types` (default `["float"]`)

Cohere can return more than one representation of the same embedding in a single call:

- `float` - default float embeddings, supported by all Embed models.
- `int8` / `uint8` - signed/unsigned int8 embeddings (embed-v3.0 and newer).
- `binary` / `ubinary` - signed/unsigned bit-packed binary embeddings (embed-v3.0 and newer).
- `base64` - base64-encoded embeddings (embed-v3.0 and newer).

## Other request fields worth noting

- `texts` (list of string) - up to 96 texts per call.
- `inputs` (list of object) - up to 96 mixed text/image inputs per call, each with a `content` array of typed parts (`text` or `image_url`).
- `images` - up to 1 image per call for embed-v3.x (max 5MB each); no per-call image count limit for embed-v4.0+, but total image payload capped at 20MB.
- `max_tokens` / `truncate` (`NONE` | `START` | `END`) - controls what happens when input exceeds the model's max token length; `truncate=NONE` raises an error instead of silently truncating.
- `priority` (integer, default 0) - lower numbers get processed first under load; useful for prioritizing interactive query-embed calls over bulk backfill calls sharing the same API key.

## Response shape

`embeddings` is an object keyed by the requested `embedding_types`, each an array parallel to the input `texts`/`inputs` array. `meta.billed_units` reports `input_tokens`, `output_tokens`, and (for images) `images`/`image_tokens` billed for the call, useful for cost tracking per request.

## Example call

```json
{
  "model": "embed-v4.0",
  "input_type": "search_document",
  "texts": ["hello", "goodbye"],
  "embedding_types": ["float"],
  "output_dimension": 1024
}
```
