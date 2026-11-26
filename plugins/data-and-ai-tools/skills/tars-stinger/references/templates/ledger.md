# TARS ledger: <effort name>

Owner: <name>. TARS session: <title and id>. Started: <UTC>. State folder: <path>.

## Timers and watchers

| What | Id | Armed (UTC) | Notes |
|---|---|---|---|
| 10-minute tick (CronCreate) | | | expires 7 days after creation |
| CI poller (Monitor) | | | re-arm every 30 minutes or on stale heartbeat |
| CASE | | | separate Desktop helper; temporary fallback limitations recorded |
| KIPP | | | separate Desktop idea factory and PRD writer |
| Session registry (`tars-registry.mjs`) | | | register again after any `/clear`; unregister at close-out |

## Sessions

| Chip title | task_id | Session id | Scope | PR | State | Last real progress (UTC) |
|---|---|---|---|---|---|---|

## Registries

Only TARS assigns from these. Free an entry when its holder reports done.

### PG TOKEN slots

| Slot | Holder (session) | Port | Granted (UTC) | Freed (UTC) |
|---|---|---|---|---|

### HARNESS runs

| Run | Holder (session) | Target | Started (UTC) | Ended (UTC) | Result |
|---|---|---|---|---|---|

### Migration numbers

| Number | Holder (session) | PR | Reserved (UTC) | State |
|---|---|---|---|---|

## Log

Append only. One line per event: `- <UTC> <event>. Decision: <what>. By: <TARS | CASE within recorded delegation | owner | PreCompact hook>.`

A deferral quotes the owner's words, time and source; anything else left undone is logged as `UNAPPROVED DEFERRAL`. An owner-directed deviation (for example the owner telling TARS to run a production script itself) records the exact words and UTC time before the action.

## Profile, delegation, ideas and PRDs

Owner profile: <local path>. Delegation source/scope: <exact owner record or none>. CASE/KIPP settings verified: <UTC and observations>.

| Card path | Priority | Confirmed FR/PRD/CTR | CASE ruling/conditions | PRD path | State |
|---|---|---|---|---|---|
