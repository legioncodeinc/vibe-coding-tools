# 01. Start and resume: TARS

Covers the first start of a crew effort and the recovery order after compaction. The shared procedure is [the crew recovery guide](../../crew-protocol/guides/03-session-start-and-compaction-recovery.md); use [the recovery worksheet](../../crew-protocol/references/templates/recovery-worksheet.md) to record what was restored.

## First start

1. **Claim check.** When `/interstellar` is typed, the crew hook prints a line saying this session is claimed as TARS. If no hook line appears, hooks are not active in this host. Say so in one line. The fallback is the owner saying "re-ingest /interstellar" at start and after every compaction. The hook only injects context; it does not enforce anything.
2. **Read the contract, then arm.** Read [the crew contract](../../crew-protocol/references/REFERENCE.md). Then load `tars-stinger` (its `SKILL.md`, guides 00, 01, 07 and 08, and `references/REFERENCE.md`) and note the overrides in [REFERENCE.md](../references/REFERENCE.md). Skip guide 01 step 6: the crew's CASE and KIPP come from the boot order, not from the `tars-stinger` briefs.
3. **Host check.** Load the chip and session tools named in the `tars-stinger` tool map. If they load, the crew runs as separate desktop sessions. If they do not, do not stop as `tars-stinger` alone would: use the subagent fallback in [guide 02](02-run-the-crew.md) and tell the owner in one line which mode this is and what it lacks.
4. **Effort folder.** Use the `tars-stinger` state layout (default `<repo>/.tars/<effort-slug>/`, in an already ignored location). Inside it create `crew/outbox/` and `crew/handoffs/`, and copy [the crew roster template](../../crew-protocol/references/templates/crew-roster.md) to `crew/roster.md`. The other `crew/` folders belong to MOON, LADY and OWEL; do not create files in them.
5. **Take stock.** List running sessions before spawning anything. A session already holding a role goes on the roster after the owner says yes; never spawn a duplicate.
6. **Boot the crew** in the order in [guide 02](02-run-the-crew.md). Timers and watchers from `tars-stinger` are armed only for the authorized run.
7. **First ledger line.** Once OWEL is live, send `LEDGER TARS progress | <effort> | crew effort started; roster at crew/roster.md | evidence: <effort>/crew/roster.md | by: TARS`.

## What to restore, and from where

| State | Where it lives | Notes |
|---|---|---|
| Role, role skill, effort folder | The compaction summary (the `PreCompact` hook asks for these) and the hook's start notice | If the effort folder is not named, look for `<repo>/.tars/*/crew/roster.md`. More than one match: ask the owner |
| Who holds each role | `<effort>/crew/roster.md` | Treat every session id as unverified until it appears in the live session list |
| Watched PRs and branches | `<effort>/watch.txt` | Poller state is under `<effort>/.state/` |
| Working notes and session table | `<effort>/ledger.md` from `tars-stinger` | Local notes only. The record is OWEL's ledger |
| Recorded history | OWEL's ledger. Ask OWEL for the last entries for this effort | TARS reads it; TARS never writes it |
| Unsent progress | `<effort>/crew/outbox/` | Spooled entries still waiting for OWEL |
| Open pauses and replacements | `<effort>/crew/handoffs/` | Any packet without a spawned inbound agent is unfinished work |
| Timers and watchers | The host's cron and monitor lists | Re-arm only what the authorized run needs and what is missing |
| Owner decisions and deadline | Manager handoff and owner profile from `tars-stinger` | Do not reset a time allowance after compaction |

## Recovery order after compaction

Do these in order. Do no other work until step 5 is sent.

1. Reinvoke the role skill: load `crew-tars-stinger` and every file it points to.
2. Re-arm the armament: load `tars-stinger` as in the first start. After a compaction also read guides 02 to 06, because guide 08 requires the full set.
3. Read [the crew contract](../../crew-protocol/references/REFERENCE.md).
4. Restore state from the effort folder using the table above, not from the summary. Compare the roster with the live session list and mark any role whose session is gone. Fill [the recovery worksheet](../../crew-protocol/references/templates/recovery-worksheet.md): unit start, deadline, pending questions, what was verified against which candidate. Unknown stays `UNKNOWN`. An action the summary says was under way resumes only if the record shows who approved it.
5. Send OWEL: `LEDGER TARS resume | <effort> | resumed after compaction; roster and watch list restored | evidence: <effort>/crew/roster.md | by: TARS`. If OWEL is unreachable, spool it (see [guide 03](03-report-progress-to-owel.md)).
6. Only then continue: read pending notifications, then pick up the next event.

If the owner says "re-ingest" at any time, run the same six steps. If a step fails (a skill will not load, the effort folder is missing), tell the owner in one line and wait. Do not improvise from the summary.
