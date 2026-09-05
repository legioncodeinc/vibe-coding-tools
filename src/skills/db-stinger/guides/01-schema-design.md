# 01: Schema Design

Postgres-first schema. Use the type system; don't reinvent it in app code.

Source: `research/2026-04-25-schema-types-jsonb-arrays-enums.md`.

## Default scaffolding for any new table

```sql
CREATE TABLE example (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- modern; not BIGSERIAL
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- ... real columns
  -- soft delete only when you have a use case
  -- deleted_at TIMESTAMPTZ
);
```

- **Primary key:** `BIGINT GENERATED ALWAYS AS IDENTITY` is the 2026 default. `BIGSERIAL` works but is legacy syntax. UUID v7 (`uuid_generate_v7()` from `pg_uuidv7` or `gen_random_uuid()` for v4) when you need globally unique IDs across services or to obscure row count from clients.
- **Timestamps:** `TIMESTAMPTZ`, never `TIMESTAMP` (the former stores UTC and is unambiguous).
- **`updated_at`:** maintained by a `BEFORE UPDATE` trigger. Don't trust application code.
- **Soft delete:** `deleted_at TIMESTAMPTZ` only when the use case demands history. Default to hard delete; soft delete is a compliance / audit feature.

## Type selection: the cheat sheet

### Strings
- `text` for everything. **Never** `varchar(n)` unless a constraint is enforced: `varchar(255)` is a MySQL holdover with no advantage in Postgres.
- Add a `CHECK (length(col) <= N)` if you need a length constraint.

### Numbers
- `BIGINT` for IDs and counts that could grow. `INT` for fixed-range values.
- `NUMERIC(p, s)` for money and any value where rounding matters. **Never** `DOUBLE PRECISION` for money.

### Booleans
- `BOOLEAN`. Keep nullable only when "unknown" is a valid third state; otherwise `NOT NULL DEFAULT false`.

### Dates and times
- `TIMESTAMPTZ` for points in time. `DATE` for calendar dates. `TSRANGE` / `TSTZRANGE` for intervals (paired with `EXCLUDE` constraints, see below).

### `jsonb` vs columns

Apply the 80/20 test from `research/2026-04-25-schema-types-jsonb-arrays-enums.md`:

| Use `jsonb` when | Use columns when |
|---|---|
| Schema varies per row (extension fields per tenant) | Schema is uniform |
| Field is read in full or not at all | Field is filtered, sorted, joined, aggregated |
| Audit payloads, vendor blobs, webhook records | Anything that appears in `WHERE` more than once a week |

GIN index for targeted predicates:
```sql
CREATE INDEX ON events USING gin (payload jsonb_path_ops);
```

`jsonb_path_ops` is smaller and faster than `jsonb_ops` when you only need `@>` containment.

### Arrays
- Ordered short lists where you read the whole array.
- **Don't** use when you'd join on elements: use a child table.

### Enums
```sql
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'refunded');
ALTER TABLE orders ADD COLUMN status order_status NOT NULL DEFAULT 'pending';
```
- Closed sets that change rarely.
- Adding values is cheap on PG 12+ (`ALTER TYPE ... ADD VALUE`).
- Removing is hard: switch to a lookup table if churn is expected.

### Range types and `EXCLUDE`
The killer feature for non-overlapping intervals:
```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE bookings (
  room_id BIGINT NOT NULL,
  during TSTZRANGE NOT NULL,
  EXCLUDE USING gist (room_id WITH =, during WITH &&)
);
```
No two bookings for the same room can overlap. Enforced in the database, not in optimistic-locking app code that breaks under concurrency.

### Custom domains
```sql
CREATE DOMAIN email AS text CHECK (VALUE ~* '^[^@]+@[^@]+\.[^@]+$');
ALTER TABLE users ADD COLUMN email email NOT NULL UNIQUE;
```
Centralize a constraint in the type. Reuse across tables.

## Constraints

### `NOT NULL`
Default-on for almost every column. The exception is genuine optionality (nullable FK to a deletable parent, optional user attribute). `NOT NULL` is not just safety: the planner uses it.

### `CHECK`
Express invariants the database can enforce: `CHECK (price >= 0)`, `CHECK (started_at <= ended_at)`. Cheap to add; use generously.

### `UNIQUE`
Enforces a single-column or multi-column uniqueness constraint. Backed by a unique B-tree index. Partial uniqueness:
```sql
CREATE UNIQUE INDEX users_email_active ON users (email) WHERE deleted_at IS NULL;
```

### Foreign keys
```sql
ALTER TABLE posts
  ADD COLUMN author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT;
CREATE INDEX ON posts (author_id);  -- MUST-FIX: every FK gets an index
```

`ON DELETE` choice: `RESTRICT` (default-safe), `CASCADE` (cascading delete), `SET NULL` (preserve child, null the FK). Pick deliberately.

## Normalization: and where to break it

3NF by default. Break it deliberately for:
- **Denormalized counts** (`comments_count` on `posts`): maintained by a trigger or app code; cite the trade-off in a comment.
- **Materialized views** for expensive read aggregates; refresh on a schedule.
- **`jsonb` snapshots** of related data (denormalized order line items copied into `order_history`), when historical accuracy matters and the source can change.

## Audit columns: when

The minimum: `created_at`, `updated_at`. Add when needed:
- `created_by`, `updated_by`: for compliance / customer-support traceability.
- A separate `audit_log` table for tamper-evident history; use logical replication / triggers.

For deeper audit, hand off to `security-worker-bee`.

## PII and security flags

Mark columns that hold PII so `security-worker-bee` can audit RLS, encryption, and retention:

```sql
COMMENT ON COLUMN users.email IS 'PII';
COMMENT ON COLUMN users.phone_number IS 'PII';
COMMENT ON COLUMN payments.last_four IS 'PII (PCI-adjacent)';
```

These comments become discoverable via `pg_description`. db-worker-bee flags PII; security-worker-bee audits the controls.

## Cross-references

- `02-indexing.md`: every column you filter on needs an index plan.
- `03-migrations.md`: schema changes after launch require expand-backfill-contract.
- `07-orm-choice.md`: the ORM you pick will or won't support these types fully.
