---
source_url: https://sqlite.org/pragma.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: durability
stinger: rust-stinger
---

# SQLite PRAGMA durability controls

## Summary
SQLite's PRAGMA reference defines `journal_mode`, `synchronous`, `busy_timeout`, foreign-key enforcement, and checkpoint controls. The durability contract changes by journal mode and synchronous level; `OFF` does not sync, while WAL plus `NORMAL` trades away recent-transaction durability on power loss.

## Key quotations / statistics
- "you lose durability across power loss with synchronous NORMAL in WAL mode"
- With `synchronous=OFF`, SQLite proceeds "without syncing"

## Version/date caveat
Official reference retrieved 2026-07-24; platform VFS behavior can still weaken guarantees.

## Annotations for stinger-forge
- Use to require explicit, tested connection PRAGMAs rather than driver defaults.
- Final durability policy is an architecture/product decision and should be recorded.

