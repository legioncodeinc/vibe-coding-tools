# Weaviate Docs: Hybrid Search (fusion algorithms and the alpha parameter)
- URL: https://docs.weaviate.io/weaviate/concepts/search/hybrid-search
- Fetched: 2026-08-14
- Source type: official-docs
- Component: retrieval (a second, independently-engineered hybrid fusion implementation, useful as a cross-check on RRF and as the source of the alpha-weighting pattern)

## Summary

Weaviate runs vector search and BM25 keyword search in parallel and merges them with a fusion algorithm. The docs describe two fusion algorithms in production (`rankedFusion`, the RRF-style original, and `relativeScoreFusion`, the current default since v1.24) with a worked numeric comparison, plus the `alpha` weighting parameter. Archived as a second, independently engineered implementation of the same hybrid-fusion problem Supabase's docs solve in Postgres, useful for cross-checking the RRF story and for the alpha-as-a-single-knob framing.

## Two fusion algorithms, and why the default changed

**`rankedFusion`** (the original, default through v1.23): each object's score is purely a function of its rank position in each list, `1/(rank + 60)`, then summed across lists, this is RRF in the same form Supabase and the general literature use it.

**`relativeScoreFusion`** (default from v1.24): instead of throwing away the score and keeping only rank position, this min-max normalizes each list's raw scores (highest -> 1, lowest -> 0, everything else scaled linearly in between), then sums the normalized scores. Weaviate's stated reasoning for switching the default: `relativeScoreFusion` "retains more information from the original searches than rankedFusion, which only retains the rankings", a search where the top vector-search results are all near-identically strong (a tight cluster) is treated differently than one where the top keyword result blows every runner-up away, and pure rank-position fusion cannot see that difference.

### Worked numeric comparison from the docs

Given 5 objects with these per-arm scores:

| Search | Ranked results (id: score) |
|---|---|
| Keyword | (1): 5, (0): 2.6, (2): 2.3, (4): 0.2, (3): 0.09 |
| Vector | (2): 0.6, (4): 0.598, (0): 0.596, (1): 0.594, (3): 0.009 |

Under `rankedFusion`, every object at a given rank position gets almost the same score regardless of the underlying magnitude, the docs explicitly note "the results for each rank are identical, regardless of the input score." Under `relativeScoreFusion`, object (1) wins the fused result because it dominated keyword search by a wide margin (5 vs 2.6) while still landing in the tightly-clustered top group on vector search, a distinction `rankedFusion` structurally cannot represent. `rankedFusion` instead puts object (2) on top since it edges out narrowly on both raw rank lists.

## The alpha parameter

`alpha` is a single scalar from 0 to 1 controlling how much weight the vector-search arm gets in the fused score:

| alpha | Meaning |
|---|---|
| 0 | pure keyword (BM25) search |
| < 0.5 | keyword-leaning |
| 0.5 | equal weight |
| > 0.5 (0.75 is the server default) | vector-leaning |
| 1 | pure vector search |

The docs explicitly warn that `0.75` is only the *server* default applied when a request arrives with no alpha set at all (GraphQL, or gRPC on Weaviate v1.36.7+); some client libraries do not leave `alpha` unset and may silently send a different effective weighting (including pure keyword in some cases) depending on client and server version. The documented guidance: set `alpha` explicitly whenever the weighting actually matters for the product, rather than relying on an implicit default.

## Search thresholds

Hybrid search supports a `max vector distance` cutoff applied only to the vector arm, to exclude semantically-too-dissimilar results even if they scored well on keyword. There is no equivalent threshold on the BM25 arm or the fused score, because BM25 scores are unbounded/unnormalized and a universal cutoff would not be meaningful across queries.

## Why this matters for retrieval-stinger

Weaviate's alpha parameter is functionally the same tuning axis as this Stinger's legacy `deeplake_hybrid_record(w1, w2)` presets and as the `full_text_weight`/`semantic_weight` pair in Supabase's Postgres RRF function, three independent systems converge on "one scalar (or one weight pair) that slides between lexical-only and vector-only, with a sane balanced default." The `relativeScoreFusion`-vs-`rankedFusion` distinction is the key architectural fact for the postgres RRF guide: pure RRF (as implemented in the Supabase Postgres function this Stinger recommends) discards score magnitude and uses rank position only, which is simpler and index-friendly but can misrank a result that dominates one arm; that is a known, documented tradeoff, not a bug, and the fix (score-normalization fusion) is more implementation complexity than most product search surfaces need to pay for upfront.
