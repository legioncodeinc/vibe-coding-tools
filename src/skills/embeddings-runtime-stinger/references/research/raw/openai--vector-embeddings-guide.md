# Vector embeddings | OpenAI API
- URL: https://developers.openai.com/api/docs/guides/embeddings
- Fetched: 2026-08-14
- Source type: official-docs
- Component: embeddings-runtime (OpenAI text-embedding-3 family: dimensions, pricing, Matryoshka truncation, distance function)

## Summary

OpenAI's embeddings guide covers the `text-embedding-3-small` and `text-embedding-3-large` models: how to call the endpoint, default and reduced dimensions, pricing, and the recommended distance function.

## Models and pricing

| Model | Default dimension | ~ Pages per dollar | MTEB score | Max input tokens |
|---|---|---|---|---|
| `text-embedding-3-small` | 1536 | 62,500 | 62.3% | 8192 |
| `text-embedding-3-large` | 3072 | 9,615 | 64.6% | 8192 |
| `text-embedding-ada-002` (previous gen) | 1536 | 12,500 | 61.0% | 8192 |

Pages-per-dollar assumes ~800 tokens per page. Usage is billed per input token.

## Basic call shape

```python
from openai import OpenAI
client = OpenAI()
response = client.embeddings.create(
    input="Your text string goes here", model="text-embedding-3-small"
)
print(response.data[0].embedding)
```

The response includes `usage.prompt_tokens` / `usage.total_tokens` and the embedding vector itself, one float array per input.

## Dimension reduction via the `dimensions` parameter

Both `text-embedding-3-small` and `text-embedding-3-large` were trained with Matryoshka Representation Learning (MRL), which lets a vector be shortened (truncate trailing numbers) without losing most of its concept-representing power. Only supported on `text-embedding-3` and later models, not `ada-002`.

- Pass `dimensions: N` in the create call to get a shorter vector directly from the API (preferred approach).
- Concretely, a `text-embedding-3-large` embedding shortened to 256 dimensions still outperforms an unshortened `text-embedding-ada-002` embedding at 1536 dimensions on the MTEB benchmark.
- If you must shorten an already-generated embedding manually (rather than at request time), you must re-normalize it to unit length (L2 norm) after truncation:

```python
def normalize_l2(x):
    x = np.array(x)
    if x.ndim == 1:
        norm = np.linalg.norm(x)
        return x if norm == 0 else x / norm
    norm = np.linalg.norm(x, 2, axis=1, keepdims=True)
    return np.where(norm == 0, x, x / norm)

response = client.embeddings.create(model="text-embedding-3-small", input="Testing 123")
cut_dim = response.data[0].embedding[:256]
norm_dim = normalize_l2(cut_dim)
```

- Practical use: if a vector store only supports up to 1024 dimensions, you can still use `text-embedding-3-large` and pass `dimensions=1024`, trading a bit of accuracy for the smaller vector.

## Distance function guidance

OpenAI recommends cosine similarity. Distance function choice "typically doesn't matter much" because OpenAI embeddings are normalized to length 1, which means cosine similarity can be computed as a plain dot product, and cosine similarity and Euclidean distance produce identical rankings on normalized vectors.

## Token counting and knowledge cutoff

- Token count before embedding: `tiktoken` with the `cl100k_base` encoding for third-generation embedding models.
- `text-embedding-3-large` and `text-embedding-3-small` have no knowledge of events after September 2021 (their training cutoff); this is a minor limitation for embeddings versus generation models, but can matter for time-sensitive semantic matching.

## Use cases mentioned

Search, clustering, recommendations, anomaly detection, diversity measurement, classification; embeddings-based search compares cosine similarity between a query embedding and stored document embeddings and returns the highest-scored matches.
