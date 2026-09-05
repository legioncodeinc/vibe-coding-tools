# Supabase Docs: Hybrid Search (Reciprocal Rank Fusion in Postgres)
- URL: https://supabase.com/docs/guides/ai/hybrid-search
- Fetched: 2026-08-14
- Source type: official-docs
- Component: retrieval (RRF fusion formula, worked single-query Postgres implementation combining tsvector + pgvector)

## Summary

Supabase's official docs give the canonical worked implementation of Reciprocal Rank Fusion (RRF) fusing a Postgres `tsvector` full-text arm with a `pgvector` semantic arm in one SQL function, including the exact formula, the smoothing constant, and a copy-pasteable `hybrid_search()` Postgres function.

## Why fusion, not a single scoring formula

Keyword search and semantic search each independently return their own ranked result list. Fusion is the step that merges those two lists into one ranked list. The docs frame the tradeoff plainly: keyword search nails literal term matches and misses paraphrases/synonyms; semantic search catches meaning-level matches and can drag in contextually-related-but-wrong results. Combining them "identif[ies] results that are both directly and contextually relevant... while ideally minimizing misses and irrelevant suggestions."

## The RRF formula

For a record found at rank `r` in a result list, RRF assigns a per-list score of `1 / (k + r)`, summed across every list the record appears in. A record missing from a list scores 0 for that list, not a penalty beyond simply not receiving credit. Worked example straight from the docs: a record ranked 3rd in keyword search and 9th in semantic search scores `1/3 + 1/9 = 0.444`.

The `k` smoothing constant sits in the denominator specifically to keep a rank-1 hit from dominating disproportionately: `1 / (k + r)`. With `k=1`, a rank-1 record scores `1/2 = 0.5` instead of `1/1 = 1`. Supabase's worked SQL function defaults `rrf_k` to 50.

RRF's structural property: a record that ranks decently in *both* lists usually outranks a record that ranks #1 in one list but is entirely absent from the other, because the summed reciprocal-rank credit rewards consistent relevance across both retrieval modes over a single spike.

## The Postgres implementation, verbatim from the docs

Schema:

```sql
create table documents (
  id bigint primary key generated always as identity,
  content text,
  fts tsvector generated always as (to_tsvector('english', content)) stored,
  embedding extensions.vector(512)
);

create index on documents using gin(fts);
create index on documents using hnsw (embedding vector_ip_ops);
```

The `fts` column is a *generated* column (`generated always as ... stored`), so it stays in sync automatically on every insert/update with no trigger needed. The docs flag that the HNSW index operator class (`vector_ip_ops` for inner product) must match whichever distance operator the query actually uses (`<#>` here) or the index goes unused.

Fusion function (parameters: `query_text`, `query_embedding`, `match_count`, plus optional `full_text_weight`, `semantic_weight`, `rrf_k`):

```sql
create or replace function hybrid_search(
  query_text text,
  query_embedding extensions.vector(512),
  match_count int,
  full_text_weight float = 1,
  semantic_weight float = 1,
  rrf_k int = 50
)
returns setof documents
language sql
as $$
with full_text as (
  select
    id,
    row_number() over(order by ts_rank_cd(fts, websearch_to_tsquery(query_text)) desc) as rank_ix
  from documents
  where fts @@ websearch_to_tsquery(query_text)
  order by rank_ix
  limit least(match_count, 30) * 2
),
semantic as (
  select
    id,
    row_number() over (order by embedding <#> query_embedding) as rank_ix
  from documents
  order by rank_ix
  limit least(match_count, 30) * 2
)
select documents.*
from full_text
  full outer join semantic on full_text.id = semantic.id
  join documents on coalesce(full_text.id, semantic.id) = documents.id
order by
  coalesce(1.0 / (rrf_k + full_text.rank_ix), 0.0) * full_text_weight +
  coalesce(1.0 / (rrf_k + semantic.rank_ix), 0.0) * semantic_weight
  desc
limit least(match_count, 30);
$$;
```

Structural notes called out in the docs:

- Each arm is computed independently as its own CTE, each capped at `least(match_count, 30) * 2` candidates, before fusion, fusion only needs rank position, not the raw score magnitude, so over-fetching a little per arm gives the fusion step room to reorder without needing to scan the whole table.
- `full outer join ... on full_text.id = semantic.id` is what lets a record found by only one arm still participate; `coalesce(..., 0.0)` turns "absent from this list" into a zero score for that arm rather than nulling the whole row out.
- `full_text_weight` and `semantic_weight` (both default 1) are a *second* lever on top of RRF itself: they scale each arm's already-computed RRF contribution, e.g. `full_text_weight=2` doubles the lexical arm's influence on the final sum without changing the RRF math itself.
- `ts_rank_cd` is explicitly noted as "not indexable", it is computed at query time over the rows that already passed the `WHERE fts @@ websearch_to_tsquery(...)` filter, which the docs note "shouldn't be too big," i.e. the index (GIN on `fts`) narrows the candidate set first, and only that narrowed set gets ranked.

## Why this matters for retrieval-stinger

This is the direct, official reference implementation for the postgres RRF fusion guide: one Postgres function, one round trip, no second service. The `websearch_to_tsquery` + `ts_rank_cd` pairing on the lexical arm and the `<#>`-matched-to-`vector_ip_ops`-index pairing on the semantic arm are both load-bearing correctness details (operator/index mismatch silently degrades to a sequential scan or a stale rank). The two-tier weighting (RRF's own rank-position math, then an optional linear scale per arm) is the tuning surface equivalent to this Stinger's legacy `deeplake_hybrid_record(w1, w2)` presets, just implemented as rank fusion instead of a raw score blend.
