# Example 03 - Edge case: concurrent budget reservation

Demonstrates [typed design](../guides/02-design-workspace-and-types.md), [bounded slices](../guides/03-implement-bounded-slices.md), [persistence/state proof](../guides/05-prove-persistence-and-state.md), and [closeout](../guides/09-close-the-loop.md).

## Input

```text
AC BUDGET-09: Two processes racing for the last $0.10 cannot reserve more than the account balance. Duplicate idempotency keys return the original reservation. Crash before commit leaves no partial reservation.
Approved decision: BEGIN IMMEDIATE; durability PRAGMA remains separately gated.
```

## Transaction pattern

```sql
UPDATE budget
SET reserved_microunits = reserved_microunits + ?1
WHERE account_id = ?2
  AND ?1 > 0
  AND limit_microunits - spent_microunits - reserved_microunits >= ?1
RETURNING reserved_microunits;
```

Convert the requested amount into a validated positive domain type before the transaction. Keep `?1 > 0` in the conditional update as a database-level defense against a negative reservation increasing the available balance. Run the eligibility check, conditional update, reservation row, and idempotency record inside one tracked write transaction. SQLite permits one writer and `BEGIN IMMEDIATE` acquires write intent before the read/modify/write sequence ([research](../research/persistence/2026-07-24-sqlite-transactions.md)); SQLx 0.9 documents `begin_with`, but the selected version must be revalidated before using that API ([research](../research/persistence/2026-07-24-sqlx-custom-transactions.md)).

## Failure-focused proof

```bash
cargo test -p router-state concurrent_last_balance_has_one_winner
cargo test -p router-state duplicate_idempotency_key_returns_same_reservation
cargo test -p router-state rejects_non_positive_reservation_amount
cargo test -p router-state kill_before_commit_recovers_all_or_none
cargo test -p router-state busy_timeout_returns_structured_contention
```

Use two real SQLite connections/processes; a process-local lock is not sufficient. Preserve database and WAL/SHM/journal companions in the crash fixture because recovery semantics depend on them ([research](../research/persistence/2026-07-24-sqlite-atomic-commit.md)).

## Output

```markdown
## Outcome
Exactly one racing process reserves the final balance; duplicate requests are idempotent; pre-commit crash recovery is all-or-none.

## Acceptance evidence
- BUDGET-09: 100 deterministic race iterations PASS with exactly one winner; crash fixture PASS.

## Peer handoffs and remaining gates
- Database: review schema/index and contention policy.
- Security: review account identifier handling and error redaction.
- Quality: wait until Security and reruns complete.
- Open: product owner must approve power-loss durability and busy UX before support claim.
```
