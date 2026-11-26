# Attempt log: <chip-slug>

<!--
One log per chip. Keep it in the effort folder, not in the product branch.
Add a row when an attempt ends. Never edit or delete an earlier row; add a new one.
Limits: at most 2 identical attempts, at most 3 different approaches on one problem. Then stop and report to TARS.
-->

| Field | Value |
|---|---|
| Effort | <effort-slug> |
| Chip and outcome | <chip-slug>: <one line> |
| Agent | <session id or agent name>; replaces <outbound id, or none> |
| Branch and base | <branch> from <base> |
| Armament | </smoke-it, or the routed Drone and Stinger> |
| Unit start | <timestamp with timezone, and its source> |
| Deadline | <timestamp> |
| Commits authorized | <yes or no> |
| Ledger receipts | <L-ids as OWEL returns them> |

## Problems

One section per distinct problem. A problem is one thing that blocks the outcome, for example "migration fails on a null column".

### Problem 1: <short name>

First seen: <UTC time>. Blocks: <which part of the outcome>.

| # | Approach | What changed from the last attempt | Started (UTC) | Ended (UTC) | Result | Exact error or evidence |
|---|---|---|---|---|---|---|
| 1 | A: <one line> | first attempt | | | failed | `<quoted error text>` |
| 2 | A: <same approach> | nothing: identical retry (2 of 2) | | | failed | `<quoted error text>` |
| 3 | B: <one line> | <what changed and why it could change the outcome> | | | passed | <check and its output> |

Counts: identical attempts on the current approach <n> of 2. Approaches tried <n> of 3.

Status: <open | solved | stopped at limit and reported to TARS at <UTC time>>

## Progress marks

One line each time real progress lands, so a gap of more than 5 minutes is visible.

| Time (UTC) | What changed | Evidence |
|---|---|---|
| | | |

## Checks that passed

Do not rerun a passing check unless something relevant changed.

| Check | SHA or state it covered | Result |
|---|---|---|
| | | |

## Gate history

| Sent (UTC) | Candidate SHA | MURPH verdict | Report paths | Blocking findings |
|---|---|---|---|---|
| | | | | |
