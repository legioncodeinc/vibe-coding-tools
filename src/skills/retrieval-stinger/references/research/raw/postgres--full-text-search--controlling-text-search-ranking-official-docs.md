# PostgreSQL 18: Controlling Text Search (12.3 - parsing, ranking, highlighting)
- URL: https://www.postgresql.org/docs/current/textsearch-controls.html
- Fetched: 2026-08-14
- Source type: official-docs
- Component: retrieval (Postgres tsvector/tsquery construction, ts_rank normalization bitmask, ts_headline snippeting)

## Summary

This is the manual chapter (12.3) behind the function reference: it explains *why* `to_tsvector`/`to_tsquery` behave the way they do, the four query-builder functions and when to use which, the ranking-function normalization bitmask, and `ts_headline` for building result snippets. This is the section that actually explains the ranking normalization flags, which the function reference table only lists tersely.

## Building a document tsvector with weighted fields

The documented pattern for a structured document (title vs body vs tags) is to build the tsvector once, at write time, from multiple `setweight` calls concatenated with `||`:

```sql
UPDATE tt SET ti =
    setweight(to_tsvector(coalesce(title,'')), 'A')    ||
    setweight(to_tsvector(coalesce(keyword,'')), 'B')  ||
    setweight(to_tsvector(coalesce(abstract,'')), 'C') ||
    setweight(to_tsvector(coalesce(body,'')), 'D');
```

`coalesce(..., '')` matters: `to_tsvector(NULL)` returns `NULL`, and a NULL in the `||` chain would null out the whole concatenated vector.

## The four query-builder functions, when to use which

| Function | Operators recognized in input | Behavior |
|---|---|---|
| `to_tsquery` | Full tsquery syntax (`&`, `|`, `!`, `<->`, weight labels, `*` prefix match) | Strictest; throws a syntax error on anything that is not valid tsquery syntax. Use for queries your own code constructs. |
| `plainto_tsquery` | None | Normalizes words, joins survivors with `&`. Punctuation in the input is discarded, not interpreted. |
| `phraseto_tsquery` | None | Same normalization as `plainto_tsquery`, joins survivors with `<->` (phrase / FOLLOWED BY) instead of `&`, so word order in the source matters. |
| `websearch_to_tsquery` | A restricted, forgiving subset: quoted phrases -> `<->`, `or` -> `|`, leading `-` -> `!` | Never raises a syntax error. The only one of the four safe to point directly at raw, untrusted user input. |

## Ranking: ts_rank vs ts_rank_cd, and the normalization bitmask

Both ranking functions take an optional `weights float4[]` array in the order `{D-weight, C-weight, B-weight, A-weight}` (default `{0.1, 0.2, 0.4, 1.0}`), matching the `setweight` labels above so title hits (`A`) can score up to 10x a body hit (`D`) by default.

`ts_rank_cd` implements cover-density ranking (Clarke, Cormack & Tudhope 1999): it additionally factors in how close together the matching lexemes are, which `ts_rank` does not. `ts_rank_cd` requires lexeme position information and silently ignores any lexeme a prior `strip()` call removed positions from; if the vector has no unstripped lexemes, the result is zero.

Both take an integer `normalization` bitmask controlling how document length affects the score (bits can be OR'd together, e.g. `2|4`):

| Bit | Effect |
|---|---|
| 0 (default) | ignore document length entirely |
| 1 | divide rank by `1 + log(document length)` |
| 2 | divide rank by document length |
| 4 | divide rank by the mean harmonic distance between extents (`ts_rank_cd` only) |
| 8 | divide rank by the number of unique words in the document |
| 16 | divide rank by `1 + log(number of unique words)` |
| 32 | divide rank by `rank + 1`, scaling every score into `[0, 1)` |

The manual is explicit that this normalization is *not* a true percentage: "it is impossible to produce a fair normalization to 1% or 100% as sometimes desired." Bit 32 only rescales into `[0,1)` cosmetically; it does not change result ordering. Ranking is also flagged as potentially expensive because it must read each matching document's tsvector, which can be I/O-bound.

## ts_headline for result snippets

`ts_headline([config,] document text|json|jsonb, query tsquery [, options text]) -> text` re-parses the *original* document text (not a stored tsvector) to build a marked-up excerpt, so it is slower than ranking and should be applied only to the page of results actually being shown, never to every row in a broad match set. Key options: `MaxWords`/`MinWords` (default 35/15) bound excerpt length, `MaxFragments` switches from a single best-excerpt mode to a multi-fragment mode when greater than zero, `StartSel`/`StopSel` set the highlight markers. The docs carry an explicit XSS warning: `ts_headline` output is not guaranteed safe to drop directly into HTML; sanitize it or strip markup from the source document first.

## Why this matters for retrieval-stinger

`websearch_to_tsquery` is the only one of the four query builders that is safe to wire directly to a user-facing search box without a pre-validation step, because it cannot throw. The weighting/normalization bitmask is the mechanism for tuning lexical ranking within Postgres FTS itself, independent of any fusion with a vector arm; `normalization=32` is the common choice when a Postgres lexical score needs to be blended arithmetically (rather than via rank position) with a similarity score from pgvector, since it bounds both scores to a comparable `[0,1)` range.
