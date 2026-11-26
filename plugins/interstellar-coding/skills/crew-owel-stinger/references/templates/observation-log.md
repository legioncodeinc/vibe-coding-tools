# OWEL observation log: {effort slug}

Ledger state: {OK, last entry L-######, verified at UTC time | HALTED at L-######, UTC time}

Ledger path: {library/knowledge/private/ledger/ledger.jsonl | fallback: effort/crew/ledger/ledger.jsonl}

This log is OWEL's working state. It is not the ledger and it may be edited. It stays in the effort folder and is never published.

## Sweep cursors

Where the last pass stopped. The next pass starts here.

| Source | Cursor (last item seen) | Swept at (UTC) | Skipped or unreachable |
|---|---|---|---|
| Contracts (`library/knowledge/private/contracts/`) | {CTR number and revision, or commit} | {time} | {none, or why} |
| PRDs and IRDs | {highest prd and ird number seen, or commit} | {time} | {none, or why} |
| Open PRs | {PR numbers seen} | {time} | {none, or why} |
| Merged PRs | {last merged PR number or SHA} | {time} | {none, or why} |
| Crew messages | {last message id or time} | {time} | {none, or why} |
| Session transcripts | {session id and position per transcript} | {time} | {none, or why} |
| Outbox drained | {count drained} | {time} | {none, or why} |

## Candidates

One row per thing noticed. Do not delete rows; change the status.

| # | Noticed (UTC) | Source (path, PR, message, transcript position) | What it is | Kind | Action | Status | Result (doc path, ADR number, ledger id) |
|---|---|---|---|---|---|---|---|
| 1 | {time} | {source} | {one line} | {owner decision, ADR, knowledge, already documented, stale, not OWEL's} | {write ADR, write doc, extend doc, ledger only, told TARS, none} | {open, in progress, done, handed off} | {result} |

## Owner decisions recorded

| Ledger id | Said at (UTC) | Exact words | Source | Verified at source |
|---|---|---|---|---|
| {L-######} | {time} | "{quote}" | {session, transcript path and position, message id} | {yes, or relayed by ROLE and not verified} |

## Documents written or revised

| Path | New or revised | Private or public | Grounded in | Ledger id (`doc`) | Committed |
|---|---|---|---|---|---|
| {library/knowledge/private/domain/slug.md} | {new} | {private} | {sources} | {L-######} | {no, waiting for authorization | yes, SHA} |

## Public candidates

Private documents that might be safe to publish. The owner decides.

| Path | Why it might be public | What must be removed first | Owner decision |
|---|---|---|---|
| {path} | {reason} | {none, or list} | {waiting, or exact words and time} |

## Passed to other roles

| Sent (UTC) | To | What | Reply |
|---|---|---|---|
| {time} | {TARS, KIPP} | {one line} | {reply or waiting} |
