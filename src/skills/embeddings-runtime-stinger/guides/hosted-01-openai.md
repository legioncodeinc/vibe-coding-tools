# Hosted provider: OpenAI text-embedding-3

Grounded in `references/research/raw/openai--vector-embeddings-guide.md`.

## Models

| Model | Default dimension | Price | MTEB | Max input tokens |
|---|---|---|---|---|
| `text-embedding-3-small` | 1536 | $0.02/M tokens | 62.3% | 8192 |
| `text-embedding-3-large` | 3072 | $0.13/M tokens | 64.6% | 8192 |

Both are Matryoshka-trained (MRL): trailing dimensions can be dropped without losing most of the vector's concept-representing power. `text-embedding-ada-002` (previous generation) does not support this.

## Call shape

```python
response = client.embeddings.create(
    input="Your text string goes here",
    model="text-embedding-3-small",
)
vector = response.data[0].embedding
```

Batch multiple inputs in one call by passing an array to `input` (see `guides/01-batching.md` for sizing); the response returns one embedding object per input, indexed.

## Dimension reduction

Prefer the `dimensions` request parameter over manual truncation: `dimensions: 1024` on a `text-embedding-3-large` call returns a 1024-wide vector directly, still outperforming an unshortened `text-embedding-ada-002` embedding at 1536 dimensions on the MTEB benchmark for a fraction of the storage. Use this when the target column (pgvector or otherwise) is narrower than the model's native width.

If you must truncate a vector *after* it was generated at full width (rather than requesting the shorter width up front), you must re-normalize it to unit length (L2 norm) afterward, or cosine-similarity comparisons against it will be wrong:

```python
def normalize_l2(x):
    norm = np.linalg.norm(x)
    return x if norm == 0 else x / norm

cut_dim = response.data[0].embedding[:256]
norm_dim = normalize_l2(np.array(cut_dim))
```

## No asymmetric input_type

Unlike Cohere and Voyage, OpenAI's embedding endpoint has no query/document distinction, there is no `input_type` parameter. The same call shape embeds both corpus documents and search queries. This removes one class of must-fix bug (mismatched `input_type` between write and query paths) but also means OpenAI cannot apply the retrieval-specific prompt-prepending that Cohere and Voyage use to improve asymmetric search quality.

## Distance function

OpenAI recommends cosine similarity. OpenAI embeddings are pre-normalized to length 1, so cosine similarity reduces to a plain dot product, and cosine and Euclidean distance rank results identically on these vectors. On pgvector, this maps to the `vector_cosine_ops` operator class and the `<=>` operator (see `vector-store-stinger/guides/pgvector-02-indexing.md`).

## Token counting and freshness

Count tokens before embedding with `tiktoken`'s `cl100k_base` encoding (the encoding used by all third-generation embedding models). `text-embedding-3-small`/`-large` have no knowledge of events after their training cutoff; this rarely matters for embeddings (unlike generation), but can affect time-sensitive semantic matching (e.g., embedding a query about "the latest X" won't understand what "latest" means).

## When to reach for this guide

Default hosted starting point for a new feature on this repo's stack per `guides/00-selection-matrix.md`: simple call shape, no asymmetric-input discipline to get wrong, competitive pricing at the small tier. Compare against `guides/hosted-03-voyage.md` if retrieval quality on this project's actual data, or cost at volume, matters more than simplicity.
