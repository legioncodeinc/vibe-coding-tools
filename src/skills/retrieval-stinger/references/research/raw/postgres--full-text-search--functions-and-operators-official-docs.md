# PostgreSQL 18: Text Search Functions and Operators
- URL: https://www.postgresql.org/docs/current/functions-textsearch.html
- Fetched: 2026-08-14
- Source type: official-docs
- Component: retrieval (Postgres full-text search functions, operators, and the tsvector/tsquery type surface)

## Summary

Section 9.13 of the Postgres manual is the reference table for every full-text search function and operator. This is the ground truth for what `to_tsvector`, `to_tsquery`, `websearch_to_tsquery`, `ts_rank`, and friends actually take and return.

## Core operators

- `tsvector @@ tsquery` -> boolean. Does the vector match the query. Works in either argument order.
- `text @@ tsquery` -> boolean. Implicitly calls `to_tsvector()` on the text first.
- `tsvector || tsvector` -> tsvector. Concatenates two vectors; if both carry lexeme positions, the second input's positions are shifted so a later `setweight` call still lines up.
- `tsquery && tsquery` / `tsquery || tsquery` -> tsquery. AND/OR two queries together.
- `!! tsquery` -> tsquery. Negates a query.
- `tsquery <-> tsquery` -> tsquery. Builds a phrase query: matches only if the two queries match at successive lexemes.
- `tsquery @> tsquery` / `tsquery <@ tsquery` -> boolean. Containment checks on the lexeme sets, ignoring the combining operators.

## Core functions

- `to_tsvector([config,] document text) -> tsvector`. Normalizes words per the config (default English) and returns lexemes with position info. Example: `to_tsvector('english', 'The Fat Rats')` -> `'fat':2 'rat':3`.
- `to_tsvector([config,] document json|jsonb) -> tsvector`. Converts every string value in a JSON/JSONB document to a tsvector and concatenates in document order (a stopword-width gap is inserted between fields). JSONB field order is implementation-dependent; JSON preserves source order.
- `json_to_tsvector` / `jsonb_to_tsvector([config,] document, filter jsonb) -> tsvector`. Same idea but the `filter` array picks which JSON value kinds to include (`"string"`, `"numeric"`, `"boolean"`, `"key"`, or `"all"`).
- `to_tsquery([config,] query text) -> tsquery`. Normalizes each token into a lexeme and requires the input to already use `tsquery` operators (`&`, `|`, `!`, `<->`). Strict: throws a syntax error on unstructured input.
- `plainto_tsquery([config,] query text) -> tsquery`. Normalizes unformatted text and ANDs the surviving words together. Does not recognize operators, weight labels, or prefix-match labels in the input; e.g. `plainto_tsquery('english', 'The Fat & Rats:C')` -> `'fat' & 'rat' & 'c'` (the punctuation is discarded, not interpreted).
- `phraseto_tsquery([config,] query text) -> tsquery`. Same normalization as `plainto_tsquery` but inserts `<->` (FOLLOWED BY) between words instead of `&`, so lexeme order matters, not just presence.
- `websearch_to_tsquery([config,] query text) -> tsquery`. The forgiving, user-input-safe query builder: unquoted text becomes `&`-joined terms, `"quoted text"` becomes a `<->` phrase, the word `or` becomes `|`, a leading `-` becomes `!`. Never raises a syntax error, which is exactly why it is the right function for a raw search box. Example: `websearch_to_tsquery('english', 'signal -"segmentation fault"')` -> `'signal' & !( 'segment' <-> 'fault' )`.
- `setweight(vector tsvector, weight "char") -> tsvector` and the 3-arg form restricted to a `lexemes text[]` list. Labels tsvector entries with weight `A`/`B`/`C`/`D`, used later for ranking (e.g. title vs body).
- `ts_rank([weights real[],] vector tsvector, query tsquery [, normalization int]) -> real`. Frequency-based relevance score.
- `ts_rank_cd([weights real[],] vector tsvector, query tsquery [, normalization int]) -> real`. Cover-density ranking: like `ts_rank` but also weighs how close together the matching lexemes are. Requires positional info; ignores stripped vectors.
- `ts_headline([config,] document text|json|jsonb, query tsquery [, options text]) -> text`. Produces an excerpt with matched terms marked, for building search-result snippets.
- `strip(tsvector) -> tsvector`. Drops positions and weights, leaving bare lexemes.
- `array_to_tsvector(text[]) -> tsvector`. Builds a vector directly from an array of already-normalized lexemes, no dictionary processing.
- `length(tsvector)`, `numnode(tsquery)`, `querytree(tsquery)`, `tsvector_to_array(tsvector)`, `unnest(tsvector)`, inspection/debugging helpers.

## Why this matters for retrieval-stinger

`websearch_to_tsquery` is the correct default for any user-facing search box: unlike `to_tsquery` it cannot throw on malformed input, which matters when the query text is going straight into a Postgres RPC from an app frontend. `ts_rank_cd` (cover-density) is the stronger ranking function when the query has more than one term and word proximity matters for relevance, at the cost of needing an un-stripped, position-carrying tsvector. `setweight` is how a title/body/tag distinction gets baked into a single generated `tsvector` column so ranking can favor title hits over body hits without a second index.
