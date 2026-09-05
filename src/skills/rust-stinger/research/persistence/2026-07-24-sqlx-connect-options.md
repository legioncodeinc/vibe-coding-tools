---
source_url: https://docs.rs/sqlx/latest/sqlx/sqlite/struct.SqliteConnectOptions.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: sqlx
stinger: rust-stinger
---

# SQLx SQLite connection options

## Summary
`SqliteConnectOptions` exposes journal, locking, synchronous, busy-timeout, foreign-key, and statement settings. SQLx deliberately does not select a journal mode by default; WAL persists in the database and switching away from it may require an exclusive lock. The default busy timeout is five seconds.

## Key quotations / statistics
- "SQLx does not set a journal mode by default"
- "The default busy timeout is 5 seconds."

## Version/date caveat
SQLx latest docs at retrieval (the docs index reported 0.9.0). Verify APIs against the actually pinned SQLx release.

## Annotations for stinger-forge
- Grounds a single audited connection-options builder and startup verification of effective PRAGMAs.
- Prevent per-connection configuration drift in pools.
