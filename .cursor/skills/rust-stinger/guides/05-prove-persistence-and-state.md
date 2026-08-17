# 05 — Prove persistence and state machines

## Purpose

Make SQLx/SQLite transactions, locking, migrations, crash recovery, and state transitions atomic and testable. This guide covers Command Brief action 6.

## Transaction rules

1. Acquire write intent before reading mutable budget/quota state when the operation must serialize. SQLite allows one writer; deferred transactions can fail on read-to-write upgrade, while `BEGIN IMMEDIATE` attempts write acquisition at the start ([research](../research/persistence/2026-07-24-sqlite-transactions.md)).
2. Keep eligibility, reservation, aggregate update, and idempotency record in one transaction.
3. Use a conditional SQL update/constraint as the final oversubscription guard; an in-process mutex does not coordinate other processes.
4. Treat `SQLITE_BUSY` as a bounded, observable result. A timeout is not authority for invisible unbounded retry.
5. Use the selected SQLx version's tracked transaction API. `Connection::begin_with` is documented for SQLx 0.9; revalidate or design a version-specific alternative for other lines ([research](../research/persistence/2026-07-24-sqlx-custom-transactions.md)).
6. Centralize and verify journal mode, synchronous level, foreign keys, busy timeout, and checkpoint policy. WAL improves reader/writer concurrency but still permits one writer and can grow under long readers ([research](../research/persistence/2026-07-24-sqlite-wal.md)).
7. Match product durability language to the chosen PRAGMAs; WAL with `synchronous=NORMAL` does not provide recent-transaction durability across power loss ([research](../research/persistence/2026-07-24-sqlite-pragma-durability.md)).

## Migration rules

- Embed migrations only after the database peer approves schema direction.
- Keep migrations forward-only; test old binary/new schema compatibility as required.
- Test interrupted migration, repeated startup, partial files, and crash/restart recovery.
- Preserve database, WAL, SHM, and journal companions together during recovery; SQLite's atomicity evidence relies on journal/WAL recovery and fault testing ([research](../research/persistence/2026-07-24-sqlite-atomic-commit.md)).
- Use compile-checked queries or checked-in offline metadata where practical; `migrate!` embeds migrations but does not replace compatibility/crash policy ([research](../research/persistence/2026-07-24-sqlx-migrations-queries.md)).

## State-machine proof

- Persist explicit tagged states/events and schema versions.
- Keep invalid transitions unconstructible through private types and consumed proof tokens.
- Model reservation, reconciliation, breaker, quota, pin, replay, recovery, and promotion in a reference state machine.
- Generate valid transition sequences, assert postconditions/invariants, shrink failures, and save regression seeds; upstream proptest state-machine support is sequential, so add independent concurrency evidence ([research](../research/testing/2026-07-24-proptest-state-machines.md)).
- Inject fake time, stale observations, duplicate commands, process crashes, busy writers, and restart recovery.

## Open decision checkpoints

> TODO: human decision before the relevant product slice — power-loss durability, busy timeout/UX, and final durable replay/promotion schema remain product/architecture decisions.

## Worked examples

See [concurrent budget reservation](../examples/03-edge-concurrent-budget-reservation.md) and [visible-output cancellation](../examples/02-edge-visible-output-cancellation.md).
