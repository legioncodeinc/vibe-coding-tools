# Operator Classes - pgvector/pgvector (DeepWiki)

- URL: https://deepwiki.com/pgvector/pgvector/4.3-operator-classes
- Fetched: 2026-08-14
- Source type: community
- Component: vector-store (pgvector operator class internals)

## Summary

Operator classes bind a distance operator to an index access method (HNSW or IVFFlat) for a specific vector type. Picking the wrong operator class for the query's distance operator means the planner cannot use the index at all (falls back to sequential scan).

## What an operator class defines

1. Which distance operator can be used with the index (`<->`, `<#>`, `<=>`, `<+>`).
2. Which support functions the index needs internally to compute distances.
3. The data type it applies to (`vector`, `halfvec`, `sparsevec`, `bit`).
4. The index method it applies to (HNSW or IVFFlat).

## Operator class reference table

| Operator Class | Index Method | Operator | Distance Metric | Default |
|---|---|---|---|---|
| vector_ops | btree | `<`,`<=`,`=`,`>=`,`>` | Comparison | Yes |
| vector_l2_ops | ivfflat | `<->` | L2 (Euclidean) | Yes |
| vector_ip_ops | ivfflat | `<#>` | Inner Product | No |
| vector_cosine_ops | ivfflat | `<=>` | Cosine | No |
| vector_l2_ops | hnsw | `<->` | L2 (Euclidean) | No |
| vector_ip_ops | hnsw | `<#>` | Inner Product | No |
| vector_cosine_ops | hnsw | `<=>` | Cosine | No |
| vector_l1_ops | hnsw | `<+>` | L1 (Manhattan) | No |

The IVFFlat `vector_l2_ops` class is marked DEFAULT, so an IVFFlat index created with no explicit operator class uses L2. Every other combination (cosine, inner product, HNSW of any kind) must be specified explicitly in `CREATE INDEX ... USING <method> (<column> <opclass>)`.

## Why cosine distance internally uses inner product

Vectors are normalized before being written into the index, so cosine distance reduces to `1 - inner_product(A, B)`. Both HNSW's and IVFFlat's `vector_cosine_ops` support functions reuse the inner-product computation plus a normalization step rather than compute cosine distance directly. This is a storage-layout optimization, not a behavior difference visible from SQL.

## Practical implication for schema design

The operator class chosen for a column's index is a one-time decision baked into that specific index, not the column. A column can carry multiple indexes with different operator classes (e.g., one HNSW `vector_cosine_ops` and one HNSW `vector_l2_ops`) if an application genuinely needs to query by more than one distance metric, at the cost of extra storage and write amplification per additional index. In practice, pick one distance metric per embedding model's intended use (cosine for most normalized text-embedding models) and stick to it.
