# pgvector/pgvector README

- URL: https://github.com/pgvector/pgvector
- Fetched: 2026-08-14
- Source type: official-docs
- Component: vector-store (pgvector core: types, operators, indexes)

## Summary

pgvector is the open-source Postgres extension that adds a `vector` type plus `halfvec` (half-precision), `bit` (binary), and `sparsevec` (sparse) types, exact and approximate nearest-neighbor search, and six distance metrics exposed as both SQL operators and callable functions.

## Distance operators

| Operator | Distance | Function | Notes |
|---|---|---|---|
| `<->` | L2 (Euclidean) | `l2_distance` | |
| `<#>` | (negative) inner product | `vector_negative_inner_product` | Returns the *negative* inner product; Postgres index scans only support ascending order. Multiply by -1 for the true inner product: `SELECT (embedding <#> '[3,1,2]') * -1 AS inner_product FROM items;` |
| `<=>` | cosine distance | `cosine_distance` | For cosine similarity use `1 - cosine_distance`. |
| `<+>` | L1 (Manhattan / taxicab) | `l1_distance` | Added 0.7.0. |
| `<~>` | Hamming distance | (binary vectors) | |
| `<%>` | Jaccard distance | (binary vectors) | |

## Index types

Two ANN index methods: HNSW and IVFFlat.

```sql
CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops);
```

Operator class must match the query's distance operator (`vector_l2_ops` <-> `<->`, `vector_ip_ops` <-> `<#>`, `vector_cosine_ops` <-> `<=>`).

## Vector types beyond float32

- `vector`: standard single-precision (float32) vectors, up to 2,000 dimensions for indexed columns.
- `halfvec`: half-precision (float16), roughly half the storage, indexed up to 4,000 dimensions. Common first move to cut index size/memory with minimal recall loss for text embeddings.
- `bit`: binary vectors for Hamming/Jaccard distance and binary quantization workflows.
- `sparsevec`: sparse vectors (e.g., for hybrid lexical+sparse embedding models).

## Vector element-wise operators

`+`, `-`, `*` (element-wise arithmetic, 0.5.0+), `||` (concatenate, 0.7.0+) are also supported directly on the `vector` type, independent of the distance operators.

## Language support

Any language with a Postgres client can use pgvector since it is exposed purely through SQL types, operators, and index access methods; there is no separate wire protocol or SDK requirement the way there is for a dedicated vector database.
