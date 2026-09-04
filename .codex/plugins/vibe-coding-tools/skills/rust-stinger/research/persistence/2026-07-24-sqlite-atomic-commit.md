---
source_url: https://www.sqlite.org/atomiccommit.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: recovery
stinger: rust-stinger
---

# SQLite atomic commit and crash recovery

## Summary
SQLite documents how rollback journals provide atomic commit across process, OS, and power failures, including hot-journal recovery. It also documents assumptions and failure modes around filesystem locking, sync behavior, file renames, and deletion of journals. SQLite's own confidence rests on fault-injecting VFS crash tests, not code inspection alone.

## Key quotations / statistics
- "either all database changes within a single transaction occur or none"
- "crash tests ... simulate incomplete sector writes"

## Version/date caveat
This page primarily describes rollback-journal mode; WAL atomicity uses a different mechanism documented separately.

## Annotations for stinger-forge
- Strong evidence for crash/restart and filesystem-fault tests around local state.
- Preserve database, WAL, SHM, and journal files together during recovery/support operations.
