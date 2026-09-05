---
source_url: https://www.sqlite.org/lang_transaction.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: transactions
stinger: rust-stinger
---

# SQLite transaction semantics

## Summary
SQLite permits multiple simultaneous readers but only one write transaction. `BEGIN DEFERRED` delays lock acquisition and can fail when upgrading a read to a write; `BEGIN IMMEDIATE` attempts to acquire the write transaction at the start and returns `SQLITE_BUSY` if another writer is active. Nested `BEGIN` transactions are not supported.

## Key quotations / statistics
- "Transactions created using BEGIN...COMMIT do not nest."
- "BEGIN IMMEDIATE might fail with SQLITE_BUSY"

## Version/date caveat
SQLite official page published within the six-month research window. Exact busy behavior also depends on connection busy timeout and transaction duration.

## Annotations for stinger-forge
- Critical for reservation/reconciliation write serialization and busy-retry design.
- Supports acquiring write intent before reading budget state when the operation must be atomic.
