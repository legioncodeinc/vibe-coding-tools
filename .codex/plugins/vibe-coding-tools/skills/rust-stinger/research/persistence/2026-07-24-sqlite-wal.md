---
source_url: https://www.sqlite.org/wal.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: wal
stinger: rust-stinger
---

# SQLite write-ahead logging

## Summary
WAL mode separates writes from checkpoints, permits readers alongside a writer, and persists as a database property. Automatic checkpoints occur at a default threshold of 1000 pages. Long readers can prevent checkpoint completion and grow the WAL; `synchronous=NORMAL` can lose recent committed transactions after power loss even while preserving database consistency.

## Key quotations / statistics
- "By default, SQLite does a checkpoint automatically" at 1000 pages.
- With `synchronous=NORMAL`, "transactions are no longer durable" across power failure.

## Version/date caveat
Official SQLite page updated in the research window; durability claims depend on VFS/filesystem correctness.

## Annotations for stinger-forge
- Grounds explicit journal, synchronous, checkpoint, and reader-lifetime choices.
- Contradicts any blanket claim that WAL plus NORMAL implies full power-loss durability.

