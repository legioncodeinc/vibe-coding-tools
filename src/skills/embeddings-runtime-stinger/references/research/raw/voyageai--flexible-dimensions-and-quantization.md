# Flexible Dimensions and Quantization - Voyage AI Docs
- URL: https://docs.voyageai.com/docs/flexible-dimensions-and-quantization
- Fetched: 2026-08-14
- Source type: official-docs
- Component: embeddings-runtime (Matryoshka truncation and int8/binary quantization mechanics, applicable pattern across providers)

## Summary

How Voyage's Matryoshka-trained models let you truncate an embedding to a shorter, still-usable vector without re-embedding, and how quantized (`int8`/`uint8`/`binary`/`ubinary`) output dtypes cut storage 4x-32x versus float32. The mechanics here generalize to OpenAI's and Cohere's equivalent Matryoshka/quantization features (same underlying training technique, MRL + quantization-aware training).

## Matryoshka embeddings

Matryoshka Representation Learning (MRL) trains a model so that, for a full-length embedding of dimension D, the first k entries (for k in a supported set, e.g. {256, 512, 1024} out of a 2048-dim vector) are *themselves* a valid, usable k-dimensional embedding, just with slightly lower retrieval quality than a model natively trained at k dimensions.

Practical consequence: you can embed once at the model's largest supported dimension, store the full vector, and later serve shorter versions by truncating, with no re-embedding call and no re-training. This is the same mechanism OpenAI's `dimensions` parameter and Cohere's `output_dimension` parameter expose.

Truncation code pattern (Python, generalizes to any MRL-trained model's raw output):

```python
def embd_normalize(v):
    row_norms = np.linalg.norm(v, axis=1, keepdims=True)
    return v / row_norms

embd = vo.embed(["Sample text 1", "Sample text 2"], model="voyage-4-large").embeddings
short_dim = 256
resized_embd = embd_normalize(np.array(embd)[:, :short_dim]).tolist()
```

The critical detail also called out in the OpenAI source: after truncating manually (not via the API's built-in dimension parameter), the vector **must be re-normalized to unit length**, or cosine-similarity math on the truncated vector will be wrong.

## Quantization (reducing bits per dimension, not truncating length)

Distinct axis from Matryoshka truncation: instead of shortening the vector, quantization reduces precision per dimension.

- `float` (default): 32-bit float per dimension. Highest precision/retrieval accuracy.
- `int8` / `uint8`: 8-bit integer per dimension (4x storage reduction vs float32).
- `binary` / `ubinary`: 1 bit per dimension, bit-packed into 8-bit integers (32x storage reduction vs float32). The returned array length is 1/8 of the nominal output dimension because 8 bits are packed per byte.

Most vector databases (Milvus, Qdrant, Weaviate, Elasticsearch, Vespa, Turbopuffer - and by extension pgvector's `bit` type / Hamming and Jaccard operators) support storing and searching quantized embeddings directly.

Binary quantization threshold rule: a dimension value <= 0 quantizes to a binary 0, a positive value quantizes to a binary 1; the resulting bit sequence is packed 8-bits-per-byte. `binary` uses "offset binary" (subtract/add 128) to represent the packed byte as a signed int8; `ubinary` represents the same bits as an unsigned uint8 directly.

## Why this matters for the dimension-lock decision

Both axes (Matryoshka truncation and quantization) are things you can change *after* embedding without calling the model again, as long as you stored the full-precision, full-dimension vector originally. That is a meaningfully different failure mode from an actual dimension change at the model level (a different model entirely, or a non-Matryoshka model's fixed native width) which is always a full re-embed. When auditing a "should we shrink the embedding column" request, the first question is whether the current model supports Matryoshka truncation to the target width (cheap: truncate + renormalize) versus requires a genuinely different model (expensive: full re-embed).
