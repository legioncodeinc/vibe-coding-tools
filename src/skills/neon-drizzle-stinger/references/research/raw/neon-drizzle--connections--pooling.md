# Connection pooling - Neon Docs

- URL: https://neon.com/docs/connect/connection-pooling
- Fetched: 2026-08-14
- Source type: Official docs (Neon)
- Component: Neon connection patterns (pooled vs direct / pgBouncer)

## Summary (as stated on the page)

Neon connection pooling uses PgBouncer in transaction mode, accepting up to 10,000 client connections through per-user, per-database pools sized at 90% of max_connections. Use the pooled connection string (hostname with `-pooler` suffix) for serverless functions and connection-per-request workloads. Use a direct connection for schema migrations, `pg_dump`, logical replication, and queries that depend on `SET`, `LISTEN`/`NOTIFY`, or session-level state. In transaction mode, `SET`, temporary tables, and SQL-level `PREPARE`/`DEALLOCATE` are not supported on pooled connections, though protocol-level prepared statements are supported.

## Mechanics

Neon uses PgBouncer for connection pooling, enabling up to 10,000 concurrent connections. Connection pooling solves the `max_connections` limit by maintaining a pool of reusable connections instead of opening a new Postgres connection per client.

| Limit Type | Value | What it controls | When you hit it |
|---|---|---|---|
| `max_client_conn` | 10,000 | Maximum client connections to PgBouncer | Client gets: "no more connections allowed" |
| `default_pool_size` | 90% of `max_connections` | Maximum active connections per user per database | Client waits in queue (2 min timeout) |
| `max_connections` | Varies by compute | Direct connections to Postgres | Client gets: "too many connections" |

To enable pooling, add `-pooler` to the endpoint ID in the hostname:

- Direct: `postgresql://user1:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require`
- Pooled: `postgresql://user1:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require`

The pooling toggle in the Console only switches which connection string is displayed; the pooled endpoint is always available regardless.

## When to use pooled vs direct

| Use Case | Connection Type | Why |
|---|---|---|
| Serverless functions | Pooled | Many short-lived connections |
| Web applications | Pooled | Multiple concurrent requests |
| Connection-per-request frameworks | Pooled | High connection churn |
| Schema migrations | Direct | Tools may not support transaction pooling |
| Long-running analytics queries | Direct | Avoid pool contention |
| `pg_dump` / `pg_restore` | Direct | Uses `SET` statements |
| Logical replication | Direct | Requires persistent connection |
| Admin tasks | Direct | May need session-level features |

## Transaction-mode limitations (pool_mode=transaction)

Neon uses PgBouncer in transaction mode (`pool_mode=transaction`): connections return to the pool after each transaction completes. **Not supported with pooled connections**:

- `SET` / `RESET` (session variables)
- `LISTEN` / `NOTIFY`
- `WITH HOLD CURSOR`
- `PREPARE` / `DEALLOCATE` (SQL-level prepared statements, protocol-level prepared statements via the driver ARE supported)
- Temporary tables with `PRESERVE`/`DELETE ROWS`
- `LOAD` statement
- Session-level advisory locks

Workarounds: use a direct connection when session state is needed; specify schema explicitly per query (`SELECT * FROM myschema.mytable`); or set session config at the role level so it persists across transactions (`ALTER ROLE user1 SET search_path TO myschema, public;`). This also affects `pg_dump`, which relies on `SET` statements, always use a direct connection for `pg_dump`.

## PgBouncer config used by Neon (illustrative)

```ini
[pgbouncer]
pool_mode=transaction
max_client_conn=10000
default_pool_size=0.9 * max_connections
max_prepared_statements=1000
query_wait_timeout=120
```

- `max_prepared_statements=1000`: max protocol-level prepared statements per connection.
- `query_wait_timeout=120`: max seconds a query waits for a connection from the pool.
- SQL-level `PREPARE`/`EXECUTE` is not supported with PgBouncer; use protocol-level prepared statements through the database driver instead.

## Practical tip (cross-referenced from `find-pooled-connection-string-dashboard` FAQ)

A common pattern is to use the pooled URL for runtime queries and the direct URL for migrations, via two environment variables (for example `DATABASE_URL` pooled, `DIRECT_URL` direct, the same pattern Prisma's `directUrl` field uses). Direct-connection `max_connections` examples: 104 on a 0.25 CU compute, 419 on a 1 CU compute.
