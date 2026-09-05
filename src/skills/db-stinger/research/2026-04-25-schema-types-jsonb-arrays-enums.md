# Schema Types: `jsonb`, Arrays, Enums, Ranges, Custom Types

**Sources:**
- https://www.postgresql.org/docs/current/datatype-json.html
- https://www.postgresql.org/docs/current/arrays.html
- https://www.postgresql.org/docs/current/datatype-enum.html
- https://www.postgresql.org/docs/current/rangetypes.html
- https://www.postgresql.org/docs/current/sql-createdomain.html
- https://erflow.io/en/blog/postgresql-schema-design-guide
- https://www.tigerdata.com/learn/guide-to-postgresql-database-design

**Retrieved:** 2026-04-25

## Summary

Postgres ships a richer type system than most teams use. The default reflex of "everything is `varchar` and a few `int`" leaves `jsonb`, arrays, enums, ranges, and custom domains on the table, and recreates database problems badly in application code.

## `jsonb` vs separate columns

| Use `jsonb` when | Use columns when |
|---|---|
| Field is genuinely schemaless (audit payloads, vendor blobs) | Field is filtered, sorted, joined, or aggregated regularly |
| Schema varies by row (extension fields per tenant) | Schema is uniform across rows |
| Field is rarely queried: read in full or not at all | Field appears in any `WHERE` more than once a week |
| Field needs partial-update operators (`||`, `jsonb_set`) | Field updates are surgical and small |

**Rule of thumb:** if 80% of fields inside the `jsonb` are queried, they are columns. `jsonb` is for the long tail. GIN indexes (`jsonb_path_ops`) make targeted predicates fast, but they cost write throughput.

## Arrays

- Use for ordered, short, homogeneous lists where the *order matters and you query the whole array* (tags-as-strings on a row, list of contributor IDs).
- **Do not use** when you would join on the elements: make it a child table. Querying `WHERE x = ANY(arr)` works but doesn't scale once you need to filter, count, or join on the elements.
- GIN indexes work on arrays (`anyarray_ops`).

## Enums

- Closed sets that change rarely: `status`, `tier`, `role`, `kind`.
- Cheap (4 bytes), enforce at the type level, sort by definition order.
- Adding a value is `ALTER TYPE ... ADD VALUE` and is non-blocking on PG 12+.
- Removing a value is hard: use a lookup table if the set is going to churn.

## Range types

- `int4range`, `int8range`, `numrange`, `tsrange`, `tstzrange`, `daterange`.
- The killer feature: `EXCLUDE` constraint with GiST to enforce non-overlap (e.g., room bookings, employment periods).
- Composes with `&&` (overlaps), `<@` (contained in), `-|-` (adjacent).

## Custom types & domains

- `CREATE DOMAIN email AS text CHECK (VALUE ~ '^[^@]+@[^@]+$');`
- Centralize a constraint in the type, not the column. Reuse across tables.
- Composite types (`CREATE TYPE address AS (...)`) for genuinely repeating tuple shapes.

## Relevance to this stinger

Spine of `guides/01-schema-design.md`. Drives the "Postgres-first by default" hard rule. Every guide's defaults pull from this note.
