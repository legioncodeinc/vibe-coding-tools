---
source_url: https://docs.rs/sqlx/latest/sqlx/trait.Connection.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: locking
stinger: rust-stinger
---

# SQLx custom transaction start

## Summary
SQLx 0.9.0 exposes `Connection::begin_with` to begin a tracked transaction using a database-specific statement. This permits SQLite `BEGIN IMMEDIATE` while retaining the `Transaction` commit/rollback API. The function rejects statements that do not actually enter a transaction, which is safer than issuing an unrelated raw statement and assuming tracking.

## Key quotations / statistics
- "Begin a new transaction with a custom statement."
- It errors if the statement "does not put the connection into a transaction."

## Version/date caveat
This API appears in SQLx 0.9.0; SQLx 0.8-era projects need a version-specific alternative and should not copy the call blindly.

## Annotations for stinger-forge
- Resolves the primary SQLx mechanism for write-intent acquisition before budget reads.
- Pair with bounded busy handling, conditional updates, and concurrency/crash tests.

