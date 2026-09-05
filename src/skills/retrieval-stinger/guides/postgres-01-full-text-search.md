# Postgres 01 - Full-text search (the lexical arm)

The lexical half of retrieval on this repo's stack: Postgres's built-in `tsvector`/`tsquery` full-text search. This is the arm that catches exact identifiers, error strings, SKUs, and rare tokens that an embedding blurs together.

> Ground truth: `references/research/raw/postgres--full-text-search--functions-and-operators-official-docs.md` and `references/research/raw/postgres--full-text-search--controlling-text-search-ranking-official-docs.md` (official Postgres docs), synthesized in `references/research/distilled-retrieval.md`.

---

## The two types, and how they match

`tsvector` is a normalized, position-carrying representation of a document; `tsquery` is a normalized query. `tsvector @@ tsquery` (or the reverse order) is the match operator. `text @@ tsquery` also works and implicitly calls `to_tsvector()` on the text first, but doing that on every row at query time is slower than matching against a precomputed column - store the `tsvector`.

## Building the column

The standard pattern is a generated column so it never drifts out of sync with the source text:

```sql
alter table documents add column fts tsvector
  generated always as (to_tsvector('english', content)) stored;

create index on documents using gin(fts);
```

For a document with distinguishable parts (title vs body vs tags), weight each part before concatenating so title hits can outrank body hits at ranking time:

```sql
update documents set fts =
  setweight(to_tsvector(coalesce(title, '')), 'A') ||
  setweight(to_tsvector(coalesce(body, '')), 'D');
```

`coalesce(field, '')` is not optional - `to_tsvector(NULL)` returns `NULL`, and a `NULL` anywhere in a `||` chain nulls the whole concatenated vector, silently dropping that row out of every future match.

## Building the query: four functions, only one is safe for raw user input

| Function | Recognizes tsquery operators in input | Behavior on malformed input |
|---|---|---|
| `to_tsquery` | Yes (`&`, `\|`, `!`, `<->`, weight labels, `*` prefix) | Throws a syntax error |
| `plainto_tsquery` | No | Discards punctuation, ANDs surviving words |
| `phraseto_tsquery` | No | Discards punctuation, joins survivors with `<->` (order matters) |
| `websearch_to_tsquery` | A restricted, forgiving subset (quotes, `or`, leading `-`) | **Never throws** |

`websearch_to_tsquery` is the only one of the four that is safe to point directly at a raw search box: quoted text becomes a phrase, the word `or` becomes `\|`, a leading `-` becomes `!`, and everything else that doesn't parse is simply ignored rather than raising an error. Use `to_tsquery` only for queries your own code constructs programmatically, where you control the syntax.

## Ranking

Two ranking functions, both scoring how well a `tsvector` matches a `tsquery`:

- `ts_rank` - frequency-based: how often query terms appear.
- `ts_rank_cd` - cover-density: also weighs how close together the matching lexemes are. Requires positional info (a prior `strip()` call removes it and zeroes the ranking out).

Both accept a `weights float4[]` array in `{D, C, B, A}` order (default `{0.1, 0.2, 0.4, 1.0}`) matching the `setweight` labels, and an integer `normalization` bitmask controlling how document length discounts the score. Normalization bit `32` (`rank/(rank+1)`) rescales the score into `[0, 1)` - the option to reach for when a lexical rank needs to sit in a comparable numeric range alongside a vector similarity score for a hand-rolled blend (RRF fusion, `postgres-03-rrf-fusion.md`, sidesteps this entirely by fusing on rank position instead of raw score).

`ts_rank_cd` is not indexable - it has to read each candidate row's `tsvector` at query time. Run it only over the set that already passed the GIN-indexed `@@` filter, never over an unfiltered table scan.

## Highlighting results

`ts_headline(document, query, options)` builds a marked-up excerpt for display. It re-parses the *original* document text, not the stored `tsvector`, so it is slower than ranking - apply it only to the page of results actually shown to a user, never to the full candidate set. Its output is not guaranteed HTML-safe; sanitize before rendering, do not trust it against untrusted input.

## What to check on a full-text-search-only finding

1. **Is `websearch_to_tsquery` used for user-facing input?** `to_tsquery` on raw user text is a must-fix - it will throw on ordinary punctuation.
2. **Is the `tsvector` a generated, indexed column**, or computed fresh at query time on every row? The latter is a should-refactor at any real table size.
3. **Are NULL-able fields wrapped in `coalesce`** before `to_tsvector`? A missing `coalesce` silently drops rows with a NULL field from every match.
4. **Does the ranking function match the need?** `ts_rank_cd` for proximity-sensitive multi-term queries, `ts_rank` when proximity doesn't matter and the cost of positional tracking isn't worth it.
5. **Is `ts_headline` running only over the displayed page**, not the full candidate set?

## Cross-Bee handoff

Table/column shape and GIN index placement are collaborative with `vector-store-worker-bee` when the same table also carries a `vector` column (the common case for a hybrid-search table, see `postgres-03-rrf-fusion.md`); this guide owns the lexical query/ranking correctness, `vector-store-stinger` owns the storage/index side.
