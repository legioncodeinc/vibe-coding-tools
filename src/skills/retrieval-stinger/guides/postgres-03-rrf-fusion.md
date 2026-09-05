# Postgres 03 - Hybrid fusion with Reciprocal Rank Fusion (RRF)

Combining the full-text arm (`postgres-01-full-text-search.md`) and the pgvector arm (`postgres-02-pgvector-recall.md`) into one ranked result, in one Postgres query, no second service.

> Ground truth: `references/research/raw/supabase--hybrid-search--reciprocal-rank-fusion-official-docs.md` (the reference implementation this guide follows), `references/research/raw/weaviate--hybrid-search--fusion-alpha-official-docs.md` (a second, independent fusion implementation used to name the RRF tradeoff explicitly). Synthesis: `references/research/distilled-retrieval.md`.

---

## Why fusion, not a single scoring formula

Lexical and vector search each independently rank the corpus and each misses a different class of query: lexical misses paraphrases and synonyms, vector misses exact tokens and rare identifiers. Fusion runs both arms, then merges the two ranked lists into one. Reciprocal Rank Fusion (RRF) is the standard method: score a record by its rank *position* in each list, not by the raw score, because a Postgres `ts_rank_cd` value and a pgvector cosine distance are not on comparable scales - fusing them arithmetically without normalization would be nonsense. Fusing by rank position sidesteps that problem entirely.

## The formula

For a record at rank `r` in a result list: `1 / (k + r)`. Sum across every list the record appears in; a record absent from a list contributes `0` for that list, not a penalty. `k` is a smoothing constant that keeps a rank-1 hit from dominating disproportionately - Supabase's reference implementation defaults `k=50`; the wider literature (including Weaviate) commonly cites `60`. Both are reasonable, low-sensitivity defaults; sweep it on a labeled query set only if fusion ranking quality is actually in question.

## The reference implementation

```sql
create or replace function hybrid_search(
  query_text text,
  query_embedding vector(768),
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
    row_number() over (order by ts_rank_cd(fts, websearch_to_tsquery(query_text)) desc) as rank_ix
  from documents
  where fts @@ websearch_to_tsquery(query_text)
  order by rank_ix
  limit least(match_count, 30) * 2
),
semantic as (
  select
    id,
    row_number() over (order by embedding <=> query_embedding) as rank_ix
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

Structural notes, each load-bearing:

- **Each arm is its own CTE, capped at roughly 2x the final `match_count`.** Fusion only needs rank position, not the raw score, so over-fetching a little per arm gives fusion room to reorder without a full-table scan on either side.
- **`FULL OUTER JOIN ... ON full_text.id = semantic.id`** is what lets a record found by only one arm still participate. A plain `INNER JOIN` here silently drops every record that only one arm found - a correctness bug, not a tuning choice.
- **`coalesce(..., 0.0)`** turns "absent from this list" into a zero score for that arm, not a `NULL` that would poison the sum.
- **`ts_rank_cd` runs only over rows that already passed the GIN-indexed `WHERE fts @@ ...` filter** - it is not itself indexable, so the filter is what keeps the ranked set small.

## Two tuning levers, not one

RRF's own `k` constant is one lever. `full_text_weight` / `semantic_weight` is a second, independent lever layered on top - it scales each arm's already-computed RRF contribution *after* the rank-position math, not before. This is functionally the same tuning axis as Weaviate's single `alpha` scalar (0 = pure keyword, 1 = pure vector, 0.75 = their default) and this Stinger's legacy `deeplake_hybrid_record(w1, w2)` presets. Same decision procedure applies: bias toward the lexical weight for keyword-shaped, exact-identifier queries; bias toward the semantic weight for paraphrase-heavy, conceptual queries; leave both at 1 (balanced) when the query mix is unknown or mixed.

## The known tradeoff: rank position vs score magnitude

Pure RRF discards score magnitude entirely - only rank position matters. This is a documented, real tradeoff, not a bug: Weaviate's own docs show a worked example where a rank-position fusion (their `rankedFusion`, RRF-equivalent) and a score-normalization fusion (`relativeScoreFusion`) disagree on the top result, because rank-position fusion cannot represent "this result won its arm by a wide margin, not narrowly." For most product search, plain RRF over Postgres is the right default - it's simpler, needs no cross-arm score normalization, and is what the official reference implementation ships. Score-normalization fusion (min-max normalize each arm's raw scores before summing, mirroring `relativeScoreFusion`) is a should-consider upgrade only once a *measured* case (via `postgres-06-recall-quality-eval.md`) shows plain RRF misranking a result that clearly dominated one arm.

## What to check on a hybrid-fusion finding

1. **Is the join a `FULL OUTER JOIN`, not an `INNER JOIN`?** An inner join silently drops single-arm hits - must-fix.
2. **Are `NULL` ranks coalesced to `0.0`** before the weighted sum, not left as `NULL` (which would poison the whole row's score)?
3. **Does each arm's `ORDER BY` actually match its stated index** (GIN for `ts_rank_cd`, the correct operator class for the vector distance)? See `postgres-01-full-text-search.md` and `postgres-02-pgvector-recall.md`.
4. **Is the weighting matched to query intent**, or is it the same 1/1 every time regardless of whether the query is keyword-shaped or conceptual? One fixed weighting for every query is a should-refactor, the same rule this Stinger has always enforced for the legacy Deep Lake hybrid path (`deeplake-02-hybrid-search.md`).
5. **Was a weighting or `k` change measured before/after** on a labeled query set? "Feels better" is not evidence - see `postgres-06-recall-quality-eval.md`.

## Cross-Bee handoff

The column shape and index choice backing each arm belong to `vector-store-worker-bee`; this guide owns the fusion query and its tuning. The embedding model producing `query_embedding` belongs to `embeddings-runtime-worker-bee`.
