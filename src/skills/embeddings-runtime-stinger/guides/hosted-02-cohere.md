# Hosted provider: Cohere embed-v3 / embed-v4

Grounded in `references/research/raw/cohere--embed-api-v2-reference.md`.

## The one rule that matters: `input_type` discipline

Cohere's Embed API v2 (`POST https://api.cohere.com/v2/embed`) *requires* `input_type` on every call to embed-v3 and newer. This is an asymmetric embedding scheme: the same text embedded with a different `input_type` produces a different vector, tuned for that use.

| `input_type` | Use for |
|---|---|
| `search_document` | Text stored in a vector database for search (the corpus/write side) |
| `search_query` | A search query run against the vector DB (the query/read side) |
| `classification` | Text passed through a text classifier |
| `clustering` | Text run through a clustering algorithm |
| `image` | Image input (embed-v4 defaults image input to `search_document`-like behavior instead; Cohere recommends using `search_document` explicitly for embed-v4 images) |

**This is a must-fix-severity bug class per `00-principles.md`'s severity rubric.** Embedding the corpus with `search_document` and the query with anything other than `search_query` (or vice versa) does not error, it silently returns worse-ranked results. When auditing a Cohere integration, always check that the write path and the query path use the correct, matching `input_type` values.

## Dimension control (embed-v4+ only)

`output_dimension`: `256`, `512`, `1024`, or `1536` (default). Only available on `embed-v4` and newer; `embed-v3` models have a fixed native dimension and do not accept this parameter. Check the model generation before assuming Matryoshka truncation is available.

## Multiple output representations in one call

`embedding_types` (default `["float"]`) can request more than one representation of the same embedding per call: `float`, `int8`, `uint8`, `binary`, `ubinary`, `base64`. Useful when a pipeline needs a quantized representation for storage and a float representation for a one-time quality check, without a second API call.

## Request shape and limits

```json
{
  "model": "embed-v4.0",
  "input_type": "search_document",
  "texts": ["hello", "goodbye"],
  "embedding_types": ["float"],
  "output_dimension": 1024
}
```

- `texts` or `inputs` (mixed text/image): up to 96 per call. See `guides/01-batching.md` for general batch-sizing guidance; Cohere's per-call cap is lower than OpenAI's or Voyage's, so a bulk job needs more request round-trips at the same total volume.
- `truncate` (`NONE`/`START`/`END`, default `END`): controls what happens to over-length input; `NONE` raises an error instead of silently truncating, useful when silent truncation would be a correctness bug for the workload.
- `priority` (default 0, lower = higher priority): under load, lets an interactive query-embed call jump ahead of a bulk backfill sharing the same API key.
- `meta.billed_units` in the response reports `input_tokens`/`output_tokens` (and image units where relevant) actually billed, useful for per-request cost tracking.

## When to reach for this guide

Choose Cohere when the codebase benefits from `input_type` being a *required* parameter rather than an optional one, it forces the query/document discipline at the API boundary instead of relying on convention. Also consider it when a pipeline needs multiple quantized output representations from a single call (`embedding_types`), which neither OpenAI nor Voyage's single-call response supports in the same way.
